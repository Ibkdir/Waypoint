/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DynamicStructuredTool } from "@langchain/core/tools";
import { fetchSingleCoordinate } from "./Marker";
import { createRunnableUI } from "~/utils/server";
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
    const weatherData: WeatherData = await weatherRes.json();

    let unixTime = weatherData.minutely[0]?.dt;

    let currentTime;
    if (unixTime === undefined) {
      currentTime = "Time not found"
    } else {
      unixTime += weatherData.timezone_offset;

      const date = new Date(unixTime * 1000);
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      currentTime = `${hours}:${minutes}:${seconds}`;
    }


    const { temp, wind_speed, humidity, weather,  } = weatherData.current
    return { addressString, currentTime, temp, wind_speed, humidity, weather }
};

export const weatherTool = new DynamicStructuredTool({
    name: 'weatherTool',
    description: 
        `The WeatherTool provides weather information based on the user's address. 
        For the USA, the user must provide the city, state, and country; for other countries, the city and country are required.
         If only a country is provided, ask the user if the capital city's weather is acceptable. 
         If only a city is provided, ask the user for the country, and for the USA, the state as well. Always say something after using the tool like: "If you have any other questions please let me know"`,
    schema: weatherSchema,
    func: async (input, config) => {
        const stream = await createRunnableUI(config)
        const weatherData = await fetchWeather(input);
        stream.done()
        return JSON.stringify(weatherData, null, 2);
    }
})
interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface CurrentWeather {
  temp: number;
  wind_speed: number;
  humidity: number;
  weather: Weather[];
  
}

interface WeatherData {
  timezone_offset: number,
  current: CurrentWeather;
  minutely: { dt: number }[]
}
