import * as crypto from "crypto";
import Helper from "./lib/helper";
import VeSyncPurifier from "./veSyncPurifier";
import VeSyncDeviceBase from "./veSyncDeviceBase";
import VeSyncHumidifier from "./veSyncHumidifier";
import {BodyTypes} from "./lib/enum/bodyTypes";
import {ApiCalls} from "./lib/enum/apiCalls";
import VeSyncPurifierLV131 from "./veSyncPurifierLV131";

export default class VeSync {

    private token: string = "";
    private account_id: number = 0;
    private devices: VeSyncDeviceBase[] = [];
    username: string = "";
    password: string = "";
    time_zone: string = 'America/New_York';
    private loggedIn: boolean = false;
    static debugMode: boolean = true;

    public async login(username: string, password: string, isHashedPassword: boolean = false): Promise<boolean> {
        this.username = username;
        this.password = isHashedPassword ? password : this.hashPassword(password);
        let response = await Helper.callApi(this, ApiCalls.LOGIN, 'post', Helper.requestBody(this, BodyTypes.LOGIN))
        try {
            this.account_id = response.result.accountID;
            this.token = response.result.token;
            this.loggedIn = true;
            if (VeSync.debugMode) {
                console.debug(`Account ID: ${response.result.accountID}`);
            }
            await this.getDevices();
        } catch (e) {
            return false;
        }
        return true;
    }

    private hashPassword(password: string) {
        return crypto.createHash('md5').update(password).digest('hex');
    }

    public async getDevices(): Promise<VeSyncDeviceBase[]> {
        if (this.token === "") return [];
        this.devices = [];
        let response = await Helper.callApi(this, ApiCalls.DEVICES, 'post', Helper.requestBody(this, BodyTypes.DEVICE_LIST));
        await this.processDevices(response.result.list);
        return this.devices;
    }

    private processDevices(list: any) {
        for (let deviceRaw of list as any) {
            let device = this.getDeviceObject(deviceRaw);
            if (device === undefined) continue;
            this.devices.push(device);
        }
        if (VeSync.debugMode) console.debug("Total Devices processed: " + this.devices.length)
    }

    private getDeviceObject(deviceRaw: any): VeSyncDeviceBase | undefined {
        let devices = {
            VeSyncHumidifier: [
                'Classic300S', 'LUH-A601S-WUSB',
                'Classic200S',
                'Dual200S', 'LUH-D301S-WUSR', 'LUH-D301S-WJP', 'LUH-D301S-WEU',
                'LV600S', 'LUH-A602S-WUSR', 'LUH-A602S-WUS', 'LUH-A602S-WEUR', 'LUH-A602S-WEU', 'LUH-A602S-WJP'
            ],
            VeSyncPurifier: [
                'Core200S', 'LAP-C201S-AUSR', 'LAP-C202S-WUSR',
                'Core300S', 'LAP-C301S-WJP', 'LAP-C302S-WUSB',
                'Core400S', 'LAP-C401S-WJP', 'LAP-C401S-WUSR', 'LAP-C401S-WAAA',
                'Core600S', 'LAP-C601S-WUS', 'LAP-C601S-WUSR', 'LAP-C601S-WEU'
            ],
            VeSyncPurifierLV131: [
                'LV-PUR131S', 'LV-RH131S'
            ]

        }
        if (devices.VeSyncHumidifier.includes(deviceRaw.deviceType))
            return new VeSyncHumidifier(this, deviceRaw);
        if (devices.VeSyncPurifier.includes(deviceRaw.deviceType))
            return new VeSyncPurifier(this, deviceRaw);
        if (devices.VeSyncPurifierLV131.includes(deviceRaw.deviceType))
            return new VeSyncPurifierLV131(this, deviceRaw);
        return new VeSyncDeviceBase(this, deviceRaw);
    }

    public isLoggedIn(): boolean {
        return this.loggedIn;
    }

    public getAccountID(): number {
        return this.account_id;
    }

    public getToken(): string {
        return this.token;
    }

    public getTimeZone(): string {
        return this.time_zone;
    }

    public getStoredDevice() {
        return this.devices
    }
}
