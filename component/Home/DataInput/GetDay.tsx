import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface GetDayProps {
  days: number;
  setDays: (days: number) => void;
}

export default function GetDay({ days, setDays }: GetDayProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-5 sm:h-6 bg-linear-to-b from-amber-500 to-orange-500 rounded-full"></div>
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900">
          How many days?
        </h2>
      </div>
      
      <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 p-5 sm:p-6 lg:p-8 bg-linear-to-br from-orange-50/80 to-amber-50/80 rounded-xl sm:rounded-2xl border border-orange-200/50">
        <button
          onClick={() => setDays(Math.max(1, days - 1))}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-slate-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 flex items-center justify-center group shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
        >
          <FaChevronLeft className="text-slate-600 group-hover:text-orange-600 transition-colors text-sm sm:text-base" />
        </button>
        
        <div className="text-center min-w-20 sm:min-w-25">
          <div className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-linear-to-br from-amber-600 to-orange-600 bg-clip-text text-transparent">
            {days}
          </div>
          <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            {days === 1 ? 'Day' : 'Days'}
          </div>
        </div>
        
        <button
          onClick={() => setDays(Math.min(7, days + 1))}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-slate-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 flex items-center justify-center group shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
        >
          <FaChevronRight className="text-slate-600 group-hover:text-orange-600 transition-colors text-sm sm:text-base" />
        </button>
      </div>
    </div>
  )
}
