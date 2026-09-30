import React, { useState, useEffect } from 'react';
import {
  Droplets,
  AlertTriangle,
  Construction,
  TreePine,
  HelpCircle,
  Camera,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  PlusCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  useResQStore,
  CHENNAI_AREAS,
  type AuthorityReportStage,
  type CitizenRiskLevel,
} from '../store/useResQStore';
import { renderRiskBadge } from './HomePage';

type LangCode = 'en' | 'ta' | 'hi';
type ProblemChoice =
  | 'water_logging'
  | 'blocked_drain'
  | 'road_damage'
  | 'fallen_tree'
  | 'other';

const REPORTS_COPY: Record<
  LangCode,
  {
    chennaiSuffix: string;
    block1Title: string;
    block1TopLine: string;
    authorityLabel: string;
    whyLabel: string;
    stageLabels: Record<AuthorityReportStage, string>;
    block2Title: string;
    block2Sub: string;
    openFormBtn: string;
    step1Label: string;
    step2Label: string;
    step3Label: string;
    photoBtnLabel: string;
    photoSelectedLabel: (name: string) => string;
    notePlaceholder: string;
    sendToAuthorityBtn: string;
    confirmTitle: string;
    confirmText: (refId: string) => string;
    reportAnotherBtn: string;
    problemLabels: Record<ProblemChoice, string>;
    riskWords: Record<CitizenRiskLevel, string>;
  }
