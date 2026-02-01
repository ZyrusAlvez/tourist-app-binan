'use client';

import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

interface CircleData {
  lat: number;
  lng: number;
  radius: number;
}

const CircleDrawer = () => {
  const map = useMap();
  
  // circle data
  const circles: CircleData[] = [
    { lat: 14.329163, lng: 121.042645, radius: 500 },
    { lat: 14.333255, lng: 121.050816, radius: 500 },
    
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