'use client';

import { use, useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const PlacesGridSearch = () => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  
  const searchGrid = [
    { lat: 14.329163, lng: 121.042645, radius: 500 },
  ];

  useEffect(() => {
    if (!map || !placesLib || !google.maps.places.Place) return;

    (async () => {
      const allPlaces = [];

      for (const point of searchGrid) {
        try {
          const response = await google.maps.places.Place.searchNearby({
            locationRestriction: {
              center: { lat: point.lat, lng: point.lng },
              radius: point.radius,
            },
            includedTypes: [
              'cafe',
              'restaurant', 
              'tourist_attraction',
              'park',
              'museum',
            ],
            maxResultCount: 20,
            fields: [
              'id',
              'displayName',
              'location',
              'types',
              'rating',
              'userRatingCount',
            ],
          });

          allPlaces.push(...response.places);
        } catch (error) {
          console.error('Places search failed:', error);
        }
      }

      // Remove duplicates and sort by popularity
      const uniquePlaces = allPlaces.filter((place, index, self) => 
        index === self.findIndex(p => p.id === place.id)
      );

      const sortedPlaces = uniquePlaces
        .filter(place => place.rating && place.userRatingCount && place.location)
        .sort((a, b) => {
          const scoreA = (a.rating || 0) * Math.log(a.userRatingCount || 1);
          const scoreB = (b.rating || 0) * Math.log(b.userRatingCount || 1);
          return scoreB - scoreA;
        })
        .slice(0, 20);

      const circleData = sortedPlaces.map(place => ({
        lat: place.location!.lat(),
        lng: place.location!.lng(),
        name: place.displayName,
        rating: place.rating || "No Rating",
        userRatingCount: place.userRatingCount || 0,
        types: place.types || [],
      }));

      console.log('Places search results:', circleData);
    })();
  }, [map, placesLib]);

  return null;
};

export default PlacesGridSearch;