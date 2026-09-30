import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@maplibre/maplibre-gl-leaflet';
import {
  Navigation,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Flag,
  Info,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  CHENNAI_ROAD_NODES,
  SAMPLE_TRIP_PRESETS,
  computeSafestAndShortestRoutes,
  getAllRoadSegmentsForMap,
  getRiskGradeInfo,
} from '../data/chennaiRoadGraph';
import { useResQStore } from '../store/useResQStore';

type LangCode = 'en' | 'ta' | 'hi';

const SELECTABLE_NODES = Object.values(CHENNAI_ROAD_NODES).filter(
  (n) => n.isSelectablePlace
);

const ROUTE_TEXT: Record<
  LangCode,
  {
    pageTitle: string;
    fromLabel: string;
    toLabel: string;
    swapLabel: string;
    sampleTripsLabel: string;
    findSafestBtn: string;
    shortestHeading: string;
    shortestWarningBadge: string;
    shortestSummary: (min: number, count: number) => string;
    safestHeading: string;
    recommendedBadge: string;
    safestSummary: (min: number) => string;
    startSafeRouteBtn: string;
    hideStepsBtn: string;
    underMapLine: string;
    legendGradeClear: string;
    legendGradeLow: string;
    legendGradeProne: string;
    legendGradeFlooded: string;
    legendShortest: string;
    legendSafest: string;
    turnByTurnTitle: string;
    stepMinKm: (min: number, km: number) => string;
    routeUpdatedToast: string;
    tileFallbackNotice: string;
    worstSpotLabel: string;
    safeBypassLabel: string;
    safetyBarTitle: string;
    gradeClear: string;
    gradeLow: string;
    gradeProne: string;
    gradeFlooded: string;
  }
