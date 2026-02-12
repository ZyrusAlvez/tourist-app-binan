'use client';

import { useEffect, useRef } from 'react';
import { AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import CityPolygon from './cityPolygon';
import { usePlaces } from '@/context/PlacesContext';
import { SearchResult } from '@/services/searchService';
import { UserInput } from '@/component/Home/DataInput';
import { generateItinerary } from '@/services/itineraryService';

interface MapContentProps {
  selectedPlace: SearchResult | null;
  setSelectedPlace: (place: SearchResult | null) => void;
  userInput: UserInput;
}

const MapContent = ({ selectedPlace, setSelectedPlace, userInput }: MapContentProps) => {
  const { selectedPlaces, focusedPlace, focusTrigger, setInputFromMap } = usePlaces();
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const hasLoadedItinerary = useRef(false);

  useEffect(() => {
    if (focusedPlace && map && focusTrigger > 0) {
      map.setCenter(focusedPlace.location);
      map.setZoom(16);
      setSelectedPlace(focusedPlace);
    }
  }, [focusTrigger, focusedPlace, map, setSelectedPlace]);

  useEffect(() => {
    if (map && placesLib && !hasLoadedItinerary.current) {
      hasLoadedItinerary.current = true;
      generateItinerary(userInput).then(result => {
        console.log('Itinerary Result:', result);
      });
    }
  }, [map, placesLib, userInput]);

  const handleMarkerClick = (place: SearchResult) => {
    setSelectedPlace(place);
    setInputFromMap(place.displayName);
  };

  return (
    <>
      <CityPolygon />
      {selectedPlaces.map((place, index) => (
        <AdvancedMarker
          key={`${place.displayName}-${index}`}
          position={place.location}
          onClick={() => handleMarkerClick(place)}
        />
      ))}
    </>
  );
};

export default MapContent;
