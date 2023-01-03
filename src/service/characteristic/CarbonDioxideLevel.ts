import { DPT_Value_AirQuality, KnxLink } from 'js-knx'
import { API, Service } from 'homebridge'

const addCarbonDioxideLevelCharacteristic = (api: API, service: Service, knx: KnxLink, address: string): void => {
    const carbonDioxiditeLevel = service.getCharacteristic(api.hap.Characteristic.CarbonDioxideLevel)
    const dp = knx.getDatapoint({ DataType: DPT_Value_AirQuality, address })

    dp.addValueListener(reading => {
        carbonDioxiditeLevel.updateValue(reading.value)
    })

    carbonDioxiditeLevel.onGet(async () => {
        return (await dp.read()).value
    })
}

export { addCarbonDioxideLevelCharacteristic }
