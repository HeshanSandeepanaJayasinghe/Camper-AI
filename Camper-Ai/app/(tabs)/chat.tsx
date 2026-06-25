import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const initialMessages = [
  { from: 'assistant', text: 'Hello! How can Camper-AI help you prepare today?' },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');

  const sendMessage = () => {
    if (!draft.trim()) {
      return;
    }

    setMessages((current) => [...current, { from: 'user', text: draft.trim() }]);
    setDraft('');
    setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          from: 'assistant',
          text: 'A good camping plan includes shelter, weather checks, and a small first-aid kit. Would you like top prep tips for your chosen location?',
        },
      ]);
    }, 500);
  };

  return (
    <AppShell title="Chat">
      <ThemedText style={styles.headerText}>
        Ask Camper-AI for recommendations, suitability, and packing guidance.
      </ThemedText>
      <ScrollView style={styles.messageList} contentContainerStyle={styles.messageContent}>
        {messages.map((message, index) => (
          <View
            key={`${message.from}-${index}`}
            style={[styles.messageBubble, message.from === 'user' ? styles.userBubble : styles.assistantBubble]}>
            <ThemedText>{message.text}</ThemedText>
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
        style={styles.inputBarContainer}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Type your question..."
          style={styles.input}
        />
        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <ThemedText style={styles.sendText}>Send</ThemedText>
        </Pressable>
      </KeyboardAvoidingView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  headerText: {
    marginBottom: 14,
    color: '#4b5a64',
  },
  messageList: {
    flex: 1,
    marginBottom: 12,
  },
  messageContent: {
    gap: 10,
    paddingBottom: 12,
  },
  messageBubble: {
    maxWidth: '84%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0a7ea4',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#edf4f8',
  },
  inputBarContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d6dde3',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  sendText: {
    color: '#fff',
  },
});
