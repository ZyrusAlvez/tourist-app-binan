'use client';

import { APIProvider } from '@vis.gl/react-google-maps';
import { PlacesProvider } from '@/context/PlacesContext';
import CityMap from '../component/CityMap';
import ChatBox from '../component/ChatBox';

import GetStarted from '@/component/Scene/GetStarted';
import DataInput from '@/component/Home/DataInput';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const Page = () => {
  return (
    <div className='h-screen'>
      
      <DataInput />
      
      


      {/* <APIProvider apiKey={API_KEY}>
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
      </APIProvider> */}
    </div>
  )
}

export default Page
