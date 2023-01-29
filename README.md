# tsvesync

[![MIT Licence](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A TypeScript library to interact with VeSync controlled devices.

## Introduction

tsvesync is a TypeScript library that allows developers to interact with VeSync controlled devices through its APIs. This library aims to provide a simple and easy-to-use interface for developers to control VeSync devices.

## Features
- Interact with VeSync devices through APIs.
- Easy-to-use interface.

## Getting Started

```bash
npm install tsvesync
```

## Usage

```ts
import { VeSync } from 'tsvesync';

let veSync = new VeSync();
await veSync.login(this.username, this.password);
```

## Contributing

Contributions are welcome! If you would like to contribute, please follow the guidelines in [CONTRIBUTING.md](https://github.com/spkesDE/tsvesync/blob/master/CONTRIBUTING.md).

## License

tsvesync is licensed under the MIT license. See [LICENSE](https://github.com/spkesDE/tsvesync/blob/master/LICENSE) for more information.
