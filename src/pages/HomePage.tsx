import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Bell,
  FileWarning,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Clock,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  useResQStore,
  CHENNAI_AREAS,
  type CitizenRiskLevel,
} from '../store/useResQStore';
import {
  FLOOD_PRONE_ZONES,
  MOCK_RAINFALL_FORECAST,
  getDistanceMeters,
  predictNearbyFloodAlert,
} from '../data/floodZones';

type LangCode = 'en' | 'ta' | 'hi';

const AREA_DEFAULT_COORDS: Record<string, { lat: number; lng: number }> = {
  velachery: { lat: 12.9784, lng: 80.2184 },
  tnagar: { lat: 13.0352, lng: 80.2305 },
  adyar: { lat: 13.0168, lng: 80.2422 },
  mylapore: { lat: 13.0268, lng: 80.2614 },
  tambaram: { lat: 12.9192, lng: 80.0956 },
  annanagar: { lat: 13.085, lng: 80.2101 },
};

const HOME_COPY: Record<
  LangCode,
  {
    coreQuestion: string;
    firstVisitTitle: string;
    firstVisitSub: string;
    allowLocationBtn: string;
    locatingText: string;
    chooseManualLink: string;
    manualPickerTitle: string;
    chennaiSuffix: string;
    statusWords: Record<CitizenRiskLevel, string>;
    statusSentences: Record<CitizenRiskLevel, string>;
    lastChecked: string;
    changeAreaBtn: string;
    readAloudBtn: string;
    stopReadingBtn: string;
    notifPromptTitle: string;
    notifTurnOnBtn: string;
    notifDismissBtn: string;
    notifEnabledToast: string;
    cardRouteTitle: string;
    cardRouteSub: string;
    cardAlertsTitle: string;
    cardAlertsSub: string;
    cardReportsTitle: string;
    cardReportsSub: string;
    nearbyRiskHeading: string;
    nearbyRiskSub: string;
    kmAway: (km: string) => string;
    fallbackToast: string;
    locatedToast: string;
  }
