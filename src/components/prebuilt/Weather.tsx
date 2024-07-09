import { useState } from "react"
import { CloudLightning, CloudRain, Snowflake, Tornado, Cloud, Sun } from "@phosphor-icons/react"

const weatherIcon = (WeatherCode: number) => {
  if (WeatherCode >= 200 && WeatherCode <= 232) {
    return <CloudLightning size={32} />
  } else if (WeatherCode >= 300 && WeatherCode <= 531) {
    return <CloudRain size={32}/>
  } else if (WeatherCode >= 600 && WeatherCode <= 622) {
    return <Snowflake size={32} />
  } else if (WeatherCode >= 701 && WeatherCode <= 781) {
    return <Tornado size={32} />
  } else if (WeatherCode === 800) {
    return <Sun size={32}/>
  } else {
    return <Cloud size={32} />
  }
}

export const WeatherCard = ({ Location, Time, Temperature, WeatherCode, WeatherDescription }: { Location: string, Time: number, Temperature: number, WeatherCode: number, WeatherDescription: string }) => {
  return (
    <div className="flex justify-center py-5">
      <div className="w-full max-w-md">
        <div className="bg-white text-gray-900 rounded-[35px] shadow-md">
          <div className="p-4">
            <div className="flex justify-between">
              <h6 className="flex-grow">{Location}</h6>
              <h6>{Time}</h6>
            </div>

            <div className="flex flex-col items-center mt-5 mb-4">
              <h6 className="text-4xl font-semibold mb-0">{Temperature}</h6>
              <span className="text-sm text-gray-500">{WeatherDescription}</span>
            </div>

            <div className="flex items-center">
              <div className="flex-grow text-lg">
                <div className="flex items-center text-gray-500">
                  <i className="fas fa-wind mr-1"></i>
                  <span>Additional Info</span> 
                </div>
                <div className="flex items-center text-gray-500">
                  <i className="fas fa-tint mr-1"></i>
                  <span>Additional Info</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <i className="fas fa-sun mr-1"></i>
                  <span>Additional Info</span>
                </div>
              </div>
              <div>
                {weatherIcon(WeatherCode)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoadingWeatherCard = () => {
  return (
    <div className="flex justify-center py-5">
      <div className="w-full max-w-md">
        <div className="bg-white text-gray-900 rounded-[35px] shadow-md">
          <div className="p-4">
            <div className="flex justify-between animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/3"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            </div>

            <div className="flex flex-col items-center mt-5 mb-4 animate-pulse">
              <div className="h-12 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>

            <div className="flex items-center animate-pulse">
              <div className="flex-grow text-lg space-y-2">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-2/3 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
              </div>
              <div>
                <div className="h-24 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};