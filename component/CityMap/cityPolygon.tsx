import { useMap } from '@vis.gl/react-google-maps';
import { cityBoundary } from './boundary';
import { useEffect } from 'react';

export default function CityPolygon() {
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