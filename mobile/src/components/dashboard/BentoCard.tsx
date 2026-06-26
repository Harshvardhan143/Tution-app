import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export interface BentoCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onPress: () => void;
  color?: string | string[]; // Single color or gradient array
  size?: 'small' | 'medium' | 'large';
  span?: 1 | 2; // For grid spanning
}

export function BentoCard({ title, subtitle, icon, onPress, color = '#3b82f6', size = 'medium', span = 1 }: BentoCardProps) {
  const isGradient = Array.isArray(color);
  
  const content = (
    <>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </>
  );

  const containerStyle = [
    styles.card,
    span === 2 && styles.span2,
    size === 'small' && styles.small,
    size === 'large' && styles.large,
  ];

  if (isGradient) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={containerStyle}>
        <LinearGradient
          colors={color as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.8} 
      style={[...containerStyle, { backgroundColor: color as string }]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    flex: 1,
    minHeight: 120,
    margin: 6,
  },
  gradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  span2: {
    minWidth: '46%', // Approximately half width minus margins
  },
  small: {
    minHeight: 100,
  },
  large: {
    minHeight: 160,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  textContainer: {
    justifyContent: 'flex-end',
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
});
