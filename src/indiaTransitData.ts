export interface Stop {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  zone: 'North' | 'South' | 'West' | 'East' | 'Central';
  type: 'railway' | 'bus_terminal' | 'metro_station' | 'airport';
  location: { lat: number; lng: number };
}

export interface RouteItem {
  id: string;
  route_no: string;
  route_name: string;
  source: string;
  destination: string;
  agency: string;
  mode: 'train' | 'bus' | 'metro';
  zone: 'North' | 'South' | 'West' | 'East' | 'Central' | 'Pan-India';
  fare_inr: number;
  frequency_mins: number;
  typical_duration: string;
  stop_ids: string[];
  distance_km: number;
}

export interface Vehicle {
  id: string;
  reg_no: string;
  model: string;
  capacity: number;
  status: 'Active' | 'Idle' | 'Maintenance';
  agency: string;
  mode: 'train' | 'bus' | 'metro';
  vehicle_class: string;
  assigned_driver_id?: string;
  assigned_route_id?: string;
}

export interface Trip {
  id: string;
  route_id: string;
  vehicle_id: string;
  driver_id: string;
  start_time: string;
  end_time?: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  current_location: {
    lat: number;
    lng: number;
    speed: number;
    timestamp: string;
  };
  next_stop_id?: string;
  delay_minutes: number;
  delay_reason?: string;
  occupancy_percent?: number;
  platform?: string;
  path_progress_percent: number;
}

export interface TripHistoryLog {
  id: string;
  trip_id: string;
  route_name: string;
  route_no: string;
  vehicle_reg: string;
  driver_name: string;
  start_time: string;
  end_time: string;
  status: 'Completed' | 'Cancelled';
  distance_km: number;
  avg_speed_kmh: number;
  delay_minutes: number;
  date: string;
}

export interface PnrRecord {
  pnr: string;
  passenger_name: string;
  route_no: string;
  route_name: string;
  agency: string;
  mode: 'train' | 'bus';
  source: string;
  destination: string;
  boarding_point: string;
  date_of_journey: string;
  booking_status: string;
  coach_berth: string;
  trip_id: string;
}

