import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type AttendanceStatus = 'P' | 'A' | 'PN' | '-';

export interface AttendanceRowProps {
  date: string;
  day: string;
  slots: AttendanceStatus[];
}

export function AttendanceRow({ date, day, slots }: AttendanceRowProps) {
  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'P': return { bg: '#dcfce7', text: '#166534' };
      case 'A': return { bg: '#fee2e2', text: '#991b1b' };
      case 'PN': return { bg: '#fef9c3', text: '#854d0e' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.day}>{day}</Text>
      </View>
      <View style={styles.slotsContainer}>
        {slots.map((status, index) => {
          const colors = getStatusColor(status);
          return (
            <View key={index} style={[styles.slotBadge, { backgroundColor: colors.bg }]}>
              <Text style={[styles.slotText, { color: colors.text }]}>{status}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dateContainer: {
    width: 60,
  },
  date: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  day: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  slotsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
