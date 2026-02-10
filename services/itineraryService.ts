import { searchByPreferences, SimplifiedPlace } from "./searchService";
import { UserData } from "@/component/ChatBox";
import groq from '@/lib/groq';

export async function generateItinerary(userData: UserData) {
    const searchResults = await searchByPreferences(userData.placeTypes);
    const itinerary = await itineraryPlanner(userData, searchResults.simpleData);
    console.log({ searchResults, itinerary })
    return { searchResults, itinerary };
}

async function generateDayPlan(
  dayNumber: number,
  userData: UserData,
  simplifiedData: Record<string, SimplifiedPlace[]>
): Promise<string> {
  const lodgingContext = userData.lodging 
    ? `The user is staying at ${userData.lodging.displayName} (${userData.lodging.location.lat}, ${userData.lodging.location.lng}). Prioritize places closer to this lodging.`
    : 'The user has no specific lodging. Plan routes efficiently.';

  const placesContext = Object.entries(simplifiedData)
    .map(([category, places]) => `${category}: ${places.map(p => `${p.displayName} (${p.location.lat}, ${p.location.lng})`).join(', ')}`)
    .join('\n');

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are an expert itinerary planner for Binan, Laguna. Create a detailed plan for Day ${dayNumber} covering morning to evening. ${lodgingContext}`
      },
      {
        role: 'user',
        content: `Create a Day ${dayNumber} itinerary using these places:\n\n${placesContext}\n\nProvide a complete plan from morning to evening with specific places and times.`
      }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 2048,
  });

  return completion.choices[0]?.message?.content || 'Unable to generate plan.';
}

async function itineraryPlanner(
    userData: UserData,
    simplifiedData: Record<string, SimplifiedPlace[]>
): Promise<Record<number, string>> {
  try {
    const itinerary: Record<number, string> = {};

    for (let day = 1; day <= userData.days; day++) {
      itinerary[day] = await generateDayPlan(day, userData, simplifiedData);
    }

    return itinerary;
  } catch (error) {
    console.error('Itinerary planner error:', error);
    return {};
  }
}