// ----------------------------------------------------
// NATIONWIDE REAL INDIAN TRANSIT STOPS & TERMINALS
// ----------------------------------------------------
export const initialStops: Stop[] = [
  // --- NORTHERN CORRIDOR (Delhi, UP, Rajasthan) ---
  {
    id: 'stop_ndls',
    code: 'NDLS',
    name: 'New Delhi Railway Station (Ajmeri Gate)',
    city: 'New Delhi',
    state: 'Delhi',
    zone: 'North',
    type: 'railway',
    location: { lat: 28.6429, lng: 77.2195 }
  },
  {
    id: 'stop_nzm',
    code: 'NZM',
    name: 'Hazrat Nizamuddin Terminal',
    city: 'New Delhi',
    state: 'Delhi',
    zone: 'North',
    type: 'railway',
    location: { lat: 28.5888, lng: 77.2534 }
  },
  {
    id: 'stop_anvt',
    code: 'ANVT',
    name: 'Anand Vihar ISBT & Terminal',
    city: 'Delhi',
    state: 'Delhi',
    zone: 'North',
    type: 'bus_terminal',
    location: { lat: 28.6502, lng: 77.3150 }
  },
  {
    id: 'stop_del_t3',
    code: 'DEL-T3',
    name: 'IGI Airport Terminal 3 Hub',
    city: 'New Delhi',
    state: 'Delhi',
    zone: 'North',
    type: 'airport',
    location: { lat: 28.5562, lng: 77.1000 }
  },
  {
    id: 'stop_kg_isbt',
    code: 'KG-ISBT',
    name: 'Kashmere Gate Maharana Pratap ISBT',
    city: 'Delhi',
    state: 'Delhi',
    zone: 'North',
    type: 'bus_terminal',
    location: { lat: 28.6675, lng: 77.2285 }
  },
  {
    id: 'stop_agc',
    code: 'AGC',
    name: 'Agra Cantt Railway Station',
    city: 'Agra',
    state: 'Uttar Pradesh',
    zone: 'North',
    type: 'railway',
    location: { lat: 27.1584, lng: 77.9904 }
  },
  {
    id: 'stop_cnb',
    code: 'CNB',
    name: 'Kanpur Central Junction',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    zone: 'North',
    type: 'railway',
    location: { lat: 26.4547, lng: 80.3507 }
  },
  {
    id: 'stop_lko_alm',
    code: 'LKO-ALM',
    name: 'Lucknow Alambagh Bus Terminal',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    zone: 'North',
    type: 'bus_terminal',
    location: { lat: 26.8315, lng: 80.9237 }
  },
  {
    id: 'stop_pryj',
    code: 'PRYJ',
    name: 'Prayagraj Junction (Allahabad)',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    zone: 'North',
    type: 'railway',
    location: { lat: 25.4484, lng: 81.8340 }
  },
  {
    id: 'stop_bsb',
    code: 'BSB',
    name: 'Varanasi Junction (Cantonment)',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    zone: 'North',
    type: 'railway',
    location: { lat: 25.3283, lng: 82.9866 }
  },
  {
    id: 'stop_ddu',
    code: 'DDU',
    name: 'Pt. Deen Dayal Upadhyaya Junction',
    city: 'Mughalsarai',
    state: 'Uttar Pradesh',
    zone: 'North',
    type: 'railway',
    location: { lat: 25.2818, lng: 83.1205 }
  },
  {
    id: 'stop_jpr_sc',
    code: 'JPR-SC',
    name: 'Jaipur Sindhi Camp Central Bus Stand',
    city: 'Jaipur',
    state: 'Rajasthan',
    zone: 'North',
    type: 'bus_terminal',
    location: { lat: 26.9239, lng: 75.8005 }
  },
  {
    id: 'stop_kota',
    code: 'KOTA',
    name: 'Kota Junction',
    city: 'Kota',
    state: 'Rajasthan',
    zone: 'North',
    type: 'railway',
    location: { lat: 25.2185, lng: 75.8647 }
  },

  // --- WESTERN CORRIDOR (Mumbai, Pune, Gujarat) ---
  {
    id: 'stop_mmct',
    code: 'MMCT',
    name: 'Mumbai Central Terminus',
    city: 'Mumbai',
    state: 'Maharashtra',
    zone: 'West',
    type: 'railway',
    location: { lat: 18.9696, lng: 72.8193 }
  },
  {
    id: 'stop_dr',
    code: 'DR',
    name: 'Dadar Asiad Bus & Railway Terminal',
    city: 'Mumbai',
    state: 'Maharashtra',
    zone: 'West',
    type: 'bus_terminal',
    location: { lat: 19.0178, lng: 72.8478 }
  },
  {
    id: 'stop_bkc',
    code: 'BKC',
    name: 'Bandra Kurla Complex (BKC) Bus Port',
    city: 'Mumbai',
    state: 'Maharashtra',
    zone: 'West',
    type: 'bus_terminal',
    location: { lat: 19.0664, lng: 72.8687 }
  },
  {
    id: 'stop_vashi',
    code: 'VASHI',
    name: 'Vashi Highway Interchange (Navi Mumbai)',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    zone: 'West',
    type: 'bus_terminal',
    location: { lat: 19.0645, lng: 72.9975 }
  },
  {
    id: 'stop_lnv',
    code: 'LNV',
    name: 'Lonavala Expressway Transit Station',
    city: 'Lonavala',
    state: 'Maharashtra',
    zone: 'West',
    type: 'bus_terminal',
    location: { lat: 18.7548, lng: 73.4072 }
  },
  {
    id: 'stop_swg_pun',
    code: 'SWG-PUN',
    name: 'Pune Swargate Central Bus Station',
    city: 'Pune',
    state: 'Maharashtra',
    zone: 'West',
    type: 'bus_terminal',
    location: { lat: 18.5018, lng: 73.8586 }
  },
  {
    id: 'stop_pune',
    code: 'PUNE',
    name: 'Pune Junction Railway Station',
    city: 'Pune',
    state: 'Maharashtra',
    zone: 'West',
    type: 'railway',
    location: { lat: 18.5289, lng: 73.8744 }
  },
  {
    id: 'stop_adi',
    code: 'ADI',
    name: 'Ahmedabad Junction (Kalupur)',
    city: 'Ahmedabad',
    state: 'Gujarat',
    zone: 'West',
    type: 'railway',
    location: { lat: 23.0270, lng: 72.6012 }
  },
  {
    id: 'stop_gtm_adi',
    code: 'GTM-ADI',
    name: 'Ahmedabad Geeta Mandir Central Bus Port',
    city: 'Ahmedabad',
    state: 'Gujarat',
    zone: 'West',
    type: 'bus_terminal',
    location: { lat: 23.0125, lng: 72.5895 }
  },
  {
    id: 'stop_brc',
    code: 'BRC',
    name: 'Vadodara Junction',
    city: 'Vadodara',
    state: 'Gujarat',
    zone: 'West',
    type: 'railway',
    location: { lat: 22.3107, lng: 73.1812 }
  },
  {
    id: 'stop_st',
    code: 'ST',
    name: 'Surat Central Station & Bus Port',
    city: 'Surat',
    state: 'Gujarat',
    zone: 'West',
    type: 'railway',
    location: { lat: 21.2049, lng: 72.8406 }
  },
  {
    id: 'stop_rtm',
    code: 'RTM',
    name: 'Ratlam Junction (Western Hub)',
    city: 'Ratlam',
    state: 'Madhya Pradesh',
    zone: 'Central',
    type: 'railway',
    location: { lat: 23.3441, lng: 75.0401 }
  },

  // --- SOUTHERN CORRIDOR (Bengaluru, Chennai, Hyderabad, Mysuru) ---
  {
    id: 'stop_sbc',
    code: 'SBC',
    name: 'KSR Bengaluru City (Majestic Intermodal)',
    city: 'Bengaluru',
    state: 'Karnataka',
    zone: 'South',
    type: 'railway',
    location: { lat: 12.9781, lng: 77.5696 }
  },
  {
    id: 'stop_bnc',
    code: 'BNC',
    name: 'Bengaluru Cantonment Station',
    city: 'Bengaluru',
    state: 'Karnataka',
    zone: 'South',
    type: 'railway',
    location: { lat: 12.9934, lng: 77.5986 }
  },
  {
    id: 'stop_kia_blr',
    code: 'KIA-BLR',
    name: 'Kempegowda International Airport Terminal (BMTC TTMC)',
    city: 'Bengaluru',
    state: 'Karnataka',
    zone: 'South',
    type: 'airport',
    location: { lat: 13.1986, lng: 77.7066 }
  },
  {
    id: 'stop_ecity',
    code: 'ECITY',
    name: 'Electronic City Infosys Gate (BMTC Hub)',
    city: 'Bengaluru',
    state: 'Karnataka',
    zone: 'South',
    type: 'bus_terminal',
    location: { lat: 12.8399, lng: 77.6770 }
  },
  {
    id: 'stop_mys_sub',
    code: 'MYS-SUB',
    name: 'Mysuru Suburban KSRTC Bus Stand',
    city: 'Mysuru',
    state: 'Karnataka',
    zone: 'South',
    type: 'bus_terminal',
    location: { lat: 12.3106, lng: 76.6554 }
  },
  {
    id: 'stop_mas',
    code: 'MAS',
    name: 'MGR Chennai Central Terminus',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zone: 'South',
    type: 'railway',
    location: { lat: 13.0827, lng: 80.2707 }
  },
  {
    id: 'stop_kjt_mas',
    code: 'KPD',
    name: 'Katpadi Junction (Vellore)',
    city: 'Vellore',
    state: 'Tamil Nadu',
    zone: 'South',
    type: 'railway',
    location: { lat: 12.9705, lng: 79.1378 }
  },
  {
    id: 'stop_kcbt',
    code: 'KCBT',
    name: 'Chennai Kilambakkam Kalaignar Terminus (KCBT)',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zone: 'South',
    type: 'bus_terminal',
    location: { lat: 12.8354, lng: 80.0520 }
  },
  {
    id: 'stop_sa_jn',
    code: 'SA',
    name: 'Salem Junction Bus & Rail Hub',
    city: 'Salem',
    state: 'Tamil Nadu',
    zone: 'South',
    type: 'railway',
    location: { lat: 11.6643, lng: 78.1460 }
  },
  {
    id: 'stop_cbe_gnd',
    code: 'CBE-GND',
    name: 'Coimbatore Gandhipuram Central Bus Stand',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    zone: 'South',
    type: 'bus_terminal',
    location: { lat: 11.0183, lng: 76.9644 }
  },
  {
    id: 'stop_sc',
    code: 'SC',
    name: 'Secunderabad Junction',
    city: 'Hyderabad',
    state: 'Telangana',
    zone: 'South',
    type: 'railway',
    location: { lat: 17.4344, lng: 78.5015 }
  },
  {
    id: 'stop_mgbs_hyd',
    code: 'MGBS-HYD',
    name: 'Hyderabad Mahatma Gandhi Bus Station (MGBS)',
    city: 'Hyderabad',
    state: 'Telangana',
    zone: 'South',
    type: 'bus_terminal',
    location: { lat: 17.3789, lng: 78.4816 }
  },
  {
    id: 'stop_hitec',
    code: 'HITEC',
    name: 'Hitec City Mindspace Cyber Towers Hub',
    city: 'Hyderabad',
    state: 'Telangana',
    zone: 'South',
    type: 'metro_station',
    location: { lat: 17.4504, lng: 78.3808 }
  },
  {
    id: 'stop_bza_pnbs',
    code: 'BZA-PNBS',
    name: 'Vijayawada Pandit Nehru Bus Station & Junction',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    zone: 'South',
    type: 'railway',
    location: { lat: 16.5062, lng: 80.6480 }
  },
  {
    id: 'stop_vskp',
    code: 'VSKP',
    name: 'Visakhapatnam Junction Railway Station',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    zone: 'South',
    type: 'railway',
    location: { lat: 17.7215, lng: 83.2870 }
  },

  // --- EASTERN CORRIDOR (Kolkata, Howrah, Durgapur, Asansol) ---
  {
    id: 'stop_hwh',
    code: 'HWH',
    name: 'Howrah Junction Railway & Ferry Terminal',
    city: 'Kolkata / Howrah',
    state: 'West Bengal',
    zone: 'East',
    type: 'railway',
    location: { lat: 22.5839, lng: 88.3426 }
  },
  {
    id: 'stop_sdah',
    code: 'SDAH',
    name: 'Sealdah Station (North/South Terminal)',
    city: 'Kolkata',
    state: 'West Bengal',
    zone: 'East',
    type: 'railway',
    location: { lat: 22.5672, lng: 88.3712 }
  },
  {
    id: 'stop_esp_kol',
    code: 'ESP-KOL',
    name: 'Esplanade Central Bus & Metro Interchange',
    city: 'Kolkata',
    state: 'West Bengal',
    zone: 'East',
    type: 'bus_terminal',
    location: { lat: 22.5645, lng: 88.3517 }
  },
  {
    id: 'stop_sec_v',
    code: 'SEC-V',
    name: 'Salt Lake Sector V IT Hub Metro Terminal',
    city: 'Kolkata',
    state: 'West Bengal',
    zone: 'East',
    type: 'metro_station',
    location: { lat: 22.5735, lng: 88.4331 }
  },
  {
    id: 'stop_dgr_cc',
    code: 'DGR-CC',
    name: 'Durgapur City Centre Central Bus Stand',
    city: 'Durgapur',
    state: 'West Bengal',
    zone: 'East',
    type: 'bus_terminal',
    location: { lat: 23.5334, lng: 87.3219 }
  },
  {
    id: 'stop_asn',
    code: 'ASN',
    name: 'Asansol Junction Railway Station',
    city: 'Asansol',
    state: 'West Bengal',
    zone: 'East',
    type: 'railway',
    location: { lat: 23.6889, lng: 86.9661 }
  }
];

