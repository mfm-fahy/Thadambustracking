'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Bus, MapPin, Plus, Trash2, ChevronRight, CheckCircle,
  Navigation, Users, Building2, GraduationCap, Briefcase, Globe, ArrowLeft, LocateFixed, Wifi, WifiOff, LogOut, Share2, Copy, MessageSquare, Ticket, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useGPS } from '@/lib/hooks/useGPS';
import { toast } from 'sonner';
import { API_URL } from '@/lib/config';

const VehicleMap = dynamic(
  () => import('@/components/passenger/VehicleMap').then((m) => m.VehicleMap),
  { ssr: false, loading: () => <div className="w-full h-full min-h-[400px] bg-muted animate-pulse rounded-lg" /> }
);

type Step = 'vehicle' | 'type' | 'stops' | 'tracking' | 'dashboard';

const TRANSPORT_TYPES = [
  { id: 'public', label: 'Public Transport', desc: 'City / state government bus', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'government', label: 'Government Bus', desc: 'Central / state owned fleet', icon: Building2, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 'school', label: 'School Bus', desc: 'K-12 student transport', icon: GraduationCap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'college', label: 'College Shuttle', desc: 'University / college transport', icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'office', label: 'Office / Corporate', desc: 'Employee shuttle service', icon: Briefcase, color: 'text-teal-500', bg: 'bg-teal-500/10' },
  { id: 'private', label: 'Private Transport', desc: 'Charter / private hire', icon: Bus, color: 'text-accent', bg: 'bg-accent/10' },
];

interface Stop {
  id: string;
  name: string;
  time: string;
}

// Simple SVG QR Code component (Mocked with a pattern)
const QrCodeMock = ({ value }: { value: string }) => (
  <div className="relative w-48 h-48 bg-white p-2 rounded-xl flex items-center justify-center border-4 border-accent/20">
    <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
      <rect width="32" height="32" fill="white" />
      {/* Outer frames */}
      <path d="M2,2 h7 v1 h-6 v6 h-1 z M23,2 h7 v7 h-1 v-6 h-6 z M2,23 v7 h7 v-1 h-6 v-6 z" fill="currentColor" />
      {/* Inner random-ish pattern */}
      <path d="M5,5 h4 v4 h-4 z M23,5 h4 v4 h-4 z M5,23 h4 v4 h-4 z M11,5 h2 v2 h-2 z M15,5 h2 v5 h-2 z M19,5 h2 v2 h-2 z" fill="currentColor" />
      <path d="M11,11 h3 v3 h-3 z M16,11 h5 v2 h-5 z M11,16 h2 v5 h-2 z M15,16 h5 v3 h-5 z M23,11 h4 v4 h-4 z" fill="currentColor" />
      <path d="M21,21 h4 v4 h-4 z M11,25 h6 v2 h-6 z M25,25 h2 v2 h-2 z" fill="currentColor" />
      {/* Center logo square */}
      <rect x="13" y="13" width="6" height="6" rx="1" className="fill-accent" />
      <path d="M14.5,14.5 h3 v1 h-3 z M14.5,16.5 h3 v1 h-3 z" fill="white" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <Bus className="w-6 h-6 text-accent-foreground" />
    </div>
  </div>
);

