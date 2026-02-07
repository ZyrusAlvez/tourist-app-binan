'use client';

import { useState, useEffect } from 'react';
import { processMessage, ChatResponse } from '@/services/chatService';
import { usePlaces } from '@/context/PlacesContext';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBox = () => {
  const { setSelectedPlaces } = usePlaces();
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<'initial' | 'hotel' | 'done'>('initial');
  const [isLoading, setIsLoading] = useState(false);
  const placesLib = useMapsLibrary('places');
  const isGoogleMapsReady = placesLib && window.google?.maps?.places?.Place;

  // Add initial message when Google Maps is ready
  useEffect(() => {
    if (isGoogleMapsReady && messages.length === 0) {
      setMessages([{
        id: '1',
        text: 'Are you a local or a tourist?',
        isBot: true,
        timestamp: new Date()
      }]);
    }
  }, [isGoogleMapsReady, messages.length]);

  const addMessage = (text: string, isBot: boolean) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date()
    }]);
  };

  const handleInitialChoice = (choice: 'tourist' | 'local') => {
    addMessage(choice === 'tourist' ? 'Tourist' : 'Local', false);
    
    if (choice === 'tourist') {
      setTimeout(() => {
        addMessage('Will you be staying at a hotel?', true);
        setStep('hotel');
      }, 500);
    } else {
      setStep('done');
      searchPlaces('searching for local spots');
    }
  };

  const handleHotelChoice = (choice: 'yes' | 'no') => {
    addMessage(choice === 'yes' ? 'Yes' : 'No', false);
    setStep('done');
    
    if (choice === 'yes') {
      searchPlaces('searching for hotel');
    }
  };

  const searchPlaces = async (query: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      addMessage('Searching...', true);
    }, 500);

    try {
      const response: ChatResponse = await processMessage(query, undefined, []);
      
      if (response.places) {
        setSelectedPlaces(response.places);
      }
      
      setTimeout(() => {
        addMessage('Check the map for results!', true);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      addMessage('Sorry, there was an error. Please refresh the page.', true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800">Binan Places Assistant</h2>
        <p className="text-sm text-gray-500">Find cafes, restaurants, and attractions</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-end">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl ${
                message.isBot
                  ? 'bg-white text-gray-800 border border-gray-200'
                  : 'bg-blue-500 text-white'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        
        {step === 'initial' && (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => handleInitialChoice('tourist')}
              disabled={!isGoogleMapsReady || isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Tourist
            </button>
            <button
              onClick={() => handleInitialChoice('local')}
              disabled={!isGoogleMapsReady || isLoading}
              className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Local
            </button>
          </div>
        )}
        
        {step === 'hotel' && (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => handleHotelChoice('yes')}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Yes
            </button>
            <button
              onClick={() => handleHotelChoice('no')}
              disabled={isLoading}
              className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              No
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            disabled={step !== 'done'}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            disabled={step !== 'done'}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        {!isGoogleMapsReady && (
          <p className="text-sm text-gray-500 text-center mt-2">Loading map...</p>
        )}
      </div>
    </div>
  );
};

export default ChatBox;