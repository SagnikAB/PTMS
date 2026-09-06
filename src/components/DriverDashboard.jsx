import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  Bus, 
  Play, 
  Square, 
  MapPin, 
  Gauge, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  ShieldCheck, 
  Navigation,
  RefreshCw,
  Sliders,
  Calendar
} from 'lucide-react';

export default function DriverDashboard() {
  const { user } = useAuth();
  const [assignmentData, setAssignmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [startingTrip, setStartingTrip] = useState(false);
  const [endingTrip, setEndingTrip] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Active Trip State
  const [activeTrip, setActiveTrip] = useState(null);
  const [delayInput, setDelayInput] = useState(0);
  const [autoSimulate, setAutoSimulate] = useState(true);
  const [lastBroadcastTime, setLastBroadcastTime] = useState(null);

  const fetchDriverAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/driver/assigned-details');
      setAssignmentData(res.data);
      if (res.data.assigned_vehicle) {
        setSelectedVehicleId(res.data.assigned_vehicle.id);
      }
      if (res.data.assigned_route) {
        setSelectedRouteId(res.data.assigned_route.id);
      }
      if (res.data.active_trip) {
        setActiveTrip(res.data.active_trip);
        setDelayInput(res.data.active_trip.delay_minutes || 0);
      } else {
        setActiveTrip(null);
      }
    } catch (err) {
      console.error('Error fetching driver assignments', err);
      setErrorMessage(err.response?.data?.detail || 'Failed to load driver assignment details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverAssignments();
  }, []);

  // Location broadcasting / simulation ticker when active trip is running (REQ-27)
  useEffect(() => {
    if (!activeTrip || !autoSimulate) return;

    const broadcastInterval = setInterval(async () => {
      try {
        // Simulate minor progress
        const currentLat = activeTrip.current_location.lat + (Math.random() - 0.5) * 0.001;
        const currentLng = activeTrip.current_location.lng + (Math.random() - 0.5) * 0.001;
        const currentSpeed = Math.round(28 + Math.random() * 18);

        const res = await api.post('/trips/update-location', {
          trip_id: activeTrip.id,
          lat: currentLat,
          lng: currentLng,
          speed: currentSpeed,
          delay_minutes: delayInput
        });

        setActiveTrip(prev => prev ? {
          ...prev,
          current_location: res.data.current_location,
          delay_minutes: res.data.delay_minutes
        } : null);
        setLastBroadcastTime(new Date());
      } catch (err) {
        console.error('Broadcast ping error', err);
      }
    }, 4000);

    return () => clearInterval(broadcastInterval);
  }, [activeTrip, autoSimulate, delayInput]);

  const handleStartTrip = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setStartingTrip(true);

    try {
      const res = await api.post('/trips/start', {
        vehicle_id: selectedVehicleId,
        route_id: selectedRouteId
      });
      setActiveTrip(res.data.trip);
      setSuccessMessage('Trip initiated successfully. GPS coordinates are now streaming.');
      fetchDriverAssignments();
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to initiate trip');
    } finally {
      setStartingTrip(false);
    }
  };

  const handleEndTrip = async () => {
    if (!window.confirm('Are you sure you want to conclude this trip? The vehicle will be marked as idle and historical logs recorded.')) {
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setEndingTrip(true);

    try {
      const res = await api.post('/trips/end', {
        trip_id: activeTrip.id
      });
      setActiveTrip(null);
      setSuccessMessage('Trip successfully completed and recorded in administrative transport logs.');
      fetchDriverAssignments();
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to conclude trip');
    } finally {
      setEndingTrip(false);
    }
  };

  const handleDelayChange = async (minutes) => {
    setDelayInput(minutes);
    if (!activeTrip) return;
    try {
      await api.post('/trips/update-location', {
        trip_id: activeTrip.id,
        delay_minutes: minutes
      });
    } catch (err) {
      console.error('Failed to update delay status', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <RefreshCw className="w-8 h-8 text-sienna-600 animate-spin mx-auto mb-3" />
        <p className="text-stone-600 font-medium">Authenticating driver credentials and vehicle assignments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Driver Profile & Vehicle Header */}
      <div className="bg-gradient-to-r from-ivory-100 via-[#FAF8F5] to-ivory-100 rounded-2xl p-6 md:p-8 border border-ivory-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sienna-100 text-sienna-800 text-xs font-semibold mb-3 border border-sienna-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Driver Console (SRS 4.5)</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
            {assignmentData?.driver?.name || user?.name || 'Authorized Driver'}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 mt-2 font-mono">
            <span>License: <strong className="text-stone-900">{assignmentData?.driver?.licenseNo || 'DL-908234-TR'}</strong></span>
            <span>•</span>
            <span>Phone: <strong className="text-stone-900">{assignmentData?.driver?.phone || '+91 98765 43210'}</strong></span>
          </div>
        </div>

        {/* Assigned Vehicle Card */}
        {assignmentData?.assigned_vehicle && (
          <div className="bg-white p-4 rounded-xl border border-ivory-300 shadow-2xs min-w-[240px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stormy-600 block">
              Assigned Vehicle
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-sm font-bold text-stone-900 px-2 py-0.5 rounded bg-ivory-100">
                {assignmentData.assigned_vehicle.reg_no}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sage-100 text-sage-800 font-semibold">
                {assignmentData.assigned_vehicle.status}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {assignmentData.assigned_vehicle.model} ({assignmentData.assigned_vehicle.capacity} seats)
            </p>
          </div>
        )}
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-sienna-50 border border-sienna-200 text-sienna-900 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-sienna-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-sage-50 border border-sage-200 text-sage-900 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-sage-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ACTIVE TRIP IN PROGRESS (REQ-27, REQ-28, REQ-29, REQ-30) */}
      {activeTrip ? (
        <div className="bg-white rounded-2xl border-2 border-sienna-500/80 shadow-md p-6 md:p-8 space-y-6">
          {/* Active Status Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="w-4 h-4 rounded-full bg-sage-500 block" />
                <span className="w-4 h-4 rounded-full bg-sage-500 block absolute top-0 left-0 animate-ping opacity-75" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  Active Journey Broadcasting Live
                </h2>
                <p className="text-xs text-stone-500 font-mono">
                  Trip ID: #{activeTrip.id} • Started: {new Date(activeTrip.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* End Trip Action (REQ-28) */}
            <button
              type="button"
              onClick={handleEndTrip}
              disabled={endingTrip}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sienna-600 hover:bg-sienna-700 text-white font-semibold text-sm shadow-sm transition self-start sm:self-auto"
            >
              <Square className="w-4 h-4 fill-white" />
              {endingTrip ? 'Concluding...' : 'Conclude & End Trip (REQ-28)'}
            </button>
          </div>

          {/* Telemetry Dashboard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Speedometer */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-ivory-200">
              <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
                <Gauge className="w-4 h-4 text-sienna-600" />
                <span>Current Speed</span>
              </div>
              <div className="font-serif font-bold text-3xl text-stone-900 mt-2">
                {activeTrip.current_location?.speed || 32} <span className="text-sm font-sans font-normal text-stone-500">km/h</span>
              </div>
            </div>

            {/* Next Stop */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-ivory-200">
              <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
                <Navigation className="w-4 h-4 text-sage-600" />
                <span>Next Scheduled Stop</span>
              </div>
              <div className="font-serif font-bold text-xl text-stone-900 mt-2 truncate">
                {assignmentData?.assigned_route?.stops?.find(s => s.id === activeTrip.next_stop_id)?.name || 'En Route'}
              </div>
            </div>

            {/* GPS Coordinates */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-ivory-200">
              <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-stormy-600" />
                <span>GPS Telemetry</span>
              </div>
              <div className="font-mono text-xs font-semibold text-stone-800 mt-2">
                {activeTrip.current_location?.lat.toFixed(4)}° N
              </div>
              <div className="font-mono text-xs font-semibold text-stone-800">
                {activeTrip.current_location?.lng.toFixed(4)}° E
              </div>
            </div>

            {/* Delay Factor Status */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-ivory-200">
              <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
                <Clock className="w-4 h-4 text-sienna-600" />
                <span>Schedule Variance</span>
              </div>
              <div className="font-serif font-bold text-2xl text-stone-900 mt-2">
                {activeTrip.delay_minutes > 0 ? (
                  <span className="text-sienna-700">+{activeTrip.delay_minutes} mins</span>
                ) : (
                  <span className="text-sage-700">On Time</span>
                )}
              </div>
            </div>
          </div>

          {/* Roadway Congestion / Delay Adjustment (BR-03 & REQ-24 testing) */}
          <div className="p-4 rounded-xl bg-ivory-50 border border-ivory-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                <Sliders className="w-4 h-4 text-sienna-600" />
                <span>Roadway Delay Adjustment (Triggers Commuter Delay Alerts - BR-03)</span>
              </div>
              <span className="text-xs text-stone-500">
                {delayInput >= 5 ? '⚠️ Delay notifications broadcasted to passengers' : 'Standard schedule'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[0, 3, 5, 8, 12, 15].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleDelayChange(mins)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    delayInput === mins
                      ? 'bg-sienna-600 text-white font-bold shadow-2xs'
                      : 'bg-white text-stone-700 border border-ivory-300 hover:bg-ivory-100'
                  }`}
                >
                  {mins === 0 ? 'On Time (0 min)' : `+${mins} min delay`}
                </button>
              ))}
            </div>
          </div>

          {/* Location Streaming Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-stone-500 border-t border-ivory-200">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoSimulate}
                onChange={(e) => setAutoSimulate(e.target.checked)}
                className="rounded border-stone-300 text-sienna-600 focus:ring-sienna-500 w-4 h-4"
              />
              <span className="font-medium text-stone-700">
                Continuous GPS simulation mode (automatically steps along route for testing)
              </span>
            </label>

            {lastBroadcastTime && (
              <span className="font-mono">
                Last GPS ping sent: {lastBroadcastTime.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      ) : (
        /* START TRIP FORM (REQ-25, REQ-26, BR-01, BR-02, SAFE-04) */
        <div className="bg-white rounded-2xl border border-ivory-300 shadow-sm p-6 md:p-8 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-semibold mb-2">
              <Play className="w-3.5 h-3.5" />
              <span>Trip Initiation Workflow (REQ-25)</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Commence Assigned Transit Run
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Select your vehicle and assigned route corridor to begin recording and broadcasting real-time location.
            </p>
          </div>

          <form onSubmit={handleStartTrip} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Select Vehicle (BR-01 & SAFE-04 Enforced)
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  required
                  className="w-full py-2.5 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5] text-stone-900 text-sm focus:ring-2 focus:ring-sienna-500/20 focus:border-sienna-500"
                >
                  <option value="">-- Choose Transit Vehicle --</option>
                  {assignmentData?.available_vehicles?.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.reg_no} - {v.model} ({v.capacity} seats) [{v.status}]
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-500 mt-1.5">
                  Vehicles already on active trips cannot be double-assigned (SAFE-04).
                </p>
              </div>

              {/* Route Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Select Assigned Route (REQ-25)
                </label>
                <select
                  value={selectedRouteId}
                  onChange={(e) => setSelectedRouteId(e.target.value)}
                  required
                  className="w-full py-2.5 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5] text-stone-900 text-sm focus:ring-2 focus:ring-sienna-500/20 focus:border-sienna-500"
                >
                  <option value="">-- Choose Route Corridor --</option>
                  {assignmentData?.available_routes?.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.route_no}: {r.route_name} ({r.source} → {r.destination})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-500 mt-1.5">
                  The system will automatically initialize stop ETAs for passengers once started.
                </p>
              </div>
            </div>

            {/* Route Stops Preview */}
            {selectedRouteId && (
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-ivory-200">
                <span className="text-xs font-bold text-stone-700 block mb-2">
                  Stops on Selected Route:
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
                  {assignmentData?.available_routes
                    ?.find(r => r.id === selectedRouteId)
                    ?.stop_ids?.map((sid, idx) => (
                      <span key={sid} className="px-2.5 py-1 rounded-md bg-white border border-ivory-300 font-medium">
                        {idx + 1}. Stop {sid}
                      </span>
                    ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={startingTrip || !selectedVehicleId || !selectedRouteId}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-xl bg-sienna-600 hover:bg-sienna-700 text-white font-semibold text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 fill-white" />
              {startingTrip ? 'Initializing Trip...' : 'Start Trip & Begin GPS Broadcast (REQ-25 & 26)'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
