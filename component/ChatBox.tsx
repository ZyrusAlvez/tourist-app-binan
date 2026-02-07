'use client';

import { useState, useRef } from 'react';
import { processMessage, ChatResponse } from '@/services/chatService';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help you find places in Binan.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>();
  const pendingSearchRef = useRef<string | undefined>(undefined);
  
  // Wait for Google Maps to load
  const placesLib = useMapsLibrary('places');
  const isGoogleMapsReady = placesLib && window.google?.maps?.places?.Place;

  const requestLocation = () => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Geolocation is not supported by this browser. Please use Chrome or Firefox.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    // Check if we're on HTTPS (required by some browsers)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Location access requires HTTPS. Please use a secure connection.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(newLocation);
        
        const successMessage: Message = {
          id: Date.now().toString(),
          text: 'Location access granted! Searching nearby places...',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
        
        // Add typing indicator
        const typingMessage: Message = {
          id: 'typing',
          text: 'typing',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, typingMessage]);
        
        // Automatically retry the pending search with location
        if (pendingSearchRef.current) {
          console.log('Retrying search with location:', pendingSearchRef.current, newLocation);
          try {
            const currentConversationHistory = messages.slice(1).map(msg => ({
              role: msg.isUser ? 'user' as const : 'assistant' as const,
              content: msg.text
            }));
            
            const response: ChatResponse = await processMessage(pendingSearchRef.current, newLocation, currentConversationHistory);
            console.log('Search completed:', response);
            // Remove typing indicator and add response
            setMessages(prev => {
              const filtered = prev.filter(msg => msg.id !== 'typing');
              return [...filtered, {
                id: (Date.now() + 2).toString(),
                text: response.message,
                isUser: false,
                timestamp: new Date()
              }];
            });
          } catch (error) {
            console.error('Search error:', error);
            // Remove typing indicator and add error
            setMessages(prev => {
              const filtered = prev.filter(msg => msg.id !== 'typing');
              return [...filtered, {
                id: (Date.now() + 2).toString(),
                text: 'Sorry, there was an error with your search. Please try again.',
                isUser: false,
                timestamp: new Date()
              }];
            });
          }
          pendingSearchRef.current = undefined;
        } else {
          console.log('No pending search to retry');
        }
      },
      (error) => {
        console.error('Location error:', error);
        let errorText = 'Unable to get your location. ';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorText += 'Please allow location access in your browser settings and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorText += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorText += 'Location request timed out. Please try again.';
            break;
          default:
            errorText += 'Please enable location services and try again.';
        }
        
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: errorText,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.slice(1).map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));
      
      const response: ChatResponse = await processMessage(input, userLocation, conversationHistory);
      console.log('Chat response:', response);
      
      if (response.requiresLocation) {
        console.log('Location required, showing message and requesting location');
        console.log('Setting pendingSearch to:', input);
        pendingSearchRef.current = input; // Store the original search
        const locationMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, locationMessage]);
        setIsLoading(false);
        requestLocation();
        return;
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800">Binan Places Assistant</h2>
        <p className="text-sm text-gray-500">Find cafes, restaurants, and attractions</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              {message.text === 'typing' ? (
                <div className="flex items-center space-x-1 py-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about places in Binan..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className={`px-6 py-2 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;