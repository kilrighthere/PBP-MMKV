import { getUserData } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Check login state dari MMKV
    const checkLoginState = () => {
      const userData = getUserData();
      
      if (userData.isLoggedIn && userData.email) {
        console.log('✅ User sudah login, redirect ke home');
        router.replace('/home');
      } else {
        console.log('❌ User belum login, redirect ke login');
        router.replace('/login');
      }
    };

    // Delay sedikit untuk UX yang lebih baik
    const timer = setTimeout(checkLoginState, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
