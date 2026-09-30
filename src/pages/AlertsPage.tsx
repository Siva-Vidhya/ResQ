import React, { useState, useEffect } from 'react';
import {
  Bell,
  MapPin,
  Clock,
  Navigation,
  Send,
  CheckCircle2,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  useResQStore,
  type CitizenRiskLevel,
} from '../store/useResQStore';
import { renderRiskBadge } from './HomePage';

type LangCode = 'en' | 'ta' | 'hi';

const ALERTS_COPY: Record<
  LangCode,
  {
    settingsTitle: string;
    settingsSub: string;
    toggleLocationTitle: string;
    toggleLocationDesc: string;
    togglePhoneTitle: string;
    togglePhoneDesc: string;
    toggleAutoReportTitle: string;
    toggleAutoReportDesc: string;
    onLabel: string;
    offLabel: string;
    notifPromptTitle: string;
    notifTurnOnBtn: string;
    notifDismissBtn: string;
    timelineTitle: string;
    timelineSub: string;
    seeSafeRouteBtn: string;
    clearHistoryBtn: string;
    restoreAlertsBtn: string;
    emptyTitle: string;
    emptySub: string;
    riskWords: Record<CitizenRiskLevel, string>;
    toastLocationOn: string;
    toastLocationOff: string;
    toastPhoneOn: string;
    toastPhoneOff: string;
    toastAutoReportOn: string;
    toastAutoReportOff: string;
  }
