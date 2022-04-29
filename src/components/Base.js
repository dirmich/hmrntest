import React from 'react'
import {Dimensions, Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native'
import {getBottomSpace, getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper'
import {FullScreen} from './styled'

const {width: sw, height: sh} = Dimensions.get('screen')
const minHeight = getStatusBarHeight(true)
// const Height = isIphoneX()
//   ? Dimensions.get('window').height - status - getBottomSpace()
//   : Dimensions.get('window').height - status

export default Base = ({backgroundColor, dark, full, hideStatusBar, children, backgroundImage, ...props}) => {
  return (
    <>
      <View style={[{backgroundColor}, {minHeight}, {flex: 1}]}>
        <StatusBar
          translucent={full}
          backgroundColor={full ? (backgroundColor ? backgroundColor : 'transparent') : dark ? 'white' : 'black'}
          barStyle={dark ? 'dark-content' : 'light-content'}
          hidden={hideStatusBar}
        />
        {backgroundImage ? <Image source={backgroundImage} /> : null}
        <FullScreen statusBar={!hideStatusBar} bottom={getBottomSpace()} {...props}>
          {children}
        </FullScreen>
      </View>
    </>
  )
}
