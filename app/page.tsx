'use client';

import { APIProvider } from '@vis.gl/react-google-maps';
import { PlacesProvider } from '@/context/PlacesContext';
import CityMap from '../component/CityMap';
import ChatBox from '../component/ChatBox';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const Page = () => {
  return (
    <APIProvider apiKey={API_KEY}>
      <PlacesProvider>
        <div className="flex h-screen">
          <div className="w-[60%]">
            <CityMap />
          </div>
          <div className="w-[40%]">
            <ChatBox />
          </div>
        </div>
      </PlacesProvider>
    </APIProvider>
  )
}

export default Page
