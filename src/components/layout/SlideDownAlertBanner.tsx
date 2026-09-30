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
          ? 'bg-[#FFDDE8] border-[#E5484D] text-[#2B2A4C]'
          : 'bg-[#FFF5EB] border-[#F59A4A] text-[#2B2A4C]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Icon + One Plain Sentence */}
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          {isDanger ? (
            <ShieldAlert className="w-6 h-6 text-[#E5484D] shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-[#F59A4A] shrink-0" />
          )}
          <p className="text-base font-extrabold text-[#2B2A4C] leading-snug">
            {activeBannerAlert.message[lang]}
          </p>
        </div>

        {/* "View safe route" Button + Dismiss Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleViewSafeRoute}
            className="btn-main px-4 py-2 rounded-[16px] inline-flex items-center gap-2 shadow-xs cursor-pointer text-[15px]"
          >
            <Navigation className="w-4 h-4 shrink-0" />
            <span>{t.viewSafeRoute}</span>
          </button>

          <button
            type="button"
            onClick={dismissBannerAlert}
            aria-label={t.dismissLabel}
            className="w-10 h-10 rounded-[14px] bg-white/80 hover:bg-white border border-[#2B2A4C]/15 text-[#2B2A4C] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
