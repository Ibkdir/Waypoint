
'use client' 

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { type MapCameraChangedEvent, type MapCameraProps } from '@vis.gl/react-google-maps';

const MapContext = createContext<MapContextProps | undefined>(undefined)

const MapProvider = ({ children }: { children: ReactNode })  => {
    const InitialPosition = { center: {lat: 20, lng: -50 }, zoom: 2.5 }
    const [ Position, setPosition ] = useState<MapCameraProps>(InitialPosition)
    const [ Markers, setMarkers ] = useState<MarkerCoordinates[]>([])
    const [ Zoom, setZoom ] = useState(6)

    const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => {
        setPosition(ev.detail)
    }, []);

    const addMarker = useCallback((coordinates: {lat: number, lng: number}[]) => {
        setMarkers((prevPlacedMarkers) => [...prevPlacedMarkers, ...coordinates]);
    }, []);

    const removeMarkers = (Remove: boolean) => {
        if ( Remove && Markers.length ) {
            setMarkers([])
        }
    }

    const setNewZoom = (NewZoom: number) => {
        setZoom(NewZoom)
    }

    return (
        <div>
            <MapContext.Provider value={{ Position, handleCameraChange, Markers, addMarker, removeMarkers, setNewZoom, Zoom }}>
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
    addMarker: (coordinates: {lat: number, lng: number}[]) => void;
    removeMarkers: (Remove: boolean) => void;
    setNewZoom: (NewZoom: number) => void;
    Zoom: number
}

export interface MarkerCoordinates {
    lat: number;
    lng: number;
}

export default MapProvider