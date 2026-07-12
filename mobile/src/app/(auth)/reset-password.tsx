import React, { useState } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '../../components/common/AppHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { InputField } from '../../components/common/InputField';
import { GradientButton } from '../../components/common/GradientButton';
import { Lock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ResetPasswordScreen() {
  const router = useRouter();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    // Simulate API reset password call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Your password has been successfully reset.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') }
      ]);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.glow} />
      <AppHeader title="Create New Password" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>New Password</Text>
          <Text style={styles.subtitle}>
            Your new password must be different from previous used passwords.
          </Text>
        </View>

        <GlassCard>
          <InputField
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChangeText={setPassword}
            icon={<Lock size={20} color="#94a3b8" />}
            isPassword
          />
          
          <InputField
            label="Confirm Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            icon={<Lock size={20} color="#94a3b8" />}
            isPassword
          />

          <GradientButton 
            title="Reset Password" 
            onPress={handleReset}
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
