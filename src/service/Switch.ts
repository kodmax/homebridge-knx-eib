import { KnxLink } from 'js-knx'
import { API } from 'homebridge'

import { KnxPlatformAccessory } from '../KnxPlatformAccessory'
import { addOnCharacteristic } from './characteristic/On'
import { KnxServiceConfig } from '../config'
import { AbstractKnxService } from './AbstractKnxService'

class Switch extends AbstractKnxService {

    public constructor (api: API, knx: KnxLink, accessory: KnxPlatformAccessory, config: KnxServiceConfig) {
        super(api, knx, accessory, config)

        const service = this.getService(this.api.hap.Service.Switch)
        addOnCharacteristic(api, service, knx, config.addresses[0], config.addresses[1])
    }
}

export { Switch }
