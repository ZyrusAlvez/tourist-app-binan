'use client';

import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

interface CircleData {
  lat: number;
  lng: number;
  radius: number;
  useValidator: boolean;
}

const CircleDrawer = () => {
  const map = useMap();
  
  // circle data
  const circles: CircleData[] = [
    { lat: 14.334475, lng: 121.075635, radius: 4000, useValidator: true },
    { lat: 14.276063, lng: 121.058724, radius: 4000, useValidator: true },
  ];


  useEffect(() => {
    if (!map) return;
    
    circles.forEach(circle => {
      new google.maps.Circle({
        map,
        center: { lat: circle.lat, lng: circle.lng },
        radius: circle.radius,
        fillColor: '#FF6B6B',
        fillOpacity: 0.3,
        strokeColor: '#FF6B6B',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        clickable: false
      });
    });
  }, [map]);

  return null;
};

export default CircleDrawer;