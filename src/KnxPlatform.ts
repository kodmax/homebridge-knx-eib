import { API, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig, UnknownContext } from 'homebridge'
import { PLATFORM_NAME } from './settings'

class KnxPlatform implements DynamicPlatformPlugin {

    public constructor (logger: Logging, config: PlatformConfig, private api: API) {
        logger.debug(PLATFORM_NAME, JSON.stringify(config))

        api.on('didFinishLaunching', () => {
            this.loadKnxConfiguration()
        })
    }

    public configureAccessory (accessory: PlatformAccessory<UnknownContext>): void {

    }

    private loadKnxConfiguration (): void {

    }
}

export { KnxPlatform }
