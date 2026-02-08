'use client';

import { useState, useEffect, useRef } from 'react';
import { processMessage, ChatResponse } from '@/services/chatService';
import { usePlaces } from '@/context/PlacesContext';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { SearchResult } from '@/services/searchService';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBox = () => {
  const { setSelectedPlaces, setFocusedPlace, triggerFocus, inputFromMap, setInputFromMap } = usePlaces();
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<'initial' | 'hotel' | 'done' | 'transitioning'>('initial');
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [lodgingOptions, setLodgingOptions] = useState<SearchResult[]>([]);
  const placesLib = useMapsLibrary('places');
  const isGoogleMapsReady = placesLib && window.google?.maps?.places?.Place;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedLodgingRef = useRef<{ displayName: string; location: { lat: number; lng: number } } | null>(null);
  const messageIdCounter = useRef(0);

  useEffect(() => {
    if (inputFromMap) {
      setInput(inputFromMap);
      setInputFromMap('');
    }
  }, [inputFromMap, setInputFromMap]);

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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (text: string, isBot: boolean) => {
    messageIdCounter.current += 1;
    setMessages(prev => [...prev, {
      id: `msg-${messageIdCounter.current}`,
      text,
      isBot,
      timestamp: new Date()
    }]);
  };

  const handleInitialChoice = (choice: 'tourist' | 'local') => {
    setStep('transitioning');
    addMessage(choice === 'tourist' ? 'Tourist' : 'Local', false);
    
    if (choice === 'tourist') {
      setTimeout(() => {
        addMessage('Will you be staying at a lodging?', true);
        setStep('hotel');
      }, 500);
    } else {
      setStep('done');
      searchPlaces('searching for local spots');
    }
  };

  const handleHotelChoice = async (choice: 'yes' | 'no') => {
    setStep('transitioning');
    addMessage(choice === 'yes' ? 'Yes' : 'No', false);
    
    if (choice === 'yes') {
      setStep('done');
      await searchPlaces('searching for hotel');
      addMessage('Please select your lodging from the options below and we will start your itinerary plan from there', true);
    } else {
      setStep('done');
    }
  };

  const handleLodgingSelect = (lodging: SearchResult) => {
    setFocusedPlace(lodging);
    triggerFocus();
    setInput(lodging.displayName);
  };

  const handleLodgingSubmit = () => {
    if (!input.trim()) return;
    const selected = lodgingOptions.find(l => l.displayName === input.trim());
    if (selected) {
      selectedLodgingRef.current = {
        displayName: selected.displayName,
        location: selected.location
      };
    }
    console.log('Selected Lodging:', selectedLodgingRef.current);
    addMessage(input.trim(), false);
    setInput('');
    setLodgingOptions([]);
    setStep('done');
  };

  const searchPlaces = async (query: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      addMessage('Searching...', true);
    }, 500);

    try {
      const conversationHistory = messages.slice(1).map(msg => ({
        role: msg.isBot ? 'assistant' as const : 'user' as const,
        content: msg.text
      }));
      
      const response: ChatResponse = await processMessage(query, undefined, conversationHistory);
      
      if (response.places) {
        setSelectedPlaces(response.places);
        
        if (query.includes('hotel')) {
          setLodgingOptions(response.places);
        }
      }
      
    } catch (error) {
      console.error('Error:', error);
      addMessage('Sorry, there was an error. Please refresh the page.', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    setInput('');
    addMessage(userInput, false);
    
    setIsLoading(true);
    setTimeout(() => {
      addMessage('Searching...', true);
    }, 500);

    try {
      const conversationHistory = messages.slice(1).map(msg => ({
        role: msg.isBot ? 'assistant' as const : 'user' as const,
        content: msg.text
      }));
      
      const response: ChatResponse = await processMessage(userInput, undefined, conversationHistory);
      
      if (response.places) {
        setSelectedPlaces(response.places);
      }
      
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.text !== 'Searching...'));
        addMessage(response.message, true);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.filter(m => m.text !== 'Searching...'));
      addMessage('Sorry, there was an error. Please try again.', true);
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="min-h-full flex flex-col justify-end space-y-4">
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
          
          {lodgingOptions.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-end">
              {lodgingOptions.map((lodging, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLodgingSelect(lodging)}
                  className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                >
                  {lodging.displayName}
                </button>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && lodgingOptions.length === 0 && handleSendMessage()}
            placeholder="Type a message..."
            disabled={(step !== 'done' && lodgingOptions.length === 0) || isLoading || lodgingOptions.length > 0}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={lodgingOptions.length > 0 ? handleLodgingSubmit : handleSendMessage}
            disabled={(step !== 'done' && lodgingOptions.length === 0) || isLoading || (lodgingOptions.length > 0 && !input.trim())}
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