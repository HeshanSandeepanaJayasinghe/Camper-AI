import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { AppProvider, useAppContext } from '@/components/AppContext';

function RootLayoutContent() {
  const { theme } = useAppContext();

  // Create custom react-navigation themes matching our constants
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#0d0f12',
      card: '#151922',
      text: '#f8fafc',
      border: '#222b3c',
    },
  };

  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#f8fafc',
      card: '#ffffff',
      text: '#0f172a',
      border: '#e2e8f0',
    },
  };

  const headerOptions = {
    headerBackTitle: 'Back',
    headerStyle: {
      backgroundColor: theme === 'dark' ? '#151922' : '#ffffff',
    },
    headerTintColor: theme === 'dark' ? '#f8fafc' : '#0f172a',
    headerTitleStyle: {
      color: theme === 'dark' ? '#f8fafc' : '#0f172a',
    },
  };

  return (
    <ThemeProvider value={theme === 'dark' ? customDarkTheme : customLightTheme}>
      <Stack screenOptions={headerOptions}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Additional Stack Screens */}
        <Stack.Screen name="info" options={{ headerShown: false }} />
        <Stack.Screen name="guide" options={{ title: 'Survival Guide', headerShown: true, ...headerOptions }} />
        <Stack.Screen name="compass" options={{ title: 'Compass', headerShown: true, ...headerOptions }} />
        <Stack.Screen name="weather" options={{ title: 'Weather Report', headerShown: true, ...headerOptions }} />
        <Stack.Screen name="sos" options={{ title: 'SOS Emergency', headerShown: true, ...headerOptions }} />
        <Stack.Screen name="breadcrumb" options={{ title: 'Breadcrumb Tracking', headerShown: true, ...headerOptions }} />
        <Stack.Screen name="prep-chat" options={{ title: 'Trip Preparation', headerShown: true, ...headerOptions }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootLayoutContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}
