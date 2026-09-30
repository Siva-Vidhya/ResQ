import { create } from 'zustand';
import {
  FLOOD_PRONE_ZONES,
  MOCK_RAINFALL_FORECAST,
  predictNearbyFloodAlert,
  type TriggeredFloodAlert,
} from '../data/floodZones';

export type NavTab = 'home' | 'route' | 'alerts' | 'reports';
export type CitizenRiskLevel = 'SAFE' | 'PRONE' | 'DANGER';

export interface ChennaiArea {
  id: string;
  name: { en: string; ta: string; hi: string };
  pincode: string;
  risk: CitizenRiskLevel;
  waterArrivalText: { en: string; ta: string; hi: string };
  historicalNote: { en: string; ta: string; hi: string };
  advice: { en: string; ta: string; hi: string };
  rainMmPerHr: number;
  elevationMeters: number;
}

export type AuthorityReportStage = 'SENT' | 'SEEN' | 'ACTION_TAKEN';

export interface AutoGovReport {
  id: string;
  refId?: string;
  areaId: string;
  areaName: { en: string; ta: string; hi: string };
  streetName: { en: string; ta: string; hi: string };
  risk: CitizenRiskLevel;
  predictedIn: { en: string; ta: string; hi: string };
  historicalBasis: { en: string; ta: string; hi: string };
  govActionStatus: { en: string; ta: string; hi: string };
  sentTime: { en: string; ta: string; hi: string };
  statusStage?: AuthorityReportStage;
}

export interface CitizenManualReport {
  id: string;
  areaName: string;
  issueType: 'water_rising' | 'blocked_drain' | 'road_blocked' | 'power_pole';
  note: string;
  timeAgo: string;
  status: 'Sent to City Team' | 'Team on the way';
}

export interface SafeRoutePreset {
  id: string;
  fromId: string;
  toId: string;
  fromName: { en: string; ta: string; hi: string };
  toName: { en: string; ta: string; hi: string };
  safestTimeMin: number;
  safestDistanceKm: number;
  shortestTimeMin: number;
  shortestDistanceKm: number;
  avoidedStreetsCount: number;
  avoidedStreets: { en: string[]; ta: string[]; hi: string[] };
  safeViaStreets: { en: string[]; ta: string[]; hi: string[] };
  whySafest: { en: string; ta: string; hi: string };
  whyShortestRisky: { en: string; ta: string; hi: string };
}

