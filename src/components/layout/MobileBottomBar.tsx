import React from 'react';
import { Home, Navigation, Bell, FileWarning } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useResQStore, type NavTab } from '../../store/useResQStore';

type LangCode = 'en' | 'ta' | 'hi';

const MOBILE_LABELS: Record<
  LangCode,
  {
    home: string;
    route: string;
    alerts: string;
    reports: string;
  }
> = {
  en: {
    home: 'Home',
    route: 'Safe Route',
    alerts: 'Alerts',
    reports: 'Reports',
  },
  ta: {
    home: 'முகப்பு',
    route: 'பாதை',
    alerts: 'எச்சரிக்கை',
    reports: 'புகார்',
  },
  hi: {
    home: 'होम',
    route: 'रास्ता',
    alerts: 'चेतावनी',
    reports: 'रिपोर्ट',
  },
};

export const MobileBottomBar: React.FC = () => {
  const { i18n } = useTranslation();
  const { activeTab, setActiveTab } = useResQStore();

  const rawLang = (i18n.language || 'en').slice(0, 2);
  const currentLang: LangCode =
    rawLang === 'ta' || rawLang === 'hi' ? rawLang : 'en';
  const labels = MOBILE_LABELS[currentLang];

  const items: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: labels.home,
      icon: <Home className="w-6 h-6 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'route',
      label: labels.route,
      icon: <Navigation className="w-6 h-6 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'alerts',
      label: labels.alerts,
      icon: <Bell className="w-6 h-6 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'reports',
      label: labels.reports,
      icon: <FileWarning className="w-6 h-6 shrink-0" aria-hidden="true" />,
    },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#2B2A4C]/10 shadow-lg px-1.5 py-1.5"
    >
      <div className="grid grid-cols-4 gap-1 max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-[14px] transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#E8DEFF] text-[#2B2A4C] font-extrabold shadow-xs border border-[#D5C2FF]'
                  : 'text-[#2B2A4C] hover:bg-[#E8DEFF]/30 font-bold'
              }`}
            >
              {item.icon}
              <span className="text-[13px] mt-0.5 leading-tight text-center break-words">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
