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

const mockLectures = [
  { id: '1', subject: 'Mathematics (Morning Batch A)', time: '09:00 AM - 10:30 AM', teacher: 'Room 101', room: '101', color: '#6C63FF' },
  { id: '2', subject: 'Physics (JEE Advance)', time: '10:45 AM - 12:15 PM', teacher: 'Lab 2', room: '102', color: '#06B6D4' },
];

export default function StaffTimetableScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dates = generateDates();

  return (
    <View style={styles.container}>
      <AppHeader title="My Timetable" showBack={true} />
      <View style={styles.dateHeaderContainer}>
        <Text style={styles.dateRangeLabel}>This Week</Text>
      </View>
      <DatePickerStrip 
        dates={dates} 
        selectedDate={selectedDate} 
        onSelectDate={setSelectedDate} 
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {mockLectures.map(lecture => (
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
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  dateHeaderContainer: { paddingHorizontal: 16, paddingTop: 8 },
  dateRangeLabel: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
  scrollContent: { paddingBottom: 40, paddingTop: 8 },
});
