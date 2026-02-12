'use client';

import { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { PlacesProvider } from '@/context/PlacesContext';
import ChatBox from '../component/ChatBox';

import GetStarted from '@/component/Scene/GetStarted';
import DataInput from '@/component/Home/DataInput';
import CityMap from '@/component/CityMap';
import { UserInput } from '@/component/Home/DataInput';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const Page = () => {
  const [started, setStarted] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [userInput, setUserInput] = useState<UserInput | null>(null);

  const handleGenerate = (input: UserInput) => {
    setUserInput(input);
    setShowMap(true);
  };

  return (
    <div className='h-screen'>
      {!started ? (
        <GetStarted onGetStarted={() => setStarted(true)} />
      ) : !showMap ? (
        <DataInput onGenerate={handleGenerate} />
      ) : (
        <APIProvider apiKey={API_KEY}>
          <PlacesProvider>
            <div className="flex h-screen">
              <div className="w-[60%]">
                <CityMap userInput={userInput!} />
              </div>
            </div>
          </PlacesProvider>
        </APIProvider>
      )}
    </div>
  )
}

export default Page
