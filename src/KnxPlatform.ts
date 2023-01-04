import { API, APIEvent, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig, UnknownContext } from 'homebridge'
import { KnxLink } from 'js-knx'

import { KnxPlatformAccessory, isKnxPlatformConfig } from './KnxPlatformAccessory'
import { KnxAccessory } from './KnxAccessory'

import { PLATFORM_NAME, PLUGIN_NAME } from './settings'
import { KnxPlatformConfig } from './config'

class KnxPlatform implements DynamicPlatformPlugin {
    private cachedAccessories: Map<string, KnxPlatformAccessory> = new Map()
    private knxAccessories: Map<string, KnxAccessory> = new Map()
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
        this.cachedAccessories.set(accessory.UUID, accessory as KnxPlatformAccessory)
    }

    private configureAccessories (knx: KnxLink): void {
        for (const config of this.config.accessories) {
            const knxAccessory = new KnxAccessory(config, this.logger, knx, this.api)
            this.knxAccessories.set(knxAccessory.uuid, knxAccessory)
        }

        for (const accessory of this.cachedAccessories.values()) {
            if (!this.knxAccessories.has(accessory.UUID)) {
                this.logger.debug('unregistering unconfigured knx accessory', accessory.displayName)
                this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory])
            }
        }

        for (const knxAccessory of this.knxAccessories.values()) {
            const accessory = this.cachedAccessories.get(knxAccessory.uuid) ?? knxAccessory.register()

            try {
                knxAccessory.setupServices(accessory)

            } catch (e) {
                this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory])
                this.logger.debug('unregistered knx accessory', accessory.displayName)
                throw e
            }
        }
    }
}

export { KnxPlatform }
