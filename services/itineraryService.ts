import { searchByPreferences, SimplifiedPlace } from "./searchService";
import { UserData } from "@/component/ChatBox";
import groq from '@/lib/groq';

// Helper: flatten all places used so far
function flattenVisitedPlaces(itinerary: Record<number, string>): string[] {
  return Object.values(itinerary)
    .flatMap(dayPlan => {
      // Extract place names from previous day's plan (simple regex for "* Place Name")
      const matches = dayPlan.match(/\* ([^\n]+)/g);
      return matches?.map(m => m.replace('* ', '').trim()) || [];
    });
}

// Generate a single day plan
async function generateDayPlan(
  dayNumber: number,
  userData: UserData,
  simplifiedData: Record<string, SimplifiedPlace[]>,
  visitedPlaces: string[]
): Promise<string> {
  const lodgingContext = userData.lodging 
    ? `The user is staying at ${userData.lodging.displayName}. Prioritize places closer to this lodging.`
    : 'The user has no specific lodging. Plan routes efficiently.';

  // Filter out already visited places
  const filteredPlacesContext = Object.entries(simplifiedData)
    .map(([category, places]) => {
      const remaining = places.filter(p => !visitedPlaces.includes(p.displayName));
      return `${category}: ${remaining.map(p => p.displayName).join(', ')}`;
    })
    .filter(line => line.split(': ')[1] !== '') // remove empty categories
    .join('\n');

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are an expert itinerary planner for Biñan, Laguna. Create a detailed plan for Day ${dayNumber}, covering morning, lunch, afternoon, and evening. Avoid repeating any places already visited: ${visitedPlaces.join(', ')}. ${lodgingContext}. Prioritize user preferences: Places of Worship, Museums, Coffee Shops, Local Stops. Format the itinerary in a readable way, like:

Morning (8:00 AM – 12:00 PM)
* Place 1 – description
* Place 2 – description

Lunch (12:00 PM – 1:30 PM)
* Place – description

Afternoon (1:30 PM – 5:00 PM)
* Place 3 – description

Evening (5:00 PM – 9:00 PM)
* Place 4 – description

Do NOT include raw coordinates.`
      },
      {
        role: 'user',
        content: `Here are the places you can use:\n${filteredPlacesContext}`
      }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 2048,
  });

  return completion.choices[0]?.message?.content || 'Unable to generate plan.';
}

// Main planner for multiple days
export async function itineraryPlanner(
  userData: UserData,
  simplifiedData: Record<string, SimplifiedPlace[]>
): Promise<Record<number, string>> {
  try {
    const itinerary: Record<number, string> = {};

    for (let day = 1; day <= userData.days; day++) {
      const visitedPlaces = flattenVisitedPlaces(itinerary); // track used places
      const dayPlan = await generateDayPlan(day, userData, simplifiedData, visitedPlaces);
      itinerary[day] = dayPlan;
    }

    return itinerary;
  } catch (error) {
    console.error('Itinerary planner error:', error);
    return {};
  }
}

// Main entry function
export async function generateItinerary(userData: UserData) {
  const searchResults = await searchByPreferences(userData.placeTypes);
  const itinerary = await itineraryPlanner(userData, searchResults.simpleData);
  console.log({ searchResults, itinerary });
  return { searchResults, itinerary };
}
