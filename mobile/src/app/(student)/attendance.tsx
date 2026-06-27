import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { CircularProgress } from '../../components/common/CircularProgress';
import { StatChip } from '../../components/common/StatChip';
import { AttendanceRow, AttendanceStatus } from '../../components/common/AttendanceRow';

const dummyData = [
  { date: '25 Jun', day: 'Wed', slots: ['P', 'P', 'A', 'P'] as AttendanceStatus[] },
  { date: '24 Jun', day: 'Tue', slots: ['P', 'P', 'P', 'P'] as AttendanceStatus[] },
  { date: '23 Jun', day: 'Mon', slots: ['-', '-', 'PN', 'PN'] as AttendanceStatus[] },
  { date: '21 Jun', day: 'Sat', slots: ['P', 'P', 'A', 'P'] as AttendanceStatus[] },
  { date: '20 Jun', day: 'Fri', slots: ['P', 'P', 'P', 'P'] as AttendanceStatus[] },
];

export default function AttendanceScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="Attendance" showBack={false} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Term Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          <StatChip label="" value="Overall" style={styles.activeFilter} />
          <StatChip label="" value="Term 1" style={styles.inactiveFilter} />
          <StatChip label="" value="Term 2" style={styles.inactiveFilter} />
        </ScrollView>

        {/* Hero Card */}
        <View style={styles.heroContainer}>
          <GlassCard style={styles.heroCard}>
            <CircularProgress progress={0.875} size={140} strokeWidth={12} color="#6C63FF" />
            <Text style={styles.summaryText}>P: 42  |  A: 6  |  Total: 48</Text>
          </GlassCard>
        </View>

        {/* Subject Breakdown */}
        <Text style={styles.sectionTitle}>Subject Breakdown</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subjectRow}>
          <StatChip label="Math" value="92%" />
          <StatChip label="Physics" value="85%" />
          <StatChip label="Chemistry" value="88%" />
          <StatChip label="English" value="95%" />
        </ScrollView>

        {/* Recent Attendance */}
        <Text style={styles.sectionTitle}>Recent Classes</Text>
        <View style={styles.listContainer}>
          {dummyData.map((item, index) => (
            <AttendanceRow key={index} date={item.date} day={item.day} slots={item.slots} />
          ))}
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
  filterRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  activeFilter: {
    borderColor: '#6C63FF',
    borderWidth: 1.5,
  },
  inactiveFilter: {
    opacity: 0.7,
  },
  heroContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  summaryText: {
    marginTop: 20,
    color: '#A0AEC0',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  subjectRow: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  listContainer: {
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginHorizontal: 16,
    borderRadius: 20,
    paddingBottom: 8,
  },
});
