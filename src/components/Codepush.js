import React from 'react'
import {useEffect} from 'react'
import {AppState} from 'react-native'
import CodePush from 'react-native-code-push'

const sync = () => {
  CodePush.sync({
    updateDialog: {
      title: '새로운 업데이트가 존재합니다',
      optionalUpdateMessage: '지금 업데이트하시겠습니까?',
      optionalIgnoreButtonLabel: '나중에',
      optionalInstallButtonLabel: '업데이트',
    },
    installMode: CodePush.InstallMode.IMMEDIATE,
  })
}

export default () => {
  useEffect(() => {
    sync()
    AppState.addEventListener('change', state => {
      state === 'active' && sync()
    })
  }, [])

  return <></>
}
