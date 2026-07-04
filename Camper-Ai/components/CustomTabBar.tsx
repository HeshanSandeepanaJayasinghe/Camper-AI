import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAppContext } from '@/components/AppContext';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

type TabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

export function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const router = useRouter();
  const { theme } = useAppContext();
  const activeColors = Colors[theme];
  const [expanded, setExpanded] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;

  // Toggle expanding menu with animation
  const toggleMenu = () => {
    if (expanded) {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setExpanded(false));
    } else {
      setExpanded(true);
      Animated.spring(animValue, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const navigateToExtra = (route: string) => {
    // Close the menu
    Animated.timing(animValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setExpanded(false);
      router.push(route as any);
    });
  };

  const handleTabPress = (routeIndex: number, routeName: string, isFocused: boolean) => {
    // If expanding menu is open, close it
    if (expanded) {
      toggleMenu();
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes[routeIndex].key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  // Expandable menu translate styles
  const menuTranslateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const menuScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const backdropOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  // Expandable menu options
  const subItems = [
    { label: 'Survival Guide', icon: 'menu-book', route: '/guide', color: '#f97316' },
    { label: 'Compass', icon: 'explore', route: '/compass', color: '#8b5cf6' },
    { label: 'Weather Report', icon: 'wb-sunny', route: '/weather', color: '#eab308' },
    { label: 'Breadcrumb Mode', icon: 'near-me', route: '/breadcrumb', color: '#10b981' },
    { label: 'SOS Emergency', icon: 'warning', route: '/sos', color: '#ef4444' },
  ];

  return (
    <>
      {/* Backdrop overlay for dismissing menu */}
      {expanded && (
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={toggleMenu} />
        </Animated.View>
      )}

      {/* Floating Expandable Menu */}
      {expanded && (
        <Animated.View
          style={[
            styles.menuContainer,
            {
              backgroundColor: activeColors.card,
              borderColor: activeColors.border,
              transform: [{ translateY: menuTranslateY }, { scale: menuScale }],
            },
          ]}
        >
          <Text style={[styles.menuTitle, { color: activeColors.text }]}>Survival Utilities</Text>
          <View style={styles.menuGrid}>
            {subItems.map((item) => (
              <Pressable
                key={item.label}
                style={[styles.menuItem, { backgroundColor: theme === 'dark' ? '#1c2230' : '#f1f5f9' }]}
                onPress={() => navigateToExtra(item.route)}
              >
                <View style={[styles.menuIconCircle, { backgroundColor: item.color }]}>
                  <MaterialIcons name={item.icon as any} size={24} color="#fff" />
                </View>
                <Text style={[styles.menuLabel, { color: activeColors.text }]}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Main Bottom Tab Bar */}
      <View
        style={[
          styles.tabBarContainer,
          {
            backgroundColor: activeColors.card,
            borderTopColor: activeColors.border,
            shadowColor: theme === 'dark' ? '#000' : '#475569',
          },
        ]}
      >
        {/* Tab 1: Map */}
        <Pressable
          style={styles.tabButton}
          onPress={() => handleTabPress(0, 'index', state.index === 0)}
        >
          <MaterialIcons
            name="map"
            size={26}
            color={state.index === 0 ? activeColors.tint : activeColors.tabIconDefault}
          />
        </Pressable>

        {/* Tab 2: Chat */}
        <Pressable
          style={styles.tabButton}
          onPress={() => handleTabPress(1, 'chat', state.index === 1)}
        >
          <MaterialIcons
            name="chat-bubble-outline"
            size={26}
            color={state.index === 1 ? activeColors.tint : activeColors.tabIconDefault}
          />
        </Pressable>

        {/* Center: Camp Logo Standout Button */}
        <View style={styles.centerButtonWrapper}>
          <Pressable
            style={[
              styles.centerButton,
              {
                backgroundColor: activeColors.tint,
                shadowColor: activeColors.tint,
              },
              expanded && styles.centerButtonActive,
            ]}
            onPress={toggleMenu}
          >
            <MaterialIcons
              name="terrain" // Camp / mountain icon
              size={32}
              color={theme === 'dark' ? '#030712' : '#ffffff'}
            />
          </Pressable>
        </View>

        {/* Tab 3: Setting */}
        <Pressable
          style={styles.tabButton}
          onPress={() => handleTabPress(2, 'setting', state.index === 2)}
        >
          <MaterialIcons
            name="settings"
            size={26}
            color={state.index === 2 ? activeColors.tint : activeColors.tabIconDefault}
          />
        </Pressable>

        {/* Tab 4: Profile */}
        <Pressable
          style={styles.tabButton}
          onPress={() => handleTabPress(3, 'profile', state.index === 3)}
        >
          <MaterialIcons
            name="person"
            size={26}
            color={state.index === 3 ? activeColors.tint : activeColors.tabIconDefault}
          />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 99,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 95,
    alignSelf: 'center',
    width: width * 0.9,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    zIndex: 100,
    elevation: 20,
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: -5 },
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  menuItem: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    gap: 10,
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    height: 75,
    width: '100%',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 15 : 0,
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 101,
    elevation: 8,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -3 },
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonWrapper: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    top: -20, // Rise above bottom bar
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  centerButtonActive: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
});
