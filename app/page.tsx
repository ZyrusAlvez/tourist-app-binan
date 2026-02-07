import CityMap from '../component/CityMap';
import ChatBox from '../component/ChatBox';

const Page = () => {
  return (
    <div className="flex h-screen">
      <div className="w-[60%]">
        <CityMap />
      </div>
      <div className="w-[40%]">
        <ChatBox />
      </div>
    </div>  
  )
}

export default Page