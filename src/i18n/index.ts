import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'ResQ Grid',
      appTagline: 'Disaster Early-Warning & Smart Resource Allocation',
      city: 'Chennai Metropolitan Region',
      nav: {
        home: 'Home',
        commandCenter: 'Command Center',
        alerts: 'Citizen Alerts',
        responders: 'Responders & Logistics',
        howItWorks: 'How It Works',
      },
      status: {
        safe: 'SAFE',
        watch: 'WATCH',
        warning: 'WARNING',
        critical: 'CRITICAL',
      },
      common: {
        liveUpdates: 'LIVE TELEMETRY',
        activeSimulation: 'SIMULATION ACTIVE',
        searchZone: 'Search zone, hospital, or shelter...',
        filterByRisk: 'Filter by Risk Level',
        allZones: 'All Zones',
        elevations: 'Elevation',
        population: 'Population',
        timeToImpact: 'Time to Impact',
        predictedDepth: 'Predicted Depth',
        dispatchAmbulance: 'Dispatch Ambulance',
        deployRelief: 'Deploy Supplies',
        evacuateZone: 'Trigger Evacuation Warning',
        viewRoutes: 'View Safe Routes',
        close: 'Close',
        toggleTheme: 'Switch Theme',
        language: 'Language',
        audioAlertTest: 'Sound Siren Test',
        reducedMotion: 'Reduced Motion',
        threeDMode: '3D Inundation View',
        twoDMode: '2D Lightweight Map',
      },
      dashboard: {
        summaryTitle: 'Situational Flood Intelligence',
        totalZonesMonitored: 'Monitored Zones',
        criticalZones: 'Zones in Critical Hazard',
        peopleAtRisk: 'Citizens in Inundation Path',
        activeAmbulances: 'Ambulances Ready / Dispatched',
        shelterCapacity: 'Shelter Capacity Filled',
        simControls: 'Simulation Scenarios',
        simNormal: 'Nominal Monsoon Flow',
        simCloudburst: 'Simulate Cloudburst (+60mm/h)',
        simBreach: 'Simulate Chembarambakkam Breach (+12,000 cusecs)',
        simReset: 'Reset Baseline',
      },
      alertsPage: {
        title: 'Emergency Citizen Broadcasting',
        subtitle: 'Official early-warning alerts for families and local communities in Chennai.',
        emergencyHelpline: 'State Disaster Helpline: 1070 | Chennai Corporation: 1913 | Ambulance: 108',
        actionChecklistTitle: 'Life-Safety Checklist During Flash Floods',
        check1: 'Disconnect ground floor electrical mains & inverter charging circuits.',
        check2: 'Move elderly family members, medications, and infants to upper levels.',
        check3: 'Keep emergency go-bag ready: drinking water, dry rations, flashlight, documents.',
        check4: 'Never attempt to drive or walk through flooded underpasses or bridges.',
      },
      respondersPage: {
        title: 'Tactical Resource Dispatch & Logistics',
        subtitle: 'AI-assisted allocation matching ambulances, rescue boats, and relief supply to lowest-elevation hazard nodes.',
        hospitalsTab: 'Hospital Capacities & Power Backup',
        sheltersTab: 'Shelters & Relief Depots',
        ambulancesTab: 'Fleet Status & Dispatches',
        dispatchTrigger: 'Approve AI Dispatch Suggestion',
      },
      howItWorksPage: {
        title: 'How ResQ Grid Predicts & Allocates',
        subtitle: 'Demystifying the mathematical models, hydrodynamic elevations, and humanitarian optimization engine.',
      }
    }
  },
  ta: {
    translation: {
      appName: 'ரெஸ்க்யூ கிரிட்',
      appTagline: 'பேரிடர் முன்-எச்சரிக்கை & சீர்மிகு நிவாரண ஒதுக்கீட்டு தளம்',
      city: 'சென்னை பெருநகர பகுதி',
      nav: {
        home: 'முகப்பு',
        commandCenter: 'கட்டுப்பாட்டு மையம்',
        alerts: 'மக்கள் எச்சரிக்கைகள்',
        responders: 'மீட்புக் குழுக்கள்',
        howItWorks: 'செயல்படும் விதம்',
      },
      status: {
        safe: 'பாதுகாப்பானது (SAFE)',
        watch: 'கண்காணிப்பு (WATCH)',
        warning: 'எச்சரிக்கை (WARNING)',
        critical: 'ஆபத்தானது (CRITICAL)',
      },
      common: {
        liveUpdates: 'நேரலை அளவீடு',
        activeSimulation: 'செயற்கை உருவகப்படுத்துதல் இயங்குகிறது',
        searchZone: 'பகுதி, மருத்துவமனை அல்லது முகாமைத் தேடுக...',
        filterByRisk: 'ஆபத்து நிலை வாரியாக வடிகட்டுக',
        allZones: 'அனைத்து பகுதிகள்',
        elevations: 'உயர மட்டம்',
        population: 'மக்கள் தொகை',
        timeToImpact: 'வெள்ள பாதிப்பு நேரம்',
        predictedDepth: 'கணிக்கப்பட்ட நீர் ஆழம்',
        dispatchAmbulance: 'ஆம்புலன்ஸ் அனுப்புக',
        deployRelief: 'நிவாரணப் பொருட்கள் அனுப்புக',
        evacuateZone: 'வெளியேற்ற எச்சரிக்கை விடுக்க',
        viewRoutes: 'பாதுகாப்பான வழித்தடங்கள்',
        close: 'மூடுக',
        toggleTheme: 'வண்ண மாற்றம்',
        language: 'மொழி',
        audioAlertTest: 'எச்சரிக்கை ஒலி சோதனை',
        reducedMotion: 'அசைவு குறைப்பு',
        threeDMode: '3D முப்பரிமாண வரைபடம்',
        twoDMode: '2D எளிய வரைபடம்',
      },
      dashboard: {
        summaryTitle: 'நேரலை வெள்ள நிலைமை தகவல்',
        totalZonesMonitored: 'கண்காணிக்கப்படும் பகுதிகள்',
        criticalZones: 'தீவிர ஆபத்தில் உள்ள பகுதிகள்',
        peopleAtRisk: 'பாதிக்கப்படக்கூடிய மக்கள்',
        activeAmbulances: 'தயார் நிலையில் உள்ள ஆம்புலன்ஸ்கள்',
        shelterCapacity: 'முகாம் கொள்ளளவு நிரம்பியது',
        simControls: 'வெள்ள சூழ்நிலை சோதனைகள்',
        simNormal: 'வழக்கமான பருவமழை',
        simCloudburst: 'மேகவெடிப்பு மழை சோதனை (+60mm/h)',
        simBreach: 'செம்பரம்பாக்கம் உபரி நீர் திறப்பு (+12,000 cusecs)',
        simReset: 'மீண்டும் பழைய நிலைக்கு',
      },
      alertsPage: {
        title: 'அவசர கால மக்கள் அறிவிப்பு பலகை',
        subtitle: 'சென்னை குடும்பங்கள் மற்றும் சமூகங்களுக்கான அதிகாரப்பூர்வ பேரிடர் முன் எச்சரிக்கைகள்.',
        emergencyHelpline: 'மாநில பேரிடர் உதவி: 1070 | சென்னை மாநகராட்சி: 1913 | ஆம்புலன்ஸ்: 108',
        actionChecklistTitle: 'திடீர் வெள்ளத்தின் போது உயிர்காக்கும் நடவடிக்கைகள்',
        check1: 'தரைதள மின் இணைப்புகள் மற்றும் இன்வெர்ட்டர் சுவிட்சுகளை அணைக்கவும்.',
        check2: 'முதியவர்கள், குழந்தைகள் மற்றும் அவசிய மருந்துகளை முதல் தளத்திற்கு மாற்றவும்.',
        check3: 'குடிநீர், உலர் உணவு, டார்ச் லைட் மற்றும் முக்கிய ஆவணங்களை தயாராக வைக்கவும்.',
        check4: 'மூழ்கிய சுரங்கப்பாதைகள் அல்லது பாலங்கள் வழியே செல்ல முயற்சிக்காதீர்கள்.',
      },
      respondersPage: {
        title: 'மீட்பு படை வள ஒதுக்கீடு & தளவாடங்கள்',
        subtitle: 'செயற்கை நுண்ணறிவு உதவியுடன் ஆம்புலன்ஸ்கள் மற்றும் படகுகளை தேவைப்படும் பகுதிகளுக்கு உடனடியாக அனுப்புதல்.',
        hospitalsTab: 'மருத்துவமனை படுக்கைகள் & ஜெனரேட்டர்',
        sheltersTab: 'நிவாரண முகாம்கள் & கிடங்குகள்',
        ambulancesTab: 'ஆம்புலன்ஸ் நிலைமை & கண்காணிப்பு',
        dispatchTrigger: 'மீட்புக் குழுவை அனுப்புக',
      },
      howItWorksPage: {
        title: 'ரெஸ்க்யூ கிரிட் செயல்படும் விதம்',
        subtitle: 'மழைப்பொழிவு, நில அமைப்பு மற்றும் நதிநீர் ஓட்டத்தை கணிக்கும் கணித மற்றும் செயற்கை நுண்ணறிவு மாதிரிகள்.',
      }
    }
  },
  hi: {
    translation: {
      appName: 'रेस्क्यू ग्रिड',
      appTagline: 'आपदा पूर्व-चेतावनी और स्मार्ट संसाधन आवंटन प्रणाली',
      city: 'चेन्नई महानगरीय क्षेत्र',
      nav: {
        home: 'होम',
        commandCenter: 'कमांड सेंटर',
        alerts: 'नागरिक अलर्ट',
        responders: 'राहत और बचाव',
        howItWorks: 'यह कैसे काम करता है',
      },
      status: {
        safe: 'सुरक्षित (SAFE)',
        watch: 'निगरानी (WATCH)',
        warning: 'चेतावनी (WARNING)',
        critical: 'अति-गंभीर (CRITICAL)',
      },
      common: {
        liveUpdates: 'लाइव टेलीमेट्री',
        activeSimulation: 'सिमुलेशन सक्रिय',
        searchZone: 'क्षेत्र, अस्पताल या राहत शिविर खोजें...',
        filterByRisk: 'जोखिम स्तर से फ़िल्टर करें',
        allZones: 'सभी क्षेत्र',
        elevations: 'ऊंचाई स्तर',
        population: 'जनसंख्या',
        timeToImpact: 'प्रभाव का समय',
        predictedDepth: 'अनुमानित जलस्तर',
        dispatchAmbulance: 'एम्बुलेंस भेजें',
        deployRelief: 'राहत सामग्री भेजें',
        evacuateZone: 'निकासी अलर्ट जारी करें',
        viewRoutes: 'सुरक्षित मार्ग देखें',
        close: 'बंद करें',
        toggleTheme: 'थीम बदलें',
        language: 'भाषा',
        audioAlertTest: 'अलर्ट सायरन परीक्षण',
        reducedMotion: 'मोशन कम करें',
        threeDMode: '3D दृश्य',
        twoDMode: '2D हल्का नक्शा',
      },
      dashboard: {
        summaryTitle: 'बाढ़ स्थिति की वास्तविक जानकारी',
        totalZonesMonitored: 'निगरानी क्षेत्र',
        criticalZones: 'गंभीर खतरे वाले क्षेत्र',
        peopleAtRisk: 'जोखिम में नागरिक',
        activeAmbulances: 'उपलब्ध / तैनात एम्बुलेंस',
        shelterCapacity: 'राहत शिविर की क्षमता',
        simControls: 'बाढ़ सिमुलेशन परिदृश्य',
        simNormal: 'सामान्य मानसून बहाव',
        simCloudburst: 'बादल फटने का सिमुलेशन (+60mm/h)',
        simBreach: 'चेम्बरमबक्कम जल विसर्जन (+12,000 cusecs)',
        simReset: 'रीसेट करें',
      },
      alertsPage: {
        title: 'आपातकालीन नागरिक प्रसारण',
        subtitle: 'चेन्नई के नागरिकों और स्थानीय समुदायों के लिए आधिकारिक पूर्व-चेतावनी।',
        emergencyHelpline: 'राज्य आपदा हेल्पलाइन: 1070 | चेन्नई नगर निगम: 1913 | एम्बुलेंस: 108',
        actionChecklistTitle: 'बाढ़ के दौरान जीवन-सुरक्षा चेकलिस्ट',
        check1: 'निचली मंजिल के मुख्य बिजली स्विच और इनवर्टर बंद कर दें।',
        check2: 'बुजुर्गों, बच्चों और आवश्यक दवाओं को ऊपरी मंजिल पर ले जाएं।',
        check3: 'पीने का पानी, सूखा भोजन, टॉर्च और दस्तावेज़ एक बैग में तैयार रखें।',
        check4: 'जलमग्न सबवे या बहते पानी से कभी न गुजरें।',
      },
      respondersPage: {
        title: 'राहत संसाधन आवंटन और लॉजिस्टिक्स',
        subtitle: 'एआई-आधारित विश्लेषण द्वारा सबसे निचले और खतरे वाले क्षेत्रों में एम्बुलेंस और नावों की तुरंत तैनाती।',
        hospitalsTab: 'अस्पताल बेड व पावर बैकअप',
        sheltersTab: 'राहत शिविर व डिपो',
        ambulancesTab: 'एम्बुलेंस स्थिति',
        dispatchTrigger: 'तैनाती स्वीकृत करें',
      },
      howItWorksPage: {
        title: 'रेस्क्यू ग्रिड कैसे काम करता है',
        subtitle: 'भू-भाग की ऊंचाई, बारिश के आंकड़े और सुरक्षित मार्ग निर्धारण का वैज्ञानिक विश्लेषण।',
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
