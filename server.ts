import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'ptms-super-secret-key-change-in-production-2024';

app.use(express.json());

// Vercel may pass the function path without the /api prefix.
if (process.env.VERCEL) {
  app.use((req, res, next) => {
    if (!req.url.startsWith('/api')) {
      req.url = '/api' + req.url;
    }
    next();
  });
}

// --- TYPES & INTERFACES ---
export interface User {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  role: 'Admin' | 'Driver' | 'Passenger';
  phone?: string;
  licenseNo?: string;
  activeStatus: 'Active' | 'Inactive';
  createdAt: string;
}

import type {
  Stop,
  RouteItem,
  Vehicle,
  Trip,
  TripHistoryLog,
  PnrRecord
} from './src/indiaTransitData';

import {
  initialStops,
  initialRoutes,
  initialVehicles,
  initialTrips,
  initialPnrs,
  initialTripHistory
} from './src/indiaTransitData';

export type { Stop, RouteItem, Vehicle, Trip, TripHistoryLog, PnrRecord };

// --- IN-MEMORY DATABASE WITH COMPREHENSIVE PAN-INDIA SEEDING ---
const users: User[] = [
  {
    id: 'user_admin',
    name: 'National Transit Operations Admin',
    email: 'admin@ptms.com',
    hashedPassword: bcrypt.hashSync('admin123', 10),
    role: 'Admin',
    phone: '+91 98000 00001',
    activeStatus: 'Active',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  // Indian Railways Loco Pilots
  {
    id: 'user_driver_ndls',
    name: 'Vikram Singh (Sr. Loco Pilot - Vande Bharat)',
    email: 'driver@ptms.com',
    hashedPassword: bcrypt.hashSync('driver123', 10),
    role: 'Driver',
    licenseNo: 'IR-LP-908234-NR',
    phone: '+91 98765 43210',
    activeStatus: 'Active',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 'user_driver_kota',
    name: 'Rajesh Meena (Loco Pilot - Rajdhani Express)',
    email: 'rajesh.driver@ptms.com',
    hashedPassword: bcrypt.hashSync('driver123', 10),
    role: 'Driver',
    licenseNo: 'IR-LP-812391-WR',
    phone: '+91 98112 34567',
    activeStatus: 'Active',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 'user_driver_blr',
    name: 'G. Narayanan (Loco Pilot - Shatabdi Express)',
    email: 'narayanan.driver@ptms.com',
    hashedPassword: bcrypt.hashSync('driver123', 10),
    role: 'Driver',
    licenseNo: 'IR-LP-771204-SR',
    phone: '+91 98450 11223',
    activeStatus: 'Active',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 'user_driver_kol',
    name: 'Bimal Sen (Loco Pilot - Eastern Rajdhani)',
    email: 'bimal.driver@ptms.com',
    hashedPassword: bcrypt.hashSync('driver123', 10),
    role: 'Driver',
    licenseNo: 'IR-LP-654901-ER',
    phone: '+91 98300 44556',
    activeStatus: 'Active',
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString()
  },
  {
    id: 'user_driver_hyd',
    name: 'K. Venkateshwar Rao (Loco Pilot - SC VB)',
    email: 'venkat.driver@ptms.com',
    hashedPassword: bcrypt.hashSync('driver123', 10),
    role: 'Driver',
    licenseNo: 'IR-LP-552190-SCR',
    phone: '+91 98490 66778',
    activeStatus: 'Active',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  // State Road Transport Captains
  {
    id: 'user_driver_ksrtc',
    name: 'Basavaraj Gowda (Captain - KSRTC Airavat)',
    email: 'ksrtc.driver@ptms.com',
    hashedPassword: bcrypt.hashSync('driver123', 10),
    role: 'Driver',
    licenseNo: 'KA-01-20180004921',
    phone: '+91 94480 33445',
    activeStatus: 'Active',
    createdAt: new Date(Date.now() - 22 * 86400000).toISOString()
  },
  {
    id: 'user_driver_msrtc',
    name: 'Sunil Jadhav (Captain - MSRTC Shivneri)',
    email: 'msrtc.driver@ptms.com',
    hashedPassword: bcrypt.hashSync('driver123', 10),
    role: 'Driver',
    licenseNo: 'MH-14-20190008812',
    phone: '+91 98220 55667',
    activeStatus: 'Active',
    createdAt: new Date(Date.now() - 19 * 86400000).toISOString()
  },
  {
    id: 'user_driver_bmtc',
    name: 'H. Manjunath (Captain - BMTC Vayu Vajra)',
    email: 'bmtc.driver@ptms.com',
    hashedPassword: bcrypt.hashSync('driver123', 10),
    role: 'Driver',
    licenseNo: 'KA-57-20200001429',
    phone: '+91 94498 77889',
    activeStatus: 'Active',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    id: 'user_driver_dtc',
    name: 'Arvind Tomar (Pilot - DTC Electric Express)',
    email: 'dtc.driver@ptms.com',
    hashedPassword: bcrypt.hashSync('driver123', 10),
    role: 'Driver',
    licenseNo: 'DL-01-20210009981',
    phone: '+91 98100 22334',
    activeStatus: 'Active',
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    id: 'user_driver_metro',
    name: 'Amit Ghosh (Train Operator - Kolkata Metro)',
    email: 'metro.driver@ptms.com',
    hashedPassword: bcrypt.hashSync('driver123', 10),
    role: 'Driver',
    licenseNo: 'KMRC-TO-20220041',
    phone: '+91 98311 99001',
    activeStatus: 'Active',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  // Commuter Passengers
  {
    id: 'user_passenger1',
    name: 'Aarav Mehta (Commuter)',
    email: 'passenger1@ptms.com',
    hashedPassword: bcrypt.hashSync('pass123', 10),
    role: 'Passenger',
    phone: '+91 99234 56789',
    activeStatus: 'Active',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 'user_passenger2',
    name: 'Sunita Sharma (Commuter)',
    email: 'passenger2@ptms.com',
    hashedPassword: bcrypt.hashSync('pass456', 10),
    role: 'Passenger',
    phone: '+91 99345 67890',
    activeStatus: 'Active',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  }
];

const stops: Stop[] = [...initialStops];
const routes: RouteItem[] = [...initialRoutes];
const vehicles: Vehicle[] = [...initialVehicles];
const trips: Trip[] = [...initialTrips];
const pnrs: PnrRecord[] = [...initialPnrs];
const tripHistory: TripHistoryLog[] = [...initialTripHistory];

// --- HELPER UTILITIES ---
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

function computeETA(trip: Trip, stop: Stop, routeStops: Stop[]): { etaMinutes: number; etaTime: string; isDelayed: boolean } {
  // Distance from vehicle's current coordinates to the target stop
  const dist = calculateDistanceKm(
    trip.current_location.lat,
    trip.current_location.lng,
    stop.location.lat,
    stop.location.lng
  );

  // Speed in km/h with minimum speed threshold for realistic transit
  const speed = Math.max(trip.current_location.speed || 40, 25);
  const baseMinutes = Math.round((dist / speed) * 60);
  const totalMinutes = Math.max(1, baseMinutes + (trip.delay_minutes || 0));

  const etaDate = new Date(Date.now() + totalMinutes * 60000);
  const timeStr = etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    etaMinutes: totalMinutes,
    etaTime: timeStr,
    isDelayed: (trip.delay_minutes || 0) >= 5
  };
}

function createToken(user: User): string {
  return jwt.sign(
    {
      sub: user.email,
      userId: user.id,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

// --- AUTH MIDDLEWARE ---
interface AuthenticatedRequest extends Request {
  user?: User;
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ detail: 'Authentication token required. Please sign in.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub?: string; userId?: string; role?: string };
    const user = users.find(u => u.id === payload.userId || u.email === payload.sub);
    if (!user) {
      return res.status(401).json({ detail: 'User account not found' });
    }
    if (user.activeStatus === 'Inactive') {
      return res.status(403).json({ detail: 'Your account has been deactivated. Contact an administrator.' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ detail: 'Invalid or expired session. Please log in again.' });
  }
}

function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ detail: `Access forbidden. Requires ${allowedRoles.join(' or ')} privileges.` });
    }
    next();
  };
}

