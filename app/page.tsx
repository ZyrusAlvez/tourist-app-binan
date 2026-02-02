import MapComponent from '../component/CityMap';
import ChatBox from '../component/ChatBox';

const page = () => {
  return (
    <div className='flex'>
      <MapComponent />
      <ChatBox />
    </div>
  )
}

export default page