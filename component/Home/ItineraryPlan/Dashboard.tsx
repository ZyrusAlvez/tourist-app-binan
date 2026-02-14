import React from 'react'

interface DashboardProps {
  itinerary: Record<number, string>;
  loading: boolean;
}

const Dashboard = ({ itinerary }: DashboardProps) => {
  return (
    <div className='w-96 bg-gray-100 p-4 overflow-y-auto'>
      <h2 className='text-xl font-bold mb-4'>Itinerary Plan</h2>
      <div className='space-y-4'>
        {Object.entries(itinerary).map(([day, plan]) => (
          <div key={day} className='bg-white rounded-lg p-4 shadow'>
            <h3 className='font-bold text-lg mb-2'>Day {day}</h3>
            <div className='text-sm text-gray-700 whitespace-pre-line'>{plan}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard