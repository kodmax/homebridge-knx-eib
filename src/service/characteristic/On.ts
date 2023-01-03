import { API, Service } from 'homebridge'
import { DPT_Switch, KnxLink } from 'js-knx'

const addOnCharacteristic = (api: API, service: Service, knx: KnxLink, transmitGroupAddress: string, stateGroupAddress?: string): void => {
    const on = service.getCharacteristic(api.hap.Characteristic.On)

    const transmit = knx.getDatapoint({
        address: transmitGroupAddress,
        DataType: DPT_Switch
    })

    const state = !stateGroupAddress ? transmit : knx.getDatapoint({
        address: stateGroupAddress,
        DataType: DPT_Switch
    })

    state.addValueListener(reading => {
        on.updateValue(reading.value)
    })

    on.onGet(async () => {
        try {
            return (await state.read()).value

        } catch (e) {
            return null
        }
    })

    on.onSet(async turnOn => {
        await transmit.write(turnOn ? 1 : 0)
    })
}

export { addOnCharacteristic }
