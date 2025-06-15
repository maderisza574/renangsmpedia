import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { Buffer } from 'buffer';

export default function ForgotPassr({ navigation }) {
  const [noHp, setNoHp] = useState('');
  const [pertanyaanList, setPertanyaanList] = useState([]);
  const [idPertanyaan, setIdPertanyaan] = useState('');
  const [jawaban, setJawaban] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPertanyaan, setLoadingPertanyaan] = useState(true);

  // Ambil pertanyaan keamanan dari API
  useEffect(() => {
    const fetchPertanyaan = async () => {
      try {
        const basicAuth = 'Basic ' + Buffer.from('made:made_in_bali').toString('base64');
        const response = await axios.get(
          'https://smpedia.creativeku.my.id/api/v1/pertanyaan_keamanan',
          {
            headers: { Authorization: basicAuth },
          }
        );
        if (response.data && Array.isArray(response.data.data)) {
          setPertanyaanList(response.data.data);
          if (response.data.data.length > 0) {
            setIdPertanyaan(response.data.data[0].id.toString());
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Gagal memuat pertanyaan keamanan');
      } finally {
        setLoadingPertanyaan(false);
      }
    };

    fetchPertanyaan();
  }, []);

  const handleSubmit = async () => {
    if (!noHp || !jawaban || !idPertanyaan) {
      Alert.alert('Peringatan', 'Semua field wajib diisi.');
      return;
    }

    setLoading(true);
    const basicAuth = 'Basic ' + Buffer.from('made:made_in_bali').toString('base64');

    const payload = new URLSearchParams();
    payload.append('no_hp', noHp.trim());
    payload.append('id_pertanyaan_keamanan', idPertanyaan);
    payload.append('jawaban_pertanyaan_keamanan', jawaban);

    try {
      const response = await axios.post(
        'https://smpedia.creativeku.my.id/api/v1/akun_pengguna/lupa_password',
        payload.toString(),
        {
          headers: {
            Authorization: basicAuth,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      Alert.alert('Sukses', response.data.meta?.message || 'Permintaan berhasil.');
      navigation.goBack();
    } catch (error) {
      const message = error.response?.data?.meta?.message || 'Terjadi kesalahan';
      Alert.alert('Gagal', message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPertanyaan) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2980b9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lupa Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Nomor HP"
        keyboardType="phone-pad"
        value={noHp}
        onChangeText={setNoHp}
      />

      <Text style={styles.label}>Pertanyaan Keamanan:</Text>
      <Picker
        selectedValue={idPertanyaan}
        onValueChange={(itemValue) => setIdPertanyaan(itemValue)}
        style={styles.picker}
      >
        {pertanyaanList.map((item) => (
          <Picker.Item key={item.id} label={item.pertanyaan} value={item.id.toString()} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Jawaban Pertanyaan"
        value={jawaban}
        onChangeText={setJawaban}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Kirim</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  picker: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2980b9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
