import React, {useContext} from 'react'
import {StyleSheet, View} from 'react-native'
import {Avatar, Button, Text} from 'react-native-elements'
import UserContext from '../../context/User'

const LeftDrawer = () => {
  const {user, logout} = useContext(UserContext)
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Avatar
            size="medium"
            rounded
            source={user ? {uri: user.picture} : {}}
            containerStyle={{marginRight: 10}}
          />
          <Text>{user.name}</Text>
        </View>
      </View>
      <Button style={styles.logout} title="Logout" onPress={() => logout()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightcyan',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    margin: 20,
  },
  info: {height: 40, flexDirection: 'row', alignItems: 'center'},
  logout: {
    height: 40,
  },
})

export default LeftDrawer
