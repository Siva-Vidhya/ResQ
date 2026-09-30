import React from 'react';
import { ShieldAlert, AlertTriangle, Navigation, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useResQStore } from '../../store/useResQStore';

type LangCode = 'en' | 'ta' | 'hi';

const BANNER_COPY: Record<
  LangCode,
  {
    viewSafeRoute: string;
    dismissLabel: string;
  }
> = {
  en: {
    viewSafeRoute: 'View safe route',
    dismissLabel: 'Dismiss alert',
  },
  ta: {
    viewSafeRoute: 'பாதுகாப்பான பாதையைப் பார்க்க',
    dismissLabel: 'மூடுக',
  },
  hi: {
    viewSafeRoute: 'सुरक्षित रास्ता देखें',
    dismissLabel: 'बंद करें',
  },
};

export const SlideDownAlertBanner: React.FC = () => {
  const { i18n } = useTranslation();
  const { activeBannerAlert, dismissBannerAlert, setActiveTab } = useResQStore();

  if (!activeBannerAlert) return null;

  const rawLang = (i18n.language || 'en').slice(0, 2);
  const lang: LangCode = rawLang === 'ta' || rawLang === 'hi' ? rawLang : 'en';
  const t = BANNER_COPY[lang];

  const isDanger = activeBannerAlert.severity === 'DANGER';

  const handleViewSafeRoute = () => {
    dismissBannerAlert();
    setActiveTab('route');
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`w-full border-b-2 transition-all duration-300 ${
        isDanger
          ? 'bg-red-50 border-[#EF4444] text-slate-900'
          : 'bg-amber-50 border-[#F59E0B] text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Icon + One Plain Sentence */}
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          {isDanger ? (
            <ShieldAlert className="w-7 h-7 text-[#EF4444] shrink-0" />
          ) : (
            <AlertTriangle className="w-7 h-7 text-[#F59E0B] shrink-0" />
          )}
          <p className="text-lg font-extrabold text-slate-900 leading-snug">
            {activeBannerAlert.message[lang]}
          </p>
        </div>

        {/* "View safe route" Button + Dismiss Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleViewSafeRoute}
            className="px-5 py-2.5 rounded-[16px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-base inline-flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Navigation className="w-5 h-5 shrink-0" />
            <span>{t.viewSafeRoute}</span>
          </button>

          <button
            type="button"
            onClick={dismissBannerAlert}
            aria-label={t.dismissLabel}
            className="w-12 h-12 rounded-[14px] bg-white/80 hover:bg-white border border-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
