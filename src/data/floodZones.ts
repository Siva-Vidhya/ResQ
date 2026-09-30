export type ZoneRiskLevel = 'SAFE' | 'PRONE' | 'DANGER';

export interface FloodProneZone {
  id: string;
  areaId: string;
  name: {
    en: string;
    ta: string;
    hi: string;
  };
  lat: number;
  lng: number;
  /** Radius in meters */
  radius: number;
  historicalFloodCount: number;
  riskLevel: ZoneRiskLevel;
  expectedTimeMin: number;
  reason: {
    en: string;
    ta: string;
    hi: string;
  };
}

export interface RainfallForecast {
  expectedMmPerHr: number;
  next3HoursMm: number;
  isHighRainfall: boolean;
  summary: {
    en: string;
    ta: string;
    hi: string;
  };
}

export interface TriggeredFloodAlert {
  id: string;
  severity: 'SAFE' | 'PRONE' | 'DANGER';
  message: {
    en: string;
    ta: string;
    hi: string;
  };
  time: string;
  timeLabel?: {
    en: string;
    ta: string;
    hi: string;
  };
  isCurrent?: boolean;
  zone: FloodProneZone;
  distanceMeters: number;
}

export const MOCK_RAINFALL_FORECAST: RainfallForecast = {
  expectedMmPerHr: 68,
  next3HoursMm: 142,
  isHighRainfall: true,
  summary: {
    en: 'Heavy rain forecast across Chennai (68 mm/hr expected over the next 2 hours).',
    ta: 'சென்னையில் அடுத்த 2 மணி நேரத்திற்கு கனமழை பெய்ய வாய்ப்புள்ளது (மணிக்கு 68 மி.மீ).',
    hi: 'अगले 2 घंटों में चेन्नई में तेज़ बारिश का अनुमान है (68 मिमी/घंटा)।',
  },
};

