import { API, Service } from 'homebridge'

const addCurrentHeatingCoolingStateCharacteristic = (api: API, service: Service): void => {
    const targetState = service.getCharacteristic(api.hap.Characteristic.CurrentHeatingCoolingState)

    targetState.onGet(async () => {
        return api.hap.Characteristic.CurrentHeatingCoolingState.OFF
    })
}

export { addCurrentHeatingCoolingStateCharacteristic }
