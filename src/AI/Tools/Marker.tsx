
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const MapsKey = process.env.NEXT_PUBLIC_GMAP_API!;

// Define the marker schema
const markerSchema = z.object({
  address: z.union([
    z.string().describe("The address you want to place a marker on"),
    z.array(z.string()).describe('A list of addresses you want to place markers on')
  ])
});

// Function to fetch a single coordinate
export const fetchSingleCoordinate = async (singleAddress: string): Promise<{ lat: number, lng: number }> => {
  const encodedAddress = encodeURIComponent(singleAddress);
  const geoCodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${MapsKey}`;
  const res = await fetch(geoCodeUrl);
  if (!res.ok) {
    throw new Error("Failed to fetch Geocode Data");
  }
  const data = await res.json() as GeocodeResponse;
  const coordinates = data.results[0]?.geometry.location ?? { lat: 0, lng: 0 };
  return coordinates;
};

const fetchCoordinates = async (input: z.infer<typeof markerSchema>): Promise<{ lat: number; lng: number }[]> => {
  const { address } = input;

  if (typeof address === "string") {
    const coordinates = await fetchSingleCoordinate(address);
    return [coordinates];
  } else {
    const coordinatesList = await Promise.all(address.map(fetchSingleCoordinate));
    return coordinatesList;
  }
};

export const markerTool = new DynamicStructuredTool({
  name: "markerTool",
  description: 
    `A tool for placing markers on the map, given a specific address, which includes Street, City, State, and Country. 
    If you want to show a user a location, use this tool by passing in the address of the location. 
    You can also place multiple markers by passing in an array of addresses. The addresses should also be in Street, City, State, and Country format in an array
    Always say something after using the tool like: "If you have any other questions please let me know"`,
  schema: markerSchema,
  func: async (input, _config) => {
    let addresses = input.address;
    if (typeof addresses === 'string') {
      addresses = [addresses];
    }
    
    const markerCoordinates = await fetchCoordinates({ address: addresses });
    return JSON.stringify(markerCoordinates, null, 2);
  }
});

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