export const FLOOD_PRONE_ZONES: FloodProneZone[] = [
  {
    id: 'fpz-01',
    areaId: 'velachery',
    name: {
      en: 'Velachery Main Road Underpass',
      ta: 'வேளச்சேரி பிரதான சாலை சுரங்கப்பாதை',
      hi: 'वेलाचेरी मेन रोड अंडरपास',
    },
    lat: 12.9784,
    lng: 80.2184,
    radius: 850,
    historicalFloodCount: 5,
    riskLevel: 'DANGER',
    expectedTimeMin: 40,
    reason: {
      en: 'Flooded 5 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 5 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 5 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-02',
    areaId: 'velachery',
    name: {
      en: 'Vijayanagar 2nd Main Road',
      ta: 'விஜயநகர் 2வது பிரதான சாலை',
      hi: 'विजयनगर दूसरी मुख्य सड़क',
    },
    lat: 12.9756,
    lng: 80.2208,
    radius: 800,
    historicalFloodCount: 4,
    riskLevel: 'DANGER',
    expectedTimeMin: 45,
    reason: {
      en: 'Flooded 4 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 4 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 4 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-03',
    areaId: 'velachery',
    name: {
      en: 'Velachery Lake Bund Road',
      ta: 'வேளச்சேரி ஏரிக்கரை சாலை',
      hi: 'वेलाचेरी झील किनारा रोड',
    },
    lat: 12.9819,
    lng: 80.2145,
    radius: 900,
    historicalFloodCount: 5,
    riskLevel: 'DANGER',
    expectedTimeMin: 35,
    reason: {
      en: 'Flooded 5 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 5 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 5 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-04',
    areaId: 'velachery',
    name: {
      en: 'Madipakkam Ram Nagar Low Pocket',
      ta: 'மடிப்பாக்கம் ராம் நகர் தாழ்வான பகுதி',
      hi: 'मदिपक्कम राम नगर निचला इलाका',
    },
    lat: 12.9642,
    lng: 80.2089,
    radius: 950,
    historicalFloodCount: 5,
    riskLevel: 'DANGER',
    expectedTimeMin: 40,
    reason: {
      en: 'Flooded 5 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 5 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 5 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-05',
    areaId: 'velachery',
    name: {
      en: 'Pallikaranai Marshland Edge Road',
      ta: 'பள்ளிக்கரணை சதுப்புநில விளிம்புச் சாலை',
      hi: 'पल्लिकरनई मार्शलैंड किनारा रोड',
    },
    lat: 12.9488,
    lng: 80.2175,
    radius: 1000,
    historicalFloodCount: 5,
    riskLevel: 'DANGER',
    expectedTimeMin: 30,
    reason: {
      en: 'Flooded 5 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 5 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 5 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-06',
    areaId: 'tnagar',
    name: {
      en: 'Madley Subway in T. Nagar',
      ta: 'தி. நகர் மேட்லி சுரங்கப்பாதை',
      hi: 'टी. नगर मैडली सबवे',
    },
    lat: 13.0352,
    lng: 80.2305,
    radius: 750,
    historicalFloodCount: 4,
    riskLevel: 'DANGER',
    expectedTimeMin: 45,
    reason: {
      en: 'Flooded 4 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 4 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 4 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-07',
    areaId: 'tnagar',
    name: {
      en: 'South Usman Road Low Stretch',
      ta: 'தெற்கு உஸ்மான் தாழ்வான சாலை',
      hi: 'साउथ उस्मान रोड निचला हिस्सा',
    },
    lat: 13.0389,
    lng: 80.2337,
    radius: 700,
    historicalFloodCount: 3,
    riskLevel: 'PRONE',
    expectedTimeMin: 70,
    reason: {
      en: 'Flooded 3 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 3 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 3 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-08',
    areaId: 'tnagar',
    name: {
      en: 'Bazullah Road Junction',
      ta: 'பசுல்லா சாலை சந்திப்பு',
      hi: 'बज़ुल्लाह रोड चौराहा',
    },
    lat: 13.0468,
    lng: 80.2342,
    radius: 650,
    historicalFloodCount: 3,
    riskLevel: 'PRONE',
    expectedTimeMin: 75,
    reason: {
      en: 'Flooded 3 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 3 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 3 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-09',
    areaId: 'tnagar',
    name: {
      en: 'Habibullah Road Canal Pocket',
      ta: 'ஹபிபுல்லா சாலை கால்வாய் பகுதி',
      hi: 'हबीबुल्लाह रोड नाला क्षेत्र',
    },
    lat: 13.0491,
    lng: 80.2398,
    radius: 680,
    historicalFloodCount: 3,
    riskLevel: 'PRONE',
    expectedTimeMin: 80,
    reason: {
      en: 'Flooded 3 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 3 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 3 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-10',
    areaId: 'adyar',
    name: {
      en: 'Kotturpuram Low River Bridge',
      ta: 'கோட்டூர்புரம் தாழ்வான ஆற்றுப் பாலம்',
      hi: 'कोट्टूरपुरम निचला नदी पुल',
    },
    lat: 13.0168,
    lng: 80.2422,
    radius: 850,
    historicalFloodCount: 4,
    riskLevel: 'DANGER',
    expectedTimeMin: 40,
    reason: {
      en: 'Flooded 4 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 4 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 4 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-11',
    areaId: 'adyar',
    name: {
      en: 'River View Road in Kotturpuram',
      ta: 'கோட்டூர்புரம் ரிவர் வியூ சாலை',
      hi: 'कोट्टूरपुरम रिवर व्यू रोड',
    },
    lat: 13.0145,
    lng: 80.2465,
    radius: 800,
    historicalFloodCount: 4,
    riskLevel: 'DANGER',
    expectedTimeMin: 45,
    reason: {
      en: 'Flooded 4 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 4 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 4 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-12',
    areaId: 'adyar',
    name: {
      en: 'Saidapet Maraimalai Adigal Bridge Bank',
      ta: 'சைதாப்பேட்டை மறைமலை அடிகள் பாலக் கரை',
      hi: 'सैदापेट नदी पुल किनारा',
    },
    lat: 13.0213,
    lng: 80.2231,
    radius: 900,
    historicalFloodCount: 5,
    riskLevel: 'DANGER',
    expectedTimeMin: 35,
    reason: {
      en: 'Flooded 5 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 5 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 5 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-13',
    areaId: 'adyar',
    name: {
      en: 'Jafferkhanpet Low River Bend',
      ta: 'ஜாபர்கான்பேட்டை ஆற்று வளைவுப் பகுதி',
      hi: 'जाफरखानपेट नदी मोड़ क्षेत्र',
    },
    lat: 13.0264,
    lng: 80.2067,
    radius: 850,
    historicalFloodCount: 4,
    riskLevel: 'DANGER',
    expectedTimeMin: 50,
    reason: {
      en: 'Flooded 4 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 4 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 4 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-14',
    areaId: 'mylapore',
    name: {
      en: 'Canal Bank Road in Mandaveli',
      ta: 'மந்தைவெளி கால்வாய் கரை சாலை',
      hi: 'मंदावेली कैनाल बैंक रोड',
    },
    lat: 13.0268,
    lng: 80.2614,
    radius: 750,
    historicalFloodCount: 3,
    riskLevel: 'PRONE',
    expectedTimeMin: 65,
    reason: {
      en: 'Flooded 3 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 3 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 3 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-15',
    areaId: 'mylapore',
    name: {
      en: 'Luz Corner Low Street Stretch',
      ta: 'லஸ் கார்னர் தாழ்வான தெரு',
      hi: 'लज़ कॉर्नर निचली गली',
    },
    lat: 13.0332,
    lng: 80.2668,
    radius: 650,
    historicalFloodCount: 2,
    riskLevel: 'PRONE',
    expectedTimeMin: 90,
    reason: {
      en: 'Flooded 2 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 2 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 2 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-16',
    areaId: 'mylapore',
    name: {
      en: 'Chintadripet Cooum Loop Road',
      ta: 'சிந்தாதிரிப்பேட்டை கூவம் வளைவுச் சாலை',
      hi: 'चिंताद्रीपेट कूवम लूप रोड',
    },
    lat: 13.0738,
    lng: 80.2704,
    radius: 800,
    historicalFloodCount: 4,
    riskLevel: 'DANGER',
    expectedTimeMin: 55,
    reason: {
      en: 'Flooded 4 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 4 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 4 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-17',
    areaId: 'mylapore',
    name: {
      en: 'Ganesapuram Subway in Vyasarpadi',
      ta: 'வியாசர்பாடி கணேசபுரம் சுரங்கப்பாதை',
      hi: 'व्यासरपाडी गणेशापुरम सबवे',
    },
    lat: 13.1145,
    lng: 80.2618,
    radius: 850,
    historicalFloodCount: 5,
    riskLevel: 'DANGER',
    expectedTimeMin: 40,
    reason: {
      en: 'Flooded 5 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 5 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 5 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-18',
    areaId: 'tambaram',
    name: {
      en: 'Mudichur Road Low Basin',
      ta: 'முடிச்சூர் சாலை தாழ்வான பகுதி',
      hi: 'मुदिचूर रोड निचला क्षेत्र',
    },
    lat: 12.9192,
    lng: 80.0956,
    radius: 1000,
    historicalFloodCount: 5,
    riskLevel: 'DANGER',
    expectedTimeMin: 35,
    reason: {
      en: 'Flooded 5 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 5 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 5 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-19',
    areaId: 'tambaram',
    name: {
      en: 'West Tambaram CTO Colony',
      ta: 'மேற்கு தாம்பரம் சி.டி.ஓ காலனி',
      hi: 'वेस्ट तांबरम सीटीओ कॉलोनी',
    },
    lat: 12.9284,
    lng: 80.1072,
    radius: 900,
    historicalFloodCount: 4,
    riskLevel: 'DANGER',
    expectedTimeMin: 45,
    reason: {
      en: 'Flooded 4 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 4 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 4 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-20',
    areaId: 'tambaram',
    name: {
      en: 'Perungalathur Lake Channel Road',
      ta: 'பெருங்களத்தூர் ஏரி கால்வாய் சாலை',
      hi: 'पेरुंगलथुर झील नहर रोड',
    },
    lat: 12.9052,
    lng: 80.0889,
    radius: 950,
    historicalFloodCount: 4,
    riskLevel: 'DANGER',
    expectedTimeMin: 50,
    reason: {
      en: 'Flooded 4 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 4 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 4 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-21',
    areaId: 'tambaram',
    name: {
      en: 'Chromepet MIT Subway',
      ta: 'குரோம்பேட்டை எம்.ஐ.டி சுரங்கப்பாதை',
      hi: 'क्रोमपेट एमआईटी सबवे',
    },
    lat: 12.9516,
    lng: 80.1412,
    radius: 750,
    historicalFloodCount: 3,
    riskLevel: 'PRONE',
    expectedTimeMin: 65,
    reason: {
      en: 'Flooded 3 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 3 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 3 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-22',
    areaId: 'tambaram',
    name: {
      en: 'Pallavaram Thoraipakkam Radial Low Dip',
      ta: 'பல்லாவரம் துரைப்பாக்கம் ரேடியல் சாலை பள்ளம்',
      hi: 'पल्लावरम थोराईपक्कम रेडियल रोड ढलान',
    },
    lat: 12.9585,
    lng: 80.1845,
    radius: 850,
    historicalFloodCount: 4,
    riskLevel: 'PRONE',
    expectedTimeMin: 60,
    reason: {
      en: 'Flooded 4 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 4 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 4 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-23',
    areaId: 'annanagar',
    name: {
      en: 'Arumbakkam Cooum Bank Street',
      ta: 'அரும்பாக்கம் கூவம் கரைத் தெரு',
      hi: 'अरुम्बक्कम कूवम किनारा गली',
    },
    lat: 13.0724,
    lng: 80.2102,
    radius: 750,
    historicalFloodCount: 3,
    riskLevel: 'PRONE',
    expectedTimeMin: 80,
    reason: {
      en: 'Flooded 3 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 3 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 3 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-24',
    areaId: 'annanagar',
    name: {
      en: 'Kolathur Retteri Lake Bund',
      ta: 'கொளத்தூர் இரட்டேரி ஏரிக்கரை',
      hi: 'कोलाथुर रेट्टेरी झील किनारा',
    },
    lat: 13.1242,
    lng: 80.2128,
    radius: 850,
    historicalFloodCount: 4,
    riskLevel: 'PRONE',
    expectedTimeMin: 75,
    reason: {
      en: 'Flooded 4 times in the last 5 years',
      ta: 'கடந்த 5 ஆண்டுகளில் 4 முறை வெள்ளம் தேங்கியது',
      hi: 'पिछले 5 वर्षों में 4 बार पानी भरा है',
    },
  },
  {
    id: 'fpz-25',
    areaId: 'annanagar',
    name: {
      en: 'Anna Nagar 2nd Avenue High Ground',
      ta: 'அண்ணா நகர் 2வது நிழற்சாலை மேடான பகுதி',
      hi: 'अन्ना नगर सेकंड एवेन्यू ऊँचा इलाका',
    },
    lat: 13.085,
    lng: 80.2101,
    radius: 700,
    historicalFloodCount: 0,
    riskLevel: 'SAFE',
    expectedTimeMin: 240,
    reason: {
      en: 'Stayed dry in the last 5 years due to high elevation',
      ta: 'உயரமான அமைப்பால் கடந்த 5 ஆண்டுகளில் வெள்ளம் தேங்கவில்லை',
      hi: 'ऊँचाई के कारण पिछले 5 वर्षों में यहाँ पानी नहीं भरा',
    },
  },
];

/**
 * Haversine distance in meters between two lat/lng points
 */
export function getDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Mock prediction function:
 * When the user is within a zone's radius AND rainfall forecast is high,
 * produce an alert object (severity, message, time, zone).
 */
export function predictNearbyFloodAlert(
  userLat: number,
  userLng: number,
  zones: FloodProneZone[] = FLOOD_PRONE_ZONES,
  rainfall: RainfallForecast = MOCK_RAINFALL_FORECAST
): TriggeredFloodAlert | null {
  if (!rainfall.isHighRainfall) return null;

  let closestMatch: { zone: FloodProneZone; distance: number } | null = null;

  for (const zone of zones) {
    if (zone.riskLevel === 'SAFE') continue;
    const distance = getDistanceMeters(userLat, userLng, zone.lat, zone.lng);
    if (distance <= zone.radius) {
      if (!closestMatch || distance < closestMatch.distance) {
        closestMatch = { zone, distance };
      }
    }
  }

  if (!closestMatch) return null;

  const { zone, distance } = closestMatch;
  const severity: 'PRONE' | 'DANGER' =
    zone.riskLevel === 'DANGER' ? 'DANGER' : 'PRONE';

  const nowStr = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const message =
    severity === 'DANGER'
      ? {
          en: `Flood danger near ${zone.name.en}: water may collect on low streets in about ${zone.expectedTimeMin} minutes (${zone.reason.en.toLowerCase()}).`,
          ta: `${zone.name.ta} அருகே வெள்ள ஆபத்து: சுமார் ${zone.expectedTimeMin} நிமிடங்களில் தாழ்வான தெருக்களில் நீர் தேங்கலாம் (${zone.reason.ta}).`,
          hi: `${zone.name.hi} के पास बाढ़ का खतरा: लगभग ${zone.expectedTimeMin} मिनट में निचली सड़कों पर पानी भर सकता है (${zone.reason.hi})।`,
        }
      : {
          en: `Be ready near ${zone.name.en}: water may collect in about ${zone.expectedTimeMin} minutes (${zone.reason.en.toLowerCase()}).`,
          ta: `${zone.name.ta} அருகே தயாராக இருங்கள்: சுமார் ${zone.expectedTimeMin} நிமிடங்களில் நீர் தேங்க வாய்ப்புள்ளது (${zone.reason.ta}).`,
          hi: `${zone.name.hi} के पास तैयार रहें: लगभग ${zone.expectedTimeMin} मिनट में पानी जमा हो सकता है (${zone.reason.hi})।`,
        };

  return {
    id: `alert-${zone.id}-${Date.now()}`,
    severity,
    message,
    time: nowStr,
    timeLabel: {
      en: `Just now (${nowStr})`,
      ta: `இப்போது (${nowStr})`,
      hi: `अभी (${nowStr})`,
    },
    isCurrent: true,
    zone,
    distanceMeters: distance,
  };
}
