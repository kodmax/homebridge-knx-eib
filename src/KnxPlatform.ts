import { API, APIEvent, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig, UnknownContext } from 'homebridge'
import { KnxLink } from 'js-knx'

import { KnxPlatformAccessory, isKnxPlatformConfig } from './KnxPlatformAccessory'
import { KnxAccessoryConfig, KnxPlatformConfig } from './config'
import { PLATFORM_NAME, PLUGIN_NAME } from './settings'

import { CarbonDioxiditeSensor } from './service/CarbonDioxiditeSensor'
import { Lightbulb } from './service/Lightbulb'
import { AbstractKnxService } from './service/AbstractKnxService'

class KnxPlatform implements DynamicPlatformPlugin {
    private accessories: Array<KnxPlatformAccessory> = []
    private services: AbstractKnxService[] = []
    private config: KnxPlatformConfig

    private async connect (): Promise<KnxLink> {
        const link = await KnxLink.connect(this.config.knxIpGatewayIp)
        this.logger.debug(`KNX IP gateway ${this.config.knxIpGatewayIp} connection established.`)
        this.api.on(APIEvent.SHUTDOWN, async () => {
            await link.disconnect()
            this.logger.debug(`KNX IP gateway ${this.config.knxIpGatewayIp} connection closed.`)
        })

        return link
    }

    public constructor (private logger: Logging, config: PlatformConfig, private api: API) {
        if (!isKnxPlatformConfig(config)) {
            throw new Error('Invalid configuration')

        } else {
            this.config = config
        }

        api.on(APIEvent.DID_FINISH_LAUNCHING, async () => {
            this.configureAccessories(await this.connect())
        })
    }

    public configureAccessory (accessory: PlatformAccessory<UnknownContext>): void {
        this.accessories.push(accessory as KnxPlatformAccessory)
    }

    private getAccessoryUUID (config: KnxAccessoryConfig): string {
        const addresses = config.services.map(service => service.addresses.join(',')).join(',')
        return this.api.hap.uuid.generate(`${PLATFORM_NAME}.${this.config.name}.${addresses}`)
    }

    private getAccessoryDisplayName (config: KnxAccessoryConfig): string {
        return `${config.name} ${config.services[0].name}`
    }

    private configureAccessories (knx: KnxLink): void {
        const alreadyRegistered = new Set(this.accessories.map(acc => acc.UUID))
        for (const config of this.config.accessories) {
            const uuid = this.getAccessoryUUID(config)

            if (!alreadyRegistered.has(uuid)) {
                this.registerAccessory(uuid, config)
            }
        }

        const isConfigured = new Set(this.config.accessories.map(config => this.getAccessoryUUID(config)))
        for (const accessory of this.accessories) {
            if (isConfigured.has(accessory.UUID)) {
                try {
                    this.setupAccessory(knx, accessory)

                } catch (e) {
                    this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory])
                    throw e
                }

            } else {
                this.logger.debug('unregistering knx accessory', accessory.displayName)
                this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory])
            }
        }
    }

    private registerAccessory (uuid: string, config: KnxAccessoryConfig): KnxPlatformAccessory {
        const displayName = this.getAccessoryDisplayName(config)
        this.logger.debug('registering knx accessory', displayName)
        // eslint-disable-next-line new-cap
        const accessory = new this.api.platformAccessory(displayName, uuid) as KnxPlatformAccessory
        accessory.context = config

        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory])
        this.accessories.push(accessory)
        return accessory
    }

    private setupAccessory (knx: KnxLink, accessory: KnxPlatformAccessory): void {
        for (const service of accessory.context.services) {
            switch (service.id) {

                case 'Lightbulb':
                    this.services.push(new Lightbulb(this.api, knx, accessory, service))
                    break

                case 'CarbonDioxideSensor':
                    this.services.push(new CarbonDioxiditeSensor(this.api, knx, accessory, service))
                    break

                default:
                    throw new Error(`<${service.id}> service not supported`)
            }

        }
    }
}

export { KnxPlatform }
