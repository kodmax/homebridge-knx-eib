import { API, Service } from 'homebridge'
import { DPT_Alarm } from 'js-knx'

const addCarbonDioxideDetectedCharacteristic = (api: API, service: Service, dp: DPT_Alarm): void => {
    const carbonDioxiditeDetected = service.getCharacteristic(api.hap.Characteristic.CarbonDioxideDetected)

    dp.addValueListener(reading => {
        carbonDioxiditeDetected.updateValue(reading.value)
    })

    carbonDioxiditeDetected.onGet(async () => {
        try {
            return (await dp.read()).value

        } catch (e) {
            return null
        }
    })
}

export { addCarbonDioxideDetectedCharacteristic }
