import { DPT_Switch, KnxLink } from 'js-knx'
import { API, Service } from 'homebridge'

import { addOnCharacteristic } from './characteristic/On'
import { KnxPlatformAccessory } from '../config'
import { KnxService } from '../KnxPlatform'

class Lightbulb implements KnxService {
    private getDatapoint (): DPT_Switch {
        return this.knx.getDatapoint({
            address: this.accessory.context.knx.addresses[0],
            DataType: DPT_Switch
        })
    }

    private getService (): Service {
        const service = this.api.hap.Service.Lightbulb

        return this.accessory.getService(service) ??
            this.accessory.addService(service, this.accessory.context.knx.name)
    }

    public constructor (protected api: API, protected knx: KnxLink, protected accessory: KnxPlatformAccessory) {
        const service = this.getService()
        const dp = this.getDatapoint()

        addOnCharacteristic(dp, service, api)
    }
}

export { Lightbulb }
