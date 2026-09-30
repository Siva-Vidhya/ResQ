export type RiskLevel = 'SAFE' | 'WATCH' | 'WARNING' | 'CRITICAL';

export interface GridZone {
  id: string;
  name: string;
  tamilName?: string;
  hindiName?: string;
  lat: number;
  lng: number;
  elevationMeters: number; // Low elevation = high inundation risk
  population: number;
  vulnerabilityIndex: number; // 0 - 1.0 (socio-economic + elderly + density factor)
  riskScore: number; // 0 - 100 dynamic calculated risk
  riskLevel: RiskLevel;
  timeToImpactMin: number; // 0 = already flooding, >0 = predicted minutes to flood peak
  predictedFloodDepthCm: number;
  topRiskFactors: [string, string, string];
  evacuationStatus: 'NORMAL' | 'PREPARING' | 'EVACUATING' | 'COMPLETED';
}

export interface Hospital {
  id: string;
  name: string;
  zoneId: string;
  lat: number;
  lng: number;
  totalBeds: number;
  availableBeds: number;
  icuAvailable: number;
  traumaLevel: 1 | 2 | 3;
  hasPowerBackup: boolean;
  floodBarrierSecured: boolean;
}

export interface Ambulance {
  id: string;
  code: string;
  hospitalId: string;
  lat: number;
  lng: number;
  status: 'AVAILABLE' | 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE' | 'RETURNING';
  assignedZoneId?: string;
  assignedHospitalId?: string;
  vehicleType: 'ADVANCED_LIFE_SUPPORT' | 'BASIC_LIFE_SUPPORT' | 'AMPHIBIOUS_4X4';
  etaMinutes?: number;
}

export interface Shelter {
  id: string;
  name: string;
  zoneId: string;
  lat: number;
  lng: number;
  capacity: number;
  occupied: number;
  isAccessibleForDisabled: boolean;
  supplies: {
    foodHoursLeft: number;
    waterLiters: number;
    hasGenerator: boolean;
    medicalKits: number;
    blankets: number;
  };
}

export interface ReliefDepot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  stock: {
    foodPackets: number;
    cleanWaterLiters: number;
    medicalKits: number;
    rescueBoats: number;
    lifeJackets: number;
    sandbags: number;
  };
  logisticsReady: boolean;
}

export interface SensorTimeSeriesPoint {
  timestamp: string; // ISO or HH:MM
  value: number;
}

export interface Sensor {
  id: string;
  name: string;
  type: 'RAIN_GAUGE' | 'RIVER_LEVEL' | 'CANAL_FLOW' | 'RESERVOIR_OUTFLOW' | 'TIDAL_GAUGE';
  lat: number;
  lng: number;
  currentValue: number;
  unit: 'mm/h' | 'm' | 'cusecs';
  warningThreshold: number;
  criticalThreshold: number;
  trend: 'RISING' | 'STABLE' | 'FALLING';
  status: 'NORMAL' | 'WATCH' | 'CRITICAL';
  history: SensorTimeSeriesPoint[];
}

export interface RoadSegment {
  id: string;
  name: string;
  startCoords: [number, number];
  endCoords: [number, number];
  blockedProbability: number; // 0 - 100%
  waterDepthCm: number;
  status: 'OPEN' | 'CONGESTED' | 'BLOCKED_FLOODED' | 'EMERGENCY_ONLY';
  alternateRouteDescription: string;
}

export interface HourlyForecast {
  hourOffset: number; // 0 to 24
  hour: string; // "15:00", "+1h", etc.
  timeLabel: string;
  rainfallMm: number;
  riverLevelMeters: number; // Adyar/Cooum basin level in meters
  dangerThresholdMeters: number; // Danger mark (e.g. 5.0m)
  affectedPopulationK: number; // Predicted affected population in thousands
  waterLevelIndex: number; // 0 - 100
  windSpeedKmh: number;
  tideHeightMeters: number;
  forecastRiskScore: number;
}

export interface AlertMessage {
  id: string;
  timestamp: string;
  severity: RiskLevel;
  zoneIds: string[];
  zonesText: string;
  title: {
    en: string;
    ta: string;
    hi: string;
  };
  description: {
    en: string;
    ta: string;
    hi: string;
  };
  actionableStep: {
    en: string;
    ta: string;
    hi: string;
  };
  audioWarningTriggered?: boolean;
}

export interface DispatchRecommendation {
  id: string;
  targetZoneId: string;
  zoneName: string;
  severity: RiskLevel;
  suggestedAction: string;
  suggestedAmbulanceId?: string;
  suggestedAmbulanceCode?: string;
  suggestedDepotId?: string;
  itemsToDeploy?: string;
  estimatedTravelTimeMin: number;
  safeRouteSummary: string;
  urgencyScore: number; // higher = top priority
  status: 'PENDING' | 'DISPATCHED' | 'IGNORED';
}
