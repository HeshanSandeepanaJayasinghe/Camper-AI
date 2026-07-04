import { useAppContext } from '@/components/AppContext';

export function useColorScheme(): 'light' | 'dark' {
  try {
    const context = useAppContext();
    return context.theme;
  } catch (e) {
    // If called outside AppProvider, default to dark theme
    return 'dark';
  }
}
