'use client';

import { APIProvider, Map } from '@vis.gl/react-google-maps';
import CityPolygon from './CityMap/cityPolygon';
import CircleDrawer from './CityMap/CircleDrawer';
import PlacesGridSearch from './CityMap/PlacesGridSearch';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const MapComponent = () => (
  <APIProvider apiKey={API_KEY}>
    <Map
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
      <CircleDrawer />
      <PlacesGridSearch />
    </Map>
  </APIProvider>
);

export default MapComponent;