> = {
  en: {
    settingsTitle: 'Alert settings',
    settingsSub:
      'Choose how ResQ Grid watches your street and warns you before flooding happens.',
    toggleLocationTitle: 'Location tracking',
    toggleLocationDesc: 'Watch your Chennai neighbourhood for nearby flood risk',
    togglePhoneTitle: 'Phone notifications',
    togglePhoneDesc: 'Warn you on your phone before water reaches your street',
    toggleAutoReportTitle: 'Send reports to authority automatically',
    toggleAutoReportDesc:
      'Share early flood predictions with Greater Chennai Corporation',
    onLabel: 'ON',
    offLabel: 'OFF',
    notifPromptTitle: 'Turn on alerts so we can warn you before floods.',
    notifTurnOnBtn: 'Turn on alerts',
    notifDismissBtn: 'Not now',
    timelineTitle: 'Past & current alerts',
    timelineSub:
      'A simple timeline of flood warnings near your Chennai location:',
    seeSafeRouteBtn: 'See safe route',
    clearHistoryBtn: 'Clear list',
    restoreAlertsBtn: 'Show sample alerts',
    emptyTitle: 'No flood alerts right now',
    emptySub:
      'Streets near you are clear. We will warn you here as soon as heavy rain is forecast.',
    riskWords: {
      SAFE: 'SAFE',
      PRONE: 'BE READY',
      DANGER: 'DANGER LIKELY',
    },
    toastLocationOn: 'Location tracking turned on.',
    toastLocationOff: 'Location tracking paused.',
    toastPhoneOn: 'Phone notifications turned on.',
    toastPhoneOff: 'Phone notifications turned off.',
    toastAutoReportOn: 'Automatic authority reports turned on.',
    toastAutoReportOff: 'Automatic authority reports turned off.',
  },
  ta: {
    settingsTitle: 'எச்சரிக்கை அமைப்புகள்',
    settingsSub:
      'வெள்ளத்திற்கு முன்பே உங்களை எச்சரிக்க கீழ்க்கண்ட அமைப்புகளைத் தேர்ந்தெடுக்கவும்.',
    toggleLocationTitle: 'இருப்பிடக் கண்காணிப்பு',
    toggleLocationDesc: 'உங்கள் சென்னைப் பகுதியில் வெள்ள அபாயத்தைக் கண்காணிக்க',
    togglePhoneTitle: 'தொலைபேசி அறிவிப்புகள்',
    togglePhoneDesc: 'தெருவில் நீர் தேங்கும் முன்பே தொலைபேசியில் எச்சரிக்க',
    toggleAutoReportTitle: 'அதிகாரிகளுக்குத் தானாகப் புகார் அனுப்பு',
    toggleAutoReportDesc:
      'சென்னை மாநகராட்சிக்கு முன்கூட்டியே வெள்ளக் கணிப்பை அனுப்ப',
    onLabel: 'இயக்கம்',
    offLabel: 'நிறுத்தம்',
    notifPromptTitle: 'வெள்ளத்திற்கு முன்பே உங்களை எச்சரிக்க அறிவிப்புகளை இயக்கவும்.',
    notifTurnOnBtn: 'அறிவிப்புகளை இயக்கு',
    notifDismissBtn: 'இப்போது வேண்டாம்',
    timelineTitle: 'கடந்த மற்றும் தற்போதைய எச்சரிக்கைகள்',
    timelineSub: 'உங்கள் சென்னை இருப்பிடத்திற்கு அருகிலுள்ள வெள்ள எச்சரிக்கைகளின் வரிசை:',
    seeSafeRouteBtn: 'பாதுகாப்பான பாதையைப் பார்க்க',
    clearHistoryBtn: 'பட்டியலை அழிக்க',
    restoreAlertsBtn: 'மாதிரி எச்சரிக்கைகளைக் காட்டு',
    emptyTitle: 'தற்போது வெள்ள எச்சரிக்கை எதுவும் இல்லை',
    emptySub:
      'உங்கள் பகுதி பாதுகாப்பாக உள்ளது. கனமழை முன்னறிவிப்பு வந்தவுடன் இங்கே எச்சரிப்போம்.',
    riskWords: {
      SAFE: 'பாதுகாப்பு',
      PRONE: 'தயாராக இருங்கள்',
      DANGER: 'வெள்ள ஆபத்து',
    },
    toastLocationOn: 'இருப்பிடக் கண்காணிப்பு இயக்கப்பட்டது.',
    toastLocationOff: 'இருப்பிடக் கண்காணிப்பு நிறுத்தப்பட்டது.',
    toastPhoneOn: 'தொலைபேசி அறிவிப்புகள் இயக்கப்பட்டன.',
    toastPhoneOff: 'தொலைபேசி அறிவிப்புகள் நிறுத்தப்பட்டன.',
    toastAutoReportOn: 'தானியங்கி அரசுப் புகார்கள் இயக்கப்பட்டன.',
    toastAutoReportOff: 'தானியங்கி அரசுப் புகார்கள் நிறுத்தப்பட்டன.',
  },
  hi: {
    settingsTitle: 'अलर्ट सेटिंग्स',
    settingsSub:
      'चुनें कि ResQ Grid आपकी गली पर कैसे नज़र रखे और बाढ़ से पहले आपको कैसे सचेत करे।',
    toggleLocationTitle: 'लोकेशन ट्रैकिंग',
    toggleLocationDesc: 'आस-पास के बाढ़ जोखिम के लिए अपने चेन्नई इलाके पर नज़र रखें',
    togglePhoneTitle: 'फ़ोन नोटिफ़िकेशन',
    togglePhoneDesc: 'सड़क पर पानी आने से पहले अपने फ़ोन पर चेतावनी पाएँ',
    toggleAutoReportTitle: 'अधिकारियों को अपने-आप रिपोर्ट भेजें',
    toggleAutoReportDesc:
      'ग्रेटर चेन्नई कॉर्पोरेशन को समय से पहले बाढ़ का अनुमान भेजें',
    onLabel: 'चालू',
    offLabel: 'बंद',
    notifPromptTitle: 'बाढ़ से पहले चेतावनी पाने के लिए अलर्ट चालू करें।',
    notifTurnOnBtn: 'अलर्ट चालू करें',
    notifDismissBtn: 'अभी नहीं',
    timelineTitle: 'पिछली और वर्तमान चेतावनियाँ',
    timelineSub: 'आपके चेन्नई स्थान के पास जारी बाढ़ चेतावनियों की समय-रेखा:',
    seeSafeRouteBtn: 'सुरक्षित रास्ता देखें',
    clearHistoryBtn: 'सूची साफ़ करें',
    restoreAlertsBtn: 'उदाहरण अलर्ट दिखाएँ',
    emptyTitle: 'अभी कोई बाढ़ चेतावनी नहीं है',
    emptySub:
      'आपके पास की सड़कें सुरक्षित हैं। तेज़ बारिश का अनुमान होते ही हम यहाँ सचेत करेंगे।',
    riskWords: {
      SAFE: 'सुरक्षित',
      PRONE: 'तैयार रहें',
      DANGER: 'बाढ़ का खतरा',
    },
    toastLocationOn: 'लोकेशन ट्रैकिंग चालू कर दी गई है।',
    toastLocationOff: 'लोकेशन ट्रैकिंग बंद कर दी गई है।',
    toastPhoneOn: 'फ़ोन नोटिफ़िकेशन चालू कर दिए गए हैं।',
    toastPhoneOff: 'फ़ोन नोटिफ़िकेशन बंद कर दिए गए हैं।',
    toastAutoReportOn: 'अपने-आप सरकारी रिपोर्ट भेजना चालू है।',
    toastAutoReportOff: 'अपने-आप सरकारी रिपोर्ट भेजना बंद है।',
  },
};