// Live background ticker for authentic Pan-India multi-modal transit tracking
setInterval(() => {
  for (const trip of trips) {
    if (trip.status === 'Active') {
      const route = routes.find(r => r.id === trip.route_id);
      if (!route) continue;

      const routeStops = route.stop_ids.map(id => stops.find(s => s.id === id)).filter(Boolean) as Stop[];
      if (routeStops.length < 2) continue;

      // Realistic speed profile by transit archetype
      const isTrain = route.mode === 'train';
      const isMetro = route.mode === 'metro';
      const stepIncrement = isTrain ? 0.7 : isMetro ? 1.5 : 1.1;

      // Progress forward along corridor
      trip.path_progress_percent = (trip.path_progress_percent + stepIncrement) % 100;
      const progressFraction = trip.path_progress_percent / 100;

      // Interpolate along route stops
      const segmentCount = routeStops.length - 1;
      const segIndex = Math.min(Math.floor(progressFraction * segmentCount), segmentCount - 1);
      const segFraction = (progressFraction * segmentCount) - segIndex;

      const p1 = routeStops[segIndex].location;
      const p2 = routeStops[segIndex + 1].location;

      const baseSpeed = isTrain ? 118 : isMetro ? 56 : 76;
      const speedOscillation = Math.round(Math.sin(Date.now() / 3500 + trip.id.charCodeAt(5)) * 8);

      trip.current_location = {
        lat: parseFloat((p1.lat + (p2.lat - p1.lat) * segFraction).toFixed(5)),
        lng: parseFloat((p1.lng + (p2.lng - p1.lng) * segFraction).toFixed(5)),
        speed: Math.max(25, baseSpeed + speedOscillation),
        timestamp: new Date().toISOString()
      };

      trip.next_stop_id = routeStops[segIndex + 1].id;
    }
  }
}, 3500);

// --- API ROUTES ---

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'PTTS - Public Transport Tracking System',
    version: '1.0',
    server_time: new Date().toISOString()
  });
});

// User Authentication & Registration (REQ-01 to REQ-09, SEC-01 to SEC-07)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, licenseNo } = req.body;
    if (!name || !email || !password) {
      return res.status(422).json({ detail: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(422).json({ detail: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return res.status(409).json({ detail: 'Email is already registered. Please sign in.' });
    }

    const assignedRole = role === 'Driver' ? 'Driver' : role === 'Admin' ? 'Admin' : 'Passenger';
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: generateId('user'),
      name: name.trim(),
      email: normalizedEmail,
      hashedPassword,
      role: assignedRole,
      phone: phone || '',
      licenseNo: assignedRole === 'Driver' ? (licenseNo || 'LIC-TEMP-' + Math.floor(1000 + Math.random() * 9000)) : undefined,
      activeStatus: 'Active',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    const token = createToken(newUser);
    return res.status(200).json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        licenseNo: newUser.licenseNo
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ detail: 'Internal server error while registering' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ detail: 'Please provide both email and password' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return res.status(401).json({ detail: 'Invalid credentials. User does not exist.' });
    }

    const match = await bcrypt.compare(password, user.hashedPassword);
    if (!match) {
      return res.status(401).json({ detail: 'Invalid credentials. Incorrect password.' });
    }

    if (user.activeStatus === 'Inactive') {
      return res.status(403).json({ detail: 'Account is deactivated. Contact system admin.' });
    }

    const token = createToken(user);
    return res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        licenseNo: user.licenseNo
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ detail: 'Internal server error during login' });
  }
});

app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    licenseNo: user.licenseNo
  });
});

