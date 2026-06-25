import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View, ToastAndroid } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppContext } from '@/components/AppContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', message);
    }
  };

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Login required', 'Enter both email and password.');
      return;
    }

    signIn('Camper User', email.trim());
    showToast('Login successful');
    router.replace('/(tabs)' as unknown as any);
  };

  return (
    <ThemedView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}>
        <ThemedText type="title" style={styles.title}>
          Welcome back
        </ThemedText>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="name@example.com"
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Password</ThemedText>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            style={styles.input}
          />
        </View>

        <Pressable style={styles.primaryButton} onPress={handleLogin}>
          <ThemedText type="subtitle" style={styles.buttonText}>
            Login
          </ThemedText>
        </Pressable>

        <View style={styles.footer}> 
          <ThemedText>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={styles.linkText}>
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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d4d8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#f9fbfc',
  },
  primaryButton: {
    marginTop: 10,
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  footer: {
    marginTop: 22,
  },
  linkText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
});
