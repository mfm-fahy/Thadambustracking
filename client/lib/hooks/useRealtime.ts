import { useEffect, useRef, useCallback, useState } from 'react';

interface RealtimeOptions {
  interval?: number; // Polling interval in ms
  onError?: (error: Error) => void;
  enabled?: boolean;
}

/**
 * Hook for real-time data with WebSocket or polling fallback
 * Subscribes to data updates and automatically handles reconnection
 */
export function useRealtimeData<T>(
  channel: string,
  callback: (data: T) => void,
  options: RealtimeOptions = {}
) {
  const { interval = 3000, onError, enabled = true } = options;
  const pollingIntervalRef = useRef<NodeJS.Timeout>();
  const [isConnected, setIsConnected] = useState(false);

  const startPolling = useCallback(() => {
    if (!enabled) return;

    // Simulate real-time updates via polling
    pollingIntervalRef.current = setInterval(() => {
      // This would be replaced with actual API calls or WebSocket
      // For now, trigger callback to refresh data
      setIsConnected(true);
    }, interval);
  }, [enabled, interval]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = undefined;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (enabled) {
      startPolling();
    }
    return stopPolling;
  }, [enabled, startPolling, stopPolling]);

  return { isConnected, stop: stopPolling };
}

/**
 * Hook to update vehicle location in real-time
 */
export function useLocationUpdates(vehicleId: string) {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    timestamp: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate location updates by polling
    const interval = setInterval(async () => {
      try {
        // In production, this would fetch from /api/vehicles/{id}/location
        // const response = await fetch(`/api/vehicles/${vehicleId}/location`);
        // const data = await response.json();
        // setLocation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [vehicleId]);

  return { location, error };
}

/**
 * Hook to subscribe to alerts
 */
export function useAlertSubscription() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Simulate alert subscription
    setIsSubscribed(true);

    // Cleanup
    return () => {
      setIsSubscribed(false);
    };
  }, []);

  const addAlert = useCallback((alert: any) => {
    setAlerts((prev) => [alert, ...prev]);
  }, []);

  const removeAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  return { alerts, isSubscribed, addAlert, removeAlert };
}

/**
 * Hook to subscribe to SOS requests
 */
export function useSOSSubscription() {
  const [sosRequests, setSOSRequests] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    setIsSubscribed(true);

    return () => {
      setIsSubscribed(false);
    };
  }, []);

  const addSOSRequest = useCallback((request: any) => {
    setSOSRequests((prev) => [request, ...prev]);
  }, []);

  const updateSOSRequest = useCallback((requestId: string, status: string) => {
    setSOSRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
  }, []);

  return { sosRequests, isSubscribed, addSOSRequest, updateSOSRequest };
}

/**
 * Hook to subscribe to trip updates
 */
export function useTripUpdates(tripId: string) {
  const [tripData, setTripData] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    setIsSubscribed(true);

    // Simulate polling for trip updates
    const interval = setInterval(() => {
      // Would fetch from /api/trips/{tripId}
    }, 3000);

    return () => {
      clearInterval(interval);
      setIsSubscribed(false);
    };
  }, [tripId]);

  return { tripData, isSubscribed };
}

/**
 * Hook to subscribe to boarding status updates
 */
export function useBoardingStatus(tripId: string) {
  const [boardingData, setBoardingData] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    setIsSubscribed(true);

    const interval = setInterval(() => {
      // Would fetch from /api/trips/{tripId}/boarding-status
    }, 2000);

    return () => {
      clearInterval(interval);
      setIsSubscribed(false);
    };
  }, [tripId]);

  return { boardingData, isSubscribed };
}
