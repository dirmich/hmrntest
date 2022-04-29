import React, {useState, useEffect} from 'react'
import Geolocation from '@react-native-community/geolocation'
import {Platform} from 'react-native'

import Context, {initialState} from '../context/Location'

export default ({children}) => {
  let watchId = null

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      pos => {
        console.log('get geo', pos)
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      err => console.error(err),
      {enableHighAccuracy: true, timeout: 5000},
    )
  }
  const setIsRunning = bool => {
    if (bool) {
      console.log('start geo')
      watchId = Geolocation.watchPosition(
        pos => {
          console.log('update geo', pos)
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          })
        },
        err => console.error(err),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
          distanceFilter: 20,
        },
      )
    } else {
      console.log('end geo')
      Geolocation.clearWatch(watchId)
      watchId = null
    }
    setLocationInfo(prevState => {
      return {
        ...prevState,
        isRunning: bool,
      }
    })
  }

  const setLocation = coords => {
    setLocationInfo(prevState => {
      return {
        ...prevState,
        currentPos: coords,
      }
    })
  }

  useEffect(() => {
    try {
      if (Platform.OS !== 'android') Geolocation.requestAuthorization()
      getCurrentPosition()
    } catch (e) {
      console.error('LPE]', e)
    }
  }, [])

  const [locationInfo, setLocationInfo] = useState({
    ...initialState,
    setLocation,
    setIsRunning,
  })

  return <Context.Provider value={locationInfo}>{children}</Context.Provider>
}
