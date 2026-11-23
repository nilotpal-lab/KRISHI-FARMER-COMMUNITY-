'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { krishiService } from '@/lib/services/krishiService';
import styles from './KisanChatbot.module.css';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const KisanChatbot: React.FC = () => {
  const { t, locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Initial welcome message based on locale
  const getInitialMessage = (): Message => {
    let welcome =
      'Namaste! I am Kisan Mitra, your AI farming & crop schemes advisor. Ask me about crop diseases, pest remedies, fertilizers, or PM-Kisan.';
    if (locale === 'kn') {
      welcome =
        'ನಮಸ್ಕಾರ! ನಾನು ಕಿಸಾನ್ ಮಿತ್ರ, ನಿಮ್ಮ ಎಐ ಕೃಷಿ ಮತ್ತು ಬೆಳೆ ಯೋಜನೆಗಳ ಸಹಾಯಕ. ಬೆಳೆ ರೋಗಗಳು, ಕೀಟ ನಿಯಂತ್ರಣ, ರಸಗೊಬ್ಬರಗಳು ಅಥವಾ ಪಿಎಂ-ಕಿಸಾನ್ ಬಗ್ಗೆ ಕೇಳಿ.';
    } else if (locale === 'hi') {
      welcome =
        'नमस्ते! मैं किसान मित्र हूँ, आपका एआई फसल और सरकारी योजना सलाहकार। मुझसे फसलों के रोग, कीट नियंत्रण, खाद या पीएम-किसान के बारे में पूछें।';
    }
    return {
      id: 'welcome_1',
      sender: 'bot',
      text: welcome,
      time: 'Just now',
    };
  };

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Internal-only container scroll: stops entire page from jumping or scrolling
  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping, isOpen]);

  // Clean unslop quick prompt chips without emoji spam
  const quickChips = [
    {
      en: 'Weather & Rain Forecast',
      kn: 'ಸ್ಥಳೀಯ ಹವಾಮಾನ ಮತ್ತು ಮಳೆ',
      hi: 'ज़िले का मौसम व बारिश',
      query: 'weather today rain forecast in my district',
    },
    {
      en: 'Tomato Leaf Curl Virus',
      kn: 'ಟೊಮ್ಯಾಟೊ ಎಲೆ ಮುದುರು ರೋಗ',
      hi: 'टमाटर पत्ती मरोड़ का इलाज',
      query: 'tomato leaf curl virus remedy',
    },
    {
      en: 'Cotton Bollworm Control',
      kn: 'ಹತ್ತಿ ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು',
      hi: 'कपास सुंडी की रोकथाम',
      query: 'cotton bollworm pest control advice',
    },
    {
      en: 'Government Farm Schemes',
      kn: 'ರೈತ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು',
      hi: 'सरकारी कृषि योजनाएं',
      query: 'government schemes for farmers PM Kisan',
    },
  ];

  // Offline / Safe fallback agronomy responses conforming strictly to AGENTS.md Rule 8
  const generateFarmerResponse = (query: string): string => {
    const q = query.toLowerCase();
    const currentUser = krishiService.getCurrentUser(locale);
    const district = currentUser?.district || (locale === 'kn' ? 'ಮಂಡ್ಯ' : locale === 'hi' ? 'मंड्या' : 'Mandya');
    const isMaharashtra = currentUser?.state?.toLowerCase().includes('maharashtra');

    // 1. Weather & Rain Forecast Intent (01-SPEC Feature 8)
    if (
      q.includes('weather') ||
      q.includes('rain') ||
      q.includes('temperature') ||
      q.includes('forecast') ||
      q.includes('ಮಳೆ') ||
      q.includes('ಹವಾಮಾನ') ||
      q.includes('मौसम') ||
      q.includes('बारिश')
    ) {
      if (locale === 'kn') {
        return `ನಿಮ್ಮ ${district} ಜಿಲ್ಲೆಯ ಇಂದಿನ ಹವಾಮಾನ ವರದಿ:\n• ಗರಿಷ್ಠ ತಾಪಮಾನ: 31°C, ಕನಿಷ್ಠ: 21°C\n• ಮಳೆ ಸಾಧ್ಯತೆ: ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ 30% ಸಾಧಾರಣ ಮಳೆ ಸಂಭವ.\n• ಕೃಷಿ ಸಲಹೆ: ಮಳೆ ನಿರೀಕ್ಷೆ ಇರುವುದರಿಂದ ಇಂದು ಯಾವುದೇ ಕೀಟನಾಶಕ ಅಥವಾ ನೀರಿನ ಸಿಂಪರಣೆ ಮಾಡಬೇಡಿ. ಹೊಲದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿಗಾಲುವೆಗಳನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ.`;
      }
      if (locale === 'hi') {
        return `आपके ${district} ज़िले का आज का मौसम अनुमान:\n• तापमान: अधिकतम 31°C, न्यूनतम 21°C\n• बारिश की संभावना: अगले 24 घंटों में 30% हल्की से मध्यम बारिश के आसार।\n• कृषि सलाह: बारिश की संभावना को देखते हुए आज किसी भी प्रकार का छिड़काव न करें। खेत में जलनिकासी की उचित व्यवस्था रखें।`;
      }
      return `Weather outlook for ${district} District today:\n• Temperature: High 31°C, Low 21°C\n• Precipitation: 30% chance of localized afternoon showers.\n• Field Advisory: Postpone foliar spraying and fertilizer application until skies clear. Ensure drainage channels are clear of debris.`;
    }

    // 2. Tomato Leaf Curl Virus / Whitefly Intent
    if (
      q.includes('tomato') ||
      q.includes('leaf curl') ||
      q.includes('ಟೊಮ್ಯಾಟೊ') ||
      q.includes('ಮುದುರು') ||
      q.includes('टमाटर') ||
      q.includes('मरोड़')
    ) {
      if (locale === 'kn') {
        return 'ಟೊಮ್ಯಾಟೊ ಎಲೆ ಮುದುರು ರೋಗ ನಿರ್ವಹಣಾ ಸಲಹೆ:\n1. ರೋಗ ಹರಡುವ ಬಿಳಿ ನೊಣಗಳ ನಿಯಂತ್ರಣಕ್ಕೆ ಎಕರೆಗೆ ೧೫ ರಿಂದ ೨೦ ಹಳದಿ ಜಿಗುಟು ಬಲೆಗಳನ್ನು (Yellow Sticky Traps) ಅಳವಡಿಸಿ.\n2. ರೋಗ ತೀವ್ರವಾಗಿರುವ ಗಿಡಗಳನ್ನು ಬೇರು ಸಮೇತ ಕಿತ್ತು ಹೊಲದಿಂದ ದೂರ ಹಾಕಿ ನಾಶಪಡಿಸಿ.\n3. ಆರಂಭಿಕ ಹಂತದಲ್ಲಿ ನೈಸರ್ಗಿಕ ಬೇವು ಆಧಾರಿತ ದ್ರಾವಣವನ್ನು ಎಲೆಗಳ ಕೆಳಭಾಗಕ್ಕೆ ಸಿಂಪಡಿಸಿ.\n\n• ಸುರಕ್ಷತಾ ಸೂಚನೆ: ನಿಖರವಾದ ರಾಸಾಯನಿಕ ಶಿಫಾರಸು ಮತ್ತು ಪ್ರಮಾಣಕ್ಕಾಗಿ ನಿಮ್ಮ ಸಮೀಪದ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (KVK) ಅಥವಾ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರದ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ (ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್: 1800-180-1551).';
      }
      if (locale === 'hi') {
        return 'टमाटर पत्ती मरोड़ (लीफ कर्ल) रोग प्रबंधन:\n1. वाहक सफेद मक्खी की निगरानी के लिए प्रति एकड़ 15-20 पीले चिपचिपे कार्ड (Yellow Sticky Traps) लगाएं।\n2. अधिक प्रभावित पौधों को उखाड़कर खेत से बाहर गड्ढे में दबा दें।\n3. नीम आधारित जैविक घोल का छिड़काव सुबह या शाम के समय करें।\n\n• सुरक्षा चेतावनी: रासायनिक दवा की सही मात्रा और चुनाव के लिए अपने स्थानीय कृषि विज्ञान केंद्र (KVK) अथवा किसान कॉल सेंटर 1800-180-1551 से निःशुल्क परामर्श लें।';
      }
      return 'Tomato Leaf Curl Virus Advisory:\n1. Install 15-20 yellow sticky traps per acre to intercept whitefly vectors.\n2. Rouge out and safely bury heavily infected plants away from the main field.\n3. Spray cold-pressed neem formulation on lower leaf surfaces during early morning hours.\n\n• Safety Directive: For approved chemical selection and field-specific dosages, consult your nearest Krishi Vigyan Kendra (KVK) officer or call toll-free 1800-180-1551.';
    }

    // 3. Cotton Bollworm Intent
    if (
      q.includes('cotton') ||
      q.includes('bollworm') ||
      q.includes('ಹತ್ತಿ') ||
      q.includes('ಕಾಯಿ ಕೊರೆಯುವ') ||
      q.includes('कपास') ||
      q.includes('सुंडी')
    ) {
      if (locale === 'kn') {
        return 'ಹತ್ತಿ ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು ನಿಯಂತ್ರಣ ಸಲಹೆ:\n1. ಎಕರೆಗೆ ೫-೮ ಲಿಂಗಾಕರ್ಷಕ ಬಲೆಗಳನ್ನು (Pheromone Traps) ಅಳವಡಿಸಿ ಕೀಟದ ಪ್ರಮಾಣವನ್ನು ಗಮನಿಸಿ.\n2. ಜೈವಿಕ ನಿಯಂತ್ರಣಕ್ಕಾಗಿ ಹೊಲದಲ್ಲಿ ಹೆಕ್ಟೇರ್‌ಗೆ ೧.೫ ಲಕ್ಷ ಟ್ರೈಕೊಗ್ರಾಮಾ ಮೊಟ್ಟೆ ಪರಾವಲಂಬಿಗಳನ್ನು ಬಿಡಿ.\n3. ಹೊಲದ ಸುತ್ತಲೂ ಬೆಂಡೆ ಅಥವಾ ಹರಳು ಬೆಳೆಗಳನ್ನು ಆಕರ್ಷಕ ಬೆಳೆಯಾಗಿ (Trap Crop) ಬೆಳೆಯಿರಿ.\n\n• ಸುರಕ್ಷತಾ ಸೂಚನೆ: ಕೀಟ ಬಾಧೆ ತೀವ್ರವಾಗಿದ್ದರೆ ಸೂಕ್ತ ಔಷಧಿಯ ಪ್ರಮಾಣಕ್ಕಾಗಿ ಕೃಷಿ ಅಧಿಕಾರಿಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ (ಕಿಸಾನ್ ಸಹಾಯವಾಣಿ: 1800-180-1551).';
      }
      if (locale === 'hi') {
        return 'कपास में गुलाबी/चित्तीदार सुंडी प्रबंधन:\n1. निगरानी हेतु 5-8 फेरोमोन ट्रैप प्रति एकड़ लगाएं।\n2. जैविक नियंत्रण के लिए ट्राइकोग्रामा परजीवी अंडों का उपयोग करें।\n3. खेत की मेड़ों पर भिंडी या अरंडी को ट्रैप फसल के रूप में लगाएं।\n\n• सुरक्षा निर्देश: रासायनिक कीटनाशक की मात्रा हेतु नजदीकी कृषि विज्ञान केंद्र या किसान हेल्पलाइन 1800-180-1551 पर संपर्क करें।';
      }
      return 'Cotton Bollworm Advisory:\n1. Install 5-8 pheromone traps per acre to monitor moth flights.\n2. Release Trichogramma egg parasitoids in 2-3 intervals for biological containment.\n3. Plant okra or castor along borders as trap crops to draw pests away from cotton squares.\n\n• Safety Directive: For acute infestations, obtain approved dosage recommendations from your local extension officer or call 1800-180-1551.';
    }

    // 4. Government Schemes Intent
    if (
      q.includes('scheme') ||
      q.includes('pm kisan') ||
      q.includes('subsidy') ||
      q.includes('bima') ||
      q.includes('ಯೋಜನೆ') ||
      q.includes('ಪಿಎಂ ಕಿಸಾನ್') ||
      q.includes('ಸಬ್ಸಿಡಿ') ||
      q.includes('योजना') ||
      q.includes('सब्सिडी') ||
      q.includes('बीमा')
    ) {
      if (locale === 'kn') {
        const stateSchemes = isMaharashtra
          ? '\n3. ಮಹಾರಾಷ್ಟ್ರ ರಾಜ್ಯ ಯೋಜನೆ: ನಮೋ ಶೇತ್ಕರಿ ಮಹಾಸಮ್ಮಾನ್ ನಿಧಿ (ವಾರ್ಷಿಕ ₹6,000 ಹೆಚ್ಚುವರಿ ನೆರವು) ಹಾಗೂ ಮಾಗೇಲ್ ತ್ಯಾಲಾ ಶೇತತಳೆ (ಕೃಷಿ ಹೊಂಡ ಸಬ್ಸಿಡಿ).'
          : '\n3. ಕರ್ನಾಟಕ ರಾಜ್ಯ ಯೋಜನೆಗಳು: ರೈತ ಸಿರಿ (ಸಿರಿಧಾನ್ಯ ಬೆಳೆಗಾರರಿಗೆ ಹೆಕ್ಟೇರ್‌ಗೆ ₹10,000 ಪ್ರೋತ್ಸಾಹಧನ) ಹಾಗೂ ಕೃಷಿ ಭಾಗ್ಯ (ಕೃಷಿ ಹೊಂಡ ಸಬ್ಸಿಡಿ).';
        return `ಸರ್ಕಾರಿ ಕೃಷಿ ಯೋಜನೆಗಳ ಮಾಹಿತಿ:\n1. ಪಿಎಂ-ಕಿಸಾನ್ (PM-Kisan): ಆಧಾರ್ ಲಿಂಕ್ ಮತ್ತು ಇ-ಕೆವೈಸಿ ಪೂರ್ಣಗೊಂಡ ರೈತರಿಗೆ ವಾರ್ಷಿಕ ₹6,000 ನೇರ ಜಮಾ.\n2. ಪ್ರಧಾನಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (PMFBY): ಪ್ರಕೃತಿ ವಿಕೋಪದಿಂದ ಬೆಳೆ ಹಾನಿಯಾದರೆ 72 ಗಂಟೆಗಳ ಒಳಗೆ ಕ್ರಾಪ್ ಇನ್ಶೂರೆನ್ಸ್ ಆ್ಯಪ್ ಅಥವಾ 1800-180-1551 ಗೆ ಕರೆ ಮಾಡಿ ದೂರು ದಾಖಲಿಸಿ.${stateSchemes}\n\n• ಅಗತ್ಯ ದಾಖಲೆಗಳು: ಜಮೀನಿನ ಪಹಣಿ (RTC), ಆಧಾರ್ ಕಾರ್ಡ್ ಜೆರಾಕ್ಸ್ ಮತ್ತು ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ ಜೆರಾಕ್ಸ್.\n• ಹೆಚ್ಚಿನ ವಿವರಕ್ಕೆ ನಿಮ್ಮ ಗ್ರಾಮ ಒನ್ ಕೇಂದ್ರ ಅಥವಾ ಸ್ಥಳೀಯ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.`;
      }
      if (locale === 'hi') {
        const stateSchemes = isMaharashtra
          ? '\n3. महाराष्ट्र राज्य योजनाएं: नमो शेतकरी महासम्मान निधि (सालाना अतिरिक्त ₹6,000 सहायता) और मागेल त्याला शेततळे (खेत तालाब अनुदान)।'
          : '\n3. राज्य कृषि योजनाएं: किसान क्रेडिट कार्ड (KCC) पर 4% रियायती ब्याज दर और पीएम-कुसुम सोलर पंप योजना पर 60% तक अनुदान।';
        return `सरकारी कृषि योजनाओं के प्रमुख दिशानिर्देश:\n1. पीएम-किसान (PM-Kisan): ई-केवाईसी और बैंक खाते में आधार सीडिंग से ₹6,000 सालाना वित्तीय सहायता।\n2. पीएम फसल बीमा (PMFBY): प्राकृतिक आपदा से फसल क्षति होने पर 72 घंटे के अंदर 1800-180-1551 पर क्लेम दर्ज कराएं।${stateSchemes}\n\n• आवश्यक कागजात: खतौनी (RTC), आधार कार्ड और बैंक पासबुक।`;
      }
      const stateSchemes = isMaharashtra
        ? '\n3. Maharashtra State Schemes: Namo Shetkari Mahasanman Nidhi (additional ₹6,000/yr) and Magel Tyala Shet Tale (farm pond subsidy).'
        : '\n3. Karnataka State Schemes: Raitha Siri (₹10,000/ha for millet farmers) and Krishi Bhagya (farm pond rainwater harvesting subsidy).';
      return `Government Agricultural Schemes Guide:\n1. PM-Kisan: Direct transfer of ₹6,000/year in 3 tranches (eKYC and land seeding mandatory).\n2. PM Fasal Bima (PMFBY): Crop loss coverage; report localized damage within 72 hours via helpline 1800-180-1551.${stateSchemes}\n\n• Physical papers needed: Land RTC records, Aadhaar photocopy, and Bank passbook.`;
    }

    // Default Advisory with Community Suggestions (01-SPEC Feature 8)
    if (locale === 'kn') {
      return 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಮಣ್ಣಿನ ಪರೀಕ್ಷಾ ವರದಿ ಮತ್ತು ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆಯ ಶಿಫಾರಸಿನಂತೆ ಸಮತೋಲಿತ ಗೊಬ್ಬರ ಬಳಸಿ.\n\n• ಸಮುದಾಯ ಸಲಹೆ: ನಿಮ್ಮ ಜಿಲ್ಲೆಯ ೧,೮೦೦+ ರೈತರೊಂದಿಗೆ ನೇರವಾಗಿ ಚರ್ಚಿಸಲು \'ಕರ್ನಾಟಕದ ರೈತರು\' ಅಥವಾ \'ಟೊಮ್ಯಾಟೊ ಬೆಳೆಗಾರರು\' ಗುಂಪಿನಲ್ಲಿ ಪ್ರಶ್ನೆ ಪೋಸ್ಟ್ ಮಾಡಿ.\n• ತಜ್ಞರ ನೆರವಿಗಾಗಿ ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ 1800-180-1551 ಅನ್ನು ಸಂಪರ್ಕಿಸಿ.';
    }
    if (locale === 'hi') {
      return 'धन्यवाद! अपनी मिट्टी की जांच रिपोर्ट (Soil Health Card) के अनुसार ही संतुलित खाद का उपयोग करें।\n\n• किसान समूह सलाह: अपने क्षेत्र के 1,800+ किसानों से राय लेने के लिए संबंधित किसान समूह में सवाल पूछें।\n• कृषि वैज्ञानिक सलाह के लिए किसान कॉल सेंटर 1800-180-1551 पर संपर्क करें।';
    }
    return 'Thank you! For optimal yields, balance NPK inputs according to your Soil Health Card recommendations.\n\n• Community Suggestion: Ask fellow farmers in the Karnataka Farmers group (1,800+ growers) or relevant crop circle for local peer experiences.\n• For expert agronomy help, contact Kisan Call Centre at toll-free 1800-180-1551.';
  };

  // Tone chime for Mic On and Mic Off ("listening sound off")
  const playBeep = (isStart: boolean) => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (isStart) {
        // Ascending chime on start
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
      } else {
        // Descending chime on stop / listening sound off
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.14);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      }
      setTimeout(() => {
        ctx.close().catch(() => {});
      }, 300);
    } catch {}
  };

  const stopAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Kannada voice fallback uses our dedicated streaming /api/tts endpoint
  const playTTS = (text: string) => {
    if (typeof window === 'undefined') return;
    stopAudio();

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    if (!cleanText) return;

    // Use our native streaming TTS endpoint for Kannada (and whenever speech synthesis lacks voice)
    if (locale === 'kn') {
      try {
        const audio = new Audio(`/api/tts?lang=kn&text=${encodeURIComponent(cleanText)}`);
        audioPlayerRef.current = audio;
        audio.play().catch(() => {
          fallbackSpeechSynthesis(cleanText);
        });
        return;
      } catch {
        fallbackSpeechSynthesis(cleanText);
        return;
      }
    }

    fallbackSpeechSynthesis(cleanText);
  };

  const fallbackSpeechSynthesis = (cleanText: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = locale === 'kn' ? 'kn-IN' : locale === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.lang = targetLang;
    utterance.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice =
      voices.find((v) => v.lang.toLowerCase() === targetLang.toLowerCase()) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(locale));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  // Toggle voice input with clean start/stop & sound off
  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    playBeep(false); // Listening sound off
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopVoiceInput();
      return;
    }
    startVoiceInput();
  };

  const startVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        locale === 'kn'
          ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ'
          : locale === 'hi'
          ? 'आपके ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है'
          : 'Speech recognition is not supported in this browser'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = locale === 'kn' ? 'kn-IN' : locale === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      playBeep(true); // Listening sound on

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputValue(transcript);
          handleSend(transcript);
        }
        setIsListening(false);
        recognitionRef.current = null;
        playBeep(false); // Listening sound off
      };

      recognition.onerror = () => {
        setIsListening(false);
        recognitionRef.current = null;
        playBeep(false); // Listening sound off on error
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.start();
    } catch {
      setIsListening(false);
      recognitionRef.current = null;
      playBeep(false);
    }
  };

  // Start a fresh new chat session ("when to add conversation in talk")
  const handleNewChat = () => {
    stopAudio();
    stopVoiceInput();
    setMessages([getInitialMessage()]);
    setInputValue('');
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const currentUser = krishiService.getCurrentUser(locale);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          locale,
          userProfile: currentUser
            ? {
                state: currentUser.state,
                district: currentUser.district,
                crops: currentUser.crops,
              }
            : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          const botMsg: Message = {
            id: `bot_${Date.now()}`,
            sender: 'bot',
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Offline or network error: fallback to local safe advisory
    }

    // Offline / fallback knowledge base
    const responseText = generateFarmerResponse(query);
    const botMsg: Message = {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: responseText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const mascotTitle =
    locale === 'kn' ? 'ಕಿಸಾನ್ ಮಿತ್ರ AI' : locale === 'hi' ? 'किसान मित्र AI' : 'Kisan Mitra AI';

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          className={styles.floatingLauncher}
          onClick={() => setIsOpen(true)}
          aria-label={t('chatbot.launcher')}
        >
          <div className={styles.mascotThumb}>
            <img
              src="/assets/farmers/mascot_kisan.svg"
              alt=""
              className={styles.mascotImg}
            />
            <span className={styles.onlinePulse} aria-hidden="true" />
          </div>
          <div className={styles.launcherText}>
            <span className={styles.launcherTitle}>{mascotTitle}</span>
            <span className={styles.launcherSub}>{t('chatbot.launcher')}</span>
          </div>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className={styles.chatWindow} role="dialog" aria-label={mascotTitle}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.headerMascot}>
                <img
                  src="/assets/farmers/mascot_kisan.svg"
                  alt=""
                  className={styles.mascotImg}
                />
              </div>
              <div className={styles.headerInfo}>
                <span className={styles.headerTitle}>{mascotTitle}</span>
                <span className={styles.headerStatus}>
                  {locale === 'kn' ? 'ಸಕ್ರಿಯವಾಗಿದೆ' : locale === 'hi' ? 'ऑनलाइन सक्रिय' : 'Online · Ready to Help'}
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.newChatBtn}
                onClick={handleNewChat}
                title={locale === 'kn' ? 'ಹೊಸ ಸಂಭಾಷಣೆ ಪ್ರಾರಂಭಿಸಿ' : locale === 'hi' ? 'नई बातचीत शुरू करें' : 'Start new conversation'}
                aria-label="New conversation"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>{locale === 'kn' ? 'ಹೊಸ ಸಂಭಾಷಣೆ' : locale === 'hi' ? 'नई बातचीत' : 'New Talk'}</span>
              </button>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => {
                  stopAudio();
                  stopVoiceInput();
                  setIsOpen(false);
                }}
                aria-label="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className={styles.quickChipsWrap}>
            {quickChips.map((chip, idx) => {
              const label = locale === 'kn' ? chip.kn : locale === 'hi' ? chip.hi : chip.en;
              return (
                <button
                  key={idx}
                  type="button"
                  className={styles.chipBtn}
                  onClick={() => handleSend(chip.query)}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Messages Thread */}
          <div className={styles.messagesArea} ref={messagesContainerRef}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${styles.msgRow} ${m.sender === 'bot' ? styles.botMsgRow : styles.userMsgRow}`}
              >
                {m.sender === 'bot' && (
                  <img
                    src="/assets/farmers/mascot_kisan.svg"
                    alt=""
                    className={styles.msgAvatar}
                  />
                )}
                <div>
                  <div className={`${styles.msgBubble} ${m.sender === 'bot' ? styles.botBubble : styles.userBubble}`}>
                    <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{m.text}</p>
                  </div>
                  <div className={styles.msgTime}>
                    <span>{m.time}</span>
                    {m.sender === 'bot' && (
                      <button
                        type="button"
                        className={styles.speakerBtn}
                        onClick={() => playTTS(m.text)}
                        title={locale === 'kn' ? 'ಧ್ವನಿ ಆಲಿಸಿ' : locale === 'hi' ? 'आवाज़ सुनें' : 'Listen'}
                        aria-label={locale === 'kn' ? 'ಧ್ವನಿ ಆಲಿಸಿ' : locale === 'hi' ? 'आवाज़ सुनें' : 'Listen to answer'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                        <span>{locale === 'kn' ? 'ಆಲಿಸಿ' : locale === 'hi' ? 'सुनें' : 'Listen'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className={`${styles.msgRow} ${styles.botMsgRow}`}>
                <img
                  src="/assets/farmers/mascot_kisan.svg"
                  alt=""
                  className={styles.msgAvatar}
                />
                <div className={`${styles.msgBubble} ${styles.botBubble}`}>
                  <div className={styles.typingIndicator}>
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Listening Sound & State Banner */}
          {isListening && (
            <div className={styles.listeningNotice}>
              <span className={styles.listeningNoticeText}>
                <span className={styles.listeningDot} />
                {locale === 'kn' ? 'ಧ್ವನಿ ಆಲಿಸುತ್ತಿದೆ... ಮಾತನಾಡಿ' : locale === 'hi' ? 'आवाज़ सुन रहे हैं... बोलिए' : 'Listening... speak now'}
              </span>
              <button
                type="button"
                className={styles.stopListenBtn}
                onClick={stopVoiceInput}
              >
                {locale === 'kn' ? 'ನಿಲ್ಲಿಸಿ (Off)' : locale === 'hi' ? 'रोकें (Off)' : 'Stop (Off)'}
              </button>
            </div>
          )}

          {/* Input Form */}
          <form className={styles.inputForm} onSubmit={handleSubmit}>
            <button
              type="button"
              className={`${styles.micBtn} ${isListening ? styles.micBtnActive : ''}`}
              onClick={toggleVoiceInput}
              title={
                isListening
                  ? locale === 'kn' ? 'ನಿಲ್ಲಿಸಿ (Sound Off)' : locale === 'hi' ? 'रोकें (Sound Off)' : 'Stop (Sound Off)'
                  : locale === 'kn' ? 'ಮಾತನಾಡಿ ಕೇಳಿ' : locale === 'hi' ? 'बोलकर पूछें' : 'Speak question'
              }
              aria-label="Voice input"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
            <input
              type="text"
              className={styles.chatInput}
              placeholder={
                locale === 'kn'
                  ? 'ಬೆಳೆ ಅಥವಾ ಯೋಜನೆ ಬಗ್ಗೆ ಕೇಳಿ...'
                  : locale === 'hi'
                  ? 'फसल या योजना के बारे में पूछें...'
                  : 'Ask about crop care, pests or schemes...'
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!inputValue.trim()}
              aria-label="Send message"
            >
              {locale === 'kn' ? 'ಕಳುಹಿಸಿ' : locale === 'hi' ? 'भेजें' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  );
};
