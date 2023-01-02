import { KnxPlatform } from './KnxPlatform'
import { API } from 'homebridge'
import { PLATFORM_NAME } from './settings'

export default (api: API) => {
    api.registerPlatform(PLATFORM_NAME, KnxPlatform)
}
