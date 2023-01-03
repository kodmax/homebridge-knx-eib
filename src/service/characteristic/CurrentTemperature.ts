import { DPT_Value_Temp } from 'js-knx'
import { API, Service } from 'homebridge'

const addCurrentTemperatureCharacteristic = (api: API, service: Service, dp: DPT_Value_Temp): void => {
    const currentTemperature = service.getCharacteristic(api.hap.Characteristic.CurrentTemperature)

    dp.addValueListener(reading => {
        currentTemperature.updateValue(reading.value)
    })

    currentTemperature.onGet(async () => {
        return (await dp.read()).value
    })
}

export { addCurrentTemperatureCharacteristic }
