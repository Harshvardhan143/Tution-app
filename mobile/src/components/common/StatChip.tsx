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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    minWidth: 130,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  label: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 2,
  },
});
