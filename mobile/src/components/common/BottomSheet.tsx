import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, DimensionValue } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { X } from 'lucide-react-native';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: DimensionValue;
}

export function BottomSheet({ visible, onClose, children, height = '50%' }: BottomSheetProps) {
  const translateY = useSharedValue(1000);

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line react-hooks/immutability
      translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    } else {
      translateY.value = withTiming(1000, { duration: 200, easing: Easing.in(Easing.cubic) });
    }
  }, [visible, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible && translateY.value === 1000) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.sheet, { height }, animatedStyle]}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#64748b" />
          </TouchableOpacity>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#cbd5e1',
    borderRadius: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
});
