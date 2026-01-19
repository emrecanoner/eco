"use client";

import { createContext, useContext, ReactNode } from "react";

interface SettingsContextType {
  title: string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  title: string;
  children: ReactNode;
}

export function SettingsProvider({ title, children }: SettingsProviderProps) {
  return (
    <SettingsContext.Provider value={{ title }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

