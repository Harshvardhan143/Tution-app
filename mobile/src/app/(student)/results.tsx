import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { StatChip } from '../../components/common/StatChip';
import { GradientBadge } from '../../components/common/GradientBadge';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

const dummyTests = [
  {
    id: 'T1',
    name: 'Unit Test 1',
    date: '10 Jun 2025',
    overall: 78.5,
    subjects: [
      { name: 'Mathematics', marks: 45, max: 50, grade: 'A' },
      { name: 'Physics', marks: 38, max: 50, grade: 'B' },
      { name: 'Chemistry', marks: 42, max: 50, grade: 'A' },
    ]
  },
  {
    id: 'T2',
    name: 'Mid Term Exam',
    date: '15 Aug 2025',
    overall: 82.0,
    subjects: [
      { name: 'Mathematics', marks: 88, max: 100, grade: 'A' },
      { name: 'Physics', marks: 75, max: 100, grade: 'B' },
      { name: 'Chemistry', marks: 83, max: 100, grade: 'A' },
    ]
  }
];



export default function ResultsScreen() {
  const [expandedId, setExpandedId] = useState<string | null>('T2');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A') return '#10B981';
    if (grade === 'B') return '#06B6D4';
    if (grade === 'C') return '#F59E0B';
    return '#F43F5E';
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Results & Reports" showBack={false} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Stat Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
          <StatChip label="Overall %" value="75.4%" style={styles.statGreen} />
          <StatChip label="Total Tests" value="6" />
          <StatChip label="Best Score" value="92%" />
        </ScrollView>

        <Text style={styles.sectionTitle}>Performance Trend</Text>
        <View style={styles.chartContainer}>
          <GlassCard style={styles.chartCard}>
             <Text style={{color: '#A0AEC0', textAlign: 'center'}}>Chart Placeholder (Victory Native)</Text>
          </GlassCard>
        </View>

        <Text style={styles.sectionTitle}>Test Results</Text>
        
        <View style={styles.listContainer}>
          {dummyTests.map((test) => {
            const isExpanded = expandedId === test.id;
            const isGood = test.overall >= 60;

            return (
              <GlassCard key={test.id} style={styles.testCard}>
                <TouchableOpacity onPress={() => toggleExpand(test.id)} activeOpacity={0.7} style={styles.testHeader}>
                  <View>
                    <Text style={styles.testName}>{test.name}</Text>
                    <Text style={styles.testDate}>{test.date}</Text>
                  </View>
                  <View style={styles.testRight}>
                    <Text style={[styles.testScore, { color: isGood ? '#10B981' : '#F43F5E' }]}>
                      {test.overall}%
                    </Text>
                    {isExpanded ? <ChevronUp size={20} color="#A0AEC0" /> : <ChevronDown size={20} color="#A0AEC0" />}
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.colLeft, styles.headerText]}>Subject</Text>
                      <Text style={[styles.colCenter, styles.headerText]}>Marks</Text>
                      <Text style={[styles.colRight, styles.headerText]}>Grade</Text>
                    </View>

                    {test.subjects.map((sub, index) => (
                      <View key={index} style={styles.tableRow}>
                        <Text style={[styles.colLeft, styles.rowText]}>{sub.name}</Text>
                        <Text style={[styles.colCenter, styles.rowText]}>
                          {sub.marks}/{sub.max}
                        </Text>
                        <View style={[styles.colRight, styles.badgeWrapper]}>
                          <GradientBadge 
                            label={sub.grade} 
                            color={getGradeColor(sub.grade)} 
                          />
                        </View>
                      </View>
                    ))}
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
  statsRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    gap: 12,
  },
  statGreen: {
    borderColor: '#10B981',
    borderWidth: 1,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  chartContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  chartCard: {
    height: 200,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  testCard: {
    marginBottom: 12,
    padding: 16,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  testDate: {
    color: '#A0AEC0',
    fontSize: 12,
  },
  testRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  testScore: {
    fontSize: 18,
    fontWeight: '700',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 8,
  },
  headerText: {
    color: '#A0AEC0',
    fontSize: 12,
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
  },
  rowText: {
    color: '#ffffff',
    fontSize: 14,
  },
  colLeft: {
    flex: 2,
  },
  colCenter: {
    flex: 1,
    textAlign: 'center',
  },
  colRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  badgeWrapper: {
    alignItems: 'flex-end',
  }
});
