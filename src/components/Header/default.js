import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function DefaultHeader(props) {
  const goHome = () => {
    props.navigation.navigate("Main");
  };

  return (
    <View style={styles.header}>
      {/* Tombol Home di kiri */}
      <TouchableOpacity onPress={goHome} style={styles.section}>
        <Feather name="home" size={24} color="black" />
      </TouchableOpacity>

      {/* Spacer (kalau nanti mau tambahin judul di tengah) */}
      <View style={styles.sectionCenter} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 25,
    backgroundColor: "white",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionCenter: {
    flex: 1,
  },
});
