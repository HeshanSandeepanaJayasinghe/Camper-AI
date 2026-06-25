import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import { AppShell } from '@/components/AppShell';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { sampleLocations } from '@/components/sample-locations';

export default function MapScreen() {
  const router = useRouter();

  return (
    <AppShell title="Map">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.mapPlaceholder}>
          <ThemedText type="subtitle" style={styles.mapText}>
            Camper-AI Map Preview
          </ThemedText>
          <ThemedText style={styles.mapNote}>
            Tap a campsite card below to view details and prepare for your trip.
          </ThemedText>
        </View>

        {sampleLocations.map((location) => (
          <Pressable
            key={location.id}
            style={styles.locationCard}
            onPress={() => router.push(`/info?location=${location.id}` as unknown as any)}>
            <Image source={{ uri: location.images[0] }} style={styles.locationImage} contentFit="cover" />
            <View style={styles.locationContent}>
              <ThemedText type="subtitle">{location.name}</ThemedText>
              <ThemedText style={styles.locationSubtitle}>{location.subtitle}</ThemedText>
              <ThemedText style={styles.locationMeta}>{location.coords}</ThemedText>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    gap: 16,
  },
  mapPlaceholder: {
    minHeight: 180,
    backgroundColor: '#e8f2f7',
    borderRadius: 18,
    padding: 18,
    justifyContent: 'center',
    gap: 12,
  },
  mapText: {
    fontWeight: '700',
  },
  mapNote: {
    color: '#4d6672',
  },
  locationCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e6ebef',
    backgroundColor: '#fff',
  },
  locationImage: {
    width: '100%',
    height: 150,
  },
  locationContent: {
    padding: 14,
    gap: 8,
  },
  locationSubtitle: {
    color: '#5f6d76',
  },
  locationMeta: {
    color: '#7d8a92',
    fontSize: 14,
  },
});
