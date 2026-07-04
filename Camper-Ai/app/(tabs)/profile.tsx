import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { AppShell } from '@/components/AppShell';
import { ThemedText } from '@/components/themed-text';
import { useAppContext } from '@/components/AppContext';
import { Colors } from '@/constants/theme';

export default function ProfileScreen() {
  const { user, favorites, updateProfile, deleteAccount, signOut, theme } = useAppContext();
  const colors = Colors[theme];
  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergency_contact ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name ?? '');
    setBio(user?.bio ?? '');
    setEmergencyContact(user?.emergency_contact ?? '');
  }, [user]);

  const saveProfile = async () => {
    setSaving(true);
    const result = await updateProfile(name.trim() || 'Camper User', bio.trim(), emergencyContact.trim());
    setSaving(false);
    Alert.alert(result.success ? 'Profile Saved' : 'Update Failed', result.success ? 'Your profile is up to date.' : result.error);
  };

  const confirmDelete = () => {
    Alert.alert('Delete account?', 'This removes your profile record and signs you out. Supabase auth deletion requires the SQL helper from schema_instructions.txt.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const result = await deleteAccount();
          Alert.alert(result.success ? 'Account Deleted' : 'Delete Failed', result.success ? 'Your session has ended.' : result.error);
        },
      },
    ]);
  };

  return (
    <AppShell title="Profile">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Image source={require('@/assets/logo/Logo.png')} style={styles.avatar} contentFit="contain" />
          <View style={styles.profileDetails}>
            <ThemedText type="subtitle" style={{ color: colors.text }}>{user?.name ?? 'Camper User'}</ThemedText>
            <ThemedText style={[styles.emailText, { color: colors.mutedText }]}>{user?.email ?? 'you@example.com'}</ThemedText>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="subtitle" style={{ color: colors.text }}>Account Details</ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Display name"
            placeholderTextColor={colors.tabIconDefault}
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Short camping bio"
            placeholderTextColor={colors.tabIconDefault}
            multiline
            style={[styles.input, styles.bioInput, { color: colors.text, borderColor: colors.border }]}
          />
          <TextInput
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            placeholder="Emergency contact number"
            placeholderTextColor={colors.tabIconDefault}
            keyboardType="phone-pad"
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />
          <Pressable style={[styles.primaryButton, { backgroundColor: colors.tint }]} onPress={saveProfile} disabled={saving}>
            <MaterialIcons name="save" size={20} color="#031014" />
            <ThemedText style={styles.primaryButtonText}>{saving ? 'Saving...' : 'Save Profile'}</ThemedText>
          </Pressable>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="subtitle" style={{ color: colors.text }}>Favorite Locations</ThemedText>
          {favorites.length === 0 ? (
            <ThemedText style={{ color: colors.mutedText }}>No favorites yet. Add a place from the map.</ThemedText>
          ) : (
            favorites.map((item) => (
              <View key={item.id} style={[styles.favoriteCard, { borderColor: colors.border }]}>
                <ThemedText style={{ color: colors.text, fontWeight: '800' }}>{item.name}</ThemedText>
                <ThemedText style={{ color: colors.mutedText, marginTop: 4 }}>{item.subtitle}</ThemedText>
              </View>
            ))
          )}
        </View>

        <View style={styles.dangerRow}>
          <Pressable style={[styles.outlineButton, { borderColor: colors.border }]} onPress={signOut}>
            <MaterialIcons name="logout" size={19} color={colors.text} />
            <ThemedText style={{ color: colors.text, fontWeight: '800' }}>Sign Out</ThemedText>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={confirmDelete}>
            <MaterialIcons name="delete-outline" size={19} color="#fff" />
            <ThemedText style={{ color: '#fff', fontWeight: '800' }}>Delete</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingBottom: 110,
    gap: 16,
  },
  profileCard: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 18,
    backgroundColor: '#fff',
  },
  profileDetails: {
    flex: 1,
    gap: 6,
  },
  emailText: {
    fontSize: 13,
  },
  sectionCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bioInput: {
    minHeight: 86,
    textAlignVertical: 'top',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    padding: 14,
  },
  primaryButtonText: {
    color: '#031014',
    fontWeight: '900',
  },
  favoriteCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  dangerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});
