import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable, ActivityIndicator, Share, Text } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { sampleLocations } from '@/components/sample-locations';
import { useAppContext } from '@/components/AppContext';
import { Colors } from '@/constants/theme';
import { fetchOpenMeteoWeather, type CurrentWeather } from '@/components/weather';

export default function InfoScreen() {
  const router = useRouter();
  const { location } = useLocalSearchParams();
  const { toggleFavorite, isFavorite, theme } = useAppContext();
  const activeColors = Colors[theme];

  const locationData = sampleLocations.find((item) => item.id === location);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weather, setWeatherData] = useState<CurrentWeather | null>(null);

  // Fetch live weather data from Open-Meteo API
  useEffect(() => {
    if (!locationData) return;

    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);
        const nextWeather = await fetchOpenMeteoWeather(locationData.latitude, locationData.longitude);
        setWeatherData(nextWeather.current);
      } catch (err) {
        console.error('Weather fetch error', err);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [locationData]);

  if (!locationData) {
    return (
      <ThemedView style={[styles.emptyState, { backgroundColor: activeColors.background }]}>
        <ThemedText>Location not found.</ThemedText>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ThemedText>Go Back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${locationData.name} in Sri Lanka! Subtitle: ${locationData.subtitle}. Coords: ${locationData.coords}`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ThemedView style={[styles.root, { backgroundColor: activeColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Main Photo Banner */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: locationData.images[0] }} style={styles.mainImage} contentFit="cover" />
          
          {/* Floating Action Header Over Photo */}
          <SafeAreaView style={styles.floatingHeader} edges={['top']}>
            <Pressable style={[styles.roundButton, { backgroundColor: 'rgba(15,23,42,0.6)' }]} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </Pressable>
            
            <View style={styles.headerRightGroup}>
              <Pressable style={[styles.roundButton, { backgroundColor: 'rgba(15,23,42,0.6)' }]} onPress={handleShare}>
                <MaterialIcons name="share" size={22} color="#fff" />
              </Pressable>
              
              <Pressable
                style={[styles.roundButton, { backgroundColor: 'rgba(15,23,42,0.6)' }]}
                onPress={() => toggleFavorite(locationData.id)}
              >
                <MaterialIcons
                  name={isFavorite(locationData.id) ? 'favorite' : 'favorite-border'}
                  size={24}
                  color={isFavorite(locationData.id) ? '#ef4444' : '#fff'}
                />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        {/* Details Wrapper */}
        <View style={styles.contentWrapper}>
          <View style={styles.mainInfo}>
            <ThemedText type="title" style={[styles.locationName, { color: activeColors.text }]}>
              {locationData.name}
            </ThemedText>
            <View style={styles.locationSubtitleRow}>
              <MaterialIcons name="location-on" size={16} color={activeColors.tint} />
              <ThemedText style={[styles.locationSubtitle, { color: activeColors.mutedText }]}>
                {locationData.subtitle}
              </ThemedText>
            </View>
          </View>

          {/* Weather & Details Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={[styles.statItem, { backgroundColor: theme === 'dark' ? '#151922' : '#f1f5f9' }]}>
              <View style={styles.statIconHeader}>
                <MaterialIcons
                  name={weather ? (weather.icon as any) : 'wb-sunny'}
                  size={20}
                  color="#eab308"
                />
                <ThemedText type="defaultSemiBold" style={{ fontSize: 13 }}>Live Weather</ThemedText>
              </View>
              {weatherLoading ? (
                <ActivityIndicator size="small" color={activeColors.tint} style={{ marginTop: 6 }} />
              ) : weather ? (
                <View style={{ marginTop: 4 }}>
                  <ThemedText style={styles.statMainText}>{weather.temp}°C</ThemedText>
                  <ThemedText style={[styles.statSubText, { color: activeColors.mutedText }]}>{weather.condition}</ThemedText>
                </View>
              ) : (
                <ThemedText style={{ marginTop: 4 }}>Unavailable</ThemedText>
              )}
            </View>

            <View style={[styles.statItem, { backgroundColor: theme === 'dark' ? '#151922' : '#f1f5f9' }]}>
              <View style={styles.statIconHeader}>
                <MaterialIcons name="directions-walk" size={20} color="#10b981" />
                <ThemedText type="defaultSemiBold" style={{ fontSize: 13 }}>Trek Trail</ThemedText>
              </View>
              <View style={{ marginTop: 4 }}>
                <ThemedText style={styles.statMainText} numberOfLines={1}>{locationData.walkArea.split(',')[0]}</ThemedText>
                <ThemedText style={[styles.statSubText, { color: activeColors.mutedText }]} numberOfLines={1}>
                  {locationData.walkArea.split(',')[1] || locationData.walkArea}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Suitability Section */}
          <View style={styles.textSection}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: activeColors.text }]}>
              Best Suited For
            </ThemedText>
            <ThemedText style={[styles.description, { color: activeColors.mutedText }]}>
              {locationData.suitability}
            </ThemedText>
          </View>

          {/* Description Info Section */}
          <View style={styles.textSection}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: activeColors.text }]}>
              About Location
            </ThemedText>
            <ThemedText style={[styles.description, { color: activeColors.mutedText }]}>
              {locationData.info}
            </ThemedText>
          </View>

          {/* Image Gallery Grid */}
          <View style={styles.gallerySection}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: activeColors.text }]}>
              Campsite Gallery
            </ThemedText>
            <View style={styles.photoGrid}>
              {locationData.images.slice(0, 3).map((url, idx) => (
                <Image key={idx} source={{ uri: url }} style={styles.galleryImage} contentFit="cover" />
              ))}
            </View>
          </View>

          {/* Action button: Trip Prep Chat */}
          <Pressable
            style={[styles.actionBtn, { backgroundColor: activeColors.tint }]}
            onPress={() => router.push(`/prep-chat?location=${locationData.id}`)}
          >
            <MaterialIcons name="chat" size={22} color="#030712" />
            <Text style={styles.actionBtnText}>Prepare with Camper-AI</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#0ea5e9',
  },
  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRightGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 22,
  },
  mainInfo: {
    gap: 6,
  },
  locationName: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  locationSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationSubtitle: {
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 14,
  },
  statItem: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statIconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statMainText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statSubText: {
    fontSize: 11,
  },
  textSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  gallerySection: {
    gap: 10,
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  galleryImage: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    marginTop: 10,
  },
  actionBtnText: {
    color: '#030712',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
