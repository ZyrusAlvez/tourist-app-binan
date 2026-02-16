'use client';

import { useEffect, useState } from 'react';
import { AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import CityPolygon from './cityPolygon';
import { SearchResult } from '@/services/searchService';
import { UserInput } from '@/type/itinerary';
import { DAY_COLORS } from '../constants';

interface MapContentProps {
  places: Record<string, SearchResult[]>;
  itinerary: Record<number, string>;
  userInput: UserInput;
  selectedDay: number | null;
  selectedPlace: SearchResult | null;
  setSelectedPlace: (place: SearchResult | null) => void;
  loading: boolean;
}

const MapContent = ({ places, itinerary, userInput, selectedDay, selectedPlace, setSelectedPlace, loading }: MapContentProps) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const [directionsRenderers, setDirectionsRenderers] = useState<google.maps.DirectionsRenderer[]>([]);

  useEffect(() => {
    if (!map || !routesLib || loading || !Object.keys(itinerary).length || !Object.keys(places).length) return;

    directionsRenderers.forEach(renderer => renderer.setMap(null));

    const directionsService = new google.maps.DirectionsService();
    const newRenderers: google.maps.DirectionsRenderer[] = [];

    // Flatten all places into a single array
    const allPlaces = Object.values(places).flat();

    Object.entries(itinerary).forEach(([day, plan], dayIndex) => {
      const dayNum = parseInt(day);
      
      // Only show route for selected day
      if (selectedDay !== dayNum) return;

      const mentionedPlaces = plan.match(/\* ([^–\-\n]+)/g)?.map(m => m.replace('* ', '').trim()) || [];
      
      const dayPlaces: SearchResult[] = [];
      mentionedPlaces.forEach(mentioned => {
        const found = allPlaces.find(place => {
          const placeName = place.displayName.toLowerCase();
          const mentionedName = mentioned.toLowerCase();
          return placeName.includes(mentionedName) || mentionedName.includes(placeName);
        });
        if (found && !dayPlaces.includes(found)) {
          dayPlaces.push(found);
        }
      });

      console.log(`Day ${day} places:`, dayPlaces.map(p => p.displayName));

      if (dayPlaces.length < 2) return;

      const waypoints = dayPlaces.slice(1, -1).map(place => ({
        location: place.location,
        stopover: true
      }));

      const travelMode = userInput.transportationMode === 'walk' ? 'WALKING' :
                        userInput.transportationMode === 'bike' ? 'BICYCLING' :
                        userInput.transportationMode === 'transit' ? 'TRANSIT' : 'DRIVING';

      directionsService.route({
        origin: dayPlaces[0].location,
        destination: dayPlaces[dayPlaces.length - 1].location,
        waypoints,
        travelMode: google.maps.TravelMode[travelMode as keyof typeof google.maps.TravelMode],
      }, (result, status) => {
        if (status === 'OK' && result) {
          const renderer = new google.maps.DirectionsRenderer({
            map,
            directions: result,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: DAY_COLORS[dayIndex % DAY_COLORS.length],
              strokeWeight: 6,
              strokeOpacity: 0.9
            }
          });
          newRenderers.push(renderer);
        }
      });
    });

    setDirectionsRenderers(newRenderers);

    return () => {
      newRenderers.forEach(renderer => renderer.setMap(null));
    };
  }, [map, routesLib, places, itinerary, userInput, selectedDay, loading]);

  const handleMarkerClick = (place: SearchResult) => {
    setSelectedPlace(place);
  };

  return (
    <>
      <CityPolygon />
      {!loading && Object.entries(places).map(([category, categoryPlaces]) =>
        categoryPlaces.map((place, index) => {
          // Check if this place is in the selected day's itinerary
          if (selectedDay !== null) {
            const dayPlan = itinerary[selectedDay];
            if (!dayPlan) return null;
            
            const mentionedPlaces = dayPlan.match(/\* ([^–\-\n]+)/g)?.map(m => m.replace('* ', '').trim()) || [];
            const isInSelectedDay = mentionedPlaces.some(mentioned => {
              const placeName = place.displayName.toLowerCase();
              const mentionedName = mentioned.toLowerCase();
              return placeName.includes(mentionedName) || mentionedName.includes(placeName);
            });
            
            if (!isInSelectedDay) return null;
          }
          
          return (
            <AdvancedMarker
              key={`${category}-${place.displayName}-${index}`}
              position={place.location}
              onClick={() => handleMarkerClick(place)}
            >
              <div className='bg-white rounded-full p-1 shadow-lg border-2 border-orange-500 cursor-pointer hover:scale-110 transition-transform'>
                <img
                  src={`/place_type/${category}.png`}
                  alt={category}
                  width={24}
                  height={24}
                  className='w-6 h-6'
                />
              </div>
            </AdvancedMarker>
          );
        })
      )}
    </>
  );
};

export default MapContent;
