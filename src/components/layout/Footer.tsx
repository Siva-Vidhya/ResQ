import React from 'react';
import { PhoneCall, ShieldCheck, BellRing } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useResQStore } from '../../store/useResQStore';

type LangCode = 'en' | 'ta' | 'hi';

const FOOTER_TEXT: Record<
  LangCode,
  {
    calmNote: string;
    emergencyCall: string;
    demoAlertLink: string;
  }
> = {
  en: {
    calmNote: 'ResQ Grid • Keeping Chennai families safe with early flood warnings',
    emergencyCall: 'Emergency: call 112',
    demoAlertLink: 'Try a demo alert',
  },
  ta: {
    calmNote: 'ResQ Grid • சென்னை குடும்பங்களுக்கான முன்கூட்டிய வெள்ளப் பாதுகாப்பு',
    emergencyCall: 'அவசர உதவி: 112 ஐ அழைக்கவும்',
    demoAlertLink: 'மாதிரி எச்சரிக்கையை முயற்சிக்கவும்',
  },
  hi: {
    calmNote: 'ResQ Grid • चेन्नई परिवारों के लिए बाढ़ पूर्व-चेतावनी और सुरक्षा',
    emergencyCall: 'आपातकाल: 112 पर कॉल करें',
    demoAlertLink: 'डेमो अलर्ट आज़माएँ',
  },
};

export const Footer: React.FC = () => {
  const { i18n } = useTranslation();
  const { triggerDemoAlert } = useResQStore();

  const rawLang = (i18n.language || 'en').slice(0, 2);
  const lang: LangCode = rawLang === 'ta' || rawLang === 'hi' ? rawLang : 'en';
  const t = FOOTER_TEXT[lang];

  return (
    <footer className="w-full bg-white border-t border-blue-100 pt-8 pb-28 lg:pb-24 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-slate-700 font-semibold text-lg">
          <ShieldCheck className="w-6 h-6 text-[#0F766E] shrink-0" aria-hidden="true" />
          <span>{t.calmNote}</span>
          <span className="text-slate-300" aria-hidden="true">•</span>
          <button
            type="button"
            onClick={triggerDemoAlert}
            className="inline-flex items-center gap-1.5 text-base font-bold text-[#1D4ED8] underline underline-offset-4 hover:text-[#1E3A8A] cursor-pointer px-2 py-1"
          >
            <BellRing className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.demoAlertLink}</span>
          </button>
        </div>

        <a
          href="tel:112"
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-[20px] bg-red-50 hover:bg-red-100 border-2 border-[#EF4444] text-[#B91C1C] font-extrabold text-xl transition-colors shrink-0"
        >
          <PhoneCall className="w-5 h-5 text-[#B91C1C] shrink-0" aria-hidden="true" />
          <span>{t.emergencyCall}</span>
        </a>
      </div>
    </footer>
  );
};
