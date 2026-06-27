import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AppHeader } from '../../../components/common/AppHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GradientBadge } from '../../../components/common/GradientBadge';
import { FileText, Video, Link2, Download, ExternalLink } from 'lucide-react-native';

const dummyMaterials = [
  { id: '1', title: 'Chapter 1 Notes', type: 'pdf', teacher: 'Mr. Rajesh', date: '20 Jun 2025' },
  { id: '2', title: 'Introductory Lecture', type: 'video', teacher: 'Mr. Rajesh', date: '21 Jun 2025' },
  { id: '3', title: 'Reference Website', type: 'link', teacher: 'Mrs. Sharma', date: '22 Jun 2025' },
  { id: '4', title: 'Previous Year Qs', type: 'pdf', teacher: 'Mr. Rajesh', date: '24 Jun 2025' },
];

export default function SubjectMaterialScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();

  // In a real app, you would fetch subject details based on subjectId
  const subjectName = subjectId === 'math-101' ? 'Mathematics' : 'Subject Materials';

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText size={24} color="#F43F5E" />;
      case 'video': return <Video size={24} color="#06B6D4" />;
      case 'link': return <Link2 size={24} color="#3B82F6" />;
      default: return <FileText size={24} color="#fff" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'pdf': return '#F43F5E';
      case 'video': return '#06B6D4';
      case 'link': return '#3B82F6';
      default: return '#6C63FF';
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={subjectName} showBack={true} />

      <ScrollView contentContainerStyle={styles.listContainer}>
        {dummyMaterials.map((material) => (
          <GlassCard key={material.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                {getTypeIcon(material.type)}
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>{material.title}</Text>
                <Text style={styles.subtitle}>{material.teacher} • {material.date}</Text>
              </View>
            </View>
            
            <View style={styles.cardFooter}>
              <GradientBadge 
                label={material.type.toUpperCase()} 
                color={getTypeBadgeColor(material.type)} 
              />
              <TouchableOpacity style={styles.actionBtn}>
                {material.type === 'link' ? (
                  <ExternalLink size={16} color="#fff" />
                ) : (
                  <Download size={16} color="#fff" />
                )}
                <Text style={styles.actionText}>
                  {material.type === 'link' ? 'Open' : 'Download'}
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  listContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#A0AEC0',
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  }
});
