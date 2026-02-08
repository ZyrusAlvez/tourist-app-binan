'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { SearchResult } from '@/services/searchService';

interface PlacesContextType {
  selectedPlaces: SearchResult[];
  setSelectedPlaces: (places: SearchResult[]) => void;
  focusedPlace: SearchResult | null;
  setFocusedPlace: (place: SearchResult | null) => void;
  focusTrigger: number;
  triggerFocus: () => void;
  inputFromMap: string;
  setInputFromMap: (text: string) => void;
}

const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

export function PlacesProvider({ children }: { children: ReactNode }) {
  const [selectedPlaces, setSelectedPlaces] = useState<SearchResult[]>([]);
  const [focusedPlace, setFocusedPlace] = useState<SearchResult | null>(null);
  const [focusTrigger, setFocusTrigger] = useState(0);
  const [inputFromMap, setInputFromMap] = useState('');

  const triggerFocus = () => setFocusTrigger(prev => prev + 1);

  return (
    <PlacesContext.Provider value={{ selectedPlaces, setSelectedPlaces, focusedPlace, setFocusedPlace, focusTrigger, triggerFocus, inputFromMap, setInputFromMap }}>
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
