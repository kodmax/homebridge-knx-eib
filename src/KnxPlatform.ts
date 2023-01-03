import { API, APIEvent, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig, UnknownContext } from 'homebridge'
import { KnxLink } from 'js-knx'

import { isKnxPlatformConfig, KnxAccessory, KnxPlatformAccessory, KnxPlatformConfig } from './config'
import { PLATFORM_NAME, PLUGIN_NAME } from './settings'

import { CarbonDioxiditeSensor } from './service/CarbonDioxiditeSensor'
import { Lightbulb } from './service/Lightbulb'

interface KnxService {

}

class KnxPlatform implements DynamicPlatformPlugin {
    private accessories: Array<KnxPlatformAccessory> = []
    private services: KnxService[] = []
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

    private configureAccessories (knx: KnxLink): void {
        const alreadyRegistered = new Set(this.accessories.map(acc => acc.UUID))
        for (const knxAccessory of this.config.accessories) {
            const uuid = this.api.hap.uuid.generate(`${PLATFORM_NAME}.${this.config.name}.${knxAccessory.addresses[0]}`)

            if (!alreadyRegistered.has(uuid)) {
                this.registerAccessory(uuid, knxAccessory)
            }
        }

        for (const accessory of this.accessories) {
            try {
                this.services.push(this.setupAccessory(knx, accessory))

            } catch (e) {
                this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory])
                throw e
            }
        }
    }

    private registerAccessory (uuid: string, knxAccessory: KnxAccessory): KnxPlatformAccessory {
        this.logger.debug('will register knx group as accessory', knxAccessory.addresses.join(', '))
        // eslint-disable-next-line new-cap
        const accessory = new this.api.platformAccessory(knxAccessory.name, uuid) as KnxPlatformAccessory
        accessory.context.knx = knxAccessory

        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory])
        this.accessories.push(accessory)
        return accessory
    }

    private setupAccessory (knx: KnxLink, accessory: KnxPlatformAccessory): KnxService {
        switch (accessory.context.knx.service) {
            case 'Lightbulb':
                return new Lightbulb(this.api, knx, accessory)

            case 'CarbonDioxideSensor':
                return new CarbonDioxiditeSensor(this.api, knx, accessory)

            default:
                throw new Error(`<${accessory.context.knx.service}> service not supported`)
        }
    }
}

export type { KnxService }
export { KnxPlatform }
