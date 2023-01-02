import {
    API,
    APIEvent,
    DynamicPlatformPlugin,
    Logging,
    PlatformAccessory,
    PlatformConfig,
    UnknownContext
} from 'homebridge'
import { isKnxPlatformConfig, KnxGroup, KnxPlatformConfig } from './config'
import { DPT_Switch, KnxLink } from 'js-knx'
import { PLATFORM_NAME, PLUGIN_NAME } from './settings'

type KnxPlatformAccessory = PlatformAccessory<{ group: KnxGroup}>

class KnxPlatform implements DynamicPlatformPlugin {
    private accessories: Array<KnxPlatformAccessory> = []
    private readonly config: KnxPlatformConfig

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
        const toRegister: Array<PlatformAccessory<UnknownContext>> = []

        for (const group of this.config.groups) {
            const uuid = this.api.hap.uuid.generate(`${PLATFORM_NAME}.${this.config.name}.${group.address}`)
            if (!alreadyRegistered.has(uuid)) {
                // eslint-disable-next-line new-cap
                const accessory = new this.api.platformAccessory(group.name, uuid) as KnxPlatformAccessory
                accessory.context.group = group

                this.accessories.push(accessory)
                toRegister.push(accessory)

                this.logger.debug('will register knx group as accessory', group.address)
            }
        }

        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, toRegister)

        for (const accessory of this.accessories) {
            this.setupAccessory(knx, accessory)
        }
    }

    private setupAccessory (knx: KnxLink, accessory: KnxPlatformAccessory): void {
        const dp = knx.getDatapoint({ address: accessory.context.group.address, DataType: DPT_Switch })

        const service = accessory.getService(this.api.hap.Service.Lightbulb) ??
            accessory.addService(this.api.hap.Service.Lightbulb, accessory.context.group.name)

        const on = service.getCharacteristic(this.api.hap.Characteristic.On)
        on.onGet(async () => {
            return (await dp.read()).value
        })
        on.onSet(async turnOn => {
            if (turnOn) {
                await dp.on()

            } else {
                await dp.off()
            }
        })
    }
}

export { KnxPlatform }
