import { DPT_Value_AirQuality } from 'js-knx'
import { API, Service } from 'homebridge'

const addCarbonDioxideLevelCharacteristic = (api: API, service: Service, dp: DPT_Value_AirQuality): void => {
    const carbonDioxiditeLevel = service.getCharacteristic(api.hap.Characteristic.CarbonDioxideLevel)

    dp.addValueListener(reading => {
        carbonDioxiditeLevel.updateValue(reading.value)
    })

    carbonDioxiditeLevel.onGet(async () => {
        try {
            return (await dp.read()).value

        } catch (e) {
            return null
        }
    })
}

export { addCarbonDioxideLevelCharacteristic }
