import { B1 } from 'js-knx/dist/dpts/formats'
import { API, Service } from 'homebridge'

const addOnCharacteristic = (dp: B1, service: Service, api: API): void => {
    const on = service.getCharacteristic(api.hap.Characteristic.On)

    dp.addValueListener(reading => {
        on.updateValue(reading.value)
    })

    on.onGet(async () => {
        return (await dp.read()).value
    })

    on.onSet(async turnOn => {
        await dp.write(turnOn ? 1 : 0)
    })
}

export { addOnCharacteristic }
