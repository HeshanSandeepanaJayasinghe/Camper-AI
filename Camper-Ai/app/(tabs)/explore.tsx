import { ScrollView, StyleSheet, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ThemedText } from '@/components/themed-text';

export default function GuideScreen() {
  return (
    <AppShell title="Guide">
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Camping Guide
        </ThemedText>
        <View style={styles.card}>
          <ThemedText type="subtitle">Packing</ThemedText>
          <ThemedText style={styles.paragraph}>
            Pack layers, a headlamp, waterproof shoes, and a compact first-aid kit. Make sure your pack is not too heavy.
          </ThemedText>
        </View>
        <View style={styles.card}>
          <ThemedText type="subtitle">Food</ThemedText>
          <ThemedText style={styles.paragraph}>
            Choose easy meals, snacks, and water. Keep food sealed and store it away from wildlife if required.
          </ThemedText>
        </View>
        <View style={styles.card}>
          <ThemedText type="subtitle">Safety</ThemedText>
          <ThemedText style={styles.paragraph}>
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
