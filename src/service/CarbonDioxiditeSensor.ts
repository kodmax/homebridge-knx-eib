import { DPT_Alarm, DPT_Value_AirQuality, KnxLink } from 'js-knx'
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
        addCarbonDioxideDetectedCharacteristic(api, service, this.knx.getDatapoint({
            address: this.config.addresses[0],
            DataType: DPT_Alarm
        }))

        if (this.config.addresses[1]) {
            addCarbonDioxideLevelCharacteristic(api, service, this.knx.getDatapoint({
                address: this.config.addresses[1],
                DataType: DPT_Value_AirQuality
            }))
        }
    }
}

export { CarbonDioxiditeSensor }