export const CHENNAI_AREAS: ChennaiArea[] = [
  {
    id: 'velachery',
    name: { en: 'Velachery', ta: 'வேளச்சேரி', hi: 'वेलाचेरी' },
    pincode: '600042',
    risk: 'DANGER',
    waterArrivalText: {
      en: 'Water may collect on low streets in about 45 minutes',
      ta: 'தாழ்வான தெருக்களில் சுமார் 45 நிமிடங்களில் நீர் தேங்கலாம்',
      hi: 'निचली गलियों में लगभग 45 मिनट में पानी भर सकता है',
    },
    historicalNote: {
      en: 'Past flood data shows Velachery Lake edges and Vijayanagar 2nd Main Road flooded during heavy rains in 2015, 2021, and 2023.',
      ta: 'கடந்த 2015, 2021 மற்றும் 2023 கனமழையின் போது வேளச்சேரி ஏரி முனை மற்றும் விஜயநகர் சாலைகளில் நீர் தேங்கியது.',
      hi: 'पिछले रिकॉर्ड के अनुसार 2015, 2021 और 2023 की तेज़ बारिश में वेलाचेरी झील और विजयनगर मुख्य सड़क पर पानी भरा था।',
    },
    advice: {
      en: 'Move cars and bikes to higher ground now and avoid the Velachery Main Road underpass.',
      ta: 'வாகனங்களை உடனே மேடான இடத்திற்கு மாற்றவும், வேளச்சேரி சுரங்கப்பாதையைத் தவிர்க்கவும்.',
      hi: 'गाड़ियों को अभी ऊँची जगह पर खड़ा करें और वेलाचेरी अंडरपास से न जाएँ।',
    },
    rainMmPerHr: 68,
    elevationMeters: 4.2,
  },
  {
    id: 'tnagar',
    name: { en: 'T. Nagar', ta: 'தி. நகர்', hi: 'टी. नगर' },
    pincode: '600017',
    risk: 'PRONE',
    waterArrivalText: {
      en: 'Knee-deep water likely near subways in 1 hour 15 minutes',
      ta: 'சுரங்கப்பாதைகள் அருகே 1 மணி 15 நிமிடங்களில் நீர் தேங்க வாய்ப்புள்ளது',
      hi: 'सबवे के पास 1 घंटे 15 मिनट में पानी जमा होने की संभावना है',
    },
    historicalNote: {
      en: 'Historical data shows Madley Subway and Usman Road low stretches collect rainwater quickly when rain passes 45 mm.',
      ta: 'மழை 45 மி.மீ தாண்டும்போது மேட்லி சுரங்கப்பாதை மற்றும் உஸ்மான் சாலையில் நீர் தேங்குவது வழக்கம்.',
      hi: '45 मिमी से अधिक बारिश होने पर मैडली सबवे और उस्मान रोड के निचले हिस्से में पानी जल्दी भरता है।',
    },
    advice: {
      en: 'Use the flyover instead of Madley Subway and keep ground-floor doorways clear.',
      ta: 'மேட்லி சுரங்கப்பாதைக்கு பதில் மேம்பாலத்தைப் பயன்படுத்தவும்.',
      hi: 'मैडली सबवे के बजाय फ्लाईओवर का उपयोग करें।',
    },
    rainMmPerHr: 49,
    elevationMeters: 6.5,
  },
  {
    id: 'adyar',
    name: { en: 'Adyar & Kotturpuram', ta: 'அடையாறு & கோட்டூர்புரம்', hi: 'अड्यार और कोट्टूरपुरम' },
    pincode: '600020',
    risk: 'DANGER',
    waterArrivalText: {
      en: 'River bank streets may see rising water in 40 minutes',
      ta: 'ஆற்றங்கரை தெருக்களில் 40 நிமிடங்களில் நீர்மட்டம் உயரலாம்',
      hi: 'नदी किनारे की सड़कों पर 40 मिनट में पानी बढ़ सकता है',
    },
    historicalNote: {
      en: 'Low streets near the Adyar River bridge and Kotturpuram flooded in past northeast monsoon surges.',
      ta: 'வடகிழக்கு பருவமழையின் போது அடையாறு பாலம் மற்றும் கோட்டூர்புரம் தாழ்வான பகுதிகளில் நீர் தேங்கியது.',
      hi: 'अड्यार नदी पुल और कोट्टूरपुरम के निचले इलाकों में पिछले मानसून के दौरान बाढ़ आई थी।',
    },
    advice: {
      en: 'Stay away from river bank roads and use Sardar Patel Road on higher ground.',
      ta: 'ஆற்றங்கரை சாலைகளைத் தவிர்த்து சர்தார் படேல் சாலையைப் பயன்படுத்தவும்.',
      hi: 'नदी किनारे की सड़कों से दूर रहें और सरदार पटेल रोड का उपयोग करें।',
    },
    rainMmPerHr: 64,
    elevationMeters: 3.8,
  },
  {
    id: 'mylapore',
    name: { en: 'Mylapore', ta: 'மயிலாப்பூர்', hi: 'मायलापुर' },
    pincode: '600004',
    risk: 'PRONE',
    waterArrivalText: {
      en: 'Slow water drainage expected in 1 hour 30 minutes',
      ta: '1 மணி 30 நிமிடங்களில் மழைநீர் மெதுவாக வடியும் நிலை ஏற்படலாம்',
      hi: '1 घंटे 30 मिनट में सड़कों पर पानी जमा हो सकता है',
    },
    historicalNote: {
      en: 'Streets around Luz Corner and Canal Bank Road often hold ankle-deep water after steady rain.',
      ta: 'லஸ் கார்னர் மற்றும் கால்வாய் கரை சாலைகளில் தொடர் மழைக்குப் பின் நீர் தேங்குவது வழக்கம்.',
      hi: 'लज़ कॉर्नर और कैनाल बैंक रोड के पास लगातार बारिश के बाद पानी जमा हो जाता है।',
    },
    advice: {
      en: 'Walk carefully along Canal Bank Road and take R.K. Salai for travel.',
      ta: 'கால்வாய் கரை சாலையைத் தவிர்த்து ஆர்.கே. சாலையைப் பயன்படுத்தவும்.',
      hi: 'कैनाल बैंक रोड से बचें और यात्रा के लिए आर.के. सलाई चुनें।',
    },
    rainMmPerHr: 42,
    elevationMeters: 7.1,
  },
  {
    id: 'tambaram',
    name: { en: 'Tambaram & Mudichur', ta: 'தாம்பரம் & முடிச்சூர்', hi: 'तांबरम और मुदिचूर' },
    pincode: '600045',
    risk: 'DANGER',
    waterArrivalText: {
      en: 'Lake overflow water may reach low roads in 50 minutes',
      ta: 'ஏரி உபரி நீர் 50 நிமிடங்களில் தாழ்வான சாலைகளை அடையலாம்',
      hi: 'झील का पानी 50 मिनट में निचली सड़कों तक पहुँच सकता है',
    },
    historicalNote: {
      en: 'Mudichur Road and West Tambaram low pockets have a strong history of waterlogging during heavy rain.',
      ta: 'கனமழையின் போது முடிச்சூர் சாலை மற்றும் மேற்கு தாம்பரம் தாழ்வான பகுதிகளில் நீர் தேங்கிய வரலாறு உள்ளது.',
      hi: 'तेज़ बारिश में मुदिचूर रोड और वेस्ट तांबरम के निचले इलाकों में जलभराव का पुराना रिकॉर्ड है।',
    },
    advice: {
      en: 'Use the GST Road flyover and move ground-floor valuables to a higher shelf.',
      ta: 'ஜி.எஸ்.டி சாலை மேம்பாலத்தைப் பயன்படுத்தவும், முக்கியப் பொருட்களை உயரமான இடத்தில் வைக்கவும்.',
      hi: 'जीएसटी रोड फ्लाईओवर का उपयोग करें और ज़रूरी सामान ऊँची जगह पर रखें।',
    },
    rainMmPerHr: 71,
    elevationMeters: 4.5,
  },
  {
    id: 'annanagar',
    name: { en: 'Anna Nagar', ta: 'அண்ணா நகர்', hi: 'अन्ना नगर' },
    pincode: '600040',
    risk: 'SAFE',
    waterArrivalText: {
      en: 'Streets are dry and draining well right now',
      ta: 'தற்போது தெருக்கள் பாதுகாப்பாகவும் நீர் தேங்காமலும் உள்ளன',
      hi: 'अभी सड़कें सूखी और पूरी तरह सुरक्षित हैं',
    },
    historicalNote: {
      en: 'Higher street elevation and wide storm drains keep 2nd Avenue and 3rd Avenue safe during moderate rain.',
      ta: 'உயரமான சாலை அமைப்பால் 2வது மற்றும் 3வது நிழற்சாலைகள் பாதுகாப்பாக உள்ளன.',
      hi: 'ऊँची सड़क और बड़े नालों के कारण दूसरी और तीसरी एवेन्यू सुरक्षित रहती हैं।',
    },
    advice: {
      en: 'Your area is safe right now. We will notify you immediately if rain increases.',
      ta: 'உங்கள் பகுதி தற்போது பாதுகாப்பாக உள்ளது. மழை அதிகரித்தால் உடனே தகவல் தருவோம்.',
      hi: 'आपका इलाका अभी सुरक्षित है। बारिश बढ़ने पर हम तुरंत सूचित करेंगे।',
    },
    rainMmPerHr: 24,
    elevationMeters: 11.4,
  },
];

