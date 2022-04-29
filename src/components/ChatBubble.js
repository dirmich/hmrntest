import React from 'react'
import Svg, {Path} from 'react-native-svg'
import styled from 'styled-components'
import theme from '../common/theme'
import {Avatar, Row, Text, View} from './styled'

const MessageItem = styled(Row)`
  margin-top: 7px;
  margin-bottom: 7px;
  ${p => (p.me ? 'align-self:flex-end;margin-right:4px' : 'align-self:flex-start;margin-left:4px')}
`

const Cloud = styled.View`
  flex-direction: ${p => (p.me ? 'row-reverse' : 'row')};
  padding: 5px 10px 10px 7px;
  border-radius: 20px;
  background-color: ${p => (p.me ? theme.COLORS.chatMe : theme.COLORS.chatOther)};
`

const Message = styled.Text`
  flex: 1;
  flex-wrap: wrap;
  max-width: 150px;
  min-width: 100px;
  padding-top: 3px;
  font-size: 12px;
  line-height: 22px;
`
const Arrow = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  flex: 1;
  ${({me}) => {
    return me ? 'justify-content:flex-end;align-items:flex-end' : 'justify-content:flex-end;align-items:flex-start'
  }}
`

const ArrowSvg = styled(Svg)`
  width: 15.5px;
  height: 17.5px;
  ${({me}) => {
    return me ? 'right:-6px' : 'left:-6px'
  }}
`

const ChatBubble = ({message, user}) => {
  return (
    <MessageItem me={message.me}>
      <Cloud me={message.me}>
        {message.me ? null : (
          <>
            <View alignItems="center" alignSelf={'flex-start'}>
              <Avatar source={{uri: user.picture}} />
              <Text>{user.name}</Text>
            </View>
          </>
        )}
        <Message color={message.me ? 'blue' : 'black'}>{message.msg}</Message>
      </Cloud>
      <Arrow me={message.me}>
        <ArrowSvg me={message.me} viewBox="32.484 17.5 15.515 17.5" enable-background="new 32.484 17.5 15.515 17.5">
          <Path
            d={
              message.me
                ? 'M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z'
                : 'M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z'
            }
            fill={message.me ? theme.COLORS.chatMe : theme.COLORS.chatOther}
            x="0"
            y="0"
          />
        </ArrowSvg>
      </Arrow>
    </MessageItem>
  )
}

export default ChatBubble
