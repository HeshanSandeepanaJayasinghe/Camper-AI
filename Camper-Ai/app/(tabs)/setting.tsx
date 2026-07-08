import { ScrollView, StyleSheet, Switch, View, Alert, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { AppShell } from '@/components/AppShell';
import { ThemedText } from '@/components/themed-text';
import { useAppContext } from '@/components/AppContext';
import { Colors } from '@/constants/theme';

export default function SettingsScreen() {
  const { theme, toggleTheme, user } = useAppContext();
  const colors = Colors[theme];
  const router = useRouter();

  const handleReplayTour = () => {
    Alert.alert(
      'Replay Tour?',
      'This will restart the onboarding guide. You will be redirected to the Map screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restart',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('force_show_onboarding_tour', 'true');
              await AsyncStorage.removeItem('has_seen_onboarding_tour');
              router.replace('/(tabs)');
            } catch (e) {
              console.error(e);
            }
          },
        },
      ]
    );
  };

  return (
    <AppShell title="Setting">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={[styles.title, { color: colors.text }]}>Settings</ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.mutedText }]}>
            Tune Camper-AI for safer trips and cleaner visibility.
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: theme === 'dark' ? '#1c2230' : '#e0f2fe' }]}>
              <MaterialIcons name={theme === 'dark' ? 'dark-mode' : 'light-mode'} size={24} color={colors.tint} />
            </View>
            <View style={styles.rowText}>
              <ThemedText style={[styles.rowTitle, { color: colors.text }]}>Dark Theme</ThemedText>
              <ThemedText style={[styles.rowSubtitle, { color: colors.mutedText }]}>
                Default dark mode for night planning and trail use.
              </ThemedText>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#cbd5e1', true: '#0e7490' }}
              thumbColor={theme === 'dark' ? colors.tint : '#f8fafc'}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: theme === 'dark' ? '#1c2230' : '#dcfce7' }]}>
              <MaterialIcons name="verified-user" size={24} color="#10b981" />
            </View>
            <View style={styles.rowText}>
              <ThemedText style={[styles.rowTitle, { color: colors.text }]}>Safety Profile</ThemedText>
              <ThemedText style={[styles.rowSubtitle, { color: colors.mutedText }]}>
                Signed in as {user?.name ?? 'Guest Explorer'}.
              </ThemedText>
            </View>
          </View>
        </View>

        <Pressable
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleReplayTour}
        >
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: theme === 'dark' ? '#1c2230' : '#fee2e2' }]}>
              <MaterialIcons name="help-outline" size={24} color={colors.tint} />
            </View>
            <View style={styles.rowText}>
              <ThemedText style={[styles.rowTitle, { color: colors.text }]}>Replay App Tour</ThemedText>
              <ThemedText style={[styles.rowSubtitle, { color: colors.mutedText }]}>
                Restart the onboarding walkthrough guide for beginners.
              </ThemedText>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.mutedText} />
          </View>
        </Pressable>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="subtitle" style={{ color: colors.text }}>Preferences</ThemedText>
          <View style={styles.preferenceRow}>
            <MaterialIcons name="cloud" size={20} color={colors.tint} />
            <ThemedText style={{ color: colors.mutedText, flex: 1 }}>Live campsite weather in detail pages</ThemedText>
          </View>
          <View style={styles.preferenceRow}>
            <MaterialIcons name="favorite" size={20} color="#ef4444" />
            <ThemedText style={{ color: colors.mutedText, flex: 1 }}>Favorites saved locally for quick planning</ThemedText>
          </View>
          <View style={styles.preferenceRow}>
            <MaterialIcons name="near-me" size={20} color="#10b981" />
            <ThemedText style={{ color: colors.mutedText, flex: 1 }}>Breadcrumb mode requests GPS only when tracking starts</ThemedText>
          </View>
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
  header: {
    gap: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    lineHeight: 21,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  rowSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  preferenceRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});
