import React from 'react';
import { View, StyleSheet } from 'react-native';

interface BentoGridProps {
  children: React.ReactNode;
}

export function BentoGrid({ children }: BentoGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});
