import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface LectureCardProps {
  subject: string;
  time: string;
  teacher: string;
  room: string;
  color?: string;
}

export function LectureCard({ subject, time, teacher, room, color = '#3b82f6' }: LectureCardProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.colorBar, { backgroundColor: color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.subject}>{subject}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.teacher}>{teacher}</Text>
          <Text style={styles.room}>Room: {room}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  colorBar: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subject: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teacher: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  room: {
    fontSize: 12,
    color: '#94a3b8',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
