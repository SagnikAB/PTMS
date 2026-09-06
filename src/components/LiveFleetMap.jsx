import React, { useState, useEffect } from 'react';
import api from '../api';
import InteractiveMap from './InteractiveMap';
import { 
  Bus, 
  MapPin, 
  RefreshCw, 
  Radio, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Gauge, 
  User, 
  Train, 
  Layers, 
  Filter,
  CheckCircle2,
  Navigation
} from 'lucide-react';

export default function LiveFleetMap() {
  const [routes, setRoutes] = useState([]);
  const [activeTrips, setActiveTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Nationwide Filter States
  const [modeFilter, setModeFilter] = useState('all'); // 'all' | 'train' | 'bus' | 'metro'
  const [agencyFilter, setAgencyFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');

  const fetchData = async () => {
    try {
      const [routesRes, tripsRes] = await Promise.all([
        api.get('/search/routes'),
        api.get('/trips/active')
      ]);
      setRoutes(Array.isArray(routesRes.data) ? routesRes.data : []);
      setActiveTrips(Array.isArray(tripsRes.data) ? tripsRes.data : []);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load fleet map data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh interval (REQ-18)
    const timer = setInterval(fetchData, 4000);
    return () => clearInterval(timer);
  }, []);

  // Filtered trips
  const filteredTrips = activeTrips.filter(trip => {
    const tripMode = trip.route?.mode || trip.vehicle?.mode || 'bus';
    const tripAgency = trip.route?.agency || trip.vehicle?.agency || '';
    const tripZone = trip.route?.zone || '';

    if (modeFilter !== 'all' && tripMode !== modeFilter) return false;
    if (agencyFilter !== 'all' && !tripAgency.toLowerCase().includes(agencyFilter.toLowerCase())) return false;
    if (zoneFilter !== 'all' && !tripZone.toLowerCase().includes(zoneFilter.toLowerCase())) return false;
    if (selectedRouteId && trip.route?.id !== selectedRouteId) return false;

    return true;
  });

  const vehiclesForMap = filteredTrips.map(trip => ({
    id: trip.trip_id,
    trip_id: trip.trip_id,
    reg_no: trip.vehicle?.reg_no || 'Transit',
    route_no: trip.route?.route_no,
    route_name: trip.route?.route_name,
    agency: trip.route?.agency || trip.vehicle?.agency,
    mode: trip.route?.mode || trip.vehicle?.mode || 'bus',
    driver_name: trip.driver?.name,
    speed: trip.current_location?.speed || 30,
    delay_minutes: trip.delay_minutes || 0,
    current_location: trip.current_location,
    next_stop: trip.next_stop?.name
  }));

  const filteredRoutes = routes.filter(r => {
    if (modeFilter !== 'all' && r.mode !== modeFilter) return false;
    if (agencyFilter !== 'all' && !r.agency?.toLowerCase().includes(agencyFilter.toLowerCase())) return false;
    if (zoneFilter !== 'all' && !r.zone?.toLowerCase().includes(zoneFilter.toLowerCase())) return false;
    if (selectedRouteId && r.id !== selectedRouteId) return false;
    return true;
  });

  const agencyOptions = [
    { label: 'All Agencies', value: 'all' },
    { label: 'Indian Railways (IR)', value: 'Indian Railways' },
    { label: 'KSRTC (Karnataka)', value: 'KSRTC' },
    { label: 'MSRTC (Maharashtra)', value: 'MSRTC' },
    { label: 'DTC (Delhi)', value: 'DTC' },
    { label: 'BMTC (Bengaluru)', value: 'BMTC' },
    { label: 'Kolkata Metro', value: 'Kolkata Metro' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Fleet Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-semibold mb-2 border border-sage-200">
            <Radio className="w-3.5 h-3.5 text-sage-600 animate-pulse" />
            <span>Pan-India GPS Broadcasting Network (SRS 4.3)</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
            Live Pan-India Fleet Map
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Real-time multi-vehicle positional telemetry across Indian Railways, State Roadways, and Metro corridors.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-[#FAF8F5] rounded-xl border border-ivory-200 text-center">
            <span className="text-xs text-stone-500 block">Active Vehicles</span>
            <span className="font-serif font-bold text-xl text-stone-900">
              {filteredTrips.length}
            </span>
          </div>
          <div className="px-4 py-2 bg-[#FAF8F5] rounded-xl border border-ivory-200 text-center">
            <span className="text-xs text-stone-500 block">Corridor Routes</span>
            <span className="font-serif font-bold text-xl text-sienna-700">
              {filteredRoutes.length}
            </span>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="p-3 bg-ivory-100 hover:bg-ivory-200 text-stone-700 rounded-xl transition"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-sienna-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Nationwide Filter Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-ivory-300 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 bg-ivory-100 p-1 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setModeFilter('all')}
              className={`px-3 py-1.5 rounded-md transition ${
                modeFilter === 'all'
                  ? 'bg-white text-sienna-800 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Transit Modes
            </button>
            <button
              type="button"
              onClick={() => setModeFilter('train')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition ${
                modeFilter === 'train'
                  ? 'bg-white text-sienna-800 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Train className="w-3.5 h-3.5 text-blue-700" />
              Railways & Vande Bharat
            </button>
            <button
              type="button"
              onClick={() => setModeFilter('bus')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition ${
                modeFilter === 'bus'
                  ? 'bg-white text-sienna-800 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bus className="w-3.5 h-3.5 text-amber-700" />
              State Roadways (KSRTC/MSRTC)
            </button>
            <button
              type="button"
              onClick={() => setModeFilter('metro')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition ${
                modeFilter === 'metro'
                  ? 'bg-white text-sienna-800 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-700" />
              Metro Systems
            </button>
          </div>

          {/* Agency & Zone Dropdowns */}
          <div className="flex items-center gap-2">
            <select
              value={agencyFilter}
              onChange={(e) => setAgencyFilter(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5] text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-sienna-500"
            >
              {agencyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5] text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-sienna-500"
            >
              <option value="all">All Regional Zones</option>
              <option value="Northern">Northern Zone</option>
              <option value="Southern">Southern Zone</option>
              <option value="Western">Western Zone</option>
              <option value="Eastern">Eastern Zone</option>
            </select>

            {(modeFilter !== 'all' || agencyFilter !== 'all' || zoneFilter !== 'all' || selectedRouteId) && (
              <button
                type="button"
                onClick={() => {
                  setModeFilter('all');
                  setAgencyFilter('all');
                  setZoneFilter('all');
                  setSelectedRouteId(null);
                  setSelectedVehicle(null);
                }}
                className="text-xs text-sienna-700 hover:underline px-2 py-1"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Map & Vehicle Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map View Area (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <InteractiveMap
            routes={filteredRoutes}
            vehicles={vehiclesForMap}
            selectedRouteId={selectedRouteId}
            selectedVehicleId={selectedVehicle?.trip_id}
            onSelectVehicle={(v) => {
              const fullTrip = activeTrips.find(t => t.trip_id === v.id);
              if (fullTrip) setSelectedVehicle(fullTrip);
            }}
            height="580px"
          />

          {/* Telemetry Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 bg-white p-3 rounded-xl border border-ivory-300">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-900 border border-white"></span>
                Indian Railways
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-700 border border-white"></span>
                State Roadways
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-700 border border-white"></span>
                Rapid Metro
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sienna-600 border border-white"></span>
                Delayed (&gt;5m)
              </span>
            </div>
            <span>Auto-refreshing every 4 seconds • GPS Latency &lt; 350ms</span>
          </div>
        </div>

        {/* Live Vehicles Telemetry Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Vehicle Card */}
          {selectedVehicle ? (
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border-2 border-sienna-500/40 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sienna-700 font-mono">
                    {selectedVehicle.route?.agency || 'TRANSIT'} • {selectedVehicle.route?.mode?.toUpperCase() || 'BUS'}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-stone-900 mt-0.5">
                    {selectedVehicle.vehicle?.reg_no}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVehicle(null)}
                  className="text-xs text-stone-500 hover:text-stone-800"
                >
                  Clear Selection
                </button>
              </div>

              <div className="text-xs text-stone-700 font-medium">
                {selectedVehicle.route?.route_no} - {selectedVehicle.route?.route_name}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded-lg border border-ivory-200">
                  <span className="text-stone-400 block text-[10px]">Speed</span>
                  <span className="font-bold text-stone-800 text-sm">
                    {selectedVehicle.current_location?.speed || 30} km/h
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-ivory-200">
                  <span className="text-stone-400 block text-[10px]">Status</span>
                  <span className={`font-bold text-xs ${
                    selectedVehicle.delay_minutes >= 5 ? 'text-sienna-700' : 'text-sage-700'
                  }`}>
                    {selectedVehicle.delay_minutes >= 5 ? `+${selectedVehicle.delay_minutes}m Delayed` : 'On Schedule'}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-ivory-200">
                  <span className="text-stone-400 block text-[10px]">Pilot / Driver</span>
                  <span className="font-bold text-stone-800 truncate block">
                    {selectedVehicle.driver?.name || 'Assigned Crew'}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-ivory-200">
                  <span className="text-stone-400 block text-[10px]">Next Station</span>
                  <span className="font-bold text-stone-800 truncate block">
                    {selectedVehicle.next_stop?.name || 'En Route'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1">
                <span>Model: {selectedVehicle.vehicle?.model || 'Standard'}</span>
                <span>Capacity: {selectedVehicle.vehicle?.capacity || 50} seats</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-ivory-300 text-xs text-stone-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sienna-600 shrink-0" />
              <span>Click on any vehicle marker on the map or select from below to inspect live telemetry.</span>
            </div>
          )}

          {/* Active Fleet List */}
          <div className="bg-white rounded-2xl border border-ivory-300 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Broadcasting Vehicles ({filteredTrips.length})
              </h3>
              <span className="text-[11px] font-mono text-stone-400">Live GPS</span>
            </div>

            <div className="divide-y divide-ivory-200 max-h-[460px] overflow-y-auto pr-1">
              {filteredTrips.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-500">
                  No transit vehicles match the selected criteria.
                </div>
              ) : (
                filteredTrips.map(trip => {
                  const isDelayed = (trip.delay_minutes || 0) >= 5;
                  const isSelected = selectedVehicle?.trip_id === trip.trip_id;
                  const mode = trip.route?.mode || trip.vehicle?.mode || 'bus';

                  return (
                    <div
                      key={trip.trip_id}
                      onClick={() => {
                        setSelectedVehicle(trip);
                        if (trip.route?.id) setSelectedRouteId(trip.route.id);
                      }}
                      className={`py-3 px-3 rounded-xl cursor-pointer transition ${
                        isSelected ? 'bg-sienna-50 border border-sienna-200' : 'hover:bg-ivory-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            {mode === 'train' && <Train className="w-3.5 h-3.5 text-blue-800" />}
                            {mode === 'metro' && <Navigation className="w-3.5 h-3.5 text-emerald-800" />}
                            {mode === 'bus' && <Bus className="w-3.5 h-3.5 text-amber-800" />}
                            <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-800">
                              {trip.vehicle?.reg_no}
                            </span>
                            <span className="font-mono text-[11px] text-sienna-700 font-bold">
                              {trip.route?.route_no}
                            </span>
                          </div>
                          <h4 className="font-medium text-xs text-stone-900 mt-1">
                            {trip.route?.route_name}
                          </h4>
                          <span className="text-[10px] text-stone-500 block">
                            {trip.route?.agency} • {trip.vehicle?.model}
                          </span>
                        </div>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isDelayed ? 'bg-sienna-100 text-sienna-800' : 'bg-sage-100 text-sage-800'
                        }`}>
                          {isDelayed ? `Delayed (+${trip.delay_minutes}m)` : 'On Schedule'}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Gauge className="w-3 h-3 text-stone-400" />
                          {trip.current_location?.speed || 30} km/h
                        </span>
                        {trip.next_stop && (
                          <span className="text-stone-700 font-medium truncate max-w-[150px]">
                            Next: {trip.next_stop.name}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
