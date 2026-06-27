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
      case 'P': return { bg: '#10B981', text: '#ffffff' };
      case 'A': return { bg: '#F43F5E', text: '#ffffff' };
      case 'PN': return { bg: '#F59E0B', text: '#ffffff' };
      default: return { bg: 'rgba(255,255,255,0.1)', text: '#A0AEC0' };
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
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dateContainer: {
    width: 60,
  },
  date: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  day: {
    fontSize: 12,
    color: '#A0AEC0',
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
