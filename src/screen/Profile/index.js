import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';

export default function ComponentProfile() {
  const [dataProfile, setDataProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#2980b9" />
      </View>
    );
  }

  if (!dataProfile) return null;

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: dataProfile.gambar }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{dataProfile.judul}</Text>
      <Text style={styles.description}>
        {showFullDesc ? dataProfile.deskripsi : truncateText(dataProfile.deskripsi, 120)}
      </Text>

      {/* Tombol Selengkapnya / Lebih Sedikit */}
      {dataProfile.deskripsi.length > 120 && (
        <TouchableOpacity
          onPress={() => setShowFullDesc(!showFullDesc)}
          style={styles.button}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {showFullDesc ? 'Lebih Sedikit' : 'Selengkapnya'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#2980b9',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
