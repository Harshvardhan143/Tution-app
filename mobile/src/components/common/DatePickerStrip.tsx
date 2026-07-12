import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export interface DatePickerStripProps {
  dates: Date[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function DatePickerStrip({ dates, selectedDate, onSelectDate }: DatePickerStripProps) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {dates.map((date, index) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          return (
            <TouchableOpacity
              key={index}
              style={[styles.dateBlock, isSelected && styles.selectedBlock]}
              onPress={() => onSelectDate(date)}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedText]}>
                {daysOfWeek[date.getDay()]}
              </Text>
              <Text style={[styles.dateText, isSelected && styles.selectedText]}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  dateBlock: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBlock: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  dayText: {
    fontSize: 12,
    color: '#A0AEC0',
    fontWeight: '500',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '700',
  },
  selectedText: {
    color: '#ffffff',
  },
});
