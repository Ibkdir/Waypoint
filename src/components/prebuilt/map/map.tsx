'use client'

import { useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { useMapContext } from './mapcontext';

const MapsKey = process.env.NEXT_PUBLIC_GMAP_API!;
const MapID = process.env.NEXT_PUBLIC_MAP_ID

if (!MapsKey) {
  throw new Error("Your Google Maps key is missing. Please set NEXT_PUBLIC_GMAP_API environment variable.")
}

const GoogleMap = () => {
    const { Position, handleCameraChange, Markers, Zoom } = useMapContext()
    const map = useMap();
    const prevMarkersRef = useRef<Set<string>>(new Set());
    const isZoomingRef = useRef(false);

    useEffect(() => {
        if (map) {
            const prevMarkers = prevMarkersRef.current;
            const newMarkers = Markers.filter(marker => {
                const markerId = `${marker.lat},${marker.lng}`;
                if (!prevMarkers.has(markerId)) {
                    prevMarkers.add(markerId);
                    return true;
                }
                return false;
            });
            if (newMarkers.length > 0) {
                const bounds = new google.maps.LatLngBounds();
                newMarkers.forEach(marker => {
                    if (marker.lat && marker.lng) {
                        bounds.extend(new google.maps.LatLng(marker.lat, marker.lng));
                    }
                });
                if (bounds.getNorthEast() !== bounds.getSouthWest()) {
                    map.fitBounds(bounds)
                    if (Zoom && !isZoomingRef.current) {
                        isZoomingRef.current = true;
                        google.maps.event.addListenerOnce(map, 'boundsChanged', () => {
                            map.setZoom(Zoom);
                            isZoomingRef.current = false;
                        });
                    }
                }
            }
        }
    }, [Markers, map, Zoom]);

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