> = {
  en: {
    chennaiSuffix: 'Chennai',
    block1Title: 'Sent automatically',
    block1TopLine:
      'When we predict danger, we tell the authorities early so they can prepare.',
    authorityLabel: 'Greater Chennai Corporation',
    whyLabel: 'Why:',
    stageLabels: {
      SENT: 'Sent',
      SEEN: 'Seen by authority',
      ACTION_TAKEN: 'Action taken',
    },
    block2Title: 'Report a problem',
    block2Sub:
      'See water collecting, a blocked drain, or a fallen tree on your street? Send a quick report in 3 easy steps.',
    openFormBtn: 'Report a problem',
    step1Label: '① Location (auto-filled, you can edit)',
    step2Label: "② What's the problem?",
    step3Label: '③ Optional photo and a note',
    photoBtnLabel: 'Add a photo (optional)',
    photoSelectedLabel: (name) => `Photo attached: ${name}`,
    notePlaceholder: 'Write a short note (for example: near the bus stop)...',
    sendToAuthorityBtn: 'Send to authority',
    confirmTitle: 'Thank you! Your report has been sent.',
    confirmText: (refId) =>
      `Sent to Greater Chennai Corporation. Reference ID: ${refId}. Your report now appears in the list above with status "Sent".`,
    reportAnotherBtn: 'Report another problem',
    problemLabels: {
      water_logging: 'Water logging',
      blocked_drain: 'Blocked drain',
      road_damage: 'Road damage',
      fallen_tree: 'Fallen tree',
      other: 'Other',
    },
    riskWords: {
      SAFE: 'Safe',
      PRONE: 'Flood-prone',
      DANGER: 'Flood danger',
    },
  },
  ta: {
    chennaiSuffix: 'சென்னை',
    block1Title: 'தானாக அனுப்பப்பட்டவை',
    block1TopLine:
      'ஆபத்தை முன்கூட்டியே கணிக்கும்போது, அதிகாரிகள் தயாராக இருக்க உடனே தகவல் அனுப்புகிறோம்.',
    authorityLabel: 'சென்னை மாநகராட்சி',
    whyLabel: 'காரணம்:',
    stageLabels: {
      SENT: 'அனுப்பப்பட்டது',
      SEEN: 'அதிகாரிகள் பார்த்தனர்',
      ACTION_TAKEN: 'நடவடிக்கை எடுக்கப்பட்டது',
    },
    block2Title: 'பிரச்சனையைப் புகாரளிக்கவும்',
    block2Sub:
      'உங்கள் தெருவில் நீர் தேக்கம், வடிகால் அடைப்பு அல்லது மரம் விழுந்திருந்தால் 3 எளிய படிகளில் தெரிவிக்கவும்.',
    openFormBtn: 'பிரச்சனையைப் புகாரளிக்கவும்',
    step1Label: '① இடம் (தானாக நிரப்பப்பட்டது, மாற்றலாம்)',
    step2Label: '② என்ன பிரச்சனை?',
    step3Label: '③ புகைப்படம் மற்றும் குறிப்பு (விருப்பப்பட்டால்)',
    photoBtnLabel: 'புகைப்படம் சேர்க்க (விருப்பப்பட்டால்)',
    photoSelectedLabel: (name) => `புகைப்படம் இணைக்கப்பட்டது: ${name}`,
    notePlaceholder:
      'சிறிய குறிப்பு எழுதவும் (உதாரணம்: பேருந்து நிறுத்தம் அருகில்)...',
    sendToAuthorityBtn: 'அதிகாரிகளுக்கு அனுப்பவும்',
    confirmTitle: 'நன்றி! உங்கள் புகார் அனுப்பப்பட்டது.',
    confirmText: (refId) =>
      `சென்னை மாநகராட்சிக்கு அனுப்பப்பட்டது. குறிப்பு எண்: ${refId}. மேலே உள்ள பட்டியலில் "அனுப்பப்பட்டது" என்ற நிலையில் சேர்க்கப்பட்டுள்ளது.`,
    reportAnotherBtn: 'மற்றொரு பிரச்சனையைத் தெரிவிக்க',
    problemLabels: {
      water_logging: 'நீர் தேக்கம்',
      blocked_drain: 'வடிகால் அடைப்பு',
      road_damage: 'சாலை சேதம்',
      fallen_tree: 'மரம் விழுந்தது',
      other: 'மற்றவை',
    },
    riskWords: {
      SAFE: 'பாதுகாப்பு',
      PRONE: 'வெள்ள வாய்ப்பு',
      DANGER: 'வெள்ள ஆபத்து',
    },
  },
  hi: {
    chennaiSuffix: 'चेन्नई',
    block1Title: 'अपने-आप भेजी गई रिपोर्ट',
    block1TopLine:
      'जब हम खतरे का अनुमान लगाते हैं, तो अधिकारियों को पहले ही सूचित कर देते हैं ताकि वे तैयारी कर सकें।',
    authorityLabel: 'ग्रेटर चेन्नई कॉर्पोरेशन',
    whyLabel: 'कारण:',
    stageLabels: {
      SENT: 'भेजा गया',
      SEEN: 'अधिकारी ने देखा',
      ACTION_TAKEN: 'कार्रवाई की गई',
    },
    block2Title: 'समस्या रिपोर्ट करें',
    block2Sub:
      'अपनी गली में जलभराव, बंद नाला या गिरा हुआ पेड़ दिख रहा है? 3 आसान चरणों में रिपोर्ट भेजें।',
    openFormBtn: 'समस्या रिपोर्ट करें',
    step1Label: '① स्थान (अपने-आप भरा गया, आप बदल सकते हैं)',
    step2Label: '② क्या समस्या है?',
    step3Label: '③ वैकल्पिक फ़ोटो और एक छोटा नोट',
    photoBtnLabel: 'फ़ोटो जोड़ें (वैकल्पिक)',
    photoSelectedLabel: (name) => `फ़ोटो जोड़ी गई: ${name}`,
    notePlaceholder: 'छोटा नोट लिखें (उदाहरण: बस स्टॉप के पास)...',
    sendToAuthorityBtn: 'अधिकारी को भेजें',
    confirmTitle: 'धन्यवाद! आपकी रिपोर्ट भेज दी गई है।',
    confirmText: (refId) =>
      `ग्रेटर चेन्नई कॉर्पोरेशन को भेजा गया। संदर्भ आईडी: ${refId}। आपकी रिपोर्ट ऊपर सूची में "भेजा गया" स्थिति के साथ दिख रही है।`,
    reportAnotherBtn: 'कोई और समस्या रिपोर्ट करें',
    problemLabels: {
      water_logging: 'जलभराव',
      blocked_drain: 'बंद नाला',
      road_damage: 'सड़क क्षतिग्रस्त',
      fallen_tree: 'पेड़ गिरा है',
      other: 'अन्य',
    },
    riskWords: {
      SAFE: 'सुरक्षित',
      PRONE: 'जलभराव संभावित',
      DANGER: 'बाढ़ का खतरा',
    },
  },
};

const PROBLEM_OPTIONS: {
  id: ProblemChoice;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
}[] = [
  { id: 'water_logging', icon: Droplets, colorClass: 'text-[#1D4ED8]' },
  { id: 'blocked_drain', icon: AlertTriangle, colorClass: 'text-[#B45309]' },
  { id: 'road_damage', icon: Construction, colorClass: 'text-[#B91C1C]' },
  { id: 'fallen_tree', icon: TreePine, colorClass: 'text-[#15803D]' },
  { id: 'other', icon: HelpCircle, colorClass: 'text-[#0369A1]' },
];

