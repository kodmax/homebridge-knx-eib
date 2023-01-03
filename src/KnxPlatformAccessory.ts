import { PlatformAccessory, PlatformConfig } from 'homebridge'
import { KnxAccessoryConfig, KnxPlatformConfig } from './config'

type KnxPlatformAccessory = PlatformAccessory<KnxAccessoryConfig>

const isKnxPlatformConfig = (config: PlatformConfig): config is KnxPlatformConfig => {
    return 'knxIpGatewayIp' in config
}

export type { KnxPlatformAccessory }
export { isKnxPlatformConfig }
