import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

import SplashScreen from '../screen/SplashScreen';
import AuthScreen from './auth';
import AppScreen from './app';

export default function MainStackNavigator({ navigationRef }) {
  return (

      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
          <Stack.Screen name="AppScreen" component={AppScreen} />
        </Stack.Navigator>
      </NavigationContainer>

  );
}