// --- ROUTE SEARCH & PUBLIC PASSENGER APIs (SRS 4.2 & 4.3, REQ-10 to REQ-24) ---
app.get('/api/search/routes', (req, res) => {
  const { source, destination, route_no, stop, q, agency, mode, zone } = req.query;

  let filtered = [...routes];

  // Search by Agency (Indian Railways, KSRTC, MSRTC, DTC, etc.)
  if (agency) {
    const agTerm = String(agency).trim().toLowerCase();
    filtered = filtered.filter(r => r.agency && r.agency.toLowerCase().includes(agTerm));
  }

  // Filter by Transit Mode (train, bus, metro)
  if (mode) {
    const modeTerm = String(mode).trim().toLowerCase();
    filtered = filtered.filter(r => r.mode && r.mode.toLowerCase() === modeTerm);
  }

  // Filter by Geographic Zone (North, South, West, East, Central, Pan-India)
  if (zone && zone !== 'All') {
    const zoneTerm = String(zone).trim().toLowerCase();
    filtered = filtered.filter(r => r.zone && (r.zone.toLowerCase() === zoneTerm || r.zone === 'Pan-India'));
  }

  // Search by Route Number, Name, Agency, or Keyword (REQ-10)
  if (route_no || q) {
    const term = String(route_no || q).trim().toLowerCase();
    filtered = filtered.filter(
      r =>
        r.route_no.toLowerCase().includes(term) ||
        r.route_name.toLowerCase().includes(term) ||
        (r.agency && r.agency.toLowerCase().includes(term)) ||
        r.source.toLowerCase().includes(term) ||
        r.destination.toLowerCase().includes(term)
    );
  }

  // Search by Stop Name (REQ-12)
  if (stop) {
    const stopTerm = String(stop).trim().toLowerCase();
    const matchingStopIds = stops
      .filter(s => s.name.toLowerCase().includes(stopTerm) || (s.city && s.city.toLowerCase().includes(stopTerm)))
      .map(s => s.id);

    filtered = filtered.filter(r => r.stop_ids.some(sid => matchingStopIds.includes(sid)));
  }

  // Search by Source and Destination (REQ-11)
  if (source && destination) {
    const srcTerm = String(source).trim().toLowerCase();
    const destTerm = String(destination).trim().toLowerCase();

    const srcStopIds = new Set(stops.filter(s => s.name.toLowerCase().includes(srcTerm) || (s.city && s.city.toLowerCase().includes(srcTerm))).map(s => s.id));
    const destStopIds = new Set(stops.filter(s => s.name.toLowerCase().includes(destTerm) || (s.city && s.city.toLowerCase().includes(destTerm))).map(s => s.id));

    filtered = filtered.filter(route => {
      let valid = false;
      for (let i = 0; i < route.stop_ids.length; i++) {
        if (srcStopIds.has(route.stop_ids[i])) {
          for (let j = i + 1; j < route.stop_ids.length; j++) {
            if (destStopIds.has(route.stop_ids[j])) {
              valid = true;
              break;
            }
          }
        }
        if (valid) break;
      }
      return valid;
    });
  } else if (source) {
    const srcTerm = String(source).trim().toLowerCase();
    const srcStopIds = new Set(stops.filter(s => s.name.toLowerCase().includes(srcTerm) || (s.city && s.city.toLowerCase().includes(srcTerm))).map(s => s.id));
    filtered = filtered.filter(r => r.stop_ids.some(sid => srcStopIds.has(sid)));
  } else if (destination) {
    const destTerm = String(destination).trim().toLowerCase();
    const destStopIds = new Set(stops.filter(s => s.name.toLowerCase().includes(destTerm) || (s.city && s.city.toLowerCase().includes(destTerm))).map(s => s.id));
    filtered = filtered.filter(r => r.stop_ids.some(sid => destStopIds.has(sid)));
  }

  // Map each route with resolved stops and live vehicle status (REQ-13, REQ-14)
  const results = filtered.map(route => {
    const routeStops = route.stop_ids
      .map((sid, idx) => {
        const s = stops.find(st => st.id === sid);
        return s ? { ...s, sequence: idx + 1 } : null;
      })
      .filter(Boolean);

    // Active trips on this route
    const activeTrip = trips.find(t => t.route_id === route.id && t.status === 'Active');
    const vehicle = activeTrip ? vehicles.find(v => v.id === activeTrip.vehicle_id) : null;
    const driver = activeTrip ? users.find(u => u.id === activeTrip.driver_id) : null;

    let liveStatus = {
      is_active: !!activeTrip,
      trip_id: activeTrip ? activeTrip.id : null,
      vehicle: vehicle ? { reg_no: vehicle.reg_no, model: vehicle.model, capacity: vehicle.capacity, vehicle_class: vehicle.vehicle_class, agency: vehicle.agency } : null,
      driver: driver ? { name: driver.name, phone: driver.phone } : null,
      current_location: activeTrip ? activeTrip.current_location : null,
      delay_minutes: activeTrip ? activeTrip.delay_minutes : 0,
      delay_reason: activeTrip ? activeTrip.delay_reason : 'On Schedule',
      occupancy_percent: activeTrip ? activeTrip.occupancy_percent : 80,
      platform: activeTrip ? activeTrip.platform : 'Platform 1',
      path_progress_percent: activeTrip ? activeTrip.path_progress_percent : 0,
      next_stop: activeTrip && activeTrip.next_stop_id ? stops.find(s => s.id === activeTrip.next_stop_id)?.name : null
    };

    return {
      id: route.id,
      route_no: route.route_no,
      route_name: route.route_name,
      agency: route.agency,
      mode: route.mode,
      zone: route.zone,
      fare_inr: route.fare_inr,
      typical_duration: route.typical_duration,
      frequency_mins: route.frequency_mins,
      source: route.source,
      destination: route.destination,
      distance_km: route.distance_km,
      stops: routeStops,
      live_status: liveStatus
    };
  });

  res.json(results);
});

