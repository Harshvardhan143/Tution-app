import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { GlassCard } from '../../components/common/GlassCard';
import { InputField } from '../../components/common/InputField';
import { GradientButton } from '../../components/common/GradientButton';
import { Mail, Lock, Zap } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

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
      await login({ identifier, password });
      // The AuthGuard will automatically redirect to the appropriate dashboard
    } catch {
      Alert.alert('Login Failed', 'Invalid credentials or network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.glow} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Zap size={48} color="#6C63FF" strokeWidth={1.5} />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <GlassCard style={styles.card}>
          <InputField
            label="Email or Username"
            placeholder="Enter your email or username"
            value={identifier}
            onChangeText={setIdentifier}
            icon={<Mail size={20} color="#94a3b8" />}
            autoCapitalize="none"
          />
          
          <InputField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            icon={<Lock size={20} color="#94a3b8" />}
            isPassword
          />

          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <GradientButton 
            title="Sign In" 
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />
        </GlassCard>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Contact admin to get your account</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  glow: {
    position: 'absolute',
    top: -100,
    left: width / 2 - 150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
  },
  card: {
    paddingVertical: 32,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: '#06B6D4',
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    marginTop: 8,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#4A5568',
    fontSize: 14,
  },
});
