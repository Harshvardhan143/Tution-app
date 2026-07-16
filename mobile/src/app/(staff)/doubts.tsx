import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { MessageCircle } from 'lucide-react-native';

const mockDoubts = [
  { id: '1', student: 'Arjun Mehta', subject: 'Mathematics', question: 'How do I solve Q4 in Exercise 1?', time: '2 hours ago', status: 'Open' },
  { id: '2', student: 'Sneha Rao', subject: 'Physics', question: 'What is the formula for escape velocity?', time: 'Yesterday', status: 'Answered' },
];

export default function DoubtsScreen() {
  const [replyText, setReplyText] = useState('');
  const [activeDoubt, setActiveDoubt] = useState<string | null>(null);

  const handleReply = () => {
    if (!replyText) return;
    Alert.alert('Success', 'Reply sent to student');
    setReplyText('');
    setActiveDoubt(null);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Student Doubts" showBack={true} />
      
      <ScrollView contentContainerStyle={styles.content}>
        {mockDoubts.map(doubt => (
          <View key={doubt.id} style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.nameText}>{doubt.student}</Text>
              <View style={[styles.badge, doubt.status === 'Open' ? styles.badgeOpen : styles.badgeClosed]}>
                <Text style={styles.badgeText}>{doubt.status}</Text>
              </View>
            </View>
            <Text style={styles.subjectText}>{doubt.subject} • {doubt.time}</Text>
            <Text style={styles.questionText}>{doubt.question}</Text>
            
            {doubt.status === 'Open' && activeDoubt !== doubt.id && (
              <TouchableOpacity style={styles.replyBtn} onPress={() => setActiveDoubt(doubt.id)}>
                <MessageCircle size={16} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.replyBtnText}>Reply</Text>
              </TouchableOpacity>
            )}

            {activeDoubt === doubt.id && (
              <View style={styles.replyBox}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Type your answer..." 
                  placeholderTextColor="#888" 
                  value={replyText} 
                  onChangeText={setReplyText} 
                  multiline 
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleReply}>
                  <Text style={styles.sendBtnText}>Send Answer</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { padding: 16, gap: 12 },
  card: { backgroundColor: '#1C1C1E', borderRadius: 12, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  nameText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeOpen: { backgroundColor: 'rgba(255, 159, 10, 0.2)' },
  badgeClosed: { backgroundColor: 'rgba(52, 199, 89, 0.2)' },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#FFF' },
  subjectText: { color: '#A0AEC0', fontSize: 12, marginBottom: 12 },
  questionText: { color: '#E2E8F0', fontSize: 15, lineHeight: 22, marginBottom: 16 },
  replyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, alignSelf: 'flex-start' },
  replyBtnText: { color: '#FFF', fontWeight: '600' },
  replyBox: { marginTop: 12 },
  input: { backgroundColor: '#000', color: '#FFF', borderRadius: 8, padding: 12, minHeight: 80, textAlignVertical: 'top', borderWidth: 1, borderColor: '#333', marginBottom: 12 },
  sendBtn: { backgroundColor: '#0A84FF', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  sendBtnText: { color: '#FFF', fontWeight: 'bold' },
});
