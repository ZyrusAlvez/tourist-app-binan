'use client';

import { useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { isPointInPolygon } from '@/utility/validator';

const PlacesGridSearch = () => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  
  const searchGrid = [
    { lat: 14.329352, lng: 121.041579, radius: 500, useValidator: true }
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
            rankPreference: google.maps.places.SearchNearbyRankPreference.POPULARITY,
          });

          const filteredPlaces = response.places
            .filter(place => {
              if (!place.location) return false;
              if (!point.useValidator) return true;
              return isPointInPolygon({
                lat: place.location.lat(),
                lng: place.location.lng()
              });
            })
            .map(place => ({
              name: place.displayName,
              location: place.location,
              types: place.types,
              rating: place.rating,
              userRatingCount: place.userRatingCount,
            }));

          allPlaces.push(...filteredPlaces);

          console.log(filteredPlaces);
        } catch (error) {
          console.error('Places search failed:', error);
        }
      }
    })();
  }, [map, placesLib]);

  return null;
};

export default PlacesGridSearch;