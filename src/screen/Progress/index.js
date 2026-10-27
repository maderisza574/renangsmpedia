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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import WaveBottom from '../../components/WaveBottom';
import LogoBPI from '../LogoBPI';
import { Colors, Gradients, Shadows } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function ProgressScreen(props) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        if (stored) {
          setUserData(JSON.parse(stored));
        }
      } catch (e) {
        console.log('Error reading userData:', e);
      }
    };
    loadUser();
  }, []);

  const stats = [
    {
      id: '1',
      title: 'Materi Selesai',
      value: '4/5',
      percent: '80%',
      icon: 'book-open-outline',
      iconType: 'MaterialCommunityIcons',
      color: '#0284C7',
      bg: '#E0F2FE',
    },
    {
      id: '2',
      title: 'Quiz Dikerjakan',
      value: '8/10',
      percent: '80%',
      icon: 'clipboard-check-outline',
      iconType: 'MaterialCommunityIcons',
      color: '#10B981',
      bg: '#D1FAE5',
    },
    {
      id: '3',
      title: 'Rata-Rata Nilai',
      value: '88',
      percent: 'A',
      icon: 'trophy-outline',
      iconType: 'Ionicons',
      color: '#F59E0B',
      bg: '#FEF3C7',
    },
    {
      id: '4',
      title: 'Kehadiran Latihan',
      value: '100%',
      percent: 'Rajin',
      icon: 'calendar-check-outline',
      iconType: 'MaterialCommunityIcons',
      color: '#8B5CF6',
      bg: '#EDE9FE',
    },
  ];

  const badges = [
    { id: '1', name: 'Penjelajah Air', desc: 'Selesai Materi Pengenalan Air', unlocked: true, icon: 'water' },
    { id: '2', name: 'Gaya Bebas Master', desc: 'Lulus Kuis Teknik Dasar', unlocked: true, icon: 'swim' },
    { id: '3', name: 'Disiplin Tinggi', desc: 'Hadir 5x sesi latihan renang berturut-turut', unlocked: true, icon: 'medal-outline' },
    { id: '4', name: 'Penyelamat Tangguh', desc: 'Menguasai materi keselamatan renang', unlocked: false, icon: 'lifebuoy' },
  ];

  const activities = [
    { id: '1', title: 'Menyelesaikan Kuis Gaya Dada', time: 'Hari ini, 09:30 WIB', score: 'Nilai: 95/100', icon: 'check-circle' },
    { id: '2', title: 'Menonton Video Tutorial Meluncur', time: 'Kemarin, 16:45 WIB', score: 'Selesai', icon: 'play-circle' },
    { id: '3', title: 'Latihan Renang Pertemuan ke-4', time: '3 hari yang lalu', score: 'Hadir', icon: 'calendar' },
  ];

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
              <Text style={styles.headerTitle}>Progress Pembelajaran</Text>
              <Text style={styles.headerSubtitle}>
                Pantau capaian & prestasi renangmu
              </Text>
            </View>
            <View style={styles.badgeCountWrapper}>
              <Ionicons name="ribbon-outline" size={24} color="#FFFFFF" />
            </View>
          </View>
          <WaveBottom color="#F8FAFC" height={36} />
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* STUDENT SUMMARY CARD */}
        <View style={styles.studentCard}>
          <Image
            source={require('../../../assets/images/student_avatar_circle.png')}
            style={styles.avatarImage}
          />
          <View style={styles.studentInfoCol}>
            <Text style={styles.studentName}>{userData?.nama || 'Andi Pratama'}</Text>
            <Text style={styles.studentClass}>Kelas {userData?.kelas || '8A'} • SMP Negeri 1</Text>
            <View style={styles.levelBadgeRow}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>Tingkat Menengah</Text>
              </View>
              <Text style={styles.totalProgressText}>Total Capaian: 82%</Text>
            </View>
          </View>
        </View>

        {/* STATS GRID */}
        <Text style={styles.sectionTitle}>Statistik Belajar</Text>
        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <View key={item.id} style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: item.bg }]}>
                <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statTitle}>{item.title}</Text>
            </View>
          ))}
        </View>

        {/* ACHIEVEMENTS / BADGES */}
        <Text style={styles.sectionTitle}>Pencapaian & Lencana</Text>
        <View style={styles.badgesWrapper}>
          {badges.map((b) => (
            <View
              key={b.id}
              style={[
                styles.badgeCard,
                !b.unlocked && styles.badgeLockedCard,
              ]}
            >
              <View
                style={[
                  styles.badgeIconCircle,
                  { backgroundColor: b.unlocked ? '#0284C7' : '#CBD5E1' },
                ]}
              >
                <MaterialCommunityIcons
                  name={b.icon}
                  size={24}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.badgeInfo}>
                <View style={styles.badgeTitleRow}>
                  <Text style={[styles.badgeName, !b.unlocked && styles.lockedText]}>
                    {b.name}
                  </Text>
                  {b.unlocked ? (
                    <Text style={styles.badgeUnlockedTag}>Terbuka</Text>
                  ) : (
                    <Text style={styles.badgeLockedTag}>Terkunci</Text>
                  )}
                </View>
                <Text style={styles.badgeDesc} numberOfLines={2}>
                  {b.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* RECENT ACTIVITIES */}
        <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
        <View style={styles.activitiesCard}>
          {activities.map((act, idx) => (
            <View
              key={act.id}
              style={[
                styles.activityRow,
                idx !== activities.length - 1 && styles.activityBorderBottom,
              ]}
            >
              <Feather name={act.icon} size={20} color="#0284C7" style={{ marginTop: 2 }} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{act.title}</Text>
                <Text style={styles.activityTime}>{act.time}</Text>
              </View>
              <Text style={styles.activityScore}>{act.score}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 24, alignItems: 'center' }}>
          <LogoBPI />
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>
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
    marginBottom: 6,
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
  badgeCountWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.subtle,
    marginBottom: 20,
  },
  avatarImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  studentInfoCol: {
    flex: 1,
    marginLeft: 14,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  studentClass: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  levelBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    justifyContent: 'space-between',
  },
  levelBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
  },
  totalProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 32 - 12) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.subtle,
  },
  statIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  statTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  badgesWrapper: {
    marginBottom: 20,
  },
  badgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.subtle,
  },
  badgeLockedCard: {
    opacity: 0.65,
    backgroundColor: '#F8FAFC',
  },
  badgeIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  badgeTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  lockedText: {
    color: '#64748B',
  },
  badgeUnlockedTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeLockedTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  activitiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.subtle,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  activityTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  activityScore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
});
