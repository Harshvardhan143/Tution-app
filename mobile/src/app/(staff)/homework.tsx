import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';

const mockHomework = [
  { id: '1', title: 'Calculus Exercises', batch: 'JEE Advance', dueDate: '2026-07-18', submissions: 12 },
  { id: '2', title: 'Algebra Practice', batch: 'Morning Batch A', dueDate: '2026-07-20', submissions: 5 },
];

export default function HomeworkScreen() {
  const [tab, setTab] = useState<'create' | 'view'>('view');
  const [title, setTitle] = useState('');
  
  const handleAssign = () => {
    if (!title) {
      Alert.alert('Error', 'Please enter title');
      return;
    }
    Alert.alert('Success', 'Homework assigned!');
    setTitle('');
    setTab('view');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Homework" showBack={true} />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, tab === 'view' && styles.activeTab]} onPress={() => setTab('view')}>
          <Text style={[styles.tabText, tab === 'view' && styles.activeTabText]}>Assigned</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'create' && styles.activeTab]} onPress={() => setTab('create')}>
          <Text style={[styles.tabText, tab === 'create' && styles.activeTabText]}>Assign New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'view' ? (
          mockHomework.map(hw => (
            <View key={hw.id} style={styles.card}>
              <Text style={styles.titleText}>{hw.title}</Text>
              <Text style={styles.batchText}>Batch: {hw.batch}</Text>
              <Text style={styles.dueText}>Due: {hw.dueDate}</Text>
              <View style={styles.statsRow}>
                <Text style={styles.statsText}>{hw.submissions} Submissions</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="E.g. Exercise 1.1" placeholderTextColor="#888" />
            
            <Text style={styles.label}>Due Date</Text>
            <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#888" />
            
            <TouchableOpacity style={styles.submitBtn} onPress={handleAssign}>
              <Text style={styles.submitBtnText}>Assign Homework</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#1C1C1E', margin: 16, borderRadius: 8, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: '#333' },
  tabText: { color: '#888', fontWeight: '600' },
  activeTabText: { color: '#FFF' },
  content: { padding: 16, gap: 12 },
  card: { backgroundColor: '#1C1C1E', borderRadius: 12, padding: 16 },
  titleText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  batchText: { color: '#A0AEC0', marginBottom: 4 },
  dueText: { color: '#FF453A', marginBottom: 12 },
  statsRow: { backgroundColor: '#333', padding: 8, borderRadius: 6, alignSelf: 'flex-start' },
  statsText: { color: '#FFF', fontSize: 12 },
  formCard: { backgroundColor: '#1C1C1E', padding: 16, borderRadius: 12 },
  label: { color: '#A0AEC0', marginBottom: 8 },
  input: { backgroundColor: '#000', color: '#FFF', borderRadius: 8, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#333' },
  submitBtn: { backgroundColor: '#0A84FF', padding: 14, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontWeight: 'bold' },
});
