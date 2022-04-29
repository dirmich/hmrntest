import {useEffect, useCallback, useContext} from 'react'
import {Alert} from 'react-native'
import messaging from '@react-native-firebase/messaging'
import {setPushToken} from '../lib/api'
import UserContext from '../context/User'

const FCMContainer = ({children}) => {
  // const {incQna, addNotPresent, notice, setNotice} = useContext(UserContext)

  const _updateTokenToServer = useCallback(async () => {
    try {
      const fcmToken = await messaging().getToken()
      setPushToken(fcmToken)
    } catch (error) {
      console.log('ERROR: _updateTokenToServer', error)
    }
  }, [])

  const _requestPermission = useCallback(async () => {
    try {
      // User has authorised
      await messaging().requestPermission()
      await _updateTokenToServer()
    } catch (error) {
      // User has rejected permissions
      console.log("you can't handle push notification")
    }
  }, [_updateTokenToServer])

  const _checkPermission = useCallback(async () => {
    try {
      const enabled = await messaging().hasPermission()
      if (enabled !== -1) {
        // user has permissions
        _updateTokenToServer()
      } else {
        // user doesn't have permission
        _requestPermission()
      }
    } catch (error) {
      console.log('ERROR: _checkPermission', error)
      console.log(error)
    }
  }, [_updateTokenToServer, _requestPermission])

  useEffect(() => {
    _checkPermission()

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('MSG]', remoteMessage)
      // switch (remoteMessage.data.type) {
      // }

      if (remoteMessage.notification) {
        Alert.alert(
          remoteMessage.notification.title,
          remoteMessage.notification.body,
          [
            {
              text: '확인',
              style: 'cancel',
            },
          ],
          {cancelable: false},
        )
      }
    })

    return unsubscribe
  }, [_checkPermission])

  return children
}

export default FCMContainer
