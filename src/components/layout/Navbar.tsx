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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#2B2A4C]/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 min-h-[76px] py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* 1. Brand Logo */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          aria-label="ResQ Grid Home"
          className="flex items-center gap-2.5 text-left cursor-pointer shrink-0"
        >
          <div className="w-11 h-11 rounded-[14px] bg-[#F2677A] bg-gradient-to-br from-[#F2677A] to-[#E8DEFF] flex items-center justify-center text-white shadow-xs shrink-0">
            <Droplets className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#2B2A4C] block leading-none">
              ResQ Grid
            </span>
            <span className="text-sm font-bold text-[#6B6A8A] hidden sm:block mt-0.5">
              {labels.subtitle}
            </span>
          </div>
        </button>

        {/* 2. Desktop 4 Navigation Links */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-2 bg-[#FFF9F4] p-1.5 rounded-[20px] border border-[#2B2A4C]/10"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-4 py-2 rounded-[16px] text-[15px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E8DEFF] text-[#2B2A4C] border border-[#D5C2FF] shadow-xs'
                    : 'text-[#2B2A4C] hover:bg-white'
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
          className="flex items-center bg-[#FFF9F4] rounded-[18px] p-1 border border-[#2B2A4C]/10"
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
                className={`px-2.5 sm:px-3 py-1.5 rounded-[14px] text-sm font-extrabold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#F2677A] text-white shadow-xs'
                    : 'text-[#2B2A4C] hover:bg-white'
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
