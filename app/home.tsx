import { auth, db } from '@/config/firebaseConfig';
import { clearUserData, getUserData } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Mahasiswa {
  id: string;
  nim: string;
  nama: string;
  prodi: string;
  tahunMasuk: string
  email: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Cek MMKV dulu sebagai source of truth
    const userData = getUserData();
    
    if (!userData.isLoggedIn) {
      console.log('🚫 User belum login (dari MMKV)');
      router.replace('/login');
      return;
    }

    console.log('📱 User sudah login (dari MMKV):', userData.email);
    setUserEmail(userData.email || '');
    
    // Fetch data mahasiswa
    fetchMahasiswa();
    
    // Optional: Sync dengan Firebase Auth (tapi jangan auto logout)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ Firebase Auth synced:', user.email);
      } else {
        console.log('⚠️ Firebase Auth belum ready, tapi MMKV masih valid');
        // Jangan clearUserData() di sini!
      }
    });

    return () => unsubscribe();
  }, []);


  const fetchMahasiswa = async () => {
    try {
      setLoading(true);
      const mahasiswaRef = collection(db, 'mahasiswa');
      const q = query(mahasiswaRef, orderBy('nama', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const mahasiswaData: Mahasiswa[] = [];
      querySnapshot.forEach((doc) => {
        mahasiswaData.push({
          id: doc.id,
          ...doc.data()
        } as Mahasiswa);
      });
      
      setMahasiswa(mahasiswaData);
      console.log('Data mahasiswa berhasil diambil:', mahasiswaData.length);
    } catch (error: any) {
      console.error('Error fetching mahasiswa:', error);
      Alert.alert('Error', 'Gagal mengambil data mahasiswa: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMahasiswa();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      // Logout dari Firebase
      await signOut(auth);
      
      // Clear MMKV data
      clearUserData();
      
      console.log('👋 Logout berhasil');
      
      // Redirect ke login
      router.replace('/login');
    } catch (error) {
      console.error('❌ Error saat logout:', error);
      Alert.alert('Error', 'Gagal logout. Silakan coba lagi.');
    }
  };

  const handleSeedData = async () => {
    const mahasiswaData = [
      { nim: '202101001', nama: 'Budi Santoso', jurusan: 'Teknik Informatika', email: 'budi@example.com' },
      { nim: '202101002', nama: 'Siti Nurhaliza', jurusan: 'Sistem Informasi', email: 'siti@example.com' },
      { nim: '202101003', nama: 'Ahmad Rizki', jurusan: 'Teknik Komputer', email: 'ahmad@example.com' },
      { nim: '202101004', nama: 'Dewi Lestari', jurusan: 'Teknik Informatika', email: 'dewi@example.com' },
      { nim: '202101005', nama: 'Eko Prasetyo', jurusan: 'Sistem Informasi', email: 'eko@example.com' },
    ];

    try {
      setLoading(true);
      for (const data of mahasiswaData) {
        await addDoc(collection(db, 'mahasiswa'), data);
      }
      Alert.alert('Berhasil', '5 data mahasiswa berhasil ditambahkan!');
      await fetchMahasiswa();
    } catch (error: any) {
      console.error('Error seeding data:', error);
      Alert.alert('Error', 'Gagal menambahkan data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMahasiswaCard = ({ item }: { item: Mahasiswa }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.nama.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>{item.nama}</Text>
          <Text style={styles.cardNim}>NIM: {item.nim}</Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>📧 Email</Text>
          <Text style={styles.infoValue}>{item.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>📚 Jurusan</Text>
          <Text style={styles.infoValue}>{item.prodi}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>📅 Tahun Masuk</Text>
          <Text style={styles.infoValue}>{item.tahunMasuk}</Text>
        </View>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderText}>
        Total: {mahasiswa.length} Mahasiswa
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Data Mahasiswa</Text>
          <Text style={styles.headerSubtitle}>
            📱 {userEmail}
          </Text>
        </View>
      </View>

      {mahasiswa.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📚</Text>
          <Text style={styles.emptyTitle}>Belum Ada Data</Text>
          <Text style={styles.emptySubtitle}>
            Tambahkan data mahasiswa melalui Firebase Console
          </Text>
          <Text style={styles.emptyInfo}>
            atau gunakan tombol "Tambah Data Dummy" di bawah
          </Text>
        </View>
      ) : (
        <FlatList
          data={mahasiswa}
          renderItem={renderMahasiswaCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={ListHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
            />
          }
        />
      )}

      <View style={styles.footer}>
        {mahasiswa.length === 0 && (
          <TouchableOpacity 
            style={styles.seedButton} 
            onPress={handleSeedData}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.seedButtonText}>
              {loading ? '⏳ Menambahkan...' : '➕ Tambah Data Dummy'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  listHeader: {
    marginBottom: 16,
  },
  listHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  cardNim: {
    fontSize: 14,
    color: '#666',
  },
  cardBody: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emptyInfo: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  seedButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  seedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});