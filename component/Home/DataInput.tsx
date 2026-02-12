'use client'

import { useState, useRef } from 'react'
import { FaWalking, FaBiking, FaCar, FaBus, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { IoSparkles } from "react-icons/io5"

const TRANSPORT_MODES = [
  { id: 'walk', label: 'Walk', icon: FaWalking },
  { id: 'bike', label: 'Bike', icon: FaBiking },
  { id: 'drive', label: 'Drive', icon: FaCar },
  { id: 'transit', label: 'Transit', icon: FaBus }
]

const PREFERENCE_TO_PLACE_TYPES: Record<string, string[]> = {
  'Hotels': ['lodging', 'campground'],
  'Restaurants': ['restaurant'],
  'Museums': ['museum', 'art_gallery', 'library'],
  'Coffee Shops': ['cafe', 'bakery'],
  'Shopping Centers': ['shopping_mall', 'department_store', 'clothing_store'],
  'Place of Worship': ['church', 'mosque', 'hindu_temple', 'synagogue'],
  'Attractions': ['tourist_attraction', 'amusement_park', 'zoo', 'aquarium'],
  'Local Stops': ['store', 'convenience_store', 'supermarket', 'park', 'shopping_mall']
}

export interface UserInput {
  transportationMode: string;
  days: number;
  placeTypes: Record<string, string[]>;
}

export default function DataInput() {
  const [days, setDays] = useState(1)
  const [transport, setTransport] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  
  const userInputRef = useRef<UserInput>({
    transportationMode: '',
    days: 0,
    placeTypes: {}
  })
  
  const categoryOptions = Object.keys(PREFERENCE_TO_PLACE_TYPES)
  const isComplete = days > 0 && transport && categories.length > 0

  const toggleCategory = (cat: string) => {
    setCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const handleGenerate = () => {
    const selectedPlaceTypes = categories.reduce((acc, cat) => {
      acc[cat] = PREFERENCE_TO_PLACE_TYPES[cat]
      return acc
    }, {} as Record<string, string[]>)

    userInputRef.current = {
      transportationMode: transport,
      days,
      placeTypes: selectedPlaceTypes
    }

    console.log('User Input:', JSON.stringify(userInputRef.current, null, 2))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
      <div className="h-16" />
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          
          {/* Days Selection */}
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
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-slate-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 flex items-center justify-center group shadow-sm hover:shadow-md active:scale-95"
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
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-slate-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 flex items-center justify-center group shadow-sm hover:shadow-md active:scale-95"
              >
                <FaChevronRight className="text-slate-600 group-hover:text-orange-600 transition-colors text-sm sm:text-base" />
              </button>
            </div>
          </div>

          {/* Transportation Mode & Preferred Category */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Transportation Mode */}
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
                      className={`relative p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 group ${
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

            {/* Preferred Category */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 sm:h-6 bg-linear-to-b from-amber-500 to-orange-500 rounded-full"></div>
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900">
                  Preferred Category
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {categoryOptions.map((cat) => {
                  const isSelected = categories.includes(cat)
                  
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 transition-all duration-200 text-xs sm:text-sm font-medium ${
                        isSelected
                          ? 'border-orange-400 bg-linear-to-br from-orange-50 to-amber-50 text-orange-700 shadow-md shadow-orange-500/20 scale-[1.02]'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-sm active:scale-[0.98]'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            disabled={!isComplete}
            onClick={handleGenerate}
            className={`w-full py-3.5 sm:py-4 lg:py-5 rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 ${
              isComplete
                ? 'bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 active:scale-[0.98]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <IoSparkles className={`text-lg sm:text-xl ${isComplete ? 'animate-pulse' : ''}`} />
            Generate Itinerary
          </button>
          
          {!isComplete && (
            <p className="text-center text-xs sm:text-sm text-slate-600 -mt-2 sm:-mt-3">
              Please complete all selections to continue
            </p>
          )}
        </div>
      </div>
    </div>
  )
}