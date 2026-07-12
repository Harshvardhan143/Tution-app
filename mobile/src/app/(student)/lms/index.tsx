import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { AppHeader } from '../../../components/common/AppHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { StatChip } from '../../../components/common/StatChip';
import { BookOpen } from 'lucide-react-native';

const dummySubjects = [
  { id: 'math-101', name: 'Mathematics', code: 'MAT101', materialsCount: 12 },
  { id: 'phy-101', name: 'Physics', code: 'PHY101', materialsCount: 8 },
  { id: 'chem-101', name: 'Chemistry', code: 'CHE101', materialsCount: 5 },
  { id: 'eng-101', name: 'English', code: 'ENG101', materialsCount: 3 },
];

export default function LMSScreen() {
  const [activeTab, setActiveTab] = useState('Sem 1');

  const tabs = ['Sem 1', 'Sem 2', 'Previous Year'];

  return (
    <View style={styles.container}>
      <AppHeader title="Study Material" showBack={false} />

      {/* Tabs */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {tabs.map(tab => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <StatChip 
                label="" 
                value={tab} 
                style={activeTab === tab ? styles.activeTab : styles.inactiveTab} 
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Subject List */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {dummySubjects.map((subject) => (
          <TouchableOpacity 
            key={subject.id} 
            activeOpacity={0.7}
            onPress={() => router.push(`/(student)/lms/${subject.id}` as never)}
          >
            <GlassCard style={styles.subjectCard}>
              <View style={styles.iconContainer}>
                <BookOpen size={24} color="#fff" />
              </View>
              <View style={styles.subjectInfo}>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={styles.subjectCode}>{subject.code} • {subject.materialsCount} resources</Text>
              </View>
            </GlassCard>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  tabsRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 12,
  },
  activeTab: {
    borderColor: '#6C63FF',
    borderWidth: 1.5,
  },
  inactiveTab: {
    opacity: 0.6,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subjectCode: {
    color: '#A0AEC0',
    fontSize: 14,
  },
});
