import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAppContext } from '@/components/AppContext';

function headingFromMagnetometer(x: number, y: number) {
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  return Math.round((angle + 360 + 90) % 360);
}

export default function CompassScreen() {
  const { theme } = useAppContext();
  const colors = Colors[theme];
  const [heading, setHeading] = useState(0);
  const [available, setAvailable] = useState(Platform.OS !== 'web');
  const rotation = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;

    async function startCompass() {
      if (Platform.OS === 'web') {
        setAvailable(false);
        return;
      }

      const isAvailable = await Magnetometer.isAvailableAsync();
      setAvailable(isAvailable);
      if (!isAvailable) return;

      Magnetometer.setUpdateInterval(250);
      subscription = Magnetometer.addListener(({ x, y }) => {
        const nextHeading = headingFromMagnetometer(x, y);
        setHeading(nextHeading);
        Animated.timing(rotation, {
          toValue: -nextHeading,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      });
    }

    startCompass();
    return () => subscription?.remove();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [-360, 0],
    outputRange: ['-360deg', '0deg'],
  });

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
          <View style={[styles.needle, { backgroundColor: colors.tint }]} />
        </Animated.View>
        <View style={[styles.centerPin, { backgroundColor: colors.tint }]} />
      </View>

      <View style={[styles.readout, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <MaterialIcons name="explore" size={24} color={colors.tint} />
        <ThemedText type="subtitle" style={{ color: colors.text }}>{available ? `${heading}°` : 'Sensor unavailable'}</ThemedText>
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
  needle: {
    position: 'absolute',
    width: 6,
    height: 92,
    borderRadius: 3,
    top: 26,
    left: 117,
  },
  centerPin: { position: 'absolute', width: 18, height: 18, borderRadius: 9 },
  readout: { flexDirection: 'row', gap: 10, alignItems: 'center', borderWidth: 1, borderRadius: 18, padding: 16 },
});
