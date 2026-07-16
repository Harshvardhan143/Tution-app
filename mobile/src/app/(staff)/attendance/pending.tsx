import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '../../../components/common/AppHeader';

const mockPending = [
  { id: '1', batch: 'Morning Batch A', subject: 'Mathematics', time: '09:00 AM - 10:30 AM', date: 'Today' },
  { id: '2', batch: 'JEE Advance', subject: 'Physics', time: '10:45 AM - 12:15 PM', date: 'Yesterday' },
];

export default function PendingAttendanceScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AppHeader title="Pending Attendance" showBack={true} />
      <ScrollView contentContainerStyle={styles.content}>
        {mockPending.length === 0 ? (
          <Text style={styles.emptyText}>No pending attendance to mark.</Text>
        ) : (
          mockPending.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => router.push(`/(staff)/attendance/mark?batch=${encodeURIComponent(item.batch)}` as never)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.batchText}>{item.batch}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              <Text style={styles.subjectText}>{item.subject}</Text>
              <Text style={styles.timeText}>{item.time}</Text>
              <View style={styles.markBtn}>
                <Text style={styles.markBtnText}>Mark Now</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { padding: 16, gap: 12 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: '#1C1C1E', borderRadius: 12, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  batchText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  dateText: { color: '#FF453A', fontSize: 12, fontWeight: '600' },
  subjectText: { color: '#A0AEC0', fontSize: 14, marginBottom: 4 },
  timeText: { color: '#888', fontSize: 12, marginBottom: 16 },
  markBtn: { backgroundColor: '#0A84FF', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  markBtnText: { color: '#FFF', fontWeight: '600' },
});
