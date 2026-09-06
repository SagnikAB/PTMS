import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  ShieldCheck, 
  MapPin, 
  Compass, 
  Bus, 
  Users, 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  RefreshCw,
  Clock,
  Navigation,
  Key
} from 'lucide-react';

export default function AdminRouteManager() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'routes' | 'stops' | 'vehicles' | 'drivers' | 'reports'
  
  // Data States
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Notifications
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form States - Stops
  const [stopName, setStopName] = useState('');
  const [stopCode, setStopCode] = useState('');
  const [stopLat, setStopLat] = useState('');
  const [stopLng, setStopLng] = useState('');

  // Form States - Routes
  const [routeNo, setRouteNo] = useState('');
  const [routeName, setRouteName] = useState('');
  const [routeSource, setRouteSource] = useState('');
  const [routeDest, setRouteDest] = useState('');
  const [routeDistance, setRouteDistance] = useState('');
  const [selectedStops, setSelectedStops] = useState([]);

  // Form States - Vehicles
  const [vehRegNo, setVehRegNo] = useState('');
  const [vehModel, setVehModel] = useState('');
  const [vehCapacity, setVehCapacity] = useState('40');
  const [vehStatus, setVehStatus] = useState('Idle');
  const [vehDriverId, setVehDriverId] = useState('');
  const [vehRouteId, setVehRouteId] = useState('');

  // Form States - Drivers
  const [driverName, setDriverName] = useState('');
  const [driverEmail, setDriverEmail] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverLicense, setDriverLicense] = useState('');

  const fetchAllAdminData = async () => {
    try {
      setLoading(true);
      const [stopsRes, routesRes, vehRes, driverRes, reportsRes] = await Promise.all([
        api.get('/admin/stops'),
        api.get('/admin/routes'),
        api.get('/admin/vehicles'),
        api.get('/admin/drivers'),
        api.get('/admin/reports')
      ]);
      setStops(Array.isArray(stopsRes.data) ? stopsRes.data : []);
      setRoutes(Array.isArray(routesRes.data) ? routesRes.data : []);
      setVehicles(Array.isArray(vehRes.data) ? vehRes.data : []);
      setDrivers(Array.isArray(driverRes.data) ? driverRes.data : []);
      setReportsData(reportsRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
      setErrorMessage('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(''), 5000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  // --- STOP ACTIONS (REQ-31) ---
  const handleAddStop = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/stops', {
        name: stopName,
        code: stopCode,
        location: { lat: parseFloat(stopLat), lng: parseFloat(stopLng) }
      });
      showNotification('Transit stop successfully added to the system');
      setStopName('');
      setStopCode('');
      setStopLat('');
      setStopLng('');
      fetchAllAdminData();
    } catch (err) {
      showNotification(err.response?.data?.detail || 'Failed to add stop', true);
    }
  };

  const handleDeleteStop = async (id, name) => {
    // SAFE-01: Confirmation before deleting
    if (!window.confirm(`Are you sure you want to permanently delete stop "${name}"? Routes referencing this stop will be updated.`)) {
      return;
    }
    try {
      await api.delete(`/admin/stops/${id}`);
      showNotification(`Stop "${name}" deleted`);
      fetchAllAdminData();
    } catch (err) {
      showNotification(err.response?.data?.detail || 'Failed to delete stop', true);
    }
  };

  // --- ROUTE ACTIONS (REQ-31) ---
  const handleAddRoute = async (e) => {
    e.preventDefault();
    if (selectedStops.length < 2) {
      showNotification('A route must contain at least 2 stops', true);
      return;
    }

    try {
      await api.post('/admin/routes', {
        route_no: routeNo,
        route_name: routeName,
        source: routeSource,
        destination: routeDest,
        stop_ids: selectedStops,
        distance_km: parseFloat(routeDistance) || 10
      });
      showNotification('Transit route corridor successfully created');
      setRouteNo('');
      setRouteName('');
      setRouteSource('');
      setRouteDest('');
      setRouteDistance('');
      setSelectedStops([]);
      fetchAllAdminData();
    } catch (err) {
      showNotification(err.response?.data?.detail || 'Failed to create route', true);
    }
  };

  const handleDeleteRoute = async (id, name) => {
    // SAFE-01: Confirmation before deleting
    if (!window.confirm(`Permanently delete route "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/admin/routes/${id}`);
      showNotification(`Route "${name}" deleted`);
      fetchAllAdminData();
    } catch (err) {
      showNotification(err.response?.data?.detail || 'Failed to delete route', true);
    }
  };

  // --- VEHICLE ACTIONS (REQ-32, REQ-33) ---
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/vehicles', {
        reg_no: vehRegNo,
        model: vehModel,
        capacity: parseInt(vehCapacity, 10),
        status: vehStatus,
        assigned_driver_id: vehDriverId || undefined,
        assigned_route_id: vehRouteId || undefined
      });
      showNotification('Vehicle added to fleet register');
      setVehRegNo('');
      setVehModel('');
      setVehCapacity('40');
      setVehDriverId('');
      setVehRouteId('');
      fetchAllAdminData();
    } catch (err) {
      showNotification(err.response?.data?.detail || 'Failed to add vehicle', true);
    }
  };

  const handleDeleteVehicle = async (id, regNo) => {
    if (!window.confirm(`Permanently remove vehicle ${regNo} from fleet registry?`)) {
      return;
    }
    try {
      await api.delete(`/admin/vehicles/${id}`);
      showNotification(`Vehicle ${regNo} removed`);
      fetchAllAdminData();
    } catch (err) {
      showNotification(err.response?.data?.detail || 'Failed to delete vehicle', true);
    }
  };

  // --- DRIVER ACTIONS (REQ-33, BR-05) ---
  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/drivers', {
        name: driverName,
        email: driverEmail,
        password: driverPassword,
        phone: driverPhone,
        licenseNo: driverLicense
      });
      showNotification('Driver account successfully created');
      setDriverName('');
      setDriverEmail('');
      setDriverPassword('');
      setDriverPhone('');
      setDriverLicense('');
      fetchAllAdminData();
    } catch (err) {
      showNotification(err.response?.data?.detail || 'Failed to create driver account', true);
    }
  };

  const handleToggleDriverStatus = async (driver) => {
    const nextStatus = driver.activeStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.put(`/admin/drivers/${driver.id}`, {
        activeStatus: nextStatus
      });
      showNotification(`Driver status updated to ${nextStatus}`);
      fetchAllAdminData();
    } catch (err) {
      showNotification('Failed to update driver status', true);
    }
  };

  // --- REPORT EXPORT (PERF-05) ---
  const handleExportReport = () => {
    if (!reportsData) return;
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportsData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `PTTS_Transport_Report_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Transport report exported successfully (PERF-05)');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-ivory-100 via-[#FAF8F5] to-ivory-100 rounded-2xl p-6 md:p-8 border border-ivory-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sienna-100 text-sienna-800 text-xs font-semibold mb-3 border border-sienna-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Transport Authority Administration (SRS 4.6)</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
            Fleet & Transit Administration
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Manage routes, transit stops, fleet vehicles, driver assignments, and audit operational logs.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAllAdminData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-ivory-300 hover:bg-white text-stone-700 text-xs font-semibold shadow-2xs self-start md:self-auto transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sienna-600' : ''}`} />
          Refresh Registry
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-sage-50 border border-sage-200 text-sage-900 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-sage-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-sienna-50 border border-sienna-200 text-sienna-900 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-sienna-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-ivory-200 pb-3">
        {[
          { id: 'overview', label: 'Fleet Overview', icon: ShieldCheck },
          { id: 'routes', label: `Routes (${routes.length})`, icon: Compass },
          { id: 'stops', label: `Stops (${stops.length})`, icon: MapPin },
          { id: 'vehicles', label: `Vehicles (${vehicles.length})`, icon: Bus },
          { id: 'drivers', label: `Drivers (${drivers.length})`, icon: Users },
          { id: 'reports', label: 'Transport Reports', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-sienna-600 text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-ivory-300 hover:bg-ivory-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: FLEET OVERVIEW */}
      {activeTab === 'overview' && reportsData && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-xl bg-white border border-ivory-300 shadow-2xs">
              <span className="text-xs text-stone-500 font-medium block">Total Routes</span>
              <span className="font-serif font-bold text-2xl text-sienna-700 mt-1 block">
                {reportsData.summary.total_routes}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-ivory-300 shadow-2xs">
              <span className="text-xs text-stone-500 font-medium block">Total Stops</span>
              <span className="font-serif font-bold text-2xl text-stone-900 mt-1 block">
                {reportsData.summary.total_stops}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-ivory-300 shadow-2xs">
              <span className="text-xs text-stone-500 font-medium block">Total Fleet</span>
              <span className="font-serif font-bold text-2xl text-stone-900 mt-1 block">
                {reportsData.summary.total_vehicles}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-ivory-300 shadow-2xs">
              <span className="text-xs text-stone-500 font-medium block">Active Vehicles</span>
              <span className="font-serif font-bold text-2xl text-sage-700 mt-1 block">
                {reportsData.summary.active_vehicles}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-ivory-300 shadow-2xs">
              <span className="text-xs text-stone-500 font-medium block">On-Time Rate</span>
              <span className="font-serif font-bold text-2xl text-sage-700 mt-1 block">
                {reportsData.summary.on_time_rate_percent}%
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-ivory-300 shadow-2xs">
              <span className="text-xs text-stone-500 font-medium block">Trips Logged</span>
              <span className="font-serif font-bold text-2xl text-sienna-700 mt-1 block">
                {reportsData.summary.total_trips_logged}
              </span>
            </div>
          </div>

          {/* Quick Active Fleets Table */}
          <div className="bg-white rounded-2xl border border-ivory-300 shadow-sm p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Live Fleet Status
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-stone-700">
                <thead className="bg-[#FAF8F5] text-stone-500 font-bold uppercase tracking-wider border-y border-ivory-200">
                  <tr>
                    <th className="py-3 px-4">Reg No</th>
                    <th className="py-3 px-4">Model</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned Driver</th>
                    <th className="py-3 px-4">Assigned Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-ivory-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">{v.reg_no}</td>
                      <td className="py-3 px-4">{v.model}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${
                          v.status === 'Active' ? 'bg-sage-100 text-sage-800' :
                          v.status === 'Maintenance' ? 'bg-sienna-100 text-sienna-800' :
                          'bg-stone-100 text-stone-700'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{v.driver_name || 'Unassigned'}</td>
                      <td className="py-3 px-4">{v.route_name || 'Unassigned'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROUTES MANAGEMENT (REQ-31) */}
      {activeTab === 'routes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Route Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-ivory-300 shadow-sm p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-sienna-600" />
              Add Transit Route (REQ-31)
            </h3>
            <form onSubmit={handleAddRoute} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Route Number / Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EX-105"
                  value={routeNo}
                  onChange={(e) => setRouteNo(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Route Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Northern Airport Link"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Origin Source</label>
                  <input
                    type="text"
                    required
                    placeholder="Origin"
                    value={routeSource}
                    onChange={(e) => setRouteSource(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    placeholder="Destination"
                    value={routeDest}
                    onChange={(e) => setRouteDest(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Total Distance (km)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="15.5"
                  value={routeDistance}
                  onChange={(e) => setRouteDistance(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Select Stops in Sequence (Min 2 required)
                </label>
                <div className="max-h-40 overflow-y-auto border border-ivory-300 rounded-lg p-2 space-y-1 bg-[#FAF8F5]">
                  {stops.map((stop) => {
                    const isChecked = selectedStops.includes(stop.id);
                    return (
                      <label key={stop.id} className="flex items-center gap-2 p-1 hover:bg-white rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStops([...selectedStops, stop.id]);
                            } else {
                              setSelectedStops(selectedStops.filter(id => id !== stop.id));
                            }
                          }}
                          className="rounded text-sienna-600 focus:ring-sienna-500"
                        />
                        <span className="font-medium text-stone-800">{stop.name}</span>
                        <span className="text-stone-400 font-mono text-[10px]">({stop.code})</span>
                      </label>
                    );
                  })}
                </div>
                {selectedStops.length > 0 && (
                  <p className="text-[11px] text-sienna-700 mt-1 font-semibold">
                    {selectedStops.length} stops selected
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-sienna-600 hover:bg-sienna-700 text-white font-semibold shadow-sm transition"
              >
                Create Transit Route
              </button>
            </form>
          </div>

          {/* Existing Routes List */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-ivory-300 shadow-sm p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Active Transit Corridors ({routes.length})
            </h3>
            <div className="divide-y divide-ivory-200">
              {routes.map((r) => (
                <div key={r.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sienna-100 text-sienna-800 mr-2">
                        {r.route_no}
                      </span>
                      <strong className="text-sm text-stone-900 font-serif">{r.route_name}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteRoute(r.id, r.route_name)}
                      className="text-stone-400 hover:text-sienna-600 p-1.5 rounded"
                      title="Delete Route (SAFE-01)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-stone-600 flex items-center gap-2">
                    <span>{r.source} → {r.destination}</span>
                    <span>•</span>
                    <span>{r.distance_km} km</span>
                    <span>•</span>
                    <span>{r.stops?.length || 0} Stops</span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Stops: {r.stops?.map(s => s.name).join(' → ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STOPS MANAGEMENT (REQ-31) */}
      {activeTab === 'stops' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Stop Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-ivory-300 shadow-sm p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-sienna-600" />
              Register Transit Stop (REQ-31)
            </h3>
            <form onSubmit={handleAddStop} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Stop Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Gate Metro"
                  value={stopName}
                  onChange={(e) => setStopName(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Stop Code</label>
                <input
                  type="text"
                  placeholder="e.g. ST-07"
                  value={stopCode}
                  onChange={(e) => setStopCode(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    placeholder="28.6210"
                    value={stopLat}
                    onChange={(e) => setStopLat(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    placeholder="77.2150"
                    value={stopLng}
                    onChange={(e) => setStopLng(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-sienna-600 hover:bg-sienna-700 text-white font-semibold shadow-sm transition"
              >
                Save Transit Stop
              </button>
            </form>
          </div>

          {/* Stops List */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-ivory-300 shadow-sm p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Transit Stops Register ({stops.length})
            </h3>
            <div className="divide-y divide-ivory-200">
              {stops.map((stop) => (
                <div key={stop.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-600 px-1.5 py-0.5 rounded bg-ivory-100">
                        {stop.code}
                      </span>
                      <strong className="text-sm text-stone-900">{stop.name}</strong>
                    </div>
                    <span className="text-xs text-stone-500 font-mono">
                      {stop.location?.lat.toFixed(4)}° N, {stop.location?.lng.toFixed(4)}° E
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteStop(stop.id, stop.name)}
                    className="text-stone-400 hover:text-sienna-600 p-1.5 rounded"
                    title="Delete Stop"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VEHICLES MANAGEMENT (REQ-32 & REQ-33) */}
      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Vehicle Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-ivory-300 shadow-sm p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-sienna-600" />
              Register Vehicle (REQ-32)
            </h3>
            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Registration Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DL-01-JK-9021"
                  value={vehRegNo}
                  onChange={(e) => setVehRegNo(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5] uppercase font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Make & Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Volvo 9400 / Tata Starbus"
                  value={vehModel}
                  onChange={(e) => setVehModel(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Capacity (Seats)</label>
                  <input
                    type="number"
                    required
                    value={vehCapacity}
                    onChange={(e) => setVehCapacity(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Status</label>
                  <select
                    value={vehStatus}
                    onChange={(e) => setVehStatus(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                  >
                    <option value="Idle">Idle</option>
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Assign Driver (REQ-33)</label>
                <select
                  value={vehDriverId}
                  onChange={(e) => setVehDriverId(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                >
                  <option value="">-- No Driver Assigned --</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.licenseNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Assign Route (REQ-33)</label>
                <select
                  value={vehRouteId}
                  onChange={(e) => setVehRouteId(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                >
                  <option value="">-- No Route Assigned --</option>
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.route_no}: {r.route_name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-sienna-600 hover:bg-sienna-700 text-white font-semibold shadow-sm transition"
              >
                Add Vehicle To Fleet
              </button>
            </form>
          </div>

          {/* Vehicles List */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-ivory-300 shadow-sm p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Fleet Register ({vehicles.length})
            </h3>
            <div className="divide-y divide-ivory-200">
              {vehicles.map((v) => (
                <div key={v.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-900 px-2 py-0.5 rounded bg-ivory-100">
                        {v.reg_no}
                      </span>
                      <span className="text-sm font-semibold text-stone-800">{v.model}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        v.status === 'Active' ? 'bg-sage-100 text-sage-800' :
                        v.status === 'Maintenance' ? 'bg-sienna-100 text-sienna-800' :
                        'bg-stone-100 text-stone-600'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 mt-1">
                      <span>Seats: {v.capacity}</span> • 
                      <span> Driver: <strong>{v.driver_name || 'Unassigned'}</strong></span> • 
                      <span> Route: <strong>{v.route_name || 'Unassigned'}</strong></span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteVehicle(v.id, v.reg_no)}
                    className="text-stone-400 hover:text-sienna-600 p-1.5 rounded"
                    title="Delete Vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DRIVERS MANAGEMENT (REQ-33, BR-05, SEC-05) */}
      {activeTab === 'drivers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Driver Account Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-ivory-300 shadow-sm p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-sienna-600" />
              Provision Driver Account (BR-05)
            </h3>
            <form onSubmit={handleAddDriver} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Driver Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunil Verma"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Work Email (Login)</label>
                <input
                  type="email"
                  required
                  placeholder="sunil.driver@ptms.com"
                  value={driverEmail}
                  onChange={(e) => setDriverEmail(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={driverPassword}
                  onChange={(e) => setDriverPassword(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Heavy Vehicle License</label>
                  <input
                    type="text"
                    required
                    placeholder="DL-882190-TR"
                    value={driverLicense}
                    onChange={(e) => setDriverLicense(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5] uppercase"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    placeholder="+91 98..."
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-ivory-300 bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-sienna-600 hover:bg-sienna-700 text-white font-semibold shadow-sm transition"
              >
                Create Driver Profile
              </button>
            </form>
          </div>

          {/* Drivers List */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-ivory-300 shadow-sm p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Authorized Fleet Drivers ({drivers.length})
            </h3>
            <div className="divide-y divide-ivory-200">
              {drivers.map((d) => (
                <div key={d.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-stone-900">{d.name}</strong>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        d.activeStatus === 'Active' ? 'bg-sage-100 text-sage-800' : 'bg-sienna-100 text-sienna-800'
                      }`}>
                        {d.activeStatus}
                      </span>
                      {d.is_on_trip && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sienna-100 text-sienna-800 animate-pulse">
                          ON ACTIVE TRIP
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 mt-1">
                      <span>License: <strong className="font-mono">{d.licenseNo}</strong></span> • 
                      <span> Email: {d.email}</span> • 
                      <span> Phone: {d.phone}</span>
                    </div>
                    {d.assigned_vehicle && (
                      <div className="text-xs text-sage-700 font-semibold mt-0.5">
                        Assigned Bus: {d.assigned_vehicle.reg_no}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleDriverStatus(d)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-ivory-300 hover:bg-ivory-100 text-stone-700"
                  >
                    {d.activeStatus === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TRANSPORT REPORTS (SRS PERF-05) */}
      {activeTab === 'reports' && reportsData && (
        <div className="bg-white rounded-2xl border border-ivory-300 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-200 pb-5">
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Transport Performance Report (PERF-05)
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Audit logs for completed journeys, punctuality rates, and transit efficiency analysis.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sienna-600 hover:bg-sienna-700 text-white font-semibold text-xs shadow-sm transition self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              Export Report JSON / CSV
            </button>
          </div>

          {/* Historical Trips Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-stone-700">
              <thead className="bg-[#FAF8F5] text-stone-500 font-bold uppercase tracking-wider border-y border-ivory-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Driver</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">Avg Speed</th>
                  <th className="py-3 px-4">Schedule Variance</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {reportsData.trip_logs?.map((log) => (
                  <tr key={log.id} className="hover:bg-ivory-50/50">
                    <td className="py-3 px-4 font-mono">{log.date}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-sienna-800 mr-1.5">{log.route_no}</span>
                      <span className="font-medium text-stone-900">{log.route_name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">{log.vehicle_reg}</td>
                    <td className="py-3 px-4">{log.driver_name}</td>
                    <td className="py-3 px-4 font-mono">{log.distance_km} km</td>
                    <td className="py-3 px-4 font-mono">{log.avg_speed_kmh} km/h</td>
                    <td className="py-3 px-4">
                      {log.delay_minutes > 0 ? (
                        <span className="text-sienna-700 font-semibold font-mono">
                          +{log.delay_minutes} mins delay
                        </span>
                      ) : (
                        <span className="text-sage-700 font-semibold">
                          On Schedule
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-sage-100 text-sage-800 font-semibold">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
