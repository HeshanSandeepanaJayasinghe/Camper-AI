import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppContext } from '@/components/AppContext';
import { Colors } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInAsGuest, theme } = useAppContext();
  const activeColors = Colors[theme];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    const result = await signIn(email.trim(), password.trim());
    setLoading(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Failed', result.error || 'Check your credentials and try again.');
    }
  };

  const handleGuestLogin = () => {
    signInAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={[styles.root, { backgroundColor: activeColors.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        <ThemedText type="title" style={[styles.title, { color: activeColors.text }]}>
          Welcome Back
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: activeColors.mutedText }]}>
          Sign in to access GPS tracking, survival guide, and AI prep.
        </ThemedText>

        <View style={styles.formGroup}>
          <ThemedText style={[styles.label, { color: activeColors.text }]}>Email Address</ThemedText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="email@example.com"
            placeholderTextColor={theme === 'dark' ? '#475569' : '#94a3b8'}
            style={[
              styles.input,
              {
                backgroundColor: theme === 'dark' ? '#151922' : '#ffffff',
                borderColor: activeColors.border,
                color: activeColors.text,
              },
            ]}
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={[styles.label, { color: activeColors.text }]}>Password</ThemedText>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={theme === 'dark' ? '#475569' : '#94a3b8'}
            style={[
              styles.input,
              {
                backgroundColor: theme === 'dark' ? '#151922' : '#ffffff',
                borderColor: activeColors.border,
                color: activeColors.text,
              },
            ]}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={activeColors.tint} style={styles.loader} />
        ) : (
          <>
            <Pressable style={[styles.primaryButton, { backgroundColor: activeColors.tint }]} onPress={handleLogin}>
              <ThemedText style={styles.buttonText}>Login</ThemedText>
            </Pressable>

            <Pressable
              style={[styles.secondaryButton, { borderColor: activeColors.tint }]}
              onPress={handleGuestLogin}
            >
              <ThemedText style={[styles.secondaryButtonText, { color: activeColors.tint }]}>
                Continue as Guest
              </ThemedText>
            </Pressable>
          </>
        )}

        <View style={styles.footer}>
          <ThemedText style={{ color: activeColors.mutedText }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={[styles.linkText, { color: activeColors.tint }]}>
              Register
            </Link>
          </ThemedText>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 28,
    justifyContent: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  primaryButton: {
    marginTop: 14,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  secondaryButton: {
    marginTop: 14,
    borderWidth: 1.5,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#030712',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  footer: {
    marginTop: 28,
    alignItems: 'center',
  },
  linkText: {
    fontWeight: '700',
  },
});
