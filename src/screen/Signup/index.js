import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

export default function Signup(props) {
  const [noHp, setNoHp] = useState('');
  const [nama, setNama] = useState('');
  const [passworduser, setPassworduser] = useState('');
  const [ulangiPassword, setUlangiPassword] = useState('');
  const [idPertanyaan, setIdPertanyaan] = useState('');
  const [jawaban, setJawaban] = useState('');
  const [pertanyaanList, setPertanyaanList] = useState([]);
  

useEffect(() => {
  const fetchPertanyaan = async () => {
    try {
      const username = 'made';
      const password = 'made_in_bali';
      const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

      const response = await axios.get('https://smpedia.creativeku.my.id/api/v1/pertanyaan_keamanan', {
        headers: {
          Authorization: basicAuth,
        },
      });

      console.log('Data pertanyaan:', response.data.data);
      setPertanyaanList(response.data.data); // ✅ ambil isi array dari data
    } catch (error) {
      console.error('Error fetching pertanyaan keamanan:', error);
      Alert.alert('Error', 'Gagal mengambil daftar pertanyaan keamanan.');
    }
  };

  fetchPertanyaan();
}, []);


const handleSignup = async () => {
  try {
    const username = 'made';
    const password = 'made_in_bali';
    const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    // Gunakan URLSearchParams untuk encode x-www-form-urlencoded
    const formBody = new URLSearchParams();
    formBody.append('no_hp', noHp.trim());
    formBody.append('nama', nama.trim());
    formBody.append('password', passworduser);
    formBody.append('ulangi_password', ulangiPassword);
    formBody.append('id_pertanyaan_keamanan', idPertanyaan.toString());
    formBody.append('jawaban_pertanyaan_keamanan', jawaban.trim());

    console.log("Form Data Dikirim:", formBody.toString());

    const response = await axios.post(
      'https://smpedia.creativeku.my.id/api/v1/akun_pengguna/daftar',
      formBody.toString(),
      {
        headers: {
          Authorization: basicAuth,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('Signup success:', response.data);
    Alert.alert('Sukses', 'Akun berhasil dibuat!');
    props.navigation.navigate('Signin');
  } catch (error) {
    console.error('Signup error:', error.response?.data || error.message);
    Alert.alert('Gagal', error.response?.data?.meta?.message || 'Terjadi kesalahan.');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Daftar Akun</Text>

      <TextInput
        style={styles.input}
        placeholder="No HP"
        value={noHp}
        onChangeText={setNoHp}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Nama"
        value={nama}
        onChangeText={setNama}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={passworduser}
        onChangeText={setPassworduser}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Ulangi Password"
        value={ulangiPassword}
        onChangeText={setUlangiPassword}
        secureTextEntry
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={idPertanyaan}
          onValueChange={(itemValue) => setIdPertanyaan(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Pilih Pertanyaan Keamanan" value="" />
          {pertanyaanList.map((item) => (
            <Picker.Item
              key={item.id}
              label={item.nama_pertanyaan_keamanan}
              value={item.id}
            />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Jawaban Pertanyaan Keamanan"
        value={jawaban}
        onChangeText={setJawaban}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Daftar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: -150,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
  },
  pickerContainer: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#2980b9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
