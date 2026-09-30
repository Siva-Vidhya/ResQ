export interface RoadNode {
  id: string;
  name: {
    en: string;
    ta: string;
    hi: string;
  };
  lat: number;
  lng: number;
  isSelectablePlace?: boolean;
}

export type RiskGrade = 'clear' | 'low' | 'prone' | 'flooded';

export function getRiskGradeInfo(floodRiskRatio: number): {
  grade: RiskGrade;
  color: string;
  percent: number;
  labelKey: 'gradeClear' | 'gradeLow' | 'gradeProne' | 'gradeFlooded';
} {
  const percent = Math.min(100, Math.max(0, Math.round(floodRiskRatio * 100)));
  if (percent <= 25) {
    return { grade: 'clear', color: '#22C55E', percent, labelKey: 'gradeClear' };
  }
  if (percent <= 50) {
    return { grade: 'low', color: '#FACC15', percent, labelKey: 'gradeLow' };
  }
  if (percent <= 75) {
    return { grade: 'prone', color: '#F97316', percent, labelKey: 'gradeProne' };
  }
  return { grade: 'flooded', color: '#EF4444', percent, labelKey: 'gradeFlooded' };
}

export interface MicroRoadSegment {
  id: string;
  streetName: { en: string; ta: string; hi: string };
  coordinates: [number, number][]; // [lng, lat][] 2 to 4 points
  floodRisk: number; // 0.0 to 1.0
  travelTimeMin: number;
  distanceKm: number;
  reason: { en: string; ta: string; hi: string };
  instruction?: { en: string; ta: string; hi: string };
}

export interface RouteSafetyBreakdown {
  clearShare: number; // 0-100%
  lowShare: number;
  proneShare: number;
  floodedShare: number;
  summaryText: { en: string; ta: string; hi: string };
}

export interface RoadEdge {
  id: string;
  from: string;
  to: string;
  streetName: {
    en: string;
    ta: string;
    hi: string;
  };
  travelTimeMin: number;
  distanceKm: number;
  floodRisk: number;
  avoidReason?: {
    en: string;
    ta: string;
    hi: string;
  };
  instruction: {
    en: string;
    ta: string;
    hi: string;
  };
  waypoints?: [number, number][];
}

export interface RouteStep {
  edgeId: string;
  streetName: { en: string; ta: string; hi: string };
  instruction: { en: string; ta: string; hi: string };
  travelTimeMin: number;
  distanceKm: number;
  floodRisk: number;
  avoidedWarning?: {
    streetName: { en: string; ta: string; hi: string };
    reason: { en: string; ta: string; hi: string };
    lat: number;
    lng: number;
  };
}

export interface ComputedRouteResult {
  nodes: RoadNode[];
  edges: RoadEdge[];
  segments: MicroRoadSegment[];
  coordinates: [number, number][]; // complete continuous polyline
  totalTimeMin: number;
  totalDistanceKm: number;
  floodProneStreetsCount: number;
  safetyBreakdown: RouteSafetyBreakdown;
  worstSegment?: MicroRoadSegment;
  safestBypassSegment?: MicroRoadSegment;
  steps: RouteStep[];
  avoidedEdges: {
    edge: RoadEdge;
    midpoint: [number, number];
  }[];
}

export interface DualRouteComparison {
  safest: ComputedRouteResult;
  shortest: ComputedRouteResult;
}

export const CHENNAI_ROAD_NODES: Record<string, RoadNode> = {
  velachery: {
    id: 'velachery',
    name: {
      en: 'My Location (Velachery)',
      ta: 'என் இடம் (வேளச்சேரி)',
      hi: 'मेरा स्थान (वेलाचेरी)',
    },
    lat: 12.9756,
    lng: 80.2208,
    isSelectablePlace: true,
  },
  guindy: {
    id: 'guindy',
    name: {
      en: 'Guindy',
      ta: 'கிண்டி',
      hi: 'गिंडी',
    },
    lat: 13.0067,
    lng: 80.2206,
    isSelectablePlace: true,
  },
  tnagar: {
    id: 'tnagar',
    name: {
      en: 'T. Nagar',
      ta: 'தி. நகர்',
      hi: 'टी. नगर',
    },
    lat: 13.0418,
    lng: 80.2341,
    isSelectablePlace: true,
  },
  adyar: {
    id: 'adyar',
    name: {
      en: 'Adyar',
      ta: 'அடையாறு',
      hi: 'अड्यार',
    },
    lat: 13.0063,
    lng: 80.2574,
    isSelectablePlace: true,
  },
  tambaram: {
    id: 'tambaram',
    name: {
      en: 'Tambaram',
      ta: 'தாம்பரம்',
      hi: 'तांबरम',
    },
    lat: 12.9249,
    lng: 80.1275,
    isSelectablePlace: true,
  },
  central: {
    id: 'central',
    name: {
      en: 'Chennai Central',
      ta: 'சென்னை சென்ட்ரல்',
      hi: 'चेन्नई सेंट्रल',
    },
    lat: 13.0827,
    lng: 80.2707,
    isSelectablePlace: true,
  },
  mylapore: {
    id: 'mylapore',
    name: {
      en: 'Mylapore',
      ta: 'மயிலாப்பூர்',
      hi: 'मायलापुर',
    },
    lat: 13.0339,
    lng: 80.2676,
    isSelectablePlace: true,
  },
  annanagar: {
    id: 'annanagar',
    name: {
      en: 'Anna Nagar',
      ta: 'அண்ணா நகர்',
      hi: 'अन्ना नगर',
    },
    lat: 13.085,
    lng: 80.2101,
    isSelectablePlace: true,
  },
};

export const SAMPLE_TRIP_PRESETS = [
  {
    id: 'velachery-guindy',
    fromId: 'velachery',
    toId: 'guindy',
    label: {
      en: 'Velachery → Guindy',
      ta: 'வேளச்சேரி → கிண்டி',
      hi: 'वेलाचेरी → गिंडी',
    },
  },
  {
    id: 'tnagar-adyar',
    fromId: 'tnagar',
    toId: 'adyar',
    label: {
      en: 'T. Nagar → Adyar',
      ta: 'தி. நகர் → அடையாறு',
      hi: 'टी. नगर → अड्यार',
    },
  },
  {
    id: 'tambaram-central',
    fromId: 'tambaram',
    toId: 'central',
    label: {
      en: 'Tambaram → Central',
      ta: 'தாம்பரம் → சென்ட்ரல்',
      hi: 'तांबरम → सेंट्रल',
    },
  },
];

// Helper to calculate safety breakdown from a set of segments
function calculateSafetyBreakdown(segments: MicroRoadSegment[]): RouteSafetyBreakdown {
  const totalKm = segments.reduce((acc, s) => acc + s.distanceKm, 0) || 1;
  let clearKm = 0;
  let lowKm = 0;
  let proneKm = 0;
  let floodedKm = 0;

  segments.forEach((s) => {
    const p = Math.round(s.floodRisk * 100);
    if (p <= 25) clearKm += s.distanceKm;
    else if (p <= 50) lowKm += s.distanceKm;
    else if (p <= 75) proneKm += s.distanceKm;
    else floodedKm += s.distanceKm;
  });

  const clearShare = Math.round((clearKm / totalKm) * 100);
  const lowShare = Math.round((lowKm / totalKm) * 100);
  const proneShare = Math.round((proneKm / totalKm) * 100);
  let floodedShare = 100 - (clearShare + lowShare + proneShare);
  if (floodedShare < 0) floodedShare = 0;

  // Build clean localized summary string e.g. "72% clear, 18% low risk, 10% flood-prone"
  const enParts: string[] = [];
  const taParts: string[] = [];
  const hiParts: string[] = [];

  if (clearShare > 0) {
    enParts.push(`${clearShare}% clear`);
    taParts.push(`${clearShare}% பாதுகாப்பு`);
    hiParts.push(`${clearShare}% साफ़`);
  }
  if (lowShare > 0) {
    enParts.push(`${lowShare}% low risk`);
    taParts.push(`${lowShare}% குறைந்த ஆபத்து`);
    hiParts.push(`${lowShare}% कम जोखिम`);
  }
  if (proneShare > 0) {
    enParts.push(`${proneShare}% flood-prone`);
    taParts.push(`${proneShare}% வெள்ள வாய்ப்பு`);
    hiParts.push(`${proneShare}% जलभराव संभावित`);
  }
  if (floodedShare > 0) {
    enParts.push(`${floodedShare}% likely flooded`);
    taParts.push(`${floodedShare}% வெள்ள ஆபத்து`);
    hiParts.push(`${floodedShare}% बाढ़ संभावित`);
  }

  return {
    clearShare,
    lowShare,
    proneShare,
    floodedShare,
    summaryText: {
      en: enParts.join(', ') || '100% clear',
      ta: taParts.join(', ') || '100% பாதுகாப்பு',
      hi: hiParts.join(', ') || '100% साफ़',
    },
  };
}

// --- PRE-BUILT 16-18 MICRO-SEGMENTS FOR THE 3 FLAGSHIP SAMPLE TRIPS ---

