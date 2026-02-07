'use client';

import { useState } from 'react';
import { Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import CityPolygon from './CityMap/cityPolygon';
import { usePlaces } from '@/context/PlacesContext';

const MapComponent = () => {
  const { selectedPlaces } = usePlaces();
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  return (
    <div className='flex'>
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
        style={{ width: '100%', height: '100vh' }}
      >
        <CityPolygon />
        {selectedPlaces.map((place) => (
          <AdvancedMarker
            key={place.id}
            position={place.location}
            onClick={() => setSelectedMarker(place.id)}
          />
        ))}
        
        {selectedMarker && (
          <InfoWindow
            position={selectedPlaces.find(p => p.id === selectedMarker)?.location}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <h3 className="font-semibold text-gray-900 mb-1">
                {selectedPlaces.find(p => p.id === selectedMarker)?.displayName}
              </h3>
              {selectedPlaces.find(p => p.id === selectedMarker)?.rating && (
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-yellow-500">★</span>
                  <span className="text-gray-700">
                    {selectedPlaces.find(p => p.id === selectedMarker)?.rating}
                  </span>
                  {selectedPlaces.find(p => p.id === selectedMarker)?.userRatingCount && (
                    <span className="text-gray-500">
                      ({selectedPlaces.find(p => p.id === selectedMarker)?.userRatingCount})
                    </span>
                  )}
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
