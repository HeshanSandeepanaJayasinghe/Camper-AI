import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppContext } from '@/components/AppContext';
import { Colors } from '@/constants/theme';

export default function WelcomeScreen() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { theme } = useAppContext();
  const colors = Colors[theme];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemedView style={[styles.root, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        {loading ? (
          <LoadingIndicator label="Preparing Camper-AI..." />
        ) : (
          <View style={styles.welcomeContainer}>
            <View style={[styles.logoRing, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Image
                source={require('@/assets/logo/Logo.png')}
                style={[
                  styles.logo,
                  theme === 'dark' ? { tintColor: '#ffffff' } : undefined,
                ]}
                contentFit="contain"
              />
            </View>
            <View style={styles.copyBlock}>
              <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
                Welcome to Camper-AI
              </ThemedText>
              <ThemedText style={[styles.subtitle, { color: colors.mutedText }]}>
                Your smart companion for camping, hiking, and outdoor survival in Sri Lanka.
              </ThemedText>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: colors.tint, opacity: pressed ? 0.88 : 1 },
              ]}
              onPress={() => router.push('/login')}
            >
              <MaterialIcons name="hiking" size={22} color={theme === 'dark' ? '#030712' : '#ffffff'} />
              <ThemedText type="subtitle" style={[styles.buttonText, { color: theme === 'dark' ? '#030712' : '#ffffff' }]}>
                Start Exploring
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
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  welcomeContainer: {
    alignItems: 'center',
    gap: 28,
  },
  logoRing: {
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  copyBlock: {
    alignItems: 'center',
    gap: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 16,
    marginTop: 4,
  },
  buttonText: {
    fontWeight: '800',
  },
});