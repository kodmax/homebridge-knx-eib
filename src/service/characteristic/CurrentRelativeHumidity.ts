import { DPT_Value_Humidity } from 'js-knx'
import { API, Service } from 'homebridge'

const addCurrentRelativeHumidityCharacteristic = (api: API, service: Service, dp: DPT_Value_Humidity): void => {
    const currentRelativeHumidity = service.getCharacteristic(api.hap.Characteristic.CurrentRelativeHumidity)

    dp.addValueListener(reading => {
        currentRelativeHumidity.updateValue(reading.value)
    })

    currentRelativeHumidity.onGet(async () => {
        return (await dp.read()).value
    })

    currentRelativeHumidity.onSet(async turnOn => {
        await dp.write(turnOn ? 1 : 0)
    })
}

export { addCurrentRelativeHumidityCharacteristic }