// Detailed live route tracking with ETAs for every stop (REQ-16 to REQ-24)
app.get('/api/routes/:id/live', (req, res) => {
  const route = routes.find(r => r.id === req.params.id);
  if (!route) {
    return res.status(404).json({ detail: 'Route not found' });
  }

  const routeStops = route.stop_ids
    .map(sid => stops.find(s => s.id === sid))
    .filter(Boolean) as Stop[];

  const activeTrip = trips.find(t => t.route_id === route.id && t.status === 'Active');
  const vehicle = activeTrip ? vehicles.find(v => v.id === activeTrip.vehicle_id) : null;
  const driver = activeTrip ? users.find(u => u.id === activeTrip.driver_id) : null;

  // Calculate ETA for each stop (REQ-21, REQ-22, REQ-23, REQ-24)
  const stopsWithETA = routeStops.map((stop, idx) => {
    let etaInfo = null;
    if (activeTrip) {
      etaInfo = computeETA(activeTrip, stop, routeStops);
    }
    return {
      ...stop,
      sequence: idx + 1,
      eta: etaInfo ? etaInfo.etaTime : 'ETA unavailable',
      eta_minutes: etaInfo ? etaInfo.etaMinutes : null,
      is_delayed: etaInfo ? etaInfo.isDelayed : false
    };
  });

  // Check last known location if inactive (REQ-19)
  const lastTrip = tripHistory
    .filter(h => h.route_no === route.route_no)
    .sort((a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime())[0];

  res.json({
    route: {
      id: route.id,
      route_no: route.route_no,
      route_name: route.route_name,
      agency: route.agency,
      mode: route.mode,
      zone: route.zone,
      fare_inr: route.fare_inr,
      typical_duration: route.typical_duration,
      frequency_mins: route.frequency_mins,
      source: route.source,
      destination: route.destination,
      distance_km: route.distance_km,
      stops: stopsWithETA
    },
    active_trip: activeTrip ? {
      id: activeTrip.id,
      start_time: activeTrip.start_time,
      current_location: activeTrip.current_location,
      delay_minutes: activeTrip.delay_minutes,
      delay_reason: activeTrip.delay_reason || 'Normal schedule run',
      occupancy_percent: activeTrip.occupancy_percent || 85,
      platform: activeTrip.platform || 'Platform 1',
      path_progress_percent: activeTrip.path_progress_percent || 0,
      next_stop: activeTrip.next_stop_id ? stops.find(s => s.id === activeTrip.next_stop_id) : null,
      vehicle: vehicle ? { id: vehicle.id, reg_no: vehicle.reg_no, model: vehicle.model, capacity: vehicle.capacity, vehicle_class: vehicle.vehicle_class, agency: vehicle.agency, mode: vehicle.mode } : null,
      driver: driver ? { id: driver.id, name: driver.name, phone: driver.phone, licenseNo: driver.licenseNo } : null
    } : null,
    last_known_trip: lastTrip ? {
      ended_at: lastTrip.end_time,
      vehicle_reg: lastTrip.vehicle_reg
    } : null
  });
});

// All Active Trips overview
app.get('/api/trips/active', (req, res) => {
  const activeTripsData = trips.filter(t => t.status === 'Active').map(trip => {
    const route = routes.find(r => r.id === trip.route_id);
    const vehicle = vehicles.find(v => v.id === trip.vehicle_id);
    const driver = users.find(u => u.id === trip.driver_id);
    const nextStop = trip.next_stop_id ? stops.find(s => s.id === trip.next_stop_id) : null;

    return {
      trip_id: trip.id,
      route: route ? {
        id: route.id,
        route_no: route.route_no,
        route_name: route.route_name,
        agency: route.agency,
        mode: route.mode,
        zone: route.zone,
        fare_inr: route.fare_inr
      } : null,
      vehicle: vehicle ? {
        id: vehicle.id,
        reg_no: vehicle.reg_no,
        model: vehicle.model,
        agency: vehicle.agency,
        mode: vehicle.mode,
        vehicle_class: vehicle.vehicle_class
      } : null,
      driver: driver ? { id: driver.id, name: driver.name, phone: driver.phone } : null,
      start_time: trip.start_time,
      current_location: trip.current_location,
      delay_minutes: trip.delay_minutes,
      delay_reason: trip.delay_reason || 'Operating to schedule',
      occupancy_percent: trip.occupancy_percent || 85,
      platform: trip.platform || 'Platform 1',
      path_progress_percent: trip.path_progress_percent || 0,
      next_stop: nextStop ? { id: nextStop.id, name: nextStop.name, city: nextStop.city, code: nextStop.code } : null
    };
  });

  res.json(activeTripsData);
});

// --- PAN-INDIA LIVE PNR & TICKET LOOKUP API ---
app.get('/api/pnr/lookup', (req, res) => {
  const pnrQuery = String(req.query.pnr || '').trim();
  if (!pnrQuery) {
    return res.status(400).json({ detail: 'PNR or Ticket number is required' });
  }

  // 1. Search exact match in seeded PNRs
  const found = pnrs.find(p => p.pnr.toLowerCase() === pnrQuery.toLowerCase());
  if (found) {
    const trip = trips.find(t => t.id === found.trip_id);
    const vehicle = trip ? vehicles.find(v => v.id === trip.vehicle_id) : null;
    const route = trip ? routes.find(r => r.id === trip.route_id) : null;
    const nextStop = trip && trip.next_stop_id ? stops.find(s => s.id === trip.next_stop_id) : null;

    return res.json({
      found: true,
      pnr: found.pnr,
      passenger_name: found.passenger_name,
      route_no: found.route_no,
      route_name: found.route_name,
      agency: found.agency,
      mode: found.mode,
      source: found.source,
      destination: found.destination,
      boarding_point: found.boarding_point,
      date_of_journey: found.date_of_journey,
      booking_status: found.booking_status,
      coach_berth: found.coach_berth,
      live_status: trip ? {
        trip_id: trip.id,
        current_location: trip.current_location,
        speed: trip.current_location.speed,
        delay_minutes: trip.delay_minutes,
        delay_reason: trip.delay_reason || 'Normal running on corridor',
        platform: trip.platform || 'Platform 1',
        next_stop: nextStop ? { name: nextStop.name, city: nextStop.city, code: nextStop.code } : null,
        occupancy: trip.occupancy_percent || 85,
        vehicle: vehicle ? { reg_no: vehicle.reg_no, model: vehicle.model, class: vehicle.vehicle_class } : null
      } : null
    });
  }

  // 2. Real-time dynamic simulation for any 10-digit Indian Railway PNR or State Transport ticket code
  const isTrain = /^\d{10}$/.test(pnrQuery);
  const activeTrainTrip = trips.find(t => t.id === 'trip_vb_22436') || trips[0];
  const activeBusTrip = trips.find(t => t.id === 'trip_ksrtc_01') || trips[1];
  const assignedTrip = isTrain ? activeTrainTrip : activeBusTrip;
  const assignedRoute = routes.find(r => r.id === assignedTrip.route_id) || routes[0];
  const assignedVehicle = vehicles.find(v => v.id === assignedTrip.vehicle_id) || vehicles[0];
  const nextStop = assignedTrip.next_stop_id ? stops.find(s => s.id === assignedTrip.next_stop_id) : null;

  return res.json({
    found: true,
    simulated: true,
    pnr: pnrQuery,
    passenger_name: 'Verified Commuter Pass',
    route_no: assignedRoute.route_no,
    route_name: assignedRoute.route_name,
    agency: assignedRoute.agency,
    mode: assignedRoute.mode,
    source: assignedRoute.source,
    destination: assignedRoute.destination,
    boarding_point: assignedRoute.source,
    date_of_journey: new Date().toISOString().split('T')[0],
    booking_status: 'CNF (Confirmed)',
    coach_berth: isTrain ? 'B3 - Berth 28 (Middle)' : 'Seat 14 (Window)',
    live_status: {
      trip_id: assignedTrip.id,
      current_location: assignedTrip.current_location,
      speed: assignedTrip.current_location.speed,
      delay_minutes: assignedTrip.delay_minutes,
      delay_reason: assignedTrip.delay_reason || 'Clear corridor signal clearance',
      platform: assignedTrip.platform || 'Platform 1',
      next_stop: nextStop ? { name: nextStop.name, city: nextStop.city, code: nextStop.code } : null,
      occupancy: assignedTrip.occupancy_percent || 88,
      vehicle: {
        reg_no: assignedVehicle.reg_no,
        model: assignedVehicle.model,
        class: assignedVehicle.vehicle_class
      }
    }
  });
});

// --- LIVE STATION DEPARTURE & ARRIVAL BOARD API ---
app.get('/api/station-board', (req, res) => {
  const stationCode = String(req.query.station || 'NDLS').trim().toUpperCase();
  const matchedStop = stops.find(s => s.code.toUpperCase() === stationCode || s.name.toUpperCase().includes(stationCode)) || stops[0];

  // Find all routes that pass through this junction
  const connectedRoutes = routes.filter(r => r.stop_ids.includes(matchedStop.id));
  const activeOnConnected = trips.filter(t => connectedRoutes.some(r => r.id === t.route_id));

  const departures = connectedRoutes.map((r, i) => {
    const active = activeOnConnected.find(t => t.route_id === r.id);
    const scheduledHour = (7 + i * 2) % 24;
    const schedStr = `${String(scheduledHour).padStart(2, '0')}:${(i * 15) % 60 === 0 ? '00' : '30'}`;
    const delay = active ? active.delay_minutes : (i % 3 === 0 ? 5 : 0);
    const expDate = new Date();
    expDate.setHours(scheduledHour, ((i * 15) % 60) + delay);
    const expStr = expDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      service_no: r.route_no,
      service_name: r.route_name,
      agency: r.agency,
      mode: r.mode,
      destination: r.destination,
      scheduled_time: schedStr,
      expected_time: expStr,
      delay_minutes: delay,
      platform: active?.platform?.replace(/.*Platform /, 'PF ') || `PF ${((i + 1) % 6) + 1}`,
      status: delay === 0 ? 'On Time' : `Delayed by ${delay}m`,
      live_trip_id: active ? active.id : null,
      speed_kmh: active ? active.current_location.speed : null
    };
  });

  res.json({
    station: {
      id: matchedStop.id,
      code: matchedStop.code,
      name: matchedStop.name,
      city: matchedStop.city,
      state: matchedStop.state,
      type: matchedStop.type,
      location: matchedStop.location
    },
    boards: departures
  });
});

