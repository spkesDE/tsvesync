import Helper from "./lib/helper";
import VeSyncDeviceBase from "./veSyncDeviceBase";
import VeSync from "./veSync";

export default class VeSyncPurifier extends VeSyncDeviceBase {

    //region Device Features
    Device_Features: { [key: string]: any } = {
        'Core200S': {
            module: 'VeSyncAirBypass',
            models: ['Core200S', 'LAP-C201S-AUSR', 'LAP-C202S-WUSR'],
            modes: ['sleep', 'off', 'manual'],
            features: [],
            levels: [1, 2, 3],
            method: ['getPurifierStatus', 'setSwitch', 'setNightLight',
                'setLevel', 'setPurifierMode', 'setDisplay',
                'setChildLock', 'setIndicatorLight']
        },
        'Core300S': {
            module: 'VeSyncAirBypass',
            models: ['Core300S', 'LAP-C301S-WJP', 'LAP-C302S-WUSB'],
            modes: ['sleep', 'off', 'auto', 'manual'],
            features: ['air_quality'],
            levels: [1, 2, 3, 4, 5],
            method: ['getPurifierStatus', 'setSwitch', 'setNightLight',
                'setLevel', 'setPurifierMode', 'setDisplay',
                'setChildLock', 'setIndicatorLight']
        },
        'Core400S': {
            module: 'VeSyncAirBypass',
            models: ['Core400S',
                'LAP-C401S-WJP',
                'LAP-C401S-WUSR',
                'LAP-C401S-WAAA'],
            modes: ['sleep', 'off', 'auto', 'manual'],
            features: ['air_quality'],
            levels: [1, 2, 3, 4, 5],
            method: ['getPurifierStatus', 'setSwitch', 'setNightLight',
                'setLevel', 'setPurifierMode', 'setDisplay',
                'setChildLock', 'setIndicatorLight']
        },
        'Core600S': {
            module: 'VeSyncAirBypass',
            models: ['Core600S',
                'LAP-C601S-WUS',
                'LAP-C601S-WUSR',
                'LAP-C601S-WEU'],
            modes: ['sleep', 'off', 'auto', 'manual'],
            features: ['air_quality'],
            levels: [1, 2, 3, 4, 5],
            method: ['getPurifierStatus', 'setSwitch', 'setNightLight',
                'setLevel', 'setPurifierMode', 'setDisplay',
                'setChildLock', 'setIndicatorLight']
        },
        'LV-PUR131S': {
            module: 'VeSyncAir131',
            models: ['LV-PUR131S', 'LV-RH131S'],
            features: ['air_quality'],
            method: ['getPurifierStatus', 'setSwitch', 'setNightLight',
                'setLevel', 'setPurifierMode', 'setDisplay',
                'setChildLock', 'setIndicatorLight']
        },
    }
    //endregion
    debugMode: boolean = true
    enabled: boolean = false;
    filter_life: number = 100;
    mode: string = "off";
    level: number = 1;
    display: boolean = true;
    child_lock: boolean = false;
    night_light: string = 'off';
    air_quality: number = 0;
    air_quality_value: number = 0;

    constructor(api: VeSync, device: any) {
        super(api, device);
        this.getStatus().catch(() => {
        });
    }

    /* turn on or off the device */
    public async toggleSwitch(toggle: boolean): Promise<string> {
        return new Promise((resolve, reject) => {
            let body = {
                ...Helper.bypassBodyV2(this.api),
                cid: this.cid,
                configModule: this.configModule,
                payload: Helper.createPayload(this, 'setSwitch', {enabled: toggle, id: 0}),
            }
            let result = Helper.callApi(this.api,
                ApiCalls.BYPASS_V2,
                'post', body, Helper.bypassHeader());
            result.then(result => {
                if (VeSync.debugMode) console.log(result)
                if (!this.validResponse(result)) return reject(new Error(result.msg ?? result))
                this.deviceStatus = toggle ? 'on' : "off";
                return resolve(this.deviceStatus);
            });
        });
    }

    public async on() {
        return this.toggleSwitch(true);
    }

    public async off() {
        return this.toggleSwitch(false);
    }

