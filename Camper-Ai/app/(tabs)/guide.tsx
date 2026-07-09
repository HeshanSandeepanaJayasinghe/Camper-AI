import { ScrollView, StyleSheet, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ThemedText } from '@/components/themed-text';
import { useAppContext } from '@/components/AppContext';
import { Colors } from '@/constants/theme';

export default function GuideScreen() {
  const { theme } = useAppContext();
  const colors = Colors[theme];

  return (
    <AppShell title="Guide">
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={[styles.sectionTitle, { color: colors.text }]}>
          Camper-AI Survival Guide
        </ThemedText>
        
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="subtitle" style={{ color: colors.text }}>Stay hydrated</ThemedText>
          <ThemedText style={[styles.paragraph, { color: colors.mutedText }]}>
            Bring at least two liters of water per person and a second container for filtered water from streams.
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="subtitle" style={{ color: colors.text }}>Dress in layers</ThemedText>
          <ThemedText style={[styles.paragraph, { color: colors.mutedText }]}>
            Early mornings and nights can be cold even after a warm day. Carry a lightweight jacket and moisture-wicking layers.
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="subtitle" style={{ color: colors.text }}>Know your route</ThemedText>
          <ThemedText style={[styles.paragraph, { color: colors.mutedText }]}>
            Plan your route ahead, mark key landmarks, and keep your phone charged if you plan to use GPS or maps.
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="subtitle" style={{ color: colors.text }}>Leave no trace</ThemedText>
          <ThemedText style={[styles.paragraph, { color: colors.mutedText }]}>
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
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
  },
  paragraph: {
    marginTop: 10,
    lineHeight: 22,
  },
});
