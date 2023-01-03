import { API, Service } from 'homebridge'
import { DPT_Switch } from 'js-knx'

const addOnCharacteristic = (api: API, service: Service, dp: DPT_Switch): void => {
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
