import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { DatePickerStrip } from '../../components/common/DatePickerStrip';
import { LectureCard } from '../../components/common/LectureCard';

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = -3; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const dummyLectures = [
  { id: '1', subject: 'Mathematics', time: '09:00 AM - 10:30 AM', teacher: 'Mr. Rajesh Kumar', room: '101', color: '#6C63FF' },
  { id: '2', subject: 'Physics', time: '10:45 AM - 12:15 PM', teacher: 'Mrs. Sharma', room: '102', color: '#06B6D4' },
];

const postRecessLectures = [
  { id: '3', subject: 'Chemistry', time: '01:00 PM - 02:30 PM', teacher: 'Dr. Verma', room: 'Lab 1', color: '#10B981' },
];

export default function TimetableScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dates = generateDates();

  return (
    <View style={styles.container}>
      <AppHeader title="Timetable" showBack={false} />
      
      <View style={styles.dateHeaderContainer}>
        <Text style={styles.dateRangeLabel}>This Week</Text>
      </View>

      <DatePickerStrip 
        dates={dates} 
        selectedDate={selectedDate} 
        onSelectDate={setSelectedDate} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {dummyLectures.map(lecture => (
          <LectureCard 
            key={lecture.id}
            subject={lecture.subject}
            time={lecture.time}
            teacher={lecture.teacher}
            room={lecture.room}
            color={lecture.color}
          />
        ))}

        <View style={styles.recessDivider}>
          <View style={styles.recessLine} />
          <Text style={styles.recessText}>RECESS (45 MINS)</Text>
          <View style={styles.recessLine} />
        </View>

        {postRecessLectures.map(lecture => (
          <LectureCard 
            key={lecture.id}
            subject={lecture.subject}
            time={lecture.time}
            teacher={lecture.teacher}
            room={lecture.room}
            color={lecture.color}
          />
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
  dateHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  dateRangeLabel: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 8,
  },
  recessDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  recessLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  recessText: {
    color: '#A0AEC0',
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 12,
    letterSpacing: 1,
  },
});
