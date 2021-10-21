import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SignIn from './Login';
import SignUp from './SignUp';

const Stack = createStackNavigator();

const AuthScreens = () => (
  <Stack.Navigator>
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignUp" component={SignUp} />
  </Stack.Navigator>
);

const Screens = () => {
  return <AuthScreens />;
};

export default Screens;
