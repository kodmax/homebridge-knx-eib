import { DPT_Generic_F32, DPT_Value_Humidity, KnxLink } from 'js-knx'
import { API, Service } from 'homebridge'

const addCurrentRelativeHumidityCharacteristic = (api: API, service: Service, knx: KnxLink, f16Address: string, f32Address: string): void => {
    const currentRelativeHumidity = service.getCharacteristic(api.hap.Characteristic.CurrentRelativeHumidity)
    const dp = f32Address
        ? knx.getDatapoint({ DataType: DPT_Generic_F32, address: f32Address })
        : knx.getDatapoint({ DataType: DPT_Value_Humidity, address: f16Address })

    dp.addValueListener(reading => {
        currentRelativeHumidity.updateValue(reading.value)
    })

    currentRelativeHumidity.onGet(async () => {
        return (await dp.read()).value
    })
}

export { addCurrentRelativeHumidityCharacteristic }