// ----------------------------------------------------
// PAN-INDIA TRANSIT ROUTES
// ----------------------------------------------------
export const initialRoutes: RouteItem[] = [
  // 1. New Delhi - Mumbai Central AC Rajdhani Express
  {
    id: 'route_12952',
    route_no: '12952',
    route_name: 'New Delhi - Mumbai Central AC Rajdhani Express',
    source: 'New Delhi Railway Station (Ajmeri Gate)',
    destination: 'Mumbai Central Terminus',
    agency: 'Indian Railways (Northern/Western)',
    mode: 'train',
    zone: 'Pan-India',
    fare_inr: 2850,
    frequency_mins: 1440,
    typical_duration: '15h 32m',
    stop_ids: ['stop_ndls', 'stop_kota', 'stop_rtm', 'stop_brc', 'stop_st', 'stop_mmct'],
    distance_km: 1384
  },

  // 2. New Delhi - Varanasi Vande Bharat Express
  {
    id: 'route_22436',
    route_no: '22436',
    route_name: 'New Delhi - Varanasi Vande Bharat Express',
    source: 'New Delhi Railway Station (Ajmeri Gate)',
    destination: 'Varanasi Junction (Cantonment)',
    agency: 'Indian Railways (Northern)',
    mode: 'train',
    zone: 'North',
    fare_inr: 1750,
    frequency_mins: 1440,
    typical_duration: '8h 00m',
    stop_ids: ['stop_ndls', 'stop_cnb', 'stop_pryj', 'stop_bsb'],
    distance_km: 759
  },

  // 3. Howrah - New Delhi Eastern Rajdhani Express
  {
    id: 'route_12301',
    route_no: '12301',
    route_name: 'Howrah - New Delhi Eastern Rajdhani Express (via Gaya)',
    source: 'Howrah Junction Railway & Ferry Terminal',
    destination: 'New Delhi Railway Station (Ajmeri Gate)',
    agency: 'Indian Railways (Eastern)',
    mode: 'train',
    zone: 'Pan-India',
    fare_inr: 2980,
    frequency_mins: 1440,
    typical_duration: '17h 15m',
    stop_ids: ['stop_hwh', 'stop_asn', 'stop_ddu', 'stop_pryj', 'stop_cnb', 'stop_ndls'],
    distance_km: 1450
  },

  // 4. KSR Bengaluru - MGR Chennai Central Shatabdi Express
  {
    id: 'route_12008',
    route_no: '12008',
    route_name: 'KSR Bengaluru - MGR Chennai Central Shatabdi Express',
    source: 'KSR Bengaluru City (Majestic Intermodal)',
    destination: 'MGR Chennai Central Terminus',
    agency: 'Indian Railways (Southern)',
    mode: 'train',
    zone: 'South',
    fare_inr: 980,
    frequency_mins: 720,
    typical_duration: '4h 45m',
    stop_ids: ['stop_sbc', 'stop_bnc', 'stop_kjt_mas', 'stop_mas'],
    distance_km: 362
  },

  // 5. Mumbai Central - Ahmedabad Vande Bharat Express
  {
    id: 'route_20901',
    route_no: '20901',
    route_name: 'Mumbai Central - Ahmedabad Vande Bharat Express',
    source: 'Mumbai Central Terminus',
    destination: 'Ahmedabad Junction (Kalupur)',
    agency: 'Indian Railways (Western)',
    mode: 'train',
    zone: 'West',
    fare_inr: 1390,
    frequency_mins: 1440,
    typical_duration: '5h 25m',
    stop_ids: ['stop_mmct', 'stop_st', 'stop_brc', 'stop_adi'],
    distance_km: 491
  },

  // 6. Secunderabad - Visakhapatnam Vande Bharat Express
  {
    id: 'route_20834',
    route_no: '20834',
    route_name: 'Secunderabad - Visakhapatnam Vande Bharat Express',
    source: 'Secunderabad Junction',
    destination: 'Visakhapatnam Junction Railway Station',
    agency: 'Indian Railways (South Central)',
    mode: 'train',
    zone: 'South',
    fare_inr: 1665,
    frequency_mins: 1440,
    typical_duration: '8h 30m',
    stop_ids: ['stop_sc', 'stop_bza_pnbs', 'stop_vskp'],
    distance_km: 699
  },

  // 7. KSRTC Airavat Club Class (Bengaluru - Mysuru Highway)
  {
    id: 'route_ka_mys_01',
    route_no: 'KA-AIR-01',
    route_name: 'KSRTC Airavat Club Class Multi-Axle Volvo',
    source: 'KSR Bengaluru City (Majestic Intermodal)',
    destination: 'Mysuru Suburban KSRTC Bus Stand',
    agency: 'KSRTC (Karnataka State)',
    mode: 'bus',
    zone: 'South',
    fare_inr: 340,
    frequency_mins: 20,
    typical_duration: '2h 15m',
    stop_ids: ['stop_sbc', 'stop_mys_sub'],
    distance_km: 145
  },

  // 8. MSRTC Shivneri AC Volvo (Mumbai - Pune Expressway)
  {
    id: 'route_mh_pun_04',
    route_no: 'MH-SHIV-04',
    route_name: 'MSRTC Shivneri AC Volvo (Mumbai-Pune Expressway)',
    source: 'Dadar Asiad Bus & Railway Terminal',
    destination: 'Pune Swargate Central Bus Station',
    agency: 'MSRTC (Maharashtra State)',
    mode: 'bus',
    zone: 'West',
    fare_inr: 510,
    frequency_mins: 15,
    typical_duration: '3h 30m',
    stop_ids: ['stop_dr', 'stop_vashi', 'stop_lnv', 'stop_swg_pun'],
    distance_km: 158
  },

  // 9. UPSRTC Janrath AC Express (Lucknow - Agra Yamuna Expressway)
  {
    id: 'route_up_exp_12',
    route_no: 'UP-JAN-12',
    route_name: 'UPSRTC Janrath AC Express (Agra-Lucknow Expressway)',
    source: 'Lucknow Alambagh Bus Terminal',
    destination: 'Agra Cantt Railway Station',
    agency: 'UPSRTC (Uttar Pradesh)',
    mode: 'bus',
    zone: 'North',
    fare_inr: 590,
    frequency_mins: 45,
    typical_duration: '4h 45m',
    stop_ids: ['stop_lko_alm', 'stop_cnb', 'stop_agc'],
    distance_km: 335
  },

  // 10. GSRTC Gurjarnagri Express (Ahmedabad - Surat)
  {
    id: 'route_gj_sur_08',
    route_no: 'GJ-GUR-08',
    route_name: 'GSRTC Gurjarnagri Intercity Express',
    source: 'Ahmedabad Geeta Mandir Central Bus Port',
    destination: 'Surat Central Station & Bus Port',
    agency: 'GSRTC (Gujarat State)',
    mode: 'bus',
    zone: 'West',
    fare_inr: 280,
    frequency_mins: 30,
    typical_duration: '4h 15m',
    stop_ids: ['stop_gtm_adi', 'stop_brc', 'stop_st'],
    distance_km: 265
  },

  // 11. TSRTC Garuda Plus (Hyderabad - Vijayawada)
  {
    id: 'route_ts_gar_22',
    route_no: 'TS-GAR-22',
    route_name: 'TSRTC Garuda Plus Multi-Axle AC Sleeper',
    source: 'Hyderabad Mahatma Gandhi Bus Station (MGBS)',
    destination: 'Vijayawada Pandit Nehru Bus Station & Junction',
    agency: 'TSRTC (Telangana State)',
    mode: 'bus',
    zone: 'South',
    fare_inr: 650,
    frequency_mins: 30,
    typical_duration: '5h 00m',
    stop_ids: ['stop_mgbs_hyd', 'stop_bza_pnbs'],
    distance_km: 275
  },

  // 12. SETC Ultra Deluxe (Chennai - Coimbatore via Salem)
  {
    id: 'route_tn_cbe_15',
    route_no: 'TN-SETC-15',
    route_name: 'SETC Non-Stop Classic Ultra Deluxe',
    source: 'Chennai Kilambakkam Kalaignar Terminus (KCBT)',
    destination: 'Coimbatore Gandhipuram Central Bus Stand',
    agency: 'SETC (Tamil Nadu State)',
    mode: 'bus',
    zone: 'South',
    fare_inr: 580,
    frequency_mins: 60,
    typical_duration: '8h 30m',
    stop_ids: ['stop_kcbt', 'stop_sa_jn', 'stop_cbe_gnd'],
    distance_km: 505
  },

  // 13. WBTC AC Volvo (Kolkata Esplanade - Durgapur)
  {
    id: 'route_wb_asl_09',
    route_no: 'WB-VOL-09',
    route_name: 'WBTC Suvarna AC Volvo Intercity (NH-19)',
    source: 'Esplanade Central Bus & Metro Interchange',
    destination: 'Asansol Junction Railway Station',
    agency: 'WBTC (West Bengal)',
    mode: 'bus',
    zone: 'East',
    fare_inr: 320,
    frequency_mins: 45,
    typical_duration: '4h 00m',
    stop_ids: ['stop_esp_kol', 'stop_dgr_cc', 'stop_asn'],
    distance_km: 215
  },

  // 14. RSRTC Superfast Express (Jaipur - Delhi ISBT)
  {
    id: 'route_rj_jpr_01',
    route_no: 'RJ-EXP-01',
    route_name: 'RSRTC Goldline Express (Delhi-Jaipur Highway)',
    source: 'Jaipur Sindhi Camp Central Bus Stand',
    destination: 'Kashmere Gate Maharana Pratap ISBT',
    agency: 'RSRTC (Rajasthan State)',
    mode: 'bus',
    zone: 'North',
    fare_inr: 390,
    frequency_mins: 30,
    typical_duration: '5h 15m',
    stop_ids: ['stop_jpr_sc', 'stop_kg_isbt'],
    distance_km: 270
  },

  // 15. DTC Express 534 (Anand Vihar - IGI Airport T3)
  {
    id: 'route_dl_534',
    route_no: 'DL-534',
    route_name: 'DTC Electric Express (Airport Corridor)',
    source: 'Anand Vihar ISBT & Terminal',
    destination: 'IGI Airport Terminal 3 Hub',
    agency: 'DTC (Delhi Transport)',
    mode: 'bus',
    zone: 'North',
    fare_inr: 25,
    frequency_mins: 12,
    typical_duration: '1h 10m',
    stop_ids: ['stop_anvt', 'stop_ndls', 'stop_del_t3'],
    distance_km: 34
  },

  // 16. BMTC Vayu Vajra KIA-9 (Airport - Electronic City)
  {
    id: 'route_bmtc_kia9',
    route_no: 'KIA-9',
    route_name: 'BMTC Vayu Vajra Airport Volvo Express',
    source: 'Kempegowda International Airport Terminal (BMTC TTMC)',
    destination: 'Electronic City Infosys Gate (BMTC Hub)',
    agency: 'BMTC (Bengaluru Metropolitan)',
    mode: 'bus',
    zone: 'South',
    fare_inr: 290,
    frequency_mins: 20,
    typical_duration: '1h 45m',
    stop_ids: ['stop_kia_blr', 'stop_sbc', 'stop_ecity'],
    distance_km: 52
  },

  // 17. BEST Electric AC 880 (Colaba - BKC Hub)
  {
    id: 'route_best_880',
    route_no: 'BEST-880',
    route_name: 'BEST Zero-Emission AC Express (BKC Link)',
    source: 'Bandra Kurla Complex (BKC) Bus Port',
    destination: 'Mumbai Central Terminus',
    agency: 'BEST (Mumbai Municipal)',
    mode: 'bus',
    zone: 'West',
    fare_inr: 30,
    frequency_mins: 15,
    typical_duration: '45m',
    stop_ids: ['stop_bkc', 'stop_dr', 'stop_mmct'],
    distance_km: 22
  },

  // 18. Kolkata Metro Green Line (Underwater Ganga Metro)
  {
    id: 'route_kol_m1',
    route_no: 'KOL-GREEN',
    route_name: 'Kolkata Metro Green Line (Howrah Underwater to Salt Lake)',
    source: 'Howrah Junction Railway & Ferry Terminal',
    destination: 'Salt Lake Sector V IT Hub Metro Terminal',
    agency: 'Kolkata Metro Rail (KMRC)',
    mode: 'metro',
    zone: 'East',
    fare_inr: 20,
    frequency_mins: 8,
    typical_duration: '24m',
    stop_ids: ['stop_hwh', 'stop_esp_kol', 'stop_sec_v'],
    distance_km: 16.5
  }
];

