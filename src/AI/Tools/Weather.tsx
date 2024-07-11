
import { DynamicStructuredTool } from "@langchain/core/tools";
import { fetchSingleCoordinate } from "./Marker";
import { createRunnableUI } from "~/utils/server";
import { LoadingWeatherCard, WeatherCard } from "~/components/prebuilt/Weather";
import { z } from "zod";

const OpenWeatherKey = process.env.OPENWEATHER_API_KEY

export const weatherSchema = z.object({
    city: z.string().describe("The city of the location you want the weather for"),
    state: z.string().optional().describe('The U.S State you want the weather for'),
    country: z.string().describe('The Country you want the weather for')
})

const fetchWeather = async (address: z.infer<typeof weatherSchema>) => {
    const addressString = `${address.city}${address.state ? `, ${address.state}` : ''}, ${address.country}`;
    const { lat, lng } = await fetchSingleCoordinate(addressString);

    const weatherURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&appid=${OpenWeatherKey}`;
    const weatherRes = await fetch(weatherURL);
    const weatherData = await weatherRes.json();
    let currentTime = new Date().toLocaleTimeString();
    currentTime = convertToMilitaryTime(currentTime)
    const { temp, wind_speed, humidity, weather } = weatherData.current
    return { addressString, currentTime, temp, wind_speed, humidity, weather }
};

const convertToMilitaryTime = (time: string) => {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart!.split(':');
    let hoursNumber = parseInt(hours!, 10);
    
    if (modifier === 'PM' && hoursNumber !== 12) {
      hoursNumber += 12;
    } else if (modifier === 'AM' && hoursNumber === 12) {
      hoursNumber = 0;
    }
    
    hours = String(hoursNumber).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    return `${hours}:${minutes}`;
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