// Trip 1: Velachery <-> Guindy
const TRIP_1_SHORTEST_SEGMENTS: MicroRoadSegment[] = [
  {
    id: 'vg-s-1',
    streetName: { en: 'Velachery Terminus Junction', ta: 'வேளச்சேரி சந்திப்பு', hi: 'वेलाचेरी जंक्शन' },
    coordinates: [[80.2208, 12.9756], [80.2207, 12.9770]],
    floodRisk: 0.12,
    travelTimeMin: 1.2,
    distanceKm: 0.18,
    reason: { en: 'Terminus high pavement, dry and clear', ta: 'மேடான பேருந்து நிலையம், பாதுகாப்பானது', hi: 'ऊँचा बस स्टैंड, सूखा और साफ़' },
    instruction: { en: 'Head north on Velachery Main Road', ta: 'வேளச்சேரி பிரதான சாலையில் வடக்கே செல்லவும்', hi: 'वेलाचेरी मेन रोड पर उत्तर जाएँ' },
  },
  {
    id: 'vg-s-2',
    streetName: { en: 'Dhandeeswaram Corner', ta: 'தண்டீஸ்வரம் முனை', hi: 'दंडेश्वरम कॉर्नर' },
    coordinates: [[80.2207, 12.9770], [80.2205, 12.9788]],
    floodRisk: 0.20,
    travelTimeMin: 1.1,
    distanceKm: 0.20,
    reason: { en: 'Normal road level, minor drizzle drainage', ta: 'இயல்பான சாலை மட்டம்', hi: 'सामान्य सड़क स्तर' },
    instruction: { en: 'Continue past Dhandeeswaram temple', ta: 'தண்டீஸ்வரம் கோயில் கடந்து தொடரவும்', hi: 'दंडेश्वरम मंदिर पार करें' },
  },
  {
    id: 'vg-s-3',
    streetName: { en: 'Phoenix Marketcity Approach', ta: 'பீனிக்ஸ் அணுகுசாலை', hi: 'फीनिक्स मॉल पहुँच मार्ग' },
    coordinates: [[80.2205, 12.9788], [80.2203, 12.9805]],
    floodRisk: 0.32,
    travelTimeMin: 1.3,
    distanceKm: 0.22,
    reason: { en: 'Slight road depression, slow storm drain', ta: 'சிறிய பள்ளம், வடிகால் மெதுவாக இயங்குகிறது', hi: 'हल्का गड्ढा, धीमा ड्रेनेज' },
    instruction: { en: 'Pass Phoenix Marketcity entrance', ta: 'பீனிக்ஸ் நுழைவாயிலைக் கடக்கவும்', hi: 'फीनिक्स प्रवेश द्वार पार करें' },
  },
  {
    id: 'vg-s-4',
    streetName: { en: 'Velachery Lake South Basin Dip', ta: 'வேளச்சேரி ஏரி தெற்கு பள்ளம்', hi: 'वेलाचेरी झील निचला भाग' },
    coordinates: [[80.2203, 12.9805], [80.2201, 12.9822]],
    floodRisk: 0.46,
    travelTimeMin: 1.4,
    distanceKm: 0.21,
    reason: { en: 'Low-lying road parallel to lake bund', ta: 'ஏரிக்கரை அருகே தாழ்வான சாலை', hi: 'झील के पास निचली सड़क' },
    instruction: { en: 'Proceed carefully through lake curve', ta: 'ஏரி வளைவில் கவனமாகச் செல்லவும்', hi: 'झील के मोड़ पर सावधानी से बढ़ें' },
  },
  {
    id: 'vg-s-5',
    streetName: { en: 'Velachery Main Road North Basin', ta: 'வேளச்சேரி பிரதான சாலை பள்ளம்', hi: 'वेलाचेरी मेन रोड निचला इलाका' },
    coordinates: [[80.2201, 12.9822], [80.2198, 12.9840]],
    floodRisk: 0.62,
    travelTimeMin: 1.6,
    distanceKm: 0.22,
    reason: { en: 'Flood-prone pocket: flooded 3 times in 4 years', ta: 'நீர் தேங்கும் பகுதி: 4 ஆண்டுகளில் 3 முறை வெள்ளம்', hi: 'जलभराव संभावित: 4 साल में 3 बार बाढ़' },
    instruction: { en: 'Watch for pooling water on the left lane', ta: 'இடது புறம் நீர் தேங்குவதைக் கவனிக்கவும்', hi: 'बाईं ओर पानी भराव से बचें' },
  },
  {
    id: 'vg-s-6',
    streetName: { en: 'Guru Nanak College Gate', ta: 'குருநானக் கல்லூரி வாயில்', hi: 'गुरु नानक कॉलेज गेट' },
    coordinates: [[80.2198, 12.9840], [80.2198, 12.9858]],
    floodRisk: 0.70,
    travelTimeMin: 1.5,
    distanceKm: 0.20,
    reason: { en: 'High waterlogging reported after 30 min of rain', ta: '30 நிமிடம் மழையிலேயே நீர் தேங்கும் பகுதி', hi: '30 मिनट बारिश में पानी भरने लगता है' },
    instruction: { en: 'Continue past Guru Nanak College', ta: 'கல்லூரியைத் தாண்டிச் செல்லவும்', hi: 'कॉलेज गेट पार करें' },
  },
  {
    id: 'vg-s-7',
    streetName: { en: 'Velachery Checkpost Low Junction', ta: 'வேளச்சேரி செக்போஸ்ட் தாழ்வான சந்திப்பு', hi: 'वेलाचेरी चेकपोस्ट निचला जंक्शन' },
    coordinates: [[80.2198, 12.9858], [80.2200, 12.9872]],
    floodRisk: 0.82,
    travelTimeMin: 1.8,
    distanceKm: 0.17,
    reason: { en: 'Water rising: low road with blocked storm runoff', ta: 'வடிகால் அடைப்பால் நீர்மட்டம் உயர்கிறது', hi: 'ड्रेनेज रुकावट से पानी बढ़ रहा है' },
    instruction: { en: 'Approach underpass intersection', ta: 'சுரங்கப்பாதை சந்திப்பை அணுகவும்', hi: 'अंडरपास चौराहे की ओर बढ़ें' },
  },
  {
    id: 'vg-s-8',
    streetName: { en: 'Velachery Railway Underpass Dip', ta: 'வேளச்சேரி ரயில்வே சுரங்கப்பாதை பள்ளம்', hi: 'वेलाचेरी रेलवे अंडरपास निचला गड्ढा' },
    coordinates: [[80.2200, 12.9872], [80.2202, 12.9885]],
    floodRisk: 0.94,
    travelTimeMin: 2.2,
    distanceKm: 0.16,
    reason: { en: 'Severely flooded: 3-4 feet water accumulation during storms', ta: 'கடுமையான வெள்ளம்: 3-4 அடி நீர் தேங்கும் ஆபத்து', hi: 'गंभीर बाढ़: 3-4 फीट पानी भर जाता है' },
    instruction: { en: 'Pass through the flooded subway dip', ta: 'வெள்ளம் சூழ்ந்த சுரங்கப்பாதையைக் கடக்கவும்', hi: 'जलभराव वाले अंडरपास से गुजरें' },
  },
  {
    id: 'vg-s-9',
    streetName: { en: 'Five Furlong Low Road Entry', ta: 'ஃபைவ் ஃபர்லாங் நுழைவு சாலை', hi: 'फाइव फर्लांग प्रवेश सड़क' },
    coordinates: [[80.2202, 12.9885], [80.2188, 12.9905]],
    floodRisk: 0.88,
    travelTimeMin: 1.8,
    distanceKm: 0.25,
    reason: { en: 'Sunken causeway overflowing from canal overflow', ta: 'கால்வாய் நீர் பெருக்கெடுத்து சாலை மூழ்கும் ஆபத்து', hi: 'नहर का पानी सड़क पर बहने का खतरा' },
    instruction: { en: 'Turn onto Five Furlong Road', ta: 'ஃபைவ் ஃபர்லாங் சாலையில் திரும்பவும்', hi: 'फाइव फर्लांग रोड पर मुड़ें' },
  },
  {
    id: 'vg-s-10',
    streetName: { en: 'Race Course Canal Low Causeway', ta: 'ரேஸ் கோர்ஸ் கால்வாய் கரை சாலை', hi: 'रेस कोर्स नहर निचला किनारा' },
    coordinates: [[80.2188, 12.9905], [80.2173, 12.9926]],
    floodRisk: 0.78,
    travelTimeMin: 1.7,
    distanceKm: 0.26,
    reason: { en: 'Open storm ditch overflow hazard', ta: 'திறந்த வடிகால் கால்வாய் நிரம்பி வழியும் ஆபத்து', hi: 'खुली नहर का पानी सड़क पर आना' },
    instruction: { en: 'Follow along canal boundary wall', ta: 'கால்வாய் சுவரோரம் செல்லவும்', hi: 'नहर की दीवार के साथ चलें' },
  },
  {
    id: 'vg-s-11',
    streetName: { en: 'Race Course West Sunken Basin', ta: 'ரேஸ் கோர்ஸ் மேற்கு பள்ளம்', hi: 'रेस कोर्स पश्चिमी निचला इलाका' },
    coordinates: [[80.2173, 12.9926], [80.2168, 12.9945]],
    floodRisk: 0.68,
    travelTimeMin: 1.5,
    distanceKm: 0.22,
    reason: { en: 'Poor drainage pocket near Guindy racecourse', ta: 'கிண்டி ரேஸ் கோர்ஸ் அருகே வடிகால் குறைபாடு', hi: 'गिंडी रेसकोर्स के पास जलभराव' },
    instruction: { en: 'Curve past racecourse western boundary', ta: 'ரேஸ் கோர்ஸ் மேற்கு வளைவில் செல்லவும்', hi: 'रेसकोर्स के पश्चिमी मोड़ पर बढ़ें' },
  },
  {
    id: 'vg-s-12',
    streetName: { en: 'Race Course North Bend', ta: 'ரேஸ் கோர்ஸ் வடக்கு வளைவு', hi: 'रेस कोर्स उत्तरी मोड़' },
    coordinates: [[80.2168, 12.9945], [80.2180, 12.9962]],
    floodRisk: 0.55,
    travelTimeMin: 1.4,
    distanceKm: 0.23,
    reason: { en: 'Moderate waterlogging during continuous rainfall', ta: 'தொடர் மழையில் மிதமான நீர் தேக்கம்', hi: 'लगातार बारिश में मध्यम जलभराव' },
    instruction: { en: 'Turn toward Guindy station feeder road', ta: 'கிண்டி ரயில் நிலைய இணைப்புச் சாலையில் திரும்பவும்', hi: 'गिंडी स्टेशन रोड की ओर मुड़ें' },
  },
  {
    id: 'vg-s-13',
    streetName: { en: 'Guindy Race Course North Gate', ta: 'ரேஸ் கோர்ஸ் வடக்கு வாயில்', hi: 'रेस कोर्स उत्तरी गेट' },
    coordinates: [[80.2180, 12.9962], [80.2205, 12.9975]],
    floodRisk: 0.45,
    travelTimeMin: 1.3,
    distanceKm: 0.30,
    reason: { en: 'Low-risk segment, gradual slope away from canal', ta: 'கால்வாயிலிருந்து சற்றே மேடான பகுதி', hi: 'नहर से थोड़ा ऊँचा सुरक्षित भाग' },
    instruction: { en: 'Follow north gate approach', ta: 'வடக்கு வாயில் அணுகுசாலையில் செல்லவும்', hi: 'उत्तरी गेट की ओर बढ़ें' },
  },
  {
    id: 'vg-s-14',
    streetName: { en: 'Guindy Station Approach Road', ta: 'கிண்டி ரயில் நிலைய அணுகுசாலை', hi: 'गिंडी स्टेशन पहुँच मार्ग' },
    coordinates: [[80.2205, 12.9975], [80.2215, 13.0005]],
    floodRisk: 0.34,
    travelTimeMin: 1.2,
    distanceKm: 0.35,
    reason: { en: 'Adequate storm runoff channels near station', ta: 'நிலைய வடிகால்கள் செயல்படுகின்றன', hi: 'स्टेशन के पास ड्रेनेज काम कर रहा है' },
    instruction: { en: 'Pass Guindy railway station east entrance', ta: 'கிண்டி ரயில் நிலையம் கிழக்கு வழியைக் கடக்கவும்', hi: 'गिंडी स्टेशन ईस्ट गेट पार करें' },
  },
  {
    id: 'vg-s-15',
    streetName: { en: 'Guindy Industrial Estate South', ta: 'கிண்டி தொழிற்பேட்டை தெற்கு', hi: 'गिंडी औद्योगिक क्षेत्र दक्षिण' },
    coordinates: [[80.2215, 13.0005], [80.2218, 13.0035]],
    floodRisk: 0.25,
    travelTimeMin: 1.1,
    distanceKm: 0.34,
    reason: { en: 'Industrial elevated pavement, clean runoff', ta: 'மேடான தொழிற்பேட்டை தரைப்பகுதி', hi: 'ऊँचा पक्का रास्ता, साफ़' },
    instruction: { en: 'Continue toward Kathipara ramp junction', ta: 'கத்திப்பாரா சந்திப்பு நோக்கித் தொடரவும்', hi: 'कातिपारा जंक्शन की ओर बढ़ें' },
  },
  {
    id: 'vg-s-16',
    streetName: { en: 'Guindy Junction Terminal', ta: 'கிண்டி சந்திப்பு முனையம்', hi: 'गिंडी जंक्शन टर्मिनल' },
    coordinates: [[80.2218, 13.0035], [80.2206, 13.0067]],
    floodRisk: 0.16,
    travelTimeMin: 1.0,
    distanceKm: 0.36,
    reason: { en: 'Main junction high ground, fully clear', ta: 'மேடான சந்திப்பு, பாதுகாப்பானது', hi: 'ऊँचा मुख्य चौराहा, पूरी तरह साफ़' },
    instruction: { en: 'Arrive at Guindy junction safely', ta: 'கிண்டியைப் பாதுகாப்பாக அடையவும்', hi: 'गिंडी जंक्शन सुरक्षित पहुँचें' },
  },
];

