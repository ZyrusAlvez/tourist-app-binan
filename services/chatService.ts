import groq from '@/lib/groq';
import { identifyIntent, SearchIntent } from './intentService';
import { searchAllPlaces, searchNearPlaces, SearchResponse, SearchResult } from './searchService';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  searchResults?: SearchResponse;
  requiresLocation?: boolean;
  intent: SearchIntent;
  places?: SearchResult[];
}

export async function sendMessage(messages: ChatMessage[]): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant for finding places in Binan, Laguna, Philippines. Help users discover cafes, restaurants, tourist attractions, parks, and museums. Keep responses concise and friendly.'
        },
        ...messages
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';
  } catch (error) {
    console.error('Chat service error:', error);
    return 'Sorry, there was an error processing your request. Please try again.';
  }
}

export async function processMessage(
  userMessage: string, 
  userLocation?: { lat: number; lng: number },
  conversationHistory?: ChatMessage[]
): Promise<ChatResponse> {
  try {
    const intent = await identifyIntent(userMessage, conversationHistory);
    console.log('Detected intent:', intent);
    
    if (intent.type === 'clarification') {
      return {
        message: intent.clarificationQuestion || 'Could you please clarify what you\'re looking for?',
        intent
      };
    }

    if (intent.type === 'search_places' && intent.includedTypes) {
      console.log('Running places search...', intent.includedTypes);
      const places = intent.nearby 
        ? await searchNearPlaces(intent.includedTypes, userLocation, intent.radius)
        : await searchAllPlaces(intent.includedTypes);
      
      const chatResponse = await sendMessage([
        { role: 'user', content: `I found ${places.length} ${intent.includedTypes.join(', ')} in ${intent.nearby ? 'nearby area' : 'Binan city'}. Generate a friendly, conversational response about these results.` }
      ]);
      
      return {
        message: chatResponse,
        searchResults: { places, message: `Found ${places.length} places` },
        intent,
        places
      };
    }

    if (intent.type === 'recommendation' && intent.includedTypes) {
      console.log('Running recommendation search...', intent.includedTypes);
      const places = intent.nearby 
        ? await searchNearPlaces(intent.includedTypes, userLocation, intent.radius)
        : await searchAllPlaces(intent.includedTypes);
      
      const topPlaces = places.slice(0, 5);
      const chatResponse = await sendMessage([
        { role: 'user', content: `Based on ratings, recommend these top ${intent.includedTypes.join(', ')} in Binan: ${topPlaces.map(p => `${p.displayName} (${p.rating || 'N/A'} stars)`).join(', ')}. Give a friendly recommendation message.` }
      ]);
      
      return {
        message: chatResponse,
        searchResults: { places: topPlaces, message: `Top ${topPlaces.length} recommendations` },
        intent,
        places: topPlaces
      };
    }

    // Default chat response with conversation history
    console.log('Using default chat response for intent:', intent.type);
    const messages: ChatMessage[] = [
      ...(conversationHistory ? conversationHistory.slice(-6) : []), // Last 6 messages for context
      { role: 'user', content: userMessage }
    ];
    const chatResponse = await sendMessage(messages);
    return {
      message: chatResponse,
      intent
    };
  } catch (error) {
    console.error('Process message error:', error);
    return {
      message: 'Sorry, there was an error processing your request. Please try again.',
      intent: { type: 'clarification', nearby: false, confidence: 0.1 }
    };
  }
}