export default function DriverPage() {
  const [step, setStep] = useState<Step>('vehicle');

  // Step 1 — Vehicle details
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [capacity, setCapacity] = useState('');

  // Step 2 — Transport type
  const [transportType, setTransportType] = useState('');

  // Step 3 — Stops
  const [stops, setStops] = useState<Stop[]>([
    { id: '1', name: '', time: '' },
    { id: '2', name: '', time: '' },
  ]);

  // Step 4 — GPS live tracking
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const { position: gpsPos, status: gpsStatus, error: gpsError } = useGPS(gpsEnabled && (step === 'tracking' || step === 'dashboard'));

  // Use real GPS coords when available, else fallback
  const driverLat = gpsPos?.lat ?? 10.7958;
  const driverLng = gpsPos?.lng ?? 78.7032;

  // Phase 1 + 2 Driver Features
  const [announcement, setAnnouncement] = useState('');
  const [bookedSeats, setBookedSeats] = useState(0);
  const [passengerList, setPassengerList] = useState<any[]>([]);

  // Local sync for passenger bookings
  useEffect(() => {
    if (step !== 'dashboard') return;
    
    // Initial load
    const loadBookings = () => {
      const saved = localStorage.getItem('thadam_bookings');
      if (saved) {
        const tickets = JSON.parse(saved);
        // We match by bus name since vehicleNumber handles fake mocks too
        const myTickets = tickets.filter((t: any) => t.bus === vehicleNumber || t.bus === vehicleName);
        setPassengerList(myTickets);
        setBookedSeats(myTickets.reduce((sum: number, t: any) => sum + t.seats, 0));
      }
    };
    loadBookings();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'thadam_bookings') {
        loadBookings();
        toast.success("New passenger booking received!", { icon: <Ticket className="w-5 h-5" />});
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [step, vehicleNumber, vehicleName]);

  const addStop = () =>
    setStops((prev) => [...prev, { id: Date.now().toString(), name: '', time: '' }]);

  const removeStop = (id: string) =>
    setStops((prev) => prev.filter((s) => s.id !== id));

  const updateStop = (id: string, field: 'name' | 'time', value: string) =>
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  const mapStops = stops
    .filter((s) => s.name)
    .map((s, i) => ({
      name: s.name,
      lat: 10.7905 + i * 0.006,
      lng: 78.7047 + i * 0.005,
    }));

  const handleGoToDashboard = async () => {
    setStep('dashboard');
    setGpsEnabled(true);

    try {
      await fetch(`${API_URL}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_number: vehicleNumber || `TM-${Date.now().toString().slice(-4)}`,
          name: vehicleName || 'Driver Bus',
          type: transportType || 'bus',
          capacity: parseInt(capacity) || 50,
          status: 'active',
          occupancy_status: 'empty',
          last_location: {
            latitude: driverLat,
            longitude: driverLng
          }
        })
      });
      toast.success('Bus is now LIVE on Thadam network!');
    } catch (err) {
      console.error('Failed to sync to DB:', err);
      toast.error('Failed to connect to backend DB. Using local mock instead.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tm_role');
    localStorage.removeItem('tm_user');
    window.location.href = '/login';
  };

  const copyId = () => {
    navigator.clipboard.writeText(vehicleNumber);
    toast.success('Vehicle ID copied to clipboard!');
  };

  const handleEndTrip = () => {
    setStep('vehicle');
    setGpsEnabled(false);
    toast.info("Trip ended. Vehicle disconnected from live network.");
  };

  const handleSendAnnouncement = () => {
    if (!announcement.trim()) return;
    localStorage.setItem('thadam_announcement', JSON.stringify({
      bus: vehicleName || vehicleNumber,
      text: announcement,
      time: Date.now()
    }));
    toast.success("Announcement broadcasted to passengers!");
    setAnnouncement('');
  };

  const stepIndex = { vehicle: 0, type: 1, stops: 2, tracking: 3, dashboard: 4 };
  const stepsNames = ['Vehicle', 'Type', 'Stops', 'Tracking'];

  return (
    <div className="min-h-screen bg-background flex flex-col lowercase-nav">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <Bus className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-bold text-foreground">
              {step === 'dashboard' ? 'Driver Dashboard' : 'Driver Setup'}
            </span>
          </div>

          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 px-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-2 hidden sm:block text-sm font-medium">Log out</span>
          </Button>
        </div>
      </nav>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {/* Progress Steps — Only show during setup */}
        {step !== 'dashboard' && (
          <div className="flex items-center gap-2 mb-8">
            {stepsNames.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 ${i <= stepIndex[step] ? 'text-accent' : 'text-muted-foreground'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    i < stepIndex[step]
                      ? 'bg-accent border-accent text-accent-foreground'
                      : i === stepIndex[step]
                      ? 'border-accent text-accent'
                      : 'border-border text-muted-foreground'
                  }`}>
                    {i < stepIndex[step] ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{s}</span>
                </div>
                {i < stepsNames.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded ${i < stepIndex[step] ? 'bg-accent' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 1 — Vehicle Details */}
        {step === 'vehicle' && (
          <Card className="p-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">Vehicle Details</h2>
              <p className="text-sm text-muted-foreground mt-1">Enter your vehicle information to get started</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Vehicle Registration Number</label>
                <Input
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. TM-1042 or SCH-101"
                  className="h-11 uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Vehicle Name / Route Name</label>
                <Input
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  placeholder="e.g. Route 42 Express"
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Passenger Capacity</label>
                <Input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 50"
                  className="h-11"
                  min={1}
                />
              </div>
            </div>

            <Button
              onClick={() => setStep('type')}
              disabled={!vehicleNumber || !vehicleName || !capacity}
              className="w-full bg-accent hover:bg-accent/90 gap-2 h-11"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          </Card>
        )}

        {/* Step 2 — Transport Type */}
        {step === 'type' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">Transport Type</h2>
              <p className="text-sm text-muted-foreground mt-1">What kind of transport service do you operate?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TRANSPORT_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTransportType(t.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      transportType === t.id
                        ? 'border-accent bg-accent/10'
                        : 'border-border bg-card hover:border-accent/40'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${t.bg}`}>
                      <Icon className={`w-5 h-5 ${t.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{t.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep('vehicle')} variant="outline" className="flex-1 h-11">Back</Button>
              <Button
                onClick={() => setStep('stops')}
                disabled={!transportType}
                className="flex-1 bg-accent hover:bg-accent/90 gap-2 h-11"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 — Add Stops */}
        {step === 'stops' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">Add Route Stops</h2>
              <p className="text-sm text-muted-foreground mt-1">Add all stops on your route in order</p>
            </div>

            <div className="space-y-3">
              {stops.map((stop, i) => (
                <div key={stop.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <Input
                    value={stop.name}
                    onChange={(e) => updateStop(stop.id, 'name', e.target.value)}
                    placeholder={`Stop ${i + 1} name`}
                    className="flex-1 h-10"
                  />
                  <Input
                    type="time"
                    value={stop.time}
                    onChange={(e) => updateStop(stop.id, 'time', e.target.value)}
                    className="w-28 h-10"
                  />
                  {stops.length > 2 && (
                    <button onClick={() => removeStop(stop.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addStop}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-border hover:border-accent/50 text-muted-foreground hover:text-accent transition-all text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add Stop
            </button>

            <div className="flex gap-3">
              <Button onClick={() => setStep('type')} variant="outline" className="flex-1 h-11">Back</Button>
              <Button
                onClick={() => setStep('tracking')}
                disabled={stops.filter((s) => s.name).length < 2}
                className="flex-1 bg-accent hover:bg-accent/90 gap-2 h-11"
              >
                Continue <Navigation className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4 — Ready to Track */}
        {step === 'tracking' && (
          <Card className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Route Setup Complete!</h2>
              <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                Your bus is ready to be tracked. Head to your dashboard to start broadcasting your live location.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                onClick={handleGoToDashboard}
                className="w-full bg-accent hover:bg-accent/90 h-12 text-lg font-bold shadow-lg shadow-accent/20"
              >
                Go to Dashboard
              </Button>
              <Button onClick={() => setStep('stops')} variant="ghost" className="w-full">
                Review Stops
              </Button>
            </div>
          </Card>
        )}

        {/* DASHBOARD VIEW */}
        {step === 'dashboard' && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="p-6 overflow-hidden relative border-accent/20 shadow-xl shadow-accent/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {gpsEnabled ? 'Broadcast Active' : 'Broadcast Offline'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {gpsEnabled ? 'Passengers can now see your live location' : 'Turn on broadcast to share your location'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Switch
                    checked={gpsEnabled}
                    onCheckedChange={setGpsEnabled}
                    className="data-[state=checked]:bg-accent"
                  />
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    gpsEnabled ? 'bg-green-500/15 border-green-500/30 text-green-600' : 'bg-muted border-border text-muted-foreground'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${gpsEnabled ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                    {gpsEnabled ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>

              {/* GPS status bar */}
              {gpsEnabled && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium mb-4 ${
                  gpsStatus === 'active' ? 'bg-green-500/10 text-green-700 border border-green-500/20'
                  : gpsStatus === 'requesting' ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
                  : gpsStatus === 'error' ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                  : 'bg-muted text-muted-foreground border border-border'
                }`}>
                  <LocateFixed className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1">
                    {gpsStatus === 'requesting' && 'Acquiring GPS signal…'}
                    {gpsStatus === 'active' && gpsPos && `GPS active · ±${Math.round(gpsPos.accuracy)}m accuracy`}
                    {gpsStatus === 'error' && (gpsError ?? 'GPS unavailable')}
                  </span>
                  {gpsPos?.speed != null && (
                    <span className="font-bold text-foreground">{(gpsPos.speed * 3.6).toFixed(0)} km/h</span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/30 rounded-xl border border-border">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Bus Number</p>
                  <p className="font-bold text-foreground mt-1">{vehicleNumber}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl border border-border flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Capacity</p>
                    <p className="font-bold text-foreground mt-1">{capacity} Seats</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-accent uppercase font-bold">Booked</p>
                    <p className="font-bold text-accent mt-1">{bookedSeats}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Sharing Panel */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <Card className="md:col-span-3 p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-accent" /> Share Tracking
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Passengers can enter this ID or scan the QR code to track you</p>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-xl border border-border group">
                  <span className="flex-1 font-mono font-bold text-lg select-all tracking-wider text-accent">{vehicleNumber}</span>
                  <button onClick={copyId} className="w-10 h-10 rounded-lg bg-card hover:bg-muted transition-colors flex items-center justify-center border border-border text-muted-foreground hover:text-accent">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>

                <div className="pt-2">
                  <Button variant="outline" className="w-full gap-2 text-xs h-10">
                    <Share2 className="w-3.5 h-3.5" /> Share Tracking Link
                  </Button>
                </div>
              </Card>

              <div className="md:col-span-2 flex flex-col items-center justify-center gap-3">
                <QrCodeMock value={vehicleNumber} />
                <p className="text-xs text-muted-foreground font-medium">Scan to track bus</p>
              </div>
            </div>

            {/* Route & Map */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-accent" /> Route Overview
                </h3>
                <Button onClick={() => setStep('stops')} variant="link" size="sm" className="text-accent underline">
                  Edit Stops
                </Button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-border shadow-md" style={{ height: '320px' }}>
                <VehicleMap
                  vehicleLat={driverLat}
                  vehicleLng={driverLng}
                  destinationLat={mapStops.length > 0 ? mapStops[mapStops.length - 1].lat : undefined}
                  destinationLng={mapStops.length > 0 ? mapStops[mapStops.length - 1].lng : undefined}
                  vehicleName={vehicleName}
                  zoom={13}
                  userLat={gpsPos?.lat}
                  userLng={gpsPos?.lng}
                  userAccuracy={gpsPos?.accuracy}
                  followUser={gpsEnabled}
                />
              </div>

              <Card className="p-4 bg-muted/10">
                <div className="space-y-3">
                  {stops.filter((s) => s.name).map((stop, i) => (
                    <div key={stop.id} className="flex items-center gap-3 relative">
                      {i < stops.filter((s) => s.name).length - 1 && (
                        <div className="absolute left-[11px] top-6 w-0.5 h-4 bg-accent/20" />
                      )}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                        i === 0 ? 'bg-accent border-accent text-accent-foreground' : 'bg-card border-accent/30 text-accent'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground leading-none">{stop.name}</p>
                        {stop.time && <p className="text-[10px] text-muted-foreground mt-1 lowercase">ETA: {stop.time}</p>}
                      </div>
                      {i === 0 && <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none text-[9px] uppercase">Start</Badge>}
                      {i === stops.filter((s) => s.name).length - 1 && <Badge variant="secondary" className="bg-accent/10 text-accent border-none text-[9px] uppercase">Terminal</Badge>}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Passenger Manifest & Announcements Layer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
              {/* Live Manifest */}
              <Card className="p-4 sm:p-6 border-green-500/20 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" /> Live Manifest
                  </h3>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                    {bookedSeats} Books
                  </Badge>
                </div>
                
                {passengerList.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border px-4">
                    <Ticket className="w-8 h-8 opacity-20 mx-auto mb-2" />
                    <p className="text-sm font-medium">No bookings yet</p>
                    <p className="text-xs mt-1">Waiting for passengers...</p>
                  </div>
                ) : (
                  <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
                    {passengerList.map((t: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-border bg-card shadow-sm">
                        <div className="min-w-0">
                          <p className="text-[10px] text-muted-foreground font-mono truncate">{t.id}</p>
                          <p className="text-sm font-bold text-foreground truncate">{t.date}</p>
                        </div>
                        <div className="bg-green-500/10 px-2 sm:px-3 py-1.5 rounded-md text-green-600 flex-shrink-0 ml-2">
                          <span className="text-[10px] uppercase font-bold hidden xs:inline">Seats: </span>
                          <span className="text-sm sm:text-base font-black">{t.seats}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Live Broadcast */}
              <Card className="p-4 sm:p-6 border-blue-500/20 shadow-md flex flex-col">
                <div className="mb-4">
                  <h3 className="font-bold text-foreground flex items-center gap-2 text-sm sm:text-base">
                    <MessageSquare className="w-5 h-5 text-blue-500" /> Broadcast Update
                  </h3>
                  <p className="text-[11px] sm:text-sm text-muted-foreground mt-1">Send a live alert to all tracking passengers.</p>
                </div>
                
                <div className="flex-1 flex flex-col gap-3">
                  <textarea 
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    placeholder="e.g. Stuck in heavy traffic on main road! Delayed by 10 mins."
                    className="flex-1 w-full p-3 rounded-xl bg-muted/50 border border-border text-sm min-h-[100px] sm:min-h-[120px] resize-none outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <Button 
                    onClick={handleSendAnnouncement}
                    disabled={!announcement.trim()}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 sm:h-11 gap-2"
                  >
                    <AlertCircle className="w-4 h-4" /> Send Alert
                  </Button>
                </div>
              </Card>
            </div>

            {/* End Trip Button */}
            <div className="pt-6">
              <Button 
                onClick={handleEndTrip}
                variant="destructive"
                className="w-full h-14 text-lg font-black tracking-widest shadow-lg shadow-red-500/20"
              >
                END TRIP
              </Button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
