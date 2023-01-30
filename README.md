# tsvesync

[![MIT Licence](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)  [![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://github.com/Naereen/badges/) [![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://typescriptlang.org) 

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

### Login
```ts
import { VeSync } from 'tsvesync';

let veSync = new VeSync();
await veSync.login(this.username, this.password);

/*
 * If the password is already saved as a MD5-hex Hash you can use the following
 * public async login(username: string, password: string, isHashedPassword: boolean = false)
 */
await veSync.login(this.username, this.password, true);
```

### Getting Devices

```ts
import {VeSync} from 'tsvesync';
import VeSyncPurifier from "tsvesync/veSyncPurifier";

/*
 * Will return a list of devices as VeSyncDeviceBase objects. 
 * Use instranceof to filter or other methods like matching its uuid
 */
let devices = await veSync.getDevices();
devices.forEach(device => {
    if (device.isOn()) {
        console.log(device.deviceName + " is online! :)");
    }
    if (device.isOn() && device instanceof VeSyncPurifier){
        device.setFanSpeed(3);
    }
})
```
## Devices

The devices listed below are supported by the classes mentioned below.
Untested devices are marked by a *.

#### [VeSyncPurifier](veSyncPurifier.ts)
```
Core200S, Core300S, Core400S, Core600S*
```
#### [VeSyncPurifierLV131](veSyncPurifierLV131.ts)
```
LV-PUR131S*
```
#### [VeSyncHumidifier](veSyncHumidifier.ts)
```
Classic200S, Classic300S, Dual200S, LV600S*
```

## Contributing

Contributions are welcome! If you would like to contribute, please follow the guidelines in [CONTRIBUTING.md](https://github.com/spkesDE/tsvesync/blob/master/CONTRIBUTING.md).

## License

tsvesync is licensed under the MIT license. See [LICENSE](https://github.com/spkesDE/tsvesync/blob/master/LICENSE) for more information.
