import { isPointInPolygon } from '@/utility/validator';

export interface SearchResult {
  id: string;
  displayName: string;
  location: { lat: number; lng: number };
  types: string[];
  rating?: number;
  userRatingCount?: number;
}

export interface SearchResponse {
  places: SearchResult[];
  message: string;
  requiresLocation?: boolean;
}

const CITY_GRID = [
  { lat: 14.334475, lng: 121.075635, radius: 4000, useValidator: true },
  { lat: 14.276063, lng: 121.058724, radius: 4000, useValidator: true },
];

export async function searchAllPlaces(includedTypes: string[]): Promise<SearchResult[]> {
  if (typeof window === 'undefined' || !window.google?.maps?.places?.Place) {
    console.log('Google Maps not available');
    return [];
  }

  const allPlaces: SearchResult[] = [];

  for (const point of CITY_GRID) {
    try {
      const response = await window.google.maps.places.Place.searchNearby({
        locationRestriction: {
          center: { lat: point.lat, lng: point.lng },
          radius: point.radius,
        },
        includedTypes,
        maxResultCount: 20,
        fields: ['id', 'displayName', 'location', 'types', 'rating', 'userRatingCount'],
        rankPreference: window.google.maps.places.SearchNearbyRankPreference.POPULARITY,
      });


      const filteredPlaces = response.places
        ?.filter(place => {
          if (!place.location) return false;
          return point.useValidator ? isPointInPolygon({
            lat: place.location.lat(),
            lng: place.location.lng()
          }) : true;
        })
        .map(place => ({
          id: place.id!,
          displayName: place.displayName || '',
          location: {
            lat: place.location!.lat(),
            lng: place.location!.lng()
          },
          types: place.types || [],
          rating: place.rating || undefined,
          userRatingCount: place.userRatingCount || undefined
        })) || [];

      allPlaces.push(...filteredPlaces);
    } catch (error) {
      console.error('Places search failed for point:', point, error);
    }
  }

  console.log(allPlaces);
  allPlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return allPlaces
}

export async function searchNearPlaces(
  includedTypes: string[],
  userLocation?: { lat: number; lng: number },
  radius: number = 1000
): Promise<SearchResult[]> {
  console.log('searchNearPlaces called with:', { includedTypes, userLocation, radius });
  
  if (!userLocation) {
    console.log('No user location provided');
    return [];
  }

  if (typeof window === 'undefined' || !window.google?.maps?.places?.Place) {
    console.log('Google Maps not available for nearby search');
    return [];
  }

  console.log('Starting nearby search...');
  const allPlaces: SearchResult[] = [];

  try {
    console.log('Making Google Places API call...');
    const response = await window.google.maps.places.Place.searchNearby({
      locationRestriction: {
        center: { lat: userLocation.lat, lng: userLocation.lng },
        radius,
      },
      includedTypes,
      maxResultCount: 20,
      fields: ['id', 'displayName', 'location', 'types', 'rating', 'userRatingCount'],
      rankPreference: window.google.maps.places.SearchNearbyRankPreference.DISTANCE,
    });

    console.log('Google Places API response:', response);

    const places = response.places
      ?.filter(place => {
        if (!place.location) return false;
        return isPointInPolygon({
          lat: place.location.lat(),
          lng: place.location.lng()
        });
      })
      .map(place => ({
        id: place.id!,
        displayName: place.displayName || '',
        location: {
          lat: place.location!.lat(),
          lng: place.location!.lng()
        },
        types: place.types || [],
        rating: place.rating || undefined,
        userRatingCount: place.userRatingCount || undefined
      })) || [];

    console.log('Filtered places:', places.length);
    allPlaces.push(...places);
  } catch (error) {
    console.error('Nearby search failed:', error);
  }

  console.log('Returning nearby search results:', allPlaces.length);
  allPlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return allPlaces;
}