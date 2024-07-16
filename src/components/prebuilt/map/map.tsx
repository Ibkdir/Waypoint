'use client'

import { useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { useMapContext } from './mapcontext';

const MapsKey = process.env.NEXT_PUBLIC_GMAP_API!;
const MapID = process.env.NEXT_PUBLIC_MAP_ID

if (!MapsKey) {
  throw new Error("Your Google Maps key is missing. Please set NEXT_PUBLIC_GMAP_API environment variable.")
}

const GoogleMap = () => {
    const { Position, handleCameraChange, Markers } = useMapContext()
    const map = useMap();

    // Known bug: Incorrectly handles zoom if places are too far apart. Will fix this
    useEffect(() => {
      if (map && Markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        Markers.forEach(marker => {
          bounds.extend(new google.maps.LatLng(marker.lat, marker.lng));
        });
  
        const center = bounds.getCenter();
        map.panTo(center);

        map.setZoom(4); 
  
        const targetZoom = 6; 
        const zoomInterval = setInterval(() => {
          const currentZoom = map.getZoom();
          if (currentZoom! < targetZoom) {
            map.setZoom(currentZoom! + 1);
          } else {
            clearInterval(zoomInterval);
          }
        }, 80); // 80ms seems to be good
      }
    }, [Markers, map]);

  return (
      <div className="w-full h-full rounded-lg px-3 md:px-0 overflow-hidden">
          <Map {...Position} onCameraChanged={handleCameraChange} mapId={MapID} />
          <div>
              {Markers.map((MarkerCoordinates, index) => (
                  <AdvancedMarker key={index} position={MarkerCoordinates} />
              ))}
          </div>
      </div>
  );
}

const GoogleMapComponent = () => {
  return (
    <APIProvider apiKey={ MapsKey } onLoad={() => console.log("Map has successfully loaded")}>
      <GoogleMap />
    </APIProvider>
  )
}

export default GoogleMapComponent;