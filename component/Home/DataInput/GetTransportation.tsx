import { FaWalking, FaBiking, FaCar, FaBus } from 'react-icons/fa'

const TRANSPORT_MODES = [
  { id: 'walk', label: 'Walk', icon: FaWalking },
  { id: 'bike', label: 'Bike', icon: FaBiking },
  { id: 'drive', label: 'Drive', icon: FaCar },
  { id: 'transit', label: 'Transit', icon: FaBus }  
]

interface GetTransportationProps {
  transport: string;
  setTransport: (transport: string) => void;
}

export default function GetTransportation({ transport, setTransport }: GetTransportationProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-5 sm:h-6 bg-linear-to-b from-amber-500 to-orange-500 rounded-full"></div>
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900">
          Transportation Mode
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {TRANSPORT_MODES.map((mode) => {
          const Icon = mode.icon
          const isSelected = transport === mode.id
          
          return (
            <button
              key={mode.id}
              onClick={() => setTransport(mode.id)}
              className={`relative p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 group cursor-pointer ${
                isSelected
                  ? 'border-orange-400 bg-linear-to-br from-orange-50 to-amber-50 shadow-lg shadow-orange-500/20 scale-[1.02]'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md active:scale-[0.98]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              )}
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isSelected 
                    ? 'bg-linear-to-br from-amber-500 to-orange-500 shadow-lg shadow-orange-500/30' 
                    : 'bg-slate-100 group-hover:bg-slate-200'
                }`}>
                  <Icon className={`text-lg sm:text-xl ${isSelected ? 'text-white' : 'text-slate-700'}`} />
                </div>
                <span className={`text-xs sm:text-sm font-medium ${
                  isSelected ? 'text-orange-700' : 'text-slate-700'
                }`}>
                  {mode.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
