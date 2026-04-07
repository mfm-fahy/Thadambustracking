'use client';

import { useState, useEffect, useRef } from 'react';

export interface GPSPosition {
  lat: number;
  lng: number;
  accuracy: number;   // metres
  heading: number | null;
  speed: number | null; // m/s
  timestamp: number;
}

export type GPSStatus = 'idle' | 'requesting' | 'active' | 'error';

export function useGPS(enabled = true) {
  const [position, setPosition] = useState<GPSPosition | null>(null);
  const [status, setStatus] = useState<GPSStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (!navigator.geolocation) {
      setStatus('error');
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setStatus('requesting');

    const onSuccess = (pos: GeolocationPosition) => {
      setStatus('active');
      setError(null);
      setPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        heading: pos.coords.heading,
        speed: pos.coords.speed,
        timestamp: pos.timestamp,
      });
    };

    const onError = (err: GeolocationPositionError) => {
      setStatus('error');
      setError(
        err.code === 1
          ? 'Location permission denied. Please allow access in your browser settings.'
          : err.code === 2
          ? 'Location unavailable. Check your GPS signal.'
          : 'Location request timed out.'
      );
    };

    const opts: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 2000,
      timeout: 10000,
    };

    // Get initial fix immediately
    navigator.geolocation.getCurrentPosition(onSuccess, onError, opts);

    // Then watch continuously
    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, opts);

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [enabled]);

  return { position, status, error };
}
