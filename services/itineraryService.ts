import { searchAllPlaces } from "./searchService";
import { UserData } from "@/component/ChatBox";

export async function itineraryGenerator(userData: UserData){

    for(const preference in userData.placeTypes){
        const types = userData.placeTypes[preference];
        const places = await searchAllPlaces(types);
        console.log(`Places for ${preference}:`, places);
    }

}