# kittik-cursor

![Build Status](https://img.shields.io/travis/kittikjs/cursor.svg)
![Coverage](https://img.shields.io/coveralls/kittikjs/cursor.svg)

![Downloads](https://img.shields.io/npm/dm/kittik-cursor.svg)
![Downloads](https://img.shields.io/npm/dt/kittik-cursor.svg)
![npm version](https://img.shields.io/npm/v/kittik-cursor.svg)
![License](https://img.shields.io/npm/l/kittik-cursor.svg)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![dependencies](https://img.shields.io/david/kittikjs/cursor.svg)
![dev dependencies](https://img.shields.io/david/dev/kittikjs/cursor.svg)

## Demo

| Examples |
| -------- |
| ![kittik-cursor demo](https://cloud.githubusercontent.com/assets/3625244/16379908/89dddd38-3c7c-11e6-883a-c8ad2097be11.gif) |

| Touhou - Bad Apple  | Rick Astley - Never Gonna Give You Up | Casa Linda Apartments Interview "Not Today" |
| ------------------- | ------------------------------------- | ------------------------------------------- |
| [![Touhou - Bad Apple](https://img.youtube.com/vi/_KpDKTihgxY/0.jpg)](https://www.youtube.com/watch?v=_KpDKTihgxY) | [![ Rick Astley - Never Gonna Give You Up ](https://img.youtube.com/vi/JffWhWba2M4/0.jpg)](https://www.youtube.com/watch?v=JffWhWba2M4) | [![Casa Linda Apartments Interview "Not Today"](https://img.youtube.com/vi/ZhN-9Wz97bs/0.jpg)](https://www.youtube.com/watch?v=ZhN-9Wz97bs) |

## Getting Started

Install it via npm:

```shell
npm install kittik-cursor
```

Include in your project:

```javascript
import Cursor from 'kittik-cursor';

const cursor = Cursor.create().reset();
cursor.moveTo(10, 10).write('Hello, World').flush();
```

## API

API declaration you can find [here](./API.md).

## Examples

Examples you can find [here](./examples).

## License

The MIT License (MIT)

Copyright (c) 2015-2016 Eugene Obrezkov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
