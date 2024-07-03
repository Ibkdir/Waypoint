
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { createRunnableUI } from "~/utils/server";
import MarkersComponent from "~/components/prebuilt/Markers";

const MapsKey = process.env.NEXT_PUBLIC_GMAP_API!;

// Pinpoint Tool

export const markerSchema = z.object({
    address: z.union([
        z.string().describe("The address you want to place a marker on"),
        z.array(z.string()).describe('A list of addresses you want to place markers on')
    ])
})

const fetchCoordinates = async (input: z.infer<typeof markerSchema>): Promise<{ lat: number; lng: number }[]> => {
    const { address } = input

    const fetchSingleCoordinate = async (singleAddress: string ): Promise<{lat:number, lng: number }> => {
        const encodedAddress = encodeURIComponent(singleAddress);
        const geoCodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${MapsKey}`;
        const res = await fetch(geoCodeUrl);
        if (!res.ok) {
            throw new Error("Failed to fetch Geocode Data")
        }
        const data: GeocodeResponse = await res.json() as GeocodeResponse;
        const coordinates = data.results[0]!.geometry.location ?? { lat: 0, lng: 0  }
        return coordinates
    }

    if (typeof address === "string") {
            const coordinates = await fetchSingleCoordinate(address)
            return [coordinates]
    } else {
       const coordinatesList = await Promise.all(address.map(fetchSingleCoordinate))  
       return coordinatesList
    }
}

export const markerTool = new DynamicStructuredTool({
    name: "markerTool",
    description: 
    `A tool for placing markers on the map, given a specific address, which includes Street, City, State, and Country. 
    If you want to show a user a location, use this tool by passing in the address of the location. 
    You can also place multiple markers by passing in an array of addresses. The addresses should also be in Street, City, State, and Country format`,
    schema: markerSchema,
    func: async (input, config) => {
        const stream = await createRunnableUI(config, /* Component Skeleton would goes here */)
        const markerCoordinates = await fetchCoordinates(input) 
        stream.done(<MarkersComponent markerCoordinateList={markerCoordinates}/>)
        return JSON.stringify(markerCoordinates, null, 2)
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