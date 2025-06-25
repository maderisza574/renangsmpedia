import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Buffer } from "buffer";

const AccountInformation = () => {
  const [dataUser, setDataUser] = useState({});
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setDataUser(userData);
      }
    } catch (error) {
      console.log("Error loading user data:", error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (dataUser) {
      setFormFields([
        {
          key: "nama",
          icon: "person",
          value: dataUser.nama,
          editable: true,
        },
        {
          key: "no_hp",
          icon: "call",
          value: dataUser.no_hp,
          editable: true,
        },
      ]);
    }
  }, [dataUser]);

  const handleInputChange = (text, index) => {
    const newFields = [...formFields];
    newFields[index].value = text;
    setFormFields(newFields);
  };

  const updateProfile = async () => {
    setLoading(true);

    const url =
      "https://smpedia.creativeku.my.id/api/v1/akun_pengguna/ubah_profile";
    const basicAuth =
      "Basic " + Buffer.from("made:made_in_bali").toString("base64");
    const nama =
      formFields.find((field) => field.key === "nama")?.value || "";
    const no_hp =
      formFields.find((field) => field.key === "no_hp")?.value || "";

    const formBody = new URLSearchParams();
    formBody.append("id_akun_pengguna", dataUser?.id);
    formBody.append("no_hp", no_hp);
    formBody.append("nama", nama);

    try {
      const response = await axios.post(url, formBody.toString(), {
        headers: {
          Authorization: basicAuth,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status === 200) {
        Alert.alert("Berhasil", response.data.message || "Update berhasil");
      } else {
        Alert.alert("Gagal", response.data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      if (error.response) {
        const message =
          error.response.data?.meta?.message || "Terjadi kesalahan";
        Alert.alert("Gagal", message);
        console.log(
          "Full error response:",
          JSON.stringify(error.response.data, null, 2)
        );
      } else {
        Alert.alert("Error", "Gagal terhubung ke server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
     

      <View style={{ alignSelf: "center", marginTop: -45}}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
          AccountInformation
        </Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Text style={styles.profileName}>{dataUser?.fullName || ""}</Text>
        <Text style={styles.profileEmail}>{dataUser?.email || ""}</Text>
      </View>

      {/* FlatList untuk Input */}
      <FlatList
        data={formFields}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.inputContainer}>
            <View style={styles.iconWrapper}>
              <Ionicons name={item.icon} size={20} color="#2980b9" />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={item.value}
                editable={item.editable}
                onChangeText={(text) => handleInputChange(text, index)}
              />
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          <>
            <TouchableOpacity onPress={updateProfile} disabled={loading}>
              <LinearGradient
                colors={["#2980b9", "#6dd5fa"]}
                style={styles.applyGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.applyText}>Save</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 14,
    color: "#888",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "80%",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fff",
    shadowColor: "#2980b9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: "#333",
  },
  applyGradient: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  applyText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "Lexend-Regular",
  },
});

export default AccountInformation;
