'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { SearchResult } from '@/services/searchService';

interface PlacesContextType {
  selectedPlaces: SearchResult[];
  setSelectedPlaces: (places: SearchResult[]) => void;
}

const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

export function PlacesProvider({ children }: { children: ReactNode }) {
  const [selectedPlaces, setSelectedPlaces] = useState<SearchResult[]>([]);

  return (
    <PlacesContext.Provider value={{ selectedPlaces, setSelectedPlaces }}>
      {children}
    </PlacesContext.Provider>
  );
}

export function usePlaces() {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error('usePlaces must be used within PlacesProvider');
  }
  return context;
}
