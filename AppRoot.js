import React, {useState, useEffect} from 'react'
import SplashScreen from 'react-native-splash-screen'
import Prepare from './src/screens/Prepare'
import LoadingProvider from './src/provider/Loading'
import UserProvider from './src/provider/User'
import LocationProvider from './src/provider/Location'
import AlertProvider from './src/provider/Alert'
import App from './App'
import {LogBox} from 'react-native'
import {useLocation} from './src/config'

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation >state',
])

const RootApp = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <LoadingProvider>
      <UserProvider>
        {isLoaded ? (
          useLocation ? (
            <LocationProvider>
              <AlertProvider>
                <App />
              </AlertProvider>
            </LocationProvider>
          ) : (
            <AlertProvider>
              <App />
            </AlertProvider>
          )
        ) : (
          <Prepare setIsLoaded={setIsLoaded} />
        )}
      </UserProvider>
    </LoadingProvider>
  )
}

export default RootApp