// ----------------------------------------------------
// NATIONWIDE VEHICLES REGISTRY
// ----------------------------------------------------
export const initialVehicles: Vehicle[] = [
  {
    id: 'veh_vb_22436',
    reg_no: 'IR-22436-VB',
    model: 'ICF Vande Bharat 2.0 (16-Coach Trainset)',
    capacity: 1128,
    status: 'Active',
    agency: 'Indian Railways',
    mode: 'train',
    vehicle_class: 'Semi-High Speed Vande Bharat',
    assigned_driver_id: 'user_driver_ndls',
    assigned_route_id: 'route_22436'
  },
  {
    id: 'veh_rd_12952',
    reg_no: 'IR-12952-RD',
    model: 'WAP-7 Electric Loco with LHB AC Coaches',
    capacity: 960,
    status: 'Active',
    agency: 'Indian Railways',
    mode: 'train',
    vehicle_class: 'Superfast AC Rajdhani Express',
    assigned_driver_id: 'user_driver_kota',
    assigned_route_id: 'route_12952'
  },
  {
    id: 'veh_sh_12008',
    reg_no: 'IR-12008-SH',
    model: 'WAP-7 / LHB Chair Car Trainset',
    capacity: 780,
    status: 'Active',
    agency: 'Indian Railways',
    mode: 'train',
    vehicle_class: 'Shatabdi Express Intercity',
    assigned_driver_id: 'user_driver_blr',
    assigned_route_id: 'route_12008'
  },
  {
    id: 'veh_rd_12301',
    reg_no: 'IR-12301-HWH',
    model: 'WAP-7 Locomotive with Tejas Rake',
    capacity: 940,
    status: 'Active',
    agency: 'Indian Railways',
    mode: 'train',
    vehicle_class: 'Tejas-Rajdhani Express',
    assigned_driver_id: 'user_driver_kol',
    assigned_route_id: 'route_12301'
  },
  {
    id: 'veh_vb_20834',
    reg_no: 'IR-20834-SC',
    model: 'Vande Bharat 2.0 (8-Coach Executive)',
    capacity: 530,
    status: 'Active',
    agency: 'Indian Railways',
    mode: 'train',
    vehicle_class: 'Semi-High Speed Vande Bharat',
    assigned_driver_id: 'user_driver_hyd',
    assigned_route_id: 'route_20834'
  },
  {
    id: 'veh_ksrtc_01',
    reg_no: 'KA-01-F-9821',
    model: 'Volvo 9600 Multi-Axle Airavat Club Class',
    capacity: 45,
    status: 'Active',
    agency: 'KSRTC',
    mode: 'bus',
    vehicle_class: 'Luxury Multi-Axle AC Sleeper/Seater',
    assigned_driver_id: 'user_driver_ksrtc',
    assigned_route_id: 'route_ka_mys_01'
  },
  {
    id: 'veh_msrtc_04',
    reg_no: 'MH-14-BT-5512',
    model: 'Scania Metrolink HD Shivneri AC',
    capacity: 43,
    status: 'Active',
    agency: 'MSRTC',
    mode: 'bus',
    vehicle_class: 'Intercity AC Multi-Axle',
    assigned_driver_id: 'user_driver_msrtc',
    assigned_route_id: 'route_mh_pun_04'
  },
  {
    id: 'veh_upsrtc_12',
    reg_no: 'UP-32-JN-8419',
    model: 'Ashok Leyland Janrath AC Semi-Deluxe',
    capacity: 48,
    status: 'Active',
    agency: 'UPSRTC',
    mode: 'bus',
    vehicle_class: 'Expressway AC Intercity',
    assigned_driver_id: 'user_driver_upsrtc',
    assigned_route_id: 'route_up_exp_12'
  },
  {
    id: 'veh_gsrtc_08',
    reg_no: 'GJ-01-CZ-4320',
    model: 'Tata Marcopolo 1618 Gurjarnagri Express',
    capacity: 52,
    status: 'Active',
    agency: 'GSRTC',
    mode: 'bus',
    vehicle_class: 'State Superfast Non-AC',
    assigned_driver_id: 'user_driver_gsrtc',
    assigned_route_id: 'route_gj_sur_08'
  },
  {
    id: 'veh_tsrtc_22',
    reg_no: 'TS-09-UB-7704',
    model: 'Volvo B11R Garuda Plus Multi-Axle',
    capacity: 46,
    status: 'Active',
    agency: 'TSRTC',
    mode: 'bus',
    vehicle_class: 'Luxury AC Sleeper',
    assigned_driver_id: 'user_driver_tsrtc',
    assigned_route_id: 'route_ts_gar_22'
  },
  {
    id: 'veh_setc_15',
    reg_no: 'TN-01-AN-9915',
    model: 'Ashok Leyland 12M Classic Ultra Deluxe',
    capacity: 44,
    status: 'Active',
    agency: 'SETC',
    mode: 'bus',
    vehicle_class: 'Classic Non-AC 2+2 Semi-Sleeper',
    assigned_driver_id: 'user_driver_setc',
    assigned_route_id: 'route_tn_cbe_15'
  },
  {
    id: 'veh_wbtc_09',
    reg_no: 'WB-04-E-3188',
    model: 'Volvo 8400 Low Floor Suvarna AC',
    capacity: 42,
    status: 'Active',
    agency: 'WBTC',
    mode: 'bus',
    vehicle_class: 'Intercity AC Volvo',
    assigned_driver_id: 'user_driver_wbtc',
    assigned_route_id: 'route_wb_asl_09'
  },
  {
    id: 'veh_bmtc_kia9',
    reg_no: 'KA-57-F-4012',
    model: 'Volvo 8400 City Bus Vayu Vajra',
    capacity: 38,
    status: 'Active',
    agency: 'BMTC',
    mode: 'bus',
    vehicle_class: 'Airport Low Floor AC Volvo',
    assigned_driver_id: 'user_driver_bmtc',
    assigned_route_id: 'route_bmtc_kia9'
  },
  {
    id: 'veh_dtc_534',
    reg_no: 'DL-01-EQ-9082',
    model: 'JBM Ecolife 100% Electric Low Floor',
    capacity: 36,
    status: 'Active',
    agency: 'DTC',
    mode: 'bus',
    vehicle_class: 'Zero Emission Electric City Bus',
    assigned_driver_id: 'user_driver_dtc',
    assigned_route_id: 'route_dl_534'
  },
  {
    id: 'veh_best_880',
    reg_no: 'MH-01-CV-7821',
    model: 'Olectra K9 Pure Electric AC Bus',
    capacity: 34,
    status: 'Active',
    agency: 'BEST',
    mode: 'bus',
    vehicle_class: 'Electric Urban Transit',
    assigned_driver_id: 'user_driver_best',
    assigned_route_id: 'route_best_880'
  },
  {
    id: 'veh_kol_metro',
    reg_no: 'KMRC-RAKE-14',
    model: 'BEML 6-Coach Stainless Steel Metro',
    capacity: 2068,
    status: 'Active',
    agency: 'KMRC',
    mode: 'metro',
    vehicle_class: 'Rapid Transit Metro Train',
    assigned_driver_id: 'user_driver_metro',
    assigned_route_id: 'route_kol_m1'
  },
  {
    id: 'veh_rsrtc_01',
    reg_no: 'RJ-14-PB-3488',
    model: 'Tata 1613 Starbus Ultra Deluxe',
    capacity: 48,
    status: 'Idle',
    agency: 'RSRTC',
    mode: 'bus',
    vehicle_class: 'Highway Superfast',
    assigned_route_id: 'route_rj_jpr_01'
  },
  {
    id: 'veh_vb_20901',
    reg_no: 'IR-20901-VB',
    model: 'Vande Bharat 2.0 (16-Coach Trainset)',
    capacity: 1128,
    status: 'Idle',
    agency: 'Indian Railways',
    mode: 'train',
    vehicle_class: 'Semi-High Speed Vande Bharat',
    assigned_route_id: 'route_20901'
  }
];

