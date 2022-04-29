/**
 * @format
 */

import {AppRegistry, Platform, RNKeychainManager} from 'react-native'
import App from './AppRoot'
import {name as appName} from './app.json'

export const SECURITY_LEVEL = Object.freeze({
  ANY: RNKeychainManager && RNKeychainManager.SECURITY_LEVEL_ANY,
  SECURE_SOFTWARE:
    RNKeychainManager && RNKeychainManager.SECURITY_LEVEL_SECURE_SOFTWARE,
  SECURE_HARDWARE:
    RNKeychainManager && RNKeychainManager.SECURITY_LEVEL_SECURE_HARDWARE,
})
//// Register background handler
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// })

AppRegistry.registerComponent(appName, () => App)
