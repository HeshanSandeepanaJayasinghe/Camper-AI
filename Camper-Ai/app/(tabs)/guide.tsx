import { ScrollView, StyleSheet, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function GuideScreen() {
  return (
    <AppShell title="Guide">
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Camper-AI Survival Guide
        </ThemedText>
        <View style={styles.card}>
          <ThemedText type="subtitle">Stay hydrated</ThemedText>
          <ThemedText style={styles.paragraph}>
            Bring at least two liters of water per person and a second container for filtered water from streams.
          </ThemedText>
        </View>
        <View style={styles.card}>
          <ThemedText type="subtitle">Dress in layers</ThemedText>
          <ThemedText style={styles.paragraph}>
            Early mornings and nights can be cold even after a warm day. Carry a lightweight jacket and moisture-wicking layers.
          </ThemedText>
        </View>
        <View style={styles.card}>
          <ThemedText type="subtitle">Know your route</ThemedText>
          <ThemedText style={styles.paragraph}>
            Plan your route ahead, mark key landmarks, and keep your phone charged if you plan to use GPS or maps.
          </ThemedText>
        </View>
        <View style={styles.card}>
          <ThemedText type="subtitle">Leave no trace</ThemedText>
          <ThemedText style={styles.paragraph}>
            Pack out all trash, keep noise levels low, and respect wildlife to preserve the site for future campers.
          </ThemedText>
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    gap: 14,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f8fbfd',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e6edf0',
  },
  paragraph: {
    marginTop: 10,
    lineHeight: 22,
    color: '#4d606f',
  },
});
