import React, { useState, useMemo, useEffect, Suspense, lazy, Component } from 'react';
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
      <span className="pill-safe inline-flex items-center gap-2 px-4 py-1.5 text-base">
        <CheckCircle2
          className="w-5 h-5 text-[#15803D] shrink-0"
          aria-hidden="true"
        />
        <span>{label}</span>
      </span>
    );
  }
  if (risk === 'PRONE') {
    return (
      <span className="pill-prone inline-flex items-center gap-2 px-4 py-1.5 text-base">
        <AlertTriangle
          className="w-5 h-5 text-[#B45309] shrink-0"
          aria-hidden="true"
        />
        <span>{label}</span>
      </span>
    );
  }
  return (
    <span className="pill-danger inline-flex items-center gap-2 px-4 py-1.5 text-base">
      <ShieldAlert
        className="w-5 h-5 text-[#B91C1C] shrink-0"
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
}

/**
 * Clean, friendly Light Illustration: Rain Cloud, Map Pin, and Protective Shield
 */
const HeroLightIllustration: React.FC = () => (
  <svg
    viewBox="0 0 320 180"
    className="w-56 sm:w-72 h-auto mx-auto"
    role="img"
    aria-label="Illustration of a rain cloud, location map pin, and safety shield"
  >
    <defs>
      <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="100%" stopColor="#BAE6FD" />
      </linearGradient>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="55%" stopColor="#0EA5E9" />
        <stop offset="100%" stopColor="#14B8A6" />
      </linearGradient>
    </defs>

    <circle cx="160" cy="92" r="76" fill="#EFF6FF" />

    {/* Rain Cloud */}
    <g transform="translate(55, 28)">
      <path
        d="M35 58 H115 A22 22 0 0 0 118 15 A32 32 0 0 0 58 10 A26 26 0 0 0 35 58 Z"
        fill="url(#cloudGrad)"
        stroke="#0EA5E9"
        strokeWidth="3"
      />
      <line
        x1="52"
        y1="68"
        x2="46"
        y2="82"
        stroke="#0EA5E9"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line
        x1="76"
        y1="68"
        x2="70"
        y2="82"
        stroke="#0EA5E9"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="68"
        x2="94"
        y2="82"
        stroke="#0EA5E9"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </g>

    {/* Protective Shield */}
    <g transform="translate(150, 48)">
      <path
        d="M44 8 L82 22 V56 C82 84 65 106 44 116 C23 106 6 84 6 56 V22 L44 8 Z"
        fill="url(#shieldGrad)"
        stroke="#FFFFFF"
        strokeWidth="4"
      />
      <path
        d="M30 62 L40 72 L60 50"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* Map Pin */}
    <g transform="translate(96, 72)">
      <path
        d="M28 4 C14 4 4 14 4 28 C4 46 28 68 28 68 C28 68 52 46 52 28 C52 14 42 4 28 4 Z"
        fill="#2563EB"
        stroke="#FFFFFF"
        strokeWidth="4"
      />
      <circle cx="28" cy="27" r="9" fill="#FFFFFF" />
    </g>
  </svg>
);

const LazyHeroPin3DCanvas = lazy(
  () => import('../components/home/HeroPin3DCanvas')
);

