import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppContext } from '@/components/AppContext';
import { Colors } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, theme } = useAppContext();
  const activeColors = Colors[theme];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await signUp(email.trim(), password.trim(), name.trim());
    setLoading(false);

    if (result.success) {
      Alert.alert('Account Created', 'Your account has been registered successfully. You can now log in.', [
        { text: 'Login Now', onPress: () => router.replace('/login') },
      ]);
    } else {
      Alert.alert('Signup Failed', result.error || 'Please double check your credentials.');
    }
  };

  return (
    <ThemedView style={[styles.root, { backgroundColor: activeColors.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        <ThemedText type="title" style={[styles.title, { color: activeColors.text }]}>
          Create Account
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: activeColors.mutedText }]}>
          Sign up to sync your custom preparation checklist and favorites.
        </ThemedText>

        <View style={styles.formGroup}>
          <ThemedText style={[styles.label, { color: activeColors.text }]}>Full Name</ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
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

        <View style={styles.formGroup}>
          <ThemedText style={[styles.label, { color: activeColors.text }]}>Confirm Password</ThemedText>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
          <Pressable style={[styles.primaryButton, { backgroundColor: activeColors.tint }]} onPress={handleSignup}>
            <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
          </Pressable>
        )}

        <View style={styles.footer}>
          <ThemedText style={{ color: activeColors.mutedText }}>
            Already have an account?{' '}
            <Link href="/login" style={[styles.linkText, { color: activeColors.tint }]}>
              Login
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
    marginBottom: 24,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 16,
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
  buttonText: {
    color: '#030712',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    fontWeight: '700',
  },
});
