// User & Authentication
export type UserRole = 'admin' | 'driver' | 'parent' | 'student' | 'operator';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

// Vehicle Management
export interface Vehicle {
  id: string;
  registration_number: string;
  name: string;
  type: 'bus' | 'van' | 'car';
  capacity: number;
  current_occupancy: number;
  occupancy_status: 'empty' | 'moderate' | 'full';
  driver_id: string;
  organization_id: string;
  last_location?: Location;
  last_updated: string;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

// Location Tracking
export interface Location {
  id: string;
  vehicle_id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: string;
  created_at: string;
}

// Routes & Trips
export interface Route {
  id: string;
  name: string;
  organization_id: string;
  start_point: { latitude: number; longitude: number; address: string };
  end_point: { latitude: number; longitude: number; address: string };
  waypoints: { latitude: number; longitude: number; address: string }[];
  estimated_duration: number;
  distance: number;
  schedule: RouteSchedule[];
  created_at: string;
  updated_at: string;
}

export interface RouteSchedule {
  id: string;
  route_id: string;
  day_of_week: number; // 0-6
  start_time: string; // HH:mm
  end_time: string;
  is_active: boolean;
}

export interface Trip {
  id: string;
  vehicle_id: string;
  route_id: string;
  driver_id: string;
  start_time: string;
  estimated_end_time: string;
  actual_end_time?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  current_waypoint_index: number;
  created_at: string;
  updated_at: string;
}

// Passenger & Boarding
export interface Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  school_id: string;
  organization_id: string;
  parent_ids: string[];
  qr_code?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface BoardingConfirmation {
  id: string;
  trip_id: string;
  student_id: string;
  parent_id: string;
  status: 'pending' | 'confirmed' | 'boarding' | 'onboard' | 'dropped_off';
  boarding_time?: string;
  drop_off_time?: string;
  created_at: string;
  updated_at: string;
}

export interface Passenger {
  id: string;
  user_id: string;
  vehicle_id: string;
  trip_id: string;
  boarding_time: string;
  drop_off_time?: string;
  status: 'waiting' | 'onboard' | 'dropped_off';
  created_at: string;
  updated_at: string;
}

// Safety & Alerts
export enum AlertType {
  ROUTE_DEVIATION = 'route_deviation',
  SPEED_VIOLATION = 'speed_violation',
  OCCUPANCY_FULL = 'occupancy_full',
  SOS = 'sos',
  EMERGENCY_CONTACT = 'emergency_contact',
  VEHICLE_BREAKDOWN = 'vehicle_breakdown',
  DELAYED_ARRIVAL = 'delayed_arrival',
}

export interface Alert {
  id: string;
  vehicle_id: string;
  trip_id?: string;
  alert_type: AlertType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location?: { latitude: number; longitude: number };
  is_resolved: boolean;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SOSRequest {
  id: string;
  vehicle_id: string;
  trip_id: string;
  initiator_id: string; // student or driver
  initiator_type: 'student' | 'driver';
  location: { latitude: number; longitude: number };
  status: 'pending' | 'acknowledged' | 'responded' | 'resolved';
  responder_ids?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

// ETA & Navigation
export interface ETA {
  trip_id: string;
  current_waypoint_index: number;
  remaining_distance: number;
  estimated_arrival_time: string;
  updated_at: string;
}

// QR Code
export interface QRCode {
  id: string;
  code: string;
  associated_id: string; // student_id or trip_id
  type: 'student' | 'trip';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Organization
export interface Organization {
  id: string;
  name: string;
  type: 'school' | 'transport_company' | 'government';
  address?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

// Parent Portal
export interface ParentPortalView {
  student_id: string;
  current_trip?: Trip & { vehicle: Vehicle; route: Route; eta: ETA };
  boarding_confirmations: BoardingConfirmation[];
  alerts: Alert[];
  historical_trips: Trip[];
}

// Analytics
export interface DailyAnalytics {
  date: string;
  total_trips: number;
  total_distance: number;
  total_time: number;
  average_occupancy: number;
  on_time_trips: number;
  delayed_trips: number;
  cancelled_trips: number;
}

export interface VehicleAnalytics {
  vehicle_id: string;
  total_trips: number;
  total_distance: number;
  average_occupancy: number;
  fuel_efficiency?: number;
  maintenance_schedule?: string;
  alert_count: number;
}