export const INITIAL_AUTO_GOV_REPORTS: AutoGovReport[] = [
  {
    id: 'gov-1',
    refId: 'GCC-AUTO-8041',
    areaId: 'velachery',
    areaName: { en: 'Velachery South', ta: 'வேளச்சேரி தெற்கு', hi: 'वेलाचेरी साउथ' },
    streetName: {
      en: 'Vijayanagar 2nd Main Road & Lake Bund',
      ta: 'விஜயநகர் 2வது பிரதான சாலை & ஏரிக்கரை',
      hi: 'विजयनगर दूसरी मुख्य सड़क और झील किनारा',
    },
    risk: 'DANGER',
    predictedIn: {
      en: 'Predicted 45 minutes before flooding',
      ta: 'வெள்ளத்திற்கு 45 நிமிடங்களுக்கு முன்பே கணிக்கப்பட்டது',
      hi: 'पानी भरने से 45 मिनट पहले अनुमानित',
    },
    historicalBasis: {
      en: 'Flooded 4 times in 5 years + heavy rain forecast',
      ta: '5 ஆண்டுகளில் 4 முறை வெள்ளம் + கனமழை முன்னறிவிப்பு',
      hi: '5 साल में 4 बार बाढ़ + तेज़ बारिश का पूर्वानुमान',
    },
    govActionStatus: {
      en: 'Greater Chennai Corporation • 2 water pumps dispatched',
      ta: 'சென்னை மாநகராட்சி • 2 மோட்டார் பம்புகள் அனுப்பப்பட்டன',
      hi: 'ग्रेटर चेन्नई कॉर्पोरेशन • 2 वाटर पंप भेजे गए',
    },
    sentTime: { en: 'Sent 6 mins ago', ta: '6 நிமிடங்களுக்கு முன்', hi: '6 मिनट पहले भेजा गया' },
    statusStage: 'ACTION_TAKEN',
  },
  {
    id: 'gov-2',
    refId: 'GCC-AUTO-8042',
    areaId: 'adyar',
    areaName: { en: 'Kotturpuram & Adyar Bank', ta: 'கோட்டூர்புரம் & அடையாறு கரை', hi: 'कोट्टूरपुरम और अड्यार किनारा' },
    streetName: {
      en: 'River View Road & Low Causeway',
      ta: 'ரிவர் வியூ சாலை & தாழ்வான பாலம்',
      hi: 'रिवर व्यू रोड और निचला पुल',
    },
    risk: 'DANGER',
    predictedIn: {
      en: 'Predicted 40 minutes before flooding',
      ta: 'வெள்ளத்திற்கு 40 நிமிடங்களுக்கு முன்பே கணிக்கப்பட்டது',
      hi: 'पानी भरने से 40 मिनट पहले अनुमानित',
    },
    historicalBasis: {
      en: 'Flooded 5 times in 5 years + heavy rain forecast',
      ta: '5 ஆண்டுகளில் 5 முறை வெள்ளம் + கனமழை முன்னறிவிப்பு',
      hi: '5 साल में 5 बार बाढ़ + तेज़ बारिश का पूर्वानुमान',
    },
    govActionStatus: {
      en: 'Greater Chennai Corporation • Reviewed by Ward Engineer',
      ta: 'சென்னை மாநகராட்சி • வார்டு பொறியாளரால் பார்க்கப்பட்டது',
      hi: 'ग्रेटर चेन्नई कॉर्पोरेशन • वार्ड इंजीनियर द्वारा देखा गया',
    },
    sentTime: { en: 'Sent 11 mins ago', ta: '11 நிமிடங்களுக்கு முன்', hi: '11 मिनट पहले भेजा गया' },
    statusStage: 'SEEN',
  },
  {
    id: 'gov-3',
    refId: 'GCC-AUTO-8043',
    areaId: 'tnagar',
    areaName: { en: 'T. Nagar West', ta: 'மேற்கு தி. நகர்', hi: 'टी. नगर वेस्ट' },
    streetName: {
      en: 'Madley Subway & South Usman Road',
      ta: 'மேட்லி சுரங்கப்பாதை & தெற்கு உஸ்மான் சாலை',
      hi: 'मैडली सबवे और साउथ उस्मान रोड',
    },
    risk: 'PRONE',
    predictedIn: {
      en: 'Predicted 1 hour 15 minutes before flooding',
      ta: '1 மணி 15 நிமிடங்களுக்கு முன்பே கணிக்கப்பட்டது',
      hi: '1 घंटे 15 मिनट पहले अनुमानित',
    },
    historicalBasis: {
      en: 'Flooded 3 times in 5 years + heavy rain forecast',
      ta: '5 ஆண்டுகளில் 3 முறை வெள்ளம் + கனமழை முன்னறிவிப்பு',
      hi: '5 साल में 3 बार बाढ़ + तेज़ बारिश का पूर्वानुमान',
    },
    govActionStatus: {
      en: 'Greater Chennai Corporation • Sent to Ward Control Room',
      ta: 'சென்னை மாநகராட்சி • கட்டுப்பாட்டு அறைக்கு அனுப்பப்பட்டது',
      hi: 'ग्रेटर चेन्नई कॉर्पोरेशन • कंट्रोल रूम को भेजा गया',
    },
    sentTime: { en: 'Sent 18 mins ago', ta: '18 நிமிடங்களுக்கு முன்', hi: '18 मिनट पहले भेजा गया' },
    statusStage: 'SENT',
  },
];