const TRIP_1_SAFEST_SEGMENTS: MicroRoadSegment[] = [
  {
    id: 'vg-safe-1',
    streetName: { en: 'Velachery Bypass South', ta: 'வேளச்சேரி புறவழிச்சாலை தெற்கு', hi: 'वेलाचेरी बाईपास दक्षिण' },
    coordinates: [[80.2208, 12.9756], [80.2222, 12.9764]],
    floodRisk: 0.08,
    travelTimeMin: 1.1,
    distanceKm: 0.20,
    reason: { en: 'Wide elevated arterial bypass', ta: 'அகலமான மேடான புறவழிச்சாலை', hi: 'चौड़ा ऊँचा बाईपास' },
    instruction: { en: 'Turn right toward Vijayanagar flyover ramp', ta: 'விஜயநகர் மேம்பால அணுகுசாலையில் திரும்பவும்', hi: 'विजयनगर फ्लाईओवर रैंप की ओर मुड़ें' },
  },
  {
    id: 'vg-safe-2',
    streetName: { en: 'Vijayanagar Flyover South Ascend', ta: 'விஜயநகர் மேம்பாலம் தெற்கு ஏறுமுகம்', hi: 'विजयनगर फ्लाईओवर दक्षिण चढ़ाव' },
    coordinates: [[80.2222, 12.9764], [80.2245, 12.9777]],
    floodRisk: 0.05,
    travelTimeMin: 1.2,
    distanceKm: 0.28,
    reason: { en: 'Ascending high elevated flyover structure', ta: 'மேம்பாலத்தில் மேலேறும் பகுதி', hi: 'ऊँचे फ्लाईओवर पर चढ़ाई' },
    instruction: { en: 'Ascend Vijayanagar High Flyover', ta: 'விஜயநகர் மேம்பாலத்தில் ஏறவும்', hi: 'विजयनगर फ्लाईओवर पर चढ़ें' },
  },
  {
    id: 'vg-safe-3',
    streetName: { en: 'Vijayanagar Flyover Deck', ta: 'விஜயநகர் மேம்பால உச்சிப் பாதை', hi: 'विजयनगर फ्लाईओवर मुख्य डेक' },
    coordinates: [[80.2245, 12.9777], [80.2275, 12.9798]],
    floodRisk: 0.02,
    travelTimeMin: 1.4,
    distanceKm: 0.38,
    reason: { en: 'Elevated 20ft flyover deck: 100% dry and safe above flood waters', ta: '20 அடி உயர மேம்பாலம்: 100% பாதுகாப்பானது', hi: '20 फीट ऊँचा फ्लाईओवर: 100% सूखा और सुरक्षित' },
    instruction: { en: 'Cruise across flyover deck high above Velachery basin', ta: 'வேளச்சேரி தாழ்வான பகுதியைத் தாண்டி மேம்பாலத்தில் செல்லவும்', hi: 'वेलाचेरी के ऊपर फ्लाईओवर से सुरक्षित चलें' },
  },
  {
    id: 'vg-safe-4',
    streetName: { en: 'Vijayanagar Flyover North Ramp', ta: 'விஜயநகர் மேம்பாலம் வடக்கு இறங்குமுகம்', hi: 'विजयनगर फ्लाईओवर उत्तर ढलान' },
    coordinates: [[80.2275, 12.9798], [80.2315, 12.9835]],
    floodRisk: 0.04,
    travelTimeMin: 1.5,
    distanceKm: 0.50,
    reason: { en: 'High ramp connecting directly to 100 Feet High Road', ta: '100 அடி மேடான சாலையுடன் இணைக்கும் மேம்பாலம்', hi: '100 फीट ऊँची सड़क से जोड़ता रैंप' },
    instruction: { en: 'Descend smoothly onto 100 Feet Taramani Link Road', ta: '100 அடி தரமணி இணைப்புச் சாலையில் இறங்கவும்', hi: '100 फीट तारामणि लिंक रोड पर उतरें' },
  },
  {
    id: 'vg-safe-5',
    streetName: { en: '100 Feet Taramani Link High Road', ta: '100 அடி தரமணி மேடான சாலை', hi: '100 फीट तारामणि ऊँची सड़क' },
    coordinates: [[80.2315, 12.9835], [80.2322, 12.9860]],
    floodRisk: 0.06,
    travelTimeMin: 1.3,
    distanceKm: 0.32,
    reason: { en: 'Wide dual-carriageway with deep covered storm conduits', ta: 'மூடப்பட்ட ஆழமான மழைநீர் வடிகால்கள் கொண்ட அகலமான சாலை', hi: 'गहरे कवर्ड ड्रेनेज वाली चौड़ी पक्की सड़क' },
    instruction: { en: 'Drive north on 100 Feet Taramani Road', ta: '100 அடி சாலையில் வடக்கே செல்லவும்', hi: '100 फीट रोड पर उत्तर की ओर चलें' },
  },
  {
    id: 'vg-safe-6',
    streetName: { en: 'TCS Taramani Elevated Avenue', ta: 'டி.சி.எஸ் தரமணி மேடான நிழற்சாலை', hi: 'टीसीएस तारामणि ऊँचा मार्ग' },
    coordinates: [[80.2322, 12.9860], [80.2330, 12.9888]],
    floodRisk: 0.07,
    travelTimeMin: 1.4,
    distanceKm: 0.34,
    reason: { en: 'Elevated IT corridor embankment', ta: 'மேடான தகவல் தொழில்நுட்பச் சாலை', hi: 'ऊँचा आईटी कॉरिडोर' },
    instruction: { en: 'Continue past TCS Taramani campus', ta: 'டிசிஎஸ் வளாகத்தைக் கடந்து தொடரவும்', hi: 'टीसीएस कैंपस पार करें' },
  },
  {
    id: 'vg-safe-7',
    streetName: { en: 'Taramani High Ground Ridge', ta: 'தரமணி மேடான பகுதி', hi: 'तारामणि हाई ग्राउंड' },
    coordinates: [[80.2330, 12.9888], [80.2340, 12.9918]],
    floodRisk: 0.09,
    travelTimeMin: 1.4,
    distanceKm: 0.36,
    reason: { en: 'High natural elevation, never inundated', ta: 'இயற்கையாகவே மேடான பகுதி, வெள்ளம் சூழாது', hi: 'प्राकृतिक रूप से ऊँचा इलाका, बाढ़ नहीं' },
    instruction: { en: 'Maintain speed on dry elevated lanes', ta: 'மேடான பாதையில் சீராகச் செல்லவும்', hi: 'ऊँचे सुरक्षित मार्ग पर चलें' },
  },
  {
    id: 'vg-safe-8',
    streetName: { en: 'IIT Madras East Gate High Road', ta: 'ஐஐடி மெட்ராஸ் கிழக்கு வாயில் சாலை', hi: 'आईआईटी मद्रास ईस्ट गेट रोड' },
    coordinates: [[80.2340, 12.9918], [80.2350, 12.9948]],
    floodRisk: 0.08,
    travelTimeMin: 1.4,
    distanceKm: 0.35,
    reason: { en: 'Forested institutional high ridge with permeable soil', ta: 'நீர் உறிஞ்சும் நிலப்பரப்பு கொண்ட மேடான பகுதி', hi: 'पेड़ों से घिरा ऊँचा सुरक्षित इलाका' },
    instruction: { en: 'Follow curve past IIT East Gate', ta: 'ஐஐடி கிழக்கு வாயில் வளைவில் செல்லவும்', hi: 'आईआईटी ईस्ट गेट मोड़ पर जाएँ' },
  },
  {
    id: 'vg-safe-9',
    streetName: { en: 'Sardar Patel Road High Junction', ta: 'சர்தார் படேல் மேடான சந்திப்பு', hi: 'सरदार पटेल रोड ऊँचा जंक्शन' },
    coordinates: [[80.2350, 12.9948], [80.2365, 12.9995]],
    floodRisk: 0.07,
    travelTimeMin: 1.6,
    distanceKm: 0.55,
    reason: { en: 'High ground junction above Adyar water catchment', ta: 'அடையாறு ஆற்று மட்டத்திற்கு மேல் உள்ள மேடான சந்திப்பு', hi: 'अड्यार नदी स्तर से काफी ऊपर जंक्शन' },
    instruction: { en: 'Turn west onto Sardar Patel High Highway', ta: 'சர்தார் படேல் சாலையில் மேற்கே திரும்பவும்', hi: 'सरदार पटेल हाईवे पर पश्चिम मुड़ें' },
  },
  {
    id: 'vg-safe-10',
    streetName: { en: 'Sardar Patel Road / IIT Campus Ridge', ta: 'சர்தார் படேல் / ஐஐடி வளாக மேடு', hi: 'सरदार पटेल / आईआईटी कैंपस कगार' },
    coordinates: [[80.2365, 12.9995], [80.2342, 13.0012]],
    floodRisk: 0.04,
    travelTimeMin: 1.3,
    distanceKm: 0.34,
    reason: { en: 'IIT campus natural rocky ridge, pristine drainage', ta: 'ஐஐடி பாறை மேட்டுப் பகுதி, மிகச் சிறந்த வடிகால்', hi: 'आईआईटी पहाड़ी इलाका, बेहतरीन ड्रेनेज' },
    instruction: { en: 'Continue past IIT Madras main gate', ta: 'ஐஐடி முதன்மை வாயிலைக் கடக்கவும்', hi: 'आईआईटी मेन गेट पार करें' },
  },
  {
    id: 'vg-safe-11',
    streetName: { en: 'Raj Bhavan Forest Ridge Highway', ta: 'ஆளுநர் மாளிகை மேடான நெடுஞ்சாலை', hi: 'राजभवन वन कगार हाईवे' },
    coordinates: [[80.2342, 13.0012], [80.2318, 13.0026]],
    floodRisk: 0.05,
    travelTimeMin: 1.2,
    distanceKm: 0.32,
    reason: { en: 'Raj Bhavan forest boundary: highest dry ridge in South Chennai', ta: 'தென் சென்னையின் மிக உயர்ந்த மேடான பகுதி', hi: 'दक्षिण चेन्नई का सबसे ऊँचा सुरक्षित इलाका' },
    instruction: { en: 'Follow along Raj Bhavan boundary forest', ta: 'ஆளுநர் மாளிகை எல்லையோரம் செல்லவும்', hi: 'राजभवन के साथ हाईवे पर चलें' },
  },
  {
    id: 'vg-safe-12',
    streetName: { en: 'Anna University High Avenue', ta: 'அண்ணா பல்கலைக்கழக மேடான சாலை', hi: 'अन्ना यूनिवर्सिटी ऊँचा एवेन्यू' },
    coordinates: [[80.2318, 13.0026], [80.2290, 13.0039]],
    floodRisk: 0.06,
    travelTimeMin: 1.3,
    distanceKm: 0.35,
    reason: { en: 'High ground multi-lane road, zero standing water', ta: 'பல வழிப்பாதை மேடான நெடுஞ்சாலை, நீர் நிற்காது', hi: 'मल्टी-लेन सड़क, पानी जमा नहीं होता' },
    instruction: { en: 'Pass Anna University engineering campus', ta: 'அண்ணா பல்கலைக்கழகத்தைக் கடக்கவும்', hi: 'अन्ना यूनिवर्सिटी पार करें' },
  },
  {
    id: 'vg-safe-13',
    streetName: { en: 'Gandhi Mandapam Elevated Curve', ta: 'காந்தி மண்டபம் மேடான வளைவு', hi: 'गांधी मंडपम ऊँचा मोड़' },
    coordinates: [[80.2290, 13.0039], [80.2262, 13.0050]],
    floodRisk: 0.08,
    travelTimeMin: 1.2,
    distanceKm: 0.33,
    reason: { en: 'Wide bypass curve well above historical flood marks', ta: 'வரலாற்று வெள்ள மட்டத்திற்கு மேலான அகலமான பாதை', hi: 'बाढ़ स्तर से काफी ऊँचा चौड़ा मोड़' },
    instruction: { en: 'Take Gandhi Mandapam curve toward Guindy', ta: 'காந்தி மண்டபம் வளைவில் கிண்டி நோக்கிச் செல்லவும்', hi: 'गांधी मंडपम मोड़ से गिंडी बढ़ें' },
  },
  {
    id: 'vg-safe-14',
    streetName: { en: 'Guindy National Park High Border', ta: 'கிண்டி தேசிய பூங்கா மேடான எல்லை', hi: 'गिंडी नेशनल पार्क ऊँचा बॉर्डर' },
    coordinates: [[80.2262, 13.0050], [80.2238, 13.0058]],
    floodRisk: 0.10,
    travelTimeMin: 1.1,
    distanceKm: 0.30,
    reason: { en: 'Elevated protected forest road edge', ta: 'பாதுகாக்கப்பட்ட மேடான பூங்கா சாலை', hi: 'सुरक्षित ऊँची पार्क सड़क' },
    instruction: { en: 'Continue past Guindy National Park gate', ta: 'தேசிய பூங்கா வாயிலைக் கடந்து தொடரவும்', hi: 'नेशनल पार्क गेट पार करें' },
  },
  {
    id: 'vg-safe-15',
    streetName: { en: 'Kathipara Overpass Ramp Approach', ta: 'கத்திப்பாரா மேம்பால இணைப்பு அணுகுமுறை', hi: 'कातिपारा ओवरपास रैंप' },
    coordinates: [[80.2238, 13.0058], [80.2220, 13.0064]],
    floodRisk: 0.14,
    travelTimeMin: 1.0,
    distanceKm: 0.22,
    reason: { en: 'High grade approach ramp, well cleared', ta: 'மேடான அணுகுமுறை சாலை', hi: 'ऊँचा रैंप, साफ़' },
    instruction: { en: 'Follow flyover ramp straight into Guindy', ta: 'மேம்பால இணைப்பு வழியாக கிண்டியை நோக்கிச் செல்லவும்', hi: 'फ्लाईओवर से सीधे गिंडी की ओर बढ़ें' },
  },
  {
    id: 'vg-safe-16',
    streetName: { en: 'Guindy Grand Junction Safe Terminal', ta: 'கிண்டி சந்திப்பு பாதுகாப்பான முனையம்', hi: 'गिंडी जंक्शन सुरक्षित टर्मिनल' },
    coordinates: [[80.2220, 13.0064], [80.2206, 13.0067]],
    floodRisk: 0.12,
    travelTimeMin: 0.8,
    distanceKm: 0.18,
    reason: { en: 'Arrived via 100% high ground route, zero flood exposure', ta: 'முழுக்க முழுக்க மேடான பாதையில் பாதுகாப்பாக வந்தடைந்தது', hi: '100% ऊँचे रास्ते से सुरक्षित पहुँचे' },
    instruction: { en: 'Arrive at Guindy safely via dry arterial corridor', ta: 'கிண்டியைப் பாதுகாப்பாக அடைந்தீர்கள்', hi: 'गिंडी सुरक्षित पहुँचे' },
  },
];

