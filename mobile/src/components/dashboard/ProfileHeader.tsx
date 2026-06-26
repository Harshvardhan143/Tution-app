import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Bell } from 'lucide-react-native';

export interface ProfileHeaderProps {
  name: string;
  roleInfo: string;
  avatarUrl?: string;
  onNotificationPress?: () => void;
  hasUnread?: boolean;
}

export function ProfileHeader({ name, roleInfo, avatarUrl, onNotificationPress, hasUnread = false }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={avatarUrl ? { uri: avatarUrl } : require('../../../assets/images/react-logo.png')}
          style={styles.avatar}
          contentFit="cover"
          alt={`${name}'s avatar`}
        />
        <View style={styles.info}>
          <Text style={styles.greeting}>Hello, {name.split(' ')[0]}</Text>
          <Text style={styles.role}>{roleInfo}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bellButton} onPress={onNotificationPress}>
        <Bell size={24} color="#ffffff" />
        {hasUnread && <View style={styles.indicator} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#0f172a', // Dark header
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155',
  },
  info: {
    marginLeft: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  role: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
  },
  bellButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  indicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
});
