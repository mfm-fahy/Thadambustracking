'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, Navigation, Bus, QrCode, X, Phone, Users, Star, LocateFixed, Loader2, LogOut, Ticket, Bell, Leaf, MessageSquare } from 'lucide-react';
import { useGPS } from '@/lib/hooks/useGPS';
import { toast } from 'sonner';
import { useLocationSuggestions } from '@/lib/hooks/useLocationSuggestions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { BusMarker } from '@/components/passenger/VehicleMap';
import { API_URL } from '@/lib/config';

const VehicleMap = dynamic(
  () => import('@/components/passenger/VehicleMap').then((m) => m.VehicleMap),
  { ssr: false, loading: () => <div className="w-full h-full min-h-[420px] bg-muted animate-pulse rounded-lg" /> }
);

// Mock buses on a route in Trichy
const MOCK_ROUTE_BUSES = [
  { id: 'BUS-001', name: 'Route 42 Express', number: 'TM-1042', type: 'public', occupancy: 'moderate', seats: 18, eta: 4, lat: 10.7958, lng: 78.7032, stops: 3, rating: 4.5 },
  { id: 'BUS-002', name: 'City Line 7', number: 'TM-1007', type: 'public', occupancy: 'empty', seats: 35, eta: 9, lat: 10.8201, lng: 78.6901, stops: 5, rating: 4.2 },
  { id: 'BUS-003', name: 'Downtown Shuttle', number: 'TM-2030', type: 'private', occupancy: 'full', seats: 0, eta: 12, lat: 10.8099, lng: 78.7055, stops: 2, rating: 4.8 },
];

const MOCK_UNIQUE_BUSES: Record<string, any> = {
  'SCH-101': { id: 'SCH-101', name: 'Greenwood School Bus', number: 'SCH-101', type: 'school', driver: 'Mr. Rajan', lat: 10.8250, lng: 78.6870, stops: ['Main Gate', 'Park Ave', 'School'], eta: 7, occupancy: 'moderate', seats: 12 },
  'CLG-202': { id: 'CLG-202', name: 'City College Shuttle', number: 'CLG-202', type: 'college', driver: 'Ms. Priya', lat: 10.8180, lng: 78.6920, stops: ['Hostel Block', 'Library', 'Main Campus'], eta: 5, occupancy: 'empty', seats: 22 },
  'OFF-303': { id: 'OFF-303', name: 'TechPark Office Bus', number: 'OFF-303', type: 'office', driver: 'Mr. Ali', lat: 10.8130, lng: 78.6800, stops: ['Sector 5', 'MG Road', 'TechPark Gate'], eta: 11, occupancy: 'full', seats: 0 },
};

const occupancyColor: Record<string, string> = {
  empty: 'bg-green-500/15 text-green-700 dark:text-green-400',
  moderate: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
  full: 'bg-red-500/15 text-red-700 dark:text-red-400',
};

const typeColor: Record<string, string> = {
  public: 'bg-blue-500/15 text-blue-700',
  private: 'bg-purple-500/15 text-purple-700',
  school: 'bg-orange-500/15 text-orange-700',
  college: 'bg-indigo-500/15 text-indigo-700',
  office: 'bg-teal-500/15 text-teal-700',
};

// All buses always visible on map (route buses + unique buses combined)
const ALL_MAP_BUSES: BusMarker[] = [
  ...MOCK_ROUTE_BUSES,
  ...Object.values(MOCK_UNIQUE_BUSES),
];

function shortName(display_name: string) {
  return display_name.split(',').slice(0, 2).join(',').trim();
}

