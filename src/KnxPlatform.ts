import { API, APIEvent, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig, UnknownContext } from 'homebridge'
import { KnxLink } from 'js-knx'

import { KnxPlatformAccessory, isKnxPlatformConfig } from './KnxPlatformAccessory'
import { KnxAccessory } from './KnxAccessory'

import { PLATFORM_NAME, PLUGIN_NAME } from './settings'
import { KnxPlatformConfig } from './config'

class KnxPlatform implements DynamicPlatformPlugin {
    private knxAccessories: Map<string, KnxAccessory> = new Map()
    private hbAccessories: Array<KnxPlatformAccessory> = []
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
        this.hbAccessories.push(accessory as KnxPlatformAccessory)
    }

    private configureAccessories (knx: KnxLink): void {
        const alreadyRegistered = new Set(this.hbAccessories.map(acc => acc.UUID))

        for (const config of this.config.accessories) {
            const knxAccessory = new KnxAccessory(config, this.logger, knx, this.api)
            if (!alreadyRegistered.has(knxAccessory.uuid)) {
                knxAccessory.register()
            }

            this.knxAccessories.set(knxAccessory.uuid, knxAccessory)
        }

        for (const accessory of this.hbAccessories) {
            const configuredAccessory = this.knxAccessories.get(accessory.UUID)
            if (configuredAccessory) {
                try {
                    configuredAccessory.setupServices(accessory)

                } catch (e) {
                    this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory])
                    this.logger.debug('unregistered knx accessory', accessory.displayName)
                    throw e
                }

            } else {
                this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory])
                this.logger.debug('unregistered knx accessory', accessory.displayName)
            }
        }
    }
}

export { KnxPlatform }
