import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { Search } from 'lucide-react-native';

const mockStudents = [
  { id: '1', name: 'Arjun Mehta', rollNo: 'TUT-001', batch: 'Morning Batch A', phone: '9876543210' },
  { id: '2', name: 'Sneha Rao', rollNo: 'TUT-002', batch: 'JEE Advance', phone: '9876543211' },
];

export default function SearchStudentScreen() {
  const [query, setQuery] = useState('');

  const filtered = mockStudents.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.rollNo.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={styles.container}>
      <AppHeader title="Search Student" showBack={true} />
      
      <View style={styles.searchContainer}>
        <Search color="#888" size={20} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search by name or roll no..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filtered.length === 0 ? (
          <Text style={styles.emptyText}>No students found.</Text>
        ) : (
          filtered.map(student => (
            <View key={student.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.nameText}>{student.name}</Text>
                <Text style={styles.rollText}>{student.rollNo}</Text>
              </View>
              <Text style={styles.detailText}>Batch: {student.batch}</Text>
              <Text style={styles.detailText}>Phone: {student.phone}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>View Profile</Text></TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', margin: 16, borderRadius: 8, paddingHorizontal: 12 },
  searchInput: { flex: 1, padding: 12, color: '#FFF' },
  content: { padding: 16, gap: 12 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: '#1C1C1E', borderRadius: 12, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  nameText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  rollText: { color: '#0A84FF', fontWeight: '600' },
  detailText: { color: '#A0AEC0', marginBottom: 4 },
  actionRow: { flexDirection: 'row', marginTop: 12 },
  btn: { backgroundColor: '#333', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  btnText: { color: '#FFF', fontWeight: '600' },
});
