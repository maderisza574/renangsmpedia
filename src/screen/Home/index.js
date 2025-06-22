import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  ImageBackground,
  Linking,
  Animated,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Buffer } from 'buffer';
import { Entypo } from '@expo/vector-icons';
import ComponentProfile from "../Profile"
import Feather from "@expo/vector-icons/Feather";

export default function Home(props) {
  const HEADER_HEIGHT = 250;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataSekolah, setDataSekolah] = useState([]);
  const [dataMapel, setDataMapel] = useState([]);
  const [dataMenu, setDataMenu] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSubMenu, setDataSubMenu] = useState([]);
  const [modalTitle, setModalTitle] = useState(''); // untuk judul
  const [modalLevel, setModalLevel] = useState('submenu'); // submenu atau subsubmenu
  const [selectedSubSubMenu, setSelectedSubSubMenu] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  console.log("INI DATA SUB SUB MENU", selectedSubSubMenu);
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`; // pastel tone
  };


  console.log("INI DATA Menu", dataMenu);

  const url = 'https://smpedia.creativeku.my.id/api/v1/sekolah';
  const urlMapel = 'https://smpedia.creativeku.my.id/api/v1/mapel'
  const urlMenu= 'https://smpedia.creativeku.my.id/api/v1/menu';
  const basicAuth = 'Basic ' + Buffer.from('made:made_in_bali').toString('base64');


  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.multiGet(['username', 'password', 'userData']);
      
      const username = data[0][1];
      const password = data[1][1];
      const parsedUserData = JSON.parse(data[2][1]);
    
      console.log('Username:', username);
      console.log('Password:', password);
      console.log('UserData:', parsedUserData);

      setUserData(parsedUserData);
    } catch (e) {
      console.error('Failed to load user data:', e);
    } finally {
      setLoading(false);
    }
  };

   const getSekolah = async () => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: basicAuth,
        },
      });

      if (response.status === 200) {
        const sekolahData = response.data.data;
        setDataSekolah(sekolahData); // ⬅️ Simpan ke state
      } else {
        Alert.alert('Gagal mengambil data', response.data.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.meta?.message || 'Terjadi kesalahan pada server';
        Alert.alert('Gagal', message);
        console.log('Full error response:', JSON.stringify(error.response.data, null, 2));
      } else {
        Alert.alert('Error', 'Gagal terhubung ke server');
        console.error('Network error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const getMapel = async () => {
    try {
      const response = await axios.get(urlMapel, {
        headers: {
          Authorization: basicAuth,
        },
      });

      if (response.status === 200) {
        const mapelData = response.data.data;
        setDataMapel(mapelData); // ⬅️ Simpan ke state
      } else {
        Alert.alert('Gagal mengambil data', response.data.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.meta?.message || 'Terjadi kesalahan pada server';
        Alert.alert('Gagal', message);
        console.log('Full error response:', JSON.stringify(error.response.data, null, 2));
      } else {
        Alert.alert('Error', 'Gagal terhubung ke server');
        console.error('Network error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const getMenu = async () => {
    try {
      const response = await axios.get(urlMenu, {
        headers: {
          Authorization: basicAuth,
        },
      });

      if (response.status === 200) {
        const menuData = response.data.data;
        const menuWithColors = menuData.map(item => ({
        ...item,
        backgroundColor: getRandomPastelColor(),
      }));

      setDataMenu(menuWithColors); // ⬅️ Simpan ke state
      } else {
        Alert.alert('Gagal mengambil data', response.data.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.meta?.message || 'Terjadi kesalahan pada server';
        Alert.alert('Gagal', message);
        console.log('Full error response:', JSON.stringify(error.response.data, null, 2));
      } else {
        Alert.alert('Error', 'Gagal terhubung ke server');
        console.error('Network error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  }

const getSubMenu = async (id) => {
  try {
    const response = await axios.get(`https://smpedia.creativeku.my.id/api/v1/sub_menu/${id}`, {
      headers: { Authorization: basicAuth },
    });

    if (response.status === 200) {
      setDataSubMenu(response.data.data);
      setModalTitle('Submenu');
      setModalLevel('submenu');
      setModalVisible(true);
    }
  } catch (error) {
    Alert.alert('Gagal', 'Gagal memuat submenu');
  }
};
const getSubSubMenu = async (id) => {
  try {
    const response = await axios.get(`https://smpedia.creativeku.my.id/api/v1/sub_sub_menu/${id}`, {
      headers: { Authorization: basicAuth },
    });

    if (response.status === 200) {
      setDataSubMenu(response.data.data); // ganti data lama dengan data subsubmenu
      setModalTitle('Sub-submenu');
      setModalLevel('subsubmenu');
    }
  } catch (error) {
    Alert.alert('Gagal', 'Gagal memuat sub-submenu');
  }
};



  useEffect(() => {
    loadUserData();
    getSekolah();
    getMapel();
    getMenu();
  }, []);

  const onRefresh = async () => {
  setRefreshing(true);
  await getMenu();     // atau fungsi lain sesuai kebutuhan seperti getSekolah()
  setRefreshing(false);
};




  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        <View style={{ flex: 1, backgroundColor: "#bbeaff", padding: 20 }}>
          <View style={{ flex: 1 }}>
            <FlatList
              data={
                modalLevel === "submenu" || modalLevel === "subsubmenu"
                  ? dataSubMenu
                  : []
              }
              keyExtractor={(item, index) =>
                item?.id?.toString() || index.toString()
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    if (modalLevel === "submenu") {
                      getSubSubMenu(item.id);
                    } else {
                      setSelectedSubSubMenu(item);
                      setModalLevel("detail");
                    }
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Image
                      source={{
                        uri: item.gambar_sub_menu || item.gambar_sub_sub_menu,
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        marginRight: 10,
                        borderRadius: 5,
                      }}
                      resizeMode="contain"
                    />
                    <View style={{ flexShrink: 1 }}>
                      <Text style={{ color: "black", fontSize: 16 }}>
                        {item.nama_sub_menu || item.nama_sub_sub_menu}
                      </Text>
                      {item.deskripsi_sub_menu ? (
                        <Text
                          style={{
                            fontSize: 10,
                            color: "grey",
                            marginTop: 2,
                          }}
                          numberOfLines={2}
                        >
                          {item.deskripsi_sub_menu}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <Feather name="arrow-right-circle" size={24} color="black" />
                </TouchableOpacity>
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListHeaderComponent={() =>
                modalLevel === "detail" && selectedSubSubMenu ? (
                  <View
                    style={{
                      padding: 20,
                      backgroundColor: "white",
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  >
                    <ImageBackground
                      source={{ uri: selectedSubSubMenu.gambar_sub_sub_menu }}
                      style={{
                        width: "100%",
                        height: 200,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                      imageStyle={{ opacity: 0.3 }}
                    >
                      <Text
                        style={{
                          fontSize: 30,
                          fontWeight: "bold",
                          color: "#000",
                        }}
                      >
                        {selectedSubSubMenu.nama_sub_sub_menu}
                      </Text>
                    </ImageBackground>

                    {selectedSubSubMenu.deskripsi_sub_sub_menu && (
                      <Text
                        style={{
                          marginTop: 10,
                          textAlign: "justify",
                          fontSize: 16,
                        }}
                      >
                        {selectedSubSubMenu.deskripsi_sub_sub_menu}
                      </Text>
                    )}

                    {selectedSubSubMenu.link_video && (
                      <Text
                        style={{ marginTop: 10, color: "blue", fontSize: 16 }}
                        onPress={() =>
                          props.navigation.navigate("WebViewScreen", {
                            url: selectedSubSubMenu.link_video,
                          })
                        }
                      >
                        🎥 Tonton Video
                      </Text>
                    )}

                    {selectedSubSubMenu.link_lainnya && (
                      <Text
                        style={{ marginTop: 10, color: "blue" }}
                        onPress={() =>
                          Linking.openURL(selectedSubSubMenu.link_lainnya)
                        }
                      >
                        🔗 Buka Link Latihan
                      </Text>
                    )}

                    {selectedSubSubMenu.file &&
                      selectedSubSubMenu.file.length > 0 && (
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#007bff",
                            padding: 10,
                            marginTop: 10,
                            borderRadius: 6,
                          }}
                          onPress={() =>
                            props.navigation.navigate("webviewdrive", {
                              url: selectedSubSubMenu.file[0].file_path, // atau file yang dipilih
                            })
                          }
                        >
                          <Text style={{ color: "#fff", textAlign: "center" }}>
                            📄 Lihat File:{" "}
                            {selectedSubSubMenu.file[0].judul_file}
                          </Text>
                        </TouchableOpacity>
                      )}

                    {selectedSubSubMenu.item?.length > 0 && (
                      <View style={{ marginTop: 10 }}>
                        {selectedSubSubMenu.item.map((itm, idx) => (
                          <View
                            key={idx}
                            style={{
                              marginBottom: 15,
                              backgroundColor: "#f5f5f5",
                              padding: 10,
                              borderRadius: 10,
                            }}
                          >
                            <Image
                              source={{
                                uri:
                                  itm.gambar_item ||
                                  "https://via.placeholder.com/150",
                              }}
                              style={{
                                width: "100%",
                                height: 300,
                                borderRadius: 10,
                              }}
                            />
                            <Text style={{ fontWeight: "bold", marginTop: 5 }}>
                              {itm.judul}
                            </Text>
                            {itm.deskripsi && <Text>{itm.deskripsi}</Text>}
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ) : null
              }
            />
          </View>

          {/* Tombol di bawah FlatList */}
          <TouchableOpacity
            onPress={() => {
              if (modalLevel === "detail") {
                setModalLevel("subsubmenu");
                setSelectedSubSubMenu(null);
              } else {
                setModalVisible(false);
              }
            }}
            style={{
              marginTop: 10,
              alignSelf: "center",
            }}
          >
            <LinearGradient
              colors={["#2980b9", "#6dd5fa"]}
              style={{
                width: 300,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {modalLevel === "detail" ? "⬅ Kembali" : "Tutup"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Header absolute */}
      <LinearGradient
        colors={["#2980b9", "#6dd5fa"]}
        style={[styles.containerTop, { height: HEADER_HEIGHT }]}
      >
        <View
          style={{
            flexDirection: "row",
            paddingTop: 85,
            paddingLeft: 20,
            paddingBottom: 20,
          }}
        >
          {/* <View>
            <Image
              source={require('../../../assets/images/user.jpg')}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 10,
              }}
            />
          </View> */}
          <View style={{ marginTop: -20 }}>
            <Text style={{ fontSize: 30, color: "white", fontWeight: "bold" }}>
              Welcome Back,
            </Text>
            <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
              {userData?.nama || "-"}
            </Text>
            <Text
              style={{ fontSize: 16, color: "white", fontWeight: "medium" }}
            >
              {dataSekolah?.nama_sekolah || "-"}
            </Text>
            <Text
              style={{ fontSize: 16, color: "white", fontWeight: "medium" }}
            >
              {dataMapel?.nama_mapel || "-"}
            </Text>
          </View>
          <View style={{ marginTop: -30, marginLeft: 20 }}>
            <Image
              source={{ uri: dataMapel.gambar }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 25,
              }}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Konten di bawah header */}
      <View style={{ marginTop: 250, height: Dimensions.get("window") - 300 }}>
        <FlatList
          style={{ marginTop: -20 }}
          data={[]} // data utama kosong, fokus ke footer
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#9Bd35A", "#689F38"]}
              progressBackgroundColor="#fff"
            />
          }
          ListFooterComponent={
            <View style={styles.containerBottom}>
              <Text
                style={{
                  color: "black",
                  fontSize: 16,
                  fontWeight: "bold",
                  marginTop: -100,
                  marginBottom: 20,
                }}
              >
                Pilihan Pembelajaran
              </Text>

              <FlatList
                data={dataMenu}
                keyExtractor={(item) => item.id.toString()}
                key={2} // ini HARUS unik kalau kamu ubah numColumns
                numColumns={2} // <- buat grid 2 kolom
                scrollEnabled={false}
                columnWrapperStyle={{ justifyContent: "space-between" }} // atur spacing antar kolom
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => getSubMenu(item.id)}
                    style={{
                      flex: 1,
                      margin: 5,
                      borderRadius: 8,
                      overflow: "hidden",
                      backgroundColor: item.backgroundColor,
                      padding: 10,
                      alignItems: "center",
                    }}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: item.gambar_menu }}
                      style={{ width: 150, height: 70, marginBottom: 8 }}
                      resizeMode="cover"
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "black",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {item.nama_menu}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: "grey",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      {item.deskripsi_menu}
                    </Text>
                  </TouchableOpacity>
                )}
                ListFooterComponent={
                  <>
                    <View style={{ marginTop: 10 }}>
                      <ComponentProfile />
                    </View>
                  </>
                }
                ListEmptyComponent={<Text>Menu belum tersedia</Text>}
              />
              <View style={{ marginBottom: 200 }} />
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    containerTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 1,
    elevation: 5, 
  
  },

  headerText: {
    color: 'white',
    fontSize: 20,
    paddingTop: 40,
  },
  containerBottom: {
    backgroundColor: 'white',
    minHeight: Dimensions.get('window').height,
    paddingTop: 150,
    paddingHorizontal: 15,
    
  },
});
