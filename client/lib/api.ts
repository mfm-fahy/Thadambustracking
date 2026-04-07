// API utility functions for Thadam
// These will be connected to your backend later

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new APIError(response.status, error.message || 'API Error', error);
  }

  return response.json();
}

// Vehicle APIs
export const vehicleAPI = {
  list: () =>
    apiCall<any[]>('/vehicles'),

  get: (id: string) =>
    apiCall<any>(`/vehicles/${id}`),

  create: (data: any) =>
    apiCall<any>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall<any>(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<void>(`/vehicles/${id}`, {
      method: 'DELETE',
    }),

  updateOccupancy: (id: string, occupancy: string) =>
    apiCall<any>(`/vehicles/${id}/occupancy`, {
      method: 'PATCH',
      body: JSON.stringify({ occupancy_status: occupancy }),
    }),
};

// Location APIs
export const locationAPI = {
  getCurrentLocation: (vehicleId: string) =>
    apiCall<any>(`/vehicles/${vehicleId}/location`),

  getLocationHistory: (vehicleId: string, hours: number = 24) =>
    apiCall<any[]>(`/vehicles/${vehicleId}/locations?hours=${hours}`),

  updateLocation: (vehicleId: string, latitude: number, longitude: number) =>
    apiCall<any>(`/vehicles/${vehicleId}/location`, {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude, timestamp: new Date().toISOString() }),
    }),
};

// Route APIs
export const routeAPI = {
  list: () =>
    apiCall<any[]>('/routes'),

  get: (id: string) =>
    apiCall<any>(`/routes/${id}`),

  create: (data: any) =>
    apiCall<any>('/routes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall<any>(`/routes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<void>(`/routes/${id}`, {
      method: 'DELETE',
    }),
};

