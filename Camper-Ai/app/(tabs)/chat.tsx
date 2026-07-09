import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View, ActivityIndicator } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ThemedText } from '@/components/themed-text';
import { FormattedText } from '@/components/FormattedText';
import { useAppContext } from '@/components/AppContext';
import { Colors } from '@/constants/theme';
import { askGeminiChat } from '@/components/gemini';

type Message = {
  from: 'assistant' | 'user';
  text: string;
};

const initialMessages: Message[] = [
  { from: 'assistant', text: 'Hello! How can Camper-AI help you prepare today?' },
];

export default function ChatScreen() {
  const { theme } = useAppContext();
  const colors = Colors[theme];
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const text = draft.trim();
    if (!text || loading) {
      return;
    }

    const nextMessages = [...messages, { from: 'user' as const, text }];
    setMessages(nextMessages);
    setDraft('');
    setLoading(true);

    const systemInstruction = 'You are Camper-AI, an intelligent Sri Lankan camping assistant. Help users plan hikes, suggest campsite locations, check gear lists, provide weather advice, and answer safety questions. Keep your responses structured, helpful, and concise.';
    const answer = await askGeminiChat(nextMessages, systemInstruction);
    setMessages((current) => [...current, { from: 'assistant', text: answer }]);
    setLoading(false);
  };

  return (
    <AppShell title="Chat">
      <ThemedText style={[styles.headerText, { color: colors.mutedText }]}>
        Ask Camper-AI for recommendations, suitability, and packing guidance.
      </ThemedText>
      
      <ScrollView style={styles.messageList} contentContainerStyle={styles.messageContent}>
        {messages.map((message, index) => (
          <View
            key={`${message.from}-${index}`}
            style={[
              styles.messageBubble,
              message.from === 'user'
                ? [styles.userBubble, { backgroundColor: colors.tint }]
                : [styles.assistantBubble, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }],
            ]}
          >
            <FormattedText style={{ color: message.from === 'user' ? '#031014' : colors.text }}>
              {message.text}
            </FormattedText>
          </View>
        ))}
        {loading && <ActivityIndicator color={colors.tint} style={styles.loader} />}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
        style={[styles.inputBarContainer, { borderColor: colors.border, backgroundColor: colors.card, borderWidth: 1 }]}
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Type your question..."
          placeholderTextColor={colors.tabIconDefault}
          style={[styles.input, { color: colors.text, backgroundColor: 'transparent' }]}
        />
        <Pressable 
          style={[styles.sendButton, { backgroundColor: colors.tint }]} 
          onPress={sendMessage}
          disabled={loading}
        >
          <ThemedText style={[styles.sendText, { color: theme === 'dark' ? '#030712' : '#ffffff', fontWeight: 'bold' }]}>
            Send
          </ThemedText>
        </Pressable>
      </KeyboardAvoidingView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  headerText: {
    marginBottom: 14,
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
  },
  assistantBubble: {
    alignSelf: 'flex-start',
  },
  loader: {
    alignSelf: 'flex-start',
    marginVertical: 6,
    marginLeft: 12,
  },
  inputBarContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderRadius: 12,
    padding: 6,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sendText: {
    fontSize: 14,
  },
});
