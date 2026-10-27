import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Text,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Buffer } from 'buffer';

import SwimmerLogo from '../../components/SwimmerLogo';
import SplashWaves from '../../components/SplashWaves';
import { Colors, Gradients } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(20));

  useEffect(() => {
    // Animasi fade-in dan slide-up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Pengecekan login
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
            setTimeout(() => navigation?.replace('AppScreen'), 2000);
          } else {
            setTimeout(() => navigation?.replace('AuthScreen'), 2000);
          }
        } catch (error) {
          console.log('Auto login error:', error.message);
          setTimeout(() => navigation?.replace('AuthScreen'), 2000);
        }
      } else {
        setTimeout(() => navigation?.replace('AuthScreen'), 2400);
      }
    };

    checkLogin();
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#0090E0', '#00AEE6', '#00BCD4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Main Center Content */}
      <Animated.View
        style={[
          styles.contentWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Swimmer Logo Badge */}
        <View style={styles.logoContainer}>
          <SwimmerLogo size={140} strokeWidth={2.5} />
        </View>

        {/* Title & Subtitle from design */}
        <Text style={styles.title}>Ayo Belajar{'\n'}Renang!</Text>
        <Text style={styles.subtitle}>Jadi lebih percaya diri{'\n'}di air bersama kami</Text>

        <ActivityIndicator size="small" color={Colors.white} style={styles.loader} />
      </Animated.View>

      {/* Multi-layered flowing water waves at bottom */}
      <SplashWaves height={250} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: -50,
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: '#004077',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  loader: {
    marginTop: 28,
  },
});