// Trip 2: T. Nagar <-> Adyar
const TRIP_2_SHORTEST_SEGMENTS: MicroRoadSegment[] = [
  {
    id: 'ta-s-1',
    streetName: { en: 'Panagal Park / South Usman Entry', ta: 'பனகல் பூங்கா / தெற்கு உஸ்மான் நுழைவு', hi: 'पनागल पार्क / साउथ उस्मान प्रवेश' },
    coordinates: [[80.2341, 13.0418], [80.2343, 13.0398]],
    floodRisk: 0.16,
    travelTimeMin: 1.0,
    distanceKm: 0.23,
    reason: { en: 'Commercial high pavement, mild runoff', ta: 'வணிக வளாக மேடான தரைப்பகுதி', hi: 'ऊँचा बाज़ार मार्ग, हल्का पानी' },
  },
  {
    id: 'ta-s-2',
    streetName: { en: 'Usman Road Shopping Dip', ta: 'உஸ்மான் சாலை பள்ளம்', hi: 'उस्मान रोड बाज़ार निचला भाग' },
    coordinates: [[80.2343, 13.0398], [80.2345, 13.0378]],
    floodRisk: 0.32,
    travelTimeMin: 1.1,
    distanceKm: 0.22,
    reason: { en: 'Slight pavement dip, storm drains slow', ta: 'சிறிய பள்ளம், வடிகால் மெதுவு', hi: 'हल्का निचला भाग, धीमा ड्रेनेज' },
  },
  {
    id: 'ta-s-3',
    streetName: { en: 'Ranganathan Street Corner', ta: 'ரங்கநாதன் தெரு முனை', hi: 'रंगनाथन स्ट्रीट कोना' },
    coordinates: [[80.2345, 13.0378], [80.2348, 13.0358]],
    floodRisk: 0.46,
    travelTimeMin: 1.2,
    distanceKm: 0.23,
    reason: { en: 'Dense pedestrian dip, water pooling', ta: 'நீர் தேங்கும் தாழ்வான பகுதி', hi: 'पानी जमा होने वाला इलाका' },
  },
  {
    id: 'ta-s-4',
    streetName: { en: 'Madley Subway North Incline', ta: 'மேட்லி சுரங்கப்பாதை வடக்கு சரிவு', hi: 'मैडली सबवे उत्तरी ढलान' },
    coordinates: [[80.2348, 13.0358], [80.2351, 13.0338]],
    floodRisk: 0.65,
    travelTimeMin: 1.4,
    distanceKm: 0.23,
    reason: { en: 'Steep downward incline toward subway basin', ta: 'சுரங்கப்பாதையை நோக்கிய செங்குத்தான சரிவு', hi: 'सबवे की ओर तीखी ढलान' },
  },
  {
    id: 'ta-s-5',
    streetName: { en: 'Madley Subway Dip', ta: 'மேட்லி சுரங்கப்பாதை பள்ளம்', hi: 'मैडली सबवे निचला भाग' },
    coordinates: [[80.2351, 13.0338], [80.2355, 13.0315]],
    floodRisk: 0.95,
    travelTimeMin: 2.0,
    distanceKm: 0.26,
    reason: { en: 'Impassable: sunken railway subway flooded 4 times in 5 years with 4ft water', ta: 'கடுமையான வெள்ளம்: 4 அடி ஆழத்தில் நீர் தேங்கும் ஆபத்து', hi: 'रास्ता बंद: सबवे में 4 फीट तक पानी भर जाता है' },
  },
  {
    id: 'ta-s-6',
    streetName: { en: 'CIT Nagar South Dip', ta: 'சிஐடி நகர் தெற்கு பள்ளம்', hi: 'सीआईटी नगर दक्षिण गड्ढा' },
    coordinates: [[80.2355, 13.0315], [80.2368, 13.0288]],
    floodRisk: 0.88,
    travelTimeMin: 1.8,
    distanceKm: 0.33,
    reason: { en: 'Submerged residential street from subway backflow', ta: 'சுரங்கப்பாதை நீர் உட்புகுந்து சாலை மூழ்கும் ஆபத்து', hi: 'सबवे के पानी से सड़क डूबना' },
  },
  {
    id: 'ta-s-7',
    streetName: { en: 'CIT Nagar 1st Main Low Basin', ta: 'சிஐடி நகர் 1வது முதன்மை சாலை பள்ளம்', hi: 'सीआईटी नगर 1st मेन निचला इलाका' },
    coordinates: [[80.2368, 13.0288], [80.2382, 13.0260]],
    floodRisk: 0.78,
    travelTimeMin: 1.6,
    distanceKm: 0.34,
    reason: { en: 'Low-lying basin road, knee-deep flood water', ta: 'முழங்கால் அளவு நீர் தேங்கும் தாழ்வான சாலை', hi: 'घुटनों तक पानी भरने वाली निचली सड़क' },
  },
  {
    id: 'ta-s-8',
    streetName: { en: 'Nandanam Extension Low Basin', ta: 'நந்தனம் விரிவு தாழ்வான பகுதி', hi: 'नंदनम एक्सटेंशन निचला इलाका' },
    coordinates: [[80.2382, 13.0260], [80.2398, 13.0232]],
    floodRisk: 0.68,
    travelTimeMin: 1.5,
    distanceKm: 0.35,
    reason: { en: 'Drainage overflowing near residential canal link', ta: 'கால்வாய் இணைப்பு அருகே நீர் நிரம்பி வழிகிறது', hi: 'नहर के पास जलभराव' },
  },
  {
    id: 'ta-s-9',
    streetName: { en: 'Kotturpuram High Road Low Bend', ta: 'கோட்டூர்புரம் சாலை தாழ்வான வளைவு', hi: 'कोट्टूरपुरम रोड निचला मोड़' },
    coordinates: [[80.2398, 13.0232], [80.2415, 13.0206]],
    floodRisk: 0.58,
    travelTimeMin: 1.3,
    distanceKm: 0.33,
    reason: { en: 'River water seepage onto road verge', ta: 'ஆற்று நீர் சாலையில் கசிந்து தேங்குகிறது', hi: 'नदी का पानी सड़क किनारे आना' },
  },
  {
    id: 'ta-s-10',
    streetName: { en: 'Kotturpuram River Approach', ta: 'கோட்டூர்புரம் ஆற்று அணுகுமுறை', hi: 'कोट्टूरपुरम नदी पहुँच' },
    coordinates: [[80.2415, 13.0206], [80.2430, 13.0184]],
    floodRisk: 0.76,
    travelTimeMin: 1.5,
    distanceKm: 0.28,
    reason: { en: 'River bank water rise warning in effect', ta: 'ஆற்று நீர் மட்டம் உயர்ந்து எச்சரிக்கை விடுக்கப்பட்டுள்ளது', hi: 'नदी का जलस्तर बढ़ने की चेतावनी' },
  },
  {
    id: 'ta-s-11',
    streetName: { en: 'Kotturpuram Low River Bridge Deck', ta: 'கோட்டூர்புரம் தாழ்வான ஆற்றுப் பாலம்', hi: 'कोट्टूरपुरम निचला नदी पुल' },
    coordinates: [[80.2430, 13.0184], [80.2442, 13.0168]],
    floodRisk: 0.92,
    travelTimeMin: 1.8,
    distanceKm: 0.22,
    reason: { en: 'Dangerous: Adyar River overflowing low bridge deck during heavy rains', ta: 'அபாயம்: அடையாறு வெள்ள நீர் தாழ்வான பாலத்தைத் தாண்டுகிறது', hi: 'खतरा: अड्यार नदी का पानी पुल के ऊपर से बह रहा है' },
  },
  {
    id: 'ta-s-12',
    streetName: { en: 'River View Road West Basin', ta: 'ரிவர் வியூ சாலை மேற்கு பள்ளம்', hi: 'रिवर व्यू रोड पश्चिमी भाग' },
    coordinates: [[80.2442, 13.0168], [80.2465, 13.0142]],
    floodRisk: 0.74,
    travelTimeMin: 1.4,
    distanceKm: 0.37,
    reason: { en: 'Sunken riverbank road flooded from river swell', ta: 'ஆற்றங்கரையோரம் உள்ள தாழ்வான சாலை மூழ்கியுள்ளது', hi: 'नदी किनारे की निचली सड़क पर बाढ़' },
  },
  {
    id: 'ta-s-13',
    streetName: { en: 'River View Road East Stretch', ta: 'ரிவர் வியூ சாலை கிழக்கு பகுதி', hi: 'रिवर व्यू रोड पूर्वी भाग' },
    coordinates: [[80.2465, 13.0142], [80.2495, 13.0118]],
    floodRisk: 0.62,
    travelTimeMin: 1.3,
    distanceKm: 0.42,
    reason: { en: 'Mud and water accumulation on pavement', ta: 'சாலையில் சேறும் நீரும் தேக்கம்', hi: 'सड़क पर कीचड़ और पानी' },
  },
  {
    id: 'ta-s-14',
    streetName: { en: 'Canal Bank Road Mandaveli South', ta: 'கால்வாய் கரை சாலை மந்தைவெளி தெற்கு', hi: 'कैनाल बैंक रोड मंदावेली दक्षिण' },
    coordinates: [[80.2495, 13.0118], [80.2528, 13.0092]],
    floodRisk: 0.48,
    travelTimeMin: 1.2,
    distanceKm: 0.45,
    reason: { en: 'Buckingham Canal drainage dip, moderate pooling', ta: 'பக்கிங்ஹாம் கால்வாய் அருகே மிதமான நீர் தேக்கம்', hi: 'बकिंघम नहर के पास पानी का जमाव' },
  },
  {
    id: 'ta-s-15',
    streetName: { en: 'Adyar Bus Depot Approach', ta: 'அடையாறு பணிமனை அணுகுமுறை', hi: 'अड्यार बस डिपो पहुँच' },
    coordinates: [[80.2528, 13.0092], [80.2552, 13.0076]],
    floodRisk: 0.34,
    travelTimeMin: 1.1,
    distanceKm: 0.32,
    reason: { en: 'Approaching elevated junction road', ta: 'மேடான சந்திப்பை அணுகும் சாலை', hi: 'ऊँचे जंक्शन की ओर बढ़ती सड़क' },
  },
  {
    id: 'ta-s-16',
    streetName: { en: 'Adyar Signal Junction', ta: 'அடையாறு சிக்னல் சந்திப்பு', hi: 'अड्यार सिग्नल जंक्शन' },
    coordinates: [[80.2552, 13.0076], [80.2574, 13.0063]],
    floodRisk: 0.15,
    travelTimeMin: 0.9,
    distanceKm: 0.28,
    reason: { en: 'Commercial high center, fully dry', ta: 'வணிக மேட்டுப்பகுதி, பாதுகாப்பானது', hi: 'ऊँचा मुख्य चौराहा, पूरी तरह सूखा' },
  },
];

