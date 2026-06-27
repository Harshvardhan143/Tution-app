import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { AppHeader } from '../../../components/common/AppHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { MessageCircle, CheckCircle2, Plus } from 'lucide-react-native';
import { GradientButton } from '../../../components/common/GradientButton';

type Doubt = {
  id: string;
  subject: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  status: 'open' | 'answered';
  date: string;
};

const dummyDoubts: Doubt[] = [
  {
    id: '1',
    subject: 'Physics',
    question: 'Could you explain why the normal force does no work on an object moving horizontally?',
    status: 'open',
    date: 'Today'
  },
  {
    id: '2',
    subject: 'Chemistry',
    question: 'What is the difference between molarity and molality?',
    answer: 'Molarity is moles of solute per liter of solution, while molality is moles of solute per kilogram of solvent. Molality is temperature independent.',
    answeredBy: 'Mr. Rajesh Kumar',
    status: 'answered',
    date: 'Yesterday'
  }
];

export default function DoubtsScreen() {
  const [activeTab, setActiveTab] = useState<'open' | 'answered'>('open');

  const filteredDoubts = dummyDoubts.filter(d => d.status === activeTab);

  return (
    <View style={styles.container}>
      <AppHeader title="My Doubts" showBack={false} />

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'open' && styles.activeTab]}
          onPress={() => setActiveTab('open')}
        >
          <Text style={[styles.tabText, activeTab === 'open' && styles.activeTabText]}>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'answered' && styles.activeTab]}
          onPress={() => setActiveTab('answered')}
        >
          <Text style={[styles.tabText, activeTab === 'answered' && styles.activeTabText]}>Answered</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredDoubts.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageCircle size={48} color="#6C63FF" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyStateText}>No {activeTab} doubts found.</Text>
          </View>
        ) : (
          filteredDoubts.map(doubt => (
            <GlassCard key={doubt.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.subjectBadge}>
                  <Text style={styles.subjectText}>{doubt.subject}</Text>
                </View>
                <Text style={styles.dateText}>{doubt.date}</Text>
              </View>

              <Text style={styles.question}>Q: {doubt.question}</Text>

              {doubt.status === 'answered' && (
                <View style={styles.answerBox}>
                  <View style={styles.answerHeader}>
                    <CheckCircle2 size={16} color="#10B981" />
                    <Text style={styles.answeredByText}>Answered by {doubt.answeredBy}</Text>
                  </View>
                  <Text style={styles.answerText}>{doubt.answer}</Text>
                </View>
              )}
            </GlassCard>
          ))
        )}
      </ScrollView>

      <View style={styles.fabContainer}>
        <GradientButton 
          title="Ask a Doubt" 
          onPress={() => router.push('/(student)/doubts/new' as never)}
          icon={<Plus size={20} color="#fff" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  tabText: {
    color: '#A0AEC0',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#6C63FF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#A0AEC0',
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectBadge: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectText: {
    color: '#6C63FF',
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    color: '#A0AEC0',
    fontSize: 12,
  },
  question: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  answerBox: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  answeredByText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '600',
  },
  answerText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  }
});
