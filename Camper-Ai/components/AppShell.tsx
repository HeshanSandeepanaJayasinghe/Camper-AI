import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { TAB_BAR_HEIGHT } from '@/constants/layout';

type AppShellProps = {
  title?: string;
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.content}>
        <View style={{ flex: 1, paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 8 }}>{children}</View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