export const SAFE_ROUTE_PRESETS: SafeRoutePreset[] = [
  {
    id: 'velachery-to-annanagar',
    fromId: 'velachery',
    toId: 'annanagar',
    fromName: { en: 'Velachery', ta: 'வேளச்சேரி', hi: 'वेलाचेरी' },
    toName: { en: 'Anna Nagar', ta: 'அண்ணா நகர்', hi: 'अन्ना नगर' },
    safestTimeMin: 28,
    safestDistanceKm: 13.8,
    shortestTimeMin: 21,
    shortestDistanceKm: 10.4,
    avoidedStreetsCount: 3,
    avoidedStreets: {
      en: [
        'Velachery Main Road Underpass (Flood danger)',
        'Kotturpuram Low Bridge (Flood danger)',
        'Madley Subway in T. Nagar (Flood-prone)',
      ],
      ta: [
        'வேளச்சேரி பிரதான சாலை சுரங்கப்பாதை (வெள்ள ஆபத்து)',
        'கோட்டூர்புரம் தாழ்வான பாலம் (வெள்ள ஆபத்து)',
        'தி. நகர் மேட்லி சுரங்கப்பாதை (வெள்ள வாய்ப்பு)',
      ],
      hi: [
        'वेलाचेरी मेन रोड अंडरपास (बाढ़ का खतरा)',
        'कोट्टूरपुरम निचला पुल (बाढ़ का खतरा)',
        'टी. नगर मैडली सबवे (जलभराव संभावित)',
      ],
    },
    safeViaStreets: {
      en: [
        'Start on Vijayanagar Flyover (High ground)',
        'Continue via Guindy Kathipara Cloverleaf',
        'Take 100 Feet Road (Jawaharlal Nehru Salai) to Anna Nagar',
      ],
      ta: [
        'விஜயநகர் மேம்பாலம் வழியாகப் புறப்படவும் (மேடான சாலை)',
        'கிண்டி கத்திப்பாரா மேம்பாலம் வழியாகச் செல்லவும்',
        '100 அடி சாலை வழியாக அண்ணா நகரைப் பாதுகாப்பாக அடையவும்',
      ],
      hi: [
        'विजयनगर फ्लाईओवर से शुरू करें (ऊँची सड़क)',
        'गिंडी कातिपारा फ्लाईओवर से आगे बढ़ें',
        '100 फीट रोड से होते हुए सुरक्षित अन्ना नगर पहुँचें',
      ],
    },
    whySafest: {
      en: 'Adds 7 minutes but stays completely on elevated flyovers and wide high-ground roads so you do not get stranded.',
      ta: '7 நிமிடங்கள் கூடுதலாக எடுத்தாலும், மேம்பாலங்கள் மற்றும் உயரமான சாலைகளில் செல்வதால் வெள்ளத்தில் சிக்கும் ஆபத்து இல்லை.',
      hi: 'इसमें 7 मिनट अधिक लगते हैं लेकिन यह पूरी तरह ऊँचे फ्लाईओवर और सुरक्षित सड़कों से जाता है ताकि आप कहीं न फँसें।',
    },
    whyShortestRisky: {
      en: 'Shortest route goes through 2 deep underpasses and 1 river bridge that regularly flood during heavy rain.',
      ta: 'குறுகிய பாதை 2 சுரங்கப்பாதைகள் மற்றும் 1 ஆற்றுப் பாலம் வழியாகச் செல்கிறது; இவை மழையில் மூழ்கும் ஆபத்து உள்ளது.',
      hi: 'सबसे छोटा रास्ता 2 गहरे अंडरपास और 1 नदी पुल से गुज़रता है जहाँ बारिश में अक्सर पानी भर जाता है।',
    },
  },
  {
    id: 'tnagar-to-adyar',
    fromId: 'tnagar',
    toId: 'adyar',
    fromName: { en: 'T. Nagar', ta: 'தி. நகர்', hi: 'टी. नगर' },
    toName: { en: 'Adyar High Ground', ta: 'அடையாறு மேடான பகுதி', hi: 'अड्यार ऊँचा इलाका' },
    safestTimeMin: 19,
    safestDistanceKm: 7.2,
    shortestTimeMin: 13,
    shortestDistanceKm: 4.9,
    avoidedStreetsCount: 2,
    avoidedStreets: {
      en: [
        'South Usman Road Low Stretch (Flood-prone)',
        'Kotturpuram River Bank Road (Flood danger)',
      ],
      ta: [
        'தெற்கு உஸ்மான் தாழ்வான சாலை (வெள்ள வாய்ப்பு)',
        'கோட்டூர்புரம் ஆற்றங்கரை சாலை (வெள்ள ஆபத்து)',
      ],
      hi: [
        'साउथ उस्मान रोड निचला हिस्सा (जलभराव संभावित)',
        'कोट्टूरपुरम नदी किनारा रोड (बाढ़ का खतरा)',
      ],
    },
    safeViaStreets: {
      en: [
        'Take North Usman Flyover onto Anna Salai (Mount Road)',
        'Follow Little Mount Elevated Road',
        'Turn onto Sardar Patel Road to reach Adyar safely',
      ],
      ta: [
        'வடக்கு உஸ்மான் மேம்பாலம் வழியாக அண்ணா சாலையை அடையவும்',
        'சின்னமலை மேம்பாலச் சாலையில் தொடரவும்',
        'சர்தார் படேல் சாலை வழியாக அடையாறைப் பாதுகாப்பாக அடையவும்',
      ],
      hi: [
        'नॉर्थ उस्मान फ्लाईओवर से अन्ना सलाई (माउंट रोड) पर जाएँ',
        'लिटिल माउंट एलिवेटेड रोड पर आगे बढ़ें',
        'सरदार पटेल रोड से सुरक्षित अड्यार पहुँचें',
      ],
    },
    whySafest: {
      en: 'Steers clear of the Adyar River low bank and travels along wide, well-drained Anna Salai and Sardar Patel Road.',
      ta: 'அடையாறு ஆற்றங்கரை தாழ்வான சாலையைத் தவிர்த்து, அகலமான அண்ணா சாலை மற்றும் சர்தார் படேல் சாலை வழியாகச் செல்கிறது.',
      hi: 'यह अड्यार नदी के निचले किनारे से बचता है और चौड़ी, सुरक्षित अन्ना सलाई तथा सरदार पटेल रोड से जाता है।',
    },
    whyShortestRisky: {
      en: 'Shortest cut through Kotturpuram dips close to the river where water rises rapidly.',
      ta: 'கோட்டூர்புரம் வழியான குறுகிய பாதை ஆற்றின் அருகே தாழ்வாகச் செல்வதால் நீர் வேகமாகச் சூழும்.',
      hi: 'कोट्टूरपुरम वाला छोटा रास्ता नदी के बहुत करीब और नीचा है जहाँ पानी तेज़ी से बढ़ता है।',
    },
  },
  {
    id: 'tambaram-to-mylapore',
    fromId: 'tambaram',
    toId: 'mylapore',
    fromName: { en: 'Tambaram', ta: 'தாம்பரம்', hi: 'तांबरम' },
    toName: { en: 'Mylapore', ta: 'மயிலாப்பூர்', hi: 'मायलापुर' },
    safestTimeMin: 36,
    safestDistanceKm: 21.5,
    shortestTimeMin: 29,
    shortestDistanceKm: 17.8,
    avoidedStreetsCount: 3,
    avoidedStreets: {
      en: [
        'Pallavaram Low Subway (Flood-prone)',
        'Velachery Bypass Lake Stretch (Flood danger)',
        'Canal Bank Road in Mandaveli (Flood-prone)',
      ],
      ta: [
        'பல்லாவரம் சுரங்கப்பாதை (வெள்ள வாய்ப்பு)',
        'வேளச்சேரி ஏரி புறவழிச்சாலை (வெள்ள ஆபத்து)',
        'மந்தைவெளி கால்வாய் கரை சாலை (வெள்ள வாய்ப்பு)',
      ],
      hi: [
        'पल्लावरम सबवे (जलभराव संभावित)',
        'वेलाचेरी झील बायपास (बाढ़ का खतरा)',
        'मंदावेली कैनाल बैंक रोड (जलभराव संभावित)',
      ],
    },
    safeViaStreets: {
      en: [
        'Take GST Road Elevated Corridor from Tambaram',
        'Continue straight on Anna Salai past Guindy',
        'Take R.K. Salai high road into Mylapore',
      ],
      ta: [
        'தாம்பரத்திலிருந்து ஜி.எஸ்.டி மேம்பாலச் சாலையில் செல்லவும்',
        'கிண்டியைத் தாண்டி அண்ணா சாலையில் நேராகச் செல்லவும்',
        'ஆர்.கே. சாலை வழியாக மயிலாப்பூரைப் பாதுகாப்பாக அடையவும்',
      ],
      hi: [
        'तांबरम से जीएसटी रोड एलिवेटेड कॉरिडोर लें',
        'गिंडी के आगे अन्ना सलाई पर सीधे चलें',
        'आर.के. सलाई ऊँची सड़क से सुरक्षित मायलापुर पहुँचें',
      ],
    },
    whySafest: {
      en: 'Avoids the Velachery lake basin completely and keeps you on main arterial highways with flyovers.',
      ta: 'வேளச்சேரி ஏரிப் பள்ளத்தைத் தவிர்த்து முக்கிய நெடுஞ்சாலை மற்றும் மேம்பாலங்கள் வழியாகப் பாதுகாப்பாக அழைத்துச் செல்கிறது.',
      hi: 'यह वेलाचेरी झील क्षेत्र से पूरी तरह बचता है और मुख्य हाईवे तथा फ्लाईओवर से सुरक्षित ले जाता है।',
    },
    whyShortestRisky: {
      en: 'Cutting through Velachery and Canal Bank Road crosses 3 low-lying water basins.',
      ta: 'வேளச்சேரி மற்றும் கால்வாய் கரை வழியான குறுகிய பாதை 3 நீர் தேங்கும் பள்ளங்களைக் கடக்கிறது.',
      hi: 'वेलाचेरी और कैनाल बैंक रोड वाला छोटा रास्ता 3 जलभराव वाले निचले इलाकों से गुज़रता है।',
    },
  },
];