    /* Set mode to manual or sleep. */
    public async setMode(mode: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.getDeviceFeatures()?.modes.includes(mode) ?? false) return reject(this.deviceType + ' don\'t accept mode: ' + mode);
            if (this.extension.mode === mode) return;
            let payload = Helper.createPayload(this, 'setPurifierMode', {mode: mode})
            if (mode === "manual")
                payload = Helper.createPayload(this, 'setLevel', {level: 1, id: 0, type: 'wind'});
            let body = {
                ...Helper.bypassBodyV2(this.api),
                cid: this.cid,
                configModule: this.configModule,
                payload: payload,
            }
            let result = Helper.callApi(this.api,
                ApiCalls.BYPASS_V2,
                'post', body, Helper.bypassHeader());
            return result.then(result => {
                if (VeSync.debugMode) console.log(result)
                if (!this.validResponse(result)) reject(new Error(result.msg ?? result))
                this.mode = mode;
                return resolve(mode);
            });
        });
    }

    /* Set fan speed. */
    public setFanSpeed(level: number): Promise<string | number> {
        return new Promise((resolve, reject) => {
            if (!this.getDeviceFeatures()?.levels.includes(level) ?? false) return reject(this.deviceType + ' don\'t accept level: ' + level);
            if (this.extension.fanSpeedLevel === level) return;
            let body = {
                ...Helper.bypassBodyV2(this.api),
                cid: this.cid,
                configModule: this.configModule,
                payload: Helper.createPayload(this, 'setLevel', {level: level, id: 0, type: 'wind'}),
            }
            let result = Helper.callApi(this.api,
                ApiCalls.BYPASS_V2,
                'post', body, Helper.bypassHeader());
            result.then(result => {
                if (VeSync.debugMode) console.log(result)
                if (!this.validResponse(result)) return reject(new Error(result.msg ?? result))
                this.extension.fanSpeedLevel = level;
                this.deviceStatus = 'on';
                this.mode = "manual";
                return resolve(level);
            });
        });
    }

    /* Set child lock */
    public setChildLock(mode: boolean): Promise<string | boolean> {
        return new Promise((resolve, reject) => {
            let body = {
                ...Helper.bypassBodyV2(this.api),
                cid: this.cid,
                configModule: this.configModule,
                payload: Helper.createPayload(this, 'setChildLock', {child_lock: mode}),
            }
            let result = Helper.callApi(this.api,
                ApiCalls.BYPASS_V2,
                'post', body, Helper.bypassHeader());
            result.then(result => {
                if (VeSync.debugMode) console.log(result)
                if (!this.validResponse(result)) return reject(new Error(result.msg ?? result))
                this.child_lock = mode;
                return resolve(mode);
            });
        });
    }

    /* Getting Device Status */
    public getStatus(): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = {
                ...Helper.bypassBodyV2(this.api),
                cid: this.cid,
                configModule: this.configModule,
                payload: Helper.createPayload(this, 'getPurifierStatus', {}),
            }
            let result = Helper.callApi(this.api, ApiCalls.BYPASS_V2, 'post', body, Helper.bypassHeader());
            result.then(result => {
                if (VeSync.debugMode) console.log(result);
                if (!this.validResponse(result)) return reject(new Error(result.msg ?? result));
                this.enabled = result.result.result.enabled ?? false;
                this.filter_life = result.result.result.filter_life ?? 0;
                this.mode = result.result.result.mode ?? "off";
                this.level = result.result.result.level ?? "0";
                this.display = result.result.result.display ?? false;
                this.child_lock = result.result.result.child_lock ?? false;
                this.night_light = result.result.result.night_light ?? false;
                if (this.getDeviceFeatures().features.includes('air_quality')) {
                    this.air_quality = result.result.result.air_quality ?? 0;
                    this.air_quality_value = result.result.result.air_quality_value ?? 0;
                }
                return resolve(true);
            })
        });
    }

    /* Toggle display on/off. */
    public setDisplay(state: boolean): Promise<boolean | string> {
        return new Promise((resolve, reject) => {
            let body = {
                ...Helper.bypassBodyV2(this.api),
                cid: this.cid,
                configModule: this.configModule,
                payload: Helper.createPayload(this, 'setDisplay', {state: state}),
            }
            let result = Helper.callApi(this.api, ApiCalls.BYPASS_V2, 'post', body, Helper.bypassHeader());
            result.then(result => {
                if (VeSync.debugMode) console.log(result)
                if (!this.validResponse(result)) return reject(new Error(result.msg ?? result))
                this.display = state;
                return resolve(state);
            });
        });
    }

    /* Toggle display on/off. */
    public setNightLight(mode: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (mode.toLowerCase() !== 'on'
                && mode.toLowerCase() !== 'off'
                && mode.toLowerCase() !== 'dim')
                return reject(Error(this.deviceType + ' don\'t accept setNightLight: ' + mode));
            let body = {
                ...Helper.bypassBodyV2(this.api),
                cid: this.cid,
                configModule: this.configModule,
                payload: Helper.createPayload(this, 'setNightLight', {night_light: mode.toLowerCase()}),
            }
            let result = Helper.callApi(this.api, ApiCalls.BYPASS_V2, 'post', body, Helper.bypassHeader());
            result.then(result => {
                if (VeSync.debugMode) console.log(result)
                if (!this.validResponse(result)) return reject(new Error(result.msg ?? result))
                this.night_light = mode;
                return resolve(mode);
            });
        });
    }
}