export const AlertsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const {
    locationTrackingEnabled,
    setLocationTrackingEnabled,
    locationNotificationsEnabled,
    setLocationNotificationsEnabled,
    autoSendReportsEnabled,
    setAutoSendReportsEnabled,
    notificationCardDismissed,
    dismissNotificationCard,
    triggeredAlerts,
    clearTriggeredAlerts,
    restoreSampleAlerts,
    setActiveTab,
    showToast,
  } = useResQStore();

  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingSkeleton(false), 220);
    return () => clearTimeout(timer);
  }, []);

  const rawLang = (i18n.language || 'en').slice(0, 2);
  const lang: LangCode = rawLang === 'ta' || rawLang === 'hi' ? rawLang : 'en';
  const t = ALERTS_COPY[lang];

  const handleToggleLocation = () => {
    const next = !locationTrackingEnabled;
    setLocationTrackingEnabled(next);
    showToast(next ? t.toastLocationOn : t.toastLocationOff, 'info');
  };

  const handleTogglePhoneNotifications = async () => {
    const next = !locationNotificationsEnabled;
    if (next && typeof window !== 'undefined' && 'Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch {
        // Ignore if browser blocks Notification API
      }
    }
    setLocationNotificationsEnabled(next);
    if (next) dismissNotificationCard();
    showToast(next ? t.toastPhoneOn : t.toastPhoneOff, 'info');
  };

  const handleToggleAutoReport = () => {
    const next = !autoSendReportsEnabled;
    setAutoSendReportsEnabled(next);
    showToast(next ? t.toastAutoReportOn : t.toastAutoReportOff, 'info');
  };

  const handleEnableNotificationsBanner = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch {
        // Ignore if blocked
      }
    }
    setLocationNotificationsEnabled(true);
    dismissNotificationCard();
    showToast(t.toastPhoneOn, 'success');
  };

  const settingsItems = [
    {
      id: 'toggle-location-tracking',
      icon: MapPin,
      title: t.toggleLocationTitle,
      desc: t.toggleLocationDesc,
      checked: locationTrackingEnabled,
      onToggle: handleToggleLocation,
    },
    {
      id: 'toggle-phone-notifications',
      icon: Bell,
      title: t.togglePhoneTitle,
      desc: t.togglePhoneDesc,
      checked: locationNotificationsEnabled,
      onToggle: handleTogglePhoneNotifications,
    },
    {
      id: 'toggle-auto-reports',
      icon: Send,
      title: t.toggleAutoReportTitle,
      desc: t.toggleAutoReportDesc,
      checked: autoSendReportsEnabled,
      onToggle: handleToggleAutoReport,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* TOP CARD: "Alert settings" with 3 big toggles */}
      <section
        aria-labelledby="alert-settings-heading"
        className="resq-card p-6 sm:p-8 space-y-6 bg-white border-2 border-[#2B2A4C]/10"
      >
        <div className="space-y-1.5">
          <h1
            id="alert-settings-heading"
            className="text-2xl sm:text-[28px] font-extrabold text-[#2B2A4C]"
          >
            {t.settingsTitle}
          </h1>
          <p className="text-[15px] text-[#6B6A8A]">{t.settingsSub}</p>
        </div>

        {/* Friendly One-Time Notification Permission Card */}
        {!notificationCardDismissed && (
          <div className="p-5 rounded-[20px] bg-[#E8DEFF] border-2 border-[#D5C2FF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Bell
                className="w-6 h-6 text-[#F2677A] shrink-0"
                aria-hidden="true"
              />
              <p className="text-base font-extrabold text-[#2B2A4C]">
                {t.notifPromptTitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleEnableNotificationsBanner}
                className="btn-secondary inline-flex items-center gap-2 cursor-pointer text-[15px]"
              >
                <Bell className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t.notifTurnOnBtn}</span>
              </button>
              <button
                type="button"
                onClick={dismissNotificationCard}
                className="text-sm font-bold text-[#6B6A8A] hover:text-[#2B2A4C] px-3 py-2 cursor-pointer"
              >
                {t.notifDismissBtn}
              </button>
            </div>
          </div>
        )}

        {/* 3 Big Toggles (Max 3 cards per row) - Rotated Soft Pastels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {settingsItems.map((item, idx) => {
            const Icon = item.icon;
            const pastelCardBg =
              idx === 0
                ? 'bg-[#DCEBFF] border-[#BACFFF]'
                : idx === 1
                ? 'bg-[#E8DEFF] border-[#D5C2FF]'
                : 'bg-[#D8F5E6] border-[#B4E8CC]';

            return (
              <div
                key={item.id}
                className={`p-5 rounded-[20px] border-2 flex flex-col justify-between gap-5 transition-all ${pastelCardBg}`}
              >
                <div className="space-y-2.5">
                  <div className="w-12 h-12 rounded-[14px] bg-white border border-[#2B2A4C]/10 flex items-center justify-center text-[#2B2A4C]">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg font-extrabold text-[#2B2A4C] leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-[15px] font-semibold text-[#2B2A4C]/80 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Big Accessible Toggle Button */}
                <button
                  id={item.id}
                  type="button"
                  role="switch"
                  aria-checked={item.checked}
                  aria-label={item.title}
                  onClick={item.onToggle}
                  className={`w-full px-4 py-2.5 rounded-[16px] border-2 flex items-center justify-between gap-3 font-extrabold text-[15px] transition-all cursor-pointer ${
                    item.checked
                      ? 'bg-[#F2677A] text-white border-[#F2677A] shadow-xs'
                      : 'bg-white text-[#2B2A4C] border-[#2B2A4C]/20 hover:border-[#F2677A]'
                  }`}
                >
                  <span>{item.checked ? t.onLabel : t.offLabel}</span>
                  <span
                    aria-hidden="true"
                    className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors ${
                      item.checked ? 'bg-white/30 justify-end' : 'bg-slate-200 justify-start'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full shadow-sm ${
                        item.checked ? 'bg-white' : 'bg-slate-600'
                      }`}
                    />
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* TIMELINE OF PAST AND CURRENT ALERTS */}
      <section
        aria-labelledby="alerts-timeline-heading"
        className="resq-card p-6 sm:p-8 space-y-6 bg-white border-2 border-[#2B2A4C]/10"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2
              id="alerts-timeline-heading"
              className="text-xl sm:text-2xl font-extrabold text-[#2B2A4C]"
            >
              {t.timelineTitle}
            </h2>
            <p className="text-[15px] text-[#6B6A8A]">{t.timelineSub}</p>
          </div>

          {triggeredAlerts.length > 0 && (
            <button
              type="button"
              onClick={clearTriggeredAlerts}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[14px] bg-[#FFF9F4] hover:bg-[#E8DEFF] border border-[#2B2A4C]/15 text-sm font-bold text-[#2B2A4C] cursor-pointer"
            >
              <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.clearHistoryBtn}</span>
            </button>
          )}
        </div>

        {/* Loading Skeleton State */}
        {isLoadingSkeleton ? (
          <div
            role="status"
            aria-label="Loading alerts timeline"
            className="space-y-4"
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-5 rounded-[20px] bg-[#FFF9F4] border border-[#2B2A4C]/10 animate-pulse space-y-3"
              >
                <div className="h-6 w-44 bg-[#E8DEFF]/60 rounded-full" />
                <div className="h-5 w-3/4 bg-[#E8DEFF]/40 rounded-lg" />
              </div>
            ))}
          </div>
        ) : triggeredAlerts.length === 0 ? (
          /* Friendly Empty State */
          <div className="p-8 rounded-[20px] bg-[#FFF9F4] border-2 border-dashed border-[#2B2A4C]/20 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#D8F5E6] border-2 border-[#34C38F] text-[#11694A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
            </div>
            <div className="space-y-1 max-w-lg mx-auto">
              <h3 className="text-xl font-extrabold text-[#2B2A4C]">
                {t.emptyTitle}
              </h3>
              <p className="text-[15px] text-[#6B6A8A]">{t.emptySub}</p>
            </div>
            <div>
              <button
                type="button"
                onClick={restoreSampleAlerts}
                className="btn-main inline-flex items-center gap-2.5 cursor-pointer text-[15px]"
              >
                <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t.restoreAlertsBtn}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Simple Vertical Timeline of Past & Current Alerts */
          <ol className="relative border-l-4 border-[#E8DEFF] ml-3 sm:ml-5 pl-5 sm:pl-7 space-y-6">
            {triggeredAlerts.map((alert, idx) => {
              const displayTime = alert.timeLabel
                ? alert.timeLabel[lang]
                : alert.time;

              const dotColor =
                alert.severity === 'DANGER'
                  ? 'bg-[#E5484D] border-[#FFDDE8]'
                  : alert.severity === 'PRONE'
                  ? 'bg-[#F59A4A] border-[#FFE3D3]'
                  : 'bg-[#34C38F] border-[#D8F5E6]';

              const itemBg =
                idx % 3 === 0
                  ? 'bg-[#FFE3D3] border-[#F7CBB6]'
                  : idx % 3 === 1
                  ? 'bg-[#FFDDE8] border-[#F5C5D4]'
                  : 'bg-[#DCEBFF] border-[#BACFFF]';

              return (
                <li key={alert.id} className="relative">
                  {/* Timeline Node Dot */}
                  <span
                    aria-hidden="true"
                    className={`w-5 h-5 rounded-full border-4 ${dotColor} absolute -left-[32px] sm:-left-[40px] top-6`}
                  />

                  <div className={`p-5 sm:p-6 rounded-[20px] border-2 flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all ${itemBg}`}>
                    <div className="space-y-2.5 flex-1">
                      {/* 1. Coloured Icon + Word Severity & 2. Time */}
                      <div className="flex flex-wrap items-center gap-3">
                        {renderRiskBadge(
                          alert.severity,
                          t.riskWords[alert.severity]
                        )}

                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6B6A8A]">
                          <Clock
                            className="w-4 h-4 text-[#6B6A8A] shrink-0"
                            aria-hidden="true"
                          />
                          <span>{displayTime}</span>
                        </span>
                      </div>

                      {/* 3. One-Line Plain Message */}
                      <p className="text-base sm:text-lg font-bold text-[#2B2A4C] leading-snug">
                        {alert.message[lang]}
                      </p>
                    </div>

                    {/* 4. Button: "See safe route" (Only the first item uses .btn-main so there is 1 main button on screen) */}
                    <div className="shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveTab('route')}
                        className={`${
                          idx === 0 ? 'btn-main' : 'btn-secondary'
                        } w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer text-[15px]`}
                      >
                        <Navigation
                          className="w-4 h-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{t.seeSafeRouteBtn}</span>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
};
