import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { askGeminiChat } from '@/components/gemini';
import { ThemedText } from '@/components/themed-text';
import { FormattedText } from '@/components/FormattedText';
import { ThemedView } from '@/components/themed-view';
import { useAppContext } from '@/components/AppContext';
import { Colors } from '@/constants/theme';

const sections = {
  Water: ['Filter or boil stream water before drinking.', 'Carry at least 2 liters per person for day hikes.', 'Avoid stagnant pools after heavy rain.'],
  Fire: ['Use existing fire rings where permitted.', 'Keep flame small and clear dry leaves around it.', 'Fully drown embers before leaving camp.'],
  Shelter: ['Pitch above flood lines and away from unstable slopes.', 'Use a groundsheet in wet highland areas.', 'Ventilate tents to reduce condensation.'],
  Food: ['Pack high-energy dry foods and electrolytes.', 'Store food sealed and away from sleeping areas.', 'Carry waste back out of the trail.'],
};

type SectionName = keyof typeof sections;
type Message = { from: 'assistant' | 'user'; text: string };

export default function GuideScreen() {
  const { theme } = useAppContext();
  const colors = Colors[theme];
  const [active, setActive] = useState<SectionName>('Water');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: 'assistant', text: 'Ask me a survival question about water, fire, shelter, food, weather, or trail safety.' },
  ]);

  const askGuide = async () => {
    const text = draft.trim();
    if (!text || loading) return;
    const nextMessages = [...messages, { from: 'user' as const, text }];
    setMessages(nextMessages);
    setDraft('');
    setLoading(true);
    const answer = await askGeminiChat(
      nextMessages,
      'You are Camper-AI Survival Guide. Give practical, conservative outdoor safety advice for Sri Lankan camping and hiking. Keep answers concise, actionable, and include emergency caution where relevant.',
    );
    setMessages((current) => [...current, { from: 'assistant', text: answer }]);
    setLoading(false);
  };

  return (
    <ThemedView style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>Survival Guide</ThemedText>

        <View style={styles.tabs}>
          {(Object.keys(sections) as SectionName[]).map((name) => (
            <Pressable
              key={name}
              style={[styles.tab, { backgroundColor: active === name ? colors.tint : colors.card, borderColor: colors.border }]}
              onPress={() => setActive(name)}
            >
              <ThemedText style={{ color: active === name ? '#031014' : colors.text, fontWeight: '700' }}>{name}</ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="subtitle" style={{ color: colors.text }}>{active} Essentials</ThemedText>
          {sections[active].map((tip) => (
            <View key={tip} style={styles.tipRow}>
              <MaterialIcons name="check-circle" size={20} color={colors.tint} />
              <ThemedText style={[styles.tipText, { color: colors.mutedText }]}>{tip}</ThemedText>
            </View>
          ))}
        </View>

        <View style={[styles.chatPanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="subtitle" style={{ color: colors.text }}>Ask Camper-AI</ThemedText>
          {messages.map((message, index) => (
            <View
              key={`${message.from}-${index}`}
              style={[
                styles.message,
                { backgroundColor: message.from === 'user' ? colors.tint : theme === 'dark' ? '#1c2230' : '#f1f5f9' },
              ]}
            >
              <FormattedText style={{ color: message.from === 'user' ? '#031014' : colors.text }}>{message.text}</FormattedText>
            </View>
          ))}
          {loading && <ActivityIndicator color={colors.tint} />}
          <View style={[styles.askBar, { borderColor: colors.border }]}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Ask a survival question..."
              placeholderTextColor={colors.tabIconDefault}
              multiline
              style={[styles.askInput, { color: colors.text }]}
            />
            <Pressable style={[styles.iconButton, { backgroundColor: colors.tint }]} onPress={askGuide}>
              <MaterialIcons name="send" size={18} color="#031014" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { padding: 18, gap: 18, paddingBottom: 36 },
  title: { fontSize: 30, fontWeight: '800' },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tab: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10 },
  section: { borderWidth: 1, borderRadius: 20, padding: 18, gap: 12 },
  tipRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  tipText: { flex: 1, lineHeight: 21 },
  chatPanel: { borderWidth: 1, borderRadius: 20, padding: 16, gap: 12 },
  message: { alignSelf: 'flex-start', maxWidth: '92%', borderRadius: 14, padding: 12 },
  askBar: { flexDirection: 'row', borderWidth: 1, borderRadius: 16, padding: 8, gap: 8, alignItems: 'flex-end' },
  askInput: { flex: 1, minHeight: 38, maxHeight: 100, paddingHorizontal: 8, paddingVertical: 8 },
  iconButton: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
