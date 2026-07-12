import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export interface GradientButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function GradientButton({ title, loading, icon, style, disabled, ...props }: GradientButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, (disabled || loading) && styles.disabled, style]} 
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <LinearGradient
        colors={['#6C63FF', '#4F46E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {icon}
            <Text style={styles.text}>{title}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  gradient: {
    width: '100%',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
