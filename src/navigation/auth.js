import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import Signin from '../screen/Signin';
import Signup from '../screen/Signup';
import ForgotPass from '../screen/ForgotPass';


import HeaderDefault from '../components/Header/default';
import HeaderName from '../components/Header/defaultwithname';

export default function AuthStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Signin"
        component={Signin}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPass"
        component={ForgotPass}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}