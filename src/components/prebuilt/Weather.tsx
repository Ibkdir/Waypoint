'use client'

import { CloudLightning, CloudRain, Snowflake, Tornado, Cloud, Sun, Drop, Wind } from "@phosphor-icons/react"

const weatherIcon = (WeatherCode: number) => {
  if (WeatherCode >= 200 && WeatherCode <= 232) {
    return <CloudLightning size={60} weight="light"/>
  } else if (WeatherCode >= 300 && WeatherCode <= 531) {
    return <CloudRain size={60} weight="light"/>
  } else if (WeatherCode >= 600 && WeatherCode <= 622) {
    return <Snowflake size={60} weight="light"/>
  } else if (WeatherCode >= 701 && WeatherCode <= 781) {
    return <Tornado size={60} weight="light" />
  } else if (WeatherCode === 800) {
    return <Sun size={60} weight="light"/>
  } else {
    return <Cloud size={60} weight="light"/>
  }
}

export const WeatherCard = ({
  addressString,
  currentTime,
  temp,
  wind_speed,
  humidity,
  weather,
}: {
  addressString: string;
  currentTime: string;
  temp: number;
  wind_speed: number;
  humidity: number;
  weather: WeatherData[];
}) => {
  const { id, description } = weather[0]!;
  const descriptionUpper = description.charAt(0).toUpperCase() + description.slice(1);
  const tempInC = (temp - 273.15).toFixed(1);

  return (
    <div className="flex py-2 w-[28rem] max-w-full">
      <div className="w-full max-w-xl m-1">
        <div className="bg-white text-gray-900 rounded-[35px] shadow-md p-5">
          <div className="flex justify-between items-center pt-2">
            <h6 className="text-sm font-medium">{addressString}</h6>
            <h6 className="text-sm text-gray-500">{currentTime}</h6>
          </div>

          <div className="flex flex-col items-center mt-5 mb-4">
            <h6 className="text-2xl font-bold">{tempInC}°C</h6>
            <span className="text-sm text-gray-500 mt-1">{descriptionUpper}</span>
          </div>

          <div className="flex justify-between items-center mt-5">
            <div className="text-sm text-gray-500">
              <div className="flex items-center mb-2">
                <Wind size={28} weight="light"/>
                <span className="mx-1">{wind_speed}</span>
              </div>
              <div className="flex items-center mb-2">
                <Drop size={26} weight="light" />
                <span className="mx-1">{humidity}%</span>
              </div>
              
            </div>
            <div className="text-4xl text-gray-500 pb-3">
              {weatherIcon(id)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoadingWeatherCard = () => {
  return (
    <div className="flex py-2 w-[28rem] max-w-full">
      <div className="w-full max-w-xl m-1">
        <div className="bg-white text-gray-900 rounded-[35px] shadow-md p-5">
          <div className="flex justify-between items-center pt-2 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>

          <div className="flex flex-col items-center mt-5 mb-4 animate-pulse">
            <div className="h-12 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>

          <div className="flex justify-between items-center mt-5 animate-pulse">
            <div className="text-sm text-gray-500">
              <div className="h-6 bg-gray-300 rounded w-20 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-14 mb-2"></div>
            </div>
            <div className="h-24 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Interfaces
interface WeatherData {
  id: number;
  main: string;
  description: string;
  icon: string;
}