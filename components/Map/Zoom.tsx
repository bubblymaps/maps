"use client";

import { useTheme } from "@/lib/theme";
import { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { cn } from "@/lib/utils";

interface ZoomControlProps {
  map?: maplibregl.Map | null;
}

export function ZoomControl({ map }: ZoomControlProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [zoom, setZoom] = useState<number>(map?.getZoom() ?? 0);

  useEffect(() => {
    if (!map) return;

    const handleZoom = () => setZoom(map.getZoom());
    map.on("zoom", handleZoom);

    return () => {
      map.off("zoom", handleZoom);
    };
  }, [map]);

  const handleZoomIn = () => map?.zoomIn();
  const handleZoomOut = () => map?.zoomOut();

  return (
    <div className="fixed right-5 bottom-9 flex flex-col z-10 gap-2">
      {[{ label: "+", onClick: handleZoomIn }, { label: "-", onClick: handleZoomOut }].map(
        ({ label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full border shadow-md text-lg font-bold transition cursor-pointer",
              "bg-white dark:bg-zinc-900/80 dark:backdrop-blur-sm",
              "border-input dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800",
              "text-foreground dark:text-white"
            )}
          >
            {label}
          </button>
        )
      )}
    </div>
  );
}
