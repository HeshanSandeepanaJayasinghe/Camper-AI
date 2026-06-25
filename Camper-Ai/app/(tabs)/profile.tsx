import { ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { AppShell } from '@/components/AppShell';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppContext } from '@/components/AppContext';

export default function ProfileScreen() {
  const { user, favorites } = useAppContext();

  return (
    <AppShell title="Profile">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileCard}>
          <Image
            source={require('@/assets/logo/Logo.png')}
            style={styles.avatar}
            contentFit="contain"
          />
          <View style={styles.profileDetails}>
            <ThemedText type="subtitle">{user?.name ?? 'Camper User'}</ThemedText>
            <ThemedText style={styles.emailText}>{user?.email ?? 'you@example.com'}</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="title">Favorite locations</ThemedText>
          {favorites.length === 0 ? (
            <ThemedText style={styles.emptyText}>No favorites yet. Add a place from the map.</ThemedText>
          ) : (
            favorites.map((item) => (
              <View key={item.id} style={styles.favoriteCard}>
                <ThemedText type="subtitle">{item.name}</ThemedText>
                <ThemedText style={styles.favoriteMeta}>{item.subtitle}</ThemedText>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    gap: 18,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fbfd',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 18,
    backgroundColor: '#fff',
  },
  profileDetails: {
    gap: 6,
  },
  emailText: {
    color: '#4d606f',
  },
  section: {
    gap: 12,
  },
  emptyText: {
    color: '#5f6d76',
  },
  favoriteCard: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6edf0',
    padding: 16,
  },
  favoriteMeta: {
    color: '#5f6d76',
    marginTop: 4,
  },
});
