import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

export type BadgeStatus = 'Approved' | 'Pending' | 'Rejected' | 'Active' | 'Inactive';

export interface StatusBadgeProps {
  status: BadgeStatus | string;
  style?: ViewStyle;
}

export function StatusBadge({ status, style }: StatusBadgeProps) {
  const getStyle = () => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'active':
        return { bg: '#dcfce7', text: '#166534' };
      case 'rejected':
      case 'inactive':
        return { bg: '#fee2e2', text: '#991b1b' };
      case 'pending':
        return { bg: '#fef3c7', text: '#92400e' };
      default:
        return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const colors = getStyle();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }, style]}>
      <Text style={[styles.text, { color: colors.text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
