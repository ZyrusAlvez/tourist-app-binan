import { searchAllPlaces, SearchResult } from "./searchService";
import { UserData } from "@/component/ChatBox";

type SimplifiedPlace = {
  displayName: string;
  location: { lat: number; lng: number };
};

export async function itineraryGenerator(userData: UserData){
    const fullData: Record<string, SearchResult[]> = {};
    const simpleData: Record<string, SimplifiedPlace[]> = {};

    for(const preference in userData.placeTypes){
        const types = userData.placeTypes[preference];
        const places = await searchAllPlaces(types);
        fullData[preference] = places;
        simpleData[preference] = places.map(p => ({
            displayName: p.displayName,
            location: p.location
        }));
    }
    console.log({ fullData, simpleData })
    return { fullData, simpleData };
}