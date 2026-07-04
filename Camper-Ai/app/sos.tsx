import { useMemo, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useAppContext } from '@/components/AppContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';

type Contact = {
  label: string;
  phone: string;
  note: string;
};

const defaultContacts: Contact[] = [
  { label: 'Police Emergency', phone: '119', note: 'Sri Lanka Police emergency line' },
  { label: 'Ambulance / Fire', phone: '110', note: 'Emergency medical or fire support' },
  { label: 'Tourist Police', phone: '1912', note: 'Tourism-related support line' },
];

export default function SosScreen() {
  const { theme, user } = useAppContext();
  const colors = Colors[theme];
  const [customName, setCustomName] = useState('My emergency contact');
  const [customPhone, setCustomPhone] = useState(user?.emergency_contact ?? '');

  const contacts = useMemo(() => {
    const custom = customPhone.trim()
      ? [{ label: customName.trim() || 'My emergency contact', phone: customPhone.trim(), note: 'Saved on this device/profile' }]
      : [];
    return [...custom, ...defaultContacts];
  }, [customName, customPhone]);

  const callContact = async (phone: string) => {
    const url = `tel:${phone}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Dialer unavailable', `Please call ${phone} manually.`);
      return;
    }
    await Linking.openURL(url);
  };

  return (
    <ThemedView style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.hero, { backgroundColor: theme === 'dark' ? '#2a1214' : '#fff1f2', borderColor: '#ef4444' }]}>
          <MaterialIcons name="warning" size={34} color="#ef4444" />
          <View style={{ flex: 1 }}>
            <ThemedText type="title" style={[styles.title, { color: colors.text }]}>SOS Emergency</ThemedText>
            <ThemedText style={{ color: colors.mutedText }}>
              Keep contacts ready before you lose signal. Verify local numbers before departure.
            </ThemedText>
          </View>
        </View>

        <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="subtitle" style={{ color: colors.text }}>Personal Contact</ThemedText>
          <TextInput
            value={customName}
            onChangeText={setCustomName}
            placeholder="Contact name"
            placeholderTextColor={colors.tabIconDefault}
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />
          <TextInput
            value={customPhone}
            onChangeText={setCustomPhone}
            placeholder="Phone number"
            placeholderTextColor={colors.tabIconDefault}
            keyboardType="phone-pad"
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />
        </View>

        {contacts.map((contact) => (
          <View key={`${contact.label}-${contact.phone}`} style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ color: colors.text, fontWeight: '800', fontSize: 16 }}>{contact.label}</ThemedText>
              <ThemedText style={{ color: colors.mutedText, marginTop: 4 }}>{contact.note}</ThemedText>
              <ThemedText style={{ color: colors.tint, marginTop: 6, fontWeight: '700' }}>{contact.phone}</ThemedText>
            </View>
            <Pressable style={styles.callButton} onPress={() => callContact(contact.phone)}>
              <MaterialIcons name="call" size={22} color="#fff" />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { padding: 18, gap: 14, paddingBottom: 36 },
  hero: { flexDirection: 'row', gap: 14, borderWidth: 1, borderRadius: 22, padding: 18, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900' },
  form: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 12 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  contactCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 18, padding: 16, gap: 12 },
  callButton: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' },
});
