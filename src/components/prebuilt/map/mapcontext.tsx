
'use client' 

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { type MapCameraChangedEvent, type MapCameraProps } from '@vis.gl/react-google-maps';

const MapContext = createContext<MapContextProps | undefined>(undefined)

const MapProvider = ({ children }: { children: ReactNode })  => {
    const InitialPosition = { center: {lat: 20, lng: -50 }, zoom: 2.5 }
    const [ Position, setPosition ] = useState<MapCameraProps>(InitialPosition)
    const [ Markers, setMarkers ] = useState<MarkerCoordinates[]>([])

    const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => setPosition(ev.detail), []);

    const addMarker = useCallback((lat: number, lng: number) => {
        setMarkers((prevPlacedMarkers) => [...prevPlacedMarkers, { lat, lng }]);
    }, []);

    return (
        <div>
            <MapContext.Provider value={{ Position, handleCameraChange, Markers, addMarker }}>
                {children}
            </MapContext.Provider>
        </div>
    )
}

export const useMapContext = (): MapContextProps => {
    const context = useContext(MapContext)
    if (!context) {
        throw new Error('useMap must be used within a MapProvider')
    }

    return context
}   

// Interfaces
interface MapContextProps {
    Position: MapCameraProps;
    handleCameraChange: (ev: MapCameraChangedEvent) => void;
    Markers: MarkerCoordinates[];
    addMarker: (lat: number, lng: number) => void;
}

export interface MarkerCoordinates {
    lat: number;
    lng: number;
}

export default MapProvider