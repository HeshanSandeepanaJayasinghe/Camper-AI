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
          Camping Guide
        </ThemedText>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="subtitle" style={{ color: colors.text }}>Packing</ThemedText>
          <ThemedText style={[styles.paragraph, { color: colors.mutedText }]}>
            Pack layers, a headlamp, waterproof shoes, and a compact first-aid kit. Make sure your pack is not too heavy.
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="subtitle" style={{ color: colors.text }}>Food</ThemedText>
          <ThemedText style={[styles.paragraph, { color: colors.mutedText }]}>
            Choose easy meals, snacks, and water. Keep food sealed and store it away from wildlife if required.
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="subtitle" style={{ color: colors.text }}>Safety</ThemedText>
          <ThemedText style={[styles.paragraph, { color: colors.mutedText }]}>
            Know your emergency exits, carry a charged phone, and check the weather before you go.
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
