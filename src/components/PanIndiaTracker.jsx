import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  Ticket,
  Search,
  Train,
  Bus,
  Gauge,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Wind,
  PhoneCall,
  CheckCircle2,
  Navigation,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Building2,
  Compass
} from 'lucide-react';

export default function PanIndiaTracker({ onSelectRoute }) {
  const [activeTab, setActiveTab] = useState('pnr'); // 'pnr' | 'station' | 'weather' | 'agencies'
  
  // PNR State
  const [pnrInput, setPnrInput] = useState('');
  const [pnrLoading, setPnrLoading] = useState(false);
  const [pnrResult, setPnrResult] = useState(null);
  const [pnrError, setPnrError] = useState('');

  // Station Board State
  const [selectedStation, setSelectedStation] = useState('NDLS');
  const [stationBoardData, setStationBoardData] = useState(null);
  const [stationLoading, setStationLoading] = useState(false);

  // Weather & Advisories State
  const [selectedCity, setSelectedCity] = useState('delhi');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Agencies Directory State
  const [agencies, setAgencies] = useState([]);

  // Fetch Station Board
  const fetchStationBoard = async (stationCode) => {
    try {
      setStationLoading(true);
      const res = await api.get('/station-board', { params: { station: stationCode } });
      setStationBoardData(res.data);
    } catch (err) {
      console.error('Error fetching station board', err);
    } finally {
      setStationLoading(false);
    }
  };

  // Fetch Weather
  const fetchWeather = async (city) => {
    try {
      setWeatherLoading(true);
      const res = await api.get('/transit/weather', { params: { city } });
      setWeatherData(res.data);
    } catch (err) {
      console.error('Error fetching transit weather', err);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Fetch Agencies
  const fetchAgencies = async () => {
    try {
      const res = await api.get('/transit/agencies');
      setAgencies(res.data);
    } catch (err) {
      console.error('Error fetching agencies', err);
    }
  };

  // PNR Search
  const handlePnrLookup = async (pnrToSearch) => {
    const code = (pnrToSearch || pnrInput).trim();
    if (!code) {
      setPnrError('Please enter a valid 10-digit Indian Railway PNR or State Transport ticket number.');
      return;
    }

    try {
      setPnrLoading(true);
      setPnrError('');
      const res = await api.get('/pnr/lookup', { params: { pnr: code } });
      setPnrResult(res.data);
    } catch (err) {
      setPnrError(err.response?.data?.detail || 'Unable to retrieve PNR live tracking details.');
      setPnrResult(null);
    } finally {
      setPnrLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStationBoard(selectedStation);
    fetchWeather(selectedCity);
    fetchAgencies();
  }, []);

  const quickPnrSamples = [
    { label: '2849102847 (Vande Bharat 22436)', code: '2849102847', type: 'Train' },
    { label: '4829104812 (Rajdhani 12952)', code: '4829104812', type: 'Train' },
    { label: 'KA8829104 (KSRTC Airavat)', code: 'KA8829104', type: 'Bus' },
    { label: 'MH7129031 (MSRTC Shivneri)', code: 'MH7129031', type: 'Bus' }
  ];

  const stationPresets = [
    { code: 'NDLS', name: 'New Delhi Junction', city: 'Delhi', state: 'Delhi' },
    { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal' },
    { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', state: 'Maharashtra' },
    { code: 'SBC', name: 'KSR Bengaluru City Junction', city: 'Bengaluru', state: 'Karnataka' },
    { code: 'MAS', name: 'Puratchi Thalaivar Dr. MGR Chennai Central', city: 'Chennai', state: 'Tamil Nadu' },
    { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra' },
    { code: 'LKO', name: 'Lucknow Charbagh Junction', city: 'Lucknow', state: 'Uttar Pradesh' }
  ];

  const cityPresets = [
    { id: 'delhi', name: 'Delhi NCR' },
    { id: 'mumbai', name: 'Mumbai Western Corridor' },
    { id: 'bengaluru', name: 'Bengaluru Silicon Valley' },
    { id: 'kolkata', name: 'Kolkata & Howrah' },
    { id: 'chennai', name: 'Chennai Southern Hub' },
    { id: 'pune', name: 'Pune IT Corridor' },
    { id: 'lucknow', name: 'Lucknow Heritage Expressway' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-ivory-300 shadow-sm overflow-hidden space-y-0">
      {/* Top Header & Navigation Tabs */}
      <div className="bg-[#FAF8F5] border-b border-ivory-300 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sienna-100 text-sienna-800 text-xs font-semibold mb-2 border border-sienna-200">
              <Compass className="w-3.5 h-3.5 text-sienna-600" />
              <span>National Transport Tracking Services</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              Pan-India Live Transit Hub
            </h2>
            <p className="text-stone-600 text-xs mt-1">
              Direct verification for Indian Railways (IRCTC), State Road Transport Corporations (KSRTC, MSRTC, DTC, BMTC), and Metro junctions.
            </p>
          </div>

          {/* Module Selector Pills */}
          <div className="flex items-center gap-1 bg-ivory-200/80 p-1.5 rounded-xl text-xs font-medium self-start md:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('pnr')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
                activeTab === 'pnr'
                  ? 'bg-white text-sienna-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Ticket className="w-3.5 h-3.5 text-sienna-600" />
              PNR / Ticket Live Status
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('station')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
                activeTab === 'station'
                  ? 'bg-white text-sienna-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-sienna-600" />
              Station Departure Boards
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('weather')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
                activeTab === 'weather'
                  ? 'bg-white text-sienna-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-sienna-600" />
              Corridor Weather & AQI
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('agencies')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
                activeTab === 'agencies'
                  ? 'bg-white text-sienna-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-sienna-600" />
              Agencies & Helplines
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content 1: Live PNR & Ticket Tracking */}
      {activeTab === 'pnr' && (
        <div className="p-6 space-y-6">
          {/* PNR Search Input */}
          <div className="max-w-2xl mx-auto space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
              Enter 10-Digit Railway PNR or State Transport Ticket ID:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Ticket className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePnrLookup()}
                  placeholder="e.g. 2849102847 or KA8829104"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-ivory-300 bg-[#FAF8F5] text-stone-900 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-sienna-500/20 focus:border-sienna-500 uppercase"
                />
              </div>
              <button
                type="button"
                onClick={() => handlePnrLookup()}
                disabled={pnrLoading}
                className="px-6 py-3 rounded-xl bg-sienna-500 hover:bg-sienna-600 text-white font-semibold text-sm shadow-sm transition flex items-center gap-2 disabled:opacity-50"
              >
                {pnrLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Track Live
              </button>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-stone-500">Quick Test PNRs:</span>
              {quickPnrSamples.map((sample) => (
                <button
                  key={sample.code}
                  type="button"
                  onClick={() => {
                    setPnrInput(sample.code);
                    handlePnrLookup(sample.code);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs border border-ivory-300 bg-ivory-50 hover:bg-ivory-100 text-stone-700 transition flex items-center gap-1 font-mono"
                >
                  {sample.type === 'Train' ? <Train className="w-3 h-3 text-sienna-600" /> : <Bus className="w-3 h-3 text-sage-600" />}
                  {sample.label}
                </button>
              ))}
            </div>

            {pnrError && (
              <div className="p-3 rounded-xl bg-sienna-50 border border-sienna-200 text-sienna-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{pnrError}</span>
              </div>
            )}
          </div>

          {/* PNR Live Results */}
          {pnrResult && (
            <div className="bg-[#FAF8F5] rounded-2xl border border-ivory-300 p-6 space-y-6 max-w-4xl mx-auto">
              {/* Header Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-sienna-100 text-sienna-900 border border-sienna-200">
                      PNR: {pnrResult.pnr}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sage-100 text-sage-800 border border-sage-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {pnrResult.booking_status}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mt-2">
                    {pnrResult.route_no} - {pnrResult.route_name}
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Operated by <strong>{pnrResult.agency}</strong> • Passenger: <strong>{pnrResult.passenger_name}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-stone-500">Coach & Seat / Berth</div>
                  <div className="font-mono text-lg font-bold text-stone-900 mt-0.5">
                    {pnrResult.coach_berth}
                  </div>
                  <div className="text-[11px] text-stone-500">Date: {pnrResult.date_of_journey}</div>
                </div>
              </div>

              {/* Journey Path */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-white p-4 rounded-xl border border-ivory-200">
                <div>
                  <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Origin / Boarding</div>
                  <div className="font-serif font-bold text-base text-stone-900 mt-0.5">{pnrResult.source}</div>
                  <div className="text-xs text-stone-500">Boarding Point: {pnrResult.boarding_point}</div>
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-stone-400 font-mono">Direct Express Service</span>
                  <div className="w-full flex items-center gap-2 my-1">
                    <div className="h-0.5 flex-1 bg-ivory-300"></div>
                    <ArrowRight className="w-4 h-4 text-sienna-500" />
                    <div className="h-0.5 flex-1 bg-ivory-300"></div>
                  </div>
                  <span className="text-[11px] font-semibold text-sage-700">Live GPS Connected</span>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Destination</div>
                  <div className="font-serif font-bold text-base text-stone-900 mt-0.5">{pnrResult.destination}</div>
                  <div className="text-xs text-stone-500">Scheduled Arrival Port</div>
                </div>
              </div>

              {/* Live Positional Telemetry */}
              {pnrResult.live_status && (
                <div className="bg-white p-5 rounded-xl border border-ivory-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-sage-500 animate-pulse"></span>
                      <h4 className="font-semibold text-sm text-stone-900">Live Running Status & Telemetry</h4>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      pnrResult.live_status.delay_minutes >= 5 ? 'bg-sienna-100 text-sienna-800' : 'bg-sage-100 text-sage-800'
                    }`}>
                      {pnrResult.live_status.delay_minutes >= 5
                        ? `Delayed by ${pnrResult.live_status.delay_minutes} min (${pnrResult.live_status.delay_reason})`
                        : 'Running Right on Time'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-ivory-200">
                      <span className="text-[11px] text-stone-500 block">Current Speed</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Gauge className="w-4 h-4 text-sienna-600" />
                        <span className="font-bold text-stone-900 text-base">{pnrResult.live_status.speed} km/h</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-ivory-200">
                      <span className="text-[11px] text-stone-500 block">Assigned Platform</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Building2 className="w-4 h-4 text-stone-600" />
                        <span className="font-bold text-stone-900 text-base">{pnrResult.live_status.platform}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-ivory-200">
                      <span className="text-[11px] text-stone-500 block">Next Station / Stop</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="w-4 h-4 text-sage-600" />
                        <span className="font-bold text-stone-900 text-sm truncate">
                          {pnrResult.live_status.next_stop?.name || 'En Route'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-ivory-200">
                      <span className="text-[11px] text-stone-500 block">Vehicle Model</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Train className="w-4 h-4 text-stone-600" />
                        <span className="font-bold text-stone-900 text-xs truncate">
                          {pnrResult.live_status.vehicle?.model || 'Superfast Coach'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-stone-500 flex items-center justify-between pt-2 border-t border-ivory-100">
                    <span>GPS Coordinates: {pnrResult.live_status.current_location?.lat}° N, {pnrResult.live_status.current_location?.lng}° E</span>
                    <span>Vehicle Reg: {pnrResult.live_status.vehicle?.reg_no || 'IR-EXPRESS'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Station Departure & Arrival Boards */}
      {activeTab === 'station' && (
        <div className="p-6 space-y-6">
          {/* Station Selector Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-stone-600">Select National Junction:</span>
            {stationPresets.map((stn) => (
              <button
                key={stn.code}
                type="button"
                onClick={() => {
                  setSelectedStation(stn.code);
                  fetchStationBoard(stn.code);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedStation === stn.code
                    ? 'bg-sienna-500 text-white shadow-2xs font-semibold'
                    : 'bg-ivory-100 hover:bg-ivory-200 text-stone-700'
                }`}
              >
                {stn.name.split(' ')[0]} ({stn.code})
              </button>
            ))}
          </div>

          {stationBoardData && (
            <div className="space-y-4">
              {/* Station Info Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#FAF8F5] border border-ivory-300">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      {stationBoardData.station?.name}
                    </h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-stone-200 text-stone-800 font-bold">
                      {stationBoardData.station?.code}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {stationBoardData.station?.city}, {stationBoardData.station?.state} • Live National Board
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fetchStationBoard(selectedStation)}
                    className="p-2 rounded-lg border border-ivory-300 hover:bg-white text-stone-700 transition"
                    title="Refresh board"
                  >
                    <RefreshCw className={`w-4 h-4 ${stationLoading ? 'animate-spin text-sienna-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Electronic Display Board */}
              <div className="overflow-x-auto rounded-xl border border-ivory-300 shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#2C2725] text-ivory-100 uppercase tracking-wider font-mono text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Service No.</th>
                      <th className="py-3 px-4">Service Name</th>
                      <th className="py-3 px-4">Agency</th>
                      <th className="py-3 px-4">Destination</th>
                      <th className="py-3 px-4">Sched Time</th>
                      <th className="py-3 px-4">Exp Time</th>
                      <th className="py-3 px-4">Platform</th>
                      <th className="py-3 px-4 text-right">Live Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-200 bg-white">
                    {stationBoardData.boards?.map((board, idx) => {
                      const isDelayed = board.delay_minutes > 0;
                      return (
                        <tr key={idx} className="hover:bg-ivory-50/80 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-sienna-800">
                            {board.service_no}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-stone-900">
                            {board.service_name}
                          </td>
                          <td className="py-3.5 px-4 text-stone-600">
                            <span className="px-2 py-0.5 rounded bg-ivory-100 border border-ivory-200 text-[10px] font-semibold">
                              {board.agency}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-stone-800 font-medium">
                            {board.destination}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-stone-500">
                            {board.scheduled_time}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                            {board.expected_time}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-stone-100 text-stone-800 border border-stone-200">
                              {board.platform}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                              isDelayed ? 'bg-sienna-100 text-sienna-800' : 'bg-sage-100 text-sage-800'
                            }`}>
                              {board.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Transit Corridor Weather & Advisories */}
      {activeTab === 'weather' && (
        <div className="p-6 space-y-6">
          {/* City Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-stone-600">Corridor Region:</span>
            {cityPresets.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedCity(c.id);
                  fetchWeather(c.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCity === c.id
                    ? 'bg-sienna-500 text-white shadow-2xs font-semibold'
                    : 'bg-ivory-100 hover:bg-ivory-200 text-stone-700'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {weatherData && (
            <div className="bg-[#FAF8F5] rounded-2xl border border-ivory-300 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-mono tracking-wider font-semibold text-stone-500">
                    Regional Atmospheric Conditions
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    {weatherData.city} Transit Zone
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">{weatherData.condition}</p>
                </div>

                <div className="text-right">
                  <div className="font-serif text-3xl font-bold text-sienna-700">
                    {weatherData.temp_c}°C
                  </div>
                  <span className="text-xs text-stone-500">Ambient Temperature</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-ivory-200">
                  <span className="text-xs text-stone-500 block">Air Quality Index (AQI)</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold text-stone-900 font-serif">{weatherData.aqi}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {weatherData.aqi_status}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-ivory-200">
                  <span className="text-xs text-stone-500 block">Optical Visibility</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold text-stone-900 font-serif">{weatherData.visibility_km} km</span>
                    <span className="text-xs text-stone-500">Clear Corridor</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-ivory-200">
                  <span className="text-xs text-stone-500 block">Signaling Clearance</span>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-sage-600" />
                    <span className="text-sm font-semibold text-stone-900">Normal Green Aspect</span>
                  </div>
                </div>
              </div>

              {/* Official Advisory */}
              <div className="bg-white p-4 rounded-xl border-l-4 border-l-sienna-500 border border-ivory-200">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sienna-800">
                  <ShieldCheck className="w-4 h-4" />
                  Official Corridor Safety Advisory
                </div>
                <p className="text-stone-700 text-sm mt-1 leading-relaxed">
                  {weatherData.advisory}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: Transport Authorities & Helplines */}
      {activeTab === 'agencies' && (
        <div className="p-6 space-y-4">
          <div className="text-xs text-stone-600">
            Emergency contact helplines and operational jurisdiction across major national and state transport authorities:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agencies.map((agency, idx) => (
              <div key={idx} className="bg-[#FAF8F5] p-5 rounded-xl border border-ivory-300 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-mono">
                      {agency.category}
                    </span>
                    <h4 className="font-serif font-bold text-base text-stone-900 mt-0.5">
                      {agency.name}
                    </h4>
                  </div>
                </div>

                <div className="text-xs text-stone-600 space-y-1">
                  <div>Coverage: <strong className="text-stone-800">{agency.coverage}</strong></div>
                  <div>Services: <span className="text-stone-700">{agency.active_services}</span></div>
                </div>

                <div className="pt-2 border-t border-ivory-200 flex items-center justify-between">
                  <span className="text-xs text-stone-500">Helpline:</span>
                  <a
                    href={`tel:${agency.helpline.replace(/[^0-9]/g, '')}`}
                    className="font-mono text-xs font-bold text-sienna-700 hover:text-sienna-900 flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" />
                    {agency.helpline}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
