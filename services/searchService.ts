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

export class SearchService {
  static async searchAllPlaces(includedTypes: string[]): Promise<SearchResponse> {
    console.log('searchAllPlaces called with:', includedTypes);
    
    if (typeof window === 'undefined' || !window.google?.maps?.places?.Place) {
      console.log('Google Maps not available');
      return {
        places: [],
        message: "Google Maps is loading. Please try again in a moment."
      };
    }

    console.log('Google Maps available, starting search...');
    const allPlaces: SearchResult[] = [];

    for (const point of CITY_GRID) {
      console.log('Searching point:', point);
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

        console.log('Search response:', response);

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

        console.log('Filtered places:', filteredPlaces.length);
        allPlaces.push(...filteredPlaces);
      } catch (error) {
        console.error('Places search failed for point:', point, error);
      }
    }

    console.log('Total places found:', allPlaces.length);
    return {
      places: allPlaces,
      message: `Found ${allPlaces.length} ${includedTypes.join(', ')} in Binan`
    };
  }

  static async searchNearPlaces(
    includedTypes: string[],
    userLocation?: { lat: number; lng: number },
    radius: number = 1000
  ): Promise<SearchResponse> {
    console.log('searchNearPlaces called with:', { includedTypes, userLocation, radius });
    
    if (!userLocation) {
      console.log('No user location provided');
      return {
        places: [],
        message: "I need your location to find nearby places. Please allow location access.",
        requiresLocation: true
      };
    }

    if (typeof window === 'undefined' || !window.google?.maps?.places?.Place) {
      console.log('Google Maps not available for nearby search');
      return {
        places: [],
        message: "Google Maps is loading. Please try again in a moment."
      };
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
    return {
      places: allPlaces,
      message: `Found ${allPlaces.length} ${includedTypes.join(', ')} nearby`
    };
  }
}