export const ReportsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const {
    trackedAreaId,
    autoGovReports,
    addAuthorityReport,
    showToast,
  } = useResQStore();

  const rawLang = (i18n.language || 'en').slice(0, 2);
  const lang: LangCode = rawLang === 'ta' || rawLang === 'hi' ? rawLang : 'en';
  const t = REPORTS_COPY[lang];

  const trackedAreaObj =
    CHENNAI_AREAS.find((a) => a.id === trackedAreaId) || CHENNAI_AREAS[0];

  const [isFormOpen, setIsFormOpen] = useState<boolean>(true);
  const [hasEditedLocation, setHasEditedLocation] = useState<boolean>(false);
  const [locationText, setLocationText] = useState<string>(
    `${trackedAreaObj.name[lang]}, ${t.chennaiSuffix} (${trackedAreaObj.pincode})`
  );
  const [selectedProblem, setSelectedProblem] =
    useState<ProblemChoice>('water_logging');
  const [photoName, setPhotoName] = useState<string>('');
  const [noteText, setNoteText] = useState<string>('');
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);

  useEffect(() => {
    if (!hasEditedLocation) {
      setLocationText(
        `${trackedAreaObj.name[lang]}, ${t.chennaiSuffix} (${trackedAreaObj.pincode})`
      );
    }
  }, [hasEditedLocation, lang, t.chennaiSuffix, trackedAreaObj]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    const refId = `GCC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const cleanLoc =
      locationText.trim() || `${trackedAreaObj.name[lang]}, ${t.chennaiSuffix}`;
    const problemEn = REPORTS_COPY.en.problemLabels[selectedProblem];
    const problemTa = REPORTS_COPY.ta.problemLabels[selectedProblem];
    const problemHi = REPORTS_COPY.hi.problemLabels[selectedProblem];

    const reasonSuffixEn = noteText.trim()
      ? `${problemEn} — ${noteText.trim()}`
      : `${problemEn} reported by resident`;
    const reasonSuffixTa = noteText.trim()
      ? `${problemTa} — ${noteText.trim()}`
      : `${problemTa} (குடியிருப்பாளர் புகார்)`;
    const reasonSuffixHi = noteText.trim()
      ? `${problemHi} — ${noteText.trim()}`
      : `${problemHi} (नागरिक रिपोर्ट)`;

    addAuthorityReport({
      id: `user-rep-${Date.now()}`,
      refId,
      areaId: trackedAreaId,
      areaName: {
        en: cleanLoc,
        ta: cleanLoc,
        hi: cleanLoc,
      },
      streetName: {
        en: problemEn,
        ta: problemTa,
        hi: problemHi,
      },
      risk: selectedProblem === 'water_logging' ? 'DANGER' : 'PRONE',
      predictedIn: {
        en: `Reference ID: ${refId}`,
        ta: `குறிப்பு எண்: ${refId}`,
        hi: `संदर्भ आईडी: ${refId}`,
      },
      historicalBasis: {
        en: reasonSuffixEn + (photoName ? ` (Photo: ${photoName})` : ''),
        ta: reasonSuffixTa + (photoName ? ` (புகைப்படம்: ${photoName})` : ''),
        hi: reasonSuffixHi + (photoName ? ` (फ़ोटो: ${photoName})` : ''),
      },
      govActionStatus: {
        en: 'Sent to Greater Chennai Corporation',
        ta: 'சென்னை மாநகராட்சிக்கு அனுப்பப்பட்டது',
        hi: 'ग्रेटर चेन्नई कॉर्पोरेशन को भेजा गया',
      },
      sentTime: {
        en: 'Sent just now',
        ta: 'இப்போது அனுப்பப்பட்டது',
        hi: 'अभी भेजा गया',
      },
      statusStage: 'SENT',
    });

    setSubmittedRefId(refId);
    setNoteText('');
    setPhotoName('');
    showToast(t.confirmText(refId), 'success');
  };

  const renderProgressBlock = (stage: AuthorityReportStage = 'SENT') => {
    const stepIndex = stage === 'ACTION_TAKEN' ? 3 : stage === 'SEEN' ? 2 : 1;
    const progressPercent =
      stepIndex === 3 ? '100%' : stepIndex === 2 ? '66%' : '33%';

    return (
      <div className="space-y-2.5 pt-2 border-t border-[#2B2A4C]/10">
        {/* Status Chip + Authority Name */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold border-2 ${
              stepIndex === 3
                ? 'bg-[#D8F5E6] text-[#11694A] border-[#34C38F]'
                : stepIndex === 2
                ? 'bg-[#E8DEFF] text-[#2B2A4C] border-[#D5C2FF]'
                : 'bg-[#DCEBFF] text-[#2B2A4C] border-[#BACFFF]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{t.stageLabels[stage]}</span>
          </span>

          <span className="text-xs sm:text-sm font-bold text-[#6B6A8A]">
            {t.authorityLabel}
          </span>
        </div>

        {/* Small Progress Line */}
        <div className="w-full h-2 rounded-full bg-[#2B2A4C]/10 overflow-hidden">
          <div
            style={{ width: progressPercent }}
            className="h-full rounded-full bg-gradient-to-r from-[#F2677A] via-[#E8DEFF] to-[#34C38F] transition-all duration-300"
          />
        </div>

        {/* 3 Stage Labels (Sent -> Seen by authority -> Action taken) with AA contrast */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs sm:text-sm font-bold">
          <span
            className={
              stepIndex >= 1 ? 'text-[#2B2A4C]' : 'text-[#6B6A8A]'
            }
          >
            {t.stageLabels.SENT}
          </span>
          <span
            className={
              stepIndex >= 2 ? 'text-[#2B2A4C]' : 'text-[#6B6A8A]'
            }
          >
            {t.stageLabels.SEEN}
          </span>
          <span
            className={
              stepIndex >= 3 ? 'text-[#11694A]' : 'text-[#6B6A8A]'
            }
          >
            {t.stageLabels.ACTION_TAKEN}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* BLOCK 1: "Sent automatically" */}
      <section className="resq-card p-6 sm:p-8 space-y-6 bg-white border-2 border-[#2B2A4C]/10">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#2B2A4C]">
            {t.block1Title}
          </h1>
          <p className="text-base sm:text-lg font-bold text-[#F2677A] leading-relaxed">
            {t.block1TopLine}
          </p>
        </div>

        {/* Max 3 cards per row - Rotated Soft Pastels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {autoGovReports.map((rep, idx) => {
            const stage: AuthorityReportStage = rep.statusStage || 'SENT';
            const cardBg =
              idx % 3 === 0
                ? 'bg-[#DCEBFF] border-[#BACFFF]'
                : idx % 3 === 1
                ? 'bg-[#E8DEFF] border-[#D5C2FF]'
                : 'bg-[#D8F5E6] border-[#B4E8CC]';

            return (
              <div
                key={rep.id}
                className={`p-6 rounded-[20px] border-2 flex flex-col justify-between gap-5 ${cardBg}`}
              >
                <div className="space-y-3">
                  {/* Area + Predicted Risk Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base sm:text-lg font-extrabold text-[#2B2A4C]">
                      {rep.areaName[lang]}
                    </h2>
                    {renderRiskBadge(rep.risk, t.riskWords[rep.risk])}
                  </div>

                  <p className="text-base font-bold text-[#2B2A4C]">
                    {rep.streetName[lang]}
                  </p>

                  {/* Why ("Flooded 4 times in 5 years + heavy rain forecast") */}
                  <div className="p-3.5 rounded-[16px] bg-white/90 border border-[#2B2A4C]/10">
                    <span className="text-xs font-extrabold text-[#F2677A] block">
                      {t.whyLabel}
                    </span>
                    <p className="text-sm font-semibold text-[#2B2A4C] leading-snug mt-0.5">
                      {rep.historicalBasis[lang]}
                    </p>
                  </div>

                  {/* Time Sent */}
                  <div className="flex items-center gap-2 text-xs font-bold text-[#6B6A8A]">
                    <Clock
                      className="w-4 h-4 text-[#6B6A8A] shrink-0"
                      aria-hidden="true"
                    />
                    <span>{rep.sentTime[lang]}</span>
                  </div>
                </div>

                {/* Status Chip + Progress Line (Sent -> Seen by authority -> Action taken) */}
                {renderProgressBlock(stage)}
              </div>
            );
          })}
        </div>
      </section>

      {/* BLOCK 2: "Report a problem" (3-Step Form) */}
      <section className="resq-card p-6 sm:p-8 space-y-6 bg-white border-2 border-[#2B2A4C]/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2B2A4C]">
              {t.block2Title}
            </h2>
            <p className="text-[15px] text-[#6B6A8A]">{t.block2Sub}</p>
          </div>

          {!isFormOpen && (
            <button
              type="button"
              onClick={() => {
                setSubmittedRefId(null);
                setIsFormOpen(true);
              }}
              className="btn-main inline-flex items-center gap-2.5 cursor-pointer text-[15px]"
            >
              <PlusCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{t.openFormBtn}</span>
            </button>
          )}
        </div>

        {/* Friendly Confirmation Banner on Submit */}
        {submittedRefId && (
          <div className="p-5 sm:p-6 rounded-[20px] bg-[#D8F5E6] border-2 border-[#34C38F] space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="w-7 h-7 text-[#34C38F] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2B2A4C]">
                  {t.confirmTitle}
                </h3>
                <p className="text-base font-bold text-[#2B2A4C] leading-relaxed">
                  {t.confirmText(submittedRefId)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSubmittedRefId(null)}
              className="btn-main inline-flex items-center gap-2 cursor-pointer text-[15px]"
            >
              <span>{t.reportAnotherBtn}</span>
            </button>
          </div>
        )}

        {/* Simple 3-Step Form */}
        {isFormOpen && !submittedRefId && (
          <form onSubmit={handleSubmitReport} className="space-y-7 pt-2">
            {/* ① Location (auto-filled, editable) */}
            <div className="space-y-2.5">
              <label
                htmlFor="report-location-input"
                className="text-base sm:text-lg font-extrabold text-[#2B2A4C] block"
              >
                {t.step1Label}
              </label>
              <div className="relative">
                <input
                  id="report-location-input"
                  type="text"
                  value={locationText}
                  onChange={(e) => {
                    setHasEditedLocation(true);
                    setLocationText(e.target.value);
                  }}
                  className="w-full pl-12 pr-5 py-3 rounded-[16px] bg-[#FFF9F4] border-2 border-[#2B2A4C]/15 text-[15px] font-bold text-[#2B2A4C] focus:border-[#F2677A]"
                />
                <MapPin
                  className="w-5 h-5 text-[#F2677A] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* ② What's the problem (5 Big Icon Choices, max 3 cards per row) - Rotated Soft Pastels */}
            <div className="space-y-3">
              <span className="text-base sm:text-lg font-extrabold text-[#2B2A4C] block">
                {t.step2Label}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PROBLEM_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const active = selectedProblem === option.id;

                  const pastelChoiceBg =
                    option.id === 'water_logging'
                      ? 'bg-[#DCEBFF] border-[#BACFFF]'
                      : option.id === 'blocked_drain'
                      ? 'bg-[#FFE3D3] border-[#F7CBB6]'
                      : option.id === 'road_damage'
                      ? 'bg-[#FFDDE8] border-[#F5C5D4]'
                      : option.id === 'fallen_tree'
                      ? 'bg-[#D8F5E6] border-[#B4E8CC]'
                      : 'bg-[#FFF2C4] border-[#F2E09E]';

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedProblem(option.id)}
                      aria-pressed={active}
                      className={`p-5 rounded-[20px] border-2 text-left flex items-center gap-4 transition-all cursor-pointer ${pastelChoiceBg} ${
                        active
                          ? 'border-[#F2677A] ring-2 ring-[#F2677A]/25 shadow-xs'
                          : 'hover:border-[#F2677A]'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-[14px] bg-white border border-[#2B2A4C]/10 flex items-center justify-center shrink-0">
                        <Icon
                          className={`w-6 h-6 ${option.colorClass}`}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-base sm:text-lg font-extrabold text-[#2B2A4C]">
                        {t.problemLabels[option.id]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ③ Optional photo and a note */}
            <div className="space-y-4">
              <span className="text-base sm:text-lg font-extrabold text-[#2B2A4C] block">
                {t.step3Label}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                {/* Photo Upload Button */}
                <label className="btn-secondary flex items-center justify-center gap-2.5 cursor-pointer text-center text-[15px]">
                  <Camera
                    className="w-5 h-5 text-[#2B2A4C] shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    {photoName
                      ? t.photoSelectedLabel(photoName)
                      : t.photoBtnLabel}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                </label>

                {/* Note Input */}
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder={t.notePlaceholder}
                    aria-label={t.step3Label}
                    className="w-full px-5 py-3 rounded-[16px] bg-[#FFF9F4] border-2 border-[#2B2A4C]/15 text-[15px] text-[#2B2A4C] placeholder:text-[#6B6A8A] focus:border-[#F2677A]"
                  />
                </div>
              </div>
            </div>

            {/* Single Main Button on Screen: "Send to authority" */}
            <div className="pt-2">
              <button
                type="submit"
                className="btn-main inline-flex items-center justify-center gap-3 cursor-pointer text-[15px]"
              >
                <Send className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>{t.sendToAuthorityBtn}</span>
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};
