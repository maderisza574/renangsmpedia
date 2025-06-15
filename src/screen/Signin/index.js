import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';

const { width } = Dimensions.get('window');

export default function Signin(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  if (!username || !password) {
    Alert.alert('Error', 'Mohon isi semua field');
    return;
  }

  setLoading(true);

  const url = 'https://smpedia.creativeku.my.id/api/v1/akun_pengguna/login';
  const basicAuth = 'Basic ' + Buffer.from('made:made_in_bali').toString('base64');

  const formBody = new URLSearchParams();
  formBody.append('no_hp', username.trim());
  formBody.append('password', password);

  try {
    const response = await axios.post(url, formBody.toString(), {
      headers: {
        Authorization: basicAuth,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 200) {
      const userData = response.data.data;

      // Simpan ke AsyncStorage
      await AsyncStorage.multiSet([
        ['username', username],
        ['password', password],
        ['userData', JSON.stringify(userData)],
      ]);

      props.navigation.replace('AppScreen');
    } else {
      Alert.alert('Login gagal', response.data.message || 'Terjadi kesalahan');
    }
  } catch (error) {
    if (error.response) {
      const message = error.response.data?.meta?.message || 'Terjadi kesalahan';
      Alert.alert('Login gagal', message);
      console.log('Full error response:', JSON.stringify(error.response.data, null, 2));
    } else {
      Alert.alert('Error', 'Gagal terhubung ke server');
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logorenangnobg.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username atau No. HP"
        placeholderTextColor="#aaa"
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={styles.buttonContainer}
        disabled={loading}
      >
        <LinearGradient
          colors={loading ? ['#ccc', '#eee'] : ['#2980b9', '#6dd5fa']}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'Login'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>
          Belum punya akun?{' '}
          <Text
            style={styles.signupLink}
            onPress={() => props.navigation.navigate('Signup')}
          >
            Daftar
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#555',
  },
  signupLink: {
    color: '#2980b9',
    fontWeight: 'bold',
  },
});
