import { API, Service } from 'homebridge'
import { DPT_Switch, KnxLink } from 'js-knx'

const addActiveCharacteristic = (api: API, service: Service, knx: KnxLink, transmitGroupAddress: string, stateGroupAddress?: string): void => {
    const active = service.getCharacteristic(api.hap.Characteristic.Active)

    const transmit = knx.getDatapoint({
        address: transmitGroupAddress,
        DataType: DPT_Switch
    })

    const state = !stateGroupAddress ? transmit : knx.getDatapoint({
        address: stateGroupAddress,
        DataType: DPT_Switch
    })

    state.addValueListener(reading => {
        active.updateValue(reading.value)
    })

    active.onGet(async () => {
        return (await state.read()).value
    })

    active.onSet(async turnOn => {
        await transmit.write(turnOn ? 1 : 0)
    })
}

export { addActiveCharacteristic }
