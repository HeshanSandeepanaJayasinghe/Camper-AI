import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function WelcomeScreen() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Image
              source={require('@/assets/loading/loading.png')}
              style={styles.loadingImage}
              contentFit="contain"
            />
            <ThemedText type="subtitle" style={styles.loadingText}>
              Preparing Camper-AI...
            </ThemedText>
          </View>
        ) : (
          <View style={styles.welcomeContainer}>
            <Image source={require('@/assets/logo/Logo.png')} style={styles.logo} contentFit="contain" />
            <ThemedText type="title" style={styles.title}>
              Welcome to Camper-AI
            </ThemedText>
            <Pressable style={styles.button} onPress={() => router.push('/login')}>
              <ThemedText type="subtitle" style={styles.buttonText}>
                Start
              </ThemedText>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 20,
  },
  loadingImage: {
    width: 220,
    height: 220,
  },
  loadingText: {
    textAlign: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    gap: 24,
  },
  logo: {
    width: 190,
    height: 190,
  },
  title: {
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
  },
});
