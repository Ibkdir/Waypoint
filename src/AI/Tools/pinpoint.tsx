
import { DynamicStructuredTool } from "@langchain/core/tools";
import { PinpointHelper } from "./helpers";
import { z } from "zod";

const MapsKey = process.env.NEXT_PUBLIC_GMAP_API!;

// Pinpoint Tool

export const pinpointSchema = z.object({
    address: z.string().describe("The address you want to place a pinpoint on"),
})

const fetchCoordinates = async (input: z.infer<typeof pinpointSchema>): Promise<{ lat: number; lng: number }> => { 
    const { address } = input
    const encodedAddress = encodeURIComponent(address);
    const geoCodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${MapsKey}`;
    const res = await fetch(geoCodeUrl);
    if (!res.ok) {
        throw new Error("Failed to fetch Geocode Data")
    }
    const data: GeocodeResponse = await res.json() as GeocodeResponse;
    const coordinates = data.results[0]!.geometry.location ?? { lat: '', lng: ''  }
    return coordinates
}

export const pinpointTool = new DynamicStructuredTool({
    name: "pinpointTool",
    description: 
    "A tool for placing pinpoints on the map, given a specific address, which includes Street, City, State, and Country. If you want to show a user a location, use this tool by passing in the address of the location",
    schema: pinpointSchema,
    func: async ( input ) => {
        const { lat, lng } = await fetchCoordinates(input) 
        PinpointHelper({ lat, lng })
        return "Pinpoints Placed"
    }
})

// Interfaces

interface GeocodeResponse {
    results: GeocodeResult[];
    status: string;
}
interface GeocodeResult {
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
        location_type: string;
        viewport: {
            northeast: {
                lat: number;
                lng: number;
            };
            southwest: {
                lat: number;
                lng: number;
            };
        };
        bounds?: {
            northeast: {
                lat: number;
                lng: number;
            };
            southwest: {
                lat: number;
                lng: number;
            };
        };
    };
    place_id: string;
    types: string[];
    formatted_address: string;
}