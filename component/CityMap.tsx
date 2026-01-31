'use client';

import { useEffect } from 'react';
import { cityBoundary } from "@/component/CityMap/boundary"
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const BinanPolygon = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    
    const polygon = new google.maps.Polygon({
      paths: cityBoundary,
      strokeColor: '#4285F4',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#4285F4',
      fillOpacity: 0.2
    });

    polygon.setMap(map);

    return () => polygon.setMap(null);
  }, [map]);

  return null;
};

const MapComponent = () => (
  <APIProvider apiKey={API_KEY}>
    <Map
      defaultZoom={12}
      defaultCenter={{ lat: 14.3145578, lng: 121.0831646 }}
      gestureHandling={'greedy'}
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
      maxZoom={17}
      style={{ width: '100%', height: '100vh' }}>
      <BinanPolygon />
    </Map>
  </APIProvider>
);

export default MapComponent;