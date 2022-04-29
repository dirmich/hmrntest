import React, {useState} from 'react'
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native'

import Modal from 'react-native-modal'

import scale from './Scale'

const Alert = props => {
  return (
    <Modal
      isVisible={props.isVisible}
      useNativeDriver
      hideModalContentWhileAnimating
      statusBarTranslucent
      style={{...styles.container}}>
      <View style={{...styles.viewAlert}}>
        <Text style={{...styles.txtTitle}} numberOfLines={1}>
          {props.title}
        </Text>
        <Text style={{...styles.txtBody}}>{props.body}</Text>
        {props.renderSubBody ? (
          <Text style={{...styles.txtSubBody}}>{props.subBody}</Text>
        ) : null}
        <View style={{flexDirection: 'row'}}>
          {props.renderLeftBtn ? (
            <TouchableOpacity
              style={{
                ...styles.viewButton,
                borderRightWidth: 1,
                borderRightColor: '#dddddd',
              }}
              onPress={props.leftBtnPress}>
              <Text style={{...styles.tchTitle}}>{props.leftBtnText}</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={{...styles.viewButton}}
            onPress={props.btnPress}>
            <Text style={{...styles.tchTitle}}>{props.btnText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default Alert

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  viewAlert: {
    backgroundColor: 'white',
    width: scale(295),
    // paddingHorizontal: scale(25),
    // paddingVertical: scale(13),
    borderRadius: scale(5),
  },
  txtTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#707070',
    textAlign: 'center',
    marginTop: scale(25),
    marginBottom: scale(15),
    paddingHorizontal: scale(20),
  },
  txtBody: {
    fontSize: scale(14),
    color: '#707070',
    marginBottom: scale(25),
    textAlign: 'center',
    paddingHorizontal: scale(20),
  },
  txtSubBody: {
    fontSize: scale(12),
    color: '#707070',
    marginBottom: scale(25),
    textAlign: 'center',
    paddingHorizontal: scale(20),
  },
  viewButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    paddingVertical: scale(12),
    flex: 1,
  },
  tchTitle: {
    fontSize: scale(15),
    fontWeight: 'bold',
    color: '#eb9d1f',
  },
})
