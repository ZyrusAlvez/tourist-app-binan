'use client';

import { useEffect } from 'react';
import { cityBoundary } from "@/component/CityMap/boundary";
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const BinanPolygon = () => {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google) return;

    // Draw the city polygon (just outline or transparent)
    const cityPolygon = new google.maps.Polygon({
      paths: cityBoundary,
      strokeColor: '#4285F4',  // optional: border color
      strokeOpacity: 0.8,      // optional: border opacity
      strokeWeight: 2,         // optional: border width
      fillOpacity: 0,          // no fill, shows default map
      zIndex: 10
    });
    cityPolygon.setMap(map);


    // Outer polygon matching map restriction bounds
    const outer = [
      { lat: 14.36, lng: 121.032490 }, // NW
      { lat: 14.36, lng: 121.12 },     // NE
      { lat: 14.2483, lng: 121.12 },   // SE
      { lat: 14.2483, lng: 121.032490 } // SW
    ];

    // Mask polygon with city polygon as hole
    const maskPolygon = new google.maps.Polygon({
      paths: [
        outer,                           // filled area
        cityBoundary.slice().reverse()   // hole
      ],
      strokeOpacity: 0,
      fillColor: '#000',
      fillOpacity: 0.8,
      clickable: false,
      zIndex: 5, // below city polygon
    });
    maskPolygon.setMap(map);

    return () => {
      cityPolygon.setMap(null);
      maskPolygon.setMap(null);
    };
  }, [map]);

  return null;
};

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
      maxZoom={17}
      style={{ width: '100%', height: '100vh' }}
    >
      <BinanPolygon />
    </Map>
  </APIProvider>
);

export default MapComponent;
