<p align="center">
    <img width="200" src="./assets/ocr.png">
</p>

<!-- <h1 align="center">OCR</h1> -->

<div align="center">

[![build](https://github.com/rerender2021/ocr-2/actions/workflows/build.yml/badge.svg?branch=main&event=push)](https://github.com/rerender2021/ocr-2/actions/workflows/build.yml) [![pack](https://github.com/rerender2021/ocr-2/actions/workflows/pack.yml/badge.svg?branch=main&event=push)](https://github.com/rerender2021/ocr-2/actions/workflows/pack.yml)

 </div>
 
# Introduction

This is powered by [Avernakis React](https://qber-soft.github.io/Ave-React-Docs/) & [Paddle OCR](https://github.com/PaddlePaddle/PaddleOCR). 😀

It supports Chinese and English out of box.

# Install

Download it from [Github Release](https://github.com/rerender2021/ocr-2/releases).

# Features

## drag and drop to open

![ocr-cn](./docs/image/ocr-cn.gif)

![ocr-en](./docs/image/ocr-en.gif)

## paste from clipboard or file

- `Ctrl + V`: paste image from clipboard or file

![ocr-clipboard](./docs/image/ocr-clipboard.gif)

![ocr-file](./docs/image/ocr-file.gif)

## copy text to clipboard

- `Ctrl + C`: copy recognized text to clipboard

![ocr-copy-text](./docs/image/ocr-copy-text.gif)

# Dev

```bash
> npm install
> npm run dev
```

This launches the frontend, we need backend to provide OCR API.

Download the paddle ocr server from [PaddleocrAPI](https://github.com/rerender2021/PaddleocrAPI/releases/) and place it at `paddle-server`.

![project dir](./docs/image/project-dir.png)

# Package

1. build the frontend

```bash
> npm run release
```

2. copy `paddle-server` to `bin`

![bin dir](./docs/image/bin-dir.png)

# License

[MIT](./LICENSE)
