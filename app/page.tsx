"use client"

import "maplibre-gl/dist/maplibre-gl.css"

import { useState } from "react"
import { useTheme } from "next-themes"
import type { Map } from "maplibre-gl"
import { Toaster, toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import MapBox from "@/components/Map/map"
import Login from "@/components/login"

import { ThemeToggle } from "@/components/themeToggle"
import { LoginBtn } from "@/components/loginBtn"
import { Watermark } from "@/components/Map/watermark"
import { Attribution } from "@/components/Map/attribution"
import { MapScale } from "@/components/Map/scale"
import { ZoomControl } from "@/components/Map/zoom"
import { SearchBar } from "@/components/Map/search"

export default function Page() {
  const { theme } = useTheme()
  const [map, setMap] = useState<Map | null>(null)
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const latParam = parseFloat(searchParams.get("lat") || "0");
  const lngParam = parseFloat(searchParams.get("lng") || "0");
  const zoomParam = parseFloat(searchParams.get("zoom") || "0");

  const initialCenter: [number, number] = latParam && lngParam ? [lngParam, latParam] : [-7, 0];
  const initialZoom: number = zoomParam || 1;

  const styleURL =
    theme === "dark"
      ? "https://tiles.linus.id.au/styles/dark/style.json"
      : "https://tiles.linus.id.au/styles/light/style.json"

  const handleSearch = (val: string) => {
    if (!val) return;
    console.log("Searching:", val);
    toast(`Searching for "${val}"`);
  };

  const handleMapMove = (map: Map) => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const params = new URLSearchParams(window.location.search);
    params.set("lat", center.lat.toFixed(5));
    params.set("lng", center.lng.toFixed(5));
    params.set("zoom", zoom.toFixed(2));
    router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <MapBox
        styleURL={styleURL}
        center={initialCenter}
        zoom={initialZoom}
        showControls={false}
        className="w-full h-full"
        onMapLoad={(mapInstance) => {
          setMap(mapInstance);
          mapInstance.on("moveend", () => handleMapMove(mapInstance));
        }}
      />

      <div className="fixed top-4 left-4 right-4 z-50 flex flex-row items-center gap-2">
        <div className="flex-1 min-w-0 sm:max-w-md">
          <SearchBar placeholder="Search something..." onSearch={(val) => handleSearch(val)} />
        </div>

        <div className="flex flex-row gap-2 shrink-0 ml-auto">
          <LoginBtn onClick={() => setShowLogin(true)} />
          <ThemeToggle />
        </div>
      </div>

      <Watermark />
      <Attribution />

      {map && <MapScale map={map} maxWidth={120} />}
      {map && <ZoomControl map={map} />}

      {showLogin && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm animate-fadeIn transition-opacity"
            onClick={() => setShowLogin(false)}
          />

          <Login
            title="Sign in"
            subtitle="Login with your Google account to continue"
            callbackUrl="/"
            onClose={() => setShowLogin(false)}
          />
        </>
      )}
    </div>
  )
}
