'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
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

  // Initial welcome message based on locale
  const getInitialMessage = (): Message => {
    let welcome = 'Namaste! I am Kisan Mitra, your AI farming & crop schemes advisor. Ask me about crop diseases, pest remedies, fertilizers, or PM-Kisan.';
    if (locale === 'kn') {
      welcome = 'ನಮಸ್ಕಾರ! ನಾನು ಕಿಸಾನ್ ಮಿತ್ರ, ನಿಮ್ಮ ಎಐ ಕೃಷಿ ಮತ್ತು ಬೆಳೆ ಯೋಜನೆಗಳ ಸಹಾಯಕ. ಬೆಳೆ ರೋಗಗಳು, ಕೀಟ ನಿಯಂತ್ರಣ, ರಸಗೊಬ್ಬರಗಳು ಅಥವಾ ಪಿಎಂ-ಕಿಸಾನ್ ಬಗ್ಗೆ ಕೇಳಿ.';
    } else if (locale === 'hi') {
      welcome = 'नमस्ते! मैं किसान मित्र हूँ, आपका एआई फसल और सरकारी योजना सलाहकार। मुझसे फसलों के रोग, कीट नियंत्रण, खाद या पीएम-किसान के बारे में पूछें।';
    }
    return {
      id: 'welcome_1',
      sender: 'bot',
      text: welcome,
      time: 'Just now',
    };
  };

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Quick prompt chips
  const quickChips = [
    {
      en: '🍅 Tomato Leaf Curl Remedy',
      kn: '🍅 ಟೊಮ್ಯಾಟೊ ಎಲೆ ಮುದುರು ರೋಗ',
      hi: '🍅 टमाटर पत्ती मरोड़ का इलाज',
      query: 'tomato leaf curl virus remedy',
    },
    {
      en: '🐛 Cotton Bollworm Control',
      kn: '🐛 ಹತ್ತಿ ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು',
      hi: '🐛 कपास सुंडी की रोकथाम',
      query: 'cotton pink bollworm management',
    },
    {
      en: '🧪 Organic Jeevamrutha Recipe',
      kn: '🧪 ನೈಸರ್ಗಿಕ ಜೀವಾಮೃತ ತಯಾರಿಕೆ',
      hi: '🧪 प्राकृतिक जीवामृत बनाने की विधि',
      query: 'organic jeevamrutha preparation recipe',
    },
    {
      en: '🏛️ PM-Kisan & Fasal Bima',
      kn: '🏛️ ಪಿಎಂ-ಕಿಸಾನ್ ಮತ್ತು ಬೆಳೆ ವಿಮೆ',
      hi: '🏛️ पीएम-किसान और फसल बीमा',
      query: 'pm kisan installment and pmfby claim status',
    },
    {
      en: '💧 Drip Irrigation Tips',
      kn: '💧 ಹನಿ ನೀರಾವರಿ ಸಲಹೆಗಳು',
      hi: '💧 टपक सिंचाई के सुझाव',
      query: 'drip irrigation tips for vegetables and sugarcane',
    },
  ];

  // Intelligent Agricultural Knowledge Base
  const generateFarmerResponse = (query: string): string => {
    const q = query.toLowerCase();

    // Tomato Leaf Curl / Diseases
    if (q.includes('tomato') || q.includes('ಟೊಮ್ಯಾಟೊ') || q.includes('टमाटर') || q.includes('curl') || q.includes('ಮುದುರು') || q.includes('मरोड़')) {
      if (locale === 'kn') {
        return 'ಟೊಮ್ಯಾಟೊ ಎಲೆ ಮುದುರು ರೋಗ (Leaf Curl Virus) ಬಿಳಿ ನೊಣಗಳಿಂದ (Whitefly) ಹರಡುತ್ತದೆ:\n1. 5 ಮಿ.ಲೀ ಬೇವಿನ ಎಣ್ಣೆ (Neem Oil 10,000 ppm) ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.\n2. ಹಳದಿ ಜಿಗುಟು ಬಲೆಗಳನ್ನು (Yellow sticky traps) ಎಕರೆಗೆ 10-12 ಅಳವಡಿಸಿ.\n3. ತೀವ್ರ ಬಾಧೆಗೆ ಇಮಿಡಾಕ್ಲೋಪ್ರಿಡ್ 0.3 ಮಿ.ಲೀ/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ.\n4. ಬಾಧಿತ ಗಿಡಗಳನ್ನು ತಕ್ಷಣ ಕಿತ್ತು ನಾಶಪಡಿಸಿ.';
      }
      if (locale === 'hi') {
        return 'टमाटर में पत्ती मरोड़ रोग (लीफ कर्ल) सफेद मक्खी (Whitefly) द्वारा फैलता है:\n1. 5 मिली नीम तेल प्रति लीटर पानी में मिलाकर छिड़काव करें।\n2. खेत में प्रति एकड़ 10-12 पीले चिपचिपे कार्ड (Yellow Sticky Traps) लगाएं।\n3. अधिक प्रकोप होने पर इमिडाक्लोप्रिड (0.3 मिली/लीटर) का छिड़काव करें।\n4. गंभीर रूप से संक्रमित पौधों को उखाड़कर नष्ट कर दें।';
      }
      return 'Tomato Leaf Curl Virus is transmitted by whiteflies:\n1. Spray Neem Oil (10,000 ppm) at 5ml/litre water to control vectors.\n2. Install 10-12 yellow sticky traps per acre.\n3. For severe infestation, apply Imidacloprid 17.8 SL at 0.3ml/litre.\n4. Uproot and burn heavily infected plants immediately.';
    }

    // Cotton / Bollworm / Soil
    if (q.includes('cotton') || q.includes('bollworm') || q.includes('ಹತ್ತಿ') || q.includes('कपास') || q.includes('सुंडी')) {
      if (locale === 'kn') {
        return 'ಹತ್ತಿಯಲ್ಲಿ ಗುಲಾಬಿ ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು (Pink Bollworm) ನಿಯಂತ್ರಣ:\n1. ಎಕರೆಗೆ 8-10 ಲಿಂಗಾಕರ್ಷಕ ಬಲೆಗಳನ್ನು (Pheromone Traps) ಅಳವಡಿಸಿ.\n2. ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 2 ಗ್ರಾಂ ಬೇಸಿಲಸ್ ತುರಿಂಜಿಯೆನ್ಸಿಸ್ (Bt) ಅಥವಾ ಬೇವಿನ ಕಷಾಯ ಸಿಂಪಡಿಸಿ.\n3. ಕಪ್ಪು ಮಣ್ಣಿನಲ್ಲಿ ಆಳವಾದ ಉಳುಮೆ ಮಾಡಿ ಕೋಶಾವಸ್ಥೆಯಲ್ಲಿರುವ ಕೀಟಗಳನ್ನು ಬಿಸಿಲಿಗೆ ಒಡ್ಡಿ.';
      }
      if (locale === 'hi') {
        return 'कपास में गुलाबी सुंडी (Pink Bollworm) की रोकथाम के उपाय:\n1. प्रति एकड़ 8-10 फेरोमोन ट्रैप (Pheromone Traps) लगाएं।\n2. प्रारंभिक अवस्था में नीम का अर्क (5%) या बीटी (Bt) 2 ग्राम/लीटर का छिड़काव करें।\n3. प्यूपा नष्ट करने के लिए गर्मियों में खेत की गहरी जुताई करें।';
      }
      return 'Cotton Pink Bollworm management:\n1. Install 8-10 pheromone traps per acre to monitor moth activity.\n2. Spray Neem seed kernel extract (5%) or Bacillus thuringiensis (Bt) at 2g/litre.\n3. Deep ploughing in summer exposes pupae to sunlight and predators.';
    }

    // Jeevamrutha / Organic Farming
    if (q.includes('jeevamrutha') || q.includes('organic') || q.includes('ಜೀವಾಮೃತ') || q.includes('जीवामृत') || q.includes('प्राकृतिक')) {
      if (locale === 'kn') {
        return 'ನೈಸರ್ಗಿಕ ಜೀವಾಮೃತ ತಯಾರಿಕೆ (200 ಲೀಟರ್ ಡ್ರಮ್):\n1. 10 ಕೆ.ಜಿ ನಾಟಿ ಹಸುವಿನ ಸಗಣಿ + 10 ಲೀಟರ್ ಗೋಮೂತ್ರ.\n2. 2 ಕೆ.ಜಿ ಕಪ್ಪು ಬೆಲ್ಲ + 2 ಕೆ.ಜಿ ಕಡಲೆಹಿಟ್ಟು (ದ್ವಿದಳ ಧಾನ್ಯ ಹಿಟ್ಟು).\n3. 1 ಹಿಡಿ ಬದುವಿನ ಫಲವತ್ತಾದ ಮಣ್ಣು ಸೇರಿಸಿ 200 ಲೀಟರ್ ನೀರು ತುಂಬಿಸಿ.\n4. ನೆರಳಿನಲ್ಲಿ 48 ಗಂಟೆಗಳ ಕಾಲ ದಿನಕ್ಕೆ 2 ಬಾರಿ ಕಲಕಿ. 3ನೇ ದಿನ ನೀರಾವರಿಯೊಂದಿಗೆ ಎಕರೆಗೆ ಹಾಯಿಸಿ.';
      }
      if (locale === 'hi') {
        return 'प्राकृतिक जीवामृत बनाने की सरल विधि (200 लीटर):\n1. 10 किग्रा देशी गाय का ताजा गोबर + 10 लीटर गोमूत्र।\n2. 2 किग्रा पुराना गुड़ + 2 किग्रा बेसन (दाल का आटा)।\n3. 1 मुट्ठी खेत की उपजाऊ मिट्टी मिलाकर 200 लीटर पानी भरें।\n4. छांव में रखकर 48 घंटे तक सुबह-शाम डंडे से हिलाएं। 3 दिन बाद सिंचाई जल के साथ प्रति एकड़ प्रयोग करें।';
      }
      return 'Organic Jeevamrutha preparation (200L batch):\n1. 10kg desi cow dung + 10L cow urine in 200L water.\n2. Add 2kg organic jaggery + 2kg gram flour (besan) + a handful of fertile farm soil.\n3. Stir clockwise twice daily in shade for 48 hours.\n4. Apply via drip or canal irrigation within 7 days per acre.';
    }

    // PM-Kisan & Fasal Bima
    if (q.includes('kisan') || q.includes('scheme') || q.includes('pm') || q.includes('ವಿಮೆ') || q.includes('बीमा') || q.includes('fasal') || q.includes('insurance')) {
      if (locale === 'kn') {
        return 'ಸರ್ಕಾರಿ ಕೃಷಿ ಯೋಜನೆಗಳ ಮಾಹಿತಿ:\n1. ಪಿಎಂ-ಕಿಸಾನ್ (PM-Kisan): ಆಧಾರ್ ಲಿಂಕ್ ಮತ್ತು ಇ-ಕೆವೈಸಿ (eKYC) ಪೂರ್ಣಗೊಂಡ ರೈತರಿಗೆ ವಾರ್ಷಿಕ ₹6,000 ನೇರ ಜಮಾ.\n2. ಪ್ರಧಾನಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (PMFBY): ಪ್ರಕೃತಿ ವಿಕೋಪದಿಂದ ಬೆಳೆ ಹಾನಿಯಾದರೆ 72 ಗಂಟೆಗಳ ಒಳಗೆ ಕ್ರಾಪ್ ಇನ್ಶೂರೆನ್ಸ್ ಆ್ಯಪ್ ಅಥವಾ ಟೋಲ್ ಫ್ರೀ 1800-180-1551 ಗೆ ಕರೆ ಮಾಡಿ ದೂರು ದಾಖಲಿಸಿ.';
      }
      if (locale === 'hi') {
        return 'सरकारी कृषि योजनाओं के दिशानिर्देश:\n1. पीएम-किसान (PM-Kisan): ई-केवाईसी (eKYC) और बैंक खाते में आधार सीडिंग अनिवार्य है, जिससे ₹6,000 सालाना सहायता मिलती है।\n2. पीएम फसल बीमा (PMFBY): प्राकृतिक आपदा से फसल नुकसान होने पर 72 घंटे के अंदर क्रॉप इंश्योरेंस ऐप या 1800-180-1551 पर सूचना दर्ज कराएं।';
      }
      return 'Government Agricultural Schemes Guide:\n1. PM-Kisan: Requires verified land records, Aadhaar bank seeding, and eKYC to receive ₹6,000/year in 3 tranches.\n2. PM Fasal Bima Yojana (PMFBY): For localized crop losses (flood/drought/pest), report within 72 hours via the Crop Insurance App or toll-free helpline 1800-180-1551.';
    }

    // Default Advisory
    if (locale === 'kn') {
      return 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಮಣ್ಣಿನ ಪರೀಕ್ಷಾ ವರದಿ ಮತ್ತು ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆಯ ಶಿಫಾರಸಿನಂತೆ ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣವನ್ನು ನಿರ್ಧರಿಸಿ. ಕೃಷಿ ಸಮುದಾಯದ ಇತರ ರೈತರೊಂದಿಗೆ ಚರ್ಚಿಸಲು ಪೋಸ್ಟ್ ಹಂಚಿಕೊಳ್ಳಿ.';
    }
    if (locale === 'hi') {
      return 'धन्यवाद! अपनी मिट्टी की जांच रिपोर्ट (Soil Health Card) के अनुसार ही संतुलित खाद का उपयोग करें। अधिक अनुभव जानने के लिए कृषि कम्युनिटी में अपनी पोस्ट साझा करें।';
    }
    return 'Thank you! For optimal crop yields, balance NPK according to your local Soil Health Card recommendations. You can also publish a question post to your regional farmer group for live peer experiences.';
  };

  const handleSend = (textToSend?: string) => {
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

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const responseText = generateFarmerResponse(query);
      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const mascotTitle =
    locale === 'kn' ? 'ಕಿಸಾನ್ ಮಿತ್ರ AI' : locale === 'hi' ? 'किसान मित्र AI' : 'Kisan Mitra AI';

  const mascotSubtitle =
    locale === 'kn'
      ? 'ನಿಮ್ಮ 24/7 ಕೃಷಿ ಸಲಹೆಗಾರ'
      : locale === 'hi'
      ? '24/7 कृषि व योजना सलाहकार'
      : 'Crop & Schemes AI Advisor';

  return (
    <>
      {/* Floating Mascot Launcher */}
      <button
        type="button"
        className={styles.floatingLauncher}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Kisan Mitra AI Chatbot"
      >
        <div className={styles.mascotThumb}>
          <img
            src="/assets/farmers/mascot_kisan.svg"
            alt="Kisan Mitra Mascot"
            className={styles.mascotImg}
          />
          <span className={styles.onlinePulse} />
        </div>
        <div className={styles.launcherText}>
          <span className={styles.launcherTitle}>{mascotTitle}</span>
          <span className={styles.launcherSub}>{mascotSubtitle}</span>
        </div>
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
      )}

      {/* Chat Window / Drawer */}
      {isOpen && (
        <div className={styles.chatWindow} role="dialog" aria-modal="true" aria-label={mascotTitle}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <img
                src="/assets/farmers/mascot_kisan.svg"
                alt="Kisan Mitra"
                className={styles.headerMascot}
              />
              <div className={styles.headerInfo}>
                <span className={styles.headerTitle}>{mascotTitle}</span>
                <span className={styles.headerStatus}>
                  {locale === 'kn' ? 'ಸಕ್ರಿಯವಾಗಿದೆ' : locale === 'hi' ? 'ऑनलाइन सक्रिय' : 'Online · Ready to Help'}
                </span>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
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
          <div className={styles.messagesArea}>
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
                  <div className={styles.msgTime}>{m.time}</div>
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
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form className={styles.inputForm} onSubmit={handleSubmit}>
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
