import { IOcrEngine, IOcrEngineOptions, IOcrResult } from "./base";
import axios from "axios";

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

	constructor(options: IOcrEngineOptions) {
		this.options = options;
	}

	async init() {}

	async destroy() {}

	async recognize(buffer: Buffer): Promise<IOcrResult> {
		const base64 = buffer.toString("base64");
		console.time("ocr time");
		let text = "";
		try {
			const response = await axios.post("http://localhost:8000/ocr", {
				image: base64,
			});
			const result = response.data.image as Array<IPaddleOcrItem>;
			result.forEach((item) => {
				// console.log(item);
				const [box, content] = item;
				text += content[0];
				text += "\n";
			});
		} catch (error) {
			console.log(error);
			this.options.onError(error.message);
		}
		console.log(`ocr result:\n`);
		console.log(text);
		console.timeEnd("ocr time");
		return { text };
	}
}