// Trip APIs
export const tripAPI = {
  list: () =>
    apiCall<any[]>('/trips'),

  get: (id: string) =>
    apiCall<any>(`/trips/${id}`),

  create: (data: any) =>
    apiCall<any>('/trips', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall<any>(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getETA: (tripId: string) =>
    apiCall<any>(`/trips/${tripId}/eta`),

  getCurrentTrips: () =>
    apiCall<any[]>('/trips/current'),
};

// Student & Boarding APIs
export const boardingAPI = {
  confirmBoarding: (confirmationId: string) =>
    apiCall<any>(`/boarding/${confirmationId}/confirm`, {
      method: 'POST',
    }),

  getBoardingStatus: (tripId: string) =>
    apiCall<any[]>(`/trips/${tripId}/boarding-status`),

  getStudentQRCode: (studentId: string) =>
    apiCall<any>(`/students/${studentId}/qr-code`),

  scanQRCode: (code: string) =>
    apiCall<any>('/boarding/scan-qr', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
};

// Alert APIs
export const alertAPI = {
  list: () =>
    apiCall<any[]>('/alerts'),

  get: (id: string) =>
    apiCall<any>(`/alerts/${id}`),

  create: (data: any) =>
    apiCall<any>('/alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resolve: (id: string) =>
    apiCall<any>(`/alerts/${id}/resolve`, {
      method: 'PATCH',
    }),

  getActive: () =>
    apiCall<any[]>('/alerts/active'),

  getByVehicle: (vehicleId: string) =>
    apiCall<any[]>(`/vehicles/${vehicleId}/alerts`),
};

// SOS APIs
export const sosAPI = {
  send: (vehicleId: string, tripId: string, initiatorType: 'student' | 'driver') =>
    apiCall<any>('/sos', {
      method: 'POST',
      body: JSON.stringify({
        vehicle_id: vehicleId,
        trip_id: tripId,
        initiator_type: initiatorType,
      }),
    }),

  getActive: () =>
    apiCall<any[]>('/sos/active'),

  acknowledge: (sosId: string) =>
    apiCall<any>(`/sos/${sosId}/acknowledge`, {
      method: 'PATCH',
    }),

  resolve: (sosId: string, notes?: string) =>
    apiCall<any>(`/sos/${sosId}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    }),
};

// Parent Portal APIs
export const parentPortalAPI = {
  getStudentStatus: (studentId: string) =>
    apiCall<any>(`/parent-portal/students/${studentId}`),

  getStudentTrips: (studentId: string, limit: number = 10) =>
    apiCall<any[]>(`/parent-portal/students/${studentId}/trips?limit=${limit}`),

  getNotifications: (parentId: string) =>
    apiCall<any[]>(`/parent-portal/notifications`),
};

// Analytics APIs
export const analyticsAPI = {
  getDailyAnalytics: (date: string) =>
    apiCall<any>(`/analytics/daily?date=${date}`),

  getVehicleAnalytics: (vehicleId: string) =>
    apiCall<any>(`/analytics/vehicles/${vehicleId}`),

  getTripAnalytics: (tripId: string) =>
    apiCall<any>(`/analytics/trips/${tripId}`),

  getReports: (startDate: string, endDate: string) =>
    apiCall<any[]>(`/analytics/reports?start=${startDate}&end=${endDate}`),
};

// User & Auth APIs
export const userAPI = {
  getCurrentUser: () =>
    apiCall<any>('/users/me'),

  login: (email: string, password: string) =>
    apiCall<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiCall<void>('/auth/logout', {
      method: 'POST',
    }),

  register: (data: any) =>
    apiCall<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProfile: (data: any) =>
    apiCall<any>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Mock data generators for development
export const mockData = {
  generateVehicles: (count: number = 5) => {
    const vehicles = [];
    const statuses: Array<'empty' | 'moderate' | 'full'> = ['empty', 'moderate', 'full'];
    for (let i = 1; i <= count; i++) {
      vehicles.push({
        id: `vehicle-${i}`,
        registration_number: `TM-${1000 + i}`,
        name: `Bus Route ${i}`,
        type: 'bus' as const,
        capacity: 50,
        current_occupancy: Math.floor(Math.random() * 50),
        occupancy_status: statuses[Math.floor(Math.random() * 3)],
        driver_id: `driver-${i}`,
        organization_id: 'org-1',
        last_location: {
          id: `loc-${i}`,
          vehicle_id: `vehicle-${i}`,
          latitude: 40.7128 + Math.random() * 0.1,
          longitude: -74.006 + Math.random() * 0.1,
          accuracy: 5,
          speed: Math.random() * 60,
          heading: Math.random() * 360,
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        last_updated: new Date().toISOString(),
        status: 'active' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    return vehicles;
  },

  generateTrips: (count: number = 3) => {
    const trips = [];
    const statuses: Array<'scheduled' | 'in_progress' | 'completed' | 'cancelled'> = [
      'scheduled',
      'in_progress',
      'completed',
    ];
    for (let i = 1; i <= count; i++) {
      trips.push({
        id: `trip-${i}`,
        vehicle_id: `vehicle-${i}`,
        route_id: `route-${i}`,
        driver_id: `driver-${i}`,
        start_time: new Date().toISOString(),
        estimated_end_time: new Date(Date.now() + 2 * 3600000).toISOString(),
        status: statuses[i % 3],
        current_waypoint_index: Math.floor(Math.random() * 5),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    return trips;
  },

  generateAlerts: (count: number = 3) => {
    const alerts = [];
    const types = [
      'route_deviation',
      'speed_violation',
      'occupancy_full',
      'delayed_arrival',
    ];
    const severities: Array<'low' | 'medium' | 'high' | 'critical'> = [
      'low',
      'medium',
      'high',
    ];
    for (let i = 1; i <= count; i++) {
      alerts.push({
        id: `alert-${i}`,
        vehicle_id: `vehicle-${i}`,
        alert_type: types[i % types.length],
        severity: severities[i % severities.length],
        message: `Alert ${i}: Sample alert message`,
        is_resolved: i % 3 === 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    return alerts;
  },
};
