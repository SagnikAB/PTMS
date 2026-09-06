import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function InteractiveMap({
  center = [22.5000, 79.5000],
  zoom = 5,
  routes = [],
  vehicles = [],
  selectedRouteId = null,
  selectedVehicleId = null,
  height = '540px',
  onSelectVehicle,
  className = ''
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const regionPresets = [
    { label: 'All India', coords: [22.5000, 79.5000], z: 5 },
    { label: 'North (Delhi NCR)', coords: [28.6139, 77.2090], z: 10 },
    { label: 'South (Bengaluru/Mysuru)', coords: [12.9716, 77.5946], z: 9 },
    { label: 'West (Mumbai/Pune)', coords: [18.9800, 73.0500], z: 9 },
    { label: 'East (Kolkata/Howrah)', coords: [22.5726, 88.3639], z: 11 }
  ];

  const jumpToRegion = (coords, z) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, z, { duration: 1.2 });
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap high-clarity tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Layers (Routes, Stops, Vehicles)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();
    const boundsPoints = [];

    // Filter routes if selectedRouteId is set
    const routesToRender = selectedRouteId
      ? routes.filter(r => r.id === selectedRouteId)
      : routes;

    // Render Routes & Stops
    routesToRender.forEach((route) => {
      if (!route.stops || route.stops.length === 0) return;

      const stopLatLngs = route.stops
        .filter(s => s && s.location && typeof s.location.lat === 'number')
        .map(s => [s.location.lat, s.location.lng]);

      if (stopLatLngs.length >= 2) {
        // Draw Route Polyline with Burnt Sienna / Stormy Sky theme
        const isSelected = selectedRouteId === route.id;
        const polyline = L.polyline(stopLatLngs, {
          color: isSelected ? '#984216' : '#78898F',
          weight: isSelected ? 5 : 3.5,
          opacity: isSelected ? 0.9 : 0.6,
          dashArray: isSelected ? undefined : '6, 6'
        });

        polyline.bindPopup(`
          <div class="p-1">
            <span class="text-xs font-semibold px-2 py-0.5 rounded bg-sienna-100 text-sienna-800 font-mono">${route.route_no}</span>
            <h4 class="font-serif font-bold text-sm text-stone-900 mt-1">${route.route_name}</h4>
            <p class="text-xs text-stone-600 mt-0.5">${route.stops.length} Transit Stops</p>
          </div>
        `);
        layerGroup.addLayer(polyline);

        stopLatLngs.forEach(pt => boundsPoints.push(pt));
      }

      // Render Stop Markers
      route.stops.forEach((stop, idx) => {
        if (!stop.location) return;
        const stopLat = stop.location.lat;
        const stopLng = stop.location.lng;

        const stopIcon = L.divIcon({
          className: 'custom-stop-icon',
          html: `
            <div style="
              width: 22px;
              height: 22px;
              background-color: #FAF8F5;
              border: 2px solid #78898F;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: 700;
              color: #4C5A5F;
              box-shadow: 0 2px 5px rgba(0,0,0,0.15);
            ">
              ${stop.sequence || idx + 1}
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const marker = L.marker([stopLat, stopLng], { icon: stopIcon });
        marker.bindPopup(`
          <div class="p-1">
            <div class="text-[10px] uppercase tracking-wider text-stormy font-bold">Transit Stop #${stop.sequence || idx + 1}</div>
            <h4 class="font-serif font-bold text-sm text-stone-900 mt-0.5">${stop.name}</h4>
            <div class="text-xs text-stone-500 font-mono mt-1">${stopLat.toFixed(4)}° N, ${stopLng.toFixed(4)}° E</div>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    });

    // Render Vehicle Markers
    vehicles.forEach(veh => {
      if (!veh.current_location || typeof veh.current_location.lat !== 'number') return;
      const vLat = veh.current_location.lat;
      const vLng = veh.current_location.lng;
      boundsPoints.push([vLat, vLng]);

      const isDelayed = (veh.delay_minutes || 0) >= 5;
      const mode = (veh.mode || (veh.route_no?.includes('12') || veh.route_no?.includes('22') ? 'train' : 'bus')).toLowerCase();

      // Theme colors per mode: Indian Railways (Deep Navy / Burnt Sienna), Metro (Emerald), Bus (Warm Terracotta / Sage)
      let markerColor = '#8D957E';
      if (isDelayed) {
        markerColor = '#984216';
      } else if (mode === 'train') {
        markerColor = '#1E3A8A';
      } else if (mode === 'metro') {
        markerColor = '#059669';
      } else {
        markerColor = '#C2410C';
      }

      const pulseColor = isDelayed ? 'rgba(152, 66, 22, 0.35)' : 'rgba(30, 58, 138, 0.35)';

      const modeIconSvg = mode === 'train' ? `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="16" height="16" x="4" y="3" rx="2"></rect>
          <path d="M4 11h16"></path>
          <path d="M12 3v8"></path>
          <path d="m8 19-2 3"></path>
          <path d="m16 19 2 3"></path>
          <circle cx="8" cy="15" r="1"></circle>
          <circle cx="16" cy="15" r="1"></circle>
        </svg>
      ` : mode === 'metro' ? `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="16" height="17" x="4" y="3" rx="3"></rect>
          <path d="M4 11h16"></path>
          <path d="M9 15h6"></path>
          <path d="M7 20l-2 2"></path>
          <path d="M17 20l2 2"></path>
        </svg>
      ` : `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 6v6"></path>
          <path d="M15 6v6"></path>
          <path d="M2 12h19.6"></path>
          <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.8-.7-1.4-1.5-1.4H3.5c-.8 0-1.5.6-1.5 1.4 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"></path>
          <circle cx="7" cy="18" r="2"></circle>
          <circle cx="17" cy="18" r="2"></circle>
        </svg>
      `;

      const vehicleIcon = L.divIcon({
        className: 'custom-vehicle-icon',
        html: `
          <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
            <div style="
              position: absolute;
              width: 42px;
              height: 42px;
              border-radius: 50%;
              background: ${pulseColor};
              animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              position: relative;
              width: 34px;
              height: 34px;
              background-color: ${markerColor};
              color: #FAF8F5;
              border: 2px solid #FAF8F5;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              cursor: pointer;
            ">
              ${modeIconSvg}
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const vMarker = L.marker([vLat, vLng], { icon: vehicleIcon });

      const popupContent = `
        <div class="p-2.5 min-w-[220px]">
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800">${veh.reg_no}</span>
            <span class="text-[11px] font-medium px-2 py-0.5 rounded-full ${
              isDelayed ? 'bg-sienna-100 text-sienna-800' : 'bg-sage-100 text-sage-800'
            }">
              ${isDelayed ? `Delayed (+${veh.delay_minutes}m)` : 'On Schedule'}
            </span>
          </div>
          ${veh.agency ? `<div class="text-[10px] uppercase font-bold tracking-wider text-sienna-700">${veh.agency}</div>` : ''}
          ${veh.route_no ? `<div class="text-xs font-bold text-stone-900 mt-0.5">${veh.route_no}: ${veh.route_name || ''}</div>` : ''}
          ${veh.driver_name ? `<div class="text-xs text-stone-500 mt-1">Pilot/Driver: <strong class="text-stone-700">${veh.driver_name}</strong></div>` : ''}
          <div class="text-xs text-stone-600 mt-1.5 pt-1.5 border-t border-stone-200 flex justify-between">
            <span>Speed: <strong class="text-stone-900">${veh.speed || 32} km/h</strong></span>
            ${veh.next_stop ? `<span>Next: <strong class="text-stone-900">${veh.next_stop}</strong></span>` : ''}
          </div>
        </div>
      `;

      vMarker.bindPopup(popupContent);

      if (onSelectVehicle) {
        vMarker.on('click', () => onSelectVehicle(veh));
      }

      layerGroup.addLayer(vMarker);
    });

    // Auto fit bounds if points exist and route selected
    if (selectedRouteId && boundsPoints.length > 0) {
      map.fitBounds(L.latLngBounds(boundsPoints), { padding: [40, 40], maxZoom: 15 });
    }
  }, [routes, vehicles, selectedRouteId]);

  return (
    <div className={`relative w-full rounded-xl overflow-hidden border border-ivory-300 shadow-sm ${className}`}>
      {/* Pan-India Region Preset Pills */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap gap-1.5 bg-white/90 backdrop-blur p-1.5 rounded-xl border border-ivory-300 shadow-sm">
        {regionPresets.map((reg, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => jumpToRegion(reg.coords, reg.z)}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-ivory-100 hover:bg-sienna-100 hover:text-sienna-900 text-stone-700 transition"
          >
            {reg.label}
          </button>
        ))}
      </div>

      <div
        ref={mapContainerRef}
        style={{ height }}
        className="w-full"
      />
    </div>
  );
}
