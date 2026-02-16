import React from 'react'
import { DAY_COLORS } from './constants'

interface DashboardProps {
  itinerary: Record<number, string>;
  loading: boolean;
  selectedDay: number | null;
  setSelectedDay: (day: number | null) => void;
}

const Dashboard = ({ itinerary, selectedDay, setSelectedDay }: DashboardProps) => {
  return (
    <div className='h-full bg-white flex flex-col'>
      <h2 className='text-lg md:text-xl font-semibold px-4 md:px-6 py-4 text-gray-800 sticky top-0 bg-white z-10'>Your Itinerary</h2>
      <div className='space-y-3 px-4 md:px-6 pb-4 overflow-y-auto flex-1'>
        {Object.entries(itinerary).map(([day, plan], index) => {
          const dayColor = DAY_COLORS[index % DAY_COLORS.length];
          const dayNum = parseInt(day);
          const isSelected = selectedDay === dayNum;
          
          return (
            <div 
              key={day}
              onClick={() => setSelectedDay(isSelected ? null : dayNum)}
              className='rounded-lg p-3 md:p-4 cursor-pointer transition-all duration-200 hover:shadow-md'
              style={{ 
                borderLeft: `6px solid ${dayColor}`,
                backgroundColor: isSelected ? `${dayColor}30` : `${dayColor}15`,
                transform: isSelected ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div className='flex items-center gap-2 mb-2'>
                <div 
                  className='w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md'
                  style={{ backgroundColor: dayColor }}
                >
                  {day}
                </div>
                <h3 className='font-semibold text-sm md:text-base text-gray-800'>Day {day}</h3>
                {isSelected && (
                  <div className='ml-auto text-xs text-gray-500'>✓ Selected</div>
                )}
              </div>
              <div className='text-xs md:text-sm text-gray-600 whitespace-pre-line leading-relaxed pl-10'>{plan}</div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Dashboard