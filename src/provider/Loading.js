import React, {useEffect, useState} from 'react'
import Context, {initialState} from '../context/Loading'
import LoadingIndicator from '../common/LoadingIndicator'

export default ({children}) => {
  const setIsLoading = bSet => {
    setLoading(prev => {
      return {...prev, isLoading: bSet}
    })
  }

  const setUseLoading = bSet => {
    setLoading(prev => {
      return {...prev, use: bSet}
    })
  }

  const [loading, setLoading] = useState({...initialState, setIsLoading, setUseLoading})

  return (
    <Context.Provider value={loading}>
      {children}
      {loading.isLoading && loading.use ? <LoadingIndicator /> : null}
    </Context.Provider>
  )
}