const TRIP_2_SAFEST_SEGMENTS: MicroRoadSegment[] = [
  {
    id: 'ta-safe-1',
    streetName: { en: 'Panagal Park North High Street', ta: 'பனகல் பூங்கா வடக்கு மேடான சாலை', hi: 'पनागल पार्क उत्तर ऊँची सड़क' },
    coordinates: [[80.2341, 13.0418], [80.2355, 13.0408]],
    floodRisk: 0.08,
    travelTimeMin: 1.0,
    distanceKm: 0.20,
    reason: { en: 'High commercial avenue, completely dry', ta: 'மேடான வணிக சாலை, நீர் இல்லை', hi: 'ऊँचा बाज़ार मार्ग, बिल्कुल सूखा' },
  },
  {
    id: 'ta-safe-2',
    streetName: { en: 'North Usman Elevated Flyover Ramp', ta: 'வடக்கு உஸ்மான் மேம்பால ஏறுமுகம்', hi: 'नॉर्थ उस्मान फ्लाईओवर रैंप' },
    coordinates: [[80.2355, 13.0408], [80.2372, 13.0390]],
    floodRisk: 0.05,
    travelTimeMin: 1.1,
    distanceKm: 0.26,
    reason: { en: 'Elevated flyover avoiding all ground waterlogging', ta: 'தரைமட்ட நீர் தேக்கத்தைத் தவிர்க்கும் மேம்பாலம்', hi: 'सड़क के पानी से दूर ऊँचा फ्लाईओवर' },
  },
  {
    id: 'ta-safe-3',
    streetName: { en: 'North Usman Flyover High Span', ta: 'வடக்கு உஸ்மான் மேம்பால உச்சி', hi: 'नॉर्थ उस्मान फ्लाईओवर मुख्य स्पैन' },
    coordinates: [[80.2372, 13.0390], [80.2398, 13.0365]],
    floodRisk: 0.03,
    travelTimeMin: 1.3,
    distanceKm: 0.38,
    reason: { en: 'Smooth high-level traffic bypass', ta: 'மேம்பால விரைவுப் பாதை', hi: 'ऊँचा सुरक्षित ट्रैफिक बाईपास' },
  },
  {
    id: 'ta-safe-4',
    streetName: { en: 'Kodambakkam High Road Flyover Descent', ta: 'கோடம்பாக்கம் நெடுஞ்சாலை மேம்பால இறக்கம்', hi: 'कोडमबक्कम हाई रोड ढलान' },
    coordinates: [[80.2398, 13.0365], [80.2425, 13.0335]],
    floodRisk: 0.06,
    travelTimeMin: 1.2,
    distanceKm: 0.42,
    reason: { en: 'Wide concrete flyover ramp with excellent slope', ta: 'சிறந்த வடிகால் கொண்ட கான்கிரீட் மேம்பாலம்', hi: 'कंक्रीट फ्लाईओवर ढलान, सूखा' },
  },
  {
    id: 'ta-safe-5',
    streetName: { en: 'Anna Salai / Mount Road High Entrance', ta: 'அண்ணா சாலை / மவுண்ட் ரோடு மேடான நுழைவு', hi: 'अन्ना सलाई / माउंट रोड ऊँचा प्रवेश' },
    coordinates: [[80.2425, 13.0335], [80.2455, 13.0302]],
    floodRisk: 0.07,
    travelTimeMin: 1.3,
    distanceKm: 0.48,
    reason: { en: 'Chennai premier arterial highway: 6 elevated lanes', ta: 'சென்னையின் முதன்மை மேடான 6 வழி நெடுஞ்சாலை', hi: 'चेन्नई का मुख्य 6-लेन ऊँचा हाईवे' },
  },
  {
    id: 'ta-safe-6',
    streetName: { en: 'Teynampet Metro Elevated Avenue', ta: 'தேனாம்பேட்டை மெட்ரோ மேடான சாலை', hi: 'तेनाम्पेट मेट्रो ऊँचा एवेन्यू' },
    coordinates: [[80.2455, 13.0302], [80.2478, 13.0275]],
    floodRisk: 0.05,
    travelTimeMin: 1.2,
    distanceKm: 0.36,
    reason: { en: 'Modern storm drain infrastructure, dry surface', ta: 'நவீன மழைநீர் வடிகால் கொண்ட உலர் சாலை', hi: 'आधुनिक ड्रेनेज, सूखी सड़क' },
  },
  {
    id: 'ta-safe-7',
    streetName: { en: 'Anna Salai Nandanam Flyover Span', ta: 'அண்ணா சாலை நந்தனம் மேம்பாலம்', hi: 'अन्ना सलाई नंदनम फ्लाईओवर स्पैन' },
    coordinates: [[80.2478, 13.0275], [80.2495, 13.0255]],
    floodRisk: 0.02,
    travelTimeMin: 1.1,
    distanceKm: 0.28,
    reason: { en: 'Elevated flyover over Nandanam: 100% dry and safe bypass', ta: 'நந்தனம் மேம்பாலம்: 100% பாதுகாப்பானது', hi: 'नंदनम फ्लाईओवर: 100% सूखा और सुरक्षित' },
  },
  {
    id: 'ta-safe-8',
    streetName: { en: 'Mount Road Elevated Highway', ta: 'மவுண்ட் ரோடு உயர்மட்ட நெடுஞ்சாலை', hi: 'माउंट रोड एलिवेटेड हाईवे' },
    coordinates: [[80.2495, 13.0255], [80.2478, 13.0210]],
    floodRisk: 0.05,
    travelTimeMin: 1.5,
    distanceKm: 0.52,
    reason: { en: 'Wide elevated arterial, high above river level', ta: 'ஆற்று மட்டத்தை விட மிக உயரமான அகல நெடுஞ்சாலை', hi: 'नदी स्तर से काफी ऊँचा चौड़ा हाईवे' },
  },
  {
    id: 'ta-safe-9',
    streetName: { en: 'Saidapet High Level Bridge Span', ta: 'சைதாப்பேட்டை உயர்மட்ட ஆற்றுப் பாலம்', hi: 'सैदापेट हाई-लेवल नदी पुल' },
    coordinates: [[80.2478, 13.0210], [80.2455, 13.0165]],
    floodRisk: 0.06,
    travelTimeMin: 1.4,
    distanceKm: 0.53,
    reason: { en: 'High-level multi-lane bridge with 15ft river clearance', ta: '15 அடி உயரமுள்ள அகலமான ஆற்றுப் பாலம்', hi: '15 फीट ऊँचा मल्टी-लेन नदी पुल' },
  },
  {
    id: 'ta-safe-10',
    streetName: { en: 'Little Mount High Flyover', ta: 'சின்னமலை உயர்மட்ட மேம்பாலம்', hi: 'लिटिल माउंट हाई फ्लाईओवर' },
    coordinates: [[80.2455, 13.0165], [80.2430, 13.0120]],
    floodRisk: 0.04,
    travelTimeMin: 1.3,
    distanceKm: 0.54,
    reason: { en: 'Elevated rocky hill structure, natural flood immunity', ta: 'இயற்கையாகவே மேடான பாறைப் பகுதி, வெள்ளப் பாதிப்பில்லை', hi: 'प्राकृतिक पहाड़ी इलाका, बाढ़ से पूर्ण सुरक्षा' },
  },
  {
    id: 'ta-safe-11',
    streetName: { en: 'Sardar Patel High Road Entrance', ta: 'சர்தார் படேல் மேடான சாலை நுழைவு', hi: 'सरदार पटेल ऊँची सड़क प्रवेश' },
    coordinates: [[80.2430, 13.0120], [80.2405, 13.0075]],
    floodRisk: 0.06,
    travelTimeMin: 1.3,
    distanceKm: 0.54,
    reason: { en: 'Wide high-ground arterial highway', ta: 'அகலமான மேடான நெடுஞ்சாலை', hi: 'चौड़ा ऊँचा मुख्य हाईवे' },
  },
  {
    id: 'ta-safe-12',
    streetName: { en: 'Raj Bhavan High Corridor', ta: 'ஆளுநர் மாளிகை மேடான வழித்தடம்', hi: 'राजभवन ऊँचा कॉरिडोर' },
    coordinates: [[80.2405, 13.0075], [80.2365, 12.9995]],
    floodRisk: 0.05,
    travelTimeMin: 1.8,
    distanceKm: 0.95,
    reason: { en: 'Forest-buffered dry high ground corridor', ta: 'மரங்கள் சூழ்ந்த பாதுகாப்பான மேடான நெடுஞ்சாலை', hi: 'पेड़ों से सुरक्षित ऊँचा सूखा कॉरिडोर' },
  },
  {
    id: 'ta-safe-13',
    streetName: { en: 'Gandhi Mandapam High Avenue', ta: 'காந்தி மண்டபம் மேடான நிழற்சாலை', hi: 'गांधी मंडपम ऊँचा मार्ग' },
    coordinates: [[80.2365, 12.9995], [80.2415, 13.0015]],
    floodRisk: 0.07,
    travelTimeMin: 1.4,
    distanceKm: 0.58,
    reason: { en: 'Elevated bypass avenue with wide culverts', ta: 'மேடான புறவழிச்சாலை, அகலமான வடிகால்கள்', hi: 'ऊँचा बाईपास मार्ग, चौड़े ड्रेनेज' },
  },
  {
    id: 'ta-safe-14',
    streetName: { en: 'Kasturba Nagar High Ridge', ta: 'கஸ்தூர்பா நகர் மேடான பகுதி', hi: 'कस्तूरबा नगर हाई रिज' },
    coordinates: [[80.2415, 13.0015], [80.2470, 13.0034]],
    floodRisk: 0.09,
    travelTimeMin: 1.4,
    distanceKm: 0.63,
    reason: { en: 'Residential high ridge above Adyar estuary', ta: 'அடையாறு முகத்துவாரத்திற்கு மேலான குடியிருப்பு மேடு', hi: 'अड्यार के ऊपर ऊँचा आवासीय इलाका' },
  },
  {
    id: 'ta-safe-15',
    streetName: { en: 'Adyar High Ground Avenue', ta: 'அடையாறு மேடான நிழற்சாலை', hi: 'अड्यार हाई ग्राउंड एवेन्यू' },
    coordinates: [[80.2470, 13.0034], [80.2525, 13.0050]],
    floodRisk: 0.12,
    travelTimeMin: 1.3,
    distanceKm: 0.62,
    reason: { en: 'Modern concrete highway, completely clear of water', ta: 'நவீன கான்கிரீட் நெடுஞ்சாலை, நீர் தேங்காது', hi: 'आधुनिक कंक्रीट हाईवे, पानी नहीं' },
  },
  {
    id: 'ta-safe-16',
    streetName: { en: 'Adyar Main Junction Safe Terminal', ta: 'அடையாறு முதன்மை சந்திப்பு முனையம்', hi: 'अड्यार मेन जंक्शन सुरक्षित टर्मिनल' },
    coordinates: [[80.2525, 13.0050], [80.2574, 13.0063]],
    floodRisk: 0.10,
    travelTimeMin: 1.1,
    distanceKm: 0.55,
    reason: { en: 'Arrived at Adyar safely with zero flood risk', ta: 'வெள்ளப் பாதிப்பின்றி அடையாறைப் பாதுகாப்பாக அடைந்தீர்கள்', hi: 'बिना किसी बाढ़ जोखिम के अड्यार सुरक्षित पहुँचे' },
  },
];

