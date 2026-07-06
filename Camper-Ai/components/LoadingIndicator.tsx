import { ActivityIndicator, StyleSheet, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAppContext } from '@/components/AppContext';

type LoadingIndicatorProps = {
  label?: string;
  size?: 'small' | 'large';
};

export function LoadingIndicator({ label, size = 'large' }: LoadingIndicatorProps) {
  const { theme } = useAppContext();
  const colors = Colors[theme];

  return (
    <View style={styles.container}>
      <View style={[styles.iconRing, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <MaterialIcons name="terrain" size={36} color={colors.tint} />
        <ActivityIndicator size={size} color={colors.tint} style={styles.spinner} />
      </View>
      {label ? (
        <ThemedText type="subtitle" style={[styles.label, { color: colors.mutedText }]}>
          {label}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
  },
  iconRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    ...StyleSheet.absoluteFillObject,
  },
  label: {
    textAlign: 'center',
  },
});
