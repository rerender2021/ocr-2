import { IOcrEngine, IOcrEngineOptions, IOcrResult } from "./base";
import axios from "axios";
import path from "path";
import fs from "fs";
import childProcess from "child_process";

export interface IPaddleOcrResult extends IOcrResult {
	detail: Array<IPaddleOcrItem>;
}

// prettier-ignore
export type IPaddleOcrItem = [
    [
        [number, number], 
        [number, number], 
        [number, number], 
        [number, number]
    ],
    [string, number]
];

export class PaddleOcrEngine implements IOcrEngine {
	private options: IOcrEngineOptions;
	private ocr: childProcess.ChildProcessWithoutNullStreams;

	constructor(options: IOcrEngineOptions) {
		this.options = options;
	}

	async init() {
		console.log("init called");
		const paddleDir = path.resolve(process.cwd(), "paddle-server");
		console.log("paddleDir: ", paddleDir);
		if (fs.existsSync(paddleDir)) {
			return new Promise((resolve, reject) => {
				console.log("paddleDir exists, start ocr server");

				/** caution: use npm run dev:once, or it will throw error "error while attempting to bind on address" */
				const ocr = childProcess.spawn(`./paddle-server/PaddleocrAPI.exe`, [`--lang=ch`, `--model-dir=.\\model`], { windowsHide: true, detached: false /** hide console */ });
				this.ocr = ocr;
				ocr.stdout.on("data", (data) => {
					console.log(`stdout: ${data}`);
					if (data.includes("PaddleocrAPI has been started")) {
						console.log("ocr server started");
						resolve(true);
					}
				});

				ocr.stderr.on("data", (data) => {
					console.error(`stderr: ${data}`);
				});

				ocr.on("close", (code) => {
					console.log(`ocr server exit: ${code}`);
					reject(false);
				});
			});
		}
	}

	async destroy() {
		if (this.ocr) {
			console.log("exit ocr server process");
			process.kill(this.ocr?.pid);
			process.exit();
		}
	}

	async recognize(buffer: Buffer): Promise<IOcrResult> {
		try {
			const response = await axios.get("http://localhost:8000/ping", {});
			console.log(`ping result`, response.data);

			if (response.data !== "pong") {
				return { text: "ocr server is not running" };
			}
		} catch (error) {
			console.log(error);
			return { text: "ocr server is not running" };
		}

		const base64 = buffer.toString("base64");
		console.time("ocr time");
		let text = "";
		try {
			const response = await axios.post("http://localhost:8000/ocr", {
				image: base64,
			});
			const result = response.data.image as Array<IPaddleOcrItem>;
			result.forEach((item, index) => {
				// console.log(item);
				const [box, content] = item;
				text += content[0];
				if (index !== result.length - 1) {
					text += "\n";
				}
			});
		} catch (error) {
			console.log(error.message);
			this.options.onError(error.message);
		}
		console.log(`ocr result:\n`);
		console.log(text);
		console.timeEnd("ocr time");
		return { text };
	}
}
