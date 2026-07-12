import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GradientBadge } from '../../components/common/GradientBadge';
import { ChevronDown, ChevronUp, Download } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const dummyReceipts = [
  {
    id: 'RCP-2025-001',
    date: '10 Jun 2025',
    amount: 4500,
    mode: 'UPI',
    heads: [
      { name: 'Tuition Fee', amount: 3500 },
      { name: 'Material Fee', amount: 1000 },
    ]
  },
  {
    id: 'RCP-2025-002',
    date: '15 Jul 2025',
    amount: 3000,
    mode: 'Cash',
    heads: [
      { name: 'Tuition Fee', amount: 3000 },
    ]
  }
];

export default function FeesScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Fees & Payments" showBack={false} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryContainer}>
          <LinearGradient 
            colors={['#6C63FF', '#4F46E5']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }}
            style={styles.gradientCard}
          >
            <Text style={styles.summaryTitle}>Total Due</Text>
            <Text style={styles.summaryAmount}>₹9,000</Text>
            
            <View style={styles.row}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Paid</Text>
                <Text style={[styles.statValue, { color: '#10B981' }]}>₹7,500</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Pending</Text>
                <Text style={[styles.statValue, { color: '#F43F5E' }]}>₹1,500</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '83%' }]} />
            </View>
          </LinearGradient>
        </View>

        <Text style={styles.sectionTitle}>Payment History</Text>
        
        <View style={styles.listContainer}>
          {dummyReceipts.map((receipt) => {
            const isExpanded = expandedId === receipt.id;
            return (
              <GlassCard key={receipt.id} style={styles.receiptCard}>
                <TouchableOpacity onPress={() => toggleExpand(receipt.id)} activeOpacity={0.7} style={styles.receiptHeader}>
                  <View>
                    <Text style={styles.receiptId}>{receipt.id}</Text>
                    <Text style={styles.receiptDate}>{receipt.date}</Text>
                  </View>
                  <View style={styles.receiptRight}>
                    <Text style={styles.receiptAmount}>₹{receipt.amount}</Text>
                    {isExpanded ? <ChevronUp size={20} color="#A0AEC0" /> : <ChevronDown size={20} color="#A0AEC0" />}
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <View style={styles.badgesRow}>
                      <GradientBadge label={receipt.mode} color="#06B6D4" />
                      <TouchableOpacity style={styles.downloadBtn}>
                        <Download size={14} color="#fff" />
                        <Text style={styles.downloadText}>Receipt</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.headsContainer}>
                      {receipt.heads.map((head, index) => (
                        <View key={index} style={styles.headRow}>
                          <Text style={styles.headName}>{head.name}</Text>
                          <Text style={styles.headAmount}>₹{head.amount}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </GlassCard>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  summaryContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    marginBottom: 24,
  },
  gradientCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  summaryTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryAmount: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  receiptCard: {
    marginBottom: 12,
    padding: 16,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptId: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  receiptDate: {
    color: '#A0AEC0',
    fontSize: 12,
  },
  receiptRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  receiptAmount: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  downloadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  headsContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 12,
  },
  headRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  headName: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  headAmount: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  }
});
