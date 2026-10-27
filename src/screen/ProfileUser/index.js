import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import { Entypo, Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

import SwimmerLogo from '../../components/SwimmerLogo';
import WaveBottom from '../../components/WaveBottom';
import LogoBPI from '../LogoBPI';
import { Colors, Gradients, Shadows } from '../../constants/theme';

const { width } = Dimensions.get('window');

const ProfileUser = (props) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        if (stored) {
          setUserData(JSON.parse(stored));
        }
      } catch (e) {
        console.log('Error reading userData:', e);
      }
    };
    loadUser();
  }, []);

  const menuItems = [
    {
      id: '1',
      title: 'Informasi Akun',
      icon: <Ionicons name="person-outline" size={22} color={Colors.primary} />,
      screen: 'AccountInformation',
    },
    {
      id: '2',
      title: 'Keamanan & Kata Sandi',
      icon: <Feather name="lock" size={22} color={Colors.primary} />,
      screen: 'PasswordSecurity',
    },
    {
      id: '3',
      title: 'Tentang Renang SMPedia',
      icon: <Ionicons name="information-circle-outline" size={22} color={Colors.primary} />,
      screen: 'About',
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Keluar dari Aplikasi',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Keluar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              props?.navigation.replace('AuthScreen');
            } catch (error) {
              console.log('Error clearing AsyncStorage:', error);
              Alert.alert('Error', 'Gagal logout. Silakan coba lagi.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.menuItemCard}
        activeOpacity={0.8}
        onPress={() => item.screen && props?.navigation.navigate(item.screen)}
      >
        <View style={styles.menuItemLeft}>
          <View style={styles.iconCircle}>{item.icon}</View>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
        </View>
        <Feather name="chevron-right" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header with Gradient and Wave */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={Gradients.header}
          start={Gradients.headerCoords.start}
          end={Gradients.headerCoords.end}
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Profil Pengguna</Text>
              <Text style={styles.userNameText}>{userData?.nama || 'Pengguna SMPedia'}</Text>
              {userData?.no_hp ? (
                <Text style={styles.userPhoneText}>{userData.no_hp}</Text>
              ) : null}
            </View>
            <SwimmerLogo size={58} />
          </View>
          <WaveBottom color={Colors.background} height={28} />
        </LinearGradient>
      </View>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.sectionHeaderTitle}>Pengaturan Akun</Text>
        }
        ListFooterComponent={
          <>
            <TouchableOpacity
              style={styles.logoutCard}
              activeOpacity={0.85}
              onPress={handleLogout}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                  <Feather name="log-out" size={20} color={Colors.danger} />
                </View>
                <Text style={[styles.menuItemTitle, { color: Colors.danger }]}>
                  Keluar (Log Out)
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.danger} />
            </TouchableOpacity>

            <View style={{ marginTop: 24 }}>
              <LogoBPI />
            </View>
            <View style={{ height: 100 }} />
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 55 : (StatusBar.currentHeight || 28) + 16,
    paddingBottom: 40,
    paddingHorizontal: 22,
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  userNameText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    marginTop: 2,
  },
  userPhoneText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  menuItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    ...Shadows.subtle,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F8FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 12,
    ...Shadows.subtle,
  },
});

export default ProfileUser;
