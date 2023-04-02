import { DPT_Value_Temp, KnxLink } from 'js-knx'
import { API, Service } from 'homebridge'

const addTargetTemperatureCharacteristic = (api: API, service: Service, knx: KnxLink, options: string[], getTargetTempAddress: string, setTargetTempAddress: string): void => {
    const targetTemperature = service.getCharacteristic(api.hap.Characteristic.TargetTemperature)
    const get = knx.getDatapoint({ DataType: DPT_Value_Temp, address: getTargetTempAddress })
    const set = knx.getDatapoint({ DataType: DPT_Value_Temp, address: setTargetTempAddress })
    const isAbsolute = options.find(opt => opt === 'absolute')

    get.addValueListener(reading => {
        targetTemperature.updateValue(reading.value)
    })

    targetTemperature.onGet(async () => {
        return (await get.read()).value
    })

    targetTemperature.onSet(async temp => {
        if (isAbsolute) {
            await set.write(+temp)
    
        } else {
            const current = (await get.read()).value
            await set.write(+temp - current)
        }
    })

}

export { addTargetTemperatureCharacteristic }