> = {
  en: {
    pageTitle: 'Safe Route',
    fromLabel: 'From',
    toLabel: 'To',
    swapLabel: 'Swap From and To',
    sampleTripsLabel: 'Sample trips:',
    findSafestBtn: 'Find safest route',
    shortestHeading: 'Shortest',
    shortestWarningBadge: 'Flood warning',
    shortestSummary: (min, count) =>
      `Shortest · ${min} min · passes ${count} flood-prone streets`,
    safestHeading: 'Safest',
    recommendedBadge: 'Recommended',
    safestSummary: (min) =>
      `Safest · ${min} min · avoids all flooded streets`,
    startSafeRouteBtn: 'Start safe route',
    hideStepsBtn: 'Hide turn-by-turn steps',
    underMapLine:
      "Instead of the shortest path, we steer you away from flooded or flood-prone streets so you don't get stranded.",
    legendGradeClear: '0-25% Clear',
    legendGradeLow: '26-50% Low risk',
    legendGradeProne: '51-75% Flood-prone',
    legendGradeFlooded: '76-100% Likely flooded',
    legendShortest: 'Shortest (dashed)',
    legendSafest: 'Safest route',
    turnByTurnTitle: 'Turn-by-Turn Safe Route (Big Text)',
    stepMinKm: (min, km) => `${min} min · ${km} km`,
    routeUpdatedToast: 'Safest high-ground route calculated using A* search.',
    tileFallbackNotice:
      'Light map fallback active (Esri Light Gray) — drawn Chennai roads and routes remain visible.',
    worstSpotLabel: 'Worst flood spot',
    safeBypassLabel: 'High ground bypass',
    safetyBarTitle: 'Route safety:',
    gradeClear: 'Clear',
    gradeLow: 'Low risk',
    gradeProne: 'Flood-prone',
    gradeFlooded: 'Likely flooded',
  },
  ta: {
    pageTitle: 'பாதுகாப்பான பாதை',
    fromLabel: 'புறப்படும் இடம்',
    toLabel: 'செல்லும் இடம்',
    swapLabel: 'இடங்களை மாற்றவும்',
    sampleTripsLabel: 'மாதிரிப் பயணங்கள்:',
    findSafestBtn: 'பாதுகாப்பான பாதையைக் கண்டறி',
    shortestHeading: 'குறுகிய பாதை',
    shortestWarningBadge: 'வெள்ள எச்சரிக்கை',
    shortestSummary: (min, count) =>
      `குறுகிய பாதை · ${min} நிமிடம் · ${count} வெள்ளத் தெருக்களைக் கடக்கிறது`,
    safestHeading: 'பாதுகாப்பான பாதை',
    recommendedBadge: 'பரிந்துரைக்கப்படுகிறது',
    safestSummary: (min) =>
      `பாதுகாப்பான பாதை · ${min} நிமிடம் · அனைத்து வெள்ளத் தெருக்களையும் தவிர்க்கிறது`,
    startSafeRouteBtn: 'பாதுகாப்பான பாதையைத் தொடங்கு',
    hideStepsBtn: 'வழிகாட்டுதலை மறைக்க',
    underMapLine:
      'குறுகிய பாதைக்குப் பதிலாக, வெள்ளம் தேங்கிய அல்லது வெள்ள வாய்ப்புள்ள தெருக்களைத் தவிர்த்து உங்களைப் பாதுகாப்பாக அழைத்துச் செல்கிறோம்.',
    legendGradeClear: '0-25% பாதுகாப்பு',
    legendGradeLow: '26-50% குறைந்த ஆபத்து',
    legendGradeProne: '51-75% வெள்ள வாய்ப்பு',
    legendGradeFlooded: '76-100% வெள்ள ஆபத்து',
    legendShortest: 'குறுகிய பாதை',
    legendSafest: 'பாதுகாப்பான பாதை',
    turnByTurnTitle: 'படிப்படியான பாதுகாப்பான வழிகாட்டுதல்',
    stepMinKm: (min, km) => `${min} நிமிடம் · ${km} கி.மீ`,
    routeUpdatedToast: 'பாதுகாப்பான மேடான பாதை கணக்கிடப்பட்டது.',
    tileFallbackNotice:
      'வரைபட மாற்று முறை செயல்பாட்டில் உள்ளது (Esri Light Gray) — சென்னை சாலைகள் தெளிவாகத் தெரியும்.',
    worstSpotLabel: 'அதிக வெள்ள அபாயப் புள்ளி',
    safeBypassLabel: 'பாதுகாப்பான மேடான மாற்றுப் பாதை',
    safetyBarTitle: 'பாதை பாதுகாப்பு:',
    gradeClear: 'பாதுகாப்பானது',
    gradeLow: 'குறைந்த ஆபத்து',
    gradeProne: 'வெள்ள வாய்ப்பு',
    gradeFlooded: 'வெள்ள ஆபத்து',
  },
  hi: {
    pageTitle: 'सुरक्षित रास्ता',
    fromLabel: 'कहाँ से',
    toLabel: 'कहाँ तक',
    swapLabel: 'स्थान बदलें',
    sampleTripsLabel: 'प्रमुख यात्राएँ:',
    findSafestBtn: 'सबसे सुरक्षित रास्ता खोजें',
    shortestHeading: 'सबसे छोटा',
    shortestWarningBadge: 'बाढ़ चेतावनी',
    shortestSummary: (min, count) =>
      `सबसे छोटा · ${min} मिनट · ${count} जलभराव वाली सड़कों से गुज़रता है`,
    safestHeading: 'सबसे सुरक्षित',
    recommendedBadge: 'सुझाया गया',
    safestSummary: (min) =>
      `सबसे सुरक्षित · ${min} मिनट · सभी बाढ़ वाली सड़कों से बचता है`,
    startSafeRouteBtn: 'सुरक्षित रास्ता शुरू करें',
    hideStepsBtn: 'दिशा-निर्देश छुपाएँ',
    underMapLine:
      'सबसे छोटे रास्ते के बजाय, हम आपको बाढ़ या जलभराव की संभावना वाली गलियों से दूर रखते हैं ताकि आप कहीं फँस न जाएँ।',
    legendGradeClear: '0-25% साफ़ सड़क',
    legendGradeLow: '26-50% कम जोखिम',
    legendGradeProne: '51-75% जलभराव संभावित',
    legendGradeFlooded: '76-100% बाढ़ की संभावना',
    legendShortest: 'सबसे छोटा (डैश)',
    legendSafest: 'सुरक्षित रास्ता',
    turnByTurnTitle: 'कदम-दर-कदम सुरक्षित रास्ता मार्गदर्शन',
    stepMinKm: (min, km) => `${min} मिनट · ${km} किमी`,
    routeUpdatedToast: 'सबसे सुरक्षित ऊँचा रास्ता तैयार है।',
    tileFallbackNotice:
      'मानचित्र बैकअप सक्रिय है (Esri Light Gray) — चेन्नई की सड़कें और सुरक्षित रास्ते दिखाई दे रहे हैं।',
    worstSpotLabel: 'सबसे गंभीर बाढ़ स्थल',
    safeBypassLabel: 'ऊँचा सुरक्षित बाईपास',
    safetyBarTitle: 'रास्ते की सुरक्षा:',
    gradeClear: 'साफ़ सड़क',
    gradeLow: 'कम जोखिम',
    gradeProne: 'जलभराव संभावित',
    gradeFlooded: 'बाढ़ की संभावना',
  },
};