// --- REAL OPENSTREETMAP GEOCODING PROXY FOR INDIA ---
app.get('/api/external/india-search', async (req, res) => {
  const query = String(req.query.q || '').trim();
  if (!query) {
    return res.json([]);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=in&format=json&limit=8&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BharatTransitLive/1.0 (PublicTransportTrackingSystemIndia)'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const results = data.map((item: any) => ({
          display_name: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          type: item.type || 'place',
          category: item.class || 'boundary',
          address: item.address
        }));
        return res.json(results);
      }
    }
  } catch (err) {
    console.warn('Nominatim proxy fallback to local Pan-India database', err);
  }

  // Fallback to internal Pan-India stop database
  const qLower = query.toLowerCase();
  const localMatches = stops
    .filter(s => s.name.toLowerCase().includes(qLower) || s.city.toLowerCase().includes(qLower) || s.code.toLowerCase().includes(qLower))
    .map(s => ({
      display_name: `${s.name}, ${s.city}, ${s.state}, India`,
      lat: s.location.lat,
      lng: s.location.lng,
      type: s.type,
      category: 'transit'
    }));

  return res.json(localMatches);
});

// --- REGIONAL WEATHER & CORRIDOR ADVISORY API ---
app.get('/api/transit/weather', (req, res) => {
  const city = String(req.query.city || 'delhi').toLowerCase();

  const weatherMap: Record<string, any> = {
    delhi: { temp_c: 24, condition: 'Hazy Sunshine', aqi: 182, aqi_status: 'Moderate', visibility_km: 7.5, advisory: 'Normal rail and bus corridor clearance. No major fog disruption.' },
    mumbai: { temp_c: 29, condition: 'Warm & Humid', aqi: 85, aqi_status: 'Satisfactory', visibility_km: 9.0, advisory: 'Coastal breezes. Western ghat corridors operating smoothly.' },
    bengaluru: { temp_c: 22, condition: 'Pleasant & Breezy', aqi: 48, aqi_status: 'Good', visibility_km: 10.0, advisory: 'Favorable travel conditions across Mysuru expressway and airport line.' },
    kolkata: { temp_c: 27, condition: 'Partly Cloudy', aqi: 110, aqi_status: 'Moderate', visibility_km: 8.0, advisory: 'Normal operations across Howrah junction and Green line underwater metro.' },
    chennai: { temp_c: 30, condition: 'Sunny & Coastal Humid', aqi: 62, aqi_status: 'Satisfactory', visibility_km: 9.5, advisory: 'Clear signals along Southern Railway mainline corridors.' },
    pune: { temp_c: 25, condition: 'Clear Sky', aqi: 74, aqi_status: 'Satisfactory', visibility_km: 9.0, advisory: 'Expressway traffic flowing normally. Toll FASTag operational.' },
    lucknow: { temp_c: 23, condition: 'Mild Haze', aqi: 165, aqi_status: 'Moderate', visibility_km: 6.5, advisory: 'Agra-Lucknow Expressway speed adherence recommended.' }
  };

  const matched = Object.keys(weatherMap).find(k => city.includes(k)) || 'delhi';
  res.json({
    city: city.charAt(0).toUpperCase() + city.slice(1),
    ...weatherMap[matched]
  });
});

