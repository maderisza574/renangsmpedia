import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, Ionicons, Entypo, AntDesign } from '@expo/vector-icons';

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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          bottom: Dimensions.get("window").height - 790,
          left: Dimensions.get("window").width,
          marginLeft: Dimensions.get("window").width - 320,
          width: 230,
          height: 75,
          backgroundColor: "#ffffff",
          borderRadius: 20,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false, // ✅ di sini saja
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="home-filled"
              size={24}
              color={focused ? "#2980b9" : "gray"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <View style={styles.labelContainer}>
              <Text style={[styles.label, focused && styles.activeLabel]}>
                Home
              </Text>
              {focused && <View style={styles.activeDivider} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={Profile}
        options={{
          headerShown: false, // ✅ di sini saja
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="idcard"
              size={24}
              color={focused ? "#2980b9" : "gray"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <View style={styles.labelContainer}>
              <Text style={[styles.label, focused && styles.activeLabel]}>
                About
              </Text>
              {focused && <View style={styles.activeDivider} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileUser}
        options={{
          // ❌ JANGAN pakai headerShown: false di sini
          header: (props) => <HeaderDefault {...props} name="Profile" />,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-outline"
              size={24}
              color={focused ? "#2980b9" : "gray"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <View style={styles.labelContainer}>
              <Text style={[styles.label, focused && styles.activeLabel]}>
                Profile
              </Text>
              {focused && <View style={styles.activeDivider} />}
            </View>
          ),
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

// Styles
const styles = StyleSheet.create({
  labelContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: 'gray',
    fontWeight: 'bold',
  },
  activeLabel: {
    color: '#2980b9',
  },
  activeDivider: {
    width: 40,
    height: 4,
    backgroundColor: '#2980b9',
    borderRadius: 2,
    marginTop: 10,
  },
});
