import React, { createContext, useContext, useState, useEffect } from 'react';

type AppMode = 'adult' | 'child';

interface AppContextType {
  mode: AppMode;
  pin: string | null;
  setMode: (mode: AppMode) => void;
  setPin: (pin: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>('adult');
  const [pin, setPin] = useState<string | null>(null);

  // Optional: persist to localStorage if needed, but for MVP memory is fine.
  
  return (
    <AppContext.Provider value={{ mode, pin, setMode, setPin }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
