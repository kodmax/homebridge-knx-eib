import { API, Service } from 'homebridge'
import { DPT_Alarm } from 'js-knx'

const addCarbonDioxideDetectedCharacteristic = (api: API, service: Service, dp: DPT_Alarm): void => {
    const carbonDioxiditeDetected = service.getCharacteristic(api.hap.Characteristic.CarbonDioxideDetected)

    dp.addValueListener(reading => {
        carbonDioxiditeDetected.updateValue(reading.value)
    })

    carbonDioxiditeDetected.onGet(async () => {
        return (await dp.read()).value
    })

    carbonDioxiditeDetected.onSet(async turnOn => {
        await dp.write(turnOn ? 1 : 0)
    })
}

export { addCarbonDioxideDetectedCharacteristic }
