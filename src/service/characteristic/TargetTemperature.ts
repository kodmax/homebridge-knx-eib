import { DPT_Value_Temp, KnxLink } from 'js-knx'
import { API, Service } from 'homebridge'

const addTargetTemperatureCharacteristic = (api: API, service: Service, knx: KnxLink, getTargetTempAddress: string, setTargetTempAddress: string): void => {
    const targetTemperature = service.getCharacteristic(api.hap.Characteristic.TargetTemperature)
    const get = knx.getDatapoint({ DataType: DPT_Value_Temp, address: getTargetTempAddress })
    const set = knx.getDatapoint({ DataType: DPT_Value_Temp, address: setTargetTempAddress })

    get.addValueListener(reading => {
        targetTemperature.updateValue(reading.value)
    })

    targetTemperature.onGet(async () => {
        return (await get.read()).value
    })

    targetTemperature.onSet(async temp => {
        const current = (await get.read()).value
        await set.write(+temp - current)
    })

}

export { addTargetTemperatureCharacteristic }
