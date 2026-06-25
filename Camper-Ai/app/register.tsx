import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('All fields required', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please verify your password and confirm password.');
      return;
    }

    Alert.alert('Account created', 'You can now log in with your new account.', [
      { text: 'Continue', onPress: () => router.replace('/login') },
    ]);
  };

  return (
    <ThemedView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}>
        <ThemedText type="title" style={styles.title}>
          Create an account
        </ThemedText>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Name</ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            style={styles.input}
          />
        </View>

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

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Confirm Password</ThemedText>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="••••••••"
            style={styles.input}
          />
        </View>

        <Pressable style={styles.primaryButton} onPress={handleSignup}>
          <ThemedText type="subtitle" style={styles.buttonText}>
            Sign up
          </ThemedText>
        </Pressable>
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
});