// Trip 3: Tambaram <-> Central
const TRIP_3_SHORTEST_SEGMENTS: MicroRoadSegment[] = [
  {
    id: 'tc-s-1',
    streetName: { en: 'Tambaram Sanatorium South', ta: 'தாம்பரம் சானடோரியம் தெற்கு', hi: 'तांबरम सेनेटोरियम दक्षिण' },
    coordinates: [[80.1275, 12.9249], [80.1330, 12.9350]],
    floodRisk: 0.20,
    travelTimeMin: 1.8,
    distanceKm: 1.2,
    reason: { en: 'Wide highway road, low surface water', ta: 'அகலமான நெடுஞ்சாலை, நீர் தேங்கவில்லை', hi: 'चौड़ा हाईवे, कम पानी' },
  },
  {
    id: 'tc-s-2',
    streetName: { en: 'Chromepet MIT Gate Dip', ta: 'குரோம்பேட்டை எம்ஐடி வாயில் பள்ளம்', hi: 'क्रोमपेट एमआईटी गेट गड्ढा' },
    coordinates: [[80.1330, 12.9350], [80.1385, 12.9450]],
    floodRisk: 0.38,
    travelTimeMin: 2.0,
    distanceKm: 1.2,
    reason: { en: 'Road side depression, runoff accumulating', ta: 'சாலையோர பள்ளத்தில் நீர் தேங்குகிறது', hi: 'सड़क किनारे पानी जमा' },
  },
  {
    id: 'tc-s-3',
    streetName: { en: 'Chromepet High Street Low Stretch', ta: 'குரோம்பேட்டை தாழ்வான கடைவீதி', hi: 'क्रोमपेट निचला बाज़ार मार्ग' },
    coordinates: [[80.1385, 12.9450], [80.1440, 12.9550]],
    floodRisk: 0.52,
    travelTimeMin: 2.2,
    distanceKm: 1.2,
    reason: { en: 'Slow drainage, pedestrian lanes flooded', ta: 'வடிகால் அடைப்பு, நடைபாதை மூழ்கியுள்ளது', hi: 'धीमा ड्रेनेज, सड़क पर पानी' },
  },
  {
    id: 'tc-s-4',
    streetName: { en: 'Pallavaram Subway North Incline', ta: 'பல்லாவரம் சுரங்கப்பாதை சரிவு', hi: 'पल्लावरम सबवे उत्तरी ढलान' },
    coordinates: [[80.1440, 12.9550], [80.1480, 12.9620]],
    floodRisk: 0.74,
    travelTimeMin: 2.1,
    distanceKm: 0.9,
    reason: { en: 'Rapid runoff pouring into subway basin', ta: 'மழைநீர் வேகமாக சுரங்கப்பாதையில் பாய்கிறது', hi: 'बारिश का पानी सबवे में बह रहा है' },
  },
  {
    id: 'tc-s-5',
    streetName: { en: 'Pallavaram Subway Deep Basin', ta: 'பல்லாவரம் சுரங்கப்பாதை ஆழமான பள்ளம்', hi: 'पल्लावरम सबवे गहरा गड्ढा' },
    coordinates: [[80.1480, 12.9620], [80.1515, 12.9675]],
    floodRisk: 0.96,
    travelTimeMin: 2.8,
    distanceKm: 0.7,
    reason: { en: 'Submerged: 4 feet standing water inside Pallavaram subway', ta: 'கடுமையான வெள்ளம்: சுரங்கப்பாதையில் 4 அடி நீர் தேக்கம்', hi: 'जलमग्न: सबवे में 4 फीट पानी भरा' },
  },
  {
    id: 'tc-s-6',
    streetName: { en: 'Pallavaram East Low Causeway', ta: 'பல்லாவரம் கிழக்கு தாழ்வான தரைப்பாலம்', hi: 'पल्लावरम ईस्ट निचला कॉज़वे' },
    coordinates: [[80.1515, 12.9675], [80.1650, 12.9700]],
    floodRisk: 0.88,
    travelTimeMin: 2.4,
    distanceKm: 1.5,
    reason: { en: 'Marsh drain overflowing onto road surface', ta: 'சதுப்புநில நீர் சாலையில் பாய்கிறது', hi: 'दलदल का पानी सड़क पर बह रहा है' },
  },
  {
    id: 'tc-s-7',
    streetName: { en: 'Pallikaranai Marsh Causeway West', ta: 'பள்ளிக்கரணை சதுப்புநில தரைப்பாலம் மேற்கு', hi: 'पल्लिकरनई दलदल कॉज़वे पश्चिम' },
    coordinates: [[80.1650, 12.9700], [80.1800, 12.9720]],
    floodRisk: 0.98,
    travelTimeMin: 2.9,
    distanceKm: 1.6,
    reason: { en: 'Hazardous: Pallikaranai marsh washed over the causeway', ta: 'ஆபத்து: சதுப்புநில வெள்ளம் சாலையை மூழ்கடித்துள்ளது', hi: 'खतरनाक: दलदली बाढ़ का पानी सड़क के ऊपर' },
  },
  {
    id: 'tc-s-8',
    streetName: { en: 'Pallikaranai Marsh Causeway East', ta: 'பள்ளிக்கரணை சதுப்புநில தரைப்பாலம் கிழக்கு', hi: 'पल्लिकरनई दलदल कॉज़वे पूर्व' },
    coordinates: [[80.1800, 12.9720], [80.1950, 12.9740]],
    floodRisk: 0.94,
    travelTimeMin: 2.6,
    distanceKm: 1.6,
    reason: { en: 'Flooded causeway, vehicles stalled in deep water', ta: 'வெள்ளம் சூழ்ந்த சாலை, வாகனங்கள் பழுதாகி நிற்கும் ஆபத்து', hi: 'जलमग्न सड़क, वाहन फँसने का खतरा' },
  },
  {
    id: 'tc-s-9',
    streetName: { en: 'Velachery Link Road Dip', ta: 'வேளச்சேரி இணைப்புச் சாலை பள்ளம்', hi: 'वेलाचेरी लिंक रोड गड्ढा' },
    coordinates: [[80.1950, 12.9740], [80.2100, 12.9760]],
    floodRisk: 0.82,
    travelTimeMin: 2.4,
    distanceKm: 1.6,
    reason: { en: 'Low-lying marsh outflow channel overflow', ta: 'சதுப்புநில நீர் வெளியேறும் கால்வாய் வெள்ளம்', hi: 'दलदली पानी निकलने वाली नहर उफान पर' },
  },
  {
    id: 'tc-s-10',
    streetName: { en: 'Velachery Underpass North Link', ta: 'வேளச்சேரி சுரங்கப்பாதை வடக்கு இணைப்பு', hi: 'वेलाचेरी अंडरपास नॉर्थ लिंक' },
    coordinates: [[80.2100, 12.9760], [80.2202, 12.9885]],
    floodRisk: 0.76,
    travelTimeMin: 2.2,
    distanceKm: 1.8,
    reason: { en: 'Waterlogging near lake drainage sluice', ta: 'ஏரி மதகு அருகே நீர் தேக்கம்', hi: 'झील के पास जलभराव' },
  },
  {
    id: 'tc-s-11',
    streetName: { en: 'Guindy Race Course Ditch Road', ta: 'கிண்டி ரேஸ் கோர்ஸ் கால்வாய் சாலை', hi: 'गिंडी रेस कोर्स खाई सड़क' },
    coordinates: [[80.2202, 12.9885], [80.2206, 13.0067]],
    floodRisk: 0.68,
    travelTimeMin: 2.5,
    distanceKm: 2.0,
    reason: { en: 'Canal bank road overflowing during downpour', ta: 'கனமழையில் கால்வாய் நிரம்பி வழியும் சாலை', hi: 'भारी बारिश में नहर का पानी सड़क पर' },
  },
  {
    id: 'tc-s-12',
    streetName: { en: 'Saidapet Cooum Canal Low Bank', ta: 'சைதாப்பேட்டை கூவம் கரை தாழ்வான சாலை', hi: 'सैदापेट कूवम किनारा निचली सड़क' },
    coordinates: [[80.2206, 13.0067], [80.2355, 13.0270]],
    floodRisk: 0.88,
    travelTimeMin: 3.2,
    distanceKm: 2.7,
    reason: { en: 'Impassable: river water cresting over road embankment', ta: 'ஆற்று வெள்ளம் கரைபுரண்டு சாலை முழுவதும் பாய்கிறது', hi: 'रास्ता बंद: नदी का पानी सड़क पर बह रहा है' },
  },
  {
    id: 'tc-s-13',
    streetName: { en: 'Saidapet Low River Loop Road', ta: 'சைதாப்பேட்டை ஆற்று வளைவு சாலை', hi: 'सैदापेट नदी लूप रोड' },
    coordinates: [[80.2355, 13.0270], [80.2480, 13.0420]],
    floodRisk: 0.84,
    travelTimeMin: 2.8,
    distanceKm: 2.1,
    reason: { en: 'Submerged under Adyar / Cooum tributary waters', ta: 'ஆற்று வெள்ளத்தில் மூழ்கிய சாலை', hi: 'नदी की बाढ़ में डूबी सड़क' },
  },
  {
    id: 'tc-s-14',
    streetName: { en: 'Teynampet Low Side Street', ta: 'தேனாம்பேட்டை தாழ்வான பக்கவாட்டு சாலை', hi: 'तेनाम्पेट निचली साइड सड़क' },
    coordinates: [[80.2480, 13.0420], [80.2580, 13.0550]],
    floodRisk: 0.65,
    travelTimeMin: 2.3,
    distanceKm: 1.8,
    reason: { en: 'Sunken residential lane, clogged stormwater drains', ta: 'வடிகால் அடைப்பால் நீர் தேங்கும் பகுதி', hi: 'रुके हुए ड्रेनेज से पानी भराव' },
  },
  {
    id: 'tc-s-15',
    streetName: { en: 'Triplicane Low Causeway', ta: 'திருவல்லிக்கேணி தாழ்வான தரைப்பாலம்', hi: 'ट्रिप्लिकेन निचला कॉज़वे' },
    coordinates: [[80.2580, 13.0550], [80.2665, 13.0685]],
    floodRisk: 0.60,
    travelTimeMin: 2.0,
    distanceKm: 1.7,
    reason: { en: 'Low riverbank road prone to flash pooling', ta: 'திடீர் வெள்ளம் தேங்கும் ஆற்றங்கரை சாலை', hi: 'अचानक पानी भरने वाली नदी सड़क' },
  },
  {
    id: 'tc-s-16',
    streetName: { en: 'Chintadripet Low Bridge Road', ta: 'சிந்தாதிரிப்பேட்டை தாழ்வான பாலம்', hi: 'चिंताद्रीपेट निचला पुल रोड' },
    coordinates: [[80.2665, 13.0685], [80.2685, 13.0755]],
    floodRisk: 0.86,
    travelTimeMin: 1.8,
    distanceKm: 0.8,
    reason: { en: 'Cooum river bend overflow submerging the bridge approach', ta: 'கூவம் ஆற்று வளைவு வெள்ளம் பாலத்தை மூழ்கடிக்கிறது', hi: 'कूवम नदी का पानी पुल पहुँच मार्ग पर' },
  },
  {
    id: 'tc-s-17',
    streetName: { en: 'Park Town Canal Road', ta: 'பார்க் டவுன் கால்வாய் சாலை', hi: 'पार्क टाउन नहर सड़क' },
    coordinates: [[80.2685, 13.0755], [80.2700, 13.0800]],
    floodRisk: 0.65,
    travelTimeMin: 1.4,
    distanceKm: 0.5,
    reason: { en: 'Waterlogging near railway culvert', ta: 'ரயில்வே பாலத்தடியில் நீர் தேக்கம்', hi: 'रेलवे पुलिया के पास जलभराव' },
  },
  {
    id: 'tc-s-18',
    streetName: { en: 'Chennai Central Station Low Approach', ta: 'சென்னை சென்ட்ரல் தாழ்வான அணுகுமுறை', hi: 'चेन्नई सेंट्रल निचला पहुँच मार्ग' },
    coordinates: [[80.2700, 13.0800], [80.2707, 13.0827]],
    floodRisk: 0.24,
    travelTimeMin: 1.0,
    distanceKm: 0.3,
    reason: { en: 'Station forecourt, drained and open', ta: 'நிலைய முகப்பு பகுதி, திறந்துள்ளது', hi: 'स्टेशन प्रांगण, पानी नहीं' },
  },
];

