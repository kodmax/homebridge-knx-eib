import { PlatformAccessory, PlatformConfig } from 'homebridge'
import type { Service } from 'homebridge'

type KnxGroup = {
    name: string
    address: string
    service: Exclude<keyof typeof Service, 'prototype'>
}

interface KnxPlatformConfig extends PlatformConfig {
    knxIpGatewayIp: string
    groups: Array<KnxGroup>
}

type KnxPlatformAccessory = PlatformAccessory<{
    group: KnxGroup
}>

const isKnxPlatformConfig = (config: PlatformConfig): config is KnxPlatformConfig => {
    return 'knxIpGatewayIp' in config
}

export type { KnxPlatformConfig, KnxGroup, KnxPlatformAccessory }
export { isKnxPlatformConfig }
