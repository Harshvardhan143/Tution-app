import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { Calendar } from 'react-native-calendars';

// Mock data for events
const dummyEvents = [
  { id: '1', date: '2025-06-28', title: 'Mid-Term Physics Exam', type: 'exam', time: '10:00 AM - 12:00 PM', desc: 'Syllabus: Chapters 1 to 5' },
  { id: '2', date: '2025-07-04', title: 'Independence Day Holiday', type: 'holiday', time: 'All Day', desc: 'Institute closed' },
  { id: '3', date: '2025-07-15', title: 'Science Fair', type: 'event', time: '09:00 AM - 04:00 PM', desc: 'Annual science exhibition in main hall' },
];

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('2025-06-28');

  // Generate marked dates for the calendar
  const markedDates: Record<string, { marked?: boolean; dotColor?: string; selected?: boolean; selectedColor?: string }> = {};
  dummyEvents.forEach(ev => {
    let dotColor = '#6C63FF';
    if (ev.type === 'exam') dotColor = '#F43F5E';
    if (ev.type === 'holiday') dotColor = '#10B981';

    markedDates[ev.date] = {
      marked: true,
      dotColor,
      selected: selectedDate === ev.date,
      selectedColor: 'rgba(108, 99, 255, 0.3)',
    };
  });

  // Ensure selected date is highlighted even if it has no events
  if (!markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: 'rgba(108, 99, 255, 0.3)',
    };
  }

  // Filter events for the selected date
  const dayEvents = dummyEvents.filter(ev => ev.date === selectedDate);

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'exam': return '#F43F5E';
      case 'holiday': return '#10B981';
      case 'event': return '#A855F7';
      default: return '#6C63FF';
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Academic Calendar" showBack={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.calendarWrapper}>
          <Calendar
            current={selectedDate}
            onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: '#A0AEC0',
              selectedDayBackgroundColor: 'rgba(108, 99, 255, 0.3)',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#6C63FF',
              dayTextColor: '#ffffff',
              textDisabledColor: 'rgba(255,255,255,0.2)',
              dotColor: '#6C63FF',
              selectedDotColor: '#ffffff',
              arrowColor: '#ffffff',
              monthTextColor: '#ffffff',
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14
            }}
          />
        </View>

        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>
            Events for {selectedDate}
          </Text>

          {dayEvents.length === 0 ? (
            <Text style={styles.noEventsText}>No events scheduled on this day.</Text>
          ) : (
            dayEvents.map(ev => (
              <GlassCard key={ev.id} style={[styles.eventCard, { borderLeftColor: getBorderColor(ev.type), borderLeftWidth: 4 }]}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{ev.title}</Text>
                  <Text style={styles.eventTime}>{ev.time}</Text>
                </View>
                <Text style={styles.eventDesc}>{ev.desc}</Text>
              </GlassCard>
            ))
          )}
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
  calendarWrapper: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 10,
  },
  eventsSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  noEventsText: {
    color: '#A0AEC0',
    fontSize: 14,
    fontStyle: 'italic',
  },
  eventCard: {
    padding: 16,
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  eventTime: {
    color: '#A0AEC0',
    fontSize: 12,
    fontWeight: '600',
  },
  eventDesc: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  }
});