export type FontScaleLevel = 'normal' | 'large' | 'xlarge';

interface ResQState {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  hasResolvedLocation: boolean;
  setHasResolvedLocation: (val: boolean) => void;
  trackedAreaId: string;
  setTrackedAreaId: (id: string) => void;
  userCoords: { lat: number; lng: number };
  setUserCoords: (lat: number, lng: number) => void;
  locationTrackingEnabled: boolean;
  setLocationTrackingEnabled: (val: boolean) => void;
  locationNotificationsEnabled: boolean;
  setLocationNotificationsEnabled: (val: boolean) => void;
  autoSendReportsEnabled: boolean;
  setAutoSendReportsEnabled: (val: boolean) => void;
  rainEffectEnabled: boolean;
  setRainEffectEnabled: (val: boolean) => void;
  toggleRainEffect: () => void;
  isPageWiping: boolean;
  fontScale: FontScaleLevel;
  cycleFontScale: () => void;
  setFontScale: (scale: FontScaleLevel) => void;
  notificationCardDismissed: boolean;
  dismissNotificationCard: () => void;
  activeBannerAlert: TriggeredFloodAlert | null;
  dismissBannerAlert: () => void;
  triggeredAlerts: TriggeredFloodAlert[];
  triggerFloodAlert: (alert: TriggeredFloodAlert) => void;
  clearTriggeredAlerts: () => void;
  restoreSampleAlerts: () => void;
  triggerDemoAlert: () => void;
  selectedRoutePresetId: string;
  setSelectedRoutePresetId: (id: string) => void;
  autoGovReports: AutoGovReport[];
  addAuthorityReport: (report: AutoGovReport) => void;
  citizenReports: CitizenManualReport[];
  addCitizenReport: (report: Omit<CitizenManualReport, 'id' | 'timeAgo' | 'status'>) => void;
  toast: { text: string; type: 'info' | 'success' | 'warning' } | null;
  showToast: (text: string, type?: 'info' | 'success' | 'warning') => void;
  ariaAnnouncement: string;
  announceToScreenReader: (msg: string) => void;
}

