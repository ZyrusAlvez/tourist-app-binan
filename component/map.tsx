'use client';

import React from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const MapComponent = () => (
  <APIProvider
    solutionChannel='GMP_devsite_samples_v3_rgmbasicmap'
    apiKey={API_KEY}>
    <Map
      defaultZoom={12}
      defaultCenter={{ lat: 14.3145578, lng: 121.0831646 }}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      restriction={{
        latLngBounds: {
          north: 14.35,
          south: 14.28,
          east: 121.12,
          west: 121.04
        },
        strictBounds: true
      }}
      minZoom={11}
      maxZoom={16}
      style={{ width: '100%', height: '100vh' }}
    />
  </APIProvider>
);

export default MapComponent;