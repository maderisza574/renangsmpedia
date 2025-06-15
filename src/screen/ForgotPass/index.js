import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Buffer } from "buffer";

const CustomPicker = ({ data, selectedLabel, onSelect }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={() => setVisible(true)}
      >
        <Text style={!selectedLabel ? styles.placeholder : styles.selectedText}>
          {selectedLabel || "Pilih Pertanyaan Keamanan"}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              {data.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.item}
                  onPress={() => {
                    onSelect(item.id, item.nama_pertanyaan_keamanan);
                    setVisible(false);
                  }}
                >
                  <Text>{item.nama_pertanyaan_keamanan}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setVisible(false)}
            >
              <Text style={{ color: "white" }}>Batal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default function ForgotPass({ navigation }) {
  const [noHp, setNoHp] = useState("");
  const [pertanyaanList, setPertanyaanList] = useState([]);
  const [idPertanyaan, setIdPertanyaan] = useState("");
  const [labelPertanyaan, setLabelPertanyaan] = useState("");
  const [jawaban, setJawaban] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPertanyaan, setLoadingPertanyaan] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [idAkunPengguna, setIdAkunPengguna] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [ulangiPasswordBaru, setUlangiPasswordBaru] = useState("");

  useEffect(() => {
    const fetchPertanyaan = async () => {
      try {
        const basicAuth =
          "Basic " + Buffer.from("made:made_in_bali").toString("base64");
        const response = await axios.get(
          "https://smpedia.creativeku.my.id/api/v1/pertanyaan_keamanan",
          {
            headers: { Authorization: basicAuth },
          }
        );
        if (response.data && Array.isArray(response.data.data)) {
          setPertanyaanList(response.data.data);
        }
      } catch (error) {
        Alert.alert("Error", "Gagal memuat pertanyaan keamanan");
      } finally {
        setLoadingPertanyaan(false);
      }
    };

    fetchPertanyaan();
  }, []);

  const handleSubmit = async () => {
    if (!noHp || !jawaban || !idPertanyaan) {
      Alert.alert("Peringatan", "Semua field wajib diisi.");
      return;
    }

    setLoading(true);
    const basicAuth =
      "Basic " + Buffer.from("made:made_in_bali").toString("base64");

    const payload = new URLSearchParams();
    payload.append("no_hp", noHp.trim());
    payload.append("id_pertanyaan_keamanan", idPertanyaan);
    payload.append("jawaban_pertanyaan_keamanan", jawaban);

    try {
      const response = await axios.post(
        "https://smpedia.creativeku.my.id/api/v1/akun_pengguna/lupa_password",
        payload.toString(),
        {
          headers: {
            Authorization: basicAuth,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      Alert.alert(
        "Sukses",
        response.data.meta?.message || "Permintaan berhasil."
      );

      const id = response.data?.data?.id;
      if (id) {
        setIdAkunPengguna(id);
        setShowPasswordForm(true);
      }
    } catch (error) {
      const message =
        error.response?.data?.meta?.message || "Terjadi kesalahan";
      Alert.alert("Gagal", message);
    } finally {
      setLoading(false);
    }
  };

  const handleUbahPassword = async () => {
    if (!passwordBaru || !ulangiPasswordBaru) {
      Alert.alert("Peringatan", "Mohon isi kedua kolom password.");
      return;
    }

    if (passwordBaru !== ulangiPasswordBaru) {
      Alert.alert("Peringatan", "Password tidak cocok.");
      return;
    }

    setLoading(true);
    const basicAuth =
      "Basic " + Buffer.from("made:made_in_bali").toString("base64");

    const payload = new URLSearchParams();
    payload.append("id_akun_pengguna", idAkunPengguna);
    payload.append("password", passwordBaru);
    payload.append("ulangi_password", ulangiPasswordBaru);

    try {
      const response = await axios.post(
        "https://smpedia.creativeku.my.id/api/v1/akun_pengguna/ubah_password",
        payload.toString(),
        {
          headers: {
            Authorization: basicAuth,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      Alert.alert(
        "Sukses",
        response.data.meta?.message || "Password berhasil diubah."
      );
      navigation.goBack();
    } catch (error) {
      const message =
        error.response?.data?.meta?.message || "Gagal mengubah password";
      Alert.alert("Gagal", message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPertanyaan) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
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

      <CustomPicker
        data={pertanyaanList}
        selectedLabel={labelPertanyaan}
        onSelect={(id, label) => {
          setIdPertanyaan(id);
          setLabelPertanyaan(label);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Jawaban Pertanyaan"
        value={jawaban}
        onChangeText={setJawaban}
      />

      {!showPasswordForm && (
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Kirim</Text>
          )}
        </TouchableOpacity>
      )}

      {showPasswordForm && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Password Baru"
            secureTextEntry
            value={passwordBaru}
            onChangeText={setPasswordBaru}
          />
          <TextInput
            style={styles.input}
            placeholder="Ulangi Password Baru"
            secureTextEntry
            value={ulangiPasswordBaru}
            onChangeText={setUlangiPasswordBaru}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleUbahPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Ubah Password</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2980b9",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    color: "#000",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  placeholder: {
    color: "#999",
  },
  selectedText: {
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "60%",
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cancelBtn: {
    marginTop: 10,
    backgroundColor: "#888",
    padding: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#2980b9",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
