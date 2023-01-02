import { KnxPlatform } from './KnxPlatform'
import { API } from 'homebridge'
import { PLATFORM_NAME, PLUGIN_NAME } from './settings'

export default (api: API) => {
    api.registerPlatform(PLUGIN_NAME, PLATFORM_NAME, KnxPlatform)
}
