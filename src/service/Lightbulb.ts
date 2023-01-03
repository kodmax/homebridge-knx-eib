import { DPT_Switch, KnxLink } from 'js-knx'
import { API, Service } from 'homebridge'

import { addOnCharacteristic } from './characteristic/On'
import { KnxServiceConfig } from '../config'
import { KnxPlatformAccessory } from '../KnxPlatformAccessory'

class Lightbulb {
    private getDatapoint (): DPT_Switch {
        return this.knx.getDatapoint({
            address: this.config.addresses[0],
            DataType: DPT_Switch
        })
    }

    private getService (): Service {
        const service = this.api.hap.Service.Lightbulb

        return this.accessory.getService(service) ??
            this.accessory.addService(service, `${this.accessory.context.name} ${this.config.name}`, this.config.name)
    }

    public constructor (
        protected api: API,
        protected knx: KnxLink,
        protected accessory: KnxPlatformAccessory,
        protected config: KnxServiceConfig
    ) {
        const service = this.getService()
        const dp = this.getDatapoint()

        addOnCharacteristic(dp, service, api)
    }
}

export { Lightbulb }