// ----------------------------------------------------
// ACTIVE REAL-TIME TRIPS ACROSS INDIA
// ----------------------------------------------------
export const initialTrips: Trip[] = [
  // 1. Vande Bharat 22436 running towards Kanpur / Prayagraj
  {
    id: 'trip_vb_22436',
    route_id: 'route_22436',
    vehicle_id: 'veh_vb_22436',
    driver_id: 'user_driver_ndls',
    start_time: new Date(Date.now() - 95 * 60000).toISOString(),
    status: 'Active',
    current_location: {
      lat: 26.7820,
      lng: 79.8210,
      speed: 128, // km/h
      timestamp: new Date().toISOString()
    },
    next_stop_id: 'stop_cnb',
    delay_minutes: 0,
    delay_reason: 'On Time - Operating at full MPS (Maximum Permissible Speed)',
    occupancy_percent: 94,
    platform: 'Platform 1 (Kanpur Central)',
    path_progress_percent: 38
  },

  // 2. Mumbai Rajdhani 12952 running towards Kota Junction
  {
    id: 'trip_rd_12952',
    route_id: 'route_12952',
    vehicle_id: 'veh_rd_12952',
    driver_id: 'user_driver_kota',
    start_time: new Date(Date.now() - 210 * 60000).toISOString(),
    status: 'Active',
    current_location: {
      lat: 25.8540,
      lng: 76.3210,
      speed: 118,
      timestamp: new Date().toISOString()
    },
    next_stop_id: 'stop_kota',
    delay_minutes: 6,
    delay_reason: 'Caution speed restriction near Sawai Madhopur curve (+6 min)',
    occupancy_percent: 98,
    platform: 'Platform 1 (Kota Junction)',
    path_progress_percent: 24
  },

  // 3. KSR Bengaluru - Chennai Shatabdi 12008 running towards Katpadi
  {
    id: 'trip_sh_12008',
    route_id: 'route_12008',
    vehicle_id: 'veh_sh_12008',
    driver_id: 'user_driver_blr',
    start_time: new Date(Date.now() - 110 * 60000).toISOString(),
    status: 'Active',
    current_location: {
      lat: 12.9815,
      lng: 78.7420,
      speed: 110,
      timestamp: new Date().toISOString()
    },
    next_stop_id: 'stop_kjt_mas',
    delay_minutes: 0,
    delay_reason: 'Right on schedule. Clear track signals.',
    occupancy_percent: 88,
    platform: 'Platform 2 (Katpadi Jn)',
    path_progress_percent: 62
  },

  // 4. Eastern Rajdhani 12301 running near Asansol / DDU
  {
    id: 'trip_rd_12301',
    route_id: 'route_12301',
    vehicle_id: 'veh_rd_12301',
    driver_id: 'user_driver_kol',
    start_time: new Date(Date.now() - 140 * 60000).toISOString(),
    status: 'Active',
    current_location: {
      lat: 23.8210,
      lng: 86.4120,
      speed: 115,
      timestamp: new Date().toISOString()
    },
    next_stop_id: 'stop_ddu',
    delay_minutes: 12,
    delay_reason: 'Signal precedence halt for freight corridor crossing (+12 min)',
    occupancy_percent: 96,
    platform: 'Platform 7 (Pt. Deen Dayal Upadhyaya Jn)',
    path_progress_percent: 32
  },

  // 5. KSRTC Airavat KA-AIR-01 on Bengaluru-Mysuru Access-Controlled Highway
  {
    id: 'trip_ksrtc_01',
    route_id: 'route_ka_mys_01',
    vehicle_id: 'veh_ksrtc_01',
    driver_id: 'user_driver_ksrtc',
    start_time: new Date(Date.now() - 48 * 60000).toISOString(),
    status: 'Active',
    current_location: {
      lat: 12.6240,
      lng: 77.0180,
      speed: 84, // km/h on expressway
      timestamp: new Date().toISOString()
    },
    next_stop_id: 'stop_mys_sub',
    delay_minutes: 0,
    delay_reason: 'Smooth expressway cruising. Toll cleared via FASTag.',
    occupancy_percent: 82,
    platform: 'Bay 4 (Mysuru Suburban KSRTC)',
    path_progress_percent: 54
  },

  // 6. MSRTC Shivneri MH-SHIV-04 on Mumbai-Pune Expressway
  {
    id: 'trip_msrtc_04',
    route_id: 'route_mh_pun_04',
    vehicle_id: 'veh_msrtc_04',
    driver_id: 'user_driver_msrtc',
    start_time: new Date(Date.now() - 85 * 60000).toISOString(),
    status: 'Active',
    current_location: {
      lat: 18.7210,
      lng: 73.4560,
      speed: 78,
      timestamp: new Date().toISOString()
    },
    next_stop_id: 'stop_swg_pun',
    delay_minutes: 8,
    delay_reason: 'Heavy ghat fog restriction at Khandala Ghats (+8 min)',
    occupancy_percent: 90,
    platform: 'Bay 12 (Pune Swargate)',
    path_progress_percent: 68
  },

  // 7. BMTC Vayu Vajra KIA-9 running from KIA Airport to Electronic City
  {
    id: 'trip_bmtc_kia9',
    route_id: 'route_bmtc_kia9',
    vehicle_id: 'veh_bmtc_kia9',
    driver_id: 'user_driver_bmtc',
    start_time: new Date(Date.now() - 35 * 60000).toISOString(),
    status: 'Active',
    current_location: {
      lat: 12.9680,
      lng: 77.5850,
      speed: 42,
      timestamp: new Date().toISOString()
    },
    next_stop_id: 'stop_ecity',
    delay_minutes: 4,
    delay_reason: 'Silk Board flyover construction traffic (+4 min)',
    occupancy_percent: 68,
    platform: 'Platform 1 (Infosys Gate TTMC)',
    path_progress_percent: 65
  },

  // 8. DTC Electric Express DL-534 running towards IGI Airport T3
  {
    id: 'trip_dtc_534',
    route_id: 'route_dl_534',
    vehicle_id: 'veh_dtc_534',
    driver_id: 'user_driver_dtc',
    start_time: new Date(Date.now() - 25 * 60000).toISOString(),
    status: 'Active',
    current_location: {
      lat: 28.5820,
      lng: 77.1640,
      speed: 38,
      timestamp: new Date().toISOString()
    },
    next_stop_id: 'stop_del_t3',
    delay_minutes: 0,
    delay_reason: 'On Time. Green signal corridor.',
    occupancy_percent: 75,
    platform: 'Bay 8 (IGI T3 Airport Bus Port)',
    path_progress_percent: 72
  },

  // 9. Kolkata Underwater Green Metro KOL-GREEN
  {
    id: 'trip_kol_metro',
    route_id: 'route_kol_m1',
    vehicle_id: 'veh_kol_metro',
    driver_id: 'user_driver_metro',
    start_time: new Date(Date.now() - 12 * 60000).toISOString(),
    status: 'Active',
    current_location: {
      lat: 22.5690,
      lng: 88.3810,
      speed: 62,
      timestamp: new Date().toISOString()
    },
    next_stop_id: 'stop_sec_v',
    delay_minutes: 0,
    delay_reason: 'Automated CBTC Signaling. On time.',
    occupancy_percent: 84,
    platform: 'Platform 1 (Sector V Metro)',
    path_progress_percent: 78
  },

  // 10. TSRTC Garuda Plus TS-GAR-22 (Hyderabad to Vijayawada)
  {
    id: 'trip_tsrtc_22',
    route_id: 'route_ts_gar_22',
    vehicle_id: 'veh_tsrtc_22',
    driver_id: 'user_driver_tsrtc',
    start_time: new Date(Date.now() - 160 * 60000).toISOString(),
    status: 'Active',
    current_location: {
      lat: 16.8920,
      lng: 79.9810,
      speed: 82,
      timestamp: new Date().toISOString()
    },
    next_stop_id: 'stop_bza_pnbs',
    delay_minutes: 5,
    delay_reason: 'Toll queue at Choutuppal Plaza (+5 min)',
    occupancy_percent: 89,
    platform: 'Platform 3 (Vijayawada PNBS)',
    path_progress_percent: 70
  }
];

