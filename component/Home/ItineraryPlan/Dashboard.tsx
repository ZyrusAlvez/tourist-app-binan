import React from 'react'

interface DashboardProps {
  itinerary: Record<number, string>;
  loading: boolean;
}

const Dashboard = ({ itinerary }: DashboardProps) => {
  return (
    <div className='h-full bg-white flex flex-col'>
      <h2 className='text-lg md:text-xl font-semibold p-4 pb-0 text-gray-800 sticky top-0 bg-white z-10'>Your Itinerary</h2>
      <div className='space-y-3 p-4 pt-4 overflow-y-auto flex-1'>
        {Object.entries(itinerary).map(([day, plan]) => (
          <div key={day} className='border-l-4 border-orange-400 bg-orange-50/50 rounded-r-lg p-3 md:p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <div className='w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm font-bold'>
                {day}
              </div>
              <h3 className='font-semibold text-sm md:text-base text-gray-800'>Day {day}</h3>
            </div>
            <div className='text-xs md:text-sm text-gray-600 whitespace-pre-line leading-relaxed pl-10'>{plan}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard