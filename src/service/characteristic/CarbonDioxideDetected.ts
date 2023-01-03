import { API, Service } from 'homebridge'
import { DPT_Alarm, KnxLink } from 'js-knx'

const addCarbonDioxideDetectedCharacteristic = (api: API, service: Service, knx: KnxLink, address: string): void => {
    const carbonDioxiditeDetected = service.getCharacteristic(api.hap.Characteristic.CarbonDioxideDetected)
    const dp = knx.getDatapoint({ DataType: DPT_Alarm, address })

    dp.addValueListener(reading => {
        carbonDioxiditeDetected.updateValue(reading.value)
    })

    carbonDioxiditeDetected.onGet(async () => {
        return (await dp.read()).value
    })
}

export { addCarbonDioxideDetectedCharacteristic }
