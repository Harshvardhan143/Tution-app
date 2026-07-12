import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { InputField } from '../../components/common/InputField';
import { GradientButton } from '../../components/common/GradientButton';
import { Mail, Lock, Zap } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';

const { width, height } = Dimensions.get('window');

const scale = (size: number) => (width / 375) * size;
const vScale = (size: number) => (height / 812) * size;

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please enter both email/username and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login({ emailOrUsername: identifier, password });
    } catch {
      Alert.alert('Login Failed', 'Invalid credentials or network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#10141D" />
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── Background Ambient Circles ── */}
        <View style={styles.ambientCircleLeft} pointerEvents="none" />
        <View style={styles.ambientCircleRight} pointerEvents="none" />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ── Header Area ── */}
          <View style={styles.header}>
            <View style={styles.logoWrap}>
              <Zap size={scale(48)} color="#7C6EF5" strokeWidth={1.8} />
            </View>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your EduSpark account</Text>
          </View>

          {/* ── Bottom Sheet Form Card ── */}
          <View style={styles.bottomSheet}>
            <View style={styles.formContainer}>
              <InputField
                label="Email or Username"
                placeholder="Enter your email or username"
                value={identifier}
                onChangeText={setIdentifier}
                icon={<Mail size={scale(18)} color="#94a3b8" />}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />

              <InputField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                icon={<Lock size={scale(18)} color="#94a3b8" />}
                isPassword
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              <TouchableOpacity
                style={styles.forgotWrap}
                onPress={() => router.push('/(auth)/forgot-password')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <GradientButton
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
              />
            </View>

            {/* ── Footer ── */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Contact admin to get your account</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#10141D', // Dark slate/navy background matching reference
  },

  // ── Background Ambient Circles (exact match to image) ──
  ambientCircleLeft: {
    position: 'absolute',
    top: -vScale(100),
    left: -scale(50),
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(34, 43, 76, 0.4)', // Dark blueish overlay
  },
  ambientCircleRight: {
    position: 'absolute',
    top: -vScale(150),
    right: -scale(150),
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(30, 39, 68, 0.3)', // Secondary dark overlay
  },

  // ── Scroll & Layout ──
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  // ── Top Header Area ──
  header: {
    alignItems: 'center',
    paddingTop: vScale(100),
    paddingBottom: vScale(50),
    paddingHorizontal: scale(20),
  },
  logoWrap: {
    width: scale(110),
    height: scale(110),
    borderRadius: scale(36),
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1.5,
    borderColor: 'rgba(124, 110, 245, 0.2)', // Very subtle purple/blue outline
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vScale(30),
    shadowColor: '#7C6EF5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 5,
  },
  title: {
    fontSize: scale(36),
    fontWeight: '900', // Extra bold like the reference
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: vScale(12),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scale(18),
    color: '#A0AAB5', // Soft light grey
    textAlign: 'center',
  },

  // ── Bottom Sheet Form Card ──
  bottomSheet: {
    backgroundColor: '#1E2532', // Slightly lighter card at bottom as seen in image
    borderTopLeftRadius: scale(32),
    borderTopRightRadius: scale(32),
    paddingTop: vScale(40),
    paddingHorizontal: scale(24),
    paddingBottom: vScale(40),
    flex: 1,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  formContainer: {
    width: '100%',
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: vScale(30),
    marginTop: vScale(-8),
  },
  forgotText: {
    color: '#7C6EF5', // Matches lightning bolt color
    fontWeight: '600',
    fontSize: scale(14),
  },

  // ── Footer ──
  footer: {
    marginTop: vScale(40),
    alignItems: 'center',
  },
  footerText: {
    color: '#64748B',
    fontSize: scale(14),
    textAlign: 'center',
  },
});
