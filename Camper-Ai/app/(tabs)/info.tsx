import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { AppShell } from '@/components/AppShell';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { sampleLocations } from '@/components/sample-locations';
import { useAppContext } from '@/components/AppContext';

export default function InfoScreen() {
  const router = useRouter();
  const { location } = useLocalSearchParams();
  const { toggleFavorite, isFavorite } = useAppContext();
  const locationData = sampleLocations.find((item) => item.id === location);

  if (!locationData) {
    return (
      <AppShell title="Details">
        <ThemedView style={styles.emptyState}>
          <ThemedText>Location not found.</ThemedText>
        </ThemedView>
      </AppShell>
    );
  }

  const onStartChat = () => {
    router.push('/(tabs)/chat');
  };

  return (
    <AppShell title="Details">
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: locationData.images[0] }} style={styles.mainImage} contentFit="cover" />
        <View style={styles.section}>
          <ThemedText type="title">{locationData.name}</ThemedText>
          <ThemedText style={styles.subtitle}>{locationData.subtitle}</ThemedText>
        </View>
        <View style={styles.sectionRow}>
          <ThemedView style={styles.statCard}>
            <ThemedText type="subtitle">Weather</ThemedText>
            <ThemedText>{locationData.weather}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statCard}>
            <ThemedText type="subtitle">Walk area</ThemedText>
            <ThemedText>{locationData.walkArea}</ThemedText>
          </ThemedView>
        </View>
        <View style={styles.section}>
          <ThemedText type="subtitle">Suitability</ThemedText>
          <ThemedText>{locationData.suitability}</ThemedText>
        </View>
        <View style={styles.section}>
          <ThemedText type="subtitle">Info</ThemedText>
          <ThemedText>{locationData.info}</ThemedText>
        </View>
        <View style={styles.photoGrid}>
          {locationData.images.slice(0, 3).map((imageUrl, index) => (
            <Image key={index} source={{ uri: imageUrl }} style={styles.thumbnail} contentFit="cover" />
          ))}
        </View>
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.primaryButton, isFavorite(locationData.id) && styles.secondaryButton]}
            onPress={() => toggleFavorite(locationData.id)}>
            <ThemedText style={styles.buttonText}>
              {isFavorite(locationData.id) ? 'Remove favorite' : 'Add to favorites'}
            </ThemedText>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={onStartChat}>
            <ThemedText style={styles.buttonText}>Prepare with Camper-AI</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    gap: 18,
  },
  emptyState: {
    padding: 24,
  },
  mainImage: {
    width: '100%',
    height: 220,
    borderRadius: 18,
  },
  section: {
    gap: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f3f9fc',
    borderRadius: 16,
    padding: 14,
  },
  subtitle: {
    color: '#5f6d76',
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  thumbnail: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#0a7ea4',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#4d8caa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