const getInitialTabFromUrl = (): NavTab => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/route') return 'route';
  if (path === '/alerts') return 'alerts';
  if (path === '/reports') return 'reports';
  return 'home';
};

export const INITIAL_TRIGGERED_ALERTS: TriggeredFloodAlert[] = [
  {
    id: 'alert-init-1',
    severity: 'DANGER',
    message: {
      en: 'Velachery Main Road Underpass may flood in about 40 minutes — take the Vijayanagar Flyover instead.',
      ta: 'வேளச்சேரி பிரதான சாலை சுரங்கப்பாதையில் சுமார் 40 நிமிடங்களில் நீர் தேங்கலாம் — விஜயநகர் மேம்பாலத்தைப் பயன்படுத்தவும்.',
      hi: 'वेलाचेरी मेन रोड अंडरपास में लगभग 40 मिनट में पानी भर सकता है — इसके बजाय विजयनगर फ्लाईओवर लें।',
    },
    time: 'Just now',
    timeLabel: {
      en: 'Current • Just now',
      ta: 'தற்போது • இப்போது',
      hi: 'वर्तमान • अभी',
    },
    isCurrent: true,
    zone: FLOOD_PRONE_ZONES[0],
    distanceMeters: 320,
  },
  {
    id: 'alert-init-2',
    severity: 'PRONE',
    message: {
      en: 'South Usman Road & Madley Subway may collect rainwater in about 70 minutes due to steady rain.',
      ta: 'தொடர் மழையால் தெற்கு உஸ்மான் சாலை மற்றும் மேட்லி சுரங்கப்பாதையில் சுமார் 70 நிமிடங்களில் நீர் தேங்கலாம்.',
      hi: 'लगातार बारिश से साउथ उस्मान रोड और मैडली सबवे में लगभग 70 मिनट में पानी जमा हो सकता है।',
    },
    time: '12 mins ago',
    timeLabel: {
      en: 'Current • 12 mins ago',
      ta: 'தற்போது • 12 நிமிடங்களுக்கு முன்',
      hi: 'वर्तमान • 12 मिनट पहले',
    },
    isCurrent: true,
    zone: FLOOD_PRONE_ZONES[6],
    distanceMeters: 540,
  },
  {
    id: 'alert-init-3',
    severity: 'DANGER',
    message: {
      en: 'Kotturpuram Low Bridge & Adyar River Bank saw rising water during evening heavy rain.',
      ta: 'மாலை நேர கனமழையின் போது கோட்டூர்புரம் தாழ்வான பாலம் மற்றும் அடையாறு ஆற்றங்கரையில் நீர்மட்டம் உயர்ந்தது.',
      hi: 'शाम की तेज़ बारिश के दौरान कोट्टूरपुरम निचले पुल और अड्यार नदी किनारे पानी का स्तर बढ़ा।',
    },
    time: 'Yesterday, 6:30 PM',
    timeLabel: {
      en: 'Past • Yesterday, 6:30 PM',
      ta: 'கடந்தது • நேற்று மாலை 6:30',
      hi: 'पिछला • कल शाम 6:30 बजे',
    },
    isCurrent: false,
    zone: FLOOD_PRONE_ZONES[9],
    distanceMeters: 1200,
  },
  {
    id: 'alert-init-4',
    severity: 'SAFE',
    message: {
      en: 'Anna Nagar 2nd Avenue storm drains cleared rainwater completely; streets are open and dry.',
      ta: 'அண்ணா நகர் 2வது நிழற்சாலை மழைநீர் வடிகால்கள் நீரை முழுமையாக வெளியேற்றின; சாலைகள் பாதுகாப்பாக உள்ளன.',
      hi: 'अन्ना नगर दूसरी एवेन्यू के नालों से बारिश का पानी पूरी तरह निकल गया; सड़कें खुली और सुरक्षित हैं।',
    },
    time: '2 days ago',
    timeLabel: {
      en: 'Past • 2 days ago',
      ta: 'கடந்தது • 2 நாட்களுக்கு முன்',
      hi: 'पिछला • 2 दिन पहले',
    },
    isCurrent: false,
    zone: FLOOD_PRONE_ZONES[22],
    distanceMeters: 2400,
  },
];

