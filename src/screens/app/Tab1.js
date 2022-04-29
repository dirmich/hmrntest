import {useIsFocused} from '@react-navigation/core'
import React, {useContext, useEffect, useState} from 'react'
import {View, Row, Text, Column} from '../../components/styled'
import UserContext from '../../context/User'
import useInput from '../../hooks/useInput'
import Input from '../../components/Input'
import HMStatusbar from '../../components/HMStartusBar'

export default ({navigation}) => {
  const isFoucused = useIsFocused()
  const {currRoom, agent, add, del, peerMessage} = useContext(UserContext)
  const [messages, setMessages] = useState([])
  const inputs = useInput(
    {
      chat: '',
    },
    () => sendMessage(),
    {
      // phone: {fn: () => checkPhone(values.phone), msg: '휴대폰번호 형식이 올바르지 않습니다'},
      // pass: {fn: () => values.pass && values.pass.length >= 8, msg: '비밀번호 형식이 올바르지 않습니다'},
    },
  )
  const {values, setVal} = inputs

  const sendMessage = async () => {
    console.log('send', values.chat)
    await agent.sendMessage(values.chat)
    const list = [
      ...messages,
      {
        id: 0,
        msg: values.chat,
        ts: new Date().getTime(),
        user: null,
        me: true,
      },
    ]
    setMessages(list)

    setVal('chat', '')
  }
  return (
    <View flex={1}>
      <HMStatusbar translucent backgroundColor="white" dark />
      <Row height={50} justify="space-between" backgroundColor="white">
        <Text bold large>
          Test
        </Text>
        <Text bold large>
          Hello
        </Text>
      </Row>
      <Column backgroundColor="#ffddfe">
        <Input
          title="메시지를 입력하세요"
          use="chat"
          inputs={inputs}
          backgroundColor="transparent"
          color="blue"
        />
      </Column>
    </View>
  )
}
