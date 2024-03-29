import { KnxLink } from 'js-knx'
import { API } from 'homebridge'

import { addCurrentRelativeHumidityCharacteristic } from './characteristic/CurrentRelativeHumidity'
import { KnxPlatformAccessory } from '../KnxPlatformAccessory'
import { KnxServiceConfig } from '../config'
import { AbstractKnxService } from './AbstractKnxService'

class HumiditySensor extends AbstractKnxService {

    public constructor (api: API, knx: KnxLink, accessory: KnxPlatformAccessory, config: KnxServiceConfig) {
        super(api, knx, accessory, config)

        const service = this.getService(this.api.hap.Service.HumiditySensor)
        addCurrentRelativeHumidityCharacteristic(api, service, knx, config.options ?? [], config.addresses[0])
    }
}

export { HumiditySensor }
