import { PlatformAccessory, PlatformConfig } from 'homebridge'
import type { Service } from 'homebridge'

type KnxAccessory = {
    service: Exclude<keyof typeof Service, 'prototype'>
    addresses: string[]
    name: string
}

interface KnxPlatformConfig extends PlatformConfig {
    knxIpGatewayIp: string
    accessories: Array<KnxAccessory>
}

type KnxPlatformAccessory = PlatformAccessory<{
    knx: KnxAccessory
}>

const isKnxPlatformConfig = (config: PlatformConfig): config is KnxPlatformConfig => {
    return 'knxIpGatewayIp' in config
}

export type { KnxPlatformConfig, KnxAccessory, KnxPlatformAccessory }
export { isKnxPlatformConfig }
