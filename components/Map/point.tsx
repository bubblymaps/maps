"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

interface PointMapProps {
    longitude: number;
    latitude: number;
    zoom?: number;
    className?: string;
}

export default function PointMap({ longitude, latitude, zoom = 14, className }: PointMapProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        mapInstance.current = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://tiles.linus.id.au/styles/dark/style.json",
            center: [longitude, latitude],
            zoom,
            attributionControl: false,
        });

        new maplibregl.Marker({ color: "#0b70f5ff" })
            .setLngLat([longitude, latitude])
            .addTo(mapInstance.current);

        return () => {
            mapInstance.current?.remove();
        };
    }, [longitude, latitude, zoom]);

    return <div ref={mapContainer} className={className || "w-full h-64 rounded-lg shadow-lg"} />;
}
