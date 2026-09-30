import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useResQStore, type FontScaleLevel } from '../../store/useResQStore';

type LangCode = 'en' | 'ta' | 'hi';

const AA_COPY: Record<
  LangCode,
  {
    ariaLabel: (scale: string) => string;
    title: string;
    textSizeLabel: string;
    sizeNames: Record<FontScaleLevel, string>;
    rainLabel: string;
    rainOn: string;
    rainOff: string;
    rainStatusToast: (on: boolean) => string;
    toastMsg: (name: string) => string;
    close: string;
  }
> = {
  en: {
    ariaLabel: (scale) => `Accessibility options (text: ${scale})`,
    title: 'Display & Rain Controls',
    textSizeLabel: 'Text Size',
    sizeNames: {
      normal: 'Normal',
      large: 'Large',
      xlarge: 'Extra Large',
    },
    rainLabel: 'Rain effect',
    rainOn: 'On',
    rainOff: 'Off',
    rainStatusToast: (on) => `Rain effect turned ${on ? 'ON' : 'OFF'}.`,
    toastMsg: (name) => `Text size set to ${name}.`,
    close: 'Close',
  },
  ta: {
    ariaLabel: (scale) => `அணுகல்தன்மை விருப்பங்கள் (எழுத்து: ${scale})`,
    title: 'காட்சி & மழை கட்டுப்பாடுகள்',
    textSizeLabel: 'எழுத்து அளவு',
    sizeNames: {
      normal: 'இயல்பு',
      large: 'பெரியது',
      xlarge: 'மிகப் பெரியது',
    },
    rainLabel: 'மழை விளைவு',
    rainOn: 'இயக்கத்தில்',
    rainOff: 'நிறுத்தப்பட்டது',
    rainStatusToast: (on) => `மழை விளைவு ${on ? 'இயக்கப்பட்டது' : 'நிறுத்தப்பட்டது'}.`,
    toastMsg: (name) => `எழுத்து அளவு: ${name}.`,
    close: 'மூடுக',
  },
  hi: {
    ariaLabel: (scale) => `सुलभता विकल्प (अक्षर: ${scale})`,
    title: 'प्रदर्शन और बारिश नियंत्रण',
    textSizeLabel: 'अक्षर का आकार',
    sizeNames: {
      normal: 'सामान्य',
      large: 'बड़ा',
      xlarge: 'बहुत बड़ा',
    },
    rainLabel: 'बारिश प्रभाव',
    rainOn: 'चालू',
    rainOff: 'बंद',
    rainStatusToast: (on) => `बारिश प्रभाव ${on ? 'चालू' : 'बंद'} किया गया।`,
    toastMsg: (name) => `अक्षर का आकार: ${name}।`,
    close: 'बंद करें',
  },
};

export const FloatingTextControl: React.FC = () => {
  const { i18n } = useTranslation();
  const {
    fontScale,
    setFontScale,
    rainEffectEnabled,
    toggleRainEffect,
    showToast,
  } = useResQStore();

  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const rawLang = (i18n.language || 'en').slice(0, 2);
  const lang: LangCode = rawLang === 'ta' || rawLang === 'hi' ? rawLang : 'en';
  const t = AA_COPY[lang];

  // Close when clicking outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleDocumentClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [isOpen]);

  const handleSetScale = (scale: FontScaleLevel) => {
    setFontScale(scale);
    showToast(t.toastMsg(t.sizeNames[scale]), 'info');
  };

  const handleToggleRain = () => {
    toggleRainEffect();
    const nextState = !rainEffectEnabled;
    showToast(t.rainStatusToast(nextState), 'info');
  };

  const badgeSymbol =
    fontScale === 'xlarge' ? 'Aa++' : fontScale === 'large' ? 'Aa+' : 'Aa';

  return (
    <div ref={panelRef} className="fixed bottom-20 lg:bottom-6 left-4 sm:left-6 z-30">
      {/* Expanded Accessibility & Rain Control Popup Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={t.title}
          className="mb-3 w-72 sm:w-80 bg-white rounded-2xl border-2 border-blue-200 shadow-2xl p-4 animate-fade-in flex flex-col gap-3.5"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>♿</span>
              <span>{t.title}</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={t.close}
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg"
            >
              ✕
            </button>
          </div>

          {/* Text Size Controls */}
          <div>
            <div className="text-sm font-bold text-slate-600 mb-1.5">
              {t.textSizeLabel}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['normal', 'large', 'xlarge'] as FontScaleLevel[]).map((level) => {
                const isActive = fontScale === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleSetScale(level)}
                    className={`py-1.5 px-2 rounded-xl text-center font-bold text-sm transition-all border ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    {t.sizeNames[level]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rain Effect Switch */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">
                  🌧️
                </span>
                <div>
                  <div className="text-sm font-extrabold text-slate-800">
                    {t.rainLabel}:{' '}
                    <span
                      className={
                        rainEffectEnabled ? 'text-blue-600' : 'text-slate-400'
                      }
                    >
                      {rainEffectEnabled ? t.rainOn : t.rainOff}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {rainEffectEnabled ? 'Active rainfall' : 'Paused / disabled'}
                  </div>
                </div>
              </div>

              {/* Toggle button */}
              <button
                type="button"
                role="switch"
                aria-checked={rainEffectEnabled}
                onClick={handleToggleRain}
                aria-label={`${t.rainLabel}: ${rainEffectEnabled ? t.rainOn : t.rainOff}`}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                  rainEffectEnabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                    rainEffectEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={t.ariaLabel(t.sizeNames[fontScale])}
        title={t.ariaLabel(t.sizeNames[fontScale])}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white hover:bg-blue-50 border-2 border-[#1D4ED8] text-[#1D4ED8] font-extrabold text-base shadow-lg transition-all cursor-pointer hover:shadow-xl"
      >
        <span className="tracking-tight">{badgeSymbol}</span>
        {rainEffectEnabled ? (
          <span
            className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"
            title="Rain effect active"
            aria-hidden="true"
          />
        ) : (
          <span
            className="inline-block w-2.5 h-2.5 rounded-full bg-slate-300"
            title="Rain effect paused"
            aria-hidden="true"
          />
        )}
        <span className="text-base font-bold text-slate-700 hidden sm:inline">
          {t.sizeNames[fontScale]}
        </span>
      </button>
    </div>
  );
};
