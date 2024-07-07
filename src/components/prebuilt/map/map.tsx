'use client'

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useMap } from './MapContext';

const MapsKey = process.env.NEXT_PUBLIC_GMAP_API!;

if (!MapsKey) {
  throw new Error("Your Google Maps key is missing. Please set NEXT_PUBLIC_GMAP_API environment variable.")
}

const GoogleMapComponent = () => {
    const { Position, handleCameraChange, Markers } = useMap()

    return(
      <div className='w-full h-full rounded-lg overflow-hidden'>
        <APIProvider apiKey={ MapsKey } onLoad={() => console.log("Map has successfully loaded")}>
          <Map {...Position} onCameraChanged={handleCameraChange}></Map>
           { Markers.map( (MarkerCoordinates, index) => ( <Marker key={index} position={MarkerCoordinates}/> ) ) }
        </APIProvider>
      </div>
    )
}

export default GoogleMapComponent;