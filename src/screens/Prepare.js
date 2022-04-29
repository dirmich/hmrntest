import React, {useEffect, useContext, useCallback} from 'react'
import {View, ActivityIndicator, StyleSheet} from 'react-native'

import {refreshToken, isNull} from '../common/Utils'
import CodePush from '../components/Codepush'
import {PermissionsAndroid, Platform} from 'react-native'

import LoadingContext from '../context/Loading'
import UserContext from '../context/User'

import axios from '../lib/axios'

const AppLoading = ({setIsLoaded, ...props}) => {
  const {setIsLoading} = useContext(LoadingContext)
  const {token, setToken, setUser, reset} = useContext(UserContext)

  useEffect(() => {
    axios.interceptors.request.use(
      function (config) {
        setIsLoading(true)
        return config
      },
      function (error) {
        setIsLoading(false)
        return Promise.reject(error)
      },
    )

    axios.interceptors.response.use(
      function (response) {
        setIsLoading(false)
        if (isNull(response.data)) return response
        // if (!isNull(response.data.token)) {
        //   setToken(response.data.token)
        // }
        if (response.data.err) {
          throw response.data.msg
        }
        return response.data
      },

      async function (error) {
        setIsLoading(false)
        console.log('RSPE]', error, error.response.status)
        if (error.response.status === 401) {
          alert('Session expired')
          reset()
          return Promise.reject(null)
        } else return Promise.reject(error)
      },
    )
  }, [])

  const _getToken = useCallback(async () => {
    const ret = await refreshToken()
    if (ret) {
      // console.log('from getToken')
      setToken(ret.token)
      setUser(ret.user)
    }
    if (setIsLoaded) setIsLoaded(true)
  }, [setIsLoaded])

  const _checkPermission = async () => {
    if (Platform.OS === 'android') {
      console.log('check permission')
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ])
        .then(r => {
          console.log('get permission ok', r)
        })
        .catch(e => {
          console.log('get permission err', e)
        })
    }
  }
  useEffect(() => {
    // _getToken()
    _checkPermission()
    if (!token) setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (token) setIsLoaded(true)
  }, [token])

  return (
    <View style={styles.container}>
      <CodePush />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'red',
  },
})

export default AppLoading
