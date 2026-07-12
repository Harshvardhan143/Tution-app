import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';

export interface GradientBadgeProps extends ViewProps {
  label: string;
  color?: string;
}

export function GradientBadge({ label, color = '#3b82f6', style, ...props }: GradientBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color }, style]} {...props}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
