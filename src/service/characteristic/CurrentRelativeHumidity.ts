import { DPT_Value_Humidity, KnxLink } from 'js-knx'
import { API, Service } from 'homebridge'

const addCurrentRelativeHumidityCharacteristic = (api: API, service: Service, knx: KnxLink, address: string): void => {
    const currentRelativeHumidity = service.getCharacteristic(api.hap.Characteristic.CurrentRelativeHumidity)
    const dp = knx.getDatapoint({ DataType: DPT_Value_Humidity, address })

    dp.addValueListener(reading => {
        currentRelativeHumidity.updateValue(reading.value)
    })

    currentRelativeHumidity.onGet(async () => {
        return (await dp.read()).value
    })
}

export { addCurrentRelativeHumidityCharacteristic }
