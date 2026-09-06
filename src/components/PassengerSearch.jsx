import React, { useState, useEffect } from 'react';
import api from '../api';
import InteractiveMap from './InteractiveMap';
import { 
  Search, 
  MapPin, 
  Clock, 
  Bus, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Navigation, 
  RefreshCw, 
  ChevronRight,
  Info,
  Calendar,
  X,
  Train,
  Ticket,
  Gauge,
  Layers,
  IndianRupee,
  Building2
} from 'lucide-react';

export default function PassengerSearch() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceQuery, setSourceQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [stopQuery, setStopQuery] = useState('');
  const [searchMode, setSearchMode] = useState('all'); // 'all' | 'endpoints' | 'stop'
  const [activeOnly, setActiveOnly] = useState(false);

  // Pan-India Filters
  const [modeFilter, setModeFilter] = useState('all'); // 'all' | 'train' | 'bus' | 'metro'
  const [agencyFilter, setAgencyFilter] = useState('all');

  // Selected Route for Live Tracking & ETAs (SRS 4.3 & 4.4)
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [liveRouteData, setLiveRouteData] = useState(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchMode === 'all' && searchQuery) {
        params.q = searchQuery;
      } else if (searchMode === 'endpoints') {
        if (sourceQuery) params.source = sourceQuery;
        if (destinationQuery) params.destination = destinationQuery;
      } else if (searchMode === 'stop' && stopQuery) {
        params.stop = stopQuery;
      }
      if (modeFilter !== 'all') params.mode = modeFilter;
      if (agencyFilter !== 'all') params.agency = agencyFilter;

      const res = await api.get('/search/routes', { params });
      setRoutes(res.data);
    } catch (err) {
      console.error('Failed to load routes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [searchMode, modeFilter, agencyFilter]);

  // Periodic polling for live vehicle tracking if a route is selected (REQ-18: defined refresh interval)
  useEffect(() => {
    if (!selectedRoute) return;

    const fetchLiveDetails = async () => {
      try {
        const res = await api.get(`/routes/${selectedRoute.id}/live`);
        setLiveRouteData(res.data);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Failed to refresh live tracking', err);
      }
    };

    fetchLiveDetails();
    const interval = setInterval(fetchLiveDetails, 4000); // 4-second refresh (PERF-02 & REQ-18)
    return () => clearInterval(interval);
  }, [selectedRoute]);

  const handleOpenLiveTracking = async (route) => {
    setSelectedRoute(route);
    setLiveLoading(true);
    try {
      const res = await api.get(`/routes/${route.id}/live`);
      setLiveRouteData(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error opening route live tracking', err);
    } finally {
      setLiveLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRoutes();
  };

  const filteredRoutes = activeOnly
    ? routes.filter(r => r.live_status && r.live_status.is_active)
    : routes;

  const quickSearchPresets = [
    { label: 'Delhi ➔ Varanasi (Vande Bharat 22436)', q: '22436' },
    { label: 'Mumbai ➔ Delhi (Rajdhani 12952)', q: '12952' },
    { label: 'Bengaluru ➔ Mysuru (KSRTC FlyBus)', q: 'KA-01' },
    { label: 'Pune ➔ Mumbai (MSRTC Shivneri)', q: 'MH-12' },
    { label: 'Howrah ➔ Chennai (Coromandel 12841)', q: '12841' },
    { label: 'Delhi IGI Airport Express (EX-101)', q: 'EX-101' }
  ];

  const agencyOptions = [
    { label: 'All Agencies', value: 'all' },
    { label: 'Indian Railways (IRCTC)', value: 'Indian Railways' },
    { label: 'KSRTC (Karnataka)', value: 'KSRTC' },
    { label: 'MSRTC (Maharashtra)', value: 'MSRTC' },
    { label: 'DTC (Delhi Transport)', value: 'DTC' },
    { label: 'BMTC (Bengaluru City)', value: 'BMTC' },
    { label: 'Kolkata Metro', value: 'Kolkata Metro' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero / Header Section */}
      <div className="bg-gradient-to-r from-ivory-100 via-[#FAF8F5] to-ivory-100 rounded-2xl p-6 md:p-8 border border-ivory-300 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sienna-100 text-sienna-800 text-xs font-semibold mb-3 border border-sienna-200">
            <Train className="w-3.5 h-3.5" />
            <span>Pan-India Transit Network (SRS 4.2 - 4.4)</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#231E1C] tracking-tight">
            Live Pan-India Transit & Route Tracker
          </h1>
          <p className="text-stone-600 mt-2 text-base leading-relaxed">
            Real-time GPS tracking across Indian Railways (IRCTC), State Road Transport Corporations (KSRTC, MSRTC, DTC, BMTC), and rapid Metro lines.
          </p>
        </div>

        {/* Quick Corridor Presets */}
        <div className="relative z-10 mt-5 pt-4 border-t border-ivory-300/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-600">Quick Corridors:</span>
          {quickSearchPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchMode('all');
                setSearchQuery(preset.q);
                api.get('/search/routes', { params: { q: preset.q } }).then(res => setRoutes(res.data));
              }}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-ivory-300 text-stone-800 transition"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Route Search Form (REQ-10, REQ-11, REQ-12) */}
      <div className="bg-white rounded-xl border border-ivory-300 shadow-sm p-5 space-y-4">
        {/* Search Mode Tabs & Pan-India Mode Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ivory-200 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-ivory-100 p-1 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setSearchMode('all')}
                className={`px-3 py-1.5 rounded-md transition ${
                  searchMode === 'all'
                    ? 'bg-white text-sienna-800 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Service / Route No (REQ-10)
              </button>
              <button
                type="button"
                onClick={() => setSearchMode('endpoints')}
                className={`px-3 py-1.5 rounded-md transition ${
                  searchMode === 'endpoints'
                    ? 'bg-white text-sienna-800 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Source & Destination (REQ-11)
              </button>
              <button
                type="button"
                onClick={() => setSearchMode('stop')}
                className={`px-3 py-1.5 rounded-md transition ${
                  searchMode === 'stop'
                    ? 'bg-white text-sienna-800 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Junction / Stop Name (REQ-12)
              </button>
            </div>

            {/* Mode Filter Pills */}
            <div className="flex items-center gap-1 bg-ivory-100 p-1 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setModeFilter('all')}
                className={`px-2.5 py-1 rounded-md transition ${modeFilter === 'all' ? 'bg-white text-sienna-800 font-bold' : 'text-stone-600'}`}
              >
                All Modes
              </button>
              <button
                type="button"
                onClick={() => setModeFilter('train')}
                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${modeFilter === 'train' ? 'bg-white text-blue-800 font-bold' : 'text-stone-600'}`}
              >
                <Train className="w-3 h-3 text-blue-700" />
                Trains
              </button>
              <button
                type="button"
                onClick={() => setModeFilter('bus')}
                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${modeFilter === 'bus' ? 'bg-white text-amber-800 font-bold' : 'text-stone-600'}`}
              >
                <Bus className="w-3 h-3 text-amber-700" />
                Buses
              </button>
              <button
                type="button"
                onClick={() => setModeFilter('metro')}
                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${modeFilter === 'metro' ? 'bg-white text-emerald-800 font-bold' : 'text-stone-600'}`}
              >
                <Navigation className="w-3 h-3 text-emerald-700" />
                Metro
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
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

            <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
                className="rounded border-stone-300 text-sienna-600 focus:ring-sienna-500 w-4 h-4"
              />
              <span>Live Trips Only ({routes.filter(r => r.live_status?.is_active).length})</span>
            </label>
          </div>
        </div>

        {/* Inputs based on Mode */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {searchMode === 'all' && (
            <div className="md:col-span-10 relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search train/bus number (e.g. 22436, 12952, KA-01) or service name (e.g. Vande Bharat, Shivneri, FlyBus)..."
                className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-ivory-300 bg-[#FAF8F5] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-sienna-500/20 focus:border-sienna-500"
              />
            </div>
          )}

          {searchMode === 'endpoints' && (
            <>
              <div className="md:col-span-5 relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sienna-600" />
                <input
                  type="text"
                  value={sourceQuery}
                  onChange={(e) => setSourceQuery(e.target.value)}
                  placeholder="Origin Station/Terminal (e.g. New Delhi, Bengaluru, Mumbai CSMT)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ivory-300 bg-[#FAF8F5] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-sienna-500/20 focus:border-sienna-500"
                />
              </div>
              <div className="md:col-span-5 relative">
                <Navigation className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-600" />
                <input
                  type="text"
                  value={destinationQuery}
                  onChange={(e) => setDestinationQuery(e.target.value)}
                  placeholder="Destination Station/Terminal (e.g. Varanasi, Mysuru, Pune)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ivory-300 bg-[#FAF8F5] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-sienna-500/20 focus:border-sienna-500"
                />
              </div>
            </>
          )}

          {searchMode === 'stop' && (
            <div className="md:col-span-10 relative">
              <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stormy-500" />
              <input
                type="text"
                value={stopQuery}
                onChange={(e) => setStopQuery(e.target.value)}
                placeholder="Enter any junction name along the corridor (e.g. Kanpur Central, Prayagraj, Mandya, Lonavala)..."
                className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-ivory-300 bg-[#FAF8F5] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-sienna-500/20 focus:border-sienna-500"
              />
            </div>
          )}

          <div className="md:col-span-2 flex items-center gap-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-sienna-500 hover:bg-sienna-600 text-white font-semibold text-sm shadow-sm transition"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
            {(searchQuery || sourceQuery || destinationQuery || stopQuery || modeFilter !== 'all' || agencyFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSourceQuery('');
                  setDestinationQuery('');
                  setStopQuery('');
                  setModeFilter('all');
                  setAgencyFilter('all');
                  fetchRoutes();
                }}
                className="p-2.5 rounded-lg border border-ivory-300 hover:bg-ivory-100 text-stone-600"
                title="Reset search filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Main Content Grid: Routes List & Live Tracking Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Matching Routes */}
        <div className={`${selectedRoute ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              National Transit Corridors ({filteredRoutes.length})
            </h2>
            <button
              onClick={fetchRoutes}
              className="text-xs text-stormy-600 hover:text-sienna-600 flex items-center gap-1 font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white rounded-xl border border-ivory-300">
              <RefreshCw className="w-6 h-6 text-sienna-500 animate-spin mx-auto mb-2" />
              <p className="text-sm text-stone-600">Retrieving transit corridors and live GPS telemetry...</p>
            </div>
          ) : filteredRoutes.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-dashed border-ivory-400 space-y-3">
              <div className="w-12 h-12 rounded-full bg-ivory-100 text-stormy-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-stone-900">No Services Found</h3>
              <p className="text-sm text-stone-500 max-w-sm mx-auto">
                No matching transit routes exist for your criteria. Try adjusting the mode or agency filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSourceQuery('');
                  setDestinationQuery('');
                  setStopQuery('');
                  setModeFilter('all');
                  setAgencyFilter('all');
                  setActiveOnly(false);
                  fetchRoutes();
                }}
                className="px-4 py-2 text-xs font-semibold text-sienna-700 bg-sienna-50 hover:bg-sienna-100 rounded-lg transition"
              >
                Clear Filters & Show All Services
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRoutes.map((route) => {
                const isActive = route.live_status && route.live_status.is_active;
                const isDelayed = isActive && (route.live_status.delay_minutes >= 5);
                const isSelected = selectedRoute?.id === route.id;
                const mode = route.mode || 'bus';

                return (
                  <div
                    key={route.id}
                    className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                      isSelected
                        ? 'border-sienna-500 shadow-md ring-1 ring-sienna-500/20'
                        : 'border-ivory-300 hover:border-ivory-400 shadow-2xs'
                    }`}
                  >
                    <div className="p-5 space-y-4">
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sienna-100 text-sienna-800 border border-sienna-200">
                              {route.route_no}
                            </span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-ivory-100 text-stone-700 border border-ivory-200">
                              {route.agency}
                            </span>
                            <span className="text-xs text-stone-500">
                              {route.distance_km} km • {route.stops?.length || 0} Stops
                            </span>
                          </div>
                          <h3 className="font-serif text-lg font-bold text-stone-900 mt-1 flex items-center gap-2">
                            {mode === 'train' && <Train className="w-4 h-4 text-blue-800 shrink-0" />}
                            {mode === 'metro' && <Navigation className="w-4 h-4 text-emerald-800 shrink-0" />}
                            {mode === 'bus' && <Bus className="w-4 h-4 text-amber-800 shrink-0" />}
                            <span>{route.route_name}</span>
                          </h3>
                        </div>

                        {/* Live Vehicle Status Badge */}
                        <div>
                          {isActive ? (
                            <div className="flex flex-col items-end">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                isDelayed
                                  ? 'bg-sienna-100 text-sienna-800 border border-sienna-200'
                                  : 'bg-sage-100 text-sage-800 border border-sage-200'
                              }`}>
                                <span className={`w-2 h-2 rounded-full animate-ping ${isDelayed ? 'bg-sienna-500' : 'bg-sage-500'}`} />
                                {isDelayed ? `Delayed (+${route.live_status.delay_minutes}m)` : 'Live & On Schedule'}
                              </span>
                              <span className="text-[10px] text-stone-500 font-mono mt-0.5">
                                {route.live_status.vehicle?.reg_no}
                              </span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-stormy-100 text-stormy-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-stormy-400" />
                              Scheduled Service
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Route Path & Key Metrics */}
                      <div className="bg-[#FAF8F5] rounded-lg p-3 border border-ivory-200 text-xs space-y-2">
                        <div className="flex items-center justify-between text-stone-700 font-medium">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-sienna-500" />
                            <span className="font-semibold">{route.source}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-sage-600" />
                            <span className="font-semibold">{route.destination}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-ivory-200 text-[11px] text-stone-600">
                          <span>Typical Duration: <strong>{route.typical_duration || 'N/A'}</strong></span>
                          <span>Standard Fare: <strong className="text-sienna-800">₹{route.fare_inr || 50}</strong></span>
                          {route.live_status?.platform && (
                            <span>Platform: <strong>{route.live_status.platform}</strong></span>
                          )}
                        </div>
                      </div>

                      {/* Active Telemetry Details */}
                      {isActive && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-ivory-200">
                          <div>
                            <span className="text-stone-500">Speed:</span>{' '}
                            <strong className="text-stone-800">{route.live_status.current_location?.speed || 34} km/h</strong>
                          </div>
                          <div>
                            <span className="text-stone-500">Occupancy:</span>{' '}
                            <strong className="text-stone-800">{route.live_status.occupancy_percent || 75}%</strong>
                          </div>
                          <div className="text-right sm:text-left col-span-2 sm:col-span-1">
                            <span className="text-stone-500">Next Stop:</span>{' '}
                            <strong className="text-stone-800 truncate">{route.live_status.next_stop || 'En Route'}</strong>
                          </div>
                        </div>
                      )}

                      {/* Card Action Button */}
                      <div className="pt-2 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleOpenLiveTracking(route)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                            isSelected
                              ? 'bg-sienna-600 text-white'
                              : 'bg-ivory-100 hover:bg-ivory-200 text-sienna-900 border border-ivory-300'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          {isSelected ? 'Viewing Live Tracking' : 'Track on Map & View ETAs'}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Live Tracking Map & Stop ETAs Inspector (SRS 4.3 & 4.4) */}
        {selectedRoute && (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-ivory-300 shadow-md p-6 space-y-6 sticky top-24">
            {/* Inspector Header */}
            <div className="flex items-start justify-between border-b border-ivory-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sienna-100 text-sienna-800">
                    {selectedRoute.route_no}
                  </span>
                  <span className="text-xs text-stone-500">
                    {selectedRoute.source} → {selectedRoute.destination}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  {selectedRoute.route_name}
                </h3>
                <div className="text-xs text-stone-500 mt-0.5">
                  Operated by <strong>{selectedRoute.agency}</strong> • {selectedRoute.zone} Zone • Fare: <strong>₹{selectedRoute.fare_inr}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRoute(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-ivory-100"
                title="Close Live Tracking"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Delay Warning Notification */}
            {liveRouteData?.active_trip?.delay_minutes >= 5 && (
              <div className="p-4 rounded-xl bg-sienna-50 border border-sienna-200 text-sienna-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-sienna-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <strong className="text-sm font-semibold text-sienna-900 block">
                    Operational Delay Advisory
                  </strong>
                  <p>
                    Vehicle <strong>{liveRouteData.active_trip.vehicle?.reg_no}</strong> is running 
                    approximately <strong>{liveRouteData.active_trip.delay_minutes} minutes</strong> behind schedule ({liveRouteData.active_trip.delay_reason || 'traffic congestion'}).
                  </p>
                </div>
              </div>
            )}

            {/* Live Interactive Map */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
                  Live GPS Map Telemetry (REQ-17)
                </span>
                <span>
                  Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>

              <InteractiveMap
                routes={liveRouteData ? [liveRouteData.route] : []}
                vehicles={
                  liveRouteData?.active_trip
                    ? [
                        {
                          id: liveRouteData.active_trip.id,
                          reg_no: liveRouteData.active_trip.vehicle?.reg_no || 'Transit',
                          route_no: selectedRoute.route_no,
                          route_name: selectedRoute.route_name,
                          agency: selectedRoute.agency,
                          mode: selectedRoute.mode,
                          driver_name: liveRouteData.active_trip.driver?.name,
                          speed: liveRouteData.active_trip.current_location?.speed,
                          delay_minutes: liveRouteData.active_trip.delay_minutes,
                          current_location: liveRouteData.active_trip.current_location,
                          next_stop: liveRouteData.active_trip.next_stop?.name
                        }
                      ]
                    : []
                }
                selectedRouteId={selectedRoute.id}
                height="340px"
              />
            </div>

            {/* Stop Sequence & Estimated Arrival Time (ETA) Calculation (REQ-21 to REQ-24) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sienna-600" />
                  Corridor Stops & Live ETAs
                </h4>
                <span className="text-xs text-stone-500">
                  Platform {liveRouteData?.active_trip?.platform || '1'}
                </span>
              </div>

              <div className="border border-ivory-200 rounded-xl divide-y divide-ivory-200 overflow-hidden bg-[#FAF8F5]">
                {liveRouteData?.route?.stops?.map((stop, idx) => {
                  const isNextStop = liveRouteData.active_trip?.next_stop?.id === stop.id;

                  return (
                    <div
                      key={stop.id}
                      className={`p-3.5 flex items-center justify-between transition ${
                        isNextStop ? 'bg-sage-50/70 border-l-4 border-l-sage-600' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isNextStop ? 'bg-sage-600 text-white' : 'bg-ivory-200 text-stone-700'
                        }`}>
                          {stop.sequence || idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-stone-900">{stop.name}</span>
                            {isNextStop && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sage-100 text-sage-800">
                                NEXT STOP
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-stone-500 font-mono">
                            {stop.code} • {stop.location?.lat.toFixed(3)}°, {stop.location?.lng.toFixed(3)}°
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-semibold text-stone-900 font-mono">
                          {stop.eta}
                        </div>
                        {stop.eta_minutes && (
                          <div className="text-xs text-stone-500">
                            ~{stop.eta_minutes} mins
                          </div>
                        )}
                        {stop.is_delayed && (
                          <span className="text-[10px] font-semibold text-sienna-700 flex items-center gap-0.5 justify-end">
                            <AlertTriangle className="w-3 h-3" /> Delay
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vehicle & Pilot Info Card */}
            {liveRouteData?.active_trip && (
              <div className="p-4 rounded-xl bg-ivory-50 border border-ivory-200 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-stone-500 block">Vehicle Model</span>
                  <span className="font-semibold text-stone-800">{liveRouteData.active_trip.vehicle?.model}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Registration / Coach</span>
                  <span className="font-mono font-semibold text-stone-800">{liveRouteData.active_trip.vehicle?.reg_no}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Pilot / Crew</span>
                  <span className="font-semibold text-stone-800">{liveRouteData.active_trip.driver?.name}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Live Speed</span>
                  <span className="font-semibold text-stone-800">{liveRouteData.active_trip.current_location?.speed || 40} km/h</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
