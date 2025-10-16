import maplibregl from "maplibre-gl";
import type { FeatureCollection, Point } from "geojson";
import type { Waypoint } from "@/types/types";

export function getMapStyle(themeValue: string) {
  if (themeValue === "dark") {
    return "https://tiles.linus.id.au/styles/dark/style.json";
  }

  return "https://tiles.linus.id.au/styles/light/style.json";
}

export function addWaypoints(map: maplibregl.Map, waypoints: Waypoint[]) {
  if (!map || waypoints.length === 0) return;

  const geojson: FeatureCollection<Point, { id: number; name: string }> = {
    type: "FeatureCollection",
    features: waypoints.map((wp) => ({
      type: "Feature",
      properties: { id: wp.id, name: wp.name },
      geometry: { type: "Point", coordinates: [wp.longitude, wp.latitude] },
    })),
  };

  if (map.getSource("waypoints")) {
    (map.getSource("waypoints") as maplibregl.GeoJSONSource).setData(geojson);
    return;
  }

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
        "#60A5FA",
        10, "#3B82F6",
        50, "#2563EB",
        100, "#1E3A8A",
      ],
      "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 50, 25],
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
      "circle-color": "#00BFFF",
      "circle-radius": 8,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });

  map.on("click", "unclustered-point", (e) => {
    const feature = e.features?.[0];
    if (!feature || !feature.properties) return;
    const coords = (feature.geometry as Point).coordinates.slice() as [number, number];
    new maplibregl.Popup()
      .setLngLat(coords)
      .setHTML(`<strong>${feature.properties.name}</strong>`)
      .addTo(map);
  });

  map.on("click", "clusters", async (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
    if (!features.length) return;
    const clusterFeature = features[0];
    if (!clusterFeature.properties) return;

    const source = map.getSource("waypoints") as maplibregl.GeoJSONSource;
    const clusterId = clusterFeature.properties.cluster_id as number;
    const zoom = await source.getClusterExpansionZoom(clusterId);
    const coords = (clusterFeature.geometry as Point).coordinates as [number, number];
    map.easeTo({ center: coords, zoom });
  });
}

export function loadMap(mapRef: React.MutableRefObject<maplibregl.Map | null>, mapContainerRef: React.RefObject<HTMLDivElement | null>, theme: string) {
  if (!mapContainerRef) return;

  if (!mapRef.current && mapContainerRef.current) {
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getMapStyle(theme),
      center: [0, 0],
      zoom: 1,
      attributionControl: false,
    });

    mapRef.current.on("load", () => {
      console.log("[ Bubbly Maps ] Map Loaded!");

      const params = new URLSearchParams(window.location.search);
      const lat = parseFloat(params.get("lat") || "");
      const lng = parseFloat(params.get("lng") || "");
      const zoom = parseFloat(params.get("zoom") || "");

      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current!.flyTo({
          center: [lng, lat],
          zoom: !isNaN(zoom) ? zoom : 14,
          essential: true,
        });
      }
    });

    mapRef.current.on("moveend", () => {
      const center = mapRef.current!.getCenter();
      const zoom = mapRef.current!.getZoom();
      const params = new URLSearchParams(window.location.search);

      params.set("lat", center.lat.toFixed(6));
      params.set("lng", center.lng.toFixed(6));
      params.set("zoom", zoom.toFixed(2));

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);
    })

  } else if (mapRef.current) {
    mapRef.current.setStyle(getMapStyle(theme));
  }
}

export function query(
  searchValue: string,
  waypoints: Waypoint[],
  map: maplibregl.Map | null,
  onSelect?: (wp: Waypoint) => void
) {
  if (!map || !searchValue) return [];

  const lower = searchValue.toLowerCase();
  const matches = waypoints.filter(wp => wp.name.toLowerCase().includes(lower));

  if (matches.length === 0) return [];

  const first = matches[0];
  map.flyTo({
    center: [first.longitude, first.latitude],
    zoom: 20,
    essential: true,
  });

  new maplibregl.Popup()
    .setLngLat([first.longitude, first.latitude])
    .setHTML(`<strong>${first.name}</strong>`)
    .addTo(map);

  if (onSelect) onSelect(first);

  return matches
}