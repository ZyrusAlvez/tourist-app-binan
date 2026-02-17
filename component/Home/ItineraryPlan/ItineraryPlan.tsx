'use client';

import { useState, useEffect } from 'react';
import { UserInput } from '@/type/itinerary';
import CityMap from './CityMap/CityMap';
import Dashboard from './Dashboard';
import { SearchResult } from '@/services/searchService';
import Loading from '@/component/UI/Loading';
import PlaceInfoPanel from './PlaceInfoPanel';

interface ItineraryPlanProps {
  userInput: UserInput;
}

const ItineraryPlan = ({ userInput }: ItineraryPlanProps) => {
  const [itinerary, setItinerary] = useState<Record<number, string>>({});
  const [places, setPlaces] = useState<Record<string, SearchResult[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<SearchResult | null>(null);

  useEffect(() => {
    if (Object.keys(itinerary).length > 0 && selectedDay === null) {
      setSelectedDay(1);
    }
  }, [itinerary, selectedDay]);

  return (
    <>
      <div className='relative h-screen w-full p-4 md:p-6'>
        <div className='flex flex-col lg:flex-row gap-4 h-full'>
          <div className='flex-1 min-h-125 lg:min-h-0 rounded-2xl overflow-hidden shadow-xl relative'>
            <CityMap 
              userInput={userInput}
              places={places}
              itinerary={itinerary}
              selectedDay={selectedDay}
              loading={loading}
              setItinerary={setItinerary}
              setPlaces={setPlaces}
              setLoading={setLoading}
              selectedPlace={selectedPlace}
              setSelectedPlace={setSelectedPlace}
            />
          </div>
          <div className='lg:w-96 min-h-75 lg:min-h-0 rounded-2xl overflow-hidden shadow-xl'>
            <Dashboard 
              itinerary={itinerary} 
              loading={false}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              places={places}
              onPlaceClick={setSelectedPlace}
            />
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