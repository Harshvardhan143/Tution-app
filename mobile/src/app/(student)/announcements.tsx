import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { Pin, CheckCircle2 } from 'lucide-react-native';

type Announcement = {
  id: string;
  title: string;
  preview: string;
  date: string;
  sender: string;
  isPinned: boolean;
  isRead: boolean;
};

const dummyAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Important: Final Exam Schedule Released',
    preview: 'The final exam schedule for Semester 2 has been updated. Please check the calendar for detailed timings.',
    date: '27 Jun 2025',
    sender: 'Admin Office',
    isPinned: true,
    isRead: false,
  },
  {
    id: '2',
    title: 'Holiday Tomorrow',
    preview: 'Institute will remain closed tomorrow due to heavy rainfall warning.',
    date: '26 Jun 2025',
    sender: 'Principal',
    isPinned: false,
    isRead: false,
  },
  {
    id: '3',
    title: 'Guest Lecture on AI',
    preview: 'Join us this Friday for a special guest lecture on Artificial Intelligence by industry experts.',
    date: '24 Jun 2025',
    sender: 'Dept. of Science',
    isPinned: false,
    isRead: true,
  },
  {
    id: '4',
    title: 'Library Books Due',
    preview: 'A gentle reminder to return or renew your issued library books before the weekend.',
    date: '20 Jun 2025',
    sender: 'Library',
    isPinned: false,
    isRead: true,
  }
];

export default function AnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(dummyAnnouncements);

  const markAsRead = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const markAllAsRead = () => {
    setAnnouncements(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const pinned = announcements.filter(a => a.isPinned);
  const others = announcements.filter(a => !a.isPinned);

  const renderCard = (item: Announcement, pinnedStyle = false) => {
    return (
      <TouchableOpacity 
        key={item.id} 
        activeOpacity={0.8}
        onPress={() => markAsRead(item.id)}
      >
        <GlassCard style={[styles.card, pinnedStyle && styles.pinnedCard, !item.isRead && styles.unreadCard]}>
          <View style={styles.cardHeader}>
            <View style={styles.titleRow}>
              {!item.isRead && <View style={styles.unreadDot} />}
              <Text style={[styles.title, !item.isRead && styles.titleUnread]} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
            {pinnedStyle && <Pin size={16} color="#F59E0B" />}
          </View>
          
          <Text style={styles.preview} numberOfLines={2}>{item.preview}</Text>
          
          <View style={styles.cardFooter}>
            <Text style={styles.metaText}>{item.sender}</Text>
            <Text style={styles.metaText}>{item.date}</Text>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Announcements" showBack={false} />
      
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.markAllBtn} onPress={markAllAsRead}>
          <CheckCircle2 size={16} color="#6C63FF" />
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {pinned.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pinned</Text>
            {pinned.map(item => renderCard(item, true))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent</Text>
          {others.map(item => renderCard(item))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderRadius: 20,
  },
  markAllText: {
    color: '#6C63FF',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    padding: 16,
    marginBottom: 12,
  },
  pinnedCard: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    borderWidth: 1,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  unreadCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginRight: 8,
  },
  title: {
    color: '#A0AEC0',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  titleUnread: {
    color: '#ffffff',
    fontWeight: '700',
  },
  preview: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 12,
  },
  metaText: {
    color: '#A0AEC0',
    fontSize: 12,
  }
});