let demoZoneCursor = 0;

const applyRootFontScale = (scale: FontScaleLevel) => {
  if (typeof document === 'undefined') return;
  const pxMap: Record<FontScaleLevel, string> = {
    normal: '18px',
    large: '20px',
    xlarge: '22px',
  };
  document.documentElement.style.fontSize = pxMap[scale];
  document.documentElement.dataset.fontScale = scale;
};

const getInitialRainEnabled = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const saved = localStorage.getItem('resq_rain_enabled');
    return saved !== null ? saved === 'true' : true;
  } catch {
    return true;
  }
};

export const useResQStore = create<ResQState>((set, get) => ({
  activeTab: getInitialTabFromUrl(),
  setActiveTab: (tab) => {
    if (get().activeTab !== tab) {
      set({ isPageWiping: true });
      setTimeout(() => set({ isPageWiping: false }), 650);
    }
    set({ activeTab: tab });
    if (typeof window !== 'undefined') {
      const pathMap: Record<NavTab, string> = {
        home: '/',
        route: '/route',
        alerts: '/alerts',
        reports: '/reports',
      };
      const nextPath = pathMap[tab] || '/';
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, '', nextPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  hasResolvedLocation: false,
  setHasResolvedLocation: (val) => set({ hasResolvedLocation: val }),
  trackedAreaId: 'velachery',
  setTrackedAreaId: (id) => set({ trackedAreaId: id }),
  userCoords: { lat: 12.9784, lng: 80.2184 },
  setUserCoords: (lat, lng) => set({ userCoords: { lat, lng } }),
  locationTrackingEnabled: true,
  setLocationTrackingEnabled: (val) => set({ locationTrackingEnabled: val }),
  locationNotificationsEnabled: true,
  setLocationNotificationsEnabled: (val) => set({ locationNotificationsEnabled: val }),
  autoSendReportsEnabled: true,
  setAutoSendReportsEnabled: (val) => set({ autoSendReportsEnabled: val }),
  rainEffectEnabled: getInitialRainEnabled(),
  setRainEffectEnabled: (val) => {
    try {
      localStorage.setItem('resq_rain_enabled', String(val));
    } catch {}
    set({ rainEffectEnabled: val });
  },
  toggleRainEffect: () => {
    const next = !get().rainEffectEnabled;
    try {
      localStorage.setItem('resq_rain_enabled', String(next));
    } catch {}
    set({ rainEffectEnabled: next });
  },
  isPageWiping: false,
  fontScale: 'normal',
  cycleFontScale: () => {
    const order: FontScaleLevel[] = ['normal', 'large', 'xlarge'];
    const current = get().fontScale;
    const next = order[(order.indexOf(current) + 1) % order.length];
    applyRootFontScale(next);
    set({ fontScale: next });
  },
  setFontScale: (scale) => {
    applyRootFontScale(scale);
    set({ fontScale: scale });
  },
  notificationCardDismissed: false,
  dismissNotificationCard: () => set({ notificationCardDismissed: true }),
  activeBannerAlert: null,
  dismissBannerAlert: () => set({ activeBannerAlert: null }),
  triggeredAlerts: INITIAL_TRIGGERED_ALERTS,
  clearTriggeredAlerts: () => set({ triggeredAlerts: [] }),
  restoreSampleAlerts: () => set({ triggeredAlerts: INITIAL_TRIGGERED_ALERTS }),
  triggerFloodAlert: (alert) => {
    set((state) => {
      // Avoid duplicate consecutive alert for the exact same zone within the top slot
      const alreadyTop = state.triggeredAlerts[0]?.zone.id === alert.zone.id;
      const updatedList = alreadyTop
        ? [alert, ...state.triggeredAlerts.slice(1)]
        : [alert, ...state.triggeredAlerts];
      return {
        activeBannerAlert: alert,
        triggeredAlerts: updatedList,
        ariaAnnouncement: alert.message.en,
      };
    });

    // Fire browser Notification API if permission is granted and phone notifications are enabled
    if (
      get().locationNotificationsEnabled &&
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification('ResQ Grid • Chennai Flood Warning', {
          body: alert.message.en,
        });
      } catch {
        // Ignore Notification constructor errors on restricted environments
      }
    }
  },
  triggerDemoAlert: () => {
    const candidateZones = FLOOD_PRONE_ZONES.filter((z) => z.riskLevel !== 'SAFE');
    const chosenZone = candidateZones[demoZoneCursor % candidateZones.length];
    demoZoneCursor += 1;

    // Simulate user entering this zone's radius during high rainfall forecast
    const simulatedLat = chosenZone.lat + 0.0008;
    const simulatedLng = chosenZone.lng + 0.0008;
    set({
      userCoords: { lat: simulatedLat, lng: simulatedLng },
      trackedAreaId: chosenZone.areaId,
      hasResolvedLocation: true,
    });

    const predicted = predictNearbyFloodAlert(
      simulatedLat,
      simulatedLng,
      FLOOD_PRONE_ZONES,
      MOCK_RAINFALL_FORECAST
    );

    if (predicted) {
      get().triggerFloodAlert(predicted);
    }
  },
  selectedRoutePresetId: 'velachery-to-annanagar',
  setSelectedRoutePresetId: (id) => set({ selectedRoutePresetId: id }),
  autoGovReports: INITIAL_AUTO_GOV_REPORTS,
  addAuthorityReport: (report) => {
    set((state) => ({
      autoGovReports: [report, ...state.autoGovReports],
    }));
  },
  citizenReports: [
    {
      id: 'cit-1',
      areaName: 'Velachery',
      issueType: 'water_rising',
      note: 'Rainwater is ankle-deep near Vijayanagar bus stand.',
      timeAgo: '4 mins ago',
      status: 'Team on the way',
    },
    {
      id: 'cit-2',
      areaName: 'T. Nagar',
      issueType: 'blocked_drain',
      note: 'Plastic and leaves blocking the corner drain on Habibullah Road.',
      timeAgo: '14 mins ago',
      status: 'Sent to City Team',
    },
  ],
  addCitizenReport: (report) => {
    const newItem: CitizenManualReport = {
      ...report,
      id: `cit-${Date.now()}`,
      timeAgo: 'Just now',
      status: 'Sent to City Team',
    };
    set((state) => ({
      citizenReports: [newItem, ...state.citizenReports],
    }));
    get().showToast('Thank you! Your report was sent to the Chennai Flood Team.', 'success');
  },
  toast: null,
  showToast: (text, type = 'info') => {
    set({ toast: { text, type }, ariaAnnouncement: text });
    setTimeout(() => {
      set((state) => (state.toast?.text === text ? { toast: null } : state));
    }, 4500);
  },
  ariaAnnouncement: '',
  announceToScreenReader: (msg) => set({ ariaAnnouncement: msg }),
}));
