import type { AlertMessage } from '../types';

export const initialAlerts: AlertMessage[] = [
  {
    id: 'alert-01',
    timestamp: '15:10 IST',
    severity: 'CRITICAL',
    zoneIds: ['z-01', 'z-02'],
    zonesText: 'Velachery & Pallikaranai Marsh Basin',
    title: {
      en: 'RED ALERT: Severe Lake Overflow & Imminent Submergence',
      ta: 'சிவப்பு எச்சரிக்கை: ஏரி தீவிர உபரி நீர் வெளியேற்றம் & உடனடி மூழ்குதல் ஆபத்து',
      hi: 'रेड अलर्ट: गंभीर झील अतिप्रवाह और तत्काल जलमग्न होने का खतरा',
    },
    description: {
      en: 'Velachery Lake surplus channel has breached secondary bunds. Water levels expected to rise by 70cm within 30 minutes in low-lying ground floors.',
      ta: 'வேளச்சேரி ஏரி உபரி நீர் கால்வாய் கரைகளை உடைத்துள்ளது. அடுத்த 30 நிமிடங்களில் தரைதள வீடுகளில் நீர்மட்டம் 70 செ.மீ வரை உயரும்.',
      hi: 'वेलाचेरी झील का अतिरिक्त पानी तटबंधों को तोड़ चुका है। अगले 30 मिनट में निचले इलाकों में पानी 70 सेमी तक बढ़ने की आशंका है।',
    },
    actionableStep: {
      en: 'EVACUATE IMMEDIATELY to Guru Nanak College Relief Center on higher ground. Switch off main electricity breakers before leaving.',
      ta: 'உடனடியாக குருநானக் கல்லூரி நிவாரண முகாமிற்கு செல்லுங்கள். வீட்டை விட்டு கிளம்பும் முன் மின்சாரத்தை முழுமையாக அணைக்கவும்.',
      hi: 'तुरंत ऊंचे स्थान पर स्थित गुरु नानक कॉलेज राहत केंद्र में जाएं। निकलने से पहले मुख्य बिजली का स्विच बंद करें।',
    },
    audioWarningTriggered: true,
  },
  {
    id: 'alert-02',
    timestamp: '15:05 IST',
    severity: 'CRITICAL',
    zoneIds: ['z-03', 'z-05', 'z-06'],
    zonesText: 'Saidapet, Kotturpuram & Jafferkhanpet (Adyar Riverbank)',
    title: {
      en: 'FLASH FLOOD: Chembarambakkam Outflow Increased to 8,450 Cusecs',
      ta: 'திடீர் வெள்ளம்: செம்பரம்பாக்கம் உபரி நீர் 8,450 கன அடியாக அதிகரிப்பு',
      hi: 'अचानक बाढ़: चेम्बरमबक्कम जल निकासी बढ़कर 8,450 क्यूसेक हुई',
    },
    description: {
      en: 'Adyar River levels approaching causeway heights at Saidapet Maraimalai Adigal Bridge. Riverbanks will overflow within 45 minutes.',
      ta: 'சைதாப்பேட்டை மறைமலை அடிகள் பாலம் அருகே அடையாறு நதி தரைப்பால உயரத்தை நெருங்குகிறது. 45 நிமிடங்களில் கரையோரங்கள் மூழ்கும்.',
      hi: 'सैदापेट में अड्यार नदी का जलस्तर पुल के करीब पहुंच रहा है। 45 मिनट के भीतर किनारे जलमग्न होने की आशंका है।',
    },
    actionableStep: {
      en: 'Residents within 200m of Adyar riverbanks must move to first floor or proceed to Saidapet Model School Shelter.',
      ta: 'அடையாறு நதிக்கரையிலிருந்து 200 மீட்டருக்குள் இருக்கும் பொதுமக்கள் முதல் தளத்திற்கு செல்லவும் அல்லது மாதிரி பள்ளி முகாமிற்கு வரவும்.',
      hi: 'अड्यार नदी से 200 मीटर के भीतर रहने वाले तुरंत पहली मंजिल पर जाएं या राहत शिविर में शरण लें।',
    },
    audioWarningTriggered: true,
  },
  {
    id: 'alert-03',
    timestamp: '14:52 IST',
    severity: 'CRITICAL',
    zoneIds: ['z-10', 'z-11'],
    zonesText: 'Mudichur & Varadharajapuram Lowlands',
    title: {
      en: 'ISOLATION THREAT: Outer Ring Road Access Impassable',
      ta: 'போக்குவரத்து துண்டிப்பு: முடிச்சூர் வெளிவட்ட சாலை மூழ்கியது',
      hi: 'अलगाव का खतरा: मुडिचूर आउटर रिंग रोड पूरी तरह जलमग्न',
    },
    description: {
      en: 'Mudichur Main Road has water depth exceeding 1.1 meters. Light vehicles cannot pass. NDRF Amphibious boats dispatched.',
      ta: 'முடிச்சூர் பிரதான சாலையில் 1.1 மீட்டருக்கு மேல் தண்ணீர் தேங்கியுள்ளது. இலகுரக வாகனங்கள் செல்ல முடியாது. பேரிடர் மீட்பு படகுகள் அனுப்பப்பட்டுள்ளன.',
      hi: 'मुडिचूर मेन रोड पर पानी का स्तर 1.1 मीटर से अधिक है। गाड़ियाँ नहीं चल सकतीं। बचाव नावें भेजी गई हैं।',
    },
    actionableStep: {
      en: 'Do not attempt to wade through moving water. Signal with bright cloths from terraces for boat pickup.',
      ta: 'பாய்ந்தோடும் நீரில் நடக்க முயற்சிக்காதீர்கள். மாடியிலிருந்து ஒளிரும் துணிகளை காட்டி படகு மீட்புக் குழுவை அழைக்கவும்.',
      hi: 'बहते पानी में चलने की कोशिश न करें। नाव द्वारा बचाव के लिए छत से चमकीले कपड़े से इशारा करें।',
    },
    audioWarningTriggered: true,
  },
  {
    id: 'alert-04',
    timestamp: '14:40 IST',
    severity: 'CRITICAL',
    zoneIds: ['z-17', 'z-19'],
    zonesText: 'Vyasarpadi & Korukkupet (North Chennai Subways)',
    title: {
      en: 'SUBWAY INUNDATION: Ganesapuram & Jeeva Subways Submerged',
      ta: 'சுரங்கப்பாதை மூழ்கியது: கணேசபுரம் & ஜீவா ரயில்வே சுரங்கப்பாதைகள் மூடல்',
      hi: 'सबवे जलमग्न: गणेशापुरम और जीवा सबवे पूरी तरह बंद',
    },
    description: {
      en: 'Captain Cotton Canal backflow has submerged railway underpasses to 1.4m. Electric supply to water pumps lost.',
      ta: 'கேப்டன் காட்டன் கால்வாய் நிரம்பி வழிந்ததால் ரயில்வே சுரங்கப்பாதைகளில் 1.4 மீட்டர் தண்ணீர் தேங்கியுள்ளது. மின்சாரம் நிறுத்தப்பட்டுள்ளது.',
      hi: 'कैप्टन कॉटन नहर का पानी भरने से रेलवे सबवे में 1.4 मीटर पानी भर गया है। बिजली सप्लाई बंद कर दी गई है।',
    },
    actionableStep: {
      en: 'Motorists completely avoid Vyasarpadi underpasses. Commuters divert to Basin Bridge flyover.',
      ta: 'வாகன ஓட்டிகள் வியாசர்பாடி சுரங்கப்பாதைகளை முற்றிலும் தவிர்க்கவும். பேசின் பிரிட்ஜ் மேம்பாலத்தை பயன்படுத்தவும்.',
      hi: 'व्यासरपाडी सबवे से दूर रहें। बेसिन ब्रिज फ्लाईओवर का इस्तेमाल करें।',
    },
    audioWarningTriggered: false,
  },
  {
    id: 'alert-05',
    timestamp: '14:25 IST',
    severity: 'WARNING',
    zoneIds: ['z-12', 'z-58'],
    zonesText: 'West Mambalam & Kodambakkam Subway Corridor',
    title: {
      en: 'ORANGE WARNING: Mambalam Canal Inversion & Subway Surcharge',
      ta: 'ஆரஞ்சு எச்சரிக்கை: மாம்பலம் கால்வாய் நீர்மட்டம் அதிகரிப்பு & சுரங்கப்பாதைகள் மூடல்',
      hi: 'ऑरेंज अलर्ट: माम्बलम नहर का जलस्तर बढ़ा, सबवे बंद',
    },
    description: {
      en: 'Doraisamy subway closed. Heavy waterlogging along Lake View Road and Arya Gowda Road.',
      ta: 'துரைசாமி சுரங்கப்பாதை மூடப்பட்டது. லேக் வியூ ரோடு மற்றும் ஆர்ய கவுடா சாலையில் கடும் தண்ணீர் தேக்கம்.',
      hi: 'दोराईसामी सबवे बंद कर दिया गया है। लेक व्यू रोड पर भारी जलजमाव।',
    },
    actionableStep: {
      en: 'Use Usman Road Flyover only. Park vehicles on designated multi-level parking grounds.',
      ta: 'உஸ்மான் சாலை மேம்பாலத்தை மட்டுமே பயன்படுத்தவும். வாகனங்களை உயரமான இடங்களில் பாதுகாப்பாக நிறுத்தவும்.',
      hi: 'केवल उस्मान रोड फ्लाईओवर का उपयोग करें। गाड़ियों को ऊंचे स्थानों पर पार्क करें।',
    },
    audioWarningTriggered: false,
  },
  {
    id: 'alert-06',
    timestamp: '14:10 IST',
    severity: 'WARNING',
    zoneIds: ['z-21', 'z-55'],
    zonesText: 'Ennore Creek & Tondiarpet Coastal Margins',
    title: {
      en: 'TIDAL SURGE ALERT: High Tide Peak (1.92m) Restricting Creek Discharge',
      ta: 'கடல் அலை சீற்றம்: உயர் அலை (1.92 மீ) காரணமாக முகத்துவாரத்தில் நீர் தேக்கம்',
      hi: 'ज्वार की चेतावनी: उच्च ज्वार (1.92 मीटर) से मुहाने पर पानी रुका',
    },
    description: {
      en: 'Seawater ingress slowing storm water outflow into Bay of Bengal. Low-lying coastal fishing colonies experiencing backwash.',
      ta: 'வங்காள விரிகுடாவில் உயர் அலை காரணமாக மழைநீர் வடிவது தாமதமாகிறது. கடலோர குடியிருப்புகளில் கடல்நீர் உள்புகும் வாய்ப்பு.',
      hi: 'समुद्र में तेज ज्वार के कारण बारिश का पानी रुक रहा है। निचले तटीय इलाकों में पानी भर सकता है।',
    },
    actionableStep: {
      en: 'Fisherfolk secure crafts to upper anchorages. Move away from sea walls and creek bunds.',
      ta: 'மீனவர்கள் தங்கள் படகுகளை மேடான பகுதிகளில் கட்டவும். கடல் தடுப்புச் சுவர்கள் அருகே செல்ல வேண்டாம்.',
      hi: 'मछुआरें अपनी नावें सुरक्षित स्थान पर बांधें। समुद्र तट और बांधों से दूर रहें।',
    },
    audioWarningTriggered: false,
  },
  {
    id: 'alert-07',
    timestamp: '13:45 IST',
    severity: 'WATCH',
    zoneIds: ['z-13', 'z-25', 'z-45'],
    zonesText: 'T. Nagar, Koyambedu Hub & Tambaram Junction',
    title: {
      en: 'YELLOW WATCH: Heavy Street Waterlogging & Commercial Disruption',
      ta: 'மஞ்சள் கண்காணிப்பு: முக்கிய சாலைகளில் மழைநீர் தேக்கம்',
      hi: 'येलो वॉच: मुख्य सड़कों पर भारी जलभराव',
    },
    description: {
      en: 'Surface ponding between 20cm to 35cm. Commercial basement parking facilities advised to deploy sandbag barricades.',
      ta: 'சாலைகளில் 20 முதல் 35 செ.மீ வரை மழைநீர் தேங்கியுள்ளது. வணிக வளாக பாதாள பார்க்கிங்குகளில் மணல் மூட்டைகள் வைக்கவும்.',
      hi: 'सड़कों पर 20 से 35 सेमी पानी। बेसमेंट पार्किंग में रेत की बोरियां लगाएं।',
    },
    actionableStep: {
      en: 'Non-essential travel discouraged. Check live road status on ResQ Grid before dispatching trucks.',
      ta: 'அத்தியாவசியமற்ற பயணங்களை தவிர்க்கவும். சரக்கு வாகனங்களை அனுப்பும் முன் சாலை நிலவரத்தை சரிபார்க்கவும்.',
      hi: 'अनावश्यक यात्रा से बचें। निकलने से पहले ResQ ग्रिड पर सड़कों की स्थिति देखें।',
    },
    audioWarningTriggered: false,
  },
  {
    id: 'alert-08',
    timestamp: '13:15 IST',
    severity: 'SAFE',
    zoneIds: ['z-27', 'z-34', 'z-48'],
    zonesText: 'Anna Nagar, Besant Nagar & Guindy High Grounds',
    title: {
      en: 'GREEN STATUS: Drainage Functioning at Full Capacity / Safe Zones',
      ta: 'பச்சை நிலை: வடிகால்கள் சீராக இயங்குகின்றன / பாதுகாப்பான பகுதிகள்',
      hi: 'ग्रीन स्टेटस: जल निकासी व्यवस्था सामान्य / सुरक्षित क्षेत्र',
    },
    description: {
      en: 'Storm water macro-drains flowing unimpeded. These zones are designated reception staging points for evacuees.',
      ta: 'மழைநீர் வடிகால்கள் தடையின்றி இயங்குகின்றன. இப்பகுதிகள் நிவாரண முகாம்களுக்கு பாதுகாப்பான இடங்களாக அறிவிக்கப்பட்டுள்ளன.',
      hi: 'नालियां सुचारू रूप से काम कर रही हैं। इन क्षेत्रों को राहत शिविरों और विस्थापितों के लिए सुरक्षित घोषित किया गया है।',
    },
    actionableStep: {
      en: 'Community volunteers can report to nearest relief depots in Guindy or Anna University for supply sorting.',
      ta: 'தன்னார்வலர்கள் கிண்டி அல்லது அண்ணா பல்கலைக்கழக நிவாரண மையங்களுக்கு சென்று உதவலாம்.',
      hi: 'स्वयंसेवक राहत सामग्री वितरण के लिए गिंडी या अन्ना यूनिवर्सिटी केंद्र में संपर्क करें।',
    },
    audioWarningTriggered: false,
  }
];