const TRIP_3_SAFEST_SEGMENTS: MicroRoadSegment[] = [
  {
    id: 'tc-safe-1',
    streetName: { en: 'Tambaram Elevated Highway Ramp', ta: 'தாம்பரம் உயர்மட்ட நெடுஞ்சாலை ஏறுமுகம்', hi: 'तांबरम एलिवेटेड हाईवे रैंप' },
    coordinates: [[80.1275, 12.9249], [80.1345, 12.9340]],
    floodRisk: 0.05,
    travelTimeMin: 1.5,
    distanceKm: 1.2,
    reason: { en: 'Wide elevated 6-lane highway, 100% dry', ta: '6 வழி மேடான நெடுஞ்சாலை, நீர் நிற்காது', hi: '6-लेन ऊँचा हाईवे, 100% सूखा' },
  },
  {
    id: 'tc-safe-2',
    streetName: { en: 'GST Road Elevated Mile 1', ta: 'ஜி.எஸ்.டி உயர்மட்ட சாலை மைல் 1', hi: 'जीएसटी एलिवेटेड माइल 1' },
    coordinates: [[80.1345, 12.9340], [80.1420, 12.9435]],
    floodRisk: 0.04,
    travelTimeMin: 1.4,
    distanceKm: 1.3,
    reason: { en: 'Modern raised concrete highway', ta: 'நவீன உயர்த்தப்பட்ட கான்கிரீட் நெடுஞ்சாலை', hi: 'आधुनिक ऊँचा कंक्रीट हाईवे' },
  },
  {
    id: 'tc-safe-3',
    streetName: { en: 'GST Road Elevated Mile 2', ta: 'ஜி.எஸ்.டி உயர்மட்ட சாலை மைல் 2', hi: 'जीएसटी एलिवेटेड माइल 2' },
    coordinates: [[80.1420, 12.9435], [80.1500, 12.9530]],
    floodRisk: 0.04,
    travelTimeMin: 1.4,
    distanceKm: 1.3,
    reason: { en: 'High drainage culverts on median', ta: 'மழைநீர் வடிகால்கள் கொண்ட மேடான பாதை', hi: 'उत्कृष्ट ड्रेनेज वाला ऊँचा मार्ग' },
  },
  {
    id: 'tc-safe-4',
    streetName: { en: 'Airport Elevated Flyover Span', ta: 'விமான நிலைய உயர்மட்ட மேம்பாலம்', hi: 'एयरपोर्ट एलिवेटेड फ्लाईओवर' },
    coordinates: [[80.1500, 12.9530], [80.1585, 12.9625]],
    floodRisk: 0.02,
    travelTimeMin: 1.3,
    distanceKm: 1.3,
    reason: { en: 'Airport high-grade elevated corridor: zero standing water', ta: 'விமான நிலைய உயர்மட்டப் பாதை: நீர் நிற்காது', hi: 'एयरपोर्ट एलिवेटेड कॉरिडोर: बिल्कुल सूखा' },
  },
  {
    id: 'tc-safe-5',
    streetName: { en: 'Meenambakkam Elevated Expressway', ta: 'மீனம்பாக்கம் அதிவிரைவு உயர்மட்டச் சாலை', hi: 'मीनम्बाक्कम एलिवेटेड एक्सप्रेसवे' },
    coordinates: [[80.1585, 12.9625], [80.1668, 12.9720]],
    floodRisk: 0.04,
    travelTimeMin: 1.4,
    distanceKm: 1.3,
    reason: { en: 'Elevated highway high above surrounding terrain', ta: 'சுற்றுப்புறத்தை விட உயர்ந்த மேம்பாலச் சாலை', hi: 'आसपास से काफी ऊँचा हाईवे' },
  },
  {
    id: 'tc-safe-6',
    streetName: { en: 'Alandur Metro High Corridor', ta: 'ஆலந்தூர் மெட்ரோ மேடான வழித்தடம்', hi: 'आलंदूर मेट्रो ऊँचा कॉरिडोर' },
    coordinates: [[80.1668, 12.9720], [80.1745, 12.9815]],
    floodRisk: 0.05,
    travelTimeMin: 1.3,
    distanceKm: 1.2,
    reason: { en: 'Deep multi-tier storm runoff system', ta: 'ஆழமான பல அடுக்கு மழைநீர் வடிகால் அமைப்பு', hi: 'मल्टी-टियर गहरा ड्रेनेज सिस्टम' },
  },
  {
    id: 'tc-safe-7',
    streetName: { en: 'Kathipara Cloverleaf Ascent', ta: 'கத்திப்பாரா மேம்பால ஏறுமுகம்', hi: 'कातिपारा फ्लाईओवर चढ़ाई' },
    coordinates: [[80.1745, 12.9815], [80.1860, 12.9918]],
    floodRisk: 0.03,
    travelTimeMin: 1.6,
    distanceKm: 1.6,
    reason: { en: 'High structural flyover interchange ramp', ta: 'உயர்மட்ட மேம்பால இணைப்பு', hi: 'ऊँचा स्ट्रक्चरल फ्लाईओवर रैंप' },
  },
  {
    id: 'tc-safe-8',
    streetName: { en: 'Kathipara Cloverleaf Flyover Deck', ta: 'கத்திப்பாரா மேம்பால உச்சி', hi: 'कातिपारा फ्लाईओवर मुख्य डेक' },
    coordinates: [[80.1860, 12.9918], [80.2042, 13.0075]],
    floodRisk: 0.02,
    travelTimeMin: 2.1,
    distanceKm: 2.4,
    reason: { en: 'Asia largest cloverleaf grade-separator: 100% dry', ta: 'ஆசியாவின் மிகப்பெரிய உயர்மட்ட மேம்பாலம்: முழுப் பாதுகாப்பு', hi: 'विशाल क्लोवरलीफ फ्लाईओवर: 100% सूखा' },
  },
  {
    id: 'tc-safe-9',
    streetName: { en: '100 Feet Jawaharlal Nehru High Road South', ta: '100 அடி ஜவஹர்லால் நேரு மேடான சாலை தெற்கு', hi: '100 फीट जवाहरलाल नेहरू ऊँची सड़क दक्षिण' },
    coordinates: [[80.2042, 13.0075], [80.2085, 13.0195]],
    floodRisk: 0.06,
    travelTimeMin: 1.6,
    distanceKm: 1.5,
    reason: { en: 'Wide inner ring elevated corridor', ta: 'உள்வட்ட மேடான நெடுஞ்சாலை', hi: 'चौड़ा इनर रिंग एलिवेटेड हाईवे' },
  },
  {
    id: 'tc-safe-10',
    streetName: { en: 'Ekkattuthangal High Flyover', ta: 'ஈக்காட்டுத்தாங்கல் உயர்மட்ட மேம்பாலம்', hi: 'इक्काट्टुथांगल हाई फ्लाईओवर' },
    coordinates: [[80.2085, 13.0195], [80.2135, 13.0320]],
    floodRisk: 0.05,
    travelTimeMin: 1.6,
    distanceKm: 1.5,
    reason: { en: 'Flyover clearing the industrial drainage basin', ta: 'தாழ்வான பகுதிகளைத் தாண்டும் மேம்பாலம்', hi: 'निचले इलाके के ऊपर से गुजरता फ्लाईओवर' },
  },
  {
    id: 'tc-safe-11',
    streetName: { en: 'Ashok Nagar 100 Feet High Road', ta: 'அசோக் நகர் 100 அடி மேடான சாலை', hi: 'अशोक नगर 100 फीट ऊँची सड़क' },
    coordinates: [[80.2135, 13.0320], [80.2195, 13.0450]],
    floodRisk: 0.08,
    travelTimeMin: 1.7,
    distanceKm: 1.6,
    reason: { en: 'Wide avenue with unobstructed underground conduits', ta: 'தடையற்ற நிலத்தடி வடிகால் கொண்ட சாலை', hi: 'भूमिगत ड्रेनेज वाली चौड़ी सड़क' },
  },
  {
    id: 'tc-safe-12',
    streetName: { en: 'Vadapalani High Flyover Span', ta: 'வடபழனி உயர்மட்ட மேம்பாலம்', hi: 'वडपलनी हाई फ्लाईओवर' },
    coordinates: [[80.2195, 13.0450], [80.2285, 13.0570]],
    floodRisk: 0.04,
    travelTimeMin: 1.8,
    distanceKm: 1.7,
    reason: { en: 'Double-decker flyover and metro structure: completely dry', ta: 'இரட்டை அடுக்கு மேம்பாலம்: 100% பாதுகாப்பானது', hi: 'डबल-डेकर फ्लाईओवर: बिल्कुल सूखा' },
  },
  {
    id: 'tc-safe-13',
    streetName: { en: 'Koyambedu Elevated Highway Deck', ta: 'கோயம்பேடு உயர்மட்ட நெடுஞ்சாலை', hi: 'कोयंबेडु एलिवेटेड हाईवे' },
    coordinates: [[80.2285, 13.0570], [80.2405, 13.0675]],
    floodRisk: 0.05,
    travelTimeMin: 1.8,
    distanceKm: 1.8,
    reason: { en: 'Wide bypass elevated corridor', ta: 'மேடான புறவழி நெடுஞ்சாலை', hi: 'ऊँचा बाईपास कॉरिडोर' },
  },
  {
    id: 'tc-safe-14',
    streetName: { en: 'Poonamallee High Road Junction', ta: 'பூந்தமல்லி நெடுஞ்சாலை சந்திப்பு', hi: 'पूनमल्ली हाई रोड जंक्शन' },
    coordinates: [[80.2405, 13.0675], [80.2535, 13.0765]],
    floodRisk: 0.06,
    travelTimeMin: 1.7,
    distanceKm: 1.7,
    reason: { en: 'High arterial gateway to Central Chennai', ta: 'சென்ட்ரல் சென்னைக்கான மேடான பிரதான சாலை', hi: 'मध्य चेन्नई के लिए मुख्य ऊँचा हाईवे' },
  },
  {
    id: 'tc-safe-15',
    streetName: { en: 'Kilpauk Medical College High Ridge', ta: 'கீழ்ப்பாக்கம் மருத்துவக் கல்லூரி மேடான பகுதி', hi: 'किल्पॉक मेडिकल कॉलेज हाई रिज' },
    coordinates: [[80.2535, 13.0765], [80.2575, 13.0782]],
    floodRisk: 0.05,
    travelTimeMin: 1.1,
    distanceKm: 0.5,
    reason: { en: 'Highest natural ridge along Poonamallee Highway', ta: 'பூந்தமல்லி சாலையிலேயே மிக உயர்ந்த பகுதி', hi: 'पूनमल्ली हाईवे का सबसे ऊँचा इलाका' },
  },
  {
    id: 'tc-safe-16',
    streetName: { en: 'Egmore High Flyover', ta: 'எழும்பூர் உயர்மட்ட மேம்பாலம்', hi: 'एग्मोर हाई फ्लाईओवर' },
    coordinates: [[80.2575, 13.0782], [80.2618, 13.0798]],
    floodRisk: 0.04,
    travelTimeMin: 1.1,
    distanceKm: 0.5,
    reason: { en: 'Grade-separated railway overpass', ta: 'ரயில்வே மேம்பாலம், உலர் தரைப்பகுதி', hi: 'ऊँचा रेलवे ओवरपास, सूखा' },
  },
  {
    id: 'tc-safe-17',
    streetName: { en: 'Poonamallee High Road Elevated Corridor', ta: 'பூந்தமல்லி நெடுஞ்சாலை மேடான வழித்தடம்', hi: 'पूनमल्ली हाई रोड एलिवेटेड कॉरिडोर' },
    coordinates: [[80.2618, 13.0798], [80.2662, 13.0814]],
    floodRisk: 0.06,
    travelTimeMin: 1.1,
    distanceKm: 0.5,
    reason: { en: 'Multi-lane central avenue, rapid water clearance', ta: 'விரைவான வடிகால் கொண்ட மத்திய நிழற்சாலை', hi: 'तेज़ ड्रेनेज वाला मुख्य एवेन्यू' },
  },
  {
    id: 'tc-safe-18',
    streetName: { en: 'Chennai Central High Gateway Terminal', ta: 'சென்னை சென்ட்ரல் மேடான நுழைவாயில்', hi: 'चेन्नई सेंट्रल ऊँचा प्रवेश द्वार' },
    coordinates: [[80.2662, 13.0814], [80.2707, 13.0827]],
    floodRisk: 0.08,
    travelTimeMin: 1.0,
    distanceKm: 0.5,
    reason: { en: 'Safely arrived at Chennai Central via high ground network', ta: 'மேடான சாலைகள் வழியாக சென்ட்ரலை பாதுகாப்பாக அடைந்தீர்கள்', hi: 'ऊँचे रास्तों से चेन्नई सेंट्रल सुरक्षित पहुँचे' },
  },
];

