import { DPT_Alarm, KnxLink } from 'js-knx'
import { API, Service } from 'homebridge'

import { addCarbonDioxideDetectedCharacteristic } from './characteristic/CarbonDioxideDetected'
import { KnxServiceConfig } from '../config'
import { KnxPlatformAccessory } from '../KnxPlatformAccessory'

class CarbonDioxiditeSensor {
    private getDatapoint (): DPT_Alarm {
        return this.knx.getDatapoint({
            address: this.config.addresses[0],
            DataType: DPT_Alarm
        })
    }

    private getService (): Service {
        const service = this.api.hap.Service.CarbonDioxideSensor

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

        addCarbonDioxideDetectedCharacteristic(dp, service, api)
    }
}

export { CarbonDioxiditeSensor }
