import { API, Service } from 'homebridge'

const addTemperatureDisplayUnitsCharacteristic = (api: API, service: Service): void => {
    const displayUnits = service.getCharacteristic(api.hap.Characteristic.TemperatureDisplayUnits)

    displayUnits.onGet(async () => {
        return api.hap.Characteristic.TemperatureDisplayUnits.CELSIUS
    })

    displayUnits.onSet(async () => {
        // ignore
    })

}

export { addTemperatureDisplayUnitsCharacteristic }
