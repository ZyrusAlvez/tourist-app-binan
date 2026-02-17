import Header from "@/component/Home/GetStarted/Header";
import Background from "@/component/Layout/Background";

const page = () => {
  return (
    <div className="min-h-screen">
      <Background />
      <Header />
      <div className="h-16"/>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight moon-dance mb-4">
            BIYAHENG BIÑAN
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-light">
            A Web-Based Travel Guide Planner for Local Exploration and Tourism
          </p>
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Objectives</h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              To fulfill its purpose of improving travel efficiency and tourist engagement in Biñan City, this capstone project outlines the following objectives:
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <span className="text-gray-400 font-medium shrink-0">a.</span>
              <p className="text-gray-700 leading-relaxed">
                Design and develop a centralized, web-based travel guide planner intended to assist both residents and tourists in efficiently exploring the City of Biñan;
              </p>
            </div>
            
            <div className="flex gap-4">
              <span className="text-gray-400 font-medium shrink-0">b.</span>
              <p className="text-gray-700 leading-relaxed">
                Optimize tourist routes by determining the most practical and efficient sequence of destinations to minimize travel time, transportation expenses, and unnecessary detours;
              </p>
            </div>
            
            <div className="flex gap-4">
              <span className="text-gray-400 font-medium shrink-0">c.</span>
              <p className="text-gray-700 leading-relaxed">
                Generate personalized travel itineraries based on user preferences, such as interests, budget constraints, and available time, thereby enhancing user engagement and satisfaction;
              </p>
            </div>
            
            <div className="flex gap-4">
              <span className="text-gray-400 font-medium shrink-0">d.</span>
              <p className="text-gray-700 leading-relaxed">
                Provide organized, accessible, and data-driven travel information that promotes informed and convenient travel planning; and
              </p>
            </div>
            
            <div className="flex gap-4">
              <span className="text-gray-400 font-medium shrink-0">e.</span>
              <p className="text-gray-700 leading-relaxed">
                Promote local tourism and advocate for sustainable and responsible travel within Biñan City through technology-driven solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page