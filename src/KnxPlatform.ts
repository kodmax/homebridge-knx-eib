import { API, APIEvent, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig, UnknownContext } from 'homebridge'
import { isKnxPlatformConfig, KnxPlatformConfig } from './config'
import { KnxLink } from 'js-knx'

class KnxPlatform implements DynamicPlatformPlugin {
    private readonly config: KnxPlatformConfig

    public constructor (private logger: Logging, config: PlatformConfig, private api: API) {
        if (!isKnxPlatformConfig(config)) {
            throw new Error('Invalid configuration')

        } else {
            this.config = config
        }

        api.on(APIEvent.DID_FINISH_LAUNCHING, async () => {
            const knx = await KnxLink.connect(config.knxIpGatewayIp)
            api.on(APIEvent.SHUTDOWN, async () => {
                await knx.disconnect()

                logger.debug(`KNX IP gateway ${config.knxIpGatewayIp} connection closed.`)
            })

            logger.debug(`KNX IP gateway ${config.knxIpGatewayIp} connection established.`)
        })
    }

    public configureAccessory (accessory: PlatformAccessory<UnknownContext>): void {

    }
}

export { KnxPlatform }
