import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import axios from "axios";
import { Buffer } from "buffer";

export default function ComponentProfile() {
  const [dataProfile, setDataProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const basicAuth =
    "Basic " + Buffer.from("made:made_in_bali").toString("base64");
  const urlProfile = "https://smpedia.creativeku.my.id/api/v1/profile";

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
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

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
      <Image
        source={{ uri: dataProfile.gambar }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{dataProfile.judul}</Text>
      <Text style={styles.description}>
        {showFullDesc
          ? dataProfile.deskripsi
          : truncateText(dataProfile.deskripsi, 120)}
      </Text>

      {dataProfile.deskripsi.length > 120 && (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            onPress={handleToggleDesc}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {showFullDesc ? "Lebih Sedikit" : "Selengkapnya"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    marginTop: 100,
    margin: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  image: {
    width: "80",
    height: 80,
    borderRadius: 12,
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#606060",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    marginTop: 4,
    backgroundColor: "#3498db",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    shadowColor: "#3498db",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
});
