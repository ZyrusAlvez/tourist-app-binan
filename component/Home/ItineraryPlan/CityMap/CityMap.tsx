'use client';

import { useState } from 'react';
import { Map } from '@vis.gl/react-google-maps';
import { SearchResult } from '@/services/searchService';
import PlaceInfoPanel from '../PlaceInfoPanel';
import { UserInput } from '@/component/Home/DataInput';
import MapContent from './MapContent';

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

const CityMap = ({ userInput }: { userInput: UserInput }) => {
  const [selectedPlace, setSelectedPlace] = useState<SearchResult | null>(null);

  return (
    <>
      {selectedPlace && (
        <PlaceInfoPanel
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      <Map
        {...MAP_CONFIG}
        gestureHandling="greedy"
        disableDefaultUI={true}
        style={{ width: '100%', height: '100%' }}
      >
        <MapContent
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
          userInput={userInput}
        />
      </Map>
    </>
  );
};

export default CityMap;
