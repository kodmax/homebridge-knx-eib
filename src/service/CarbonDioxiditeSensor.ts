import { KnxLink } from 'js-knx'
import { API } from 'homebridge'

import { addCarbonDioxideDetectedCharacteristic } from './characteristic/CarbonDioxideDetected'
import { addCarbonDioxideLevelCharacteristic } from './characteristic/CarbonDioxideLevel'
import { KnxPlatformAccessory } from '../KnxPlatformAccessory'
import { KnxServiceConfig } from '../config'
import { AbstractKnxService } from './AbstractKnxService'

class CarbonDioxiditeSensor extends AbstractKnxService {

    public constructor (api: API, knx: KnxLink, accessory: KnxPlatformAccessory, config: KnxServiceConfig) {
        super(api, knx, accessory, config)

        const service = this.getService(this.api.hap.Service.CarbonDioxideSensor)
        addCarbonDioxideDetectedCharacteristic(api, service, knx, this.config.addresses[0])

        if (this.config.addresses[1]) {
            addCarbonDioxideLevelCharacteristic(api, service, knx, this.config.addresses[1])
        }
    }
}

export { CarbonDioxiditeSensor }
