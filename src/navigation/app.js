import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Ionicons, Entypo, AntDesign } from '@expo/vector-icons';

import Home from '../screen/Home';
import WebViewScreen from '../screen/WebviewScreen';
import HeaderName from '../components/Header/defaultwithname';
import HeaderDefault from '../components/Header/default';
import Profile from '../screen/Profile';
import Education from '../screen/Education';
import ProfileUser from '../screen/ProfileUser';
import AccountInformation from '../screen/AccountInformation';
import PasswordSecurity from '../screen/PasswordSecurity';
import webViewDrive from '../screen/webviewDrive';
import { Colors } from '../constants/theme';

import CustomTabBar from '../components/CustomTabBar';

import ProgressScreen from '../screen/Progress';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Beranda"
        component={Home}
        options={{
          tabBarLabel: 'Beranda',
        }}
      />
      <Tab.Screen
        name="Materi"
        component={Education}
        options={{
          tabBarLabel: 'Materi',
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progress',
        }}
      />
      <Tab.Screen
        name="Pengaturan"
        component={ProfileUser}
        options={{
          headerShown: false,
          tabBarLabel: 'Pengaturan',
        }}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator
export default function AppStackNavigator() {
  return (
    <Stack.Navigator>
      {/* Gunakan BottomTabNavigator sebagai layar utama */}
      <Stack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="About"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WebViewScreen"
        component={WebViewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AccountInformation"
        component={AccountInformation}
        options={{
          header: (props) => <HeaderDefault {...props} />,
          drawerIcon: ({ size, color }) => (
            <Entypo name="line-graph" color={color} size={size} />
          ),
        }}
      />
      <Stack.Screen
        name="PasswordSecurity"
        component={PasswordSecurity}
        options={{
          header: (props) => <HeaderDefault {...props} />,
          drawerIcon: ({ size, color }) => (
            <Entypo name="line-graph" color={color} size={size} />
          ),
        }}
      />
      <Stack.Screen
        name="webviewdrive"
        component={webViewDrive}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

