import { API, Service } from 'homebridge'

const addTargetHeatingCoolingStateCharacteristic = (api: API, service: Service): void => {
    const targetState = service.getCharacteristic(api.hap.Characteristic.TargetHeatingCoolingState)

    targetState.onGet(async () => {
        return api.hap.Characteristic.TargetHeatingCoolingState.AUTO
    })

    targetState.onSet(async () => {
        // ignore
    })

}

export { addTargetHeatingCoolingStateCharacteristic }
