import groq from '@/lib/groq';

export interface SearchIntent {
  type: 'search_places' | 'chat' | 'clarification' | 'recommendation';
  nearby: boolean;
  includedTypes?: string[];
  radius?: number;
  clarificationQuestion?: string;
  confidence: number;
}

export const PLACE_TYPES = [
  'accounting', 'airport', 'amusement_park', 'aquarium', 'art_gallery', 'atm',
  'bakery', 'bank', 'bar', 'beauty_salon', 'bicycle_store', 'book_store',
  'bowling_alley', 'bus_station', 'cafe', 'campground', 'car_dealer',
  'car_rental', 'car_repair', 'car_wash', 'casino', 'cemetery', 'church',
  'city_hall', 'clothing_store', 'convenience_store', 'courthouse', 'dentist',
  'department_store', 'doctor', 'drugstore', 'electrician', 'electronics_store',
  'embassy', 'fire_station', 'florist', 'funeral_home', 'furniture_store',
  'gas_station', 'gym', 'hair_care', 'hardware_store', 'hindu_temple', 'hospital',
  'insurance_agency', 'jewelry_store', 'laundry', 'lawyer', 'library',
  'light_rail_station', 'liquor_store', 'local_government_office', 'locksmith',
  'lodging', 'meal_delivery', 'mosque', 'movie_theater', 'moving_company',
  'museum', 'night_club', 'painter', 'park', 'parking', 'pet_store', 'pharmacy',
  'physiotherapist', 'plumber', 'police', 'post_office', 'primary_school',
  'real_estate_agency', 'restaurant', 'roofing_contractor', 'rv_park', 'school',
  'shoe_store', 'shopping_mall', 'spa', 'stadium', 'storage', 'store',
  'subway_station', 'supermarket', 'synagogue', 'taxi_stand', 'tourist_attraction',
  'train_station', 'transit_station', 'travel_agency', 'university',
  'veterinary_care', 'zoo'
];

export const PREFERENCE_TO_PLACE_TYPES: Record<string, string[]> = {
  'Restaurants': ['restaurant'],
  'Museums': ['museum', 'art_gallery', 'library'],
  'Coffee Shops': ['cafe', 'bakery'],
  'Shopping Centers': ['shopping_mall', 'department_store', 'clothing_store'],
  'Place of Worship': ['church', 'mosque', 'hindu_temple', 'synagogue'],
  'Attractions': ['tourist_attraction', 'amusement_park', 'zoo', 'aquarium'],
  'Local Stops': [
    'store',
    'convenience_store',
    'supermarket',
    'park',
    'shopping_mall'
  ]
};


export async function identifyIntent(userMessage: string, conversationHistory?: any[]): Promise<SearchIntent> {
  try {
    const messages = [
      {
        role: 'system',
        content: `You are an intent classifier for a Binan, Laguna tourism app. Analyze user messages and return ONLY a JSON object with this structure:

{
  "type": "search_places" | "chat" | "clarification" | "recommendation",
  "nearby": boolean,
  "includedTypes": string[],
  "radius": number,
  "clarificationQuestion": string,
  "confidence": number (0-1)
}

Rules:
- "search_places": when user wants any place types (restaurants, cafes, hotels, attractions, etc.)
- "recommendation": when user asks for suggestions, recommendations, or "what's good"
- "chat": for general questions or information about places/city
- "clarification": when intent is unclear, include clarificationQuestion
- "nearby": true if user mentions "nearby", "near me", "close", etc.
- "includedTypes": YOU MUST ONLY USE THESE EXACT STRINGS: ${PLACE_TYPES.join(', ')}. DO NOT CREATE NEW TYPES. DO NOT USE VARIATIONS.
- "radius": default 1000 for nearby searches
- "confidence": how confident you are (0.1-1.0)

CRITICAL: For includedTypes, you can ONLY choose from the exact list above. If user asks for something not in the list, use "clarification" type instead.

CONTEXT AWARENESS: Use conversation history to understand what the user is referring to. If they say "near me" after discussing restaurants, assume they want restaurants nearby.

Common mappings (USE EXACT STRINGS FROM LIST):
- "restaurant", "resto", "food", "dining" → ["restaurant"]
- "hotel", "accommodation", "stay" → ["lodging"]
- "cafe", "coffee shop", "coffee" → ["cafe"]
- "attraction", "tourist spot", "sightseeing" → ["tourist_attraction"]
- "park", "garden" → ["park"]
- "museum" → ["museum"]
- "gas station", "fuel" → ["gas_station"]
- "store", "shop" → ["store"]
- "water station", "water refill" → USE "clarification" (not available)

Examples:
"find nearby restaurants" → {"type":"search_places","nearby":true,"includedTypes":["restaurant"],"radius":1000,"confidence":0.9}
"hotels in binan" → {"type":"search_places","nearby":false,"includedTypes":["lodging"],"confidence":0.95}
"recommend a good restaurant" → {"type":"recommendation","nearby":false,"includedTypes":["restaurant"],"confidence":0.9}
"what's good to eat here?" → {"type":"recommendation","nearby":false,"includedTypes":["restaurant"],"confidence":0.85}
"near me" (after discussing restaurants) → {"type":"search_places","nearby":true,"includedTypes":["restaurant"],"radius":1000,"confidence":0.8}`
      },
      ...(conversationHistory ? conversationHistory.slice(-4) : []), // Last 4 messages for context
      {
        role: 'user',
        content: userMessage
      }
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from Groq');

    return JSON.parse(response.trim());
  } catch (error) {
    console.error('Intent identification error:', error);
    return {
      type: 'clarification',
      nearby: false,
      clarificationQuestion: 'Could you please clarify what you\'re looking for? I can help you find places or answer questions about Binan.',
      confidence: 0.1
    };
  }
}