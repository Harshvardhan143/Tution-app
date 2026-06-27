import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface LectureCardProps {
  subject: string;
  time: string;
  teacher: string;
  room: string;
  color?: string;
}

export function LectureCard({ subject, time, teacher, room, color = '#6C63FF' }: LectureCardProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.colorBar, { backgroundColor: color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.subject}>{subject}</Text>
          <Text style={[styles.time, { color }]}>{time}</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    marginBottom: 8,
  },
  subject: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teacher: {
    fontSize: 14,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  room: {
    fontSize: 12,
    color: '#A0AEC0',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
