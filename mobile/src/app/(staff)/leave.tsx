import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';

const mockLeaves = [
  { id: '1', date: '2026-07-20', reason: 'Personal', status: 'Approved' },
  { id: '2', date: '2026-08-05', reason: 'Medical', status: 'Pending' },
];

export default function LeaveScreen() {
  const [tab, setTab] = useState<'apply' | 'status'>('apply');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');

  const handleApply = () => {
    if (!reason || !date) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Alert.alert('Success', 'Leave application submitted');
    setReason('');
    setDate('');
    setTab('status');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Leave Management" showBack={true} />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, tab === 'apply' && styles.activeTab]} onPress={() => setTab('apply')}>
          <Text style={[styles.tabText, tab === 'apply' && styles.activeTabText]}>Apply Leave</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'status' && styles.activeTab]} onPress={() => setTab('status')}>
          <Text style={[styles.tabText, tab === 'status' && styles.activeTabText]}>Leave Status</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'apply' ? (
          <View style={styles.formCard}>
            <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
            <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2026-07-20" placeholderTextColor="#888" />
            <Text style={styles.label}>Reason</Text>
            <TextInput style={[styles.input, styles.textArea]} value={reason} onChangeText={setReason} multiline placeholder="Enter reason..." placeholderTextColor="#888" />
            <TouchableOpacity style={styles.submitBtn} onPress={handleApply}>
              <Text style={styles.submitBtnText}>Submit Application</Text>
            </TouchableOpacity>
          </View>
        ) : (
          mockLeaves.map((leave) => (
            <View key={leave.id} style={styles.leaveCard}>
              <View>
                <Text style={styles.leaveDate}>{leave.date}</Text>
                <Text style={styles.leaveReason}>{leave.reason}</Text>
              </View>
              <View style={[styles.badge, leave.status === 'Approved' ? styles.badgeApproved : styles.badgePending]}>
                <Text style={[styles.badgeText, leave.status === 'Approved' ? styles.badgeApprovedText : styles.badgePendingText]}>{leave.status}</Text>
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
  tabContainer: { flexDirection: 'row', backgroundColor: '#1C1C1E', margin: 16, borderRadius: 8, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: '#333' },
  tabText: { color: '#888', fontWeight: '600' },
  activeTabText: { color: '#FFF' },
  content: { padding: 16 },
  formCard: { backgroundColor: '#1C1C1E', padding: 16, borderRadius: 12 },
  label: { color: '#A0AEC0', marginBottom: 8 },
  input: { backgroundColor: '#000', color: '#FFF', borderRadius: 8, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#333' },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#0A84FF', padding: 14, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontWeight: 'bold' },
  leaveCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 16, borderRadius: 12, marginBottom: 12 },
  leaveDate: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  leaveReason: { color: '#888', marginTop: 4 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  badgeApproved: { backgroundColor: 'rgba(52, 199, 89, 0.2)' },
  badgePending: { backgroundColor: 'rgba(255, 159, 10, 0.2)' },
  badgeText: { fontWeight: 'bold', fontSize: 12 },
  badgeApprovedText: { color: '#34C759' },
  badgePendingText: { color: '#FF9F0A' },
});
