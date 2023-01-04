import { API, Service } from 'homebridge'
import { DPT_State, KnxLink } from 'js-knx'

const addCurrentHeatingCoolingStateCharacteristic = (api: API, service: Service, knx: KnxLink, heatingStateAddress?: string, coolingStateAddress?: string): void => {
    const targetState = service.getCharacteristic(api.hap.Characteristic.CurrentHeatingCoolingState)
    
    const heatingState = !!heatingStateAddress && knx.getDatapoint({ address: heatingStateAddress, DataType: DPT_State })
    const coolingState = !!coolingStateAddress && knx.getDatapoint({ address: coolingStateAddress, DataType: DPT_State })
    
    if (heatingState || coolingState) {
        targetState.onGet(async () => {
            if (heatingState && (await heatingState.read()).value === DPT_State.ACTIVE) {
                return api.hap.Characteristic.CurrentHeatingCoolingState.HEAT

            } else if (coolingState && (await coolingState.read()).value === DPT_State.ACTIVE) {
                return api.hap.Characteristic.CurrentHeatingCoolingState.COOL

            } else {
                return api.hap.Characteristic.CurrentHeatingCoolingState.OFF
            }
        })    

    } else {
        targetState.onGet(async () => {
            return api.hap.Characteristic.CurrentHeatingCoolingState.OFF
        })    
    }
}

export { addCurrentHeatingCoolingStateCharacteristic }
