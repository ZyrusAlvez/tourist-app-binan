'use client';

import { AdvancedMarker } from '@vis.gl/react-google-maps';
import CityPolygon from './cityPolygon';
import { SearchResult } from '@/services/searchService';
import Image from 'next/image';

interface MapContentProps {
  places: Record<string, SearchResult[]>;
  selectedPlace: SearchResult | null;
  setSelectedPlace: (place: SearchResult | null) => void;
  loading: boolean;
}

const MapContent = ({ places, selectedPlace, setSelectedPlace, loading }: MapContentProps) => {
  if (loading) return <CityPolygon />;

  const handleMarkerClick = (place: SearchResult) => {
    setSelectedPlace(place);
  };

  return (
    <>
      <CityPolygon />
      {Object.entries(places).map(([category, categoryPlaces]) =>
        categoryPlaces.map((place, index) => (
          <AdvancedMarker
            key={`${place.displayName}-${index}`}
            position={place.location}
            onClick={() => handleMarkerClick(place)}
          >
            <div className='bg-white rounded-full p-1 shadow-lg border-2 border-orange-500'>
              <Image
                src={`/place_type/${category}.png`}
                alt={category}
                width={24}
                height={24}
              />
            </div>
          </AdvancedMarker>
        ))
      )}
    </>
  );
};

export default MapContent;
