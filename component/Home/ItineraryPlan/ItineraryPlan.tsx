'use client';

import { UserInput } from '@/type/itinerary';
import CityMap from './CityMap/CityMap';
import Dashboard from './Dashboard';

interface ItineraryPlanProps {
  userInput: UserInput;
}

const ItineraryPlan = ({ userInput }: ItineraryPlanProps) => {
  return (
    <div className='flex h-screen w-full'>
      <CityMap userInput={userInput} />
      <Dashboard />
    </div>
  );
};

export default ItineraryPlan;