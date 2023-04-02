import { PlatformConfig } from 'homebridge'
import type { Service } from 'homebridge'

type KnxServiceConfig = {
    id: Exclude<keyof typeof Service, 'prototype'>
    addresses: string[]
    options: string[]
    name: string
}

type KnxAccessoryConfig = {
    services: KnxServiceConfig[]
    name: string
}

interface KnxPlatformConfig extends PlatformConfig {
    accessories: KnxAccessoryConfig[]

    maxConcurrentMessages: number
    maxTelegramsPerSecond: number
    knxIpGatewayIp: string
    readTimeout: number
}

export type { KnxPlatformConfig, KnxAccessoryConfig, KnxServiceConfig }
