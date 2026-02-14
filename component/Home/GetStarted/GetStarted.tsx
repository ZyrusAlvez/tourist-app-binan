import ButtonStarted from "../../UI/ButtonStarted"
import Header from "@/component/Home/GetStarted/Header";

interface GetStartedProps {
  onGetStarted: () => void;
}

const GetStarted = ({ onGetStarted }: GetStartedProps) => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center space-y-6 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight moon-dance ">
            BIYAHENG BIÑAN
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed mb-24">
            Web-Based Travel Guide Planner for Local Exploration and Tourism
          </h2>
          <ButtonStarted onClick={onGetStarted}>Get Started</ButtonStarted>
        </div>
      </div>
    </>
  )
}

export default GetStarted