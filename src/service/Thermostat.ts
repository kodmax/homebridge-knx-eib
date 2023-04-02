import { KnxLink } from 'js-knx'
import { API } from 'homebridge'

import { KnxPlatformAccessory } from '../KnxPlatformAccessory'
import { KnxServiceConfig } from '../config'
import { AbstractKnxService } from './AbstractKnxService'

import { addTemperatureDisplayUnitsCharacteristic } from './characteristic/TemperatureDisplayUnits'
import { addTargetHeatingCoolingStateCharacteristic } from './characteristic/TargetHeatingCoolingState'
import { addCurrentHeatingCoolingStateCharacteristic } from './characteristic/CurrentHeatingCoolingState'
import { addCurrentTemperatureCharacteristic } from './characteristic/CurrentTemperature'
import { addTargetTemperatureCharacteristic } from './characteristic/TargetTemperature'

class Thermostat extends AbstractKnxService {

    public constructor (api: API, knx: KnxLink, accessory: KnxPlatformAccessory, config: KnxServiceConfig) {
        super(api, knx, accessory, config)

        const service = this.getService(this.api.hap.Service.Thermostat)

        addTargetTemperatureCharacteristic(api, service, knx, config.options ?? [], config.addresses[0], config.addresses[1])
        addCurrentTemperatureCharacteristic(api, service, knx, config.addresses[2])

        addCurrentHeatingCoolingStateCharacteristic(api, service, knx, config.addresses[3], config.addresses[4])
        addTargetHeatingCoolingStateCharacteristic(api, service)
        addTemperatureDisplayUnitsCharacteristic(api, service)
    }
}

export { Thermostat }
