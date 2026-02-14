'use client';

import { useState } from 'react';
import { UserInput } from '@/type/itinerary';
import CityMap from './CityMap/CityMap';
import Dashboard from './Dashboard';
import { SearchResult } from '@/services/searchService';

interface ItineraryPlanProps {
  userInput: UserInput;
}

const ItineraryPlan = ({ userInput }: ItineraryPlanProps) => {
  const [itinerary, setItinerary] = useState<Record<number, string>>({});
  const [places, setPlaces] = useState<Record<string, SearchResult[]>>({});
  const [loading, setLoading] = useState(true);

  return (
    <>
      <div className="h-16" />
      <div className='flex h-screen w-full'>
        <CityMap 
          userInput={userInput}
          places={places} 
          loading={loading}
          setItinerary={setItinerary}
          setPlaces={setPlaces}
          setLoading={setLoading}
        />
        <Dashboard itinerary={itinerary} loading={loading} />
      </div>
    </>
  );
};

export default ItineraryPlan;