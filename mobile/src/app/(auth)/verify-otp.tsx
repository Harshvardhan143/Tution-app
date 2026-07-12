import React, { useState } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, Alert, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppHeader } from '../../components/common/AppHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { InputField } from '../../components/common/InputField';
import { GradientButton } from '../../components/common/GradientButton';
import { KeyRound } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function VerifyOTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string }>();
  const email = params.email || '';
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    // Simulate API verification
    setTimeout(() => {
      setIsLoading(false);
      router.push({ pathname: '/(auth)/reset-password', params: { email, otp } });
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.glow} />
      <AppHeader title="Verify OTP" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            We&apos;ve sent a 6-digit code to {email || 'your email'}.
          </Text>
        </View>

        <GlassCard>
          <InputField
            label="One Time Password"
            placeholder="Enter 6-digit code"
            value={otp}
            onChangeText={setOtp}
            icon={<KeyRound size={20} color="#94a3b8" />}
            keyboardType="number-pad"
            maxLength={6}
          />

          <GradientButton 
            title="Verify & Proceed" 
            onPress={handleVerify}
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
