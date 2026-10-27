import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { Buffer } from 'buffer';

import WaveBottom from '../../components/WaveBottom';
import SwimmerLogo from '../../components/SwimmerLogo';
import LogoBPI from '../LogoBPI';
import { Colors, Gradients, Shadows } from '../../constants/theme';

export default function ComponentProfile() {
  const [dataProfile, setDataProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const basicAuth = 'Basic ' + Buffer.from('made:made_in_bali').toString('base64');
  const urlProfile = 'https://smpedia.creativeku.my.id/api/v1/profile';

  useEffect(() => {
    const getDataProfile = async () => {
      try {
        const response = await axios.get(urlProfile, {
          headers: { Authorization: basicAuth },
        });
        setDataProfile(response.data.data);
      } catch (error) {
        console.error('Gagal ambil data profile:', error);
      } finally {
        setLoading(false);
      }
    };
    getDataProfile();
  }, []);

  const handleToggleDesc = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowFullDesc(!showFullDesc);
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
            <View>
              <Text style={styles.headerTitle}>Tentang Aplikasi</Text>
              <Text style={styles.headerSub}>SMPedia Pembelajaran Renang</Text>
            </View>
            <SwimmerLogo size={52} />
          </View>
          <WaveBottom color={Colors.background} height={28} />
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : dataProfile ? (
          <View style={styles.card}>
            {dataProfile.gambar ? (
              <Image
                source={{ uri: dataProfile.gambar }}
                style={styles.image}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.placeholderImg}>
                <SwimmerLogo size={70} />
              </View>
            )}

            <Text style={styles.title}>{dataProfile.judul}</Text>
            <Text style={styles.description}>
              {showFullDesc
                ? dataProfile.deskripsi
                : truncateText(dataProfile.deskripsi, 180)}
            </Text>

            {dataProfile.deskripsi && dataProfile.deskripsi.length > 180 && (
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  onPress={handleToggleDesc}
                  style={styles.button}
                  activeOpacity={0.85}
                >
                  <Text style={styles.buttonText}>
                    {showFullDesc ? 'Lebih Sedikit' : 'Selengkapnya'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        ) : null}

        <View style={{ marginTop: 20 }}>
          <LogoBPI />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

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
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 20,
    alignItems: 'center',
    ...Shadows.card,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginBottom: 16,
  },
  placeholderImg: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.primaryButton,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    ...Shadows.glow,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
});
