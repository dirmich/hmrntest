import React, {useEffect, useState} from 'react'

import Context, {initialState} from '../context/User'
import Keychain from 'react-native-keychain'
import axios from '../lib/axios'

export default ({children}) => {
  const setToken = token => {
    setInfo(prev => {
      const opt = {
        ...prev,
        token,
      }
      if (prev.agent) prev.agent.resetToken(token)
      return opt
    })
    axios.setToken(token)
  }

  const setUser = user => {
    setInfo(prev => {
      return {
        ...prev,
        user,
      }
    })
  }

  const reset = async () => {
    await Keychain.resetInternetCredentials('auth')
    setInfo(initData)
  }

  const logout = async () => {
    await reset()
  }

  const initData = {
    ...initialState,
    setToken,
    setUser,
    reset,
    logout,
  }
  const [info, setInfo] = useState(initData)
  return <Context.Provider value={info}>{children}</Context.Provider>
}
