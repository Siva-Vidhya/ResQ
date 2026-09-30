import type { RoadSegment } from '../types';

export const initialRoads: RoadSegment[] = [
  {
    id: 'road-01',
    name: 'Velachery Main Road (Vijayanagar Bus Terminal to 100ft Road)',
    startCoords: [12.9754, 80.2185],
    endCoords: [12.9860, 80.2190],
    blockedProbability: 95,
    waterDepthCm: 90,
    status: 'BLOCKED_FLOODED',
    alternateRouteDescription: 'Bypass via Inner Ring Elevated Flyover or divert through Taramani Link Road to OMR.'
  },
  {
    id: 'road-02',
    name: 'Anna Salai (Saidapet Maraimalai Adigal Bridge)',
    startCoords: [13.0182, 80.2241],
    endCoords: [13.0234, 80.2415],
    blockedProbability: 88,
    waterDepthCm: 75,
    status: 'BLOCKED_FLOODED',
    alternateRouteDescription: 'Emergency vehicles use Guindy Overpass to Sardar Patel Road; bypass low river causeway.'
  },
  {
    id: 'road-03',
    name: 'Mudichur Road (Outer Ring Road Junction to Kishkinta Road)',
    startCoords: [12.9152, 80.0784],
    endCoords: [12.9234, 80.0578],
    blockedProbability: 98,
    waterDepthCm: 110,
    status: 'BLOCKED_FLOODED',
    alternateRouteDescription: 'Complete civilian closure. Deploy Amphibious 4x4 or NDRF dinghy via Vandalur-Walajabad Highway.'
  },
  {
    id: 'road-04',
    name: 'Pallikaranai 200 Feet Radial Road (Marsh Crossing)',
    startCoords: [12.9372, 80.2144],
    endCoords: [12.9647, 80.1961],
    blockedProbability: 82,
    waterDepthCm: 65,
    status: 'BLOCKED_FLOODED',
    alternateRouteDescription: 'Divert through Medavakkam-Sholinganallur Link Road; avoid low center causeway.'
  },
  {
    id: 'road-05',
    name: 'GST Road (Kathipara to St. Thomas Mount Dip)',
    startCoords: [13.0038, 80.1912],
    endCoords: [12.9940, 80.1800],
    blockedProbability: 60,
    waterDepthCm: 35,
    status: 'CONGESTED',
    alternateRouteDescription: 'Slow moving. Ambulances take dedicated center elevated flyover lane.'
  },
  {
    id: 'road-06',
    name: 'OMR Rajiv Gandhi Salai (Perungudi to Thoraipakkam)',
    startCoords: [12.9654, 80.2409],
    endCoords: [12.9392, 80.2355],
    blockedProbability: 55,
    waterDepthCm: 32,
    status: 'CONGESTED',
    alternateRouteDescription: 'Right lanes open for emergency services; avoid unpaved service lanes with submerged ditches.'
  },
  {
    id: 'road-07',
    name: 'Vyasarpadi Ganesapuram Railway Subway',
    startCoords: [13.1162, 80.2589],
    endCoords: [13.1075, 80.2334],
    blockedProbability: 100,
    waterDepthCm: 140,
    status: 'BLOCKED_FLOODED',
    alternateRouteDescription: 'Subway completely submerged. Take Perambur Barracks Road or Basin Bridge Flyover.'
  },
  {
    id: 'road-08',
    name: 'Manali Express Highway (Kosasthalaiyar River Edge)',
    startCoords: [13.1670, 80.2612],
    endCoords: [13.2084, 80.3204],
    blockedProbability: 92,
    waterDepthCm: 85,
    status: 'BLOCKED_FLOODED',
    alternateRouteDescription: 'Industrial truck corridor shut. Emergency supply convoys rerouted via Minjur Outer bypass.'
  },
  {
    id: 'road-09',
    name: 'Mount-Poonamallee Road (Near MIOT Hospital & Manapakkam)',
    startCoords: [13.0163, 80.1834],
    endCoords: [13.0315, 80.1772],
    blockedProbability: 75,
    waterDepthCm: 50,
    status: 'EMERGENCY_ONLY',
    alternateRouteDescription: 'Restricted strictly to ambulances and military relief transports. Civilian traffic detour via Porur.'
  },
  {
    id: 'road-10',
    name: 'West Mambalam Doraisamy Subway',
    startCoords: [13.0368, 80.2223],
    endCoords: [13.0418, 80.2341],
    blockedProbability: 100,
    waterDepthCm: 130,
    status: 'BLOCKED_FLOODED',
    alternateRouteDescription: 'Inundated. Traffic routed via Usman Road Flyover to North Usman Road.'
  },
  {
    id: 'road-11',
    name: 'Poonamallee High Road (Aminjikarai Cooum Bridge)',
    startCoords: [13.0722, 80.2215],
    endCoords: [13.0610, 80.2050],
    blockedProbability: 68,
    waterDepthCm: 45,
    status: 'CONGESTED',
    alternateRouteDescription: 'Use Anna Nagar 2nd Avenue; avoid river approach slip roads.'
  },
  {
    id: 'road-12',
    name: 'ECR East Coast Road (Kottivakkam to Palavakkam)',
    startCoords: [12.9680, 80.2590],
    endCoords: [12.9554, 80.2562],
    blockedProbability: 40,
    waterDepthCm: 22,
    status: 'OPEN',
    alternateRouteDescription: 'Open with cautious speed due to coastal spray; minor water pooling on seaward shoulder.'
  },
  {
    id: 'road-13',
    name: 'Virugambakkam Arcot Road (Canal Dip)',
    startCoords: [13.0505, 80.1884],
    endCoords: [13.0400, 80.1700],
    blockedProbability: 70,
    waterDepthCm: 48,
    status: 'EMERGENCY_ONLY',
    alternateRouteDescription: 'Take Kaliamman Koil Street or Alwarthirunagar 80ft Road bypass.'
  },
  {
    id: 'road-14',
    name: 'Chintadripet Gandhi Irwin Bridge & Arunachalam St',
    startCoords: [13.0760, 80.2707],
    endCoords: [13.0785, 80.2610],
    blockedProbability: 80,
    waterDepthCm: 60,
    status: 'BLOCKED_FLOODED',
    alternateRouteDescription: 'Take EVR Periyar Salai via Central Railway Station Flyover.'
  },
  {
    id: 'road-15',
    name: 'Ennore High Road (Near Creek Bridge)',
    startCoords: [13.2084, 80.3204],
    endCoords: [13.1310, 80.2870],
    blockedProbability: 89,
    waterDepthCm: 78,
    status: 'BLOCKED_FLOODED',
    alternateRouteDescription: 'Coastal highway breached by tidal backwater. Inland detour via Tiruvottiyur High Road.'
  }
];
