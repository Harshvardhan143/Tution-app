import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

export interface StatChipProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function StatChip({ label, value, icon, style }: StatChipProps) {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 12,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconContainer: {
    marginRight: 12,
    backgroundColor: '#e0e7ff',
    padding: 8,
    borderRadius: 12,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});
