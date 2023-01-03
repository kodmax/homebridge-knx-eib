import { API } from 'homebridge'

import { PLATFORM_NAME, PLUGIN_NAME } from './settings'
import { KnxPlatform } from './KnxPlatform'

export default (api: API) => {
    api.registerPlatform(PLUGIN_NAME, PLATFORM_NAME, KnxPlatform)
}
