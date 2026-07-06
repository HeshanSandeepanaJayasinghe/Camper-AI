import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAppContext } from '@/components/AppContext';

function headingFromMagnetometer(x: number, y: number, z: number) {
  const pitch = Math.atan2(-x, Math.sqrt(y * y + z * z));
  const roll = Math.atan2(y, z);
  const compensatedX = x * Math.cos(pitch) + z * Math.sin(pitch);
  const compensatedY = x * Math.sin(roll) * Math.sin(pitch) + y * Math.cos(roll) - z * Math.sin(roll) * Math.cos(pitch);
  const angle = Math.atan2(-compensatedY, compensatedX) * (180 / Math.PI);
  return Math.round((angle + 360) % 360);
}

function normalizeHeading(value: number) {
  return ((value % 360) + 360) % 360;
}

export default function CompassScreen() {
  const { theme } = useAppContext();
  const colors = Colors[theme];
  const [heading, setHeading] = useState(0);
  const [available, setAvailable] = useState(Platform.OS !== 'web');
  const [source, setSource] = useState<'location' | 'magnetometer' | 'none'>('none');
  const rotation = useMemo(() => new Animated.Value(0), []);
  const headingRef = useRef(0);

  const animateToHeading = (nextHeading: number) => {
    const current = headingRef.current;
    let delta = nextHeading - current;

    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    const target = current + delta;
    headingRef.current = normalizeHeading(nextHeading);
    setHeading(headingRef.current);

    Animated.timing(rotation, {
      toValue: -target,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;
    let cancelled = false;

    async function startCompass() {
      if (Platform.OS === 'web') {
        setAvailable(false);
        setSource('none');
        return;
      }

      const permission = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;

      if (permission.status === 'granted') {
        try {
          subscription = await Location.watchHeadingAsync((data) => {
            const nextHeading = Math.round(data.trueHeading >= 0 ? data.trueHeading : data.magHeading);
            if (!Number.isNaN(nextHeading)) {
              setAvailable(true);
              setSource('location');
              animateToHeading(nextHeading);
            }
          });
          return;
        } catch {
          // Fall back to raw magnetometer readings below.
        }
      }

      const isAvailable = await Magnetometer.isAvailableAsync();
      if (cancelled) return;

      setAvailable(isAvailable);
      setSource(isAvailable ? 'magnetometer' : 'none');
      if (!isAvailable) return;

      Magnetometer.setUpdateInterval(200);
      subscription = Magnetometer.addListener(({ x, y, z }) => {
        animateToHeading(headingFromMagnetometer(x, y, z));
      });
    }

    startCompass();
    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [-720, 720],
    outputRange: ['-720deg', '720deg'],
  });

  const directionLabel = (() => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(heading / 45) % 8];
  })();

  return (
    <ThemedView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>Compass</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.mutedText }]}>
          Hold your phone flat and move it in a slow figure-eight to calibrate.
        </ThemedText>
      </View>

      <View style={[styles.dialShell, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Animated.View style={[styles.dial, { transform: [{ rotate }] }]}>
          {['N', 'E', 'S', 'W'].map((label, index) => (
            <ThemedText
              key={label}
              style={[
                styles.cardinal,
                { color: label === 'N' ? colors.tint : colors.text },
                index === 0 && styles.north,
                index === 1 && styles.east,
                index === 2 && styles.south,
                index === 3 && styles.west,
              ]}
            >
              {label}
            </ThemedText>
          ))}
        </Animated.View>
        <View style={[styles.needleNorth, { backgroundColor: colors.tint }]} />
        <View style={[styles.needleSouth, { backgroundColor: '#ef4444' }]} />
        <View style={[styles.centerPin, { backgroundColor: colors.border }]} />
        <View style={[styles.centerDot, { backgroundColor: colors.tint }]} />
      </View>

      <View style={[styles.readout, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <MaterialIcons name="explore" size={24} color={colors.tint} />
        <View>
          <ThemedText type="subtitle" style={{ color: colors.text }}>
            {available ? `${heading}° ${directionLabel}` : 'Sensor unavailable'}
          </ThemedText>
          {available && (
            <ThemedText style={{ color: colors.mutedText, fontSize: 12 }}>
              {source === 'location' ? 'Using device compass' : 'Using magnetometer'}
            </ThemedText>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', gap: 26 },
  header: { alignSelf: 'stretch', gap: 8 },
  title: { fontSize: 30, fontWeight: '800', textAlign: 'center' },
  subtitle: { textAlign: 'center', lineHeight: 21 },
  dialShell: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dial: { width: 240, height: 240, borderRadius: 120, position: 'relative' },
  cardinal: { position: 'absolute', fontSize: 24, fontWeight: '900' },
  north: { top: 8, alignSelf: 'center' },
  east: { right: 8, top: 104 },
  south: { bottom: 8, alignSelf: 'center' },
  west: { left: 8, top: 104 },
  needleNorth: {
    position: 'absolute',
    width: 6,
    height: 94,
    borderRadius: 3,
    top: 46,
    left: 137,
  },
  needleSouth: {
    position: 'absolute',
    width: 6,
    height: 94,
    borderRadius: 3,
    bottom: 46,
    left: 137,
    opacity: 0.75,
  },
  centerPin: { position: 'absolute', width: 22, height: 22, borderRadius: 11 },
  centerDot: { position: 'absolute', width: 10, height: 10, borderRadius: 5 },
  readout: { flexDirection: 'row', gap: 10, alignItems: 'center', borderWidth: 1, borderRadius: 18, padding: 16 },
});
