import { useState, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    address: null,
    loading: false,
    error: null,
  });

  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, error: 'Geolocation is not supported' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      // Mock address for demo (in production, use reverse geocoding API)
      const mockAddress = `Near Halisahar Station, Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`;

      setState({
        latitude,
        longitude,
        address: mockAddress,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Failed to get location';
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable. Please try again.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
      }
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
    }
  }, []);

  return { ...state, getLocation };
}
