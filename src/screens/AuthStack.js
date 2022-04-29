import React from 'react'
import {createSharedElementStackNavigator} from 'react-navigation-shared-element'
import Test1 from './test/Test1'

const Stack = createSharedElementStackNavigator()

const MainStack = () => (
  <Stack.Navigator
    initialRouteName="Test1"
    screenOptions={{
      headerShown: false,
      cardStyle: {backgroundColor: 'transparent'},
      cardStyleInterpolator: ({current: {progress}}) => ({
        cardStyle: {opacity: progress},
      }),
    }}>
    <Stack.Screen name="Test1" component={Test1} />
    {/* <Stack.Screen
      name="ShowRoute"
      component={ShowRoute}
      options={{cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}}
    /> */}
  </Stack.Navigator>
)

export default MainStack
