import {Dimensions} from 'react-native'

import * as Keychain from 'react-native-keychain'
import {useRef, useEffect} from 'react'

import moment from 'moment'
import {getToken} from '../lib/api'
export const screenWidth = Math.round(Dimensions.get('window').width)
export const screenHeight = Math.round(Dimensions.get('window').height)

export function isNull(a) {
  return typeof a === undefined || (typeof a !== 'number' && !a)
}

export const refreshToken = async () => {
  // try {
  const credentials = await Keychain.getInternetCredentials('auth')
  if (credentials) {
    const {password} = credentials
    const ret = await getToken(password)
    return ret
  } else return null
}

export const setAccessToken = async (user, token) => {
  await Keychain.setInternetCredentials('auth', user, token, {
    accessControl: null,
    securityLevel:
      Platform.OS === 'android' ? Keychain.SECURITY_LEVEL.ANY : null,
    storage: Platform.OS === 'android' ? Keychain.STORAGE_TYPE.AES : null,
  })
}

export const pretty = date => {
  const now = moment()
  const target = moment(date)
  const dt = moment.duration(now.diff(target))
  if (dt.asSeconds() < 60) return '방금 전'
  if (dt.asMinutes() < 60) return `${parseInt(dt.asMinutes())}분전`
  return target.format('YYYY-MM-DD HH:mm')
}

export const useIsMount = () => {
  const isMountRef = useRef(true)
  useEffect(() => {
    isMountRef.current = false
  }, [])
  return isMountRef.current
}

export const checkEmail = text => {
  return (
    /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/.test(text) &&
    text !== ''
  )
}

export const checkPhone = text => {
  return /(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/.test(text) && text !== ''
}

export const checkPassword = text => {
  return (
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()_+|<>?:{}`~=.,^/])[A-Za-z\d~!@#$%^&*()_+|<>?:{}`~=.,^/]{8,16}$/.test(
      text,
    ) && text !== ''
  )
}

export function getTime(time) {
  const buf = time.split(':')
  return parseInt(buf[0]) * 60 + parseInt(buf[1])
}

export function pad(str, padlen = 2, fillchar = '0') {
  return (new Array(padlen + 1).join(fillchar) + str).slice(-padlen)
}

export const convertTime = minute => {
  return `${pad(parseInt(minute / 60))}:${pad(parseInt(minute % 60))}`
}
