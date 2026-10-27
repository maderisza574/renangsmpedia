import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";
import { Feather } from "@expo/vector-icons";

import SwimmerLogo from "../../components/SwimmerLogo";
import SplashWaves from "../../components/SplashWaves";
import { Colors, Gradients, Shadows } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function Signin(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Perhatian", "Mohon masukkan Username / No. HP dan Password Anda.");
      return;
    }

    setLoading(true);

    const url = "https://smpedia.creativeku.my.id/api/v1/akun_pengguna/login";
    const basicAuth =
      "Basic " + Buffer.from("made:made_in_bali").toString("base64");

    const formBody = new URLSearchParams();
    formBody.append("no_hp", username.trim());
    formBody.append("password", password);

    try {
      const response = await axios.post(url, formBody.toString(), {
        headers: {
          Authorization: basicAuth,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status === 200) {
        const userData = response.data.data;

        await AsyncStorage.multiSet([
          ["username", username],
          ["password", password],
          ["userData", JSON.stringify(userData)],
        ]);

        props.navigation.replace("AppScreen");
      } else {
        Alert.alert(
          "Login Gagal",
          response.data.message || "Periksa kembali data Anda."
        );
      }
    } catch (error) {
      if (error.response) {
        const message =
          error.response.data?.meta?.message || "Terjadi kesalahan pada server.";
        Alert.alert("Login Gagal", message);
      } else {
        Alert.alert("Koneksi Bermasalah", "Gagal terhubung ke server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Logo Badge */}
          <View style={styles.logoWrapper}>
            <SwimmerLogo size={105} />
          </View>

          <Text style={styles.appTitle}>Ayo Belajar Renang!</Text>
          <Text style={styles.appSub}>Silakan masuk untuk melanjutkan belajar</Text>

          {/* Form Card */}
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Feather name="phone" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username atau No. HP"
                placeholderTextColor={Colors.textSecondary}
                onChangeText={setUsername}
                value={username}
                autoCapitalize="none"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.textSecondary}
                secureTextEntry
                onChangeText={setPassword}
                value={password}
              />
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              style={styles.buttonContainer}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={loading ? ["#b0bec5", "#cfd8dc"] : Gradients.primary}
                start={Gradients.primaryCoords.start}
                end={Gradients.primaryCoords.end}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Memproses..." : "Masuk Sekarang →"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.footerLinks}>
            <Text style={styles.signupText}>
              Belum punya akun?{" "}
              <Text
                style={styles.signupLink}
                onPress={() => props.navigation.navigate("Signup")}
              >
                Daftar
              </Text>
            </Text>
            <Text style={styles.forgotPasswordText}>
              Lupa password?{" "}
              <Text
                style={styles.signupLink}
                onPress={() => props.navigation.navigate("ForgotPass")}
              >
                Klik di sini
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.textPrimary,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  appSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  card: {
    width: "100%",
    backgroundColor: Colors.cardBackground,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 20,
    ...Shadows.card,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FDFF",
    borderWidth: 1.2,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: Colors.textPrimary,
  },
  buttonContainer: {
    marginTop: 6,
    width: "100%",
  },
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    ...Shadows.glow,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  footerLinks: {
    marginTop: 22,
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  signupLink: {
    color: Colors.primary,
    fontWeight: "700",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 10,
  },
});
