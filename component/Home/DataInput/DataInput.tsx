'use client'

import { useState, useRef } from 'react'
import { IoSparkles } from "react-icons/io5"
import GetDay from './GetDay'
import GetTransportation from './GetTransportation'
import GetCategory, { PREFERENCE_TO_PLACE_TYPES } from './GetCategory'
import { UserInput } from '@/type/itinerary'

interface DataInputProps {
  onGenerate: (userInput: UserInput) => void;
}

export default function DataInput({ onGenerate }: DataInputProps) {
  const [days, setDays] = useState(1)
  const [transport, setTransport] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  
  const userInputRef = useRef<UserInput>({
    transportationMode: '',
    days: 0,
    placeTypes: {}
  })
  
  const isComplete = days > 0 && transport && categories.length > 0

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
    
    onGenerate(userInputRef.current)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          
          <GetDay days={days} setDays={setDays} />

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            <GetTransportation transport={transport} setTransport={setTransport} />
            <GetCategory categories={categories} setCategories={setCategories} />
          </div>

          <button
            disabled={!isComplete}
            onClick={handleGenerate}
            className={`w-full py-3.5 sm:py-4 lg:py-5 rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 ${
              isComplete
                ? 'bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 active:scale-[0.98] cursor-pointer'
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