// --- OPERATING AGENCIES & HELPLINES API ---
app.get('/api/transit/agencies', (req, res) => {
  res.json([
    {
      name: 'Indian Railways (IRCTC)',
      category: 'National Rail & High-Speed',
      helpline: '139 (RailMadad)',
      coverage: 'Pan-India',
      active_services: 'Rajdhani, Vande Bharat, Shatabdi Express'
    },
    {
      name: 'KSRTC (Karnataka)',
      category: 'State Road Transport',
      helpline: '080-49596666',
      coverage: 'Karnataka, Goa, Kerala, Tamil Nadu',
      active_services: 'Airavat Club Class, FlyBus, Ambari Utsav'
    },
    {
      name: 'MSRTC (Maharashtra)',
      category: 'State Road Transport',
      helpline: '1800-22-1250',
      coverage: 'Maharashtra, Gujarat, Karnataka',
      active_services: 'Shivneri AC Volvo, Ashwamedh, Shivshahi'
    },
    {
      name: 'DTC & DIMTS (Delhi NCR)',
      category: 'Metropolitan Bus Transit',
      helpline: '1414 / 011-23370236',
      coverage: 'National Capital Territory of Delhi',
      active_services: 'Electric AC Buses, Airport Express 534'
    },
    {
      name: 'BMTC (Bengaluru)',
      category: 'Metropolitan Transit',
      helpline: '1800-425-1663',
      coverage: 'Bengaluru Urban & Airport Corridor',
      active_services: 'Vayu Vajra AC Volvo, Vajra City Express'
    },
    {
      name: 'KMRC (Kolkata Metro)',
      category: 'Rapid Metro Transit',
      helpline: '033-2288-4444',
      coverage: 'Kolkata Metropolitan Area',
      active_services: 'Green Line (Underwater Ganga Metro), Blue Line'
    }
  ]);
});

// --- DRIVER TRIP MANAGEMENT APIs (SRS 4.5, REQ-25 to REQ-30, BR-01, BR-02, SAFE-04) ---
app.get('/api/driver/assigned-details', authenticateToken, requireRole('Driver', 'Admin'), (req: AuthenticatedRequest, res) => {
  const driver = req.user!;

  // Find vehicle assigned to this driver
  const assignedVehicle = vehicles.find(v => v.assigned_driver_id === driver.id) || vehicles[0];
  const assignedRoute = assignedVehicle?.assigned_route_id
    ? routes.find(r => r.id === assignedVehicle.assigned_route_id)
    : routes[0];

  const activeTrip = trips.find(t => t.driver_id === driver.id && t.status === 'Active');

  res.json({
    driver: { id: driver.id, name: driver.name, licenseNo: driver.licenseNo, phone: driver.phone },
    assigned_vehicle: assignedVehicle,
    assigned_route: assignedRoute ? {
      ...assignedRoute,
      stops: assignedRoute.stop_ids.map(sid => stops.find(s => s.id === sid)).filter(Boolean)
    } : null,
    active_trip: activeTrip,
    available_vehicles: vehicles.filter(v => v.status !== 'Maintenance'),
    available_routes: routes
  });
});

app.post('/api/trips/start', authenticateToken, requireRole('Driver', 'Admin'), (req: AuthenticatedRequest, res) => {
  const driver = req.user!;
  const { vehicle_id, route_id, start_location } = req.body;

  if (!vehicle_id || !route_id) {
    return res.status(422).json({ detail: 'Vehicle ID and Route ID are required to start a trip' });
  }

  // BR-01 & SAFE-04: Prevent a vehicle from being assigned to more than one active trip at a time
  const existingActiveTripOnVeh = trips.find(t => t.vehicle_id === vehicle_id && t.status === 'Active');
  if (existingActiveTripOnVeh) {
    return res.status(409).json({ detail: `Vehicle is already currently on active trip #${existingActiveTripOnVeh.id}. Please complete that trip first.` });
  }

  // Check if driver already has an active trip
  const existingDriverTrip = trips.find(t => t.driver_id === driver.id && t.status === 'Active');
  if (existingDriverTrip) {
    return res.status(409).json({ detail: 'You already have an active trip in progress.' });
  }

  const route = routes.find(r => r.id === route_id);
  const vehicle = vehicles.find(v => v.id === vehicle_id);
  if (!route || !vehicle) {
    return res.status(404).json({ detail: 'Selected route or vehicle does not exist' });
  }

  const firstStop = route.stop_ids.length > 0 ? stops.find(s => s.id === route.stop_ids[0]) : null;
  const initialCoords = start_location || (firstStop ? firstStop.location : { lat: 28.6139, lng: 77.2090 });

  const newTrip: Trip = {
    id: generateId('trip'),
    route_id,
    vehicle_id,
    driver_id: driver.id,
    start_time: new Date().toISOString(),
    status: 'Active',
    current_location: {
      lat: initialCoords.lat,
      lng: initialCoords.lng,
      speed: 25,
      timestamp: new Date().toISOString()
    },
    next_stop_id: route.stop_ids.length > 1 ? route.stop_ids[1] : route.stop_ids[0],
    delay_minutes: 0,
    path_progress_percent: 0
  };

  trips.push(newTrip);
  vehicle.status = 'Active';

  res.status(201).json({
    message: 'Trip started successfully',
    trip: newTrip
  });
});

app.post('/api/trips/update-location', authenticateToken, requireRole('Driver', 'Admin'), (req: AuthenticatedRequest, res) => {
  const { trip_id, lat, lng, speed, delay_minutes, next_stop_id } = req.body;

  const trip = trips.find(t => t.id === trip_id && t.status === 'Active');
  if (!trip) {
    return res.status(404).json({ detail: 'Active trip not found' });
  }

  if (typeof lat === 'number' && typeof lng === 'number') {
    trip.current_location = {
      lat: parseFloat(lat.toFixed(5)),
      lng: parseFloat(lng.toFixed(5)),
      speed: Number(speed) || 30,
      timestamp: new Date().toISOString()
    };
  }

  if (delay_minutes !== undefined) {
    trip.delay_minutes = Math.max(0, parseInt(delay_minutes, 10));
  }

  if (next_stop_id && stops.some(s => s.id === next_stop_id)) {
    trip.next_stop_id = next_stop_id;
  }

  res.json({
    status: 'updated',
    current_location: trip.current_location,
    delay_minutes: trip.delay_minutes,
    next_stop_id: trip.next_stop_id
  });
});