// ----------------------------------------------------
// INDIAN RAILWAYS & STATE BUS PNR RECORDS
// ----------------------------------------------------
export const initialPnrs: PnrRecord[] = [
  {
    pnr: '8421950214',
    passenger_name: 'Aarav Mehta & Sunita Mehta',
    route_no: '22436',
    route_name: 'New Delhi - Varanasi Vande Bharat Express',
    agency: 'Indian Railways',
    mode: 'train',
    source: 'New Delhi Railway Station (Ajmeri Gate)',
    destination: 'Varanasi Junction (Cantonment)',
    boarding_point: 'New Delhi (NDLS)',
    date_of_journey: new Date().toISOString().split('T')[0],
    booking_status: 'CNF (Confirmed)',
    coach_berth: 'C4 - Seat 22 (Window), Seat 23',
    trip_id: 'trip_vb_22436'
  },
  {
    pnr: '2310984512',
    passenger_name: 'Dr. Rohan Deshmukh',
    route_no: '12952',
    route_name: 'New Delhi - Mumbai Central AC Rajdhani Express',
    agency: 'Indian Railways',
    mode: 'train',
    source: 'New Delhi Railway Station (Ajmeri Gate)',
    destination: 'Mumbai Central Terminus',
    boarding_point: 'New Delhi (NDLS)',
    date_of_journey: new Date().toISOString().split('T')[0],
    booking_status: 'CNF (Confirmed)',
    coach_berth: 'B2 - Berth 41 (Side Lower)',
    trip_id: 'trip_rd_12952'
  },
  {
    pnr: '6519283741',
    passenger_name: 'Kavita Sundaram',
    route_no: '12008',
    route_name: 'KSR Bengaluru - MGR Chennai Central Shatabdi Express',
    agency: 'Indian Railways',
    mode: 'train',
    source: 'KSR Bengaluru City (Majestic Intermodal)',
    destination: 'MGR Chennai Central Terminus',
    boarding_point: 'KSR Bengaluru (SBC)',
    date_of_journey: new Date().toISOString().split('T')[0],
    booking_status: 'CNF (Confirmed)',
    coach_berth: 'E1 - Seat 14 (Executive Class Window)',
    trip_id: 'trip_sh_12008'
  },
  {
    pnr: 'KA-881920',
    passenger_name: 'Pooja Hegde',
    route_no: 'KA-AIR-01',
    route_name: 'KSRTC Airavat Club Class Multi-Axle Volvo',
    agency: 'KSRTC (Karnataka State)',
    mode: 'bus',
    source: 'KSR Bengaluru City (Majestic Intermodal)',
    destination: 'Mysuru Suburban KSRTC Bus Stand',
    boarding_point: 'Majestic Platform 2',
    date_of_journey: new Date().toISOString().split('T')[0],
    booking_status: 'CNF (Confirmed Seat)',
    coach_berth: 'Seat 18 (Single Window)',
    trip_id: 'trip_ksrtc_01'
  },
  {
    pnr: 'MH-552011',
    passenger_name: 'Sanjay Kulkarni',
    route_no: 'MH-SHIV-04',
    route_name: 'MSRTC Shivneri AC Volvo (Mumbai-Pune Expressway)',
    agency: 'MSRTC (Maharashtra State)',
    mode: 'bus',
    source: 'Dadar Asiad Bus & Railway Terminal',
    destination: 'Pune Swargate Central Bus Station',
    boarding_point: 'Dadar Asiad Counter 3',
    date_of_journey: new Date().toISOString().split('T')[0],
    booking_status: 'CNF (Confirmed Seat)',
    coach_berth: 'Seat 09 (Aisle)',
    trip_id: 'trip_msrtc_04'
  },
  {
    pnr: '4218901235',
    passenger_name: 'Anirban Mukherjee',
    route_no: '12301',
    route_name: 'Howrah - New Delhi Eastern Rajdhani Express',
    agency: 'Indian Railways',
    mode: 'train',
    source: 'Howrah Junction Railway & Ferry Terminal',
    destination: 'New Delhi Railway Station (Ajmeri Gate)',
    boarding_point: 'Howrah (HWH)',
    date_of_journey: new Date().toISOString().split('T')[0],
    booking_status: 'CNF (Confirmed)',
    coach_berth: 'A1 - Berth 18 (First AC Cabin B)',
    trip_id: 'trip_rd_12301'
  },
  {
    pnr: 'BLR-AIR-904',
    passenger_name: 'Nikhil Rathi',
    route_no: 'KIA-9',
    route_name: 'BMTC Vayu Vajra Airport Volvo Express',
    agency: 'BMTC (Bengaluru Metropolitan)',
    mode: 'bus',
    source: 'Kempegowda International Airport Terminal (BMTC TTMC)',
    destination: 'Electronic City Infosys Gate (BMTC Hub)',
    boarding_point: 'Airport Terminal Bay 4',
    date_of_journey: new Date().toISOString().split('T')[0],
    booking_status: 'Valid Passenger Ticket',
    coach_berth: 'Unreserved AC Volvo',
    trip_id: 'trip_bmtc_kia9'
  }
];

