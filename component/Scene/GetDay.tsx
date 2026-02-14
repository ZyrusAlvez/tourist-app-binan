'use client'
import React, { useState, useRef } from 'react'

const GetDay = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7]
  const [rotation, setRotation] = useState(0)
  const startPos = useRef(0)
  const currentRotation = useRef(0)

  const middleNumber = Math.round(rotation / 51.4) + 1

  const handleStart = (pos: number) => {
    startPos.current = pos
    currentRotation.current = rotation
  }

  const handleMove = (pos: number) => {
    const delta = startPos.current - pos
    const newRotation = currentRotation.current + delta * 0.5
    const maxRotation = (numbers.length - 1) * 51.4
    setRotation(Math.max(0, Math.min(maxRotation, newRotation)))
  }

  const handleEnd = () => {
    const nearest = Math.round(rotation / 51.4) * 51.4
    setRotation(nearest)
  }

  return (
    <>
      <div className="h-16" />
      <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center flex-col gap-12 px-4 py-12'>
        {/* Header */}
        <div className="text-center space-y-4 max-w-xl">
          <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Plan Your Adventure
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium">
            How many days will you explore?
          </p>
        </div>

        {/* Mobile/Tablet - Vertical */}
        <div className="lg:hidden backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-8 w-full max-w-sm">
          <div className="relative">
            {/* Center indicator line */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-full h-0.5 bg-linear-to-r from-transparent via-orange-400 to-transparent" />
            </div>
            
            {/* Fade overlays */}
            <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-40 bg-linear-to-b from-white/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-white/80 to-transparent" />
            </div>
            
            <div 
              className="relative w-32 h-80 cursor-grab active:cursor-grabbing select-none mx-auto"
              style={{ perspective: '1000px' }}
              onMouseDown={(e) => handleStart(e.clientY)}
              onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientY)}
              onMouseUp={handleEnd}
              onTouchStart={(e) => handleStart(e.touches[0].clientY)}
              onTouchMove={(e) => handleMove(e.touches[0].clientY)}
              onTouchEnd={handleEnd}
            >
              <div 
                className="relative w-full h-full transition-transform duration-300 ease-out"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${rotation}deg)`
                }}
              >
                {numbers.map((num, i) => {
                  const itemAngle = -i * 51.4 + rotation
                  const normalizedAngle = ((itemAngle % 360) + 360) % 360
                  const isBackFacing = normalizedAngle > 90 && normalizedAngle < 270
                  const hide = (middleNumber === 1 && num === 7) || (middleNumber === 7 && num === 1)
                  
                  const distanceFromCenter = Math.abs(i - Math.round(rotation / 51.4))
                  const opacity = hide || isBackFacing ? 0 : Math.max(0.15, 1 - distanceFromCenter * 0.35)
                  const scale = distanceFromCenter === 0 ? 1.1 : Math.max(0.7, 1 - distanceFromCenter * 0.2)
                  
                  return (
                    <div
                      key={num}
                      className="absolute inset-0 flex items-center justify-center font-bold transition-all duration-200"
                      style={{
                        transform: `rotateX(${-i * 51.4}deg) translateZ(150px) scale(${scale})`,
                        opacity: opacity,
                        fontSize: distanceFromCenter === 0 ? '5rem' : '4rem',
                        color: distanceFromCenter === 0 ? '#f97316' : '#9ca3af',
                        fontWeight: distanceFromCenter === 0 ? '800' : '700'
                      }}
                    >
                      {num}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop - Horizontal */}
        <div className="hidden lg:block backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-12 w-full max-w-3xl">
          <div className="relative">
            {/* Center indicator line */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-0.5 h-full bg-linear-to-b from-transparent via-orange-400 to-transparent" />
            </div>
            
            {/* Fade overlays */}
            <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-48 bg-linear-to-r from-white/80 to-transparent" />
              <div className="absolute top-0 right-0 bottom-0 w-48 bg-linear-to-l from-white/80 to-transparent" />
            </div>
            
            <div 
              className="relative w-full h-40 cursor-grab active:cursor-grabbing select-none"
              style={{ perspective: '1200px' }}
              onMouseDown={(e) => handleStart(e.clientX)}
              onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
              onMouseUp={handleEnd}
              onTouchStart={(e) => handleStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleMove(e.touches[0].clientX)}
              onTouchEnd={handleEnd}
            >
              <div 
                className="relative w-full h-full transition-transform duration-300 ease-out"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${-rotation}deg)`
                }}
              >
                {numbers.map((num, i) => {
                  const itemAngle = i * 51.4 - rotation
                  const normalizedAngle = ((itemAngle % 360) + 360) % 360
                  const isBackFacing = normalizedAngle > 90 && normalizedAngle < 270
                  const hide = (middleNumber === 1 && num === 7) || (middleNumber === 7 && num === 1)
                  
                  const distanceFromCenter = Math.abs(i - Math.round(rotation / 51.4))
                  const opacity = hide || isBackFacing ? 0 : Math.max(0.15, 1 - distanceFromCenter * 0.35)
                  const scale = distanceFromCenter === 0 ? 1.1 : Math.max(0.7, 1 - distanceFromCenter * 0.2)
                  
                  return (
                    <div
                      key={num}
                      className="absolute inset-0 flex items-center justify-center font-bold transition-all duration-200"
                      style={{
                        transform: `rotateY(${i * 51.4}deg) translateZ(180px) scale(${scale})`,
                        opacity: opacity,
                        fontSize: distanceFromCenter === 0 ? '6rem' : '4.5rem',
                        color: distanceFromCenter === 0 ? '#f97316' : '#9ca3af',
                        fontWeight: distanceFromCenter === 0 ? '800' : '700'
                      }}
                    >
                      {num}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="text-center space-y-6">
          <div className="flex items-baseline justify-center gap-3">
            <span className="text-6xl md:text-7xl font-bold bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              {middleNumber}
            </span>
            <span className="text-3xl md:text-4xl text-gray-600 font-medium">
              {middleNumber === 1 ? 'day' : 'days'}
            </span>
          </div>
          
          <button className="group relative px-10 py-4 bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <span className="relative z-10">Create My Itinerary</span>
            <div className="absolute inset-0 bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </>
  )
}

export default GetDay