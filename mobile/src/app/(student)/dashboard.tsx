import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ProfileHeader } from '../../components/dashboard/ProfileHeader';
import { StatChip } from '../../components/common/StatChip';
import { BentoGrid } from '../../components/dashboard/BentoGrid';
import { BentoCard } from '../../components/dashboard/BentoCard';
import {
  CalendarCheck,
  Calendar,
  CreditCard,
  FileText,
  BookOpen,
  CalendarClock,
  BellRing,
  BookMarked,
  MessageCircleQuestion,
  User
} from 'lucide-react-native';

export default function StudentDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ProfileHeader 
        name="Arjun Mehta" 
        roleInfo="Class 10 | Roll: 23" 
        hasUnread={true} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
          <StatChip label="Attendance" value="87%" />
          <StatChip label="Fees Due" value="₹2,400" />
          <StatChip label="Rank" value="#3" />
        </ScrollView>

        <BentoGrid>
          {/* Row 1 */}
          <BentoCard 
            title="Attendance" 
            subtitle="87.5% progress" 
            icon={<CalendarCheck color="#ffffff" size={24} />} 
            onPress={() => router.push('/(student)/attendance')} 
            span={2} 
            size="large" 
            color={['#6C63FF', '#4F46E5']} 
          />
          <BentoCard 
            title="Timetable" 
            subtitle="Today: 3 classes" 
            icon={<Calendar color="#ffffff" size={20} />} 
            onPress={() => {}} 
            size="small" 
            color={['#06B6D4', '#0891B2']} 
          />

          {/* Row 2 */}
          <BentoCard 
            title="Fees" 
            subtitle="₹2,400 pending" 
            icon={<CreditCard color="#ffffff" size={20} />} 
            onPress={() => router.push('/(student)/fees')} 
            color={['#F59E0B', '#D97706']} 
          />
          <BentoCard 
            title="Results" 
            subtitle="75.4% avg" 
            icon={<FileText color="#ffffff" size={20} />} 
            onPress={() => {}} 
            color={['#818CF8', '#6366F1']} 
          />
          <BentoCard 
            title="LMS" 
            subtitle="6 subs" 
            icon={<BookOpen color="#ffffff" size={20} />} 
            onPress={() => {}} 
            color={['#10B981', '#059669']} 
          />

          {/* Row 3 */}
          <BentoCard 
            title="Homework" 
            subtitle="2 pending" 
            icon={<BookMarked color="#ffffff" size={20} />} 
            onPress={() => {}} 
            color={['#FB923C', '#EA580C']} 
          />
          <BentoCard 
            title="Exam Sch." 
            subtitle="Exam in 3d" 
            icon={<CalendarClock color="#ffffff" size={20} />} 
            onPress={() => {}} 
            color={['#F43F5E', '#E11D48']} 
          />
          <BentoCard 
            title="News" 
            subtitle="4 new" 
            icon={<BellRing color="#ffffff" size={20} />} 
            onPress={() => {}} 
            color={['#EC4899', '#DB2777']} 
          />

          {/* Row 4 */}
          <BentoCard 
            title="Doubts" 
            icon={<MessageCircleQuestion color="#ffffff" size={20} />} 
            onPress={() => {}} 
            color="#1E1E35"
          />
          <BentoCard 
            title="Calendar" 
            icon={<Calendar color="#ffffff" size={20} />} 
            onPress={() => {}} 
            color="#1E1E35"
          />
          <BentoCard 
            title="Profile" 
            icon={<User color="#ffffff" size={20} />} 
            onPress={() => router.push('/(student)/profile')} 
            color="#1E1E35"
          />
        </BentoGrid>
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
  statsRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
  },
});
