'use client'

import { useEffect } from "react";
import { useMap } from "~/components/map/mapcontext";

/*
    Helpers
    Functions that the LLM can call that handle all client-side state changes
    This keeps the client-side and server-side logic seperate while allowing the LLM to control the front-end
*/

export const PinpointHelper = ({ lat, lng }: {lat: number, lng: number}): null => {
    const { addMarker } = useMap();

    useEffect(() => {
        if (lat && lng) {
            addMarker(lat, lng);
        }
    }, [lat, lng, addMarker]);

    return null;
};
