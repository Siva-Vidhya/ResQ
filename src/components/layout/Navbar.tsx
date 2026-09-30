import React from 'react';
import { Home, Navigation, Bell, FileWarning, Droplets } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useResQStore, type NavTab } from '../../store/useResQStore';

type LangCode = 'en' | 'ta' | 'hi';

const NAV_LABELS: Record<
  LangCode,
  {
    subtitle: string;
    home: string;
    route: string;
    alerts: string;
    reports: string;
  }
> = {
  en: {
    subtitle: 'Chennai Flood Safety',
    home: 'Home',
    route: 'Safe Route',
    alerts: 'Alerts',
    reports: 'Reports',
  },
  ta: {
    subtitle: 'சென்னை வெள்ளப் பாதுகாப்பு',
    home: 'முகப்பு',
    route: 'பாதுகாப்பான பாதை',
    alerts: 'எச்சரிக்கைகள்',
    reports: 'புகார்கள்',
  },
  hi: {
    subtitle: 'चेन्नई बाढ़ सुरक्षा',
    home: 'होम',
    route: 'सुरक्षित रास्ता',
    alerts: 'चेतावनी',
    reports: 'रिपोर्ट',
  },
};

export const Navbar: React.FC = () => {
  const { i18n } = useTranslation();
  const { activeTab, setActiveTab } = useResQStore();

  const rawLang = (i18n.language || 'en').slice(0, 2);
  const currentLang: LangCode =
    rawLang === 'ta' || rawLang === 'hi' ? rawLang : 'en';
  const labels = NAV_LABELS[currentLang];

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: labels.home,
      icon: <Home className="w-5 h-5 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'route',
      label: labels.route,
      icon: <Navigation className="w-5 h-5 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'alerts',
      label: labels.alerts,
      icon: <Bell className="w-5 h-5 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'reports',
      label: labels.reports,
      icon: <FileWarning className="w-5 h-5 shrink-0" aria-hidden="true" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 min-h-[76px] py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* 1. Brand Logo */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          aria-label="ResQ Grid Home"
          className="flex items-center gap-2.5 text-left cursor-pointer shrink-0"
        >
          <div className="w-11 h-11 rounded-[14px] bg-[#1D4ED8] bg-gradient-to-br from-[#2563EB] via-[#0EA5E9] to-[#14B8A6] flex items-center justify-center text-white shadow-md shrink-0">
            <Droplets className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 block leading-none">
              ResQ Grid
            </span>
            <span className="text-base font-bold text-[#1D4ED8] hidden sm:block mt-0.5">
              {labels.subtitle}
            </span>
          </div>
        </button>

        {/* 2. Desktop 4 Navigation Links */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-2 bg-[#F5F9FF] p-1.5 rounded-[20px] border border-blue-100"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-[16px] text-lg font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1D4ED8] bg-gradient-to-r from-[#1D4ED8] via-[#0284C7] to-[#0F766E] text-white shadow-md'
                    : 'text-slate-800 hover:text-[#1D4ED8] hover:bg-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 3. Language Switch (EN / தமிழ் / हिन्दी) */}
        <div
          role="group"
          aria-label="Select language"
          className="flex items-center bg-[#F5F9FF] rounded-[18px] p-1 border border-blue-100"
        >
          {(
            [
              { code: 'en', label: 'EN' },
              { code: 'ta', label: 'தமிழ்' },
              { code: 'hi', label: 'हिन्दी' },
            ] as const
          ).map((lang) => {
            const active = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => i18n.changeLanguage(lang.code)}
                aria-pressed={active}
                className={`px-2.5 sm:px-3.5 py-2 rounded-[14px] text-base font-extrabold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#1D4ED8] text-white shadow-sm'
                    : 'text-slate-800 hover:text-[#1D4ED8] hover:bg-white'
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
