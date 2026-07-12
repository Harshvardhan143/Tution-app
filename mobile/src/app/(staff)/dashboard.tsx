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
  ClipboardList,
  FileText,
  Coffee,
  CreditCard,
  Bell,
  Search,
  Wrench,
  Users,
  LogOut,
} from 'lucide-react-native';

// Grid constants
const PADDING = 16;
const GAP = 12;
const COLUMNS = 3;

// ─── Staff menu items ───────────────────────────────────────────────────────
const MENU_ITEMS = [
  {
    id: 'academic-calendar',
    title: 'Academic\nCalendar',
    icon: Calendar,
    color: '#00BCD4',   // cyan
    route: '/(staff)/timetable',
    highlight: false,
  },
  {
    id: 'timetable',
    title: 'Time Table',
    icon: CalendarClock,
    color: '#00BCD4',   // cyan
    route: '/(staff)/timetable',
    highlight: true,    // taller — matches reference
  },
  {
    id: 'division-timetable',
    title: 'Division\nTimeTable',
    icon: CalendarClock,
    color: '#00BCD4',   // cyan
    route: '/(staff)/timetable',
    highlight: false,
  },
  {
    id: 'pending-attendance',
    title: 'Pending\nAttendance',
    icon: ClipboardList,
    color: '#78909C',   // slate
    route: '/(staff)/attendance',
    highlight: false,
  },
  {
    id: 'attendance-summary',
    title: 'Attendance\nSummary',
    icon: CalendarCheck,
    color: '#4CAF50',   // green
    route: '/(staff)/attendance',
    highlight: false,
  },
  {
    id: 'leave',
    title: 'Leave',
    icon: Coffee,
    color: '#78909C',   // slate
    route: '/(staff)/leave',
    highlight: false,
  },
  {
    id: 'search-student',
    title: 'Search\nStudent',
    icon: Search,
    color: '#42A5F5',   // blue
    route: '/(staff)/search-student',
    highlight: false,
  },
  {
    id: 'upload-material',
    title: 'Upload\nMaterial',
    icon: BookOpen,
    color: '#E57373',   // coral red
    route: '/(staff)/upload-material',
    highlight: false,
  },
  {
    id: 'payslip',
    title: 'Pay Slip',
    icon: CreditCard,
    color: '#4CAF50',   // green
    route: '/(staff)/payslip',
    highlight: true,    // taller
  },
  {
    id: 'homework',
    title: 'Homework',
    icon: FileText,
    color: '#EF5350',   // red
    route: '/(staff)/homework',
    highlight: false,
  },
  {
    id: 'doubts',
    title: 'Student\nDoubts',
    icon: Users,
    color: '#7C6EF5',   // indigo
    route: '/(staff)/doubts',
    highlight: false,
  },
  {
    id: 'results',
    title: 'Results',
    icon: FileText,
    color: '#EF5350',   // red
    route: '/(staff)/results',
    highlight: false,
  },
  {
    id: 'notification',
    title: 'Notification',
    icon: Bell,
    color: '#FFA726',   // amber
    route: '/(staff)/leave',
    highlight: false,
  },
  {
    id: 'service-request',
    title: 'Service\nRequest',
    icon: Wrench,
    color: '#EF5350',   // red
    route: '/(staff)/leave',
    highlight: true,    // taller
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

export default function StaffDashboard() {
  const router = useRouter();
  const { role, logout } = useAuthStore();
  const { profile, fetchProfile } = useUserStore();
  const { width } = useWindowDimensions();
  
  // Calculate dynamic card width to support rotating & folding screens (subtract 0.1 to prevent layout wrapping bugs)
  const cardWidth = ((width - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS) - 0.1;

  useEffect(() => {
    if (role === 'staff') fetchProfile('staff');
  }, [role, fetchProfile]);

  // Extract info or fall back to demo values
  const p = profile as Record<string, string> | null;
  const name = p?.name ? `Mr. ${p.name}` : 'Mr. Professor';
  const department = (p?.department as string) ?? 'CSE';
  const designation = (p?.designation as string) ?? 'Assistant Professor';
  const empCode = (p?.employeeCode as string) ?? 'F000';
  const email = (p?.email as string) ?? '';
  const phone = (p?.phone as string) ?? '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* ── Black header ── */}
      <ProfileHeader
        appName="EduSpark"
        name={name}
        staffInfo={{ department, designation, empCode, phone, email }}
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

        {/* App version footer */}
        <Text style={styles.version}>App Version: 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ── Shell ──────────────────────────────────────────────────────────────────
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // ── Scroll / grid area — light grey-white ─────────────────────────────────
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

  // ── Card — pure white with subtle shadow ──────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 6,
    // iOS
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    // Android
    elevation: 2,
  },

  iconWrap: {
    marginBottom: 10,
  },

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

  version: {
    textAlign: 'center',
    color: '#AAAAAA',
    fontSize: 11,
    marginTop: 24,
  },
});
