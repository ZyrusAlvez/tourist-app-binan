import groq from '@/lib/groq';

export interface SearchIntent {
  type: 'search_places' | 'chat' | 'clarification';
  nearby: boolean;
  includedTypes?: string[];
  radius?: number;
  clarificationQuestion?: string;
  confidence: number;
}

const PLACE_TYPES = [
  'accounting', 'acai_shop', 'afghani_restaurant', 'african_restaurant', 'american_restaurant',
  'asian_restaurant', 'attraction', 'atm', 'auditorium', 'bakery', 'banquet_hall', 'bar',
  'bar_and_grill', 'beauty_salon', 'betting_shop', 'botanical_garden', 'bowling_alley',
  'brewery', 'breakfast_spot', 'buffet', 'butcher', 'cafe', 'car_dealer', 'car_rental',
  'car_repair', 'car_wash', 'casino', 'childrens_camp', 'chinese_restaurant', 'church',
  'civic_building', 'clothing_store', 'coffee_shop', 'convenience_store', 'corporate_office',
  'cosmetics_store', 'dance_hall', 'dentist', 'department_store', 'diner', 'discount_store',
  'doctor', 'drugstore', 'electrician', 'electronics_store', 'embassy', 'event_venue',
  'farm', 'fast_food', 'ferry_terminal', 'fire_station', 'florist', 'food_court',
  'funeral_home', 'furniture_store', 'garden', 'gas_station', 'general_contractor',
  'grocery_or_supermarket', 'gym', 'hair_care', 'hardware_store', 'health', 'historic_site',
  'hospital', 'insurance_agency', 'internet_cafe', 'italian_restaurant', 'jewelry_store',
  'library', 'lodging', 'meal_delivery', 'meal_takeaway', 'medical_center', 'movie_theater',
  'museum', 'night_club', 'park', 'parking', 'pet_store', 'pharmacy', 'physiotherapist',
  'plumber', 'police', 'post_office', 'primary_school', 'real_estate_agency', 'restaurant',
  'roofing_contractor', 'rv_park', 'secondary_school', 'shoe_store', 'shopping_mall', 'spa',
  'stadium', 'storage', 'store', 'subway_station', 'supermarket', 'tourist_attraction',
  'train_station', 'transit_station', 'travel_agency', 'university', 'veterinary_care', 'zoo'
];

export class IntentService {
  static async identifyIntent(userMessage: string): Promise<SearchIntent> {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an intent classifier for a Binan, Laguna tourism app. Analyze user messages and return ONLY a JSON object with this structure:

{
  "type": "search_places" | "chat" | "clarification",
  "nearby": boolean,
  "includedTypes": string[],
  "radius": number,
  "clarificationQuestion": string,
  "confidence": number (0-1)
}

Rules:
- "search_places": when user wants any place types (restaurants, cafes, hotels, attractions, etc.)
- "chat": for general questions, recommendations, or information about places/city
- "clarification": when intent is unclear, include clarificationQuestion
- "nearby": true if user mentions "nearby", "near me", "close", etc.
- "includedTypes": map user intent to these exact types: ${PLACE_TYPES.slice(0, 20).join(', ')}... (use relevant ones)
- "radius": default 1000 for nearby searches
- "confidence": how confident you are (0.1-1.0)

Examples:
"find nearby restaurants" → {"type":"search_places","nearby":true,"includedTypes":["restaurant"],"radius":1000,"confidence":0.9}
"hotels in binan" → {"type":"search_places","nearby":false,"includedTypes":["lodging"],"confidence":0.95}
"what's good to eat here?" → {"type":"chat","nearby":false,"confidence":0.8}`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
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
}