import { DPT_Alarm, KnxLink } from 'js-knx'
import { API, Service } from 'homebridge'

import { addCarbonDioxideDetectedCharacteristic } from './characteristic/CarbonDioxideDetected'
import { KnxPlatformAccessory } from '../config'
import { KnxService } from '../KnxPlatform'

class CarbonDioxiditeSensor implements KnxService {
    private getDatapoint (): DPT_Alarm {
        return this.knx.getDatapoint({
            address: this.accessory.context.group.address,
            DataType: DPT_Alarm
        })
    }

    private getService (): Service {
        const service = this.api.hap.Service.CarbonDioxideSensor

        return this.accessory.getService(service) ??
            this.accessory.addService(service, this.accessory.context.group.name)
    }

    public constructor (protected api: API, protected knx: KnxLink, protected accessory: KnxPlatformAccessory) {
        const service = this.getService()
        const dp = this.getDatapoint()

        addCarbonDioxideDetectedCharacteristic(dp, service, api)
    }
}

export { CarbonDioxiditeSensor }
