import { API, APIEvent, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig, UnknownContext } from 'homebridge'
import { KnxLink } from 'js-knx'

import { isKnxPlatformConfig, KnxGroup, KnxPlatformAccessory, KnxPlatformConfig } from './config'
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
        for (const group of this.config.groups) {
            const uuid = this.api.hap.uuid.generate(`${PLATFORM_NAME}.${this.config.name}.${group.address}`)

            if (!alreadyRegistered.has(uuid)) {
                this.registerAccessory(uuid, group)
            }
        }

        for (const accessory of this.accessories) {
            this.services.push(this.setupAccessory(knx, accessory))
        }
    }

    private registerAccessory (uuid: string, group: KnxGroup): KnxPlatformAccessory {
        this.logger.debug('will register knx group as accessory', group.address)
        // eslint-disable-next-line new-cap
        const accessory = new this.api.platformAccessory(group.name, uuid) as KnxPlatformAccessory
        accessory.context.group = group

        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory])
        this.accessories.push(accessory)
        return accessory
    }

    private setupAccessory (knx: KnxLink, accessory: KnxPlatformAccessory): KnxService {
        switch (accessory.context.group.service) {
            case 'Lightbulb':
                return new Lightbulb(this.api, knx, accessory)
            
            case 'CarbonDioxideSensor':
                return new CarbonDioxiditeSensor(this.api, knx, accessory)

            default:
                this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory])
                throw new Error(`<${accessory.context.group.service}> service not supported`)
        }
    }
}

export type { KnxService }
export { KnxPlatform }
