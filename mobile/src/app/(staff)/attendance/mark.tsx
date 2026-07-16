import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppHeader } from '../../../components/common/AppHeader';

const mockStudents = [
  { id: '1', name: 'Arjun Mehta', rollNo: 'TUT-001' },
  { id: '2', name: 'Sneha Rao', rollNo: 'TUT-002' },
  { id: '3', name: 'Rohan Gupta', rollNo: 'TUT-003' },
];

export default function MarkAttendanceScreen() {
  const router = useRouter();
  const { batch } = useLocalSearchParams();
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const toggleAttendance = (id: string) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    Alert.alert('Success', 'Attendance saved successfully.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      <AppHeader title={`Mark: ${batch || 'Batch'}`} showBack={true} />
      <View style={styles.toolbar}>
        <Text style={styles.instruction}>Tap to mark Absent</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {mockStudents.map((student) => {
          const isAbsent = attendance[student.id];
          return (
            <TouchableOpacity 
              key={student.id} 
              style={[styles.row, isAbsent && styles.rowAbsent]}
              onPress={() => toggleAttendance(student.id)}
            >
              <View>
                <Text style={styles.nameText}>{student.name}</Text>
                <Text style={styles.rollText}>{student.rollNo}</Text>
              </View>
              <View style={[styles.badge, isAbsent ? styles.badgeAbsent : styles.badgePresent]}>
                <Text style={styles.badgeText}>{isAbsent ? 'A' : 'P'}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#1C1C1E' },
  instruction: { color: '#888', fontSize: 14 },
  saveBtn: { backgroundColor: '#34C759', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold' },
  content: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#1C1C1E' },
  rowAbsent: { borderColor: '#FF453A', backgroundColor: '#2C1C1E' },
  nameText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  rollText: { color: '#A0AEC0', fontSize: 12, marginTop: 4 },
  badge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  badgePresent: { backgroundColor: 'rgba(52, 199, 89, 0.2)' },
  badgeAbsent: { backgroundColor: 'rgba(255, 69, 58, 0.2)' },
  badgeText: { color: '#FFF', fontWeight: 'bold' },
});
