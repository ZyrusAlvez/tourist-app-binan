'use client';

import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import CityPolygon from './CityMap/cityPolygon';
import { usePlaces } from '@/context/PlacesContext';

const MapComponent = () => {
  const { selectedPlaces } = usePlaces();

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
          />
        ))}
      </Map>
    </div>
  );
};

export default MapComponent;
