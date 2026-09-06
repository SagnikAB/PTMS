import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PassengerSearch from './components/PassengerSearch';
import LiveFleetMap from './components/LiveFleetMap';
import PanIndiaTracker from './components/PanIndiaTracker';
import DriverDashboard from './components/DriverDashboard';
import AdminRouteManager from './components/AdminRouteManager';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2C2725] font-sans antialiased selection:bg-sienna-100 selection:text-sienna-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<PassengerSearch />} />
          <Route path="/search" element={<PassengerSearch />} />
          <Route path="/map" element={<LiveFleetMap />} />
          <Route path="/pnr" element={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><PanIndiaTracker /></div>} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          
          {/* Driver Trip Management (SRS 4.5, REQ-25 to REQ-30) */}
          <Route element={<ProtectedRoute allowedRoles={['Driver', 'Admin']} />}>
            <Route path="/driver" element={<DriverDashboard />} />
          </Route>

          {/* Administrator Management (SRS 4.6, REQ-31 to REQ-35, PERF-05) */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminRouteManager />} />
          </Route>
        </Routes>
      </main>

      {/* Elegant Footer */}
      <footer className="border-t border-ivory-300 bg-white/70 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-800 text-sm">Bharat Transit Live</span>
            <span>•</span>
            <span>Pan-India Multi-Modal Public Transport Tracking System</span>
          </div>
          <div className="text-stone-500 text-[11px]">
            Indian Railways (IRCTC) • State Roadways (KSRTC, MSRTC, DTC, BMTC) • Rapid Metro • GPS Telemetry &lt; 350ms
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
