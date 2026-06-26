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
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBlock: {
    backgroundColor: '#3b82f6',
  },
  dayText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '700',
  },
  selectedText: {
    color: '#ffffff',
  },
});
