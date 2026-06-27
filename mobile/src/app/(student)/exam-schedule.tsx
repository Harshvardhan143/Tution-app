import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { Calendar, Clock, MapPin, BookOpen } from 'lucide-react-native';

const dummyExams = [
  {
    id: '1',
    subject: 'Physics',
    date: '28 Jun 2025',
    time: '10:00 AM - 12:00 PM',
    room: 'Hall A',
    syllabus: 'Chapters 1 to 5',
    maxMarks: 100
  },
  {
    id: '2',
    subject: 'Mathematics',
    date: '30 Jun 2025',
    time: '10:00 AM - 01:00 PM',
    room: 'Hall B',
    syllabus: 'Calculus, Algebra, Geometry',
    maxMarks: 100
  },
  {
    id: '3',
    subject: 'Chemistry',
    date: '02 Jul 2025',
    time: '10:00 AM - 12:00 PM',
    room: 'Hall A',
    syllabus: 'Organic Chemistry Basic Principles',
    maxMarks: 100
  }
];

export default function ExamScheduleScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="Exam Schedule" showBack={false} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.termTitle}>Mid-Term Examinations - Semester 2</Text>
        
        {dummyExams.map(exam => (
          <GlassCard key={exam.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.subjectTitle}>{exam.subject}</Text>
              <View style={styles.marksBadge}>
                <Text style={styles.marksText}>{exam.maxMarks} Marks</Text>
              </View>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Calendar size={16} color="#6C63FF" />
                <Text style={styles.detailText}>{exam.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Clock size={16} color="#6C63FF" />
                <Text style={styles.detailText}>{exam.time}</Text>
              </View>
              <View style={styles.detailItem}>
                <MapPin size={16} color="#F43F5E" />
                <Text style={styles.detailText}>{exam.room}</Text>
              </View>
            </View>

            <View style={styles.syllabusSection}>
              <View style={styles.syllabusHeader}>
                <BookOpen size={16} color="#10B981" />
                <Text style={styles.syllabusTitle}>Syllabus</Text>
              </View>
              <Text style={styles.syllabusText}>{exam.syllabus}</Text>
            </View>
          </GlassCard>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  termTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subjectTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  marksBadge: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.2)',
  },
  marksText: {
    color: '#6C63FF',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '45%',
  },
  detailText: {
    color: '#A0AEC0',
    fontSize: 13,
  },
  syllabusSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  syllabusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  syllabusTitle: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  syllabusText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
  }
});
