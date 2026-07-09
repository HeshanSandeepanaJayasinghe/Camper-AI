import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { sampleLocations, type Location } from '@/components/sample-locations';
import { fetchOpenMeteoWeather, type CurrentWeather, type DailyForecast } from '@/components/weather';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAppContext } from '@/components/AppContext';

export default function WeatherScreen() {
  const { theme } = useAppContext();
  const colors = Colors[theme];
  const [selected, setSelected] = useState<Location>(sampleLocations[0]);
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [daily, setDaily] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadWeather() {
      setLoading(true);
      try {
        const data = await fetchOpenMeteoWeather(selected.latitude, selected.longitude);
        if (mounted) {
          setCurrent(data.current);
          setDaily(data.daily.slice(0, 5));
        }
      } catch {
        if (mounted) {
          setCurrent(null);
          setDaily([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadWeather();
    return () => {
      mounted = false;
    };
  }, [selected]);

  return (
    <ThemedView style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>Weather Hub</ThemedText>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.locationList}>
          {sampleLocations.map((location) => (
            <Pressable
              key={location.id}
              style={[
                styles.locationChip,
                {
                  backgroundColor: selected.id === location.id ? colors.tint : colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setSelected(location)}
            >
              <ThemedText style={{ color: selected.id === location.id ? '#031014' : colors.text, fontWeight: '700' }}>
                {location.name}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        <View style={[styles.currentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {loading ? (
            <ActivityIndicator color={colors.tint} />
          ) : current ? (
            <>
              <MaterialIcons name={current.icon as any} size={42} color={colors.tint} />
              <View style={{ flex: 1 }}>
                <ThemedText type="subtitle" style={{ color: colors.text }}>{selected.name}</ThemedText>
                <ThemedText style={[styles.condition, { color: colors.mutedText }]}>
                  {current.condition} • wind {current.windSpeed} km/h
                </ThemedText>
              </View>
              <ThemedText style={[styles.temp, { color: colors.text }]}>{current.temp}°C</ThemedText>
            </>
          ) : (
            <ThemedText style={{ color: colors.mutedText }}>Weather unavailable right now.</ThemedText>
          )}
        </View>

        <View style={styles.forecastList}>
          {daily.map((day) => (
            <View key={day.date} style={[styles.forecastRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <MaterialIcons name={day.icon as any} size={24} color={colors.tint} />
              <View style={{ flex: 1 }}>
                <ThemedText style={{ color: colors.text, fontWeight: '700' }}>{new Date(day.date).toDateString().slice(0, 10)}</ThemedText>
                <ThemedText style={{ color: colors.mutedText }}>{day.condition} • rain {day.rain}%</ThemedText>
              </View>
              <ThemedText style={{ color: colors.text, fontWeight: '800' }}>{day.minTemp}° / {day.maxTemp}°</ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { padding: 18, gap: 18, paddingBottom: 36 },
  title: { fontSize: 30, fontWeight: '800' },
  locationList: { gap: 10, paddingRight: 18 },
  locationChip: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, maxWidth: 190 },
  currentCard: { minHeight: 116, borderWidth: 1, borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  condition: { marginTop: 4 },
  temp: { fontSize: 30, fontWeight: '900', lineHeight: 36 },
  forecastList: { gap: 12 },
  forecastRow: { borderWidth: 1, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
});
