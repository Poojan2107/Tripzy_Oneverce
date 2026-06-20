"use client";
import React, { createContext, useState, useContext } from 'react';

interface AtmosphereContextType {
  activeLocation: string;
  setActiveLocation: (location: string) => void;
}

export const AtmosphereContext = createContext<AtmosphereContextType>({
  activeLocation: 'Varanasi, India',
  setActiveLocation: () => {},
});

export function AtmosphereProvider({ children }: { children: React.ReactNode }) {
  const [activeLocation, setActiveLocation] = useState('Varanasi, India');

  return (
    <AtmosphereContext.Provider value={{ activeLocation, setActiveLocation }}>
      {children}
    </AtmosphereContext.Provider>
  );
}

export function useAtmosphere() {
  return useContext(AtmosphereContext);
}
