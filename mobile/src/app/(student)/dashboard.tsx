import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ProfileHeader } from '../../components/dashboard/ProfileHeader';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import {
  Calendar,
  CalendarClock,
  CalendarCheck,
  BookOpen,
  BellRing,
  FileText,
  CreditCard,
  MessageCircleQuestion,
  ClipboardList,
  LogOut,
} from 'lucide-react-native';

// Grid constants
const PADDING = 16;
const GAP = 12;
const COLUMNS = 3;

// ─── Menu items — same layout order as the reference image ─────────────────
const MENU_ITEMS = [
  {
    id: 'calendar',
    title: 'Academic\nCalendar',
    icon: Calendar,
    color: '#00BCD4',   // cyan
    route: '/(student)/calendar',
    highlight: false,
  },
  {
    id: 'timetable',
    title: 'Time Table',
    icon: CalendarClock,
    color: '#00BCD4',   // cyan
    route: '/(student)/timetable',
    highlight: false,
  },
  {
    id: 'attendance',
    title: 'Attendance',
    icon: CalendarCheck,
    color: '#7C6EF5',   // indigo/purple
    route: '/(student)/attendance',
    highlight: true,    // taller card, larger label
  },
  {
    id: 'lms',
    title: 'LMS',
    icon: BookOpen,
    color: '#E57373',   // coral red
    route: '/(student)/lms',
    highlight: false,
  },
  {
    id: 'lms-dashboard',
    title: 'LMS\nDashboard',
    icon: BookOpen,
    color: '#E57373',   // coral red
    route: '/(student)/lms',
    highlight: false,
  },
  {
    id: 'announcement',
    title: 'Announcement',
    icon: BellRing,
    color: '#42A5F5',   // blue
    route: '/(student)/announcements',
    highlight: false,
  },
  {
    id: 'assessment',
    title: 'Internal\nAssessment',
    icon: ClipboardList,
    color: '#EF5350',   // red
    route: '/(student)/results',
    highlight: false,
  },
  {
    id: 'exam-schedule',
    title: 'Exam\nSchedule',
    icon: FileText,
    color: '#7C6EF5',   // indigo/purple
    route: '/(student)/exam-schedule',
    highlight: false,
  },
  {
    id: 'fees',
    title: 'Fees',
    icon: CreditCard,
    color: '#4CAF50',   // green
    route: '/(student)/fees',
    highlight: true,    // taller card
  },
  {
    id: 'results',
    title: 'Results',
    icon: FileText,
    color: '#EF5350',   // red
    route: '/(student)/results',
    highlight: false,
  },
  {
    id: 'old-exam',
    title: 'Old Exam\nPaper',
    icon: FileText,
    color: '#EF5350',   // red
    route: '/(student)/results',
    highlight: false,
  },
  {
    id: 'homework',
    title: 'Homework',
    icon: BookOpen,
    color: '#42A5F5',   // blue
    route: '/(student)/homework',
    highlight: false,
  },
  {
    id: 'doubts',
    title: 'Doubts',
    icon: MessageCircleQuestion,
    color: '#42A5F5',   // blue
    route: '/(student)/doubts',
    highlight: false,
  },
  {
    id: 'logout',
    title: 'Logout',
    icon: LogOut,
    color: '#EF5350',   // red
    route: 'logout',
    highlight: false,
  },
];

export default function StudentDashboard() {
  const router = useRouter();
  const { role, logout } = useAuthStore();
  const { profile, fetchProfile } = useUserStore();
  const { width } = useWindowDimensions();
  
  // Calculate dynamic card width to support rotating & folding screens (subtract 0.1 to prevent layout wrapping bugs)
  const cardWidth = ((width - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS) - 0.1;

  useEffect(() => {
    if (role === 'student') fetchProfile('student');
  }, [role, fetchProfile]);

  // Extract info from profile or fall back to demo values
  const p = profile as Record<string, string> | null;
  const name = p?.name ?? 'demo student';
  const phone = p?.phone ?? '1234567890';
  const email = p?.email ?? 'demo@gmail.com';
  const branch = (p?.branch as string) ?? 'CSE';
  const sem = (p?.sem as string) ?? '4';
  const division = (p?.division as string) ?? 'CSE-4A';
  const rollNo = (p?.rollNo as string) ?? '18';
  const batch = (p?.batch as string) ?? '10';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* ── Black header (exact match to image) ── */}
      <ProfileHeader
        appName="EduSpark"
        name={name}
        studentInfo={{ branch, sem, division, rollNo, batch, phone, email }}
      />

      {/* ── White card grid ── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={styles.grid}>
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isHighlight = !!item.highlight;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                style={[
                  styles.card, 
                  { width: cardWidth, minHeight: isHighlight ? cardWidth * 1.3 : cardWidth * 1.05 }
                ]}
                onPress={() => {
                  if (item.id === 'logout') {
                    logout();
                  } else {
                    router.push(item.route as never);
                  }
                }}
              >
                {/* Coloured icon — same as reference */}
                <View style={styles.iconWrap}>
                  <Icon size={32} color={item.color} strokeWidth={1.5} />
                </View>
                <Text
                  style={[
                    styles.cardLabel,
                    isHighlight && styles.cardLabelHighlight,
                  ]}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ── Shell ──────────────────────────────────────────────────────────────────
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',   // black — matches header bg visible behind notch
  },

  // ── Scroll / grid area — white ─────────────────────────────────────────────
  scroll: {
    backgroundColor: '#F0F0F0',
  },
  scrollContent: {
    paddingHorizontal: PADDING,
    paddingTop: 14,
    paddingBottom: 40,
  },

  // ── 3-column flexWrap grid ─────────────────────────────────────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },

  // ── Card — white with very light shadow (same as reference) ───────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 6,
    // iOS shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    // Android elevation
    elevation: 2,
  },

  // ── Icon container ─────────────────────────────────────────────────────────
  iconWrap: {
    marginBottom: 10,
  },

  // ── Card label — dark text on white background ────────────────────────────
  cardLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 15,
  },
  cardLabelHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
});
