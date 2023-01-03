import { KnxLink } from 'js-knx'
import { API } from 'homebridge'

import { addCurrentTemperatureCharacteristic } from './characteristic/CurrentTemperature'
import { KnxPlatformAccessory } from '../KnxPlatformAccessory'
import { KnxServiceConfig } from '../config'
import { AbstractKnxService } from './AbstractKnxService'

class TemperatureSensor extends AbstractKnxService {

    public constructor (api: API, knx: KnxLink, accessory: KnxPlatformAccessory, config: KnxServiceConfig) {
        super(api, knx, accessory, config)

        const service = this.getService(this.api.hap.Service.TemperatureSensor)
        addCurrentTemperatureCharacteristic(api, service, knx, this.config.addresses[0])
    }
}

export { TemperatureSensor }