app.post('/api/trips/end', authenticateToken, requireRole('Driver', 'Admin'), (req: AuthenticatedRequest, res) => {
  const { trip_id, final_location } = req.body;

  const trip = trips.find(t => t.id === trip_id && t.status === 'Active');
  if (!trip) {
    return res.status(404).json({ detail: 'Active trip not found' });
  }

  trip.status = 'Completed';
  trip.end_time = new Date().toISOString();

  // Mark vehicle as Idle
  const vehicle = vehicles.find(v => v.id === trip.vehicle_id);
  if (vehicle) {
    vehicle.status = 'Idle';
  }

  const route = routes.find(r => r.id === trip.route_id);
  const driver = users.find(u => u.id === trip.driver_id);

  // Record into historical logs (PERF-05, REQ-29)
  const logEntry: TripHistoryLog = {
    id: generateId('hist'),
    trip_id: trip.id,
    route_name: route ? route.route_name : 'Unknown Route',
    route_no: route ? route.route_no : 'N/A',
    vehicle_reg: vehicle ? vehicle.reg_no : 'N/A',
    driver_name: driver ? driver.name : 'Unknown Driver',
    start_time: trip.start_time,
    end_time: trip.end_time,
    status: 'Completed',
    distance_km: route ? route.distance_km : 10,
    avg_speed_kmh: 36.4,
    delay_minutes: trip.delay_minutes,
    date: new Date().toISOString().split('T')[0]
  };

  tripHistory.unshift(logEntry);

  res.json({
    message: 'Trip completed successfully',
    trip_summary: logEntry
  });
});

// --- ADMINISTRATOR MANAGEMENT APIs (SRS 4.6, REQ-31 to REQ-35, PERF-05) ---

// Stops
app.get('/api/admin/stops', authenticateToken, requireRole('Admin'), (req, res) => {
  res.json(stops);
});

app.post('/api/admin/stops', authenticateToken, requireRole('Admin'), (req, res) => {
  const { name, location, code } = req.body;
  if (!name || !location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return res.status(422).json({ detail: 'Valid stop name, latitude, and longitude are required' });
  }

  const newStop: Stop = {
    id: generateId('stop'),
    code: code || `ST-${String(stops.length + 1).padStart(2, '0')}`,
    name: name.trim(),
    location: {
      lat: parseFloat(location.lat.toFixed(5)),
      lng: parseFloat(location.lng.toFixed(5))
    }
  };

  stops.push(newStop);
  res.status(201).json(newStop);
});

app.put('/api/admin/stops/:id', authenticateToken, requireRole('Admin'), (req, res) => {
  const stop = stops.find(s => s.id === req.params.id);
  if (!stop) {
    return res.status(404).json({ detail: 'Stop not found' });
  }

  const { name, location, code } = req.body;
  if (name) stop.name = name.trim();
  if (code) stop.code = code.trim();
  if (location && typeof location.lat === 'number' && typeof location.lng === 'number') {
    stop.location = {
      lat: parseFloat(location.lat.toFixed(5)),
      lng: parseFloat(location.lng.toFixed(5))
    };
  }

  res.json(stop);
});

app.delete('/api/admin/stops/:id', authenticateToken, requireRole('Admin'), (req, res) => {
  const idx = stops.findIndex(s => s.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ detail: 'Stop not found' });
  }

  // Remove stop from routes referencing it
  for (const r of routes) {
    r.stop_ids = r.stop_ids.filter(id => id !== req.params.id);
  }

  stops.splice(idx, 1);
  res.status(204).send();
});

// Routes
app.get('/api/admin/routes', authenticateToken, requireRole('Admin'), (req, res) => {
  const resolved = routes.map(r => ({
    ...r,
    stops: r.stop_ids.map(sid => stops.find(s => s.id === sid)).filter(Boolean)
  }));
  res.json(resolved);
});

app.post('/api/admin/routes', authenticateToken, requireRole('Admin'), (req, res) => {
  const { route_no, route_name, source, destination, stop_ids, distance_km } = req.body;

  if (!route_name || !Array.isArray(stop_ids) || stop_ids.length < 2) {
    return res.status(422).json({ detail: 'Route name and at least 2 valid stops are required' });
  }

  for (const sid of stop_ids) {
    if (!stops.some(s => s.id === sid)) {
      return res.status(400).json({ detail: `Stop ID ${sid} is invalid` });
    }
  }

  const srcStop = stops.find(s => s.id === stop_ids[0]);
  const destStop = stops.find(s => s.id === stop_ids[stop_ids.length - 1]);

  const newRoute: RouteItem = {
    id: generateId('route'),
    route_no: route_no || `RT-${String(routes.length + 101)}`,
    route_name: route_name.trim(),
    source: source || (srcStop ? srcStop.name : 'Origin'),
    destination: destination || (destStop ? destStop.name : 'Destination'),
    stop_ids,
    distance_km: parseFloat(distance_km) || 12.0
  };

  routes.push(newRoute);
  res.status(201).json(newRoute);
});

app.put('/api/admin/routes/:id', authenticateToken, requireRole('Admin'), (req, res) => {
  const route = routes.find(r => r.id === req.params.id);
  if (!route) {
    return res.status(404).json({ detail: 'Route not found' });
  }

  const { route_no, route_name, source, destination, stop_ids, distance_km } = req.body;

  if (stop_ids && Array.isArray(stop_ids)) {
    for (const sid of stop_ids) {
      if (!stops.some(s => s.id === sid)) {
        return res.status(400).json({ detail: `Stop ID ${sid} is invalid` });
      }
    }
    route.stop_ids = stop_ids;
  }

  if (route_no) route.route_no = route_no.trim();
  if (route_name) route.route_name = route_name.trim();
  if (source) route.source = source.trim();
  if (destination) route.destination = destination.trim();
  if (distance_km !== undefined) route.distance_km = parseFloat(distance_km);

  res.json(route);
});

app.delete('/api/admin/routes/:id', authenticateToken, requireRole('Admin'), (req, res) => {
  const idx = routes.findIndex(r => r.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ detail: 'Route not found' });
  }

  // Prevent accidental deletion if route has active trip (SAFE-01, SAFE-02)
  const active = trips.some(t => t.route_id === req.params.id && t.status === 'Active');
  if (active) {
    return res.status(400).json({ detail: 'Cannot delete route with an active in-progress trip' });
  }

  routes.splice(idx, 1);
  res.status(204).send();
});

// Vehicles (REQ-32, REQ-33, REQ-34)
app.get('/api/admin/vehicles', authenticateToken, requireRole('Admin'), (req, res) => {
  const enriched = vehicles.map(v => {
    const driver = users.find(u => u.id === v.assigned_driver_id);
    const route = routes.find(r => r.id === v.assigned_route_id);
    const activeTrip = trips.find(t => t.vehicle_id === v.id && t.status === 'Active');

    return {
      ...v,
      driver_name: driver ? driver.name : null,
      route_name: route ? `${route.route_no} - ${route.route_name}` : null,
      has_active_trip: !!activeTrip
    };
  });
  res.json(enriched);
});

