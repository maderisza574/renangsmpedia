import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Platform,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Modal,
  RefreshControl,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { Buffer } from 'buffer';
import { WebView } from 'react-native-webview';

import WaveBottom from '../../components/WaveBottom';
import LogoBPI from '../LogoBPI';
import { Colors, Shadows } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function Education(props) {
  const [dataMenu, setDataMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSubMenu, setDataSubMenu] = useState([]);
  const [modalTitle, setModalTitle] = useState('Materi');
  const [modalLevel, setModalLevel] = useState('submenu');
  const [selectedSubSubMenu, setSelectedSubSubMenu] = useState(null);
  const [showWebView, setShowWebView] = useState(false);

  const urlMenu = 'https://smpedia.creativeku.my.id/api/v1/menu';
  const basicAuth = 'Basic ' + Buffer.from('made:made_in_bali').toString('base64');

  const fetchMenu = async () => {
    try {
      const response = await axios.get(urlMenu, {
        headers: { Authorization: basicAuth },
      });
      if (response.status === 200) {
        setDataMenu(response.data.data || []);
      }
    } catch (e) {
      console.log('Error fetch menu:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getSubMenu = async (id, menuName) => {
    try {
      const response = await axios.get(`https://smpedia.creativeku.my.id/api/v1/sub_menu/${id}`, {
        headers: { Authorization: basicAuth },
      });
      if (response.status === 200) {
        setDataSubMenu(response.data.data);
        setModalTitle(menuName || 'Submateri');
        setModalLevel('submenu');
        setModalVisible(true);
      }
    } catch (error) {
      console.log('Error sub menu:', error);
    }
  };

  const getSubSubMenu = async (id, subMenuName) => {
    try {
      const response = await axios.get(`https://smpedia.creativeku.my.id/api/v1/sub_sub_menu/${id}`, {
        headers: { Authorization: basicAuth },
      });
      if (response.status === 200) {
        setDataSubMenu(response.data.data);
        setModalTitle(subMenuName || 'Detail');
        setModalLevel('subsubmenu');
      }
    } catch (error) {
      console.log('Error sub sub menu:', error);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMenu();
  };

  const filteredMenu = dataMenu.filter((m) =>
    m.nama_menu.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* HEADER */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#0090E0', '#0072D9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.headerTitle}>Materi Pembelajaran</Text>
              <Text style={styles.headerSubtitle}>
                Kumpulan modul & teknik renang SMP
              </Text>
            </View>
            <View style={styles.iconCircle}>
              <Ionicons name="book-outline" size={24} color="#FFFFFF" />
            </View>
          </View>

          {/* SEARCH BAR */}
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari materi renang..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <WaveBottom color="#F8FAFC" height={36} />
        </LinearGradient>
      </View>

      {/* BODY */}
      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0284C7']} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0284C7" />
            <Text style={styles.loadingText}>Memuat materi pembelajaran...</Text>
          </View>
        ) : filteredMenu.length > 0 ? (
          filteredMenu.map((item, index) => (
            <TouchableOpacity
              key={item.id?.toString() || index.toString()}
              style={styles.materiCard}
              activeOpacity={0.85}
              onPress={() => getSubMenu(item.id, item.nama_menu)}
            >
              <View style={styles.materiImageWrapper}>
                {item.gambar_menu ? (
                  <Image
                    source={{ uri: item.gambar_menu }}
                    style={styles.materiImage}
                    resizeMode="cover"
                  />
                ) : (
                  <MaterialIcons name="pool" size={36} color="#0284C7" />
                )}
              </View>

              <View style={styles.materiInfo}>
                <View style={styles.badgeModul}>
                  <Text style={styles.badgeModulText}>Modul {index + 1}</Text>
                </View>
                <Text style={styles.materiTitle}>{item.nama_menu}</Text>
                <Text style={styles.materiDesc} numberOfLines={2}>
                  {item.deskripsi_menu || 'Pelajari materi dasar, teknik gerakan, dan keselamatan air.'}
                </Text>
              </View>

              <View style={styles.arrowBox}>
                <Feather name="chevron-right" size={20} color="#0284C7" />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Materi tidak ditemukan</Text>
          </View>
        )}

        <View style={{ marginTop: 24, alignItems: 'center' }}>
          <LogoBPI />
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* DETAIL MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
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
            <Text style={styles.modalTitleText} numberOfLines={1}>{modalTitle}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Feather name="x" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} contentContainerStyle={{ paddingBottom: 60 }}>
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
                            <Text style={styles.closeWebViewText}>Tutup Dokumen</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight || 28) + 14,
    paddingBottom: 40,
    paddingHorizontal: 20,
    position: 'relative',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
    ...Shadows.subtle,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
  },
  materiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.subtle,
  },
  materiImageWrapper: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  materiImage: {
    width: '100%',
    height: '100%',
  },
  materiInfo: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 6,
  },
  badgeModul: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  badgeModulText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },
  materiTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 3,
  },
  materiDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  /* MODAL */
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
  modalBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalBackText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 6,
  },
  modalTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subMenuItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
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
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  subMenuPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 10,
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
  detailContainer: {
    paddingBottom: 20,
  },
  detailBannerImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
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
});