import React from 'react'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createDrawerNavigator} from '@react-navigation/drawer'
import Tab1 from './app/Tab1'
import Tab2 from './app/Tab2'

import LeftDrawer from './drawer/Drawer'
import {Icon} from 'react-native-elements'
import {COLORS} from '../common/theme'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

const tabMenu = {
  Tab1: {
    name: 'chat',
    type: 'entypo',
    comp: Tab1,
    title: 'tab1',
  },
  Tab2: {
    name: 'projection-screen',
    type: 'foundation',
    comp: Tab2,
    title: 'tab2',
  },
}

const TabStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="AppMain"
      screenOptions={{
        showLabel: false,
      }}>
      {Object.keys(tabMenu).map(m => {
        const item = tabMenu[m]
        return (
          <Tab.Screen
            name={m}
            key={m}
            component={item.comp}
            options={{
              tabBarLabel: item.title,
              tabBarIcon: ({focused}) => {
                return (
                  <Icon
                    name={item.name}
                    type={item.type ? item.type : 'material'}
                    // iconStyle={focused ? {opacity: 1} : {opacity: 0.5}}
                    iconStyle={{
                      width: 25,
                      height: 25,
                      color: focused ? COLORS.primary : COLORS.secondary,
                    }}
                  />
                )
              },
            }}
          />
        )
      })}
    </Tab.Navigator>
  )
}

const MainStack = () => (
  <Stack.Navigator
    initialRouteName="TabStack"
    screenOptions={{
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}>
    <Stack.Screen name="TabStack" component={TabStack} />
  </Stack.Navigator>
)

const AppStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <LeftDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        swipeEnabled: true,
        // ...(Platform.OS === 'android' ? {swipeEnabled: false} : {swipeEnabled: true}),
      }}
      initialRouteName={'MainStack'}>
      <Stack.Screen name="MainStack" component={MainStack} />
    </Drawer.Navigator>
  )
}

export default AppStack
