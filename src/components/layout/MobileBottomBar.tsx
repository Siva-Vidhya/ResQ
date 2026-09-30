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
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-blue-100 shadow-lg px-1.5 py-1.5"
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
                  ? 'bg-[#1D4ED8] bg-gradient-to-r from-[#1D4ED8] to-[#0284C7] text-white font-extrabold shadow-sm'
                  : 'text-slate-800 hover:bg-blue-50 font-bold'
              }`}
            >
              {item.icon}
              <span className="text-base mt-1 leading-tight text-center break-words">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
