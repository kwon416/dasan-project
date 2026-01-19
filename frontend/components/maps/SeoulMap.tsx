'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface District {
  code: string;
  name: string;
  totalComplaints: number;
}

interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    SIG_CD: string;
    SIG_ENG_NM: string;
    SIG_KOR_NM: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSONCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

interface SeoulMapProps {
  geoData: GeoJSONCollection;
  districts: District[];
  selectedDistrict?: string;
  onDistrictClick?: (code: string) => void;
}

export function SeoulMap({
  geoData,
  districts,
  selectedDistrict,
  onDistrictClick,
}: SeoulMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  // Create a lookup for district data
  const districtLookup = useMemo(() => {
    return districts.reduce(
      (acc, d) => {
        acc[d.code] = d;
        return acc;
      },
      {} as Record<string, District>
    );
  }, [districts]);

  // Get max complaints for color scaling
  const maxComplaints = useMemo(() => {
    return Math.max(...districts.map((d) => d.totalComplaints));
  }, [districts]);

  // Get color based on complaint count
  const getColor = useCallback((complaints: number) => {
    const ratio = complaints / maxComplaints;

    if (ratio > 0.8) return '#08306b';
    if (ratio > 0.6) return '#2171b5';
    if (ratio > 0.4) return '#4292c6';
    if (ratio > 0.2) return '#6baed6';
    return '#c6dbef';
  }, [maxComplaints]);

  // Style function for GeoJSON features
  const getStyle = useCallback((feature: GeoJSONFeature) => {
    const district = districtLookup[feature.properties.SIG_CD];
    const complaints = district?.totalComplaints || 0;
    const isSelected = selectedDistrict === feature.properties.SIG_CD;

    return {
      fillColor: getColor(complaints),
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#ff0000' : '#fff',
      fillOpacity: isSelected ? 0.9 : 0.7,
    };
  }, [districtLookup, selectedDistrict, getColor]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [37.5665, 126.978],
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update GeoJSON layer when data changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing layer
    if (geoJsonLayerRef.current) {
      mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
    }

    // Add new GeoJSON layer
    const geoJsonLayer = L.geoJSON(geoData as GeoJSON.GeoJsonObject, {
      style: getStyle as L.StyleFunction,
      onEachFeature: (feature, layer) => {
        const props = feature.properties as GeoJSONFeature['properties'];
        const district = districtLookup[props.SIG_CD];

        // Add tooltip
        layer.bindTooltip(
          `<strong>${props.SIG_KOR_NM}</strong><br/>민원: ${district?.totalComplaints.toLocaleString() || 0}건`,
          { sticky: true }
        );

        // Add click handler
        layer.on('click', () => {
          onDistrictClick?.(props.SIG_CD);
        });

        // Hover effects
        layer.on('mouseover', (e) => {
          const target = e.target as L.Path;
          target.setStyle({
            weight: 3,
            color: '#ff0000',
            fillOpacity: 0.9,
          });
        });

        layer.on('mouseout', (e) => {
          geoJsonLayer.resetStyle(e.target);
        });
      },
    });

    geoJsonLayer.addTo(mapInstanceRef.current);
    geoJsonLayerRef.current = geoJsonLayer;

    // Fit bounds to Seoul
    mapInstanceRef.current.fitBounds(geoJsonLayer.getBounds());
  }, [geoData, districtLookup, selectedDistrict, onDistrictClick, getStyle]);

  return (
    <div className="relative">
      <div ref={mapRef} className="h-[500px] w-full rounded-lg" />

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <p className="text-xs font-medium mb-2">민원 건수</p>
        <div className="space-y-1">
          {[
            { color: '#08306b', label: '매우 많음' },
            { color: '#2171b5', label: '많음' },
            { color: '#4292c6', label: '보통' },
            { color: '#6baed6', label: '적음' },
            { color: '#c6dbef', label: '매우 적음' },
          ].map((item) => (
            <div key={item.color} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
