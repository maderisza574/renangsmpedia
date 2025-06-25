import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import axios from "axios";
import { Buffer } from "buffer";

export default function LogoBPI() {
  const [dataProfile, setDataProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const basicAuth =
    "Basic " + Buffer.from("made:made_in_bali").toString("base64");
  const urlProfile = "https://smpedia.creativeku.my.id/api/v1/sekolah";

  useEffect(() => {
    const getDataProfile = async () => {
      try {
        const response = await axios.get(urlProfile, {
          headers: { Authorization: basicAuth },
        });
        setDataProfile(response.data.data);
      } catch (error) {
        console.error("Gagal ambil data profile:", error);
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

  return (
    <View style={styles.card}>
      {/* <Text style={styles.title}>{dataProfile.nama_sekolah}</Text> */}
      <Image
        source={{ uri: dataProfile.logo_bpi_path }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 12,
    // backgroundColor: "#ffffff",
    // borderRadius: 12,
    // padding: 15,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 4 },
    // shadowRadius: 8,
    // elevation: 5,
    alignItems: "center", // rata tengah isi
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 12,
    textAlign: "center",
  },
  image: {
    width: "50%",
    height: 80,
    borderRadius: 12,
  },
});
