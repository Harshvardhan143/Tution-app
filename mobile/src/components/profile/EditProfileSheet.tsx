import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BottomSheet } from '../common/BottomSheet';
import { InputField } from '../common/InputField';
import { GradientButton } from '../common/GradientButton';
import { User, Mail, Phone } from 'lucide-react-native';

export interface EditProfileSheetProps {
  visible: boolean;
  onClose: () => void;
  initialName?: string;
  initialEmail?: string;
  initialPhone?: string;
  onSave: (data: { name: string; email: string; phone: string }) => void;
}

export function EditProfileSheet({ visible, onClose, initialName = '', initialEmail = '', initialPhone = '', onSave }: EditProfileSheetProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onSave({ name, email, phone });
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height={500}>
      <Text style={styles.title}>Edit Profile</Text>
      
      <View style={styles.form}>
        <InputField
          label="Full Name"
          value={name}
          onChangeText={setName}
          icon={<User size={20} color="#94a3b8" />}
        />
        
        <InputField
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          icon={<Mail size={20} color="#94a3b8" />}
        />
        
        <InputField
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          icon={<Phone size={20} color="#94a3b8" />}
        />
      </View>

      <View style={styles.footer}>
        <GradientButton 
          title="Save Changes" 
          onPress={handleSave} 
          loading={isSaving} 
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  footer: {
    paddingTop: 16,
    paddingBottom: 24,
  },
});
