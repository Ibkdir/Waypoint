'use client'

import { APIProvider, Map, type MapCameraChangedEvent, type MapCameraProps } from '@vis.gl/react-google-maps';
import { useState, useCallback } from 'react';

const MapsKey = process.env.NEXT_PUBLIC_GMAP_API!;

if (!MapsKey) {
  throw new Error("Your Google Maps key is missing. Please set NEXT_PUBLIC_GMAP_API environment variable.")
}

const GoogleMapComponent = ({ }) => {
    const InitialPosition = { center: {lat: 20, lng: -50 }, zoom: 2.5 }
    const [ Position, setPosition ] = useState<MapCameraProps>(InitialPosition)

    const handleCameraChange = useCallback((ev: MapCameraChangedEvent) =>
        setPosition(ev.detail), [])

    return(
      <div className='w-full h-full rounded-lg overflow-hidden'>
        <APIProvider apiKey={ MapsKey } onLoad={() => console.log("Map has successfully loaded")}>
          <Map {...Position} onCameraChanged={handleCameraChange} ></Map>
        </APIProvider>
      </div>
    )
}

export default GoogleMapComponent;