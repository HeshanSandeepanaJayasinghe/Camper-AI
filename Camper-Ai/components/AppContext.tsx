import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { sampleLocations, type Location } from '@/components/sample-locations';

type User = {
  name: string;
  email: string;
};

type AppContextType = {
  user: User | null;
  isLoggedIn: boolean;
  favorites: Location[];
  signIn: (name: string, email: string) => void;
  signOut: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const favorites = useMemo(
    () => sampleLocations.filter((location) => favoriteIds.includes(location.id)),
    [favoriteIds],
  );

  const signIn = (name: string, email: string) => {
    setUser({ name, email });
  };

  const signOut = () => {
    setUser(null);
    setFavoriteIds([]);
  };

  const toggleFavorite = (id: string) => {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id],
    );
  };

  const isFavorite = (id: string) => favoriteIds.includes(id);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      favorites,
      signIn,
      signOut,
      toggleFavorite,
      isFavorite,
    }),
    [favorites, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}
