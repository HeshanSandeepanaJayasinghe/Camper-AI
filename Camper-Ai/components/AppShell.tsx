import { type ReactNode, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppContext } from '@/components/AppContext';

type RoutePath = '/' | '/chat' | '/guide' | '/setting' | '/profile';

const menuItems: { title: string; route: RoutePath; icon: string }[] = [
  { title: 'Map', route: '/', icon: 'map' },
  { title: 'Chat', route: '/chat', icon: 'message-circle' },
  { title: 'Guide', route: '/guide', icon: 'book' },
  { title: 'Setting', route: '/setting', icon: 'settings' },
  { title: 'My profile', route: '/profile', icon: 'user' },
];

type AppShellProps = {
  title: string;
  children: React.ReactNode;
};

export function AppShell({ title, children }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const { signOut, user } = useAppContext();

  const navigate = (route: RoutePath) => {
    setDrawerOpen(false);
    router.push(route as unknown as any);
  };

  const onSignOut = () => {
    signOut();
    setDrawerOpen(false);
    router.replace('/login');
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerBar}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => setDrawerOpen((current) => !current)} style={styles.iconButton}>
            <Feather name="menu" size={24} color="#0a7ea4" />
          </Pressable>
          <ThemedText type="subtitle" style={styles.titleText}>
            {title}
          </ThemedText>
          <Pressable onPress={onSignOut} style={styles.iconButton}>
            <Feather name="log-out" size={24} color="#0a7ea4" />
          </Pressable>
        </View>
      </SafeAreaView>

      {drawerOpen ? (
        <View style={styles.drawerOverlay}>
          <Pressable style={styles.drawerBackdrop} onPress={() => setDrawerOpen(false)} />
          <View style={styles.drawerPanel}>
            <ThemedText type="title" style={styles.drawerTitle}>
              Camper-AI Menu
            </ThemedText>
            <ThemedText style={styles.drawerSubtitle}>{user?.name ?? 'Guest'}</ThemedText>
            <View style={styles.drawerSeparator} />
            {menuItems.map((item) => (
              <Pressable key={item.title} style={styles.drawerItem} onPress={() => navigate(item.route)}>
                <Feather name={item.icon as any} size={18} color="#0a7ea4" />
                <ThemedText style={styles.drawerItemText}>{item.title}</ThemedText>
              </Pressable>
            ))}
            <View style={styles.drawerFooter}>
              <Pressable style={styles.drawerItem} onPress={onSignOut}>
                <Feather name="log-out" size={18} color="#0a7ea4" />
                <ThemedText style={styles.drawerItemText}>Sign out</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}

      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.content}>{children}</SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    backgroundColor: '#f4f8fb',
    borderBottomColor: '#e1e9ef',
    borderBottomWidth: 1,
  },
  headerRow: {
    height: 62,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    flexDirection: 'row',
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  drawerPanel: {
    width: 250,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  drawerTitle: {
    marginBottom: 6,
  },
  drawerSubtitle: {
    marginBottom: 16,
    color: '#555',
  },
  drawerSeparator: {
    height: 1,
    backgroundColor: '#e1e9ef',
    marginBottom: 14,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  drawerItemText: {
    fontSize: 16,
  },
  drawerFooter: {
    marginTop: 24,
    borderTopColor: '#e1e9ef',
    borderTopWidth: 1,
    paddingTop: 16,
  },
});
