import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import { Entypo, Ionicons, Feather, Octicons } from "@expo/vector-icons";
import axios from 'axios';
import { Buffer } from 'buffer';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ComponentProfile from "../Profile"


const ProfileUser= (props) => {
  console.log("ini adalah props", props)
  const profile = {
    name: "Putri Amalia",
    email: "putriamalia@gmail.com",
    
  };

  const menuItems = [
    {
      id: "1",
      title: "Account Information",
      icon: <Ionicons name="person-outline" size={24} color="#6B7280" />,
      screen: "AccountInformation",
    },
    {
      id: "2",
      title: "Password & Security",
      icon: <Feather name="lock" size={24} color="#6B7280" />,
      screen: "PasswordSecurity",
    },
  ];

 const handleLogout = () => {
  Alert.alert(
    'Log Out',
    'Are you sure you want to log out?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            props?.navigation.replace('AuthScreen'); // ganti 'AuthScreen' sesuai nama route-mu
          } catch (error) {
            console.log('Error clearing AsyncStorage:', error);
            Alert.alert('Error', 'Gagal logout. Silakan coba lagi.');
          }
        },
      },
    ],
    { cancelable: false }
  );
}

const handleWebView = () => {
  try {
    props?.navigation.navigate("webviewdrive");
  } catch (error) {
    console.log("INI EROR")
  }
}



  const renderItem = ({ item }) => {
    if (item.type === "header") {
      return (
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "#6B7280",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          {item.title}
        </Text>
      );
    }

    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          elevation: 10,
          shadowColor: "#bbeaff",
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderRadius: 12,
          marginBottom: 10,
        }}
        onPress={() => item.screen && props?.navigation.navigate(item.screen)}
      >
        {item.icon && <View style={{ marginRight: 12 }}>{item.icon}</View>}
        <Text style={{ fontSize: 16, color: "#333", flex: 1 }}>
          {item.title}
        </Text>
        {item.value ? (
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#6B7280" }}>
            {item.value}
          </Text>
        ) : (
          <Entypo name="chevron-right" size={20} color="#9CA3AF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: "#fff",
        }}
      >
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={
            <View
              style={{ alignItems: "center", marginBottom: 30, marginTop: -20 }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 18, color: "black" }}
              >
                Account & Security
              </Text>
            </View>
          }
          ListFooterComponent={
            <>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "white",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "#fff", // Merah muda lembut
                  shadowColor: "#bbeaff",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 10,
                }}
                onPress={handleLogout}
              >
                <Entypo name="log-out" size={20} color="#6B7280" />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#6B7280",
                    marginTop: 10,
                    marginLeft: -180,
                    marginBottom: 10,
                  }}
                >
                  Logout
                </Text>

                <Entypo name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "white",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "#fff", // Merah muda lembut
                  shadowColor: "#bbeaff",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 10,
                }}
                onPress={handleWebView}
              >
                <Entypo name="log-out" size={20} color="#6B7280" />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#6B7280",
                    marginTop: 10,
                    marginLeft: -180,
                    marginBottom: 10,
                  }}
                >
                  WEBVIEW TES
                </Text>

                <Entypo name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity> */}
              {/* <View>
                <ComponentProfile />
              </View> */}
              <View style={{ height: Dimensions.get("window").height * 0.2 }} />
            </>
          }
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

export default ProfileUser;
