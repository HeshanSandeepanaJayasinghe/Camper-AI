import { ScrollView, StyleSheet, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SettingsScreen() {
  return (
    <AppShell title="Setting">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <ThemedText type="title">Settings</ThemedText>
          <ThemedText style={styles.paragraph}>
            This section will be implemented later. For now, use the tabs and map to explore the core flow.
          </ThemedText>
        </View>
        <View style={styles.section}>
          <ThemedText type="subtitle">Account</ThemedText>
          <ThemedText style={styles.paragraph}>Placeholder for account preferences and privacy settings.</ThemedText>
        </View>
        <View style={styles.section}>
          <ThemedText type="subtitle">Notifications</ThemedText>
          <ThemedText style={styles.paragraph}>Placeholder for notification preferences and alert settings.</ThemedText>
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    gap: 18,
  },
  section: {
    backgroundColor: '#f8fbfd',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e6edf0',
  },
  paragraph: {
    marginTop: 10,
    color: '#4d606f',
    lineHeight: 22,
  },
});
