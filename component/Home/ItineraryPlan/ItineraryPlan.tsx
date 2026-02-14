'use client';

import { useState } from 'react';
import { UserInput } from '@/type/itinerary';
import CityMap from './CityMap/CityMap';
import Dashboard from './Dashboard';
import { SearchResult } from '@/services/searchService';
import Loading from '@/component/UI/Loading';

interface ItineraryPlanProps {
  userInput: UserInput;
}

const ItineraryPlan = ({ userInput }: ItineraryPlanProps) => {
  const [itinerary, setItinerary] = useState<Record<number, string>>({});
  const [places, setPlaces] = useState<Record<string, SearchResult[]>>({});
  const [loading, setLoading] = useState(true);

  return (
    <>
      <div className='relative h-screen w-full p-4 md:p-6'>
        <div className='flex flex-col lg:flex-row gap-4 h-full'>
          <div className='flex-1 rounded-2xl overflow-hidden shadow-xl'>
            <CityMap 
              userInput={userInput}
              places={places} 
              loading={loading}
              setItinerary={setItinerary}
              setPlaces={setPlaces}
              setLoading={setLoading}
            />
          </div>
          <div className='lg:w-96 rounded-2xl overflow-hidden shadow-xl'>
            <Dashboard itinerary={itinerary} loading={false} />
          </div>
        </div>
        {loading && (
          <div className='absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl'>
            <Loading />
          </div>
        )}
      </div>
    </>
  );
};

export default ItineraryPlan;