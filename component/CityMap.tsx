'use client';

import { useState, useEffect, useRef } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import CityPolygon from './CityMap/cityPolygon';
import { usePlaces } from '@/context/PlacesContext';
import { SearchResult } from '@/services/searchService';
import PlaceInfoPanel from './PlaceInfoPanel';

const MapContent = ({ selectedPlace, setSelectedPlace }: { selectedPlace: SearchResult | null; setSelectedPlace: (place: SearchResult | null) => void }) => {
  const { selectedPlaces, focusedPlace, focusTrigger, setInputFromMap } = usePlaces();
  const map = useMap();

  useEffect(() => {
    if (focusedPlace && map && focusTrigger > 0) {
      map.setCenter(focusedPlace.location);
      map.setZoom(16);
      setSelectedPlace(focusedPlace);
    }
  }, [focusTrigger]);

  return (
    <>
      <CityPolygon />
      {selectedPlaces.map((place, index) => (
        <AdvancedMarker
          key={`${place.displayName}-${index}`}
          position={place.location}
          onClick={() => {
            setSelectedPlace(place);
            setInputFromMap(place.displayName);
          }}
        />
      ))}
    </>
  );
};

const MapComponent = () => {
  const { selectedPlaces, focusedPlace, focusTrigger } = usePlaces();
  const [selectedPlace, setSelectedPlace] = useState<SearchResult | null>(null);

  return (
    <div className='flex h-screen'>
      {selectedPlace && (
        <PlaceInfoPanel 
          place={selectedPlace} 
          onClose={() => {
            console.log('Closing panel');
            setSelectedPlace(null);
          }} 
        />
      )}
      
      <div className='flex-1'>
        <Map
          mapId="2d9f2830304c482319b65b18"
          defaultZoom={12}
          defaultCenter={{ lat: 14.3145578, lng: 121.0831646 }}
          gestureHandling="greedy"
          disableDefaultUI={true}
          restriction={{
            latLngBounds: {
              north: 14.36,
              south: 14.2483,
              east: 121.12,
              west: 121.032490
            },
            strictBounds: true
          }}
          minZoom={11}
          maxZoom={21}
          style={{ width: '100%', height: '100%' }}
        >
          <MapContent selectedPlace={selectedPlace} setSelectedPlace={setSelectedPlace} />
        </Map>
      </div>
    </div>
  );
};

export default MapComponent;
