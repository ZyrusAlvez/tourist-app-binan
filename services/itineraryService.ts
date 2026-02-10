import { searchByPreferences } from "./searchService";

export async function generateItinerary(userData: any) {
    const searchResults = await searchByPreferences(userData.placeTypes);
    console.log(searchResults);
}