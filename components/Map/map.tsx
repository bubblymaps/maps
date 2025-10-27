"use client";

import { useEffect, useRef } from "react";
import { Map, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapViewProps {
  styleURL?: string;
  center?: [number, number];
  zoom?: number;
  showControls?: boolean;
  className?: string;
  onMapLoad?: (map: Map) => void;
}

export default function MapBox({
  styleURL = "https://tiles.linus.id.au/styles/light/style.json",
  center = [153.03, -27.58],
  zoom = 10,
  showControls = true,
  className = "w-screen h-screen",
  onMapLoad,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = new Map({
      container: mapContainer.current,
      style: styleURL,
      center,
      zoom,
      attributionControl: false,
    });

    if (showControls) {
      mapRef.current.addControl(new NavigationControl(), "top-right");
    }

    if (onMapLoad) onMapLoad(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && styleURL) {
      mapRef.current.setStyle(styleURL);
    }
  }, [styleURL]);

  return <div ref={mapContainer} className={className} />;
}


// Example usage:
// "use client";

// import "maplibre-gl/dist/maplibre-gl.css";
// import MapBox from "@/components/Map/map";

// export default function MapView() {
//   return (
//     <div className="w-screen h-screen">
//       <MapBox
//         styleURL="https://tiles.linus.id.au/styles/dark/style.json"
//         center={[151.21, -33.87]}
//         zoom={12}
//         showControls={false}
//         className="w-full h-full"
//       />
//     </div>
//   );
// }