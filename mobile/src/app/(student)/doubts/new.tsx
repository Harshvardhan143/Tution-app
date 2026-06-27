import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { AppHeader } from '../../../components/common/AppHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GradientButton } from '../../../components/common/GradientButton';
import { Camera, Image as ImageIcon } from 'lucide-react-native';

const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];

export default function NewDoubtScreen() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [question, setQuestion] = useState('');
  
  const handleSubmit = () => {
    // Navigate back for now
    router.back();
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Ask a Doubt" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.formCard}>
          <Text style={styles.label}>Select Subject</Text>
          <View style={styles.subjectGrid}>
            {subjects.map(sub => (
              <TouchableOpacity 
                key={sub}
                style={[styles.subjectBadge, selectedSubject === sub && styles.activeSubject]}
                onPress={() => setSelectedSubject(sub)}
              >
                <Text style={[styles.subjectText, selectedSubject === sub && styles.activeSubjectText]}>
                  {sub}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Your Question</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Type your doubt here in detail..."
            placeholderTextColor="#A0AEC0"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={question}
            onChangeText={setQuestion}
          />

          <Text style={styles.label}>Attachment (Optional)</Text>
          <View style={styles.attachmentRow}>
            <TouchableOpacity style={styles.attachBtn}>
              <Camera size={20} color="#6C63FF" />
              <Text style={styles.attachText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachBtn}>
              <ImageIcon size={20} color="#6C63FF" />
              <Text style={styles.attachText}>Upload Image</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        <GradientButton 
          title="Submit Doubt" 
          onPress={handleSubmit} 
          disabled={!selectedSubject || !question.trim()}
          style={styles.submitBtn}
        />
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
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    padding: 20,
    marginBottom: 24,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  subjectBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeSubject: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    borderColor: '#6C63FF',
  },
  subjectText: {
    color: '#A0AEC0',
    fontSize: 14,
    fontWeight: '500',
  },
  activeSubjectText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  textArea: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 15,
    minHeight: 120,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
  },
  attachmentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  attachBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.2)',
  },
  attachText: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 8,
  }
});
