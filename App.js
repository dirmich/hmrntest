import React, {useContext, useEffect} from 'react'
import AppStack from './src/screens/AppStack'
import AuthStack from './src/screens/AuthStack'
import {useFirebase} from './src/config'
import FCM from './src/screens/FCMContainer'

import {NavigationContainer} from '@react-navigation/native'

import UserContext from './src/context/User'
import {SafeAreaProvider} from 'react-native-safe-area-context'

const App = () => {
  const {token} = useContext(UserContext)

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {token ? (
          useFirebase ? (
            <FCM>
              <AppStack />
            </FCM>
          ) : (
            <AppStack />
          )
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App