// Helper to reverse micro segments for reverse direction trips
function reverseSegments(segments: MicroRoadSegment[]): MicroRoadSegment[] {
  return [...segments].reverse().map((seg, idx) => ({
    ...seg,
    id: `${seg.id}-rev-${idx}`,
    coordinates: [...seg.coordinates].reverse() as [number, number][],
  }));
}

export function computeSafestAndShortestRoutes(
  fromId: string,
  toId: string
): DualRouteComparison {
  let shortestSegments: MicroRoadSegment[] = [];
  let safestSegments: MicroRoadSegment[] = [];

  const key = `${fromId}->${toId}`;

  if (key === 'velachery->guindy') {
    shortestSegments = TRIP_1_SHORTEST_SEGMENTS;
    safestSegments = TRIP_1_SAFEST_SEGMENTS;
  } else if (key === 'guindy->velachery') {
    shortestSegments = reverseSegments(TRIP_1_SHORTEST_SEGMENTS);
    safestSegments = reverseSegments(TRIP_1_SAFEST_SEGMENTS);
  } else if (key === 'tnagar->adyar') {
    shortestSegments = TRIP_2_SHORTEST_SEGMENTS;
    safestSegments = TRIP_2_SAFEST_SEGMENTS;
  } else if (key === 'adyar->tnagar') {
    shortestSegments = reverseSegments(TRIP_2_SHORTEST_SEGMENTS);
    safestSegments = reverseSegments(TRIP_2_SAFEST_SEGMENTS);
  } else if (key === 'tambaram->central') {
    shortestSegments = TRIP_3_SHORTEST_SEGMENTS;
    safestSegments = TRIP_3_SAFEST_SEGMENTS;
  } else if (key === 'central->tambaram') {
    shortestSegments = reverseSegments(TRIP_3_SHORTEST_SEGMENTS);
    safestSegments = reverseSegments(TRIP_3_SAFEST_SEGMENTS);
  } else {
    // Dynamic fallback generation: interpolate between the two nodes into 16 micro-segments
    const nodeFrom = CHENNAI_ROAD_NODES[fromId] || CHENNAI_ROAD_NODES.velachery;
    const nodeTo = CHENNAI_ROAD_NODES[toId] || CHENNAI_ROAD_NODES.guindy;
    const count = 16;
    for (let i = 0; i < count; i++) {
      const t0 = i / count;
      const t1 = (i + 1) / count;
      const lng0 = nodeFrom.lng + (nodeTo.lng - nodeFrom.lng) * t0;
      const lat0 = nodeFrom.lat + (nodeTo.lat - nodeFrom.lat) * t0;
      const lng1 = nodeFrom.lng + (nodeTo.lng - nodeFrom.lng) * t1;
      const lat1 = nodeFrom.lat + (nodeTo.lat - nodeFrom.lat) * t1;

      // Curve the shortest into a low curve with high risk dip
      const curveShortest = Math.sin(t0 * Math.PI) * 0.015;
      const shortestRisk = Math.min(0.96, Math.max(0.15, 0.2 + Math.sin(t0 * Math.PI) * 0.75));

      // Curve safest along high ground
      const curveSafest = -Math.sin(t0 * Math.PI) * 0.018;
      const safestRisk = Math.min(0.20, Math.max(0.04, 0.05 + (1 - Math.sin(t0 * Math.PI)) * 0.08));

      shortestSegments.push({
        id: `dyn-s-${i}`,
        streetName: {
          en: `City Arterial Sector ${i + 1}`,
          ta: `நகரச் சாலை பகுதி ${i + 1}`,
          hi: `शहरी मार्ग सेक्टर ${i + 1}`,
        },
        coordinates: [
          [lng0 + curveShortest, lat0],
          [lng1 + curveShortest, lat1],
        ],
        floodRisk: shortestRisk,
        travelTimeMin: 1.2,
        distanceKm: 0.35,
        reason: {
          en: shortestRisk > 0.6 ? 'Low-lying basin street prone to heavy flooding' : 'Standard urban street',
          ta: shortestRisk > 0.6 ? 'வெள்ளம் தேங்கும் தாழ்வான பகுதி' : 'வழக்கமான சாலை',
          hi: shortestRisk > 0.6 ? 'जलभराव संभावित निचली सड़क' : 'सामान्य सड़क',
        },
      });

      safestSegments.push({
        id: `dyn-safe-${i}`,
        streetName: {
          en: `Elevated Corridor High Sector ${i + 1}`,
          ta: `மேடான விரைவுச் சாலை பகுதி ${i + 1}`,
          hi: `ऊँचा कॉरिडोर सेक्टर ${i + 1}`,
        },
        coordinates: [
          [lng0 + curveSafest, lat0],
          [lng1 + curveSafest, lat1],
        ],
        floodRisk: safestRisk,
        travelTimeMin: 1.3,
        distanceKm: 0.40,
        reason: {
          en: 'Elevated dry high-ground corridor',
          ta: 'பாதுகாப்பான மேடான விரைவுப் பாதை',
          hi: 'सुरक्षित ऊँचा सूखा मार्ग',
        },
      });
    }
  }

  // Build full coordinate polyline
  const buildPolyline = (segs: MicroRoadSegment[]): [number, number][] => {
    const coords: [number, number][] = [];
    segs.forEach((seg, idx) => {
      if (idx === 0) coords.push(...seg.coordinates);
      else coords.push(...seg.coordinates.slice(1));
    });
    return coords;
  };

  const shortestCoords = buildPolyline(shortestSegments);
  const safestCoords = buildPolyline(safestSegments);

  const shortestTime = Math.round(shortestSegments.reduce((acc, s) => acc + s.travelTimeMin, 0));
  const safestTime = Math.round(safestSegments.reduce((acc, s) => acc + s.travelTimeMin, 0));

  const shortestDist = Math.round(shortestSegments.reduce((acc, s) => acc + s.distanceKm, 0) * 10) / 10;
  const safestDist = Math.round(safestSegments.reduce((acc, s) => acc + s.distanceKm, 0) * 10) / 10;

  const shortestProneCount = shortestSegments.filter((s) => s.floodRisk >= 0.5).length;
  const safestProneCount = safestSegments.filter((s) => s.floodRisk >= 0.5).length;

  // Worst segment in shortest route
  const worstSegment = shortestSegments.reduce((max, s) => (s.floodRisk > max.floodRisk ? s : max), shortestSegments[0]);

  // Safest bypass segment in safest route (the key flyover/ridge)
  const safestBypassSegment = safestSegments.reduce((best, s) => (s.floodRisk < best.floodRisk ? s : best), safestSegments[Math.floor(safestSegments.length / 3)]);

  const buildResult = (
    segs: MicroRoadSegment[],
    coords: [number, number][],
    timeMin: number,
    distKm: number,
    proneCount: number
  ): ComputedRouteResult => {
    return {
      nodes: [
        CHENNAI_ROAD_NODES[fromId] || CHENNAI_ROAD_NODES.velachery,
        CHENNAI_ROAD_NODES[toId] || CHENNAI_ROAD_NODES.guindy,
      ],
      edges: [],
      segments: segs,
      coordinates: coords,
      totalTimeMin: timeMin,
      totalDistanceKm: distKm,
      floodProneStreetsCount: proneCount,
      safetyBreakdown: calculateSafetyBreakdown(segs),
      worstSegment,
      safestBypassSegment,
      steps: segs.map((s) => ({
        edgeId: s.id,
        streetName: s.streetName,
        instruction: s.instruction || {
          en: `Continue on ${s.streetName.en}`,
          ta: `${s.streetName.ta} வழியே செல்லவும்`,
          hi: `${s.streetName.hi} पर आगे बढ़ें`,
        },
        travelTimeMin: Math.round(s.travelTimeMin),
        distanceKm: s.distanceKm,
        floodRisk: s.floodRisk,
      })),
      avoidedEdges: [
        {
          edge: {
            id: worstSegment.id,
            from: fromId,
            to: toId,
            streetName: worstSegment.streetName,
            travelTimeMin: worstSegment.travelTimeMin,
            distanceKm: worstSegment.distanceKm,
            floodRisk: worstSegment.floodRisk,
            avoidReason: worstSegment.reason,
            instruction: worstSegment.reason,
          },
          midpoint: worstSegment.coordinates[Math.floor(worstSegment.coordinates.length / 2)],
        },
      ],
    };
  };

  return {
    safest: buildResult(safestSegments, safestCoords, safestTime, safestDist, safestProneCount),
    shortest: buildResult(shortestSegments, shortestCoords, shortestTime, shortestDist, shortestProneCount),
  };
}

export function getAllRoadSegmentsForMap(fromId?: string, toId?: string) {
  const routes = computeSafestAndShortestRoutes(fromId || 'velachery', toId || 'guindy');

  // Background roads show the network faintly in the same grade colours
  // Combine segments and mark flooded ones
  const allSegs: {
    id: string;
    coordinates: [number, number][];
    floodRisk: number;
    riskGrade: ReturnType<typeof getRiskGradeInfo>;
    streetName: { en: string; ta: string; hi: string };
    reason: { en: string; ta: string; hi: string };
  }[] = [];

  const seenIds = new Set<string>();

  [...routes.shortest.segments, ...routes.safest.segments].forEach((s) => {
    if (!seenIds.has(s.id)) {
      seenIds.add(s.id);
      allSegs.push({
        id: s.id,
        coordinates: s.coordinates,
        floodRisk: s.floodRisk,
        riskGrade: getRiskGradeInfo(s.floodRisk),
        streetName: s.streetName,
        reason: s.reason,
      });
    }
  });

  return allSegs;
}
