import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import axios from "axios";
import { Buffer } from "buffer";

const { width } = Dimensions.get("window");

const CustomPicker = ({ data, selectedLabel, onSelect }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{width: Dimensions.get('window').width, paddingHorizontal: 10}}>
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

export default function Signup(props) {
  const [noHp, setNoHp] = useState("");
  const [nama, setNama] = useState("");
  const [passworduser, setPassworduser] = useState("");
  const [ulangiPassword, setUlangiPassword] = useState("");
  const [idPertanyaan, setIdPertanyaan] = useState("");
  const [labelPertanyaan, setLabelPertanyaan] = useState("");
  const [jawaban, setJawaban] = useState("");
  const [pertanyaanList, setPertanyaanList] = useState([]);

  useEffect(() => {
    const fetchPertanyaan = async () => {
      try {
        const username = "made";
        const password = "made_in_bali";
        const basicAuth =
          "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

        const response = await axios.get(
          "https://smpedia.creativeku.my.id/api/v1/pertanyaan_keamanan",
          {
            headers: {
              Authorization: basicAuth,
            },
          }
        );

        setPertanyaanList(response.data.data);
      } catch (error) {
        console.error("Error fetching pertanyaan keamanan:", error);
        Alert.alert("Error", "Gagal mengambil daftar pertanyaan keamanan.");
      }
    };

    fetchPertanyaan();
  }, []);

  const handleSignup = async () => {
    try {
      const username = "made";
      const password = "made_in_bali";
      const basicAuth =
        "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

      const formBody = new URLSearchParams();
      formBody.append("no_hp", noHp.trim());
      formBody.append("nama", nama.trim());
      formBody.append("password", passworduser);
      formBody.append("ulangi_password", ulangiPassword);
      formBody.append("id_pertanyaan_keamanan", idPertanyaan.toString());
      formBody.append("jawaban_pertanyaan_keamanan", jawaban.trim());

      const response = await axios.post(
        "https://smpedia.creativeku.my.id/api/v1/akun_pengguna/daftar",
        formBody.toString(),
        {
          headers: {
            Authorization: basicAuth,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      Alert.alert("Sukses", "Akun berhasil dibuat!");
      props.navigation.navigate("Signin");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      Alert.alert(
        "Gagal",
        error.response?.data?.meta?.message || "Terjadi kesalahan."
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Daftar Akun</Text>

      <TextInput
        style={styles.input}
        placeholder="No HP"
        value={noHp}
        placeholderTextColor="#999"
        onChangeText={setNoHp}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Nama"
        placeholderTextColor="#999"
        value={nama}
        onChangeText={setNama}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={passworduser}
        onChangeText={setPassworduser}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Ulangi Password"
        placeholderTextColor="#999"
        value={ulangiPassword}
        onChangeText={setUlangiPassword}
        secureTextEntry
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
        placeholder="Jawaban Pertanyaan Keamanan"
        placeholderTextColor="#999"
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2980b9",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
  },
  pickerContainer: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  placeholder: {
    color: "#999",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectedText: {
    color: "#000",
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    width: "100%",
    height: 50,
    backgroundColor: "#2980b9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
