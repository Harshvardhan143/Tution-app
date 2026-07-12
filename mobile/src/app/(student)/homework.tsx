import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GradientButton } from '../../components/common/GradientButton';
import { FileText, Calendar, CheckCircle2 } from 'lucide-react-native';

type Homework = {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted';
};

const dummyHomework: Homework[] = [
  {
    id: '1',
    subject: 'Physics',
    title: 'Kinematics Problems',
    description: 'Solve questions 1-15 from Chapter 3 of the textbook.',
    dueDate: '28 Jun 2025',
    status: 'pending'
  },
  {
    id: '2',
    subject: 'Mathematics',
    title: 'Integration Worksheet',
    description: 'Complete the attached worksheet on definite integrals.',
    dueDate: '29 Jun 2025',
    status: 'pending'
  },
  {
    id: '3',
    subject: 'Chemistry',
    title: 'Atomic Structure Notes',
    description: 'Submit your summary notes for the atomic structure chapter.',
    dueDate: '25 Jun 2025',
    status: 'submitted'
  }
];

export default function HomeworkScreen() {
  const [activeTab, setActiveTab] = useState<'pending' | 'submitted'>('pending');
  const [homeworkList, setHomeworkList] = useState<Homework[]>(dummyHomework);

  const filteredList = homeworkList.filter(hw => hw.status === activeTab);

  const markAsSubmitted = (id: string) => {
    setHomeworkList(prev => prev.map(hw => hw.id === id ? { ...hw, status: 'submitted' } : hw));
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Homework" showBack={false} />

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'submitted' && styles.activeTab]}
          onPress={() => setActiveTab('submitted')}
        >
          <Text style={[styles.tabText, activeTab === 'submitted' && styles.activeTabText]}>Submitted</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredList.length === 0 ? (
          <View style={styles.emptyState}>
            <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyStateText}>No {activeTab} homework found!</Text>
          </View>
        ) : (
          filteredList.map(hw => (
            <GlassCard key={hw.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.subjectBadge}>
                  <Text style={styles.subjectText}>{hw.subject}</Text>
                </View>
                <View style={styles.dateRow}>
                  <Calendar size={14} color="#F43F5E" />
                  <Text style={styles.dateText}>Due: {hw.dueDate}</Text>
                </View>
              </View>

              <Text style={styles.title}>{hw.title}</Text>
              
              <View style={styles.descBox}>
                <FileText size={16} color="#A0AEC0" style={{ marginTop: 2 }} />
                <Text style={styles.description}>{hw.description}</Text>
              </View>

              {hw.status === 'pending' ? (
                <View style={styles.actionRow}>
                  <GradientButton 
                    title="Mark as Submitted" 
                    onPress={() => markAsSubmitted(hw.id)}
                    style={styles.submitBtn}
                  />
                </View>
              ) : (
                <View style={styles.submittedBadge}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <Text style={styles.submittedText}>Submitted</Text>
                </View>
              )}
            </GlassCard>
          ))
        )}
      </ScrollView>
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
    paddingBottom: 40,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dateText: {
    color: '#F43F5E',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  descBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  description: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  actionRow: {
    marginTop: 4,
  },
  submitBtn: {
    paddingVertical: 12,
  },
  submittedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
  },
  submittedText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  }
});