> = {
  en: {
    coreQuestion: 'Is my area safe right now?',
    firstVisitTitle: 'Allow location so we can warn you early',
    firstVisitSub:
      'We check your Chennai street and tell you right away if flood water is likely nearby.',
    allowLocationBtn: 'Allow location',
    locatingText: 'Checking your location...',
    chooseManualLink: 'Choose area manually',
    manualPickerTitle: 'Select your area in Chennai:',
    chennaiSuffix: 'Chennai',
    statusWords: {
      SAFE: 'SAFE',
      PRONE: 'BE READY',
      DANGER: 'DANGER LIKELY',
    },
    statusSentences: {
      DANGER:
        'Heavy rain expected. Low-lying streets near you may flood in about 2 hours.',
      PRONE:
        'Steady rain expected. Low streets and subways near you may collect water in about 2 hours.',
      SAFE:
        'Streets near you are dry and safe right now. We will warn you early if heavy rain starts.',
    },
    lastChecked: 'Last checked just now',
    changeAreaBtn: 'Change area',
    readAloudBtn: 'Read aloud',
    stopReadingBtn: 'Stop reading',
    notifPromptTitle: 'Turn on alerts so we can warn you before floods.',
    notifTurnOnBtn: 'Turn on alerts',
    notifDismissBtn: 'Not now',
    notifEnabledToast: 'Flood alerts turned on for your Chennai location.',
    cardRouteTitle: 'Find a safe route',
    cardRouteSub: 'Steer away from flooded streets and subways.',
    cardAlertsTitle: 'See my alerts',
    cardAlertsSub: 'Get early warnings before water reaches your street.',
    cardReportsTitle: 'Report a problem',
    cardReportsSub: 'See automatic city reports or report a flooded street.',
    nearbyRiskHeading: 'Nearby risk (3 closest flood-prone spots)',
    nearbyRiskSub:
      'Closest flood-prone streets to your location based on past 5 years:',
    kmAway: (km) => `${km} km away`,
    fallbackToast:
      'Using Velachery, Chennai so you can see nearby flood warnings.',
    locatedToast:
      'Location connected: showing live status for Velachery, Chennai.',
  },
  ta: {
    coreQuestion: 'என் பகுதி இப்போது பாதுகாப்பாக உள்ளதா?',
    firstVisitTitle: 'முன்கூட்டியே எச்சரிக்க இருப்பிட அனுமதியை வழங்கவும்',
    firstVisitSub:
      'உங்கள் சென்னைப் பகுதியைச் சரிபார்த்து அருகில் வெள்ள அபாயம் உள்ளதா என்பதை உடனே தெரிவிக்கிறோம்.',
    allowLocationBtn: 'இருப்பிடத்தை அனுமதிக்கவும்',
    locatingText: 'இருப்பிடத்தைச் சரிபார்க்கிறது...',
    chooseManualLink: 'பகுதியை நீங்களே தேர்ந்தெடுக்கவும்',
    manualPickerTitle: 'சென்னையில் உங்கள் பகுதியைத் தேர்ந்தெடுக்கவும்:',
    chennaiSuffix: 'சென்னை',
    statusWords: {
      SAFE: 'பாதுகாப்பு',
      PRONE: 'தயாராக இருங்கள்',
      DANGER: 'வெள்ள ஆபத்து',
    },
    statusSentences: {
      DANGER:
        'கனமழை எதிர்பார்க்கப்படுகிறது. உங்களுக்கு அருகிலுள்ள தாழ்வான தெருக்களில் சுமார் 2 மணி நேரத்தில் நீர் தேங்கலாம்.',
      PRONE:
        'தொடர் மழை எதிர்பார்க்கப்படுகிறது. சுரங்கப்பாதைகள் மற்றும் தாழ்வான தெருக்களில் சுமார் 2 மணி நேரத்தில் நீர் தேங்கலாம்.',
      SAFE:
        'உங்கள் பகுதி தற்போது பாதுகாப்பாக உள்ளது. கனமழை தொடங்கினால் முன்கூட்டியே எச்சரிப்போம்.',
    },
    lastChecked: 'இப்போதுதான் சரிபார்க்கப்பட்டது',
    changeAreaBtn: 'பகுதியை மாற்ற',
    readAloudBtn: 'சத்தமாகப் படி',
    stopReadingBtn: 'நிறுத்து',
    notifPromptTitle:
      'வெள்ளத்திற்கு முன்பே உங்களை எச்சரிக்க அறிவிப்புகளை இயக்கவும்.',
    notifTurnOnBtn: 'அறிவிப்புகளை இயக்கு',
    notifDismissBtn: 'இப்போது வேண்டாம்',
    notifEnabledToast: 'வெள்ள எச்சரிக்கை அறிவிப்புகள் இயக்கப்பட்டன.',
    cardRouteTitle: 'பாதுகாப்பான பாதையைக் கண்டறியவும்',
    cardRouteSub: 'வெள்ளம் சூழ்ந்த தெருக்களைத் தவிர்த்துப் பயணிக்கவும்.',
    cardAlertsTitle: 'என் எச்சரிக்கைகளைப் பார்க்கவும்',
    cardAlertsSub: 'தெருவில் நீர் தேங்கும் முன்பே எச்சரிக்கை பெறுங்கள்.',
    cardReportsTitle: 'பிரச்சனையைப் புகாரளிக்கவும்',
    cardReportsSub: 'தானியங்கி அரசுப் புகார்கள் மற்றும் உங்கள் தெருப் புகார்கள்.',
    nearbyRiskHeading:
      'அருகிலுள்ள வெள்ள அபாய இடங்கள் (மிக அருகிலுள்ள 3 இடங்கள்)',
    nearbyRiskSub:
      'கடந்த 5 ஆண்டு வெள்ளத் தரவுகளின் அடிப்படையில் அருகிலுள்ள இடங்கள்:',
    kmAway: (km) => `${km} கி.மீ தொலைவில்`,
    fallbackToast: 'வேளச்சேரி, சென்னை இருப்பிடம் தேர்ந்தெடுக்கப்பட்டது.',
    locatedToast: 'இருப்பிடம் இணைக்கப்பட்டது: வேளச்சேரி, சென்னை.',
  },
  hi: {
    coreQuestion: 'क्या मेरा इलाका अभी सुरक्षित है?',
    firstVisitTitle: 'समय से पहले चेतावनी के लिए लोकेशन की अनुमति दें',
    firstVisitSub:
      'हम आपके चेन्नई इलाके की जाँच करके तुरंत बताते हैं कि आस-पास बाढ़ का खतरा है या नहीं।',
    allowLocationBtn: 'लोकेशन की अनुमति दें',
    locatingText: 'आपका स्थान जाँचा जा रहा है...',
    chooseManualLink: 'अपना इलाका खुद चुनें',
    manualPickerTitle: 'चेन्नई में अपना इलाका चुनें:',
    chennaiSuffix: 'चेन्नई',
    statusWords: {
      SAFE: 'सुरक्षित',
      PRONE: 'तैयार रहें',
      DANGER: 'बाढ़ का खतरा',
    },
    statusSentences: {
      DANGER:
        'तेज़ बारिश की संभावना है। आपके पास की निचली गलियों में लगभग 2 घंटे में पानी भर सकता है।',
      PRONE:
        'लगातार बारिश की संभावना है। पास के सबवे और निचली सड़कों में लगभग 2 घंटे में पानी जमा हो सकता है।',
      SAFE:
        'आपके पास की सड़कें अभी सूखी और सुरक्षित हैं। तेज़ बारिश होने पर हम पहले ही सचेत कर देंगे।',
    },
    lastChecked: 'अभी जाँचा गया',
    changeAreaBtn: 'इलाका बदलें',
    readAloudBtn: 'बोलकर सुनाएँ',
    stopReadingBtn: 'पढ़ना रोकें',
    notifPromptTitle: 'बाढ़ से पहले चेतावनी पाने के लिए अलर्ट चालू करें।',
    notifTurnOnBtn: 'अलर्ट चालू करें',
    notifDismissBtn: 'अभी नहीं',
    notifEnabledToast:
      'आपके चेन्नई स्थान के लिए बाढ़ अलर्ट चालू कर दिए गए हैं।',
    cardRouteTitle: 'सुरक्षित रास्ता खोजें',
    cardRouteSub: 'बाढ़ वाली सड़कों और सबवे से बचकर निकलें।',
    cardAlertsTitle: 'मेरी चेतावनियाँ देखें',
    cardAlertsSub: 'सड़क पर पानी भरने से पहले सूचना पाएँ।',
    cardReportsTitle: 'समस्या रिपोर्ट करें',
    cardReportsSub:
      'सरकार को भेजी गई ऑटो रिपोर्ट देखें या अपनी समस्या बताएँ।',
    nearbyRiskHeading: 'आस-पास का जोखिम (सबसे नज़दीकी 3 जलभराव स्थान)',
    nearbyRiskSub:
      'पिछले 5 वर्षों के बाढ़ रिकॉर्ड के आधार पर आपके सबसे पास के स्थान:',
    kmAway: (km) => `${km} किमी दूर`,
    fallbackToast: 'वेलाचेरी, चेन्नई का बाढ़ पूर्वानुमान दिखाया जा रहा है।',
    locatedToast: 'स्थान जुड़ गया: वेलाचेरी, चेन्नई की स्थिति दिखाई जा रही है।',
  },
};

