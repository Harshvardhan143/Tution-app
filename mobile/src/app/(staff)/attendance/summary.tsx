import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { AppHeader } from '../../../components/common/AppHeader';

const mockSummary = [
  { id: '1', batch: 'Morning Batch A', attendanceRate: 92 },
  { id: '2', batch: 'JEE Advance', attendanceRate: 85 },
  { id: '3', batch: 'Class 10 Revision', attendanceRate: 98 },
];

export default function AttendanceSummaryScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="Attendance Summary" showBack={true} />
      <ScrollView contentContainerStyle={styles.content}>
        {mockSummary.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.batchText}>{item.batch}</Text>
            <View style={styles.statsRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${item.attendanceRate}%`, backgroundColor: item.attendanceRate > 90 ? '#34C759' : '#FF9F0A' }]} />
              </View>
              <Text style={styles.rateText}>{item.attendanceRate}%</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { padding: 16, gap: 12 },
  card: { backgroundColor: '#1C1C1E', borderRadius: 12, padding: 16 },
  batchText: { color: '#FFF', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressTrack: { flex: 1, height: 8, backgroundColor: '#2C2C2E', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  rateText: { color: '#FFF', fontWeight: 'bold', width: 40, textAlign: 'right' },
});
