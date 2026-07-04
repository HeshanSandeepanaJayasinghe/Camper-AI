import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/components/supabase';
import { sampleLocations, type Location } from '@/components/sample-locations';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  bio?: string;
  emergency_contact?: string;
};

type AppContextType = {
  user: UserProfile | null;
  isLoggedIn: boolean;
  theme: 'light' | 'dark';
  isLoading: boolean;
  favorites: Location[];
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
  updateProfile: (name: string, bio: string, emergencyContact: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial settings (theme & favorites) from AsyncStorage
  useEffect(() => {
    async function loadSettings() {
      try {
        const savedTheme = await AsyncStorage.getItem('app_theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeState(savedTheme);
        } else {
          setThemeState('dark'); // Default to dark theme
        }

        const savedFavorites = await AsyncStorage.getItem('app_favorites');
        if (savedFavorites) {
          setFavoriteIds(JSON.parse(savedFavorites));
        }
      } catch (err) {
        console.error('Error loading settings', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  // Listen to Supabase Auth State Changes
  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        fetchUserProfile(session.user.id, session.user.email || '');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          fetchUserProfile(session.user.id, session.user.email || '');
        } else {
          // If signed out and not guest, reset user
          setUser((current) => {
            if (current?.id === 'guest') {
              return current; // keep guest user if active
            }
            return null;
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper to fetch user profile from Supabase profiles table
  const fetchUserProfile = async (userId: string, userEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If profile doesn't exist, create one or fallback to basic auth metadata
        const fallbackProfile: UserProfile = {
          id: userId,
          name: 'Camper User',
          email: userEmail,
          bio: '',
          emergency_contact: '',
        };
        setUser(fallbackProfile);
      } else if (data) {
        setUser({
          id: userId,
          name: data.name || 'Camper User',
          email: data.email || userEmail,
          bio: data.bio || '',
          emergency_contact: data.emergency_contact || '',
        });
        if (data.theme === 'light' || data.theme === 'dark') {
          setThemeState(data.theme);
          AsyncStorage.setItem('app_theme', data.theme);
        }
      }
    } catch (err) {
      console.error('Error fetching profile', err);
    }
  };

  const favorites = useMemo(
    () => sampleLocations.filter((location) => favoriteIds.includes(location.id)),
    [favoriteIds],
  );

  const toggleTheme = async () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(nextTheme);
    await AsyncStorage.setItem('app_theme', nextTheme);

    // Save to Supabase profile if logged in
    if (user && user.id !== 'guest') {
      try {
        await supabase
          .from('profiles')
          .update({ theme: nextTheme })
          .eq('id', user.id);
      } catch (err) {
        console.error('Failed to sync theme preference to Supabase', err);
      }
    }
  };

  const setTheme = async (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('app_theme', newTheme);

    if (user && user.id !== 'guest') {
      try {
        await supabase
          .from('profiles')
          .update({ theme: newTheme })
          .eq('id', user.id);
      } catch (err) {
        console.error('Failed to sync theme to Supabase', err);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchUserProfile(data.user.id, data.user.email || '');
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unknown error occurred.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Supabase triggers will automatically create a profiles row.
      // If we don't have triggers working, we can manually create a profile
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          name: name,
          email: email,
          theme: 'dark',
        });
        if (profileError) {
          console.warn('Manual profile upsert failed, relying on trigger:', profileError);
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unknown error occurred.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signInAsGuest = () => {
    const guestUser: UserProfile = {
      id: 'guest',
      name: 'Guest Explorer',
      email: 'guest@example.com',
      bio: 'Just looking around! Sign up for full tracking and safety features.',
      emergency_contact: '119',
    };
    setUser(guestUser);
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      if (user?.id !== 'guest') {
        await supabase.auth.signOut();
      }
      setUser(null);
      // Keep favorites stored in AsyncStorage even after sign out for better UX
    } catch (err) {
      console.error('Error logging out', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (name: string, bio: string, emergencyContact: string) => {
    if (!user) {
      return { success: false, error: 'No authenticated user found.' };
    }

    // Guest update is local-only
    if (user.id === 'guest') {
      const updated = { ...user, name, bio, emergency_contact: emergencyContact };
      setUser(updated);
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          bio,
          emergency_contact: emergencyContact,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      setUser({
        ...user,
        name,
        bio,
        emergency_contact: emergencyContact,
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Could not update profile.' };
    }
  };

  const deleteAccount = async () => {
    if (!user) {
      return { success: false, error: 'No active user session.' };
    }

    // Guest reset
    if (user.id === 'guest') {
      setUser(null);
      return { success: true };
    }

    try {
      // Call the Postgres RPC function we defined to delete the current auth user
      const { error } = await supabase.rpc('delete_user_account');
      if (error) {
        // Fallback: if RPC fails (e.g. not defined yet), delete profile row and sign out
        const { error: deleteRowError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', user.id);
        if (deleteRowError) {
          return { success: false, error: deleteRowError.message };
        }
      }

      // Log out user
      await supabase.auth.signOut();
      setUser(null);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Could not delete account.' };
    }
  };

  const toggleFavorite = async (id: string) => {
    let nextFavorites: string[] = [];
    setFavoriteIds((current) => {
      nextFavorites = current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id];
      AsyncStorage.setItem('app_favorites', JSON.stringify(nextFavorites));
      return nextFavorites;
    });
  };

  const isFavorite = (id: string) => favoriteIds.includes(id);

  const value = {
    user,
    isLoggedIn: Boolean(user),
    theme,
    isLoading,
    favorites,
    signIn,
    signUp,
    signInAsGuest,
    signOut,
    updateProfile,
    deleteAccount,
    toggleFavorite,
    isFavorite,
    toggleTheme,
    setTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}
