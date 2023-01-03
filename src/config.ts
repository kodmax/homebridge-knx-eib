import { PlatformConfig } from 'homebridge'
import type { Service } from 'homebridge'

type KnxServiceConfig = {
    id: Exclude<keyof typeof Service, 'prototype'>
    addresses: string[]
    name: string
}

type KnxAccessoryConfig = {
    services: KnxServiceConfig[]
    name: string
}

interface KnxPlatformConfig extends PlatformConfig {
    accessories: KnxAccessoryConfig[]
    knxIpGatewayIp: string
}

export type { KnxPlatformConfig, KnxAccessoryConfig, KnxServiceConfig }
