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
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');
// Calculate bounded width for background blobs so they don't look huge on tablets/web
const boundedWidth = Math.min(width, 500);

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      <StatusBar barStyle="dark-content" backgroundColor="#B8E3F5" />
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Background Ambient Shapes */}
        <View style={styles.topLeftBlob} pointerEvents="none" />
        <View style={styles.topLeftBlob2} pointerEvents="none" />
        <View style={styles.bottomRightBlob} pointerEvents="none" />
        <View style={styles.bottomRightBlob2} pointerEvents="none" />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Area */}
          <View style={styles.header}>
            <Text style={styles.title}>Log in</Text>
            <Text style={styles.subtitle}>
              Enter your login details to{"\n"}access your account
            </Text>
          </View>

          {/* Form Area */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Email or Username"
                placeholderTextColor="#A0AEC0"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A0AEC0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#FF5A5F" />
                ) : (
                  <Eye size={18} color="#FF5A5F" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgotWrap}
              onPress={() => router.push('/(auth)/forgot-password' as never)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register' as never)}>
              <Text style={styles.footerLink}> Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#B8E3F5', // Light blue background from mockup
  },
  
  // -- Background Shapes --
  topLeftBlob: {
    position: 'absolute',
    top: -boundedWidth * 0.15,
    left: -boundedWidth * 0.15,
    width: boundedWidth * 0.6,
    height: boundedWidth * 0.6,
    borderRadius: boundedWidth * 0.3,
    backgroundColor: '#95D1EF',
  },
  topLeftBlob2: {
    position: 'absolute',
    top: -boundedWidth * 0.2,
    left: boundedWidth * 0.2,
    width: boundedWidth * 0.4,
    height: boundedWidth * 0.4,
    borderRadius: boundedWidth * 0.2,
    backgroundColor: '#95D1EF',
    opacity: 0.7,
  },
  bottomRightBlob: {
    position: 'absolute',
    bottom: -boundedWidth * 0.2,
    right: -boundedWidth * 0.15,
    width: boundedWidth * 0.7,
    height: boundedWidth * 0.7,
    borderRadius: boundedWidth * 0.35,
    backgroundColor: '#95D1EF',
  },
  bottomRightBlob2: {
    position: 'absolute',
    bottom: boundedWidth * 0.1,
    right: -boundedWidth * 0.2,
    width: boundedWidth * 0.4,
    height: boundedWidth * 0.4,
    borderRadius: boundedWidth * 0.2,
    backgroundColor: '#95D1EF',
    opacity: 0.7,
  },

  // -- Layout --
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    paddingBottom: 40,
    // Max width added so it stays perfectly sized on iPads, tablets and Web
    alignSelf: 'center',
    width: '100%',
    maxWidth: 450,
  },

  // -- Header --
  header: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: '#1A202C',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 20,
  },

  // -- Form --
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 52,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1A202C',
    height: '100%',
    outlineStyle: 'none' as any, // fixes blue ring in web browser
  },
  eyeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  forgotWrap: {
    alignSelf: 'flex-start',
    marginBottom: 40,
    marginTop: 4,
  },
  forgotText: {
    color: '#4988F0',
    fontSize: 13,
    fontWeight: '600',
  },
  
  // -- Button --
  loginButton: {
    width: '100%',
    backgroundColor: '#4A8BE8',
    borderRadius: 25,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A8BE8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // -- Footer --
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: 60,
  },
  footerText: {
    color: '#1A202C',
    fontSize: 13,
    fontWeight: '600',
  },
  footerLink: {
    color: '#4A8BE8',
    fontSize: 13,
    fontWeight: '600',
  },
});
