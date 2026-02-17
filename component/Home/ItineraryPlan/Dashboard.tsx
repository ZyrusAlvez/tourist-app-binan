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
              <div className='pl-10 space-y-2.5'>
                {plan.split('\n').map((line, idx) => {
                  const trimmedLine = line.trim();
                  if (!trimmedLine) return null;
                  
                  const timeBlockMatch = trimmedLine.match(/^(Morning|Lunch|Afternoon|Evening|Dinner)\s*\(([^)]+)\)/i);
                  const placeMatch = trimmedLine.match(/^\*\s*([^–\-]+)\s*[–\-]\s*(.+)$/);
                  
                  if (timeBlockMatch) {
                    return (
                      <div key={idx} className='flex items-center gap-2 mt-3 first:mt-0'>
                        <div 
                          className='px-2 py-0.5 rounded text-xs font-semibold text-white'
                          style={{ backgroundColor: dayColor }}
                        >
                          {timeBlockMatch[2]}
                        </div>
                        <span className='text-xs font-semibold text-gray-700'>{timeBlockMatch[1]}</span>
                      </div>
                    );
                  }
                  
                  if (placeMatch) {
                    return (
                      <div key={idx} className='flex gap-2 items-start group pl-2'>
                        <div className='shrink-0 mt-1.5'>
                          <div className='w-1.5 h-1.5 rounded-full' style={{ backgroundColor: dayColor }}></div>
                        </div>
                        <div className='flex-1'>
                          <p className='text-sm font-semibold text-gray-800 group-hover:text-gray-900'>
                            {placeMatch[1].trim()}
                          </p>
                          <p className='text-xs text-gray-600 mt-0.5'>{placeMatch[2].trim()}</p>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <p key={idx} className='text-xs text-gray-600 leading-relaxed'>
                      {trimmedLine.replace(/^\*\s*/, '')}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Dashboard