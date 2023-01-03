import { B1 } from 'js-knx/dist/dpts/formats'
import { API, Service } from 'homebridge'

const addCarbonDioxideDetectedCharacteristic = (dp: B1, service: Service, api: API): void => {
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
