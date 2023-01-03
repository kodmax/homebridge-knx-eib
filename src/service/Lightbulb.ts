import { DPT_Switch, KnxLink } from 'js-knx'
import { API } from 'homebridge'

import { KnxPlatformAccessory } from '../KnxPlatformAccessory'
import { addOnCharacteristic } from './characteristic/On'
import { KnxServiceConfig } from '../config'
import { AbstractKnxService } from './AbstractKnxService'

class Lightbulb extends AbstractKnxService {

    public constructor (api: API, knx: KnxLink, accessory: KnxPlatformAccessory, config: KnxServiceConfig) {
        super(api, knx, accessory, config)

        const service = this.getService(this.api.hap.Service.Lightbulb)
        addOnCharacteristic(api, service, this.knx.getDatapoint({
            address: this.config.addresses[0],
            DataType: DPT_Switch
        }))
    }
}

export { Lightbulb }