app.post('/api/admin/vehicles', authenticateToken, requireRole('Admin'), (req, res) => {
  const { reg_no, model, capacity, status, assigned_driver_id, assigned_route_id } = req.body;

  if (!reg_no || !model || !capacity) {
    return res.status(422).json({ detail: 'Registration number, model, and seating capacity are required' });
  }

  if (vehicles.some(v => v.reg_no.toLowerCase() === reg_no.trim().toLowerCase())) {
    return res.status(409).json({ detail: 'Vehicle registration number already exists' });
  }

  const newVeh: Vehicle = {
    id: generateId('veh'),
    reg_no: reg_no.trim().toUpperCase(),
    model: model.trim(),
    capacity: parseInt(capacity, 10),
    status: status || 'Idle',
    assigned_driver_id: assigned_driver_id || undefined,
    assigned_route_id: assigned_route_id || undefined
  };

  vehicles.push(newVeh);
  res.status(201).json(newVeh);
});

app.put('/api/admin/vehicles/:id', authenticateToken, requireRole('Admin'), (req, res) => {
  const veh = vehicles.find(v => v.id === req.params.id);
  if (!veh) {
    return res.status(404).json({ detail: 'Vehicle not found' });
  }

  const { reg_no, model, capacity, status, assigned_driver_id, assigned_route_id } = req.body;

  if (reg_no) veh.reg_no = reg_no.trim().toUpperCase();
  if (model) veh.model = model.trim();
  if (capacity) veh.capacity = parseInt(capacity, 10);
  if (status) veh.status = status;
  if (assigned_driver_id !== undefined) veh.assigned_driver_id = assigned_driver_id || undefined;
  if (assigned_route_id !== undefined) veh.assigned_route_id = assigned_route_id || undefined;

  res.json(veh);
});

app.delete('/api/admin/vehicles/:id', authenticateToken, requireRole('Admin'), (req, res) => {
  const idx = vehicles.findIndex(v => v.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ detail: 'Vehicle not found' });
  }

  if (trips.some(t => t.vehicle_id === req.params.id && t.status === 'Active')) {
    return res.status(400).json({ detail: 'Cannot delete vehicle while an active trip is running' });
  }

  vehicles.splice(idx, 1);
  res.status(204).send();
});

// Drivers Management (REQ-33, BR-05, SEC-05)
app.get('/api/admin/drivers', authenticateToken, requireRole('Admin'), (req, res) => {
  const driverUsers = users
    .filter(u => u.role === 'Driver')
    .map(d => {
      const assignedVehicle = vehicles.find(v => v.assigned_driver_id === d.id);
      const activeTrip = trips.find(t => t.driver_id === d.id && t.status === 'Active');
      return {
        id: d.id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        licenseNo: d.licenseNo,
        activeStatus: d.activeStatus,
        assigned_vehicle: assignedVehicle ? { id: assignedVehicle.id, reg_no: assignedVehicle.reg_no } : null,
        is_on_trip: !!activeTrip
      };
    });

  res.json(driverUsers);
});

app.post('/api/admin/drivers', authenticateToken, requireRole('Admin'), async (req, res) => {
  const { name, email, password, phone, licenseNo } = req.body;
  if (!name || !email || !password || !licenseNo) {
    return res.status(422).json({ detail: 'Name, email, password, and driving license are required' });
  }

  if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return res.status(409).json({ detail: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newDriver: User = {
    id: generateId('driver'),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    hashedPassword,
    role: 'Driver',
    phone: phone || '',
    licenseNo: licenseNo.trim(),
    activeStatus: 'Active',
    createdAt: new Date().toISOString()
  };

  users.push(newDriver);
  res.status(201).json({
    id: newDriver.id,
    name: newDriver.name,
    email: newDriver.email,
    phone: newDriver.phone,
    licenseNo: newDriver.licenseNo,
    activeStatus: newDriver.activeStatus
  });
});

app.put('/api/admin/drivers/:id', authenticateToken, requireRole('Admin'), (req, res) => {
  const driver = users.find(u => u.id === req.params.id && u.role === 'Driver');
  if (!driver) {
    return res.status(404).json({ detail: 'Driver account not found' });
  }

  const { name, phone, licenseNo, activeStatus } = req.body;
  if (name) driver.name = name.trim();
  if (phone) driver.phone = phone.trim();
  if (licenseNo) driver.licenseNo = licenseNo.trim();
  if (activeStatus && (activeStatus === 'Active' || activeStatus === 'Inactive')) {
    driver.activeStatus = activeStatus;
  }

  res.json({
    id: driver.id,
    name: driver.name,
    email: driver.email,
    phone: driver.phone,
    licenseNo: driver.licenseNo,
    activeStatus: driver.activeStatus
  });
});

// Transport Performance Reports (SRS PERF-05)
app.get('/api/admin/reports', authenticateToken, requireRole('Admin'), (req, res) => {
  const totalTrips = tripHistory.length + trips.filter(t => t.status === 'Active').length;
  const completedTrips = tripHistory.filter(h => h.status === 'Completed').length;
  const delayedTrips = tripHistory.filter(h => h.delay_minutes >= 5).length;
  const onTimePercentage = completedTrips > 0
    ? Math.round(((completedTrips - delayedTrips) / completedTrips) * 100)
    : 100;

  const totalKm = tripHistory.reduce((acc, curr) => acc + curr.distance_km, 0);
  const activeVehiclesCount = vehicles.filter(v => v.status === 'Active').length;
  const activeDriversCount = users.filter(u => u.role === 'Driver' && u.activeStatus === 'Active').length;

  res.json({
    summary: {
      total_routes: routes.length,
      total_stops: stops.length,
      total_vehicles: vehicles.length,
      active_vehicles: activeVehiclesCount,
      total_drivers: activeDriversCount,
      total_trips_logged: totalTrips,
      completed_trips: completedTrips,
      on_time_rate_percent: onTimePercentage,
      total_distance_covered_km: parseFloat(totalKm.toFixed(1)),
      avg_fleet_delay_minutes: 2.8
    },
    trip_logs: tripHistory,
    fleet_status: {
      active: activeVehiclesCount,
      idle: vehicles.filter(v => v.status === 'Idle').length,
      maintenance: vehicles.filter(v => v.status === 'Maintenance').length
    }
  });
});

// --- VITE MIDDLEWARE OR STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PTMS Server operating at http://0.0.0.0:${PORT}`);
  });
}

// Only start standalone HTTP server when not in a serverless environment (e.g. Vercel)
if (!process.env.VERCEL && !process.env.NOW_REGION) {
  startServer();
}

export { app };
export default app;
