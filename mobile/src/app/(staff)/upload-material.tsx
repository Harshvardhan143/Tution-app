import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { UploadCloud } from 'lucide-react-native';

export default function UploadMaterialScreen() {
  const [title, setTitle] = useState('');
  const [batch, setBatch] = useState('');
  const [subject, setSubject] = useState('');

  const handleUpload = () => {
    if (!title || !batch || !subject) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Alert.alert('Success', 'Material uploaded successfully!');
    setTitle('');
    setBatch('');
    setSubject('');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Upload Material" showBack={true} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formCard}>
          <View style={styles.uploadBox}>
            <UploadCloud color="#0A84FF" size={48} />
            <Text style={styles.uploadText}>Tap to select PDF or Image</Text>
          </View>
          
          <Text style={styles.label}>Title</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="E.g. Chapter 1 Notes" placeholderTextColor="#888" />
          
          <Text style={styles.label}>Batch</Text>
          <TextInput style={styles.input} value={batch} onChangeText={setBatch} placeholder="E.g. Morning Batch A" placeholderTextColor="#888" />
          
          <Text style={styles.label}>Subject</Text>
          <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="E.g. Mathematics" placeholderTextColor="#888" />
          
          <TouchableOpacity style={styles.submitBtn} onPress={handleUpload}>
            <Text style={styles.submitBtnText}>Upload</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { padding: 16 },
  formCard: { backgroundColor: '#1C1C1E', padding: 16, borderRadius: 12 },
  uploadBox: { height: 150, borderWidth: 2, borderColor: '#333', borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 24, backgroundColor: '#111' },
  uploadText: { color: '#0A84FF', marginTop: 12, fontWeight: '600' },
  label: { color: '#A0AEC0', marginBottom: 8 },
  input: { backgroundColor: '#000', color: '#FFF', borderRadius: 8, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#333' },
  submitBtn: { backgroundColor: '#0A84FF', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#FFF', fontWeight: 'bold' },
});
