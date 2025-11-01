"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { MapPin } from "lucide-react";

interface CoordinatePickerProps {
    longitude: number;
    latitude: number;
    zoom?: number;
    className?: string;
    onCoordinateChange?: (lng: number, lat: number) => void;
}

export default function CoordinatePicker({ 
    longitude, 
    latitude, 
    zoom = 14, 
    className,
    onCoordinateChange 
}: CoordinatePickerProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);
    const [currentCoords, setCurrentCoords] = useState({ lng: longitude, lat: latitude });

    useEffect(() => {
        if (!mapContainer.current) return;

        mapInstance.current = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://tiles.linus.id.au/styles/dark/style.json",
            center: [longitude, latitude],
            zoom,
            attributionControl: false,
        });

        // Update coordinates when map moves
        const updateCoordinates = () => {
            if (mapInstance.current) {
                const center = mapInstance.current.getCenter();
                setCurrentCoords({ lng: center.lng, lat: center.lat });
                onCoordinateChange?.(center.lng, center.lat);
            }
        };

        mapInstance.current.on("move", updateCoordinates);
        mapInstance.current.on("moveend", updateCoordinates);

        return () => {
            mapInstance.current?.remove();
        };
    }, []);

    // Update map center when props change
    useEffect(() => {
        if (mapInstance.current && (longitude !== currentCoords.lng || latitude !== currentCoords.lat)) {
            mapInstance.current.setCenter([longitude, latitude]);
        }
    }, [longitude, latitude]);

    return (
        <div className="relative">
            <div ref={mapContainer} className={className || "w-full h-80 rounded-lg"} />
            
            {/* Fixed center pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-10">
                <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg" fill="currentColor" />
            </div>

            {/* Coordinate display */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm border border-border/60 rounded-lg px-4 py-2 text-xs font-mono shadow-lg">
                <div className="flex gap-4">
                    <span>
                        <span className="text-muted-foreground">Lat:</span> {currentCoords.lat.toFixed(6)}
                    </span>
                    <span>
                        <span className="text-muted-foreground">Lng:</span> {currentCoords.lng.toFixed(6)}
                    </span>
                </div>
            </div>

            {/* Instructions */}
            <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm border border-border/60 rounded-lg px-3 py-2 text-xs text-muted-foreground shadow-lg max-w-[200px]">
                Drag the map to position the pin at the exact location
            </div>
        </div>
    );
}
