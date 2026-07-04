import { Platform } from 'react-native';

const tintColorLight = '#0ea5e9'; // sky blue
const tintColorDark = '#00e5ff'; // neon cyan

export const Colors = {
  light: {
    text: '#0f172a',
    background: '#f8fafc',
    card: '#ffffff',
    border: '#e2e8f0',
    tint: tintColorLight,
    icon: '#64748b',
    tabIconDefault: '#94a3b8',
    tabIconSelected: tintColorLight,
    accent: '#0284c7',
    mutedText: '#64748b',
  },
  dark: {
    text: '#f8fafc',
    background: '#0d0f12',
    card: '#151922',
    border: '#222b3c',
    tint: tintColorDark,
    icon: '#94a3b8',
    tabIconDefault: '#475569',
    tabIconSelected: tintColorDark,
    accent: '#00b4d8',
    mutedText: '#94a3b8',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
