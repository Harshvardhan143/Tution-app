import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/colors';

export default function RootLayout() {
  const { isAuthenticated, isLoading, checkAuth, role } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect away from login to respective dashboard
      if (role === 'student') {
        router.replace('/(student)/dashboard');
      } else if (role === 'staff') {
        router.replace('/(staff)/dashboard');
      } else {
        router.replace('/');
      }
    }
  }, [isAuthenticated, isLoading, segments, role, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <Slot />;
}
