import React, {useState, useEffect, useContext} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {Button} from 'react-native-elements'
// import {SocialIcon} from 'react-native-elements'
import UserContext from '../../context/User'

const Login = () => {
  const {setToken, setUser} = useContext(UserContext)

  const login = () => {
    setToken('hello')
    setUser('world')
  }
  return (
    <View style={styles.container}>
      <Button title="Login" onPress={() => login()} />
      {/* <SocialIcon style={styles.button} title="Login Google" button type="google" onPress={() => loginGoogle()} />
      <SocialIcon style={styles.button} title="Login Facebook" button type="facebook" onPress={() => loginFacebook()} /> */}
      {/* <Button title="Facebook" onPress={() => loginFaceBook()} /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 150,
  },
})

export default Login
