import { KnxLink } from 'js-knx'
import { API, Service, WithUUID } from 'homebridge'

import { KnxServiceConfig } from '../config'
import { KnxPlatformAccessory } from '../KnxPlatformAccessory'

abstract class AbstractKnxService {

    protected getService (service: WithUUID<typeof Service>): Service {
        return this.accessory.getService(service) ??
            this.accessory.addService(service, `${this.accessory.context.name} ${this.config.name}`, this.config.name)
    }

    public constructor (
        protected api: API,
        protected knx: KnxLink,
        protected accessory: KnxPlatformAccessory,
        protected config: KnxServiceConfig
    ) {
        //
    }
}

export { AbstractKnxService }
