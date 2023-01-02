import { PlatformConfig } from 'homebridge'

type KnxGroup = {
    name: string
    address: string
    datapointType: string
}

interface KnxPlatformConfig extends PlatformConfig {
    knxIpGatewayIp: string
    groups: Array<KnxGroup>
}

const isKnxPlatformConfig = (config: PlatformConfig): config is KnxPlatformConfig => {
    return 'knxIpGatewayIp' in config
}

export { KnxPlatformConfig, KnxGroup, isKnxPlatformConfig }
