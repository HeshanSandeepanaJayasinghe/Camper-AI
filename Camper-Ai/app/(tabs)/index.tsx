import React from 'react';
import { StyleSheet, View, Pressable, ScrollView, Platform, Dimensions, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { AppShell } from '@/components/AppShell';
import { ThemedText } from '@/components/themed-text';
import { MapView, Marker, Callout } from '@/components/maps';
import { sampleLocations } from '@/components/sample-locations';
import { useAppContext } from '@/components/AppContext';
import { Colors } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function MapScreen() {
  const router = useRouter();
  const { theme } = useAppContext();
  const activeColors = Colors[theme];

  // Sri Lanka Central coordinates
  const initialRegion = {
    latitude: 7.8731,
    longitude: 80.7718,
    latitudeDelta: 2.5,
    longitudeDelta: 2.5,
  };

  const handleCardPress = (id: string) => {
    router.push(`/info?location=${id}`);
  };

  // Dark Map Style configuration to enhance premium dark mode feel on Android/iOS
  const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#0d0f12' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0d0f12' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#00e5ff' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#091c28' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#151922' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#222b3c' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  ];

  return (
    <AppShell title="Explore Sri Lanka">
      {/* Title Header */}
      <View style={styles.topHeader}>
        <ThemedText type="title" style={[styles.mainTitle, { color: activeColors.text }]}>
          Camp Finder
        </ThemedText>
        <ThemedText style={[styles.mainSubtitle, { color: activeColors.mutedText }]}>
          Discover Sri Lanka&apos;s premium campsites
        </ThemedText>
      </View>

      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          // Web Interactive Mock Map
          <View style={[styles.webMapFallback, { backgroundColor: theme === 'dark' ? '#111827' : '#f1f5f9', borderColor: activeColors.border }]}>
            <MaterialIcons name="map" size={50} color={activeColors.tint} />
            <ThemedText type="subtitle" style={{ marginTop: 12 }}>Sri Lanka Camps Map</ThemedText>
            <ThemedText style={{ color: activeColors.mutedText, textAlign: 'center', marginHorizontal: 20, marginTop: 4 }}>
              Interactive maps are loaded on mobile devices. Choose a location below to view details.
            </ThemedText>
          </View>
        ) : (
          // Mobile Native Map
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            customMapStyle={theme === 'dark' ? darkMapStyle : undefined}
          >
            {sampleLocations.map((loc) => (
              <Marker
                key={loc.id}
                coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
                title={loc.name}
                description={loc.subtitle}
                pinColor={activeColors.tint}
                onCalloutPress={() => handleCardPress(loc.id)}
              >
                <Callout tooltip>
                  <View style={[styles.calloutBubble, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
                    <ThemedText style={[styles.calloutTitle, { color: activeColors.text }]}>{loc.name}</ThemedText>
                    <ThemedText style={[styles.calloutSubtitle, { color: activeColors.mutedText }]}>{loc.subtitle}</ThemedText>
                    <View style={styles.calloutButton}>
                      <Text style={styles.calloutButtonText}>View Details</Text>
                      <MaterialIcons name="chevron-right" size={16} color="#fff" />
                    </View>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        )}
      </View>

      {/* Horizontal Carousel of Campsites */}
      <View style={styles.carouselWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        >
          {sampleLocations.map((loc) => (
            <Pressable
              key={loc.id}
              style={[
                styles.card,
                {
                  backgroundColor: activeColors.card,
                  borderColor: activeColors.border,
                },
              ]}
              onPress={() => handleCardPress(loc.id)}
            >
              <Image source={{ uri: loc.images[0] }} style={styles.cardImage} contentFit="cover" />
              <View style={styles.cardInfo}>
                <ThemedText style={[styles.cardTitle, { color: activeColors.text }]} numberOfLines={1}>
                  {loc.name}
                </ThemedText>
                <View style={styles.locationRow}>
                  <MaterialIcons name="location-on" size={14} color={activeColors.tint} />
                  <ThemedText style={[styles.cardLocation, { color: activeColors.mutedText }]} numberOfLines={1}>
                    {loc.subtitle}
                  </ThemedText>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    marginVertical: 14,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  mainSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
    minHeight: height * 0.35,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  webMapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  calloutBubble: {
    width: 200,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  calloutTitle: {
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
  calloutSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 6,
  },
  calloutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 2,
  },
  calloutButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  carouselWrapper: {
    marginVertical: 16,
    height: 120,
  },
  carouselContainer: {
    gap: 12,
    paddingRight: 16,
  },
  card: {
    flexDirection: 'row',
    width: 260,
    height: 95,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 8,
    gap: 12,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardLocation: {
    fontSize: 12,
    flex: 1,
  },
});
