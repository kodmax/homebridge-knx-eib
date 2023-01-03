import { DPT_Value_Temp, KnxLink } from 'js-knx'
import { API, Service } from 'homebridge'

const addCurrentTemperatureCharacteristic = (api: API, service: Service, knx: KnxLink, address: string): void => {
    const currentTemperature = service.getCharacteristic(api.hap.Characteristic.CurrentTemperature)
    const dp = knx.getDatapoint({ DataType: DPT_Value_Temp, address })

    dp.addValueListener(reading => {
        currentTemperature.updateValue(reading.value)
    })

    currentTemperature.onGet(async () => {
        return (await dp.read()).value
    })
}

export { addCurrentTemperatureCharacteristic }
