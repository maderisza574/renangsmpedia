import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { Buffer } from 'buffer';
import AsyncStorage from "@react-native-async-storage/async-storage";

const PasswordSecurity = () => {
  const [loading, setLoading] = useState(false);
  const [dataUser, setDataUser] = useState({});
  console.log("data user", dataUser);
  const [passwords, setPasswords] = useState({
    password: '',
    ulangi_password: '',
  });
  console.log("INI PASS", passwords)

  const [secureTextEntry, setSecureTextEntry] = useState({
    password: true,
    ulangi_password: true,
  });

  const toggleSecureEntry = (field) => {
    setSecureTextEntry((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setDataUser(userData);
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleChangePass = async () => {
    if (!passwords.password || !passwords.ulangi_password) {
      Alert.alert('Peringatan', 'Semua kolom password wajib diisi.');
      return;
    }

    if (passwords.password !== passwords.ulangi_password) {
      Alert.alert('Peringatan', 'Konfirmasi password tidak sesuai.');
      return;
    }

    setLoading(true);

    const url = 'https://smpedia.creativeku.my.id/api/v1/akun_pengguna/ubah_password';
    const basicAuth = 'Basic ' + Buffer.from('made:made_in_bali').toString('base64');

    const formBody = new URLSearchParams();
    formBody.append('id_akun_pengguna', dataUser?.id|| '');
    formBody.append('password', passwords.password);
    formBody.append('ulangi_password', passwords.ulangi_password);
    console.log("Data Kirim", formBody);
    try {
      const response = await axios.post(url, formBody.toString(), {
        headers: {
          Authorization: basicAuth,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log("response", response);
      if (response.status === 200) {
        Alert.alert('Berhasil', response.data.message || 'Password berhasil diubah.');
        setPasswords({ password: '', ulangi_password: '' });
      } else {
        Alert.alert('Gagal', response.data.message || 'Terjadi kesalahan saat mengubah password.');
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Terjadi kesalahan saat mengirim permintaan. Coba lagi nanti.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />

          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>Please enter your password</Text>

          {[
            { label: 'Password', key: 'password' },
            { label: 'Ulangi Password', key: 'ulangi_password' },
          ].map(({ label, key }) => (
            <View key={key} style={styles.inputWrapper}>
              <Text style={styles.label}>{label}</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#2980b9" />
                <TextInput
                  style={styles.input}
                  placeholder={label}
                  placeholderTextColor="#999"
                  secureTextEntry={secureTextEntry[key]}
                  value={passwords[key]}
                  onChangeText={(text) =>
                    setPasswords((prev) => ({ ...prev, [key]: text }))
                  }
                />
                <TouchableOpacity onPress={() => toggleSecureEntry(key)}>
                  <Feather
                    name={secureTextEntry[key] ? 'eye-off' : 'eye'}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={{ marginTop: 30 }}
            onPress={handleChangePass}
            disabled={loading}
          >
            <LinearGradient
              colors={['#2980b9', '#6dd5fa']}
              style={styles.applyGradient}
            >
              <Text style={styles.applyText}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
    color: '#000',
  },
  applyGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default PasswordSecurity;
