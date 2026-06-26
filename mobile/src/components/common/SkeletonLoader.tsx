import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';

export interface SkeletonLoaderProps {
  style?: ViewStyle;
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
}

export function SkeletonLoader({ style, width, height, borderRadius = 8 }: SkeletonLoaderProps) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.ease }),
        withTiming(0.5, { duration: 800, easing: Easing.ease })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        style,
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e2e8f0',
  },
});
