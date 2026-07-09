import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { askGeminiChat } from '@/components/gemini';
import { sampleLocations } from '@/components/sample-locations';
import { ThemedText } from '@/components/themed-text';
import { FormattedText } from '@/components/FormattedText';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAppContext } from '@/components/AppContext';

type Message = {
  from: 'assistant' | 'user';
  text: string;
};

export default function PrepChatScreen() {
  const { location } = useLocalSearchParams();
  const { theme } = useAppContext();
  const colors = Colors[theme];
  const locationData = sampleLocations.find((item) => item.id === location);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'assistant',
      text: `Tell me your trip date, group size, transport plan, and gear you already have. I will turn it into a safe preparation checklist${locationData ? ` for ${locationData.name}` : ''}.`,
    },
  ]);

  const systemInstruction = useMemo(
    () =>
      `You are Camper-AI, a careful Sri Lankan hiking preparation assistant. Ask for missing trip date, head count, fitness level, transport, camping duration, gear, medicine, and emergency contact details. Provide concise checklists, weather-specific hazards, route cautions, packing recommendations, and safety warnings. ${
        locationData
          ? `The chosen location is ${locationData.name}: ${locationData.info}. Coordinates: ${locationData.coords}. Typical weather: ${locationData.weather}.`
          : ''
      } Do not invent emergency authority numbers; recommend verifying official local contacts before travel.`,
    [locationData],
  );

  const sendMessage = async () => {
    const text = draft.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { from: 'user' as const, text }];
    setMessages(nextMessages);
    setDraft('');
    setLoading(true);

    const answer = await askGeminiChat(nextMessages, systemInstruction);
    setMessages((current) => [...current, { from: 'assistant', text: answer }]);
    setLoading(false);
  };

  return (
    <ThemedView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>Trip Preparation</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.mutedText }]}>
          {locationData?.name ?? 'Build a safer camping plan'}
        </ThemedText>
      </View>

      <ScrollView style={styles.messages} contentContainerStyle={styles.messageContent}>
        {messages.map((message, index) => (
          <View
            key={`${message.from}-${index}`}
            style={[
              styles.bubble,
              message.from === 'user'
                ? [styles.userBubble, { backgroundColor: colors.tint }]
                : [styles.assistantBubble, { backgroundColor: colors.card, borderColor: colors.border }],
            ]}
          >
            <FormattedText style={{ color: message.from === 'user' ? '#031014' : colors.text }}>{message.text}</FormattedText>
          </View>
        ))}
        {loading && <ActivityIndicator color={colors.tint} style={styles.loader} />}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
        style={[styles.inputBar, { borderColor: colors.border, backgroundColor: colors.card }]}
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Trip date, group size, gear..."
          placeholderTextColor={colors.tabIconDefault}
          multiline
          style={[styles.input, { color: colors.text }]}
        />
        <Pressable style={[styles.sendButton, { backgroundColor: colors.tint }]} onPress={sendMessage}>
          <MaterialIcons name="send" size={20} color="#031014" />
        </Pressable>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 18,
  },
  header: {
    gap: 4,
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
  },
  messages: {
    flex: 1,
  },
  messageContent: {
    gap: 12,
    paddingBottom: 16,
  },
  bubble: {
    maxWidth: '88%',
    borderRadius: 18,
    padding: 14,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  loader: {
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 18,
    padding: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    paddingHorizontal: 8,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