export const SafeRoutePage: React.FC = () => {
  const { i18n } = useTranslation();
  const { showToast } = useResQStore();

  const rawLang = (i18n.language || 'en').slice(0, 2);
  const lang: LangCode = rawLang === 'ta' || rawLang === 'hi' ? rawLang : 'en';
  const t = ROUTE_TEXT[lang];

  const getGradeText = useCallback(
    (key: 'gradeClear' | 'gradeLow' | 'gradeProne' | 'gradeFlooded'): string => {
      return t[key];
    },
    [t]
  );

  // Defaults: "From" defaults to my location (Velachery), "To" defaults to Guindy
  const [fromId, setFromId] = useState<string>('velachery');
  const [toId, setToId] = useState<string>('guindy');
  const [selectedOption, setSelectedOption] = useState<'safest' | 'shortest'>('safest');
  const [showTurnByTurn, setShowTurnByTurn] = useState<boolean>(false);
  const [tileFallbackActive, setTileFallbackActive] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  // Run real A* over mock road graph of Chennai with 16-18 micro-segments
  const routes = useMemo(
    () => computeSafestAndShortestRoutes(fromId, toId),
    [fromId, toId]
  );

  // Background roads: mock network around trip
  const allRoadSegments = useMemo(
    () => getAllRoadSegmentsForMap(fromId, toId),
    [fromId, toId]
  );

  // Smooth fitBounds with padding for control card
  const fitMapToCurrentTrip = useCallback(
    (mapInstance: L.Map, animated = true) => {
      const allCoords = [
        ...routes.safest.coordinates,
        ...routes.shortest.coordinates,
      ];
      if (allCoords.length === 0) return;

      const lats = allCoords.map((c) => c[1]);
      const lngs = allCoords.map((c) => c[0]);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      const bounds = L.latLngBounds([
        [minLat, minLng],
        [maxLat, maxLng],
      ]);

      const isDesktop = window.innerWidth >= 1024;
      const paddingOptions: L.FitBoundsOptions = {
        paddingTopLeft: isDesktop ? [400, 40] : [20, 20],
        paddingBottomRight: isDesktop ? [40, 40] : [20, 260],
        maxZoom: 14,
        animate: animated,
      };

      mapInstance.fitBounds(bounds, paddingOptions);
    },
    [routes]
  );

  const handleSwap = () => {
    setFromId(toId);
    setToId(fromId);
  };

  const handleSelectPreset = (presetFrom: string, presetTo: string) => {
    setFromId(presetFrom);
    setToId(presetTo);
    setSelectedOption('safest');
  };

  const handleFindSafest = () => {
    setSelectedOption('safest');
    showToast(t.routeUpdatedToast, 'success');
    if (mapRef.current) {
      fitMapToCurrentTrip(mapRef.current, true);
    }
  };

  // Initialize Leaflet Map with keyless OpenFreeMap Positron (MapLibre GL) & Esri fallback
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || mapRef.current) return;

    // Centered on Chennai
    const map = L.map(container, {
      center: [12.998, 80.225],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    // Zoom control at top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Required Attribution control at bottom-right
    const attributionControl = L.control
      .attribution({
        position: 'bottomright',
        prefix: false,
      })
      .addTo(map);

    let baseLayer: L.Layer | null = null;

    // Keyless Esri Light Gray fallback
    const setupEsriFallback = () => {
      if (baseLayer && map.hasLayer(baseLayer)) {
        try {
          map.removeLayer(baseLayer);
        } catch {}
      }
      attributionControl.removeAttribution(
        'OpenFreeMap &copy; <a href="https://openmaptiles.org" target="_blank" rel="noreferrer">OpenMapTiles</a>, data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
      );
      attributionControl.addAttribution(
        'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
      );
      const esri = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 16,
          attribution: '',
        }
      );
      esri.addTo(map);
      baseLayer = esri;
      setTileFallbackActive(true);
    };

    // Check WebGL availability
    const hasWebGL = (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    })();

    if (hasWebGL && typeof (L as any).maplibreGL === 'function') {
      try {
        maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
        attributionControl.addAttribution(
          'OpenFreeMap &copy; <a href="https://openmaptiles.org" target="_blank" rel="noreferrer">OpenMapTiles</a>, data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
        );

        const glLayer = (L as any).maplibreGL({
          style: 'https://tiles.openfreemap.org/styles/positron',
          attributionControl: false,
        });

        glLayer.addTo(map);
        baseLayer = glLayer;

        const glMap = glLayer.getMaplibreMap();
        if (glMap) {
          glMap.on('error', (e: any) => {
            console.warn('OpenFreeMap Positron error, switching to Esri fallback', e);
            setupEsriFallback();
          });
        }
      } catch (err) {
        console.warn('Failed to load OpenFreeMap layer, using fallback', err);
        setupEsriFallback();
      }
    } else {
      setupEsriFallback();
    }

    const layersGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layersGroup;

    // Call map.invalidateSize() after mount and on window/container resize
    const handleResize = () => {
      map.invalidateSize();
    };

    const rafId = requestAnimationFrame(() => map.invalidateSize());
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 450);

    window.addEventListener('resize', handleResize);
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(container);
    }

    mapRef.current = map;

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      layersGroupRef.current = null;
    };
  }, []);

  // Draw Chennai road segments, multi-segment colour grading, and pins
  useEffect(() => {
    const map = mapRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Background roads: mock network faintly in same grade colours at low opacity
    allRoadSegments.forEach((seg) => {
      const latLngs = seg.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
      const grade = seg.riskGrade;

      // Soft pulsing red glow for flooded roads (76-100%)
      if (grade.grade === 'flooded') {
        L.polyline(latLngs, {
          color: '#EF4444',
          weight: 12,
          className: 'pulsing-flooded-glow',
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(group);
      }

      const bgLine = L.polyline(latLngs, {
        color: grade.color,
        weight: 4,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
      });

      bgLine.bindTooltip(
        `<div class="p-1 max-w-[220px]">
           <div class="font-extrabold text-sm" style="color: ${grade.color}">
             ${seg.streetName[lang]}
           </div>
           <div class="text-xs font-bold text-slate-800 mt-0.5">
             ${grade.percent}% flood risk · ${getGradeText(grade.labelKey)}
           </div>
           <div class="text-xs text-slate-600 mt-1 font-medium leading-snug">
             ${seg.reason[lang]}
           </div>
         </div>`,
        { direction: 'top', className: 'resq-segment-tooltip', opacity: 0.98 }
      );

      bgLine.addTo(group);
    });

    // 2. Shortest route: Thinner dashed line (5px), segment-coloured by risk grade
    routes.shortest.segments.forEach((seg) => {
      const latLngs = seg.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
      const grade = getRiskGradeInfo(seg.floodRisk);

      const poly = L.polyline(latLngs, {
        color: grade.color,
        weight: 5,
        dashArray: '6, 6',
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      });

      poly.bindTooltip(
        `<div class="p-1 max-w-[230px]">
           <div class="font-extrabold text-sm" style="color: ${grade.color}">
             ${seg.streetName[lang]}
           </div>
           <div class="text-xs font-bold text-slate-800 mt-0.5">
             Shortest · ${grade.percent}% flood risk · ${getGradeText(grade.labelKey)}
           </div>
           <div class="text-xs text-slate-600 mt-1 font-medium leading-snug">
             ${seg.reason[lang]}
           </div>
         </div>`,
        { direction: 'top', className: 'resq-segment-tooltip', opacity: 0.98 }
      );

      poly.addTo(group);
    });

    // 3. Safest route: Thick line (8px) with a white casing underneath, segment-coloured, with small animated direction arrows
    const safestFullLatLngs = routes.safest.coordinates.map(
      ([lng, lat]) => [lat, lng] as [number, number]
    );

    // 3a. White casing underneath so it stands out against the basemap
    L.polyline(safestFullLatLngs, {
      color: '#FFFFFF',
      weight: 12,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(group);

    // 3b. Segments coloured by risk grade
    routes.safest.segments.forEach((seg) => {
      const latLngs = seg.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
      const grade = getRiskGradeInfo(seg.floodRisk);

      const poly = L.polyline(latLngs, {
        color: grade.color,
        weight: 8,
        opacity: 0.98,
        lineCap: 'round',
        lineJoin: 'round',
      });

      poly.bindTooltip(
        `<div class="p-1 max-w-[230px]">
           <div class="font-extrabold text-sm" style="color: ${grade.color}">
             ${seg.streetName[lang]}
           </div>
           <div class="text-xs font-bold text-slate-800 mt-0.5">
             Safest · ${grade.percent}% flood risk · ${getGradeText(grade.labelKey)}
           </div>
           <div class="text-xs text-slate-600 mt-1 font-medium leading-snug">
             ${seg.reason[lang]}
           </div>
         </div>`,
        { direction: 'top', className: 'resq-segment-tooltip', opacity: 0.98 }
      );

      poly.addTo(group);
    });

    // 3c. Animated direction arrows overlay along the safest route
    L.polyline(safestFullLatLngs, {
      color: '#FFFFFF',
      weight: 3,
      className: 'animated-route-arrows',
      opacity: 0.85,
      lineCap: 'round',
    }).addTo(group);

    // 4. Small warning pin with icon on the worst segment the shortest route passes
    if (routes.shortest.worstSegment) {
      const worst = routes.shortest.worstSegment;
      const midCoord = worst.coordinates[Math.floor(worst.coordinates.length / 2)];
      const warnPinHtml = `
        <div style="transform: translate(-50%, -50%); cursor: pointer;" class="flex items-center justify-center">
          <div style="width: 28px; height: 28px; border-radius: 9999px; background-color: #EF4444; color: #FFFFFF; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.5); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 900; transition: transform 0.15s ease;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1.0)'">
            ⚠
          </div>
        </div>
      `;
      const warnMarker = L.marker([midCoord[1], midCoord[0]], {
        icon: L.divIcon({
          html: warnPinHtml,
          className: 'custom-pin-worst',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
        title: worst.streetName[lang],
      });
      warnMarker.bindTooltip(
        `<div class="p-1 max-w-[240px]">
           <div class="font-extrabold text-sm text-[#B91C1C] flex items-center gap-1.5">
             <span>⚠</span> <span>${t.worstSpotLabel}: ${worst.streetName[lang]}</span>
           </div>
           <div class="text-xs font-bold text-red-600 mt-1">
             ${Math.round(worst.floodRisk * 100)}% risk · Likely flooded
           </div>
           <div class="text-xs text-slate-700 mt-1 font-semibold leading-snug">
             ${worst.reason[lang]}
           </div>
         </div>`,
        { direction: 'top', className: 'resq-safe-tooltip', opacity: 0.98 }
      );
      warnMarker.addTo(group);
    }

    // 5. Small check pin where the safest route avoids it (high ground bypass)
    if (routes.safest.safestBypassSegment) {
      const bypass = routes.safest.safestBypassSegment;
      const midCoord = bypass.coordinates[Math.floor(bypass.coordinates.length / 2)];
      const checkPinHtml = `
        <div style="transform: translate(-50%, -50%); cursor: pointer;" class="flex items-center justify-center">
          <div style="width: 28px; height: 28px; border-radius: 9999px; background-color: #16A34A; color: #FFFFFF; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 10px rgba(22, 163, 74, 0.5); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; transition: transform 0.15s ease;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1.0)'">
            ✔
          </div>
        </div>
      `;
      const checkMarker = L.marker([midCoord[1], midCoord[0]], {
        icon: L.divIcon({
          html: checkPinHtml,
          className: 'custom-pin-safest',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
        title: bypass.streetName[lang],
      });
      checkMarker.bindTooltip(
        `<div class="p-1 max-w-[240px]">
           <div class="font-extrabold text-sm text-[#15803D] flex items-center gap-1.5">
             <span>✔</span> <span>${t.safeBypassLabel}: ${bypass.streetName[lang]}</span>
           </div>
           <div class="text-xs font-bold text-emerald-600 mt-1">
             ${Math.round(bypass.floodRisk * 100)}% risk · Clear high ground
           </div>
           <div class="text-xs text-slate-700 mt-1 font-semibold leading-snug">
             ${bypass.reason[lang]}
           </div>
         </div>`,
        { direction: 'top', className: 'resq-safe-tooltip', opacity: 0.98 }
      );
      checkMarker.addTo(group);
    }

    // 6. Start Pin
    const startCoord = routes.safest.coordinates[0];
    if (startCoord) {
      const startHtml = `<div style="transform: translate(-50%, -100%);" class="px-3 py-1 rounded-full bg-[#1D4ED8] text-white font-extrabold text-sm sm:text-base border-2 border-white shadow-md whitespace-nowrap flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>${
        CHENNAI_ROAD_NODES[fromId]?.name[lang] || 'Start'
      }</div>`;
      L.marker([startCoord[1], startCoord[0]], {
        icon: L.divIcon({
          html: startHtml,
          className: 'custom-map-marker',
          iconAnchor: [0, 0],
        }),
      }).addTo(group);
    }

    // 7. Goal Pin
    const endCoord = routes.safest.coordinates[routes.safest.coordinates.length - 1];
    if (endCoord) {
      const endHtml = `<div style="transform: translate(-50%, -100%);" class="px-3 py-1 rounded-full bg-[#0F766E] text-white font-extrabold text-sm sm:text-base border-2 border-white shadow-md whitespace-nowrap flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#34D399]"></span>${
        CHENNAI_ROAD_NODES[toId]?.name[lang] || 'Goal'
      }</div>`;
      L.marker([endCoord[1], endCoord[0]], {
        icon: L.divIcon({
          html: endHtml,
          className: 'custom-map-marker',
          iconAnchor: [0, 0],
        }),
      }).addTo(group);
    }

    fitMapToCurrentTrip(map, true);
  }, [allRoadSegments, fromId, toId, lang, routes, fitMapToCurrentTrip, t]);

  const shortestRiskCount = Math.max(1, routes.shortest.floodProneStreetsCount);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. MAP FRAME WITH EXPLICIT HEIGHT & CONTROL CARD INSIDE */}
      <div
        style={{ height: '70vh', minHeight: '580px' }}
        className="relative w-full rounded-[20px] overflow-hidden border-2 border-[#E8DEFF] shadow-soft bg-[#FFF9F4]"
      >
        {/* Leaflet Map Container (100% height of sized parent) */}
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '100%', minHeight: '70vh' }}
          className="w-full h-full z-0"
          aria-label="2D Safe Route Map of Chennai"
        />

        {/* Friendly Tile Fallback Message if External Vector Tiles Fail */}
        {tileFallbackActive && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#2B2A4C]/10 shadow-xs inline-flex items-center gap-2 text-sm font-bold text-[#2B2A4C]">
            <Info className="w-4 h-4 text-[#F2677A] shrink-0" aria-hidden="true" />
            <span>{t.tileFallbackNotice}</span>
          </div>
        )}

        {/* Map Legend with the Four Risk Grades + Route Styles */}
        <div className="absolute top-3 left-3 right-14 lg:top-auto lg:left-auto lg:bottom-6 lg:right-3 z-20 bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-[16px] border border-[#2B2A4C]/10 shadow-md flex flex-wrap items-center gap-x-3.5 gap-y-1.5 max-w-[calc(100%-80px)] lg:max-w-none">
          {/* 0-25% Clear */}
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#11694A]">
            <CheckCircle2 className="w-4 h-4 text-[#34C38F] shrink-0" aria-hidden="true" />
            <span>{t.legendGradeClear}</span>
          </span>
          {/* 26-50% Low risk */}
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7A4F01]">
            <AlertTriangle className="w-4 h-4 text-[#F5C451] shrink-0" aria-hidden="true" />
            <span>{t.legendGradeLow}</span>
          </span>
          {/* 51-75% Flood-prone */}
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#8B3E03]">
            <AlertTriangle className="w-4 h-4 text-[#F59A4A] shrink-0" aria-hidden="true" />
            <span>{t.legendGradeProne}</span>
          </span>
          {/* 76-100% Likely flooded */}
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#8B1A1E]">
            <ShieldAlert className="w-4 h-4 text-[#E5484D] shrink-0" aria-hidden="true" />
            <span>{t.legendGradeFlooded}</span>
          </span>
          {/* Safest route with arrows */}
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#2B2A4C]">
            <span
              className="w-5 h-2 rounded-full bg-[#34C38F] border border-white shadow-xs inline-block"
              aria-hidden="true"
            />
            <span>{t.legendSafest}</span>
          </span>
          {/* Shortest route dashed */}
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#6B6A8A]">
            <span
              className="w-5 h-0.5 border-b-2 border-dashed border-[#E5484D] inline-block"
              aria-hidden="true"
            />
            <span>{t.legendShortest}</span>
          </span>
        </div>

        {/* CONTROL CARD INSIDE MAP FRAME (Desktop: Left side, max-width 380px, scrollable inside; Mobile: Bottom sheet) */}
        <div className="absolute bottom-0 inset-x-0 max-h-[52%] lg:bottom-3 lg:top-3 lg:left-3 lg:right-auto lg:w-[380px] lg:max-w-[380px] lg:max-h-[calc(100%-24px)] z-20 overflow-y-auto bg-white rounded-t-[20px] lg:rounded-[20px] border-t-2 lg:border-2 border-[#E8DEFF] shadow-lg p-3.5 sm:p-4 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-[#2B2A4C] leading-tight">
              {t.pageTitle}
            </h1>
          </div>

          {/* 3 Sample Preset Trips */}
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-extrabold text-[#6B6A8A] block">
              {t.sampleTripsLabel}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_TRIP_PRESETS.map((preset) => {
                const isCurrent = fromId === preset.fromId && toId === preset.toId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.fromId, preset.toId)}
                    className={`px-3 py-1 rounded-[12px] text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#F2677A] text-white border-[#F2677A]'
                        : 'bg-[#FFF9F4] text-[#2B2A4C] border-[#2B2A4C]/15 hover:border-[#F2677A]'
                    }`}
                  >
                    {preset.label[lang]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two Inputs ("From" defaults to my location, "To") + Swap Button */}
          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-1.5">
              <div>
                <label
                  htmlFor="route-from-select"
                  className="text-xs sm:text-sm font-bold text-[#6B6A8A] block mb-0.5"
                >
                  {t.fromLabel}
                </label>
                <select
                  id="route-from-select"
                  value={fromId}
                  onChange={(e) => setFromId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-[12px] bg-[#FFF9F4] border-2 border-[#2B2A4C]/15 text-[15px] font-bold text-[#2B2A4C] focus:border-[#F2677A]"
                >
                  {SELECTABLE_NODES.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name[lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="route-to-select"
                  className="text-xs sm:text-sm font-bold text-[#6B6A8A] block mb-0.5"
                >
                  {t.toLabel}
                </label>
                <select
                  id="route-to-select"
                  value={toId}
                  onChange={(e) => setToId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-[12px] bg-[#FFF9F4] border-2 border-[#2B2A4C]/15 text-[15px] font-bold text-[#2B2A4C] focus:border-[#F2677A]"
                >
                  {SELECTABLE_NODES.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name[lang]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSwap}
              aria-label={t.swapLabel}
              title={t.swapLabel}
              className="w-10 h-10 rounded-[14px] bg-[#FFF9F4] hover:bg-[#E8DEFF] border-2 border-[#2B2A4C]/15 text-[#2B2A4C] flex items-center justify-center shrink-0 cursor-pointer mt-4"
            >
              <ArrowUpDown className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* "Find safest route" Action Button */}
          <button
            type="button"
            onClick={handleFindSafest}
            className="btn-secondary w-full flex items-center justify-center gap-2 py-2 cursor-pointer text-[15px]"
          >
            <Navigation className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.findSafestBtn}</span>
          </button>

          {/* Two Route Option Cards Stacked Vertically with Slim Route Safety Bars */}
          <div className="flex flex-col gap-2.5 pt-0.5">
            {/* Option 1: Safest (Recommended badge fully visible + Slim Safety Bar) */}
            <button
              type="button"
              onClick={() => setSelectedOption('safest')}
              aria-pressed={selectedOption === 'safest'}
              className={`w-full p-3 rounded-[14px] border-2 text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                selectedOption === 'safest'
                  ? 'bg-[#D8F5E6] border-[#34C38F] shadow-xs'
                  : 'bg-[#FFF9F4] border-[#2B2A4C]/15 hover:border-[#34C38F]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="text-base font-extrabold text-[#2B2A4C]">
                  {t.safestHeading}
                </span>
                <span className="pill-safe inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs shrink-0">
                  <CheckCircle2
                    className="w-3.5 h-3.5 text-[#11694A] shrink-0"
                    aria-hidden="true"
                  />
                  <span>{t.recommendedBadge}</span>
                </span>
              </div>
              <p className="text-sm font-bold text-[#2B2A4C] leading-snug">
                {t.safestSummary(routes.safest.totalTimeMin)}
              </p>

              {/* Slim Route Safety Bar for Safest Route */}
              <div className="pt-1.5 border-t border-[#34C38F]/30 space-y-1">
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden flex">
                  {routes.safest.safetyBreakdown.clearShare > 0 && (
                    <div
                      style={{ width: `${routes.safest.safetyBreakdown.clearShare}%` }}
                      className="h-full bg-[#34C38F]"
                      title={`Clear: ${routes.safest.safetyBreakdown.clearShare}%`}
                    />
                  )}
                  {routes.safest.safetyBreakdown.lowShare > 0 && (
                    <div
                      style={{ width: `${routes.safest.safetyBreakdown.lowShare}%` }}
                      className="h-full bg-[#F5C451]"
                      title={`Low risk: ${routes.safest.safetyBreakdown.lowShare}%`}
                    />
                  )}
                  {routes.safest.safetyBreakdown.proneShare > 0 && (
                    <div
                      style={{ width: `${routes.safest.safetyBreakdown.proneShare}%` }}
                      className="h-full bg-[#F59A4A]"
                      title={`Flood-prone: ${routes.safest.safetyBreakdown.proneShare}%`}
                    />
                  )}
                  {routes.safest.safetyBreakdown.floodedShare > 0 && (
                    <div
                      style={{ width: `${routes.safest.safetyBreakdown.floodedShare}%` }}
                      className="h-full bg-[#E5484D]"
                      title={`Likely flooded: ${routes.safest.safetyBreakdown.floodedShare}%`}
                    />
                  )}
                </div>
                <p className="text-xs font-bold text-[#11694A] leading-tight">
                  {routes.safest.safetyBreakdown.summaryText[lang]}
                </p>
              </div>
            </button>

            {/* Option 2: Shortest (Flood warning label + Slim Safety Bar) */}
            <button
              type="button"
              onClick={() => setSelectedOption('shortest')}
              aria-pressed={selectedOption === 'shortest'}
              className={`w-full p-3 rounded-[14px] border-2 text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                selectedOption === 'shortest'
                  ? 'bg-[#FFDDE8] border-[#E5484D]'
                  : 'bg-[#FFF9F4] border-[#2B2A4C]/15 hover:border-[#E5484D]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="text-base font-extrabold text-[#2B2A4C]">
                  {t.shortestHeading}
                </span>
                <span className="pill-danger inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs shrink-0">
                  <AlertTriangle
                    className="w-3.5 h-3.5 text-[#8B1A1E] shrink-0"
                    aria-hidden="true"
                  />
                  <span>{t.shortestWarningBadge}</span>
                </span>
              </div>
              <p className="text-sm font-bold text-[#2B2A4C] leading-snug">
                {t.shortestSummary(routes.shortest.totalTimeMin, shortestRiskCount)}
              </p>

              {/* Slim Route Safety Bar for Shortest Route */}
              <div className="pt-1.5 border-t border-[#E5484D]/30 space-y-1">
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden flex">
                  {routes.shortest.safetyBreakdown.clearShare > 0 && (
                    <div
                      style={{ width: `${routes.shortest.safetyBreakdown.clearShare}%` }}
                      className="h-full bg-[#34C38F]"
                      title={`Clear: ${routes.shortest.safetyBreakdown.clearShare}%`}
                    />
                  )}
                  {routes.shortest.safetyBreakdown.lowShare > 0 && (
                    <div
                      style={{ width: `${routes.shortest.safetyBreakdown.lowShare}%` }}
                      className="h-full bg-[#F5C451]"
                      title={`Low risk: ${routes.shortest.safetyBreakdown.lowShare}%`}
                    />
                  )}
                  {routes.shortest.safetyBreakdown.proneShare > 0 && (
                    <div
                      style={{ width: `${routes.shortest.safetyBreakdown.proneShare}%` }}
                      className="h-full bg-[#F59A4A]"
                      title={`Flood-prone: ${routes.shortest.safetyBreakdown.proneShare}%`}
                    />
                  )}
                  {routes.shortest.safetyBreakdown.floodedShare > 0 && (
                    <div
                      style={{ width: `${routes.shortest.safetyBreakdown.floodedShare}%` }}
                      className="h-full bg-[#E5484D]"
                      title={`Likely flooded: ${routes.shortest.safetyBreakdown.floodedShare}%`}
                    />
                  )}
                </div>
                <p className="text-xs font-bold text-[#8B1A1E] leading-tight">
                  {routes.shortest.safetyBreakdown.summaryText[lang]}
                </p>
              </div>
            </button>
          </div>

          {/* Single Main Button on Screen: "Start safe route" */}
          <button
            type="button"
            onClick={() => setShowTurnByTurn((prev) => !prev)}
            className="btn-main w-full flex items-center justify-center gap-2.5 py-2.5 cursor-pointer text-[15px]"
          >
            <Flag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{showTurnByTurn ? t.hideStepsBtn : t.startSafeRouteBtn}</span>
          </button>
        </div>
      </div>

      {/* 2. INFO BANNER BELOW THE MAP WITH ITS OWN SPACING */}
      <div className="resq-card mt-6 p-4 sm:p-5 bg-gradient-to-r from-[#DCEBFF] via-[#E8DEFF] to-[#D8F5E6] border-2 border-[#2B2A4C]/10">
        <p className="text-base sm:text-lg font-bold text-[#2B2A4C] text-center">
          {t.underMapLine}
        </p>
      </div>

      {/* 3. TURN-BY-TURN LIST (BIG TEXT) WITH WARNING PINS ON AVOIDED STREETS */}
      {showTurnByTurn && (
        <section
          aria-label={t.turnByTurnTitle}
          className="resq-card p-6 sm:p-8 space-y-6 bg-white border-2 border-[#2B2A4C]/10"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2B2A4C]">
              {t.turnByTurnTitle}
            </h2>
            <span className="pill-safe inline-flex items-center gap-2 px-3.5 py-1 text-sm">
              <CheckCircle2
                className="w-4 h-4 text-[#11694A] shrink-0"
                aria-hidden="true"
              />
              <span>{t.safestSummary(routes.safest.totalTimeMin)}</span>
            </span>
          </div>

          {/* Avoided Flooded Street Warning Card */}
          {routes.shortest.worstSegment && (
            <div className="p-5 rounded-[20px] bg-[#FFDDE8] border-2 border-[#E5484D] flex items-start gap-3">
              <ShieldAlert
                className="w-5 h-5 text-[#8B1A1E] shrink-0 mt-1"
                aria-hidden="true"
              />
              <div>
                <p className="text-base font-extrabold text-[#8B1A1E] leading-snug">
                  {t.worstSpotLabel}: {routes.shortest.worstSegment.streetName[lang]}
                </p>
                <p className="text-sm text-[#2B2A4C] font-semibold mt-1">
                  {routes.shortest.worstSegment.reason[lang]}
                </p>
              </div>
            </div>
          )}

          {/* Numbered Safe Route Steps with Risk Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {routes.safest.steps.map((step, idx) => {
              const grade = getRiskGradeInfo(step.floodRisk);
              const cardBg =
                idx % 3 === 0
                  ? 'bg-[#DCEBFF] border-[#BACFFF]'
                  : idx % 3 === 1
                  ? 'bg-[#E8DEFF] border-[#D5C2FF]'
                  : 'bg-[#D8F5E6] border-[#B4E8CC]';

              return (
                <div
                  key={step.edgeId}
                  className={`p-6 rounded-[20px] border-2 flex flex-col justify-between gap-4 ${cardBg}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="w-9 h-9 rounded-full bg-[#F2677A] text-white font-extrabold text-base flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-extrabold"
                        style={{
                          backgroundColor: `${grade.color}20`,
                          color: grade.color === '#FACC15' ? '#7A4F01' : grade.color === '#22C55E' ? '#11694A' : grade.color,
                          border: `1.5px solid ${grade.color}`,
                        }}
                      >
                        {grade.percent}% · {getGradeText(grade.labelKey)}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-[#2B2A4C]">
                      {step.streetName[lang]}
                    </h3>

                    <p className="text-base font-semibold text-[#2B2A4C] leading-relaxed">
                      {step.instruction[lang]}
                    </p>
                  </div>

                  <div className="text-xs font-extrabold text-[#6B6A8A] pt-2 border-t border-[#2B2A4C]/10">
                    {t.stepMinKm(step.travelTimeMin, step.distanceKm)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