export default function PassengerPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const [searched, setSearched] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const { suggestions: fromSuggestions, loading: fromLoading } = useLocationSuggestions(fromQuery);
  const { suggestions: toSuggestions, loading: toLoading } = useLocationSuggestions(toQuery);
  const [selectedBus, setSelectedBus] = useState<any>(null);
  const [showFinder, setShowFinder] = useState(false);
  const [finderQuery, setFinderQuery] = useState('');
  const [foundBus, setFoundBus] = useState<any>(null);
  const [finderError, setFinderError] = useState('');
  const [showSOS, setShowSOS] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 10.7905, lng: 78.7047 }); // Trichy coordinates
  const [trackedBus, setTrackedBus] = useState<any>(null);
  const [followUser, setFollowUser] = useState(true);
  
  // New states for booking and alerts
  const [showBooking, setShowBooking] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  const [bookingSeats, setBookingSeats] = useState(1);
  const [showNearMe, setShowNearMe] = useState(false);
  const [nearBuses, setNearBuses] = useState<any[]>([]);
  const [dbBuses, setDbBuses] = useState<any[]>([]);

  // Phase 1 & 3 features
  const [showMyTickets, setShowMyTickets] = useState(false);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [carbonSaved, setCarbonSaved] = useState(0);

  const { position: gpsPos, status: gpsStatus, error: gpsError } = useGPS();
  const centeredOnUser = useRef(false);

  // As soon as we get the first GPS fix, move the map center to the user
  useEffect(() => {
    if (gpsPos && !centeredOnUser.current && !trackedBus) {
      centeredOnUser.current = true;
      setMapCenter({ lat: gpsPos.lat, lng: gpsPos.lng });
    }
  }, [gpsPos, trackedBus]);

  // Polling backend for dynamic buses
  useEffect(() => {
    let mounted = true;
    const fetchLiveBuses = async () => {
      try {
        const res = await fetch(`${API_URL}/vehicles`);
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && data && data.data) {
          const liveBuses = data.data.map((v: any) => ({
            id: v._id || v.registration_number,
            name: v.name || 'Live Bus',
            number: v.registration_number,
            type: v.type || 'bus',
            occupancy: v.occupancy_status || 'empty',
            seats: v.capacity - (v.current_occupancy || 0),
            eta: 5,
            lat: v.last_location?.latitude || 10.7905,
            lng: v.last_location?.longitude || 78.7047,
            stops: 0,
            rating: 5.0
          }));
          setDbBuses(liveBuses);
        }
      } catch(e) { console.error('Failed to fetch DB buses', e); }
    };
    
    fetchLiveBuses();
    const interval = setInterval(fetchLiveBuses, 3000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Listen to cross-tab Driver Announcements and load tickets
  useEffect(() => {
    // Load local tickets
    const saved = localStorage.getItem('thadam_bookings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMyTickets(parsed);
      // Generate some fake historical eco-impact
      setCarbonSaved(parsed.length * 1.2); 
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'thadam_announcement' && e.newValue) {
        const msg = JSON.parse(e.newValue);
        // Toast the passenger
        toast.message(`Announcement from Driver: ${msg.bus}`, {
          description: msg.text,
          icon: <MessageSquare className="w-5 h-5 text-blue-500" />
        });
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const COMPONENT_ALL_BUSES = [...ALL_MAP_BUSES, ...dbBuses];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        setActiveField(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return;
    setActiveField(null);
    setSearched(true);
    setSelectedBus(null);
    setTrackedBus(null);
  };

  const pickSuggestion = (field: 'from' | 'to', name: string) => {
    if (field === 'from') { setFrom(name); setFromQuery(''); }
    else { setTo(name); setToQuery(''); }
    setActiveField(null);
  };

  const handleSelectBus = (bus: any) => {
    setSelectedBus(bus);
    setTrackedBus(bus);
    setMapCenter({ lat: bus.lat, lng: bus.lng });
    setFollowUser(false);
  };

  const handleFindBus = () => {
    setFinderError('');
    setFoundBus(null);
    const key = finderQuery.trim().toUpperCase();
    const dbBus = dbBuses.find(b => b.number.toUpperCase() === key);
    if (dbBus) {
      setFoundBus(dbBus);
    } else if (MOCK_UNIQUE_BUSES[key]) {
      setFoundBus(MOCK_UNIQUE_BUSES[key]);
    } else {
      setFinderError('No bus found with that number. Try actual driver bus numbers or mock ones like SCH-101.');
    }
  };

  const handleTrackFoundBus = (bus: any) => {
    setTrackedBus(bus);
    setMapCenter({ lat: bus.lat, lng: bus.lng });
    setShowFinder(false);
    setSelectedBus(bus);
  };

  const handleLogout = () => {
    localStorage.removeItem('tm_role');
    localStorage.removeItem('tm_user');
    window.location.href = '/login';
  };

  const toggleAlerts = (busId: string) => {
    setActiveAlerts((prev) => {
      if (prev.includes(busId)) {
        toast.success('Alerts turned off for this bus.');
        return prev.filter((id) => id !== busId);
      } else {
        toast.success('Alerts turned on! You will be notified of updates.');
        return [...prev, busId];
      }
    });
  };

  const confirmBooking = () => {
    const ticket = {
      id: `TKT-${Date.now().toString().slice(-6)}`,
      bus: trackedBus?.name || 'Bus',
      seats: bookingSeats,
      date: new Date().toLocaleDateString()
    };
    const newTickets = [ticket, ...myTickets];
    setMyTickets(newTickets);
    setCarbonSaved(prev => prev + 1.2);
    localStorage.setItem('thadam_bookings', JSON.stringify(newTickets));

    toast.success(`Successfully booked ${bookingSeats} seat(s) on ${trackedBus?.name}!`);
    setShowBooking(false);
    setBookingSeats(1);
  };

  const handleShowNearMe = () => {
    if (!gpsPos) {
      toast.error('Waiting for GPS location...');
      return;
    }
    
    // Calculate simple Euclidean distance for mock sorting
    // 1 approximation degree ~ 111 km
    const sorted = COMPONENT_ALL_BUSES.map(bus => {
      const dLat = (bus.lat ?? 10.79) - gpsPos.lat;
      const dLng = (bus.lng ?? 78.70) - gpsPos.lng;
      const distKm = Math.sqrt(dLat*dLat + dLng*dLng) * 111;
      return { ...bus, distKm };
    }).sort((a, b) => a.distKm - b.distKm).slice(0, 5);

    setNearBuses(sorted);
    setSearched(false);
    setShowNearMe(true);
    setSelectedBus(null);
    setTrackedBus(null);
    setActiveField(null);
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm z-40 flex-shrink-0">
        <div className="px-4 py-3 min-h-[4.5rem] flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
          <Link href="/login" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <MapPin className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-bold text-foreground hidden sm:block">Thadam</span>
          </Link>

          {/* From / To Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 max-w-2xl min-w-0">
            <div ref={searchBarRef} className="flex-1 relative min-w-0">
              <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-1.5 border border-border">
                <div className="flex flex-col gap-1 flex-1">
                  {/* FROM input */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                    <input
                      value={activeField === 'from' ? fromQuery : from}
                      onChange={(e) => { setFromQuery(e.target.value); setFrom(e.target.value); }}
                      onFocus={() => { setActiveField('from'); setFromQuery(from); }}
                      placeholder="From — your location"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    {fromLoading && activeField === 'from' && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground flex-shrink-0" />}
                  </div>
                  <div className="h-px bg-border mx-4" />
                  {/* TO input */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <input
                      value={activeField === 'to' ? toQuery : to}
                      onChange={(e) => { setToQuery(e.target.value); setTo(e.target.value); }}
                      onFocus={() => { setActiveField('to'); setToQuery(to); }}
                      placeholder="To — destination"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    {toLoading && activeField === 'to' && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground flex-shrink-0" />}
                  </div>
                </div>
                {(from || to) && (
                  <button type="button" onClick={() => { setFrom(''); setTo(''); setFromQuery(''); setToQuery(''); setSearched(false); setSelectedBus(null); setTrackedBus(null); setActiveField(null); }}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* FROM suggestions dropdown */}
              {activeField === 'from' && fromSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                  {fromSuggestions.map((s) => (
                    <button
                      key={s.place_id}
                      type="button"
                      onMouseDown={() => pickSuggestion('from', shortName(s.display_name))}
                      className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-muted transition-colors text-left"
                    >
                      <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm text-foreground font-medium truncate">{shortName(s.display_name)}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.display_name.split(',').slice(2, 4).join(',').trim()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* TO suggestions dropdown */}
              {activeField === 'to' && toSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                  {toSuggestions.map((s) => (
                    <button
                      key={s.place_id}
                      type="button"
                      onMouseDown={() => pickSuggestion('to', shortName(s.display_name))}
                      className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-muted transition-colors text-left"
                    >
                      <MapPin className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm text-foreground font-medium truncate">{shortName(s.display_name)}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.display_name.split(',').slice(2, 4).join(',').trim()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" size="sm" className="bg-accent hover:bg-accent/90 h-9 px-3 flex-shrink-0">
              <Search className="w-4 h-4" />
            </Button>
          </form>

          {/* Near Me Button */}
          <Button
            onClick={handleShowNearMe}
            variant="outline"
            size="sm"
            className="flex-shrink-0 gap-1.5 border-blue-500/50 text-blue-500 hover:bg-blue-500/10 whitespace-nowrap flex"
          >
            <LocateFixed className="w-4 h-4" />
            <span className="hidden sm:block">Near Me</span>
          </Button>

          {/* Bus Finder Button — always visible */}
          <Button
            onClick={() => setShowFinder(true)}
            variant="outline"
            size="sm"
            className="flex-shrink-0 gap-1.5 border-accent/50 text-accent hover:bg-accent/10 whitespace-nowrap flex"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:block">Find Bus</span>
          </Button>

          {/* My Tickets Button */}
          <Button
            onClick={() => setShowMyTickets(true)}
            variant="outline"
            size="sm"
            className="flex-shrink-0 gap-1.5 border-green-500/50 text-green-600 dark:text-green-400 hover:bg-green-500/10 whitespace-nowrap relative"
          >
            <Ticket className="w-4 h-4" />
            <span className="hidden sm:block">Tickets</span>
            {myTickets.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center justify-center">
                {myTickets.length}
              </span>
            )}
          </Button>

          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 px-2"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Map — full background, isolation:isolate keeps Leaflet's z-indices contained */}
        <div className="absolute inset-0" style={{ isolation: 'isolate', zIndex: 0 }}>
          <VehicleMap
            vehicleLat={trackedBus?.lat ?? mapCenter.lat}
            vehicleLng={trackedBus?.lng ?? mapCenter.lng}
            destinationLat={trackedBus ? 10.7905 : undefined}
            destinationLng={trackedBus ? 78.7047 : undefined}
            vehicleName={trackedBus?.name}
            stops={Array.isArray(trackedBus?.stops) 
              ? trackedBus.stops.map((s: string, i: number) => ({
                  name: s,
                  lat: (trackedBus.lat ?? 10.7905) + i * 0.005,
                  lng: (trackedBus.lng ?? 78.7047) + i * 0.004,
                })) 
              : []
            }
            zoom={14}
            userLat={gpsPos?.lat}
            userLng={gpsPos?.lng}
            userAccuracy={gpsPos?.accuracy}
            followUser={followUser}
            buses={COMPONENT_ALL_BUSES}
            selectedBusId={selectedBus?.id ?? null}
            onBusClick={(bus) => handleSelectBus(bus)}
          />
          {/* GPS status + locate-me button */}
          <div className={`absolute right-4 z-20 flex flex-col items-end gap-2 transition-all duration-300 ${
            searched || showNearMe || trackedBus ? 'bottom-[50vh] sm:bottom-24' : 'bottom-24'
          }`}>
            <button
              onClick={() => setFollowUser((f) => !f)}
              title={followUser ? 'Stop following my location' : 'Follow my location'}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border transition-all ${
                followUser
                  ? 'bg-blue-500 border-blue-600 text-white'
                  : 'bg-card border-border text-muted-foreground hover:text-blue-500'
              }`}
            >
              <LocateFixed className="w-5 h-5" />
            </button>
            {gpsStatus === 'requesting' && (
              <span className="text-xs bg-card/90 px-2 py-1 rounded-full border border-border text-muted-foreground">Getting GPS…</span>
            )}
            {gpsStatus === 'active' && gpsPos && (
              <span className="text-xs bg-card/90 px-2 py-1 rounded-full border border-green-500/30 text-green-600">±{Math.round(gpsPos.accuracy)}m</span>
            )}
            {gpsStatus === 'error' && (
              <span className="text-xs bg-red-500/10 px-2 py-1 rounded-full border border-red-500/30 text-red-500">GPS off</span>
            )}
          </div>

          {/* Eco Impact Badge */}
          {carbonSaved > 0 && (
            <div className="absolute top-4 right-4 z-40 bg-card/90 backdrop-blur border border-green-500/30 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2 animate-in fade-in zoom-in">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Carbon Saved</span>
                <span className="text-sm font-bold text-foreground leading-tight">{carbonSaved.toFixed(1)} kg CO₂</span>
              </div>
            </div>
          )}

          {/* Traffic Status Badge */}
          <div className="absolute bottom-6 right-4 z-40 bg-card/90 backdrop-blur border border-border rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2 animate-in fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-xs font-bold text-foreground pr-1">Moderate Traffic</span>
          </div>
        </div>

        {/* Left Panel — Route Results or Near Me (Responsive Bottom Sheet on Mobile) */}
        {(searched || showNearMe) && (
          <div className="absolute bottom-0 left-0 right-0 z-30 h-[45vh] sm:h-auto sm:relative sm:w-80 flex-shrink-0 bg-card/95 backdrop-blur-md border-t sm:border-t-0 sm:border-r border-border flex flex-col overflow-hidden rounded-t-3xl sm:rounded-none shadow-2xl sm:shadow-none animate-in slide-in-from-bottom sm:slide-in-from-left duration-300">
            {/* Grab handle for mobile mobile sheet */}
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto my-3 sm:hidden" />
            
            <div className="p-4 border-b border-border flex-shrink-0 pt-1 sm:pt-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold text-foreground">{showNearMe ? 'Buses Near You' : 'Available Buses'}</h2>
                <button onClick={() => { setSearched(false); setShowNearMe(false); setSelectedBus(null); setTrackedBus(null); }}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              {!showNearMe && <p className="text-xs text-muted-foreground">{from} → {to}</p>}
              <p className="text-xs text-muted-foreground mt-0.5">
                {showNearMe ? `${nearBuses.length} buses within 5km` : `${MOCK_ROUTE_BUSES.length + dbBuses.length} buses found`}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {(showNearMe ? nearBuses : [...MOCK_ROUTE_BUSES, ...dbBuses]).map((bus) => (
                <button
                  key={bus.id}
                  onClick={() => handleSelectBus(bus)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedBus?.id === bus.id
                      ? 'border-accent bg-accent/10'
                      : 'border-border bg-background hover:border-accent/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                        <Bus className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground leading-tight">{bus.name}</p>
                        <p className="text-xs text-muted-foreground">{bus.number}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-accent">
                        {showNearMe ? `${bus.distKm.toFixed(1)} km` : `${bus.eta} min`}
                      </p>
                      <p className="text-xs text-muted-foreground">{showNearMe ? 'away' : 'ETA'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeColor[bus.type]}`}>{bus.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${occupancyColor[bus.occupancy]}`}>{bus.occupancy}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />{bus.seats} seats
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{bus.rating}
                    </span>
                  </div>
                  {selectedBus?.id === bus.id && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{bus.stops} stops on this route
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Info Card when bus is selected (Responsive Sheet on Mobile) */}
        {trackedBus && (
          <div className="absolute bottom-0 left-0 right-0 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 z-40 w-full sm:max-w-sm px-0 sm:px-4">
            <Card className="p-4 bg-card/95 backdrop-blur-md border-t sm:border border-border shadow-2xl rounded-t-3xl sm:rounded-xl animate-in slide-in-from-bottom duration-300">
              {/* Grab handle for mobile */}
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4 sm:hidden" />
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
                    <Bus className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{trackedBus.name}</p>
                    <p className="text-xs text-muted-foreground">{trackedBus.number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-accent">{trackedBus.eta} min</p>
                  <p className="text-xs text-muted-foreground">away</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${occupancyColor[trackedBus.occupancy]}`}>{trackedBus.occupancy}</span>
                {trackedBus.driver && <span className="text-xs text-muted-foreground">Driver: {trackedBus.driver}</span>}
                <button onClick={() => setShowSOS(true)} className="ml-auto flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium">
                  <Phone className="w-3 h-3" /> SOS
                </button>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                <Button onClick={() => setShowBooking(true)} className="flex-1 bg-accent hover:bg-accent/90 h-9 text-xs">
                  <Ticket className="w-4 h-4 mr-1.5" /> Book Ticket
                </Button>
                <Button 
                  onClick={() => toggleAlerts(trackedBus.id)} 
                  variant={activeAlerts.includes(trackedBus.id) ? "default" : "outline"} 
                  className={`flex-1 h-9 text-xs ${activeAlerts.includes(trackedBus.id) ? 'bg-blue-500 hover:bg-blue-600 text-white border-transparent' : ''}`}
                >
                  <Bell className="w-4 h-4 mr-1.5" /> {activeAlerts.includes(trackedBus.id) ? 'Mute Alerts' : 'Get Alerts'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Bus Finder Drawer */}
      {showFinder && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFinder(false)} />
          <div className="relative ml-auto w-full max-w-sm bg-card h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="font-bold text-foreground">Find a Specific Bus</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Search by bus number or scan QR code</p>
              </div>
              <button
                onClick={() => setShowFinder(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              {/* Bus Type Quick-fill Tags */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Quick Select</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'School', value: 'SCH-101' },
                    { label: 'College', value: 'CLG-202' },
                    { label: 'Office', value: 'OFF-303' },
                  ].map(({ label, value }) => (
                    <button
                      key={label}
                      onClick={() => { setFinderQuery(value); setFinderError(''); setFoundBus(null); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        finderQuery === value
                          ? 'border-accent bg-accent/15 text-accent'
                          : 'border-border bg-muted hover:border-accent/50 hover:bg-accent/10 hover:text-accent'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Input */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Enter Bus Number</p>
                <div className="flex gap-2">
                  <Input
                    value={finderQuery}
                    onChange={(e) => { setFinderQuery(e.target.value); setFinderError(''); setFoundBus(null); }}
                    placeholder="e.g. SCH-101, CLG-202"
                    className="h-10 uppercase"
                    onKeyDown={(e) => e.key === 'Enter' && handleFindBus()}
                  />
                  <Button onClick={handleFindBus} className="bg-accent hover:bg-accent/90 h-10 px-4">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* QR Scan Button */}
              <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-border hover:border-accent/50 text-muted-foreground hover:text-accent transition-all">
                <QrCode className="w-5 h-5" />
                <span className="text-sm font-medium">Scan QR Code</span>
              </button>

              {finderError && (
                <p className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">{finderError}</p>
              )}

              {/* Found Bus Result */}
              {foundBus && (
                <div className="rounded-xl border border-accent/40 bg-accent/5 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Bus className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{foundBus.name}</p>
                      <p className="text-xs text-muted-foreground">{foundBus.number} · Driver: {foundBus.driver}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeColor[foundBus.type]}`}>{foundBus.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${occupancyColor[foundBus.occupancy]}`}>{foundBus.occupancy}</span>
                    <span className="text-xs text-accent font-bold">{foundBus.eta} min away</span>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Stops</p>
                    <div className="space-y-1">
                      {foundBus.stops.map((stop: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold flex-shrink-0">{i + 1}</div>
                          {stop}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleTrackFoundBus(foundBus)}
                    className="w-full bg-accent hover:bg-accent/90 gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Track This Bus
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SOS Modal */}
      {showSOS && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50">
          <Card className="max-w-sm w-full p-6 space-y-5">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                <Phone className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Activate SOS?</h2>
              <p className="text-sm text-muted-foreground mt-2">Emergency services and operators will be notified immediately.</p>
            </div>
            <div className="space-y-2">
              <Button onClick={() => { alert('SOS sent!'); setShowSOS(false); }} className="w-full bg-red-600 hover:bg-red-700">
                Yes, Activate SOS
              </Button>
              <Button onClick={() => setShowSOS(false)} variant="outline" className="w-full">Cancel</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && trackedBus && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="max-w-sm w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div>
              <h2 className="text-xl font-bold text-foreground">Book Ticket</h2>
              <p className="text-sm text-muted-foreground mt-1">{trackedBus.name} ({trackedBus.number})</p>
            </div>
            
            <div className="p-3 bg-muted rounded-xl space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ETA</span>
                <span className="font-semibold">{trackedBus.eta} mins</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Seats</span>
                <span className="font-semibold">{trackedBus.seats || 'N/A'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Number of Seats</label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => setBookingSeats(Math.max(1, bookingSeats - 1))}>-</Button>
                <div className="flex-1 text-center font-bold text-xl">{bookingSeats}</div>
                <Button variant="outline" size="icon" onClick={() => setBookingSeats(bookingSeats + 1)} disabled={trackedBus.seats !== 0 && bookingSeats >= trackedBus.seats}>+</Button>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Button onClick={confirmBooking} className="w-full bg-accent hover:bg-accent/90">
                Confirm Booking
              </Button>
              <Button onClick={() => { setShowBooking(false); setBookingSeats(1); }} variant="outline" className="w-full">Cancel</Button>
            </div>
          </Card>
        </div>
      )}

      {/* My Tickets Drawer/Modal */}
      {showMyTickets && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full sm:max-w-md h-[85vh] sm:h-[600px] flex flex-col animate-in slide-in-from-bottom-full sm:zoom-in-95 rounded-t-3xl sm:rounded-xl overflow-hidden border-border/50">
            <div className="p-4 border-b border-border flex items-center justify-between bg-card shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Ticket className="w-4 h-4 text-green-500" />
                </div>
                <h2 className="text-lg font-bold">My Tickets</h2>
              </div>
              <button onClick={() => setShowMyTickets(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {myTickets.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <Ticket className="w-12 h-12 mb-3" />
                  <p className="text-lg font-medium">No tickets yet</p>
                  <p className="text-sm">Find a bus and book a seat!</p>
                </div>
              ) : (
                myTickets.map((ticket, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <div className="flex justify-between items-start mb-3 relative">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase">{ticket.date}</p>
                        <p className="font-bold text-foreground mt-0.5 text-lg">{ticket.bus}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dashed border-border relative">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Ticket ID</p>
                        <p className="font-mono text-sm font-semibold">{ticket.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Seats</p>
                        <p className="font-bold text-xl leading-none mt-1">{ticket.seats}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

