"use client";

import React, { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type LibraryStop = {
  id: number;
  name: string;
  coords: [number, number];
  description: string;
  college: string;
  status: "Active" | "Special Stop";
  hasStamp: boolean;
  features: string[];
};

function MapController({
  selectedLibrary,
  isSidebarOpen,
}: {
  selectedLibrary: LibraryStop | null;
  isSidebarOpen: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedLibrary) {
      map.setView(selectedLibrary.coords, 17);
    }
  }, [map, selectedLibrary]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => clearTimeout(timerId);
  }, [map, isSidebarOpen]);

  return null;
}

export default function LibraryMap({
  libraries,
  selectedLibrary,
  isSidebarOpen,
  showStampPinsOnly,
  visitedIds,
  onLibraryClick,
}: {
  libraries: LibraryStop[];
  selectedLibrary: LibraryStop | null;
  isSidebarOpen: boolean;
  showStampPinsOnly: boolean;
  visitedIds: number[];
  onLibraryClick: (lib: LibraryStop) => void;
}) {
  const visitedSet = useMemo(() => new Set(visitedIds), [visitedIds]);

  const markerIcons = useMemo(
    () => ({
      green: L.divIcon({
        className: "custom-div-icon",
        html: `<div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white" style="background:#014421"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      }),
      red: L.divIcon({
        className: "custom-div-icon",
        html: `<div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white" style="background:#7b1113"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      }),
      gray: L.divIcon({
        className: "custom-div-icon",
        html: `<div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white" style="background:#64748b"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      }),
    }),
    [],
  );

  const getMarkerIcon = (lib: LibraryStop) => {
    if (!lib.hasStamp) {
      return markerIcons.gray;
    }

    return visitedSet.has(lib.id) ? markerIcons.green : markerIcons.red;
  };

  return (
    <MapContainer
      center={[14.6535, 121.0715]}
      zoom={16}
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
      />
      <MapController
        selectedLibrary={selectedLibrary}
        isSidebarOpen={isSidebarOpen}
      />
      {libraries
        .filter((lib) => !showStampPinsOnly || lib.hasStamp)
        .map((lib) => (
          <Marker
            key={lib.id}
            position={lib.coords}
            icon={getMarkerIcon(lib)}
            eventHandlers={{
              click: () => onLibraryClick(lib),
            }}
          />
        ))}
    </MapContainer>
  );
}