function checkWebGLAvailable(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ||
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

class Hero3DErrorBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const HomeHeroVisual: React.FC = () => {
  const [canRender3D, setCanRender3D] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const webglSupported = checkWebGLAvailable();

    const updateEligibility = () => {
      setCanRender3D(webglSupported && !mediaQuery.matches);
    };

    updateEligibility();
    mediaQuery.addEventListener('change', updateEligibility);
    return () => mediaQuery.removeEventListener('change', updateEligibility);
  }, []);

  if (!canRender3D) {
    return <HeroLightIllustration />;
  }

  return (
    <Hero3DErrorBoundary fallback={<HeroLightIllustration />}>
      <Suspense fallback={<HeroLightIllustration />}>
        <LazyHeroPin3DCanvas />
      </Suspense>
    </Hero3DErrorBoundary>
  );
};

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
      {/* Hero Question + Gently Floating 3D Map Pin/Drop/Shield (with flat SVG fallback) */}
      <section className="resq-card p-5 sm:p-10 text-center space-y-6 bg-gradient-to-b from-white to-[#F5F9FF]">
        <HomeHeroVisual />

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          {t.coreQuestion}
        </h1>

        {/* 1. First-visit Location Screen */}
        {!hasResolvedLocation && (
          <div className="max-w-xl mx-auto pt-1 space-y-5 p-5 sm:p-6 rounded-[20px] bg-white border-2 border-blue-100 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D4ED8]">
                {t.firstVisitTitle}
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                {t.firstVisitSub}
              </p>
            </div>

            {/* Single Main Action Button when location is not yet resolved */}
            <div>
              <button
                type="button"
                onClick={handleAllowLocation}
                disabled={isLocating}
                className="btn-main w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center gap-3 cursor-pointer"
              >
                <MapPin className="w-6 h-6 shrink-0" aria-hidden="true" />
                <span>{isLocating ? t.locatingText : t.allowLocationBtn}</span>
              </button>
            </div>

            {/* Small "Choose area manually" link (>= 16px) */}
            <div>
              <button
                type="button"
                onClick={() => setShowManualPicker((prev) => !prev)}
                className="text-base font-bold text-[#1D4ED8] underline underline-offset-4 hover:text-[#1E3A8A] cursor-pointer px-4 py-2"
              >
                {t.chooseManualLink}
              </button>
            </div>
          </div>
        )}

        {/* Inline Manual Area Switcher */}
        {showManualPicker && (
          <div className="max-w-3xl mx-auto p-5 rounded-[20px] bg-white border-2 border-blue-200 space-y-3 text-left">
            <span className="text-lg font-extrabold text-slate-900 block">
              {t.manualPickerTitle}
            </span>
            <div className="flex flex-wrap gap-2.5">
              {CHENNAI_AREAS.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => applyAreaLocation(area.id)}
                  className={`px-4 py-2.5 rounded-[16px] font-bold text-lg cursor-pointer border-2 ${
                    area.id === currentArea.id
                      ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                      : 'bg-[#F5F9FF] text-slate-900 border-blue-200 hover:bg-blue-50'
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
                ? 'bg-red-50/90 border-[#EF4444]'
                : currentArea.risk === 'PRONE'
                ? 'bg-amber-50/90 border-[#F59E0B]'
                : 'bg-emerald-50/90 border-[#22C55E]'
            }`}
          >
            {/* Area Name + Change Area Link + Read Aloud Button */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <MapPin
                  className="w-7 h-7 text-[#1D4ED8] shrink-0"
                  aria-hidden="true"
                />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] bg-white hover:bg-blue-50 border-2 border-[#2563EB] text-[#1D4ED8] font-extrabold text-base shadow-sm cursor-pointer"
                >
                  {isReadingAloud ? (
                    <VolumeX className="w-5 h-5 shrink-0" aria-hidden="true" />
                  ) : (
                    <Volume2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                  )}
                  <span>
                    {isReadingAloud ? t.stopReadingBtn : t.readAloudBtn}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowManualPicker((prev) => !prev)}
                  className="text-base font-bold text-[#1D4ED8] underline underline-offset-4 hover:text-[#1E3A8A] cursor-pointer px-2 py-1"
                >
                  {t.changeAreaBtn}
                </button>
              </div>
            </div>

            {/* Big Status (SAFE / BE READY / DANGER LIKELY) with Icon and Colour */}
            <div className="flex items-center gap-3">
              {currentArea.risk === 'SAFE' && (
                <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-3 rounded-[20px] bg-white border-2 border-[#22C55E] text-[#15803D] shadow-sm">
                  <CheckCircle2
                    className="w-8 h-8 text-[#15803D] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {t.statusWords.SAFE}
                  </span>
                </div>
              )}
              {currentArea.risk === 'PRONE' && (
                <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-3 rounded-[20px] bg-white border-2 border-[#F59E0B] text-[#B45309] shadow-sm">
                  <AlertTriangle
                    className="w-8 h-8 text-[#B45309] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {t.statusWords.PRONE}
                  </span>
                </div>
              )}
              {currentArea.risk === 'DANGER' && (
                <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-3 rounded-[20px] bg-white border-2 border-[#EF4444] text-[#B91C1C] shadow-sm">
                  <ShieldAlert
                    className="w-8 h-8 text-[#B91C1C] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {t.statusWords.DANGER}
                  </span>
                </div>
              )}
            </div>

            {/* One Plain Sentence */}
            <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
              {t.statusSentences[currentArea.risk]}
            </p>

            {/* Small "Last checked just now" (>= 16px) */}
            <div className="flex items-center gap-2 text-base font-semibold text-slate-700 pt-1">
              <Clock
                className="w-5 h-5 text-[#1D4ED8] shrink-0"
                aria-hidden="true"
              />
              <span>{t.lastChecked}</span>
            </div>
          </div>

          {/* Friendly One-Time Notification Permission Card */}
          {!notificationCardDismissed && (
            <div className="p-5 sm:p-6 rounded-[20px] bg-blue-50/90 border-2 border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Bell
                  className="w-7 h-7 text-[#1D4ED8] shrink-0"
                  aria-hidden="true"
                />
                <p className="text-lg font-extrabold text-slate-900">
                  {t.notifPromptTitle}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleTurnOnNotifications}
                  className="btn-secondary inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{t.notifTurnOnBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={dismissNotificationCard}
                  className="text-base font-bold text-slate-700 hover:text-slate-900 px-3 py-2 cursor-pointer"
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
        {/* Card 1: Find a safe route (→ /route) */}
        <div className="resq-card resq-card-interactive p-6 sm:p-7 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-[16px] bg-blue-50 border border-blue-200 text-[#1D4ED8] flex items-center justify-center">
              <Navigation className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {t.cardRouteTitle}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              {t.cardRouteSub}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('route')}
            className={`${
              hasResolvedLocation ? 'btn-main' : 'btn-secondary'
            } w-full flex items-center justify-center gap-2 cursor-pointer`}
          >
            <span>{t.cardRouteTitle}</span>
            <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
          </button>
        </div>

        {/* Card 2: See my alerts (→ /alerts) */}
        <div className="resq-card resq-card-interactive p-6 sm:p-7 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-[16px] bg-sky-50 border border-sky-200 text-[#0369A1] flex items-center justify-center">
              <Bell className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {t.cardAlertsTitle}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              {t.cardAlertsSub}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className="btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.cardAlertsTitle}</span>
            <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
          </button>
        </div>

        {/* Card 3: Report a problem (→ /reports) */}
        <div className="resq-card resq-card-interactive p-6 sm:p-7 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-[16px] bg-teal-50 border border-teal-200 text-[#0F766E] flex items-center justify-center">
              <FileWarning className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {t.cardReportsTitle}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              {t.cardReportsSub}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className="btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.cardReportsTitle}</span>
            <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* 4. Small "Nearby risk" list of the 3 closest flood-prone spots with distance */}
      <section className="resq-card p-6 sm:p-8 space-y-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900">
            {t.nearbyRiskHeading}
          </h2>
          <p className="text-lg text-slate-700">{t.nearbyRiskSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {closestThreeZones.map(({ zone, distKm }) => (
            <div
              key={zone.id}
              className="p-5 rounded-[20px] bg-[#F5F9FF] border border-blue-100 flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                {renderRiskBadge(zone.riskLevel, t.statusWords[zone.riskLevel])}
                <h3 className="text-xl font-extrabold text-slate-900 pt-1">
                  {zone.name[lang]}
                </h3>
                <p className="text-base font-semibold text-slate-700">
                  {zone.reason[lang]}
                </p>
              </div>

              <div className="flex items-center gap-2 text-base font-bold text-[#1D4ED8] pt-1">
                <MapPin className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>{t.kmAway(distKm)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
