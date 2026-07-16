import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { Download } from 'lucide-react-native';

const mockPayslips = [
  { id: '1', month: 'June 2026', amount: '₹ 45,000', status: 'Paid' },
  { id: '2', month: 'May 2026', amount: '₹ 45,000', status: 'Paid' },
];

export default function PayslipScreen() {
  const handleDownload = (month: string) => {
    Alert.alert('Download', `Downloading payslip for ${month}...`);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="My Payslips" showBack={true} />
      
      <ScrollView contentContainerStyle={styles.content}>
        {mockPayslips.map(slip => (
          <View key={slip.id} style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.monthText}>{slip.month}</Text>
              <Text style={styles.amountText}>{slip.amount}</Text>
              <Text style={styles.statusText}>{slip.status}</Text>
            </View>
            <TouchableOpacity style={styles.downloadBtn} onPress={() => handleDownload(slip.month)}>
              <Download color="#0A84FF" size={24} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { padding: 16, gap: 12 },
  card: { backgroundColor: '#1C1C1E', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  info: { flex: 1 },
  monthText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  amountText: { color: '#34C759', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  statusText: { color: '#888', fontSize: 14 },
  downloadBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(10, 132, 255, 0.1)', alignItems: 'center', justifyContent: 'center' },
});
