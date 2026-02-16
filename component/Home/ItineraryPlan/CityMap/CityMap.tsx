'use client';

import { useState, useEffect } from 'react';
import { Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { SearchResult } from '@/services/searchService';
import { UserInput } from '@/type/itinerary';
import PlaceInfoPanel from '../PlaceInfoPanel';
import MapContent from './MapContent';
import { generateItinerary } from '@/services/itineraryService';

const MAP_CONFIG = {
  mapId: "2d9f2830304c482319b65b18",
  defaultZoom: 12,
  defaultCenter: { lat: 14.3145578, lng: 121.0831646 },
  restriction: {
    latLngBounds: {
      north: 14.36,
      south: 14.2483,
      east: 121.12,
      west: 121.032490
    },
    strictBounds: true
  },
  minZoom: 11,
  maxZoom: 21
};

interface CityMapProps {
  userInput: UserInput;
  places: Record<string, SearchResult[]>;
  itinerary: Record<number, string>;
  selectedDay: number | null;
  loading: boolean;
  setItinerary: (itinerary: Record<number, string>) => void;
  setPlaces: (places: Record<string, SearchResult[]>) => void;
  setLoading: (loading: boolean) => void;
}

function MapWrapper({ userInput, places, itinerary, selectedDay, loading, setItinerary, setPlaces, setLoading }: CityMapProps) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (map && placesLib) {
      generateItinerary(userInput).then(result => {
        setItinerary(result.itinerary);
        setPlaces(result.searchResults.fullData);
        setLoading(false);
      });
    }
  }, [map, placesLib, userInput, setItinerary, setPlaces, setLoading]);

  return null;
}

const CityMap = (props: CityMapProps) => {
  const [selectedPlace, setSelectedPlace] = useState<SearchResult | null>(null);

  return (
    <div className='relative h-full w-full rounded-2xl overflow-hidden'>
      <Map
        {...MAP_CONFIG}
        gestureHandling="greedy"
        disableDefaultUI={true}
        style={{ width: '100%', height: '100%' }}
      >
        <MapWrapper {...props} />
        <MapContent
          places={props.places}
          itinerary={props.itinerary}
          userInput={props.userInput}
          selectedDay={props.selectedDay}
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
          loading={props.loading}
        />
      </Map>
      {selectedPlace && (
        <div className='absolute top-4 left-4 bottom-4 z-10 animate-in slide-in-from-left duration-300'>
          <PlaceInfoPanel
            place={selectedPlace}
            onClose={() => setSelectedPlace(null)}
          />
        </div>
      )}
    </div>
  );
};

export default CityMap;
