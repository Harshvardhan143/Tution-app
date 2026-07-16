import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';

const mockStudents = [
  { id: '1', name: 'Arjun Mehta', rollNo: 'TUT-001' },
  { id: '2', name: 'Sneha Rao', rollNo: 'TUT-002' },
];

export default function ResultsEntryScreen() {
  const [marks, setMarks] = useState<Record<string, string>>({});
  
  const handleSave = () => {
    Alert.alert('Success', 'Marks saved successfully!');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Enter Results" showBack={true} />
      
      <View style={styles.headerInfo}>
        <Text style={styles.infoText}>Batch: Morning Batch A</Text>
        <Text style={styles.infoText}>Test: Unit Test 1 (Maths)</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {mockStudents.map(student => (
          <View key={student.id} style={styles.row}>
            <View style={styles.studentInfo}>
              <Text style={styles.nameText}>{student.name}</Text>
              <Text style={styles.rollText}>{student.rollNo}</Text>
            </View>
            <View style={styles.inputWrap}>
              <TextInput 
                style={styles.input} 
                placeholder="0" 
                placeholderTextColor="#888" 
                keyboardType="number-pad"
                value={marks[student.id] || ''}
                onChangeText={(val) => setMarks(prev => ({...prev, [student.id]: val}))}
              />
              <Text style={styles.maxMarks}>/ 100</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Submit Results</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  headerInfo: { backgroundColor: '#1C1C1E', padding: 16, borderBottomWidth: 1, borderBottomColor: '#333' },
  infoText: { color: '#FFF', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  content: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 16, borderRadius: 12 },
  studentInfo: { flex: 1 },
  nameText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  rollText: { color: '#888', fontSize: 12, marginTop: 4 },
  inputWrap: { flexDirection: 'row', alignItems: 'center' },
  input: { backgroundColor: '#000', color: '#FFF', width: 60, height: 40, borderRadius: 6, textAlign: 'center', borderWidth: 1, borderColor: '#333' },
  maxMarks: { color: '#888', marginLeft: 8 },
  footer: { padding: 16, backgroundColor: '#1C1C1E', borderTopWidth: 1, borderTopColor: '#333' },
  saveBtn: { backgroundColor: '#34C759', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
