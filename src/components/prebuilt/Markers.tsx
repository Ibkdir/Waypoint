'use client'

import { useEffect } from "react";
import { useMap } from "./map/MapContext"

const MarkersComponent = ({ markerCoordinateList }: {markerCoordinateList: { lat: number, lng: number }[]}) => {
    const { addMarker } = useMap();

    useEffect(() => {
        markerCoordinateList.forEach(markerCoordinates => {
        addMarker(markerCoordinates.lat, markerCoordinates.lng);
        });
    }, [markerCoordinateList, addMarker]);
    
    return null;
}

export default MarkersComponent