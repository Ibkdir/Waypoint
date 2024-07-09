
import { DynamicStructuredTool } from "@langchain/core/tools";
import { fetchSingleCoordinate } from "./Marker";
import { createRunnableUI } from "~/utils/server";
import { LoadingWeatherCard, WeatherCard } from "~/components/prebuilt/Weather";
import { z } from "zod";

export const weatherSchema = z.object({
    city: z.string().describe("The city of the location you want the weather for"),
    state: z.string().optional().describe('The U.S State you want the weather for'),
    Country: z.string().describe('The Country you want the weather for')
})

const fetchWeather = async (address: z.infer<typeof weatherSchema>) => {
    
    return address
};

export const weatherTool = new DynamicStructuredTool({
    name: 'weatherTool',
    description: 
        `The WeatherTool provides weather information based on the user's address. 
        For the USA, the user must provide the city, state, and country; for other countries, the city and country are required.
         If only a country is provided, ask the user if the capital city's weather is acceptable. 
         If only a city is provided, ask the user for the country, and for the USA, the state as well.`,
    schema: weatherSchema,
    func: async (input, config) => {
        const stream = await createRunnableUI(config, <LoadingWeatherCard />)
        const weatherData = await fetchWeather(input)
        stream.done(<WeatherCard {...weatherData}/>)
        return JSON.stringify(weatherData, null, 2)
    }
})