export function renderRiskBadge(risk: CitizenRiskLevel, label: string) {
  if (risk === 'SAFE') {
    return (
      <span className="pill-safe inline-flex items-center gap-2 px-3.5 py-1 text-sm">
        <CheckCircle2
          className="w-4 h-4 text-[#11694A] shrink-0"
          aria-hidden="true"
        />
        <span>{label}</span>
      </span>
    );
  }
  if (risk === 'PRONE') {
    return (
      <span className="pill-prone inline-flex items-center gap-2 px-3.5 py-1 text-sm">
        <AlertTriangle
          className="w-4 h-4 text-[#8B3E03] shrink-0"
          aria-hidden="true"
        />
        <span>{label}</span>
      </span>
    );
  }
  return (
    <span className="pill-danger inline-flex items-center gap-2 px-3.5 py-1 text-sm">
      <ShieldAlert
        className="w-4 h-4 text-[#8B1A1E] shrink-0"
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
}

/**
 * Cute "Claymorphism" Pinterest-style Rainy-Day Scene (Pure inline SVG)
 */
const ClaymorphismHeroScene: React.FC = () => (
  <div
    aria-hidden="true"
    className="w-56 sm:w-72 md:w-80 h-auto mx-auto select-none pointer-events-none"
  >
    <svg
      viewBox="0 0 340 220"
      className="w-full h-auto overflow-visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft Claymorphism Gradients with light source from top-left */}
        <linearGradient id="heroCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#F0F6FF" />
          <stop offset="100%" stopColor="#DCEBFF" />
        </linearGradient>

        <linearGradient id="heroUmbrellaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8DEFF" />
          <stop offset="60%" stopColor="#D4C4FF" />
          <stop offset="100%" stopColor="#C9B8FF" />
        </linearGradient>

        <linearGradient id="heroPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9BAA" />
          <stop offset="50%" stopColor="#F67B8D" />
          <stop offset="100%" stopColor="#F2677A" />
        </linearGradient>

        <linearGradient id="heroShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D8F5E6" />
          <stop offset="55%" stopColor="#BCEFD9" />
          <stop offset="100%" stopColor="#A9E4D0" />
        </linearGradient>

        <radialGradient id="heroPuddleGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E6F1FF" />
          <stop offset="70%" stopColor="#CFE3FF" />
          <stop offset="100%" stopColor="#BED7FF" />
        </radialGradient>

        {/* Soft pastel blurred clay drop shadows */}
        <filter id="clayShadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#90B2E8" floodOpacity="0.30" />
        </filter>
        <filter id="clayShadowPin" x="-25%" y="-20%" width="150%" height="145%">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#F2677A" floodOpacity="0.32" />
        </filter>
        <filter id="clayShadowShield" x="-25%" y="-20%" width="150%" height="145%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#70C8A8" floodOpacity="0.30" />
        </filter>
      </defs>

      {/* 5. Soft Pastel Puddle at bottom in baby blue (#CFE3FF) + 3 expanding white ripple rings */}
      <g>
        <ellipse
          cx="170"
          cy="194"
          rx="118"
          ry="17"
          fill="url(#heroPuddleGrad)"
        />
        {/* Ripple rings expanding every ~3s */}
        <ellipse
          cx="165"
          cy="194"
          rx="44"
          ry="7"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeOpacity="0.75"
          className="hero-ripple-pulse"
          style={{ transformOrigin: '165px 194px', animation: 'heroRipplePulse 3s ease-out infinite', animationDelay: '0s' }}
        />
        <ellipse
          cx="165"
          cy="194"
          rx="74"
          ry="11"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeOpacity="0.55"
          className="hero-ripple-pulse"
          style={{ transformOrigin: '165px 194px', animation: 'heroRipplePulse 3s ease-out infinite', animationDelay: '1s' }}
        />
        <ellipse
          cx="165"
          cy="194"
          rx="98"
          ry="14"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeOpacity="0.38"
          className="hero-ripple-pulse"
          style={{ transformOrigin: '165px 194px', animation: 'heroRipplePulse 3s ease-out infinite', animationDelay: '2s' }}
        />
      </g>

      {/* 6. Sparkles/Stars (3 tiny stars in butter yellow #FFF2C4 and blush #FFDDE8) */}
      <path
        d="M 50,44 Q 50,50 44,50 Q 50,50 50,56 Q 50,50 56,50 Q 50,50 50,44 Z"
        fill="#FFF2C4"
        className="hero-sparkle"
        style={{ transformOrigin: '50px 50px', animation: 'heroSparkleTwinkle 3.2s ease-in-out infinite', animationDelay: '0s' }}
      />
      <path
        d="M 284,36 Q 284,43 277,43 Q 284,43 284,50 Q 284,43 291,43 Q 284,43 284,36 Z"
        fill="#FFDDE8"
        className="hero-sparkle"
        style={{ transformOrigin: '284px 43px', animation: 'heroSparkleTwinkle 3.8s ease-in-out infinite', animationDelay: '1.2s' }}
      />
      <path
        d="M 276,156 Q 276,162 270,162 Q 276,162 276,168 Q 276,162 282,162 Q 276,162 276,156 Z"
        fill="#FFF2C4"
        className="hero-sparkle"
        style={{ transformOrigin: '276px 162px', animation: 'heroSparkleTwinkle 2.9s ease-in-out infinite', animationDelay: '2s' }}
      />

      {/* 2. Lavender Umbrella (#C9B8FF with lighter #E8DEFF highlight & coral #F2677A handle tip, tilted 12°) */}
      <g
        className="hero-float-umbrella"
        style={{
          transformOrigin: '78px 105px',
          animation: 'heroFloatUmbrella 4.8s ease-in-out infinite alternate',
        }}
      >
        <g transform="translate(42, 60)">
          {/* Umbrella Canopy */}
          <path
            d="M 6,40 Q 18,10 46,6 Q 74,10 86,40 Q 76,36 66,40 Q 56,36 46,40 Q 36,36 26,40 Q 16,36 6,40 Z"
            fill="url(#heroUmbrellaGrad)"
            filter="url(#clayShadow)"
          />
          {/* Highlight arc on canopy */}
          <path
            d="M 18,30 Q 28,14 46,12"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />
          {/* Rib line */}
          <path
            d="M 46,6 Q 46,24 46,40"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          {/* Finial */}
          <circle cx="46" cy="4" r="3" fill="#E8DEFF" />
          {/* Shaft */}
          <line
            x1="46"
            y1="40"
            x2="46"
            y2="76"
            stroke="#6B6A8A"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* J-Handle with Coral #F2677A Tip */}
          <path
            d="M 46,76 A 7,7 0 0,1 32,76"
            fill="none"
            stroke="#6B6A8A"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="32" cy="76" r="3.5" fill="#F2677A" />
        </g>
      </g>

      {/* 1. Fluffy White-and-Baby-Blue Cloud in centre-top + 5 falling raindrops */}
      <g
        className="hero-float-cloud"
        style={{
          animation: 'heroFloatCloud 6s ease-in-out infinite alternate',
        }}
      >
        {/* Main Puffy Cloud Body */}
        <path
          d="M 116,68 A 24,24 0 0,1 138,40 A 34,34 0 0,1 192,30 A 30,30 0 0,1 234,52 A 22,22 0 0,1 230,80 L 118,80 A 18,18 0 0,1 116,68 Z"
          fill="url(#heroCloudGrad)"
          filter="url(#clayShadow)"
        />
        {/* Inner white glossy highlights on cloud puffs */}
        <path
          d="M 134,44 A 20,20 0 0,1 176,34"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />
        <path
          d="M 198,40 A 18,18 0 0,1 224,54"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />

        {/* 5 Falling Raindrops (pastel blue & periwinkle) */}
        <g
          className="hero-drop-fall"
          style={{ animation: 'heroRainDropFall 2.8s ease-in infinite', animationDelay: '0s' }}
        >
          <path
            d="M 132,88 C 134,91 135,93 135,95 C 135,97 133.5,98.5 132,98.5 C 130.5,98.5 129,97 129,95 C 129,93 130,91 132,88 Z"
            fill="#8FA8FF"
          />
        </g>
        <g
          className="hero-drop-fall"
          style={{ animation: 'heroRainDropFall 2.8s ease-in infinite', animationDelay: '0.6s' }}
        >
          <path
            d="M 154,92 C 156,95 157,97 157,99 C 157,101 155.5,102.5 154,102.5 C 152.5,102.5 151,101 151,99 C 151,97 152,95 154,92 Z"
            fill="#B7C4FF"
          />
        </g>
        <g
          className="hero-drop-fall"
          style={{ animation: 'heroRainDropFall 2.8s ease-in infinite', animationDelay: '1.2s' }}
        >
          <path
            d="M 176,86 C 178,89 179,91 179,93 C 179,95 177.5,96.5 176,96.5 C 174.5,96.5 173,95 173,93 C 173,91 174,89 176,86 Z"
            fill="#8FA8FF"
          />
        </g>
        <g
          className="hero-drop-fall"
          style={{ animation: 'heroRainDropFall 2.8s ease-in infinite', animationDelay: '1.8s' }}
        >
          <path
            d="M 198,90 C 200,93 201,95 201,97 C 201,99 199.5,100.5 198,100.5 C 196.5,100.5 195,99 195,97 C 195,95 196,93 198,90 Z"
            fill="#B7C4FF"
          />
        </g>
        <g
          className="hero-drop-fall"
          style={{ animation: 'heroRainDropFall 2.8s ease-in infinite', animationDelay: '2.3s' }}
        >
          <path
            d="M 218,87 C 220,90 221,92 221,94 C 221,96 219.5,97.5 218,97.5 C 216.5,97.5 215,96 215,94 C 215,92 216,90 218,87 Z"
            fill="#8FA8FF"
          />
        </g>
      </g>

      {/* 3. Round Coral-Pink Map Pin (#F2677A to #FF9BAA gradient) with small white droplet inside (Standing in front) */}
      <g
        className="hero-float-pin"
        style={{
          animation: 'heroFloatPin 5.6s ease-in-out infinite alternate',
        }}
      >
        <g transform="translate(116, 96)">
          {/* Pin Body */}
          <path
            d="M 32,4 C 16,4 4,16 4,32 C 4,50 28,78 32,82 C 36,78 60,50 60,32 C 60,16 48,4 32,4 Z"
            fill="url(#heroPinGrad)"
            filter="url(#clayShadowPin)"
          />
          {/* Glossy highlight arc on upper-left curve */}
          <path
            d="M 16,24 C 20,12 30,8 40,8"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
          {/* Small white droplet inside */}
          <path
            d="M 32,20 C 37,27 41,31 41,36 C 41,41 37,45 32,45 C 27,45 23,41 23,36 C 23,31 27,27 32,20 Z"
            fill="#FFFFFF"
          />
        </g>
      </g>

      {/* 4. Mint Shield (#A9E4D0 with white check mark) at right, slightly overlapping pin */}
      <g
        className="hero-float-shield"
        style={{
          animation: 'heroFloatShield 6.2s ease-in-out infinite alternate',
        }}
      >
        <g transform="translate(182, 104)">
          {/* Shield Body */}
          <path
            d="M 28,6 L 52,15 V 38 C 52,56 40,70 28,76 C 16,70 4,56 4,38 V 15 L 28,6 Z"
            fill="url(#heroShieldGrad)"
            filter="url(#clayShadowShield)"
          />
          {/* Glossy top-left highlight */}
          <path
            d="M 12,18 L 28,12 L 42,16"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
          {/* Rounded White Check Mark */}
          <path
            d="M 19,40 L 25,46 L 38,32"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  </div>
);

export const HomePage: React.FC = () => {
  const { i18n } = useTranslation();
  const {
    setActiveTab,
    hasResolvedLocation,
    setHasResolvedLocation,
    trackedAreaId,
    setTrackedAreaId,
    userCoords,
    setUserCoords,
    notificationCardDismissed,
    dismissNotificationCard,
    setLocationNotificationsEnabled,
    triggerFloodAlert,
    showToast,
  } = useResQStore();

  const [isLocating, setIsLocating] = useState(false);
  const [showManualPicker, setShowManualPicker] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  const rawLang = (i18n.language || 'en').slice(0, 2);
  const lang: LangCode = rawLang === 'ta' || rawLang === 'hi' ? rawLang : 'en';
  const t = HOME_COPY[lang];

  const currentArea =
    CHENNAI_AREAS.find((a) => a.id === trackedAreaId) || CHENNAI_AREAS[0];

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Read-aloud on the Home status card using the Web Speech API
  const handleToggleReadAloud = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast(
        `${currentArea.name[lang]}, ${t.chennaiSuffix}: ${t.statusWords[currentArea.risk]}. ${t.statusSentences[currentArea.risk]}`,
        'info'
      );
      return;
    }

    if (isReadingAloud) {
      window.speechSynthesis.cancel();
      setIsReadingAloud(false);
      return;
    }

    window.speechSynthesis.cancel();
    const spokenText = `${currentArea.name[lang]}, ${t.chennaiSuffix}. ${t.statusWords[currentArea.risk]}. ${t.statusSentences[currentArea.risk]}`;
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang =
      lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsReadingAloud(false);
    utterance.onerror = () => setIsReadingAloud(false);

    setIsReadingAloud(true);
    window.speechSynthesis.speak(utterance);
  };

  // Dynamically compute the 3 closest flood-prone spots from the 25-zone dataset
  const closestThreeZones = useMemo(() => {
    return FLOOD_PRONE_ZONES.filter((z) => z.riskLevel !== 'SAFE')
      .map((zone) => {
        const distMeters = getDistanceMeters(
          userCoords.lat,
          userCoords.lng,
          zone.lat,
          zone.lng
        );
        return {
          zone,
          distKm: (distMeters / 1000).toFixed(1),
          distMeters,
        };
      })
      .sort((a, b) => a.distMeters - b.distMeters)
      .slice(0, 3);
  }, [userCoords.lat, userCoords.lng]);

  const applyAreaLocation = (areaId: string, toastMessage?: string) => {
    const coords = AREA_DEFAULT_COORDS[areaId] || AREA_DEFAULT_COORDS.velachery;
    setTrackedAreaId(areaId);
    setUserCoords(coords.lat, coords.lng);
    setHasResolvedLocation(true);
    setShowManualPicker(false);

    if (toastMessage) {
      showToast(toastMessage, 'info');
    }

    const predicted = predictNearbyFloodAlert(
      coords.lat,
      coords.lng,
      FLOOD_PRONE_ZONES,
      MOCK_RAINFALL_FORECAST
    );
    if (predicted) {
      triggerFloodAlert(predicted);
    }
  };

  const handleAllowLocation = () => {
    setIsLocating(true);
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const { latitude, longitude } = pos.coords;
          const isInsideChennai =
            latitude >= 12.8 &&
            latitude <= 13.25 &&
            longitude >= 80.0 &&
            longitude <= 80.35;

          if (isInsideChennai) {
            setUserCoords(latitude, longitude);
            setTrackedAreaId('velachery');
            setHasResolvedLocation(true);
            showToast(t.locatedToast, 'success');
          } else {
            applyAreaLocation('velachery', t.fallbackToast);
          }
        },
        () => {
          setIsLocating(false);
          applyAreaLocation('velachery', t.fallbackToast);
        },
        { timeout: 3500 }
      );
    } else {
      setIsLocating(false);
      applyAreaLocation('velachery', t.fallbackToast);
    }
  };

  const handleTurnOnNotifications = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch {
        // Ignore if blocked by browser
      }
    }
    setLocationNotificationsEnabled(true);
    dismissNotificationCard();
    showToast(t.notifEnabledToast, 'success');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Hero Question + Cute Pinterest-Style Claymorphism Rainy-Day Illustration */}
      <section className="resq-card p-5 sm:p-10 text-center space-y-6 bg-gradient-to-b from-white to-[#FFF9F4] border-2 border-[#2B2A4C]/10">
        <ClaymorphismHeroScene />

        <h1 className="text-2xl sm:text-[30px] font-extrabold text-[#2B2A4C] tracking-tight">
          {t.coreQuestion}
        </h1>

        {/* 1. First-visit Location Screen */}
        {!hasResolvedLocation && (
          <div className="max-w-xl mx-auto pt-1 space-y-5 p-5 sm:p-6 rounded-[20px] bg-white border-2 border-[#E8DEFF] shadow-xs">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#2B2A4C]">
                {t.firstVisitTitle}
              </h2>
              <p className="text-[15px] text-[#6B6A8A] leading-relaxed">
                {t.firstVisitSub}
              </p>
            </div>

            {/* Single Main Action Button when location is not yet resolved */}
            <div>
              <button
                type="button"
                onClick={handleAllowLocation}
                disabled={isLocating}
                className="btn-main w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center gap-3 cursor-pointer text-[15px]"
              >
                <MapPin className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>{isLocating ? t.locatingText : t.allowLocationBtn}</span>
              </button>
            </div>

            {/* Small "Choose area manually" link (14px) */}
            <div>
              <button
                type="button"
                onClick={() => setShowManualPicker((prev) => !prev)}
                className="text-sm font-bold text-[#F2677A] underline underline-offset-4 hover:text-[#DE5568] cursor-pointer px-4 py-2"
              >
                {t.chooseManualLink}
              </button>
            </div>
          </div>
        )}

        {/* Inline Manual Area Switcher */}
        {showManualPicker && (
          <div className="max-w-3xl mx-auto p-5 rounded-[20px] bg-white border-2 border-[#E8DEFF] space-y-3 text-left">
            <span className="text-base font-extrabold text-[#2B2A4C] block">
              {t.manualPickerTitle}
            </span>
            <div className="flex flex-wrap gap-2.5">
              {CHENNAI_AREAS.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => applyAreaLocation(area.id)}
                  className={`px-4 py-2.5 rounded-[16px] font-bold text-[15px] cursor-pointer border-2 ${
                    area.id === currentArea.id
                      ? 'bg-[#F2677A] text-white border-[#F2677A]'
                      : 'bg-[#FFF9F4] text-[#2B2A4C] border-[#2B2A4C]/15 hover:bg-[#E8DEFF]'
                  }`}
                >
                  {area.name[lang]}, {t.chennaiSuffix}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. Main Status Card (Large) with Read-Aloud (Web Speech API) */}
        <div className="text-left max-w-3xl mx-auto pt-1 space-y-4">
          <div
            className={`p-5 sm:p-8 rounded-[20px] border-2 space-y-5 ${
              currentArea.risk === 'DANGER'
                ? 'bg-[#FFDDE8] border-[#E5484D]'
                : currentArea.risk === 'PRONE'
                ? 'bg-[#FFE3D3] border-[#F59A4A]'
                : 'bg-[#D8F5E6] border-[#34C38F]'
            }`}
          >
            {/* Area Name + Change Area Link + Read Aloud Button */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <MapPin
                  className="w-6 h-6 text-[#F2677A] shrink-0"
                  aria-hidden="true"
                />
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#2B2A4C]">
                  {currentArea.name[lang]}, {t.chennaiSuffix}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Web Speech API Read-Aloud Button */}
                <button
                  id="home-status-read-aloud"
                  type="button"
                  onClick={handleToggleReadAloud}
                  aria-pressed={isReadingAloud}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[14px] bg-white hover:bg-[#FFF9F4] border-2 border-[#2B2A4C]/15 text-[#2B2A4C] font-extrabold text-sm shadow-xs cursor-pointer"
                >
                  {isReadingAloud ? (
                    <VolumeX className="w-4 h-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>
                    {isReadingAloud ? t.stopReadingBtn : t.readAloudBtn}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowManualPicker((prev) => !prev)}
                  className="text-sm font-bold text-[#F2677A] underline underline-offset-4 hover:text-[#DE5568] cursor-pointer px-2 py-1"
                >
                  {t.changeAreaBtn}
                </button>
              </div>
            </div>

            {/* Big Status (SAFE / BE READY / DANGER LIKELY) with Icon and Colour */}
            <div className="flex items-center gap-3">
              {currentArea.risk === 'SAFE' && (
                <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 rounded-[20px] bg-white border-2 border-[#34C38F] text-[#11694A] shadow-xs">
                  <CheckCircle2
                    className="w-7 h-7 text-[#34C38F] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {t.statusWords.SAFE}
                  </span>
                </div>
              )}
              {currentArea.risk === 'PRONE' && (
                <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 rounded-[20px] bg-white border-2 border-[#F59A4A] text-[#8B3E03] shadow-xs">
                  <AlertTriangle
                    className="w-7 h-7 text-[#F59A4A] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {t.statusWords.PRONE}
                  </span>
                </div>
              )}
              {currentArea.risk === 'DANGER' && (
                <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 rounded-[20px] bg-white border-2 border-[#E5484D] text-[#8B1A1E] shadow-xs">
                  <ShieldAlert
                    className="w-7 h-7 text-[#E5484D] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {t.statusWords.DANGER}
                  </span>
                </div>
              )}
            </div>

            {/* One Plain Sentence */}
            <p className="text-lg sm:text-xl font-bold text-[#2B2A4C] leading-relaxed">
              {t.statusSentences[currentArea.risk]}
            </p>

            {/* Small "Last checked just now" (14px) */}
            <div className="flex items-center gap-2 text-sm font-semibold text-[#6B6A8A] pt-1">
              <Clock
                className="w-4 h-4 text-[#6B6A8A] shrink-0"
                aria-hidden="true"
              />
              <span>{t.lastChecked}</span>
            </div>
          </div>

          {/* Friendly One-Time Notification Permission Card */}
          {!notificationCardDismissed && (
            <div className="p-5 sm:p-6 rounded-[20px] bg-[#E8DEFF] border-2 border-[#D5C2FF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Bell
                  className="w-6 h-6 text-[#F2677A] shrink-0"
                  aria-hidden="true"
                />
                <p className="text-base font-extrabold text-[#2B2A4C]">
                  {t.notifPromptTitle}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleTurnOnNotifications}
                  className="btn-secondary inline-flex items-center gap-2 cursor-pointer text-[15px]"
                >
                  <span>{t.notifTurnOnBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={dismissNotificationCard}
                  className="text-sm font-bold text-[#6B6A8A] hover:text-[#2B2A4C] px-3 py-2 cursor-pointer"
                >
                  {t.notifDismissBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Three Big Action Cards (Max 3 cards per row) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Find a safe route (→ /route) - Pastel Baby Blue */}
        <div className="resq-card resq-card-interactive p-6 sm:p-7 flex flex-col justify-between gap-6 bg-[#DCEBFF] border-2 border-[#BACFFF]">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-[16px] bg-white border border-[#BACFFF] text-[#2B2A4C] flex items-center justify-center">
              <Navigation className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#2B2A4C]">
              {t.cardRouteTitle}
            </h2>
            <p className="text-[15px] text-[#2B2A4C]/80 leading-relaxed">
              {t.cardRouteSub}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('route')}
            className={`${
              hasResolvedLocation ? 'btn-main' : 'btn-secondary'
            } w-full flex items-center justify-center gap-2 cursor-pointer text-[15px]`}
          >
            <span>{t.cardRouteTitle}</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </div>

        {/* Card 2: See my alerts (→ /alerts) - Pastel Lavender */}
        <div className="resq-card resq-card-interactive p-6 sm:p-7 flex flex-col justify-between gap-6 bg-[#E8DEFF] border-2 border-[#D5C2FF]">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-[16px] bg-white border border-[#D5C2FF] text-[#2B2A4C] flex items-center justify-center">
              <Bell className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#2B2A4C]">
              {t.cardAlertsTitle}
            </h2>
            <p className="text-[15px] text-[#2B2A4C]/80 leading-relaxed">
              {t.cardAlertsSub}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className="btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer text-[15px]"
          >
            <span>{t.cardAlertsTitle}</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </div>

        {/* Card 3: Report a problem (→ /reports) - Pastel Mint */}
        <div className="resq-card resq-card-interactive p-6 sm:p-7 flex flex-col justify-between gap-6 bg-[#D8F5E6] border-2 border-[#B4E8CC]">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-[16px] bg-white border border-[#B4E8CC] text-[#2B2A4C] flex items-center justify-center">
              <FileWarning className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#2B2A4C]">
              {t.cardReportsTitle}
            </h2>
            <p className="text-[15px] text-[#2B2A4C]/80 leading-relaxed">
              {t.cardReportsSub}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className="btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer text-[15px]"
          >
            <span>{t.cardReportsTitle}</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* 4. Small "Nearby risk" list of the 3 closest flood-prone spots with distance */}
      <section className="resq-card p-6 sm:p-8 space-y-5 bg-white border-2 border-[#2B2A4C]/10">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#2B2A4C]">
            {t.nearbyRiskHeading}
          </h2>
          <p className="text-[15px] text-[#6B6A8A]">{t.nearbyRiskSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {closestThreeZones.map(({ zone, distKm }, idx) => {
            const pastelBg =
              idx === 0
                ? 'bg-[#FFE3D3] border-[#F7CBB6]'
                : idx === 1
                ? 'bg-[#FFDDE8] border-[#F5C5D4]'
                : 'bg-[#FFF2C4] border-[#F2E09E]';

            return (
              <div
                key={zone.id}
                className={`p-5 rounded-[20px] border-2 flex flex-col justify-between gap-3 ${pastelBg}`}
              >
                <div className="space-y-2">
                  {renderRiskBadge(zone.riskLevel, t.statusWords[zone.riskLevel])}
                  <h3 className="text-base sm:text-lg font-extrabold text-[#2B2A4C] pt-1">
                    {zone.name[lang]}
                  </h3>
                  <p className="text-sm font-semibold text-[#6B6A8A]">
                    {zone.reason[lang]}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold text-[#F2677A] pt-1">
                  <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t.kmAway(distKm)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
