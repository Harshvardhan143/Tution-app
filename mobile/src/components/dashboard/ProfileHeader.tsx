import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import defaultAvatar from '../../../assets/images/react-logo.png';

// ─── Student header props ───────────────────────────────────────────────────
export interface StudentHeaderInfo {
  branch: string;
  sem: string;
  division: string;
  rollNo: string;
  batch: string;
  phone?: string;
  email?: string;
}

// ─── Staff header props ─────────────────────────────────────────────────────
export interface StaffHeaderInfo {
  department: string;
  designation: string;
  empCode: string;
  phone?: string;
  email?: string;
}

export interface ProfileHeaderProps {
  appName: string;
  name: string;
  avatarUrl?: string;
  onAvatarPress?: () => void;
  // Pass exactly one of these
  studentInfo?: StudentHeaderInfo;
  staffInfo?: StaffHeaderInfo;
}

export function ProfileHeader({
  appName,
  name,
  avatarUrl,
  onAvatarPress,
  studentInfo,
  staffInfo,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      {/* ── Top row: app name + avatar ── */}
      <View style={styles.topRow}>
        <Text style={styles.appName}>{appName}</Text>
        <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.8}>
          <View style={styles.avatarWrapper}>
            <Image
              source={avatarUrl ? { uri: avatarUrl } : defaultAvatar}
              style={styles.avatar}
              contentFit="cover"
              alt={`${name}'s avatar`}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Thin divider ── */}
      <View style={styles.divider} />

      {/* ── Name ── */}
      <Text style={styles.name}>{name}</Text>

      {/* ── Student: phone | email + info strip ── */}
      {studentInfo && (
        <>
          <Text style={styles.contactLine}>
            {studentInfo.phone ? `${studentInfo.phone}` : ''}
            {studentInfo.phone && studentInfo.email ? '  |  ' : ''}
            {studentInfo.email ?? ''}
          </Text>
          <View style={styles.separator} />
          <View style={styles.infoStrip}>
            <InfoCell label="Branch"   value={studentInfo.branch} />
            <View style={styles.cellDivider} />
            <InfoCell label="Sem"      value={studentInfo.sem} />
            <View style={styles.cellDivider} />
            <InfoCell label="Division" value={studentInfo.division} />
            <View style={styles.cellDivider} />
            <InfoCell label="Roll No." value={studentInfo.rollNo} />
            <View style={styles.cellDivider} />
            <InfoCell label="Batch"    value={studentInfo.batch} />
          </View>
        </>
      )}

      {/* ── Staff: department / designation / empCode ── */}
      {staffInfo && (
        <>
          <Text style={styles.contactLine}>
            {staffInfo.phone ? `${staffInfo.phone}` : ''}
            {staffInfo.phone && staffInfo.email ? '  |  ' : ''}
            {staffInfo.email ?? staffInfo.empCode}
          </Text>
          <View style={styles.separator} />
          <View style={styles.infoStrip}>
            <InfoCell label="Department"  value={staffInfo.department} />
            <View style={styles.cellDivider} />
            <InfoCell label="Designation" value={staffInfo.designation} wide />
            <View style={styles.cellDivider} />
            <InfoCell label="Emp. Code"   value={staffInfo.empCode} />
          </View>
        </>
      )}
    </View>
  );
}

function InfoCell({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <View style={[styles.cell, wide && styles.cellWide]}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  avatarWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#444444',
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  divider: {
    height: 1,
    backgroundColor: '#222222',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EAAB00',          // golden yellow — exact match to reference
    marginBottom: 4,
  },
  contactLine: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#1e1e1e',
    marginBottom: 10,
  },
  infoStrip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 0,
  },
  cell: {
    minWidth: 50,
    paddingHorizontal: 4,
  },
  cellWide: {
    minWidth: 120,
  },
  cellDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 6,
    alignSelf: 'center',
  },
  cellLabel: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 2,
  },
  cellValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
