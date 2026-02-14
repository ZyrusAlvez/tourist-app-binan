import { searchByPreferences, SimplifiedPlace } from "./searchService";
import { UserInput } from "@/type/itinerary";
import groq from '@/lib/groq';

// Helper: Find closest hotel to other selected places
function findClosestHotel(
  hotels: SimplifiedPlace[],
  allPlaces: SimplifiedPlace[]
): SimplifiedPlace | undefined {
  if (!hotels.length || !allPlaces.length) return hotels[0];

  // Calculate average distance from each hotel to all other places
  const hotelScores = hotels.map(hotel => {
    const totalDistance = allPlaces.reduce((sum, place) => {
      const latDiff = hotel.location.lat - place.location.lat;
      const lngDiff = hotel.location.lng - place.location.lng;
      return sum + Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    }, 0);
    return { hotel, avgDistance: totalDistance / allPlaces.length };
  });

  // Return hotel with smallest average distance
  return hotelScores.sort((a, b) => a.avgDistance - b.avgDistance)[0].hotel;
}

// Helper: Extract place names from itinerary (first part before dash)
function flattenVisitedPlaces(itinerary: Record<number, string>): string[] {
  return Object.values(itinerary)
    .flatMap(dayPlan => {
      const matches = dayPlan.match(/\* ([^–\-\n]+)/g);
      return matches?.map(m => m.replace('* ', '').trim()) || [];
    });
}

// Generate a single day plan
async function generateDayPlan(
  dayNumber: number,
  userData: UserInput,
  simplifiedData: Record<string, SimplifiedPlace[]>,
  visitedPlaces: string[],
  hotelName?: string
): Promise<string> {

  // Filter out already visited places (excluding hotel)
  const filteredPlacesContext = Object.entries(simplifiedData)
    .filter(([category]) => category !== 'Hotels') // Exclude hotels from daily visits
    .map(([category, places]) => {
      const remaining = places.filter(p => !visitedPlaces.includes(p.displayName));
      return `${category}: ${remaining.map(p => p.displayName).join(', ')}`;
    })
    .filter(line => line.split(': ')[1] !== '') // remove empty categories
    .join('\n');

  const hotelContext = hotelName 
    ? `The user is staying at ${hotelName}. Start the day from this hotel and return here at the end of the day.`
    : '';

  // Check if user selected food-related categories
  const hasFoodCategories = Object.keys(simplifiedData).some(cat => 
    cat === 'Restaurants' || cat === 'Coffee Shops' || cat === 'Local Stops'
  );

  const foodInstructions = hasFoodCategories
    ? 'Use specific restaurant/cafe names from the available places for meals.'
    : 'For meals, use generic descriptions like "Lunch at a local restaurant" or "Dinner at a nearby eatery" - DO NOT mention specific restaurant names.';

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are an expert itinerary planner for Biñan, Laguna. Create a realistic plan for Day ${dayNumber}. ${hotelContext}

IMPORTANT RULES:
- ${hotelName ? `Start from ${hotelName} in the morning and return there in the evening` : 'Plan the day efficiently'}
- Vary the times for each day - don't use the same schedule every day
- Be realistic about how many places can be visited in one day (typically 4-6 places total)
- Consider travel time between locations
- Don't force all available places into the itinerary if there isn't enough time
- Quality over quantity - it's better to visit fewer places comfortably than rush through many
- ${foodInstructions}

Format:
Morning (vary start time: 7:00-9:00 AM)
${hotelName ? `* Depart from ${hotelName}` : ''}
* Place – brief description

Lunch (vary time: 11:30 AM - 1:00 PM)
* Place – brief description

Afternoon (vary time based on lunch)
* Place – brief description

Evening (vary time: 5:00-7:00 PM)
* Place – brief description
${hotelName ? `* Return to ${hotelName}` : ''}

Start directly with the time blocks. No introductory text.`
      },
      {
        role: 'user',
        content: `Day ${dayNumber} of ${userData.days}-day trip. Available places:\n${filteredPlacesContext}\n\nAlready visited: ${visitedPlaces.join(', ') || 'none'}`
      }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 2048,
  });

  return completion.choices[0]?.message?.content || 'Unable to generate plan.';
}

// Main planner for multiple days
async function itineraryPlanner(
  userData: UserInput,
  simplifiedData: Record<string, SimplifiedPlace[]>
): Promise<{ itinerary: Record<number, string>; chosenHotelName?: string }> {
  try {
    const itinerary: Record<number, string> = {};
    
    // Check if user selected Hotels and pick the closest one to other preferences
    let hotelName: string | undefined;
    if (simplifiedData['Hotels']?.length) {
      const allOtherPlaces = Object.entries(simplifiedData)
        .filter(([category]) => category !== 'Hotels')
        .flatMap(([_, places]) => places);
      
      const closestHotel = findClosestHotel(simplifiedData['Hotels'], allOtherPlaces);
      hotelName = closestHotel?.displayName;
    }

    for (let day = 1; day <= userData.days; day++) {
      const visitedPlaces = flattenVisitedPlaces(itinerary); // track used places
      const dayPlan = await generateDayPlan(day, userData, simplifiedData, visitedPlaces, hotelName);
      itinerary[day] = dayPlan;
    }

    return { itinerary, chosenHotelName: hotelName };
  } catch (error) {
    console.error('Itinerary planner error:', error);
    return { itinerary: {} };
  }
}

// Main entry function
export async function generateItinerary(userData: UserInput) {
  const searchResults = await searchByPreferences(userData.placeTypes);
  const { itinerary, chosenHotelName } = await itineraryPlanner(userData, searchResults.simpleData);
  
  // Extract all mentioned place names from itinerary
  const mentionedPlaces = flattenVisitedPlaces(itinerary);
  
  // Filter searchResults to only include mentioned places
  const filteredFullData: typeof searchResults.fullData = {};
  Object.entries(searchResults.fullData).forEach(([category, places]) => {
    // For Hotels, only include the chosen hotel
    if (category === 'Hotels' && chosenHotelName) {
      filteredFullData[category] = places.filter(place => 
        place.displayName === chosenHotelName
      );
    } else {
      filteredFullData[category] = places.filter(place => 
        mentionedPlaces.some(mentioned => {
          const placeName = place.displayName.toLowerCase();
          const mentionedName = mentioned.toLowerCase();
          return placeName === mentionedName || placeName.includes(mentionedName) && mentionedName.length > 5;
        })
      );
    }
  });
  
  const filteredSearchResults = {
    fullData: filteredFullData,
    simpleData: searchResults.simpleData
  };
  
  console.log({ searchResults: filteredSearchResults, itinerary });
  return { searchResults: filteredSearchResults, itinerary };
}
