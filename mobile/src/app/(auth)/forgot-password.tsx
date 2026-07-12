import React, { useState } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '../../components/common/AppHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { InputField } from '../../components/common/InputField';
import { GradientButton } from '../../components/common/GradientButton';
import { Mail } from 'lucide-react-native';
import { authApi } from '../../lib/api/auth.api';

const { width } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email });
      router.push({ pathname: '/(auth)/verify-otp', params: { email } });
    } catch {
      // For demo purposes, we will redirect anyway if API is not fully wired
      Alert.alert('Success', 'If the email exists, an OTP will be sent.');
      router.push({ pathname: '/(auth)/verify-otp', params: { email } });
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
      <AppHeader title="Forgot Password" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address to receive a 6-digit OTP to reset your password.
          </Text>
        </View>

        <GlassCard>
          <InputField
            label="Email Address"
            placeholder="Enter your registered email"
            value={email}
            onChangeText={setEmail}
            icon={<Mail size={20} color="#94a3b8" />}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <GradientButton 
            title="Send OTP" 
            onPress={handleSendOTP}
            loading={isLoading}
            style={styles.submitButton}
          />
        </GlassCard>
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
    padding: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
  },
  submitButton: {
    marginTop: 16,
  },
});
