import { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAppContext } from '@/components/AppContext';

let MapView: any;
let Polyline: any;
let Marker: any;
if (Platform.OS !== 'web') {
  const Maps = eval('require')('react-native-maps');
  MapView = Maps.default;
  Polyline = Maps.Polyline;
  Marker = Maps.Marker;
}

type Point = {
  latitude: number;
  longitude: number;
};

export default function BreadcrumbScreen() {
  const { theme } = useAppContext();
  const colors = Colors[theme];
  const [points, setPoints] = useState<Point[]>([]);
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState('Ready to track your route.');
  const [subscription, setSubscription] = useState<Location.LocationSubscription | null>(null);

  useEffect(() => () => subscription?.remove(), [subscription]);

  const startTracking = async () => {
    if (Platform.OS === 'web') {
      setStatus('Live GPS tracking is available on mobile devices.');
      return;
    }

    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') {
      setStatus('Location permission was not granted.');
      return;
    }

    setPoints([]);
    setTracking(true);
    setStatus('Tracking started. Keep the app open while hiking.');
    const watcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 5,
        timeInterval: 3000,
      },
      (position) => {
        setPoints((current) => [
          ...current,
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        ]);
      },
    );
    setSubscription(watcher);
  };

  const stopTracking = () => {
    subscription?.remove();
    setSubscription(null);
    setTracking(false);
    setStatus(points.length > 1 ? 'Tracking stopped. Review your breadcrumb path below.' : 'Tracking stopped.');
  };

  const region = points.length
    ? {
        latitude: points[points.length - 1].latitude,
        longitude: points[points.length - 1].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: 7.8731,
        longitude: 80.7718,
        latitudeDelta: 2.8,
        longitudeDelta: 2.8,
      };

  return (
    <ThemedView style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>Breadcrumb Mode</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.mutedText }]}>{status}</ThemedText>

        <View style={[styles.mapCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
          {Platform.OS === 'web' ? (
            <View style={styles.webFallback}>
              <MaterialIcons name="near-me" size={44} color={colors.tint} />
              <ThemedText style={{ color: colors.mutedText, textAlign: 'center' }}>
                Native route tracking appears on iOS and Android.
              </ThemedText>
            </View>
          ) : (
            <MapView style={styles.map} region={region}>
              {points[0] && <Marker coordinate={points[0]} title="Start" pinColor="#10b981" />}
              {points.length > 1 && <Polyline coordinates={points} strokeColor={colors.tint} strokeWidth={5} />}
              {points.length > 0 && <Marker coordinate={points[points.length - 1]} title="Current position" pinColor="#ef4444" />}
            </MapView>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: tracking ? '#ef4444' : colors.tint }]}
            onPress={tracking ? stopTracking : startTracking}
          >
            <MaterialIcons name={tracking ? 'stop' : 'play-arrow'} size={24} color={tracking ? '#fff' : '#031014'} />
            <ThemedText style={{ color: tracking ? '#fff' : '#031014', fontWeight: '800' }}>
              {tracking ? 'Stop Tracking' : 'Start Tracking'}
            </ThemedText>
          </Pressable>
        </View>

        <View style={[styles.stats, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText style={{ color: colors.text, fontWeight: '800' }}>Trail Points</ThemedText>
          <ThemedText style={{ color: colors.tint, fontSize: 28, fontWeight: '900' }}>{points.length}</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { padding: 18, gap: 16, paddingBottom: 36 },
  title: { fontSize: 30, fontWeight: '900' },
  subtitle: { lineHeight: 21 },
  mapCard: { height: 360, borderWidth: 1, borderRadius: 22, overflow: 'hidden' },
  map: { ...StyleSheet.absoluteFillObject },
  webFallback: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  actions: { flexDirection: 'row' },
  actionButton: { flex: 1, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', borderRadius: 16, padding: 16 },
  stats: { borderWidth: 1, borderRadius: 18, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
