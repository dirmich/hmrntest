import React from 'react'
import {SafeAreaView, StatusBar} from 'react-native'
import {useIsFocused} from '@react-navigation/native'

export const Safe = ({no, children}) =>
  !no ? <SafeAreaView>{children}</SafeAreaView> : <>{children}</>

export const HMStatusBar = ({dark, translucent = false, hide, ...props}) => {
  const isFocused = useIsFocused()

  return isFocused ? (
    <StatusBar
      translucent={translucent}
      barStyle={dark ? 'dark-content' : 'light-content'}
      hidden={hide}
      backgroundColor="transparent"
      {...props}
    />
  ) : null
}

export default HMStatusBar
