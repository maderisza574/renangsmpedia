import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Image, Dimensions, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Buffer } from 'buffer';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animasi fade-in logo
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Mulai pengecekan login
    const checkLogin = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedPassword = await AsyncStorage.getItem('password');

      if (storedUsername && storedPassword) {
        try {
          const basicAuth = 'Basic ' + Buffer.from('made:made_in_bali').toString('base64');

          const formBody = new URLSearchParams();
          formBody.append('no_hp', storedUsername.trim());
          formBody.append('password', storedPassword);

          const response = await axios.post(
            'https://smpedia.creativeku.my.id/api/v1/akun_pengguna/login',
            formBody.toString(),
            {
              headers: {
                Authorization: basicAuth,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          );

          if (response.status === 200) {
            await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
            navigation?.replace('AppScreen');
          } else {
            navigation?.replace('AuthScreen');
          }
        } catch (error) {
          console.log('Auto login error:', error.message);
          navigation?.replace('AuthScreen');
        }
      } else {
        // Jika tidak ada data login tersimpan
        setTimeout(() => navigation?.replace('AuthScreen'), 3000);
      }
    };

    checkLogin();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../../assets/images/logorenangnobg.png')}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
      <Text style={styles.title}>Renang SMPedia</Text>
      <ActivityIndicator size="large" color="#2980b9" style={{ marginTop: 20 }} />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 30,
    textAlign: 'center',
  },
});
