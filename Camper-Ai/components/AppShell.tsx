import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';

type AppShellProps = {
  title?: string;
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <ThemedView style={styles.root}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.content}>
        {children}
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
