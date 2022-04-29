import React, {useEffect} from 'react'
import {ImageBackground} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {
  Axis,
  Container,
  FullScreen,
  Row,
  Column,
  ScrollView,
  Space,
  Text,
} from '../../components/styled'

const messages = [
  {
    type: 'date',
    ts: Date(),
  },
]
export default Video = () => {
  return (
    <Column debug fbox>
      <Row mainAxis={Axis.around} crossAxis={Axis.start} fbox>
        <Icon name="keyboard-arrow-left" />
        {/* <Space /> */}
        <Icon name="keyboard-arrow-right" />
      </Row>
      <Space />
      <Row mainAxis={Axis.between} crossAxis={Axis.center} fbox>
        <Icon name="arrow-back" />
        <Icon name="arrow-back" />
      </Row>
      <Row mainAxis={Axis.end} crossAxis={Axis.end} fbox>
        <Icon name="arrow-back" />
        <Icon name="arrow-back" />
      </Row>
      <ScrollView></ScrollView>
    </Column>
  )
}
