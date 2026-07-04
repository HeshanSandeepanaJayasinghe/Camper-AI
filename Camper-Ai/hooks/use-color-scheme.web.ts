import { useEffect, useState } from 'react';
import { useAppContext } from '@/components/AppContext';

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  let appTheme: 'light' | 'dark' = 'dark';
  try {
    const context = useAppContext();
    appTheme = context.theme;
  } catch (e) {
    appTheme = 'dark';
  }

  if (hasHydrated) {
    return appTheme;
  }

  return 'dark'; // default to dark
}
