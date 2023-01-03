import { API, Logging } from 'homebridge'
import { KnxLink } from 'js-knx'

import { AbstractKnxService } from './service/AbstractKnxService'
import { KnxPlatformAccessory } from './KnxPlatformAccessory'
import { PLATFORM_NAME, PLUGIN_NAME } from './settings'
import { KnxAccessoryConfig } from './config'

import { CarbonDioxiditeSensor } from './service/CarbonDioxiditeSensor'
import { HumiditySensor } from './service/HumiditySensor'
import { Lightbulb } from './service/Lightbulb'

class KnxAccessory {
    public readonly displayName: string
    public readonly uuid: string

    private services: AbstractKnxService[] = []

    private getAccessoryUUID (config: KnxAccessoryConfig): string {
        const addresses = config.services.map(service => service.addresses.join(',')).join(',')
        return this.api.hap.uuid.generate(`${PLATFORM_NAME}.${this.config.name}.${addresses}`)
    }

    private getAccessoryDisplayName (config: KnxAccessoryConfig): string {
        return `${config.name} ${config.services[0].name}`
    }

    public constructor (
        private config: KnxAccessoryConfig,
        private logger: Logging,
        private knx: KnxLink,
        private api: API
    ) {
        this.displayName = this.getAccessoryDisplayName(config)
        this.uuid = this.getAccessoryUUID(config)
    }

    public register (): KnxPlatformAccessory {
        const displayName = this.getAccessoryDisplayName(this.config)
        this.logger.debug('registering knx accessory', displayName)
        // eslint-disable-next-line new-cap
        const accessory = new this.api.platformAccessory(displayName, this.uuid) as KnxPlatformAccessory
        accessory.context = this.config

        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory])
        return accessory
    }

    public setupServices (accessory: KnxPlatformAccessory): void {
        for (const service of accessory.context.services) {
            switch (service.id) {

                case 'Lightbulb':
                    this.services.push(new Lightbulb(this.api, this.knx, accessory, service))
                    break

                case 'CarbonDioxideSensor':
                    this.services.push(new CarbonDioxiditeSensor(this.api, this.knx, accessory, service))
                    break

                case 'HumiditySensor':
                    this.services.push(new HumiditySensor(this.api, this.knx, accessory, service))
                    break

                default:
                    throw new Error(`<${service.id}> service not supported`)
            }

        }
    }
}

export { KnxAccessory }
