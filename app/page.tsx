"use client"

import "maplibre-gl/dist/maplibre-gl.css"

import maplibregl from "maplibre-gl"

import { useState } from "react"
import { useTheme } from "next-themes"
import type { Map } from "maplibre-gl"
import { Toaster, toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react"

import MapBox from "@/components/Map/map"
import Login from "@/components/login"

import { ThemeToggle } from "@/components/themeToggle"
import { LoginBtn } from "@/components/loginBtn"
import { Watermark } from "@/components/Map/watermark"
import { Attribution } from "@/components/Map/attribution"
import { MapScale } from "@/components/Map/scale"
import { ZoomControl } from "@/components/Map/zoom"
import { SearchBar } from "@/components/Map/search"
import { AvatarManager } from "@/components/account"

interface Waypoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  approved: boolean;
}

export default function Page() {
  const { theme } = useTheme()
  const [map, setMap] = useState<Map | null>(null)
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  const { data: session, status } = useSession();

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

  useEffect(() => {
    if (!map) return;

    fetch("/api/waypoints")
      .then((res) => res.json())
      .then((data: Waypoint[]) => {
        const geojson = {
          type: "FeatureCollection",
          features: data.map((wp) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [wp.longitude, wp.latitude] },
            properties: {
              id: wp.id,
              name: wp.name,
              verified: wp.verified,
              approved: wp.approved,
            },
          })),
        } as GeoJSON.FeatureCollection;

        if (map.getLayer("clusters")) map.removeLayer("clusters");
        if (map.getLayer("cluster-count")) map.removeLayer("cluster-count");
        if (map.getLayer("unclustered-point")) map.removeLayer("unclustered-point");
        if (map.getSource("waypoints")) map.removeSource("waypoints");

        if (!map.getSource("waypoints")) {
          map.addSource("waypoints", {
            type: "geojson",
            data: geojson,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
          });

          map.addLayer({
            id: "clusters",
            type: "circle",
            source: "waypoints",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#4A90E2",
                10,
                "#357ABD",
                50,
                "#1F4C8B"
              ],
              "circle-radius": ["step", ["get", "point_count"], 18, 10, 24, 50, 30],
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            },
          });

          map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "waypoints",
            filter: ["has", "point_count"],
            layout: {
              "text-field": "{point_count_abbreviated}",
              "text-font": ["Arial Unicode MS Bold"],
              "text-size": 12,
            },
            paint: {
              "text-color": "#ffffff",
            },
          });

          map.addLayer({
            id: "unclustered-point",
            type: "circle",
            source: "waypoints",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-color": "#1E90FF",
              "circle-radius": 8,
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            },
          });

          map.on("click", "clusters", (e) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
            const clusterId = features[0].properties!.cluster_id;
            const source = map.getSource("waypoints") as any as maplibregl.GeoJSONSource;

            const maybePromise = (source as any).getClusterExpansionZoom(clusterId as number);

            if (maybePromise && typeof maybePromise.then === "function") {
              maybePromise
                .then((zoom: number) => {
                  map.easeTo({
                    center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
                    zoom,
                  });
                })
                .catch(() => { });
            } else {
              const zoom = maybePromise as number;
              map.easeTo({
                center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
                zoom,
              });
            }
          });

          map.on("click", "unclustered-point", (e) => {
            const feature = e.features![0];
            new maplibregl.Popup()
              .setLngLat((feature.geometry as any).coordinates)
              .setHTML(`<strong>${feature.properties!.name}</strong>`)
              .addTo(map);
          });
        }
      });
  }, [map, styleURL]);

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
          {status === "authenticated" ? (
            <AvatarManager />
          ) : (
            <LoginBtn onClick={() => setShowLogin(true)} />
          )}
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
