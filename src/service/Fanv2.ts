import { KnxLink } from 'js-knx'
import { API } from 'homebridge'

import { KnxPlatformAccessory } from '../KnxPlatformAccessory'
import { KnxServiceConfig } from '../config'
import { AbstractKnxService } from './AbstractKnxService'
import { addActiveCharacteristic } from './characteristic/Active'

class Fanv2 extends AbstractKnxService {

    public constructor (api: API, knx: KnxLink, accessory: KnxPlatformAccessory, config: KnxServiceConfig) {
        super(api, knx, accessory, config)

        const service = this.getService(this.api.hap.Service.Fanv2)
        addActiveCharacteristic(api, service, knx, config.addresses[0], config.addresses[1])
    }
}

export { Fanv2 }
