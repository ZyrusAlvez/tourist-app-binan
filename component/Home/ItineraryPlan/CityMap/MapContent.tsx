'use client';

import { AdvancedMarker } from '@vis.gl/react-google-maps';
import CityPolygon from './cityPolygon';
import { SearchResult } from '@/services/searchService';

interface MapContentProps {
  places: Record<string, SearchResult[]>;
  selectedPlace: SearchResult | null;
  setSelectedPlace: (place: SearchResult | null) => void;
  loading: boolean;
}

const MapContent = ({ places, selectedPlace, setSelectedPlace, loading }: MapContentProps) => {
  const handleMarkerClick = (place: SearchResult) => {
    setSelectedPlace(place);
  };

  return (
    <>
      <CityPolygon />
      {!loading && Object.entries(places).map(([category, categoryPlaces]) =>
        categoryPlaces.map((place, index) => (
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
        ))
      )}
    </>
  );
};

export default MapContent;
