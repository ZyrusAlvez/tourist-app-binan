'use client';

import { APIProvider } from '@vis.gl/react-google-maps';
import CityMap from '../component/CityMap';
import ChatBox from '../component/ChatBox';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const Page = () => {
  return (
    <APIProvider apiKey={API_KEY}>
      <div className="flex h-screen">
        <div className="w-[60%]">
          <CityMap />
        </div>
        <div className="w-[40%]">
          <ChatBox />
        </div>
      </div>
    </APIProvider>
  )
}

export default Page
