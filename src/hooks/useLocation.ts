import { useEffect, useRef } from 'react';
import { useResQStore } from '../store/useResQStore';
import {
  FLOOD_PRONE_ZONES,
  MOCK_RAINFALL_FORECAST,
  predictNearbyFloodAlert,
} from '../data/floodZones';

/**
 * Simulated path of waypoints moving slowly through Chennai neighbourhoods
 * (Velachery -> Kotturpuram -> T. Nagar -> Mylapore -> Tambaram -> Anna Nagar)
 */
const MOCK_CHENNAI_WAYPOINTS = [
  { lat: 12.9784, lng: 80.2184, areaId: 'velachery' }, // Velachery Main Road Underpass
  { lat: 12.9756, lng: 80.2208, areaId: 'velachery' }, // Vijayanagar 2nd Main Road
  { lat: 13.0168, lng: 80.2422, areaId: 'adyar' }, // Kotturpuram Low Bridge
  { lat: 13.0352, lng: 80.2305, areaId: 'tnagar' }, // Madley Subway
  { lat: 13.0268, lng: 80.2614, areaId: 'mylapore' }, // Canal Bank Road
  { lat: 12.9192, lng: 80.0956, areaId: 'tambaram' }, // Mudichur Road
  { lat: 13.085, lng: 80.2101, areaId: 'annanagar' }, // Anna Nagar High Ground
];

export function useLocation() {
  const {
    hasResolvedLocation,
    locationTrackingEnabled,
    userCoords,
    setUserCoords,
    setTrackedAreaId,
    triggerFloodAlert,
  } = useResQStore();

  const lastAlertedZoneRef = useRef<string | null>(null);
  const waypointIndexRef = useRef<number>(0);

  useEffect(() => {
    if (!hasResolvedLocation || !locationTrackingEnabled) return;

    let watchId: number | null = null;
    let fallbackInterval: ReturnType<typeof setInterval> | null = null;

    const evaluatePosition = (lat: number, lng: number, areaId?: string) => {
      setUserCoords(lat, lng);
      if (areaId) {
        setTrackedAreaId(areaId);
      }

      const alert = predictNearbyFloodAlert(
        lat,
        lng,
        FLOOD_PRONE_ZONES,
        MOCK_RAINFALL_FORECAST
      );

      if (alert && lastAlertedZoneRef.current !== alert.zone.id) {
        lastAlertedZoneRef.current = alert.zone.id;
        triggerFloodAlert(alert);
      }
    };

    const startMockMovementFallback = () => {
      if (fallbackInterval) return;
      // Simulate the user moving slowly through Chennai neighbourhoods every 25 seconds
      fallbackInterval = setInterval(() => {
        waypointIndexRef.current =
          (waypointIndexRef.current + 1) % MOCK_CHENNAI_WAYPOINTS.length;
        const wp = MOCK_CHENNAI_WAYPOINTS[waypointIndexRef.current];
        evaluatePosition(wp.lat, wp.lng, wp.areaId);
      }, 25000);
    };

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Check if user is physically inside Chennai bounding box; if not, use mock Chennai path
          const isInsideChennai =
            latitude >= 12.8 &&
            latitude <= 13.25 &&
            longitude >= 80.0 &&
            longitude <= 80.35;

          if (isInsideChennai) {
            evaluatePosition(latitude, longitude);
          } else {
            startMockMovementFallback();
          }
        },
        () => {
          // Permission denied or unavailable -> fall back to simulated movement through Chennai
          startMockMovementFallback();
        },
        {
          enableHighAccuracy: false,
          maximumAge: 15000,
          timeout: 6000,
        }
      );
    } else {
      startMockMovementFallback();
    }

    return () => {
      if (watchId !== null && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
    };
  }, [
    hasResolvedLocation,
    locationTrackingEnabled,
    setTrackedAreaId,
    setUserCoords,
    triggerFloodAlert,
  ]);

  return { userCoords };
}
