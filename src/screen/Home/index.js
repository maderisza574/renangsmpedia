import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  Linking,
  RefreshControl,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Buffer } from 'buffer';
import {
  Feather,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

import WaveBottom from '../../components/WaveBottom';
import LogoBPI from '../LogoBPI';
import { Colors, Shadows } from '../../constants/theme';

const { width } = Dimensions.get('window');
const GRID_CARD_WIDTH = (width - 32 - 20) / 3;

export default function Home(props) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataSekolah, setDataSekolah] = useState([]);
  const [dataMapel, setDataMapel] = useState([]);
  const [dataMenu, setDataMenu] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Submenu & Detail Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSubMenu, setDataSubMenu] = useState([]);
  const [modalTitle, setModalTitle] = useState('Pilihan Pembelajaran');
  const [modalLevel, setModalLevel] = useState('submenu'); // 'submenu', 'subsubmenu', 'detail'
  const [selectedSubSubMenu, setSelectedSubSubMenu] = useState(null);
  const [showWebView, setShowWebView] = useState(false);

  // Additional Feature Modals
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [latihanModalVisible, setLatihanModalVisible] = useState(false);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [jadwalModalVisible, setJadwalModalVisible] = useState(false);
  const [materiMenuModalVisible, setMateriMenuModalVisible] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const urlSekolah = 'https://smpedia.creativeku.my.id/api/v1/sekolah';
  const urlMapel = 'https://smpedia.creativeku.my.id/api/v1/mapel';
  const urlMenu = 'https://smpedia.creativeku.my.id/api/v1/menu';
  const basicAuth = 'Basic ' + Buffer.from('made:made_in_bali').toString('base64');

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.multiGet(['username', 'password', 'userData']);
      if (data[2][1]) {
        const parsedUserData = JSON.parse(data[2][1]);
        setUserData(parsedUserData);
      }
    } catch (e) {
      console.error('Failed to load user data:', e);
    } finally {
      setLoading(false);
    }
  };

  const getSekolah = async () => {
    try {
      const response = await axios.get(urlSekolah, {
        headers: { Authorization: basicAuth },
      });
      if (response.status === 200) {
        setDataSekolah(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching sekolah:', error.message);
    }
  };

  const getMapel = async () => {
    try {
      const response = await axios.get(urlMapel, {
        headers: { Authorization: basicAuth },
      });
      if (response.status === 200) {
        setDataMapel(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching mapel:', error.message);
    }
  };

  const getMenu = async () => {
    try {
      const response = await axios.get(urlMenu, {
        headers: { Authorization: basicAuth },
      });
      if (response.status === 200) {
        setDataMenu(response.data.data || []);
      }
    } catch (error) {
      console.log('Error fetching menu:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSubMenu = async (id, menuName) => {
    try {
      const response = await axios.get(`https://smpedia.creativeku.my.id/api/v1/sub_menu/${id}`, {
        headers: { Authorization: basicAuth },
      });
      if (response.status === 200) {
        setDataSubMenu(response.data.data);
        setModalTitle(menuName || 'Submenu');
        setModalLevel('submenu');
        setMateriMenuModalVisible(false);
        setModalVisible(true);
      }
    } catch (error) {
      Alert.alert('Gagal', 'Gagal memuat submateri');
    }
  };

  const getSubSubMenu = async (id, subMenuName) => {
    try {
      const response = await axios.get(`https://smpedia.creativeku.my.id/api/v1/sub_sub_menu/${id}`, {
        headers: { Authorization: basicAuth },
      });
      if (response.status === 200) {
        setDataSubMenu(response.data.data);
        setModalTitle(subMenuName || 'Detail Materi');
        setModalLevel('subsubmenu');
      }
    } catch (error) {
      Alert.alert('Gagal', 'Gagal memuat detail materi');
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
    await Promise.all([loadUserData(), getSekolah(), getMapel(), getMenu()]);
    setRefreshing(false);
  };

  const displayName = userData?.nama || 'Andi Pratama';
  const displayClass = userData?.kelas || '8A';
  const displaySchool = dataSekolah?.nama_sekolah || 'SMP Negeri 1';

  // 6 Action Cards definition matching the design
  const gridMenuItems = [
    {
      id: 'materi',
      title: 'Materi\nPembelajaran',
      icon: 'book-outline',
      type: 'Ionicons',
      action: () => setMateriMenuModalVisible(true),
    },
    {
      id: 'latihan',
      title: 'Latihan &\nVideo Tutorial',
      icon: 'swim',
      type: 'MaterialCommunityIcons',
      action: () => setLatihanModalVisible(true),
    },
    {
      id: 'tugas',
      title: 'Tugas & Quiz',
      icon: 'clipboard-check-outline',
      type: 'MaterialCommunityIcons',
      action: () => {
        setQuizSubmitted(false);
        setQuizModalVisible(true);
      },
    },
    {
      id: 'progress',
      title: 'Progress\nSiswa',
      icon: 'trophy-outline',
      type: 'Ionicons',
      action: () => {
        if (props.navigation) {
          props.navigation.navigate('Progress');
        }
      },
    },
    {
      id: 'jadwal',
      title: 'Jadwal\nLatihan',
      icon: 'calendar-outline',
      type: 'Ionicons',
      action: () => setJadwalModalVisible(true),
    },
    {
      id: 'profil',
      title: 'Profil',
      icon: 'person-circle-outline',
      type: 'Ionicons',
      action: () => {
        if (props.navigation) {
          props.navigation.navigate('Pengaturan');
        }
      },
    },
  ];

  // Dummy quiz questions
  const quizQuestions = [
    {
      id: 1,
      q: 'Apa tujuan utama gerakan meluncur dalam olahraga renang?',
      options: [
        'A. Melatih pernapasan di dasar air',
        'B. Mengurangi hambatan air saat mulai berenang',
        'C. Menghentikan laju renang seketika',
        'D. Menambah beban otot tangan',
      ],
      correct: 1,
    },
    {
      id: 2,
      q: 'Gaya renang yang gerakannya menyerupai gerakan katak berenang adalah...',
      options: [
        'A. Gaya Bebas (Crawl)',
        'B. Gaya Dada (Breaststroke)',
        'C. Gaya Punggung (Backstroke)',
        'D. Gaya Kupu-kupu (Butterfly)',
      ],
      correct: 1,
    },
    {
      id: 3,
      q: 'Hal paling penting yang wajib dilakukan sebelum masuk ke kolam renang adalah...',
      options: [
        'A. Makan makanan berat',
        'B. Pemanasan dan peregangan otot',
        'C. Tidur siang terlebih dahulu',
        'D. Langsung melompat ke air dalam',
      ],
      correct: 1,
    },
  ];

  const handleSelectAnswer = (questionId, optionIndex) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: optionIndex,
    });
  };

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) {
        score += Math.round(100 / quizQuestions.length);
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ================= MAIN SCROLLABLE CONTENT ================= */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0284C7', '#0EA5E9']}
          />
        }
      >
        {/* ================= HEADER SECTION DENGAN WAVE ================= */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['#0090E0', '#0072D9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.headerGradient}
          >
            {/* Top row: Logo + Title + Notification Bell */}
            <View style={styles.headerTopRow}>
              <View style={styles.headerBrandRow}>
                <Image
                  source={require('../../../assets/images/logo_renangsmpedia.png')}
                  style={styles.brandLogoImage}
                  resizeMode="contain"
                />
                <View style={styles.brandTitleCol}>
                  <Text style={styles.brandTitleName}>Renang</Text>
                  <Text style={styles.brandTitleName}>SMPedia</Text>
                  <Text style={styles.brandSubtitle}>Belajar • Berlatih • Jadi Hebat</Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.notificationButton}
                onPress={() => setNotifModalVisible(true)}
              >
                <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
            </View>

            {/* Wave Divider at Bottom of Header */}
            <WaveBottom color="#F8FAFC" height={38} />
          </LinearGradient>
        </View>

        {/* ================= BODY CONTENT ================= */}
        <View style={styles.bodyContent}>
          {/* 1. STUDENT GREETING CARD */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.studentCard}
            onPress={() => {
              if (props.navigation) {
                props.navigation.navigate('Pengaturan');
              }
            }}
          >
            <View style={styles.studentAvatarWrapper}>
              <Image
                source={require('../../../assets/images/student_avatar_circle.png')}
                style={styles.studentAvatar}
              />
            </View>

            <View style={styles.studentInfoWrapper}>
              <Text style={styles.studentGreetingText}>
                Halo, {displayName}!
              </Text>
              <Text style={styles.studentSubText}>
                Kelas {displayClass} • {displaySchool}
              </Text>
            </View>

            <Feather name="chevron-right" size={22} color="#94A3B8" />
          </TouchableOpacity>

          {/* 2. HERO BANNER CARD ("Ayo Belajar Renang!") */}
          <TouchableOpacity
            activeOpacity={0.92}
            style={styles.heroBannerCard}
            onPress={() => setMateriMenuModalVisible(true)}
          >
            <Image
              source={require('../../../assets/images/hero_banner_highres.png')}
              style={styles.heroBannerImage}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* 3. GRID MENU (3 Columns x 2 Rows = 6 Cards) */}
          <View style={styles.gridContainer}>
            {gridMenuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.78}
                style={styles.gridCard}
                onPress={item.action}
              >
                <View style={styles.gridIconContainer}>
                  {item.type === 'Ionicons' ? (
                    <Ionicons name={item.icon} size={32} color="#0077E6" />
                  ) : (
                    <MaterialCommunityIcons name={item.icon} size={34} color="#0077E6" />
                  )}
                </View>
                <Text style={styles.gridCardLabel} numberOfLines={2}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 4. DAFTAR MATERI POPULER (Quick Jump from API) */}
          <View style={styles.quickMateriSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Modul Pembelajaran</Text>
              <TouchableOpacity
                onPress={() => {
                  if (props.navigation) {
                    props.navigation.navigate('Materi');
                  }
                }}
              >
                <Text style={styles.seeAllText}>Lihat Semua</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#0284C7" />
                <Text style={styles.loadingText}>Memuat materi...</Text>
              </View>
            ) : dataMenu && dataMenu.length > 0 ? (
              dataMenu.slice(0, 4).map((m, idx) => (
                <TouchableOpacity
                  key={m.id?.toString() || idx.toString()}
                  activeOpacity={0.85}
                  style={styles.quickMateriCard}
                  onPress={() => getSubMenu(m.id, m.nama_menu)}
                >
                  <View style={styles.quickMateriThumbWrapper}>
                    {m.gambar_menu ? (
                      <Image
                        source={{ uri: m.gambar_menu }}
                        style={styles.quickMateriThumb}
                        resizeMode="cover"
                      />
                    ) : (
                      <MaterialIcons name="pool" size={24} color="#0284C7" />
                    )}
                  </View>
                  <View style={styles.quickMateriInfo}>
                    <Text style={styles.quickMateriTitle}>{m.nama_menu}</Text>
                    <Text style={styles.quickMateriSub}>
                      Modul {idx + 1} • Teori & Praktik Renang
                    </Text>
                  </View>
                  <Feather name="arrow-right" size={18} color="#0284C7" />
                </TouchableOpacity>
              ))
            ) : null}
          </View>

          {/* Footer Logo */}
          <View style={styles.footerLogoContainer}>
            <LogoBPI />
          </View>

          {/* Spacer for bottom tab bar */}
          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* ================= MODAL: DAFTAR MATERI API ================= */}
      <Modal
        visible={materiMenuModalVisible}
        animationType="slide"
        onRequestClose={() => setMateriMenuModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>Pilih Materi Pembelajaran</Text>
            <TouchableOpacity onPress={() => setMateriMenuModalVisible(false)}>
              <Feather name="x" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalSubtitle}>
              Pilih topik renang yang ingin kamu pelajari hari ini:
            </Text>

            {dataMenu && dataMenu.length > 0 ? (
              dataMenu.map((m, idx) => (
                <TouchableOpacity
                  key={m.id?.toString() || idx.toString()}
                  activeOpacity={0.85}
                  style={styles.modalMateriItem}
                  onPress={() => getSubMenu(m.id, m.nama_menu)}
                >
                  <View style={styles.modalMateriThumbWrapper}>
                    {m.gambar_menu ? (
                      <Image
                        source={{ uri: m.gambar_menu }}
                        style={styles.modalMateriThumb}
                        resizeMode="cover"
                      />
                    ) : (
                      <MaterialIcons name="pool" size={32} color="#0284C7" />
                    )}
                  </View>
                  <View style={styles.modalMateriTextCol}>
                    <Text style={styles.modalMateriTitle}>{m.nama_menu}</Text>
                    <Text style={styles.modalMateriDesc}>
                      {m.deskripsi_menu || 'Teknik dasar, panduan visual, video & latihan.'}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#0284C7" />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Materi sedang dipersiapkan</Text>
              </View>
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ================= MODAL: SUBMENU & DETAIL (EXISTING FLOW) ================= */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                if (modalLevel === 'detail') {
                  setModalLevel('subsubmenu');
                  setSelectedSubSubMenu(null);
                } else if (modalLevel === 'subsubmenu') {
                  setModalLevel('submenu');
                } else {
                  setModalVisible(false);
                }
              }}
              style={styles.modalBackButton}
            >
              <Feather name="arrow-left" size={22} color="#1E293B" />
              <Text style={styles.modalBackText}>Kembali</Text>
            </TouchableOpacity>

            <Text style={styles.modalHeaderTitle} numberOfLines={1}>
              {modalTitle}
            </Text>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Feather name="x" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={{ paddingBottom: 60 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {modalLevel !== 'detail' ? (
              dataSubMenu && dataSubMenu.length > 0 ? (
                dataSubMenu.map((item, idx) => (
                  <TouchableOpacity
                    key={item?.id?.toString() || idx.toString()}
                    onPress={() => {
                      if (modalLevel === 'submenu') {
                        getSubSubMenu(item.id, item.nama_sub_menu);
                      } else {
                        setSelectedSubSubMenu(item);
                        setModalLevel('detail');
                      }
                    }}
                    activeOpacity={0.85}
                    style={styles.subMenuItemCard}
                  >
                    <View style={styles.subMenuItemLeft}>
                      {(item.gambar_sub_menu || item.gambar_sub_sub_menu) ? (
                        <Image
                          source={{ uri: item.gambar_sub_menu || item.gambar_sub_sub_menu }}
                          style={styles.subMenuImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.subMenuPlaceholder}>
                          <MaterialIcons name="water" size={26} color="#0284C7" />
                        </View>
                      )}
                      <View style={styles.subMenuTextWrapper}>
                        <Text style={styles.subMenuTitle}>
                          {item.nama_sub_menu || item.nama_sub_sub_menu}
                        </Text>
                        {item.deskripsi_sub_menu ? (
                          <Text style={styles.subMenuDesc} numberOfLines={2}>
                            {item.deskripsi_sub_menu}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    <Feather name="arrow-right" size={18} color="#0284C7" />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Materi sedang dipersiapkan</Text>
                </View>
              )
            ) : (
              /* DETAIL VIEW */
              selectedSubSubMenu && (
                <View style={styles.detailContainer}>
                  {selectedSubSubMenu.gambar_sub_sub_menu ? (
                    <Image
                      source={{ uri: selectedSubSubMenu.gambar_sub_sub_menu }}
                      style={styles.detailBannerImage}
                      resizeMode="cover"
                    />
                  ) : null}

                  <Text style={styles.detailTitle}>{selectedSubSubMenu.nama_sub_sub_menu}</Text>

                  {selectedSubSubMenu.deskripsi_sub_sub_menu ? (
                    <Text style={styles.detailDescription}>
                      {selectedSubSubMenu.deskripsi_sub_sub_menu}
                    </Text>
                  ) : null}

                  {selectedSubSubMenu.link_video ? (
                    <TouchableOpacity
                      style={styles.detailVideoButton}
                      onPress={() => {
                        setModalVisible(false);
                        props.navigation.navigate('WebViewScreen', {
                          url: selectedSubSubMenu.link_video,
                        });
                      }}
                    >
                      <Feather name="play-circle" size={20} color="#FFFFFF" />
                      <Text style={styles.detailVideoButtonText}>Tonton Video Pembelajaran</Text>
                    </TouchableOpacity>
                  ) : null}

                  {selectedSubSubMenu.link_lainnya ? (
                    <TouchableOpacity
                      style={styles.detailLinkButton}
                      onPress={() => Linking.openURL(selectedSubSubMenu.link_lainnya)}
                    >
                      <Feather name="external-link" size={18} color="#0284C7" />
                      <Text style={styles.detailLinkButtonText}>Buka Materi / Latihan</Text>
                    </TouchableOpacity>
                  ) : null}

                  {selectedSubSubMenu.file && selectedSubSubMenu.file.length > 0 && (
                    <View style={styles.fileSection}>
                      {!showWebView ? (
                        <TouchableOpacity
                          style={styles.detailFileButton}
                          onPress={() => setShowWebView(true)}
                        >
                          <Feather name="file-text" size={18} color="#FFFFFF" />
                          <Text style={styles.detailFileButtonText}>
                            Lihat Dokumen: {selectedSubSubMenu.file[0].judul_file}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.webViewWrapper}>
                          <WebView
                            source={{
                              uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                                selectedSubSubMenu.file[0].file_path
                              )}`,
                            }}
                            javaScriptEnabled
                            domStorageEnabled
                            startInLoadingState
                            style={{ flex: 1 }}
                          />
                          <TouchableOpacity
                            style={styles.closeWebViewButton}
                            onPress={() => setShowWebView(false)}
                          >
                            <Text style={styles.closeWebViewText}>Tutup File</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )
            )}

            <View style={{ marginTop: 24, alignItems: 'center' }}>
              <LogoBPI />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ================= MODAL: NOTIFIKASI ================= */}
      <Modal
        visible={notifModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setNotifModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.popupCard}>
            <View style={styles.popupHeader}>
              <View style={styles.popupTitleRow}>
                <Ionicons name="notifications" size={22} color="#0077E6" />
                <Text style={styles.popupTitle}>Notifikasi Siswa</Text>
              </View>
              <TouchableOpacity onPress={() => setNotifModalVisible(false)}>
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 350 }}>
              <View style={styles.notifItem}>
                <Ionicons name="sparkles" size={20} color="#0284C7" />
                <View style={styles.notifTextCol}>
                  <Text style={styles.notifItemTitle}>Selamat Datang di Renang SMPedia!</Text>
                  <Text style={styles.notifItemDesc}>
                    Aplikasi belajar renang interaktif untuk siswa SMP telah siap digunakan.
                  </Text>
                  <Text style={styles.notifItemTime}>Hari ini, 08:00 WIB</Text>
                </View>
              </View>

              <View style={styles.notifItem}>
                <Ionicons name="calendar" size={20} color="#10B981" />
                <View style={styles.notifTextCol}>
                  <Text style={styles.notifItemTitle}>Jadwal Latihan Minggu Ini</Text>
                  <Text style={styles.notifItemDesc}>
                    Latihan renang bersama diadakan setiap hari Rabu pukul 15.30 WIB.
                  </Text>
                  <Text style={styles.notifItemTime}>Kemarin</Text>
                </View>
              </View>

              <View style={styles.notifItem}>
                <Ionicons name="trophy" size={20} color="#F59E0B" />
                <View style={styles.notifTextCol}>
                  <Text style={styles.notifItemTitle}>Tugas & Quiz Baru Tersedia</Text>
                  <Text style={styles.notifItemDesc}>
                    Uji pemahamanmu tentang teknik dasar meluncur dan renang gaya dada!
                  </Text>
                  <Text style={styles.notifItemTime}>3 hari lalu</Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.closePopupButton}
              onPress={() => setNotifModalVisible(false)}
            >
              <Text style={styles.closePopupButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL: LATIHAN & VIDEO TUTORIAL ================= */}
      <Modal
        visible={latihanModalVisible}
        animationType="slide"
        onRequestClose={() => setLatihanModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>Latihan & Video Tutorial</Text>
            <TouchableOpacity onPress={() => setLatihanModalVisible(false)}>
              <Feather name="x" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalSubtitle}>
              Video panduan teknik renang dari pelatih profesional:
            </Text>

            {[
              {
                id: '1',
                title: 'Tutorial Gerakan Meluncur di Air',
                duration: '04:15 Menit',
                category: 'Teknik Dasar',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              },
              {
                id: '2',
                title: 'Panduan Renang Gaya Dada (Katak)',
                duration: '06:30 Menit',
                category: 'Gaya Renang',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              },
              {
                id: '3',
                title: 'Latihan Pernapasan Efektif Saat Berenang',
                duration: '05:10 Menit',
                category: 'Pernapasan',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              },
              {
                id: '4',
                title: 'Teknik Penyelamatan Diri & Teman di Kolam',
                duration: '07:45 Menit',
                category: 'Keselamatan',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              },
            ].map((v) => (
              <TouchableOpacity
                key={v.id}
                style={styles.videoCard}
                activeOpacity={0.85}
                onPress={() => {
                  setLatihanModalVisible(false);
                  props.navigation.navigate('WebViewScreen', { url: v.url });
                }}
              >
                <View style={styles.videoPlayCircle}>
                  <Feather name="play" size={22} color="#FFFFFF" />
                </View>
                <View style={styles.videoInfoCol}>
                  <View style={styles.videoCategoryTag}>
                    <Text style={styles.videoCategoryText}>{v.category}</Text>
                  </View>
                  <Text style={styles.videoTitle}>{v.title}</Text>
                  <Text style={styles.videoDuration}>Durasi: {v.duration}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ================= MODAL: TUGAS & QUIZ ================= */}
      <Modal
        visible={quizModalVisible}
        animationType="slide"
        onRequestClose={() => setQuizModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>Tugas & Quiz Renang</Text>
            <TouchableOpacity onPress={() => setQuizModalVisible(false)}>
              <Feather name="x" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {!quizSubmitted ? (
              <>
                <Text style={styles.modalSubtitle}>
                  Jawab pertanyaan berikut untuk menguji pemahaman renangmu:
                </Text>

                {quizQuestions.map((item, qIdx) => (
                  <View key={item.id} style={styles.quizQuestionCard}>
                    <Text style={styles.quizQuestionNumber}>Soal {qIdx + 1}</Text>
                    <Text style={styles.quizQuestionText}>{item.q}</Text>

                    {item.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[item.id] === optIdx;
                      return (
                        <TouchableOpacity
                          key={optIdx}
                          style={[
                            styles.quizOptionButton,
                            isSelected && styles.quizOptionSelected,
                          ]}
                          onPress={() => handleSelectAnswer(item.id, optIdx)}
                        >
                          <Text
                            style={[
                              styles.quizOptionText,
                              isSelected && styles.quizOptionTextSelected,
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.submitQuizButton}
                  onPress={handleQuizSubmit}
                >
                  <Text style={styles.submitQuizButtonText}>Kirim Jawaban Quiz</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.quizResultBox}>
                <Ionicons name="trophy" size={64} color="#F59E0B" />
                <Text style={styles.quizResultTitle}>Hasil Quiz Kamu</Text>
                <Text style={styles.quizResultScore}>{quizScore} / 100</Text>
                <Text style={styles.quizResultDesc}>
                  {quizScore >= 70
                    ? 'Luar biasa! Pemahaman teori renangmu sangat baik.'
                    : 'Terus tingkatkan belajarmu dengan membaca materi kembali ya!'}
                </Text>

                <TouchableOpacity
                  style={styles.retryQuizButton}
                  onPress={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                >
                  <Text style={styles.retryQuizButtonText}>Ulangi Quiz</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ================= MODAL: JADWAL LATIHAN ================= */}
      <Modal
        visible={jadwalModalVisible}
        animationType="slide"
        onRequestClose={() => setJadwalModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>Jadwal Latihan Renang</Text>
            <TouchableOpacity onPress={() => setJadwalModalVisible(false)}>
              <Feather name="x" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalSubtitle}>
              Informasi jadwal sesi praktik renang di kolam:
            </Text>

            {[
              {
                id: '1',
                day: 'Rabu',
                time: '15:30 - 17:00 WIB',
                location: 'Kolam Renang SMP Negeri 1',
                instructor: 'Pak Made Risza, S.Pd.',
                materi: 'Teknik Dasar Meluncur & Pernapasan',
                tag: 'Wajib',
              },
              {
                id: '2',
                day: 'Sabtu',
                time: '08:00 - 10:00 WIB',
                location: 'Kolam Renang Gelanggang Olahraga',
                instructor: 'Pak Made Risza, S.Pd.',
                materi: 'Latihan Renang Gaya Dada & Gaya Bebas',
                tag: 'Pengayaan',
              },
            ].map((j) => (
              <View key={j.id} style={styles.jadwalCard}>
                <View style={styles.jadwalTopRow}>
                  <View style={styles.jadwalDayBadge}>
                    <Text style={styles.jadwalDayText}>{j.day}</Text>
                  </View>
                  <Text style={styles.jadwalTag}>{j.tag}</Text>
                </View>

                <View style={styles.jadwalDetailRow}>
                  <Ionicons name="time-outline" size={18} color="#0284C7" />
                  <Text style={styles.jadwalDetailText}>{j.time}</Text>
                </View>

                <View style={styles.jadwalDetailRow}>
                  <Ionicons name="location-outline" size={18} color="#0284C7" />
                  <Text style={styles.jadwalDetailText}>{j.location}</Text>
                </View>

                <View style={styles.jadwalDetailRow}>
                  <Ionicons name="person-outline" size={18} color="#0284C7" />
                  <Text style={styles.jadwalDetailText}>Pelatih: {j.instructor}</Text>
                </View>

                <View style={styles.jadwalMateriBox}>
                  <Text style={styles.jadwalMateriText}>Materi: {j.materi}</Text>
                </View>
              </View>
            ))}

            <View style={styles.jadwalPerlengkapanBox}>
              <Text style={styles.perlengkapanTitle}>Perlengkapan Wajib:</Text>
              <Text style={styles.perlengkapanItem}>• Baju renang standar sekolah</Text>
              <Text style={styles.perlengkapanItem}>• Kacamata renang & topi renang</Text>
              <Text style={styles.perlengkapanItem}>• Handuk dan pakaian ganti</Text>
              <Text style={styles.perlengkapanItem}>• Botol air minum pribadi</Text>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  /* HEADER */
  headerContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 52 : (StatusBar.currentHeight || 28) + 12,
    paddingBottom: 42,
    paddingHorizontal: 20,
    position: 'relative',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  brandLogoImage: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: '#0080CA',
  },
  brandTitleCol: {
    marginLeft: 12,
  },
  brandTitleName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  brandSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.92)',
    marginTop: 2,
    fontWeight: '500',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    position: 'relative',
  },
  notificationBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    position: 'absolute',
    top: 10,
    right: 11,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  /* BODY */
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  /* 1. STUDENT CARD */
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.subtle,
    marginBottom: 16,
  },
  studentAvatarWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  studentAvatar: {
    width: '100%',
    height: '100%',
  },
  studentInfoWrapper: {
    flex: 1,
    marginLeft: 14,
  },
  studentGreetingText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  studentSubText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },

  /* 2. HERO BANNER */
  heroBannerCard: {
    width: '100%',
    height: 175,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    ...Shadows.card,
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
  },

  /* 3. GRID MENU (3 Columns x 2 Rows) */
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridCard: {
    width: GRID_CARD_WIDTH,
    height: 114,
    backgroundColor: '#EDF6FF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DCEBFA',
    ...Shadows.subtle,
  },
  gridIconContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridCardLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
    lineHeight: 15,
  },

  /* 4. QUICK MATERI SECTION */
  quickMateriSection: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    marginLeft: 8,
    color: '#64748B',
    fontSize: 13,
  },
  quickMateriCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.subtle,
  },
  quickMateriThumbWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  quickMateriThumb: {
    width: '100%',
    height: '100%',
  },
  quickMateriInfo: {
    flex: 1,
    marginLeft: 12,
  },
  quickMateriTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  quickMateriSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  footerLogoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },

  /* MODALS COMMON */
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    flex: 1,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  modalBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  modalBackText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 4,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  modalMateriItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.subtle,
  },
  modalMateriThumbWrapper: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  modalMateriThumb: {
    width: '100%',
    height: '100%',
  },
  modalMateriTextCol: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  modalMateriTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalMateriDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },

  /* SUBMENU MODAL */
  subMenuItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.subtle,
  },
  subMenuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  subMenuImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  subMenuPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subMenuTextWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  subMenuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  subMenuDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  detailContainer: {
    paddingBottom: 30,
  },
  detailBannerImage: {
    width: '100%',
    height: 190,
    borderRadius: 16,
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  detailDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 20,
  },
  detailVideoButton: {
    backgroundColor: '#0284C7',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  detailVideoButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 8,
  },
  detailLinkButton: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  detailLinkButtonText: {
    color: '#0284C7',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 8,
  },
  fileSection: {
    marginTop: 8,
  },
  detailFileButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailFileButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 8,
  },
  webViewWrapper: {
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  closeWebViewButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeWebViewText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  /* POPUP NOTIF */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popupCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...Shadows.card,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  popupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginLeft: 8,
  },
  notifItem: {
    flexDirection: 'row',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  notifTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  notifItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  notifItemDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  notifItemTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  closePopupButton: {
    backgroundColor: '#0284C7',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  closePopupButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  /* VIDEO CARDS */
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.subtle,
  },
  videoPlayCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0284C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfoCol: {
    flex: 1,
    marginLeft: 14,
  },
  videoCategoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  videoCategoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  videoDuration: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },

  /* QUIZ STYLES */
  quizQuestionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.subtle,
  },
  quizQuestionNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    marginBottom: 4,
  },
  quizQuestionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 14,
    lineHeight: 20,
  },
  quizOptionButton: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quizOptionSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0284C7',
  },
  quizOptionText: {
    fontSize: 13,
    color: '#334155',
  },
  quizOptionTextSelected: {
    color: '#0284C7',
    fontWeight: '700',
  },
  submitQuizButton: {
    backgroundColor: '#0284C7',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    ...Shadows.glow,
  },
  submitQuizButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  quizResultBox: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.subtle,
  },
  quizResultTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 14,
  },
  quizResultScore: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0284C7',
    marginVertical: 8,
  },
  quizResultDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryQuizButton: {
    backgroundColor: '#0284C7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryQuizButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  /* JADWAL */
  jadwalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.subtle,
  },
  jadwalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jadwalDayBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  jadwalDayText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  jadwalTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  jadwalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  jadwalDetailText: {
    fontSize: 13,
    color: '#475569',
    marginLeft: 8,
  },
  jadwalMateriBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  jadwalMateriText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
  },
  jadwalPerlengkapanBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  perlengkapanTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B45309',
    marginBottom: 6,
  },
  perlengkapanItem: {
    fontSize: 13,
    color: '#92400E',
    marginBottom: 3,
  },
});