// ----------------------------------------------------
// HISTORICAL LOGS FOR NATIONWIDE OPERATIONAL AUDITING
// ----------------------------------------------------
export const initialTripHistory: TripHistoryLog[] = [
  {
    id: 'hist_in_01',
    trip_id: 'trip_done_01',
    route_name: 'New Delhi - Varanasi Vande Bharat Express',
    route_no: '22436',
    vehicle_reg: 'IR-22436-VB',
    driver_name: 'Vikram Singh',
    start_time: new Date(Date.now() - 28 * 3600000).toISOString(),
    end_time: new Date(Date.now() - 20 * 3600000).toISOString(),
    status: 'Completed',
    distance_km: 759,
    avg_speed_kmh: 94.8,
    delay_minutes: 0,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
  },
  {
    id: 'hist_in_02',
    trip_id: 'trip_done_02',
    route_name: 'KSR Bengaluru - MGR Chennai Central Shatabdi Express',
    route_no: '12008',
    vehicle_reg: 'IR-12008-SH',
    driver_name: 'G. Narayanan',
    start_time: new Date(Date.now() - 32 * 3600000).toISOString(),
    end_time: new Date(Date.now() - 27 * 3600000).toISOString(),
    status: 'Completed',
    distance_km: 362,
    avg_speed_kmh: 76.2,
    delay_minutes: 5,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
  },
  {
    id: 'hist_in_03',
    trip_id: 'trip_done_03',
    route_name: 'MSRTC Shivneri AC Volvo (Mumbai-Pune Expressway)',
    route_no: 'MH-SHIV-04',
    vehicle_reg: 'MH-14-BT-5512',
    driver_name: 'Sunil Jadhav',
    start_time: new Date(Date.now() - 14 * 3600000).toISOString(),
    end_time: new Date(Date.now() - 10.5 * 3600000).toISOString(),
    status: 'Completed',
    distance_km: 158,
    avg_speed_kmh: 45.1,
    delay_minutes: 10,
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'hist_in_04',
    trip_id: 'trip_done_04',
    route_name: 'KSRTC Airavat Club Class Multi-Axle Volvo',
    route_no: 'KA-AIR-01',
    vehicle_reg: 'KA-01-F-9821',
    driver_name: 'Basavaraj Gowda',
    start_time: new Date(Date.now() - 8 * 3600000).toISOString(),
    end_time: new Date(Date.now() - 5.8 * 3600000).toISOString(),
    status: 'Completed',
    distance_km: 145,
    avg_speed_kmh: 65.9,
    delay_minutes: 0,
    date: new Date().toISOString().split('T')[0]
  }
];
