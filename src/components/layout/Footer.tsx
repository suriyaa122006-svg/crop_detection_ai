import React from 'react';
import { LanguageCode } from '@/src/lib/languages';
import { Leaf, Phone, Mail, MapPin, ExternalLink, Facebook, Twitter, Youtube } from 'lucide-react';

interface FooterProps {
  language: LanguageCode;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, setActiveTab }) => {
  const t: Record<string, any> = {
    en: {
      about: "AgriLens AI is a state-of-the-art platform dedicated to empowering Indian farmers with real-time crop analytics and PMFBY insurance support.",
      quickLinks: "Quick Links",
      support: "Support & Help",
      govLinks: "Government Portals",
      contact: "Contact Us",
      contactAddress: "Old Hospital Street, Denkanikotta, Krishnagiri (dt), Tamilnadu - 635107",
      contactPhone: "9380157300",
      contactEmail: "smaneeshmanju07@gmail.com",
      rights: "All Rights Reserved.",
      links: {
        home: "Home",
        analytics: "Crop Analytics",
        calculator: "Premium Calculator",
        insurance: "Insurance Plans",
        assistant: "AI Assistant"
      }
    },
    hi: {
      about: "AgriLens AI एक अत्याधुनिक मंच है जो भारतीय किसानों को रीयल-टाइम फसल विश्लेषण और PMFBY बीमा सहायता के साथ सशक्त बनाने के लिए समर्पित है।",
      quickLinks: "त्वरित लिंक",
      support: "सहायता और मदद",
      govLinks: "सरकारी पोर्टल",
      contact: "संपर्क करें",
      contactAddress: "Old Hospital Street, Denkanikotta, Krishnagiri (dt), Tamilnadu - 635107",
      contactPhone: "9380157300",
      contactEmail: "smaneeshmanju07@gmail.com",
      rights: "सर्वाधिकार सुरक्षित।",
      links: {
        home: "होम",
        analytics: "फसल विश्लेषण",
        calculator: "प्रीमियम कैलकुलेटर",
        insurance: "बीमा योजनाएं",
        assistant: "एआई सहायक"
      }
    },
    pa: {
      about: "AgriLens AI ਇੱਕ ਅਤਿ-ਆਧੁਨਿਕ ਪਲੇਟਫਾਰਮ ਹੈ ਜੋ ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਨੂੰ ਰੀਅਲ-ਟਾਈਮ ਫਸਲੀ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ PMFBY ਬੀਮਾ ਸਹਾਇਤਾ ਨਾਲ ਸ਼ਕਤੀਸ਼ਾਲੀ ਬਣਾਉਣ ਲਈ ਸਮਰਪਿਤ ਹੈ।",
      quickLinks: "ਤੁਰੰਤ ਲਿੰਕ",
      support: "ਸਹਾਇਤਾ ਅਤੇ ਮਦਦ",
      govLinks: "ਸਰਕਾਰੀ ਪੋਰਟਲ",
      contact: "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
      contactAddress: "Old Hospital Street, Denkanikotta, Krishnagiri (dt), Tamilnadu - 635107",
      contactPhone: "9380157300",
      contactEmail: "smaneeshmanju07@gmail.com",
      rights: "ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।",
      links: {
        home: "ਹੋਮ",
        analytics: "ਫਸਲ ਵਿਸ਼ਲੇਸ਼ਣ",
        calculator: "ਪ੍ਰੀਮੀਅਮ ਕੈਲਕੁਲੇਟਰ",
        insurance: "ਬੀਮਾ ਯੋਜਨਾਵਾਂ",
        assistant: "AI ਸਹਾਇਕ"
      }
    },
    mr: {
      about: "AgriLens AI हे एक अत्याधुनिक प्लॅटफॉर्म आहे जे भारतीय शेतकऱ्यांना रिअल-टाइम पीक विश्लेषण आणि PMFBY विमा सहाय्याने सक्षम करण्यासाठी समर्पित आहे।",
      quickLinks: "द्रुत दुवे",
      support: "समर्थन आणि मदत",
      govLinks: "सरकारी पोर्टल",
      contact: "आमच्याशी संपर्क साधा",
      contactAddress: "Old Hospital Street, Denkanikotta, Krishnagiri (dt), Tamilnadu - 635107",
      contactPhone: "9380157300",
      contactEmail: "smaneeshmanju07@gmail.com",
      rights: "सर्व हक्क राखीव।",
      links: {
        home: "होम",
        analytics: "पीक विश्लेषण",
        calculator: "प्रीमियम कॅल्क्युलेटर",
        insurance: "विमा योजना",
        assistant: "AI सहाय्यक"
      }
    },
    bn: {
      about: "AgriLens AI হল একটি অত্যাধুনিক প্ল্যাটফর্ম যা ভারতীয় কৃষকদের রিয়েল-টাইম ফসল বিশ্লেষণ এবং PMFBY বিমা সহায়তার মাধ্যমে ক্ষমতায়নের জন্য নিবেদিত।",
      quickLinks: "দ্রুত লিঙ্ক",
      support: "সহায়তা এবং সাহায্য",
      govLinks: "সরকারি পোর্টাল",
      contact: "আমাদের সাথে যোগাযোগ করুন",
      contactAddress: "Old Hospital Street, Denkanikotta, Krishnagiri (dt), Tamilnadu - 635107",
      contactPhone: "9380157300",
      contactEmail: "smaneeshmanju07@gmail.com",
      rights: "সমস্ত অধিকার সংরক্ষিত।",
      links: {
        home: "হোম",
        analytics: "ফসল বিশ্লেষণ",
        calculator: "প্রিমিয়াম ক্যালকুলেটর",
        insurance: "বিমা পরিকল্পনা",
        assistant: "AI সহকারী"
      }
    },
    gu: {
      about: "AgriLens AI એ એક અત્યાધુનિક પ્લેટફોર્મ છે જે ભારતીય ખેડૂતોને રીઅલ-ટાઇમ પાક વિશ્લેષણ અને PMFBY વીમા સહાય સાથે સશક્ત બનાવવા માટે સમર્પિત છે.",
      quickLinks: "ઝડપી લિંક્સ",
      support: "સપોર્ટ અને મદદ",
      govLinks: "સરકારી પોર્ટલ",
      contact: "અમારો સંપર્ક કરો",
      contactAddress: "Old Hospital Street, Denkanikotta, Krishnagiri (dt), Tamilnadu - 635107",
      contactPhone: "9380157300",
      contactEmail: "smaneeshmanju07@gmail.com",
      rights: "તમામ હકો અનામત.",
      links: {
        home: "હોમ",
        analytics: "પાક વિશ્લેષણ",
        calculator: "પ્રીમિયમ કેલ્ક્યુલેટર",
        insurance: "વીમા યોજનાઓ",
        assistant: "AI સહાયક"
      }
    },
    ta: {
      about: "AgriLens AI என்பது இந்திய விவசாயிகளுக்கு நிகழ்நேர பயிர் பகுப்பாய்வு மற்றும் PMFBY காப்பீட்டு ஆதரவுடன் அதிகாரம் அளிப்பதற்காக அர்ப்பணிக்கப்பட்ட ஒரு அதிநவீன தளமாகும்.",
      quickLinks: "விரைவான இணைப்புகள்",
      support: "ஆதரவு மற்றும் உதவி",
      govLinks: "அரசு இணையதளங்கள்",
      contact: "எங்களைத் தொடர்பு கொள்ளுங்கள்",
      contactAddress: "Old Hospital Street, Denkanikotta, Krishnagiri (dt), Tamilnadu - 635107",
      contactPhone: "9380157300",
      contactEmail: "smaneeshmanju07@gmail.com",
      rights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
      links: {
        home: "முகப்பு",
        analytics: "பயிர் பகுப்பாய்வு",
        calculator: "பிரீமியம் கால்குலேட்டர்",
        insurance: "காப்பீட்டு திட்டங்கள்",
        assistant: "AI உதவியாளர்"
      }
    },
    te: {
      about: "AgriLens AI అనేది భారతీయ రైతులకు రియల్ టైమ్ పంట విశ్లేషణ మరియు PMFBY భీమా మద్దతుతో సాధికారత కల్పించడానికి అంకితం చేయబడిన అత్యాధునిక వేదిక.",
      quickLinks: "త్వరిత లింకులు",
      support: "మద్దతు మరియు సహాయం",
      govLinks: "ప్రభుత్వ పోర్టల్స్",
      contact: "మమ్మల్ని సంప్రదించండి",
      contactAddress: "Old Hospital Street, Denkanikotta, Krishnagiri (dt), Tamilnadu - 635107",
      contactPhone: "9380157300",
      contactEmail: "smaneeshmanju07@gmail.com",
      rights: "అన్ని హక్కులు ప్రత్యేకించబడినవి.",
      links: {
        home: "హోమ్",
        analytics: "పంట విశ్లేషణ",
        calculator: "ప్రీమియం క్యాలిక్యులేటర్",
        insurance: "భీమా పథకాలు",
        assistant: "AI సహాయకుడు"
      }
    },
    kn: {
      about: "ಅಗ್ರಿಲೆನ್ಸ್ AI ಒಂದು ಅತ್ಯಾಧುನಿಕ ವೇದಿಕೆಯಾಗಿದ್ದು, ಭಾರತೀಯ ರೈತರಿಗೆ ನೈಜ-ಸಮಯದ ಬೆಳೆ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು PMFBY ವಿಮಾ ಬೆಂಬಲದೊಂದಿಗೆ ಸಬಲೀಕರಣಗೊಳಿಸಲು ಮೀಸಲಾಗಿದೆ.",
      quickLinks: "ತ್ವರಿತ ಕೊಂಡಿಗಳು",
      support: "ಬೆಂಬಲ ಮತ್ತು ಸಹಾಯ",
      govLinks: "ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ಗಳು",
      contact: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
      contactAddress: "Old Hospital Street, Denkanikotta, Krishnagiri (dt), Tamilnadu - 635107",
      contactPhone: "9380157300",
      contactEmail: "smaneeshmanju07@gmail.com",
      rights: "ಸರ್ವ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
      links: {
        home: "ಹೋಮ್",
        analytics: "ಬೆಳೆ ವಿಶ್ಲೇಷಣೆ",
        calculator: "ಪ್ರೀಮಿಯಂ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
        insurance: "ವಿಮಾ ಯೋಜನೆಗಳು",
        assistant: "AI ಸಹಾಯಕ"
      }
    },
    ml: {
      about: "ഇന്ത്യൻ കർഷകർക്ക് തത്സമയ വിള വിശകലനവും PMFBY ഇൻഷുറൻസ് പിന്തുണയും നൽകുന്നതിനായി സമർപ്പിച്ചിരിക്കുന്ന അത്യാധുനിക പ്ലാറ്റ്‌ഫോമാണ് അഗ്രിലൻസ് AI.",
      quickLinks: "ദ്രുത ലിങ്കുകൾ",
      support: "പിന്തുണയും സഹായവും",
      govLinks: "ഗവൺമെന്റ് പോർട്ടലുകൾ",
      contact: "ഞങ്ങളെ ബന്ധപ്പെടുക",
      contactAddress: "Old Hospital Street, Denkanikotta, Krishnagiri (dt), Tamilnadu - 635107",
      contactPhone: "9380157300",
      contactEmail: "smaneeshmanju07@gmail.com",
      rights: "എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
      links: {
        home: "ഹോം",
        analytics: "വിള വിശകലനം",
        calculator: "പ്രീമീയം കാൽക്കുലേറ്റർ",
        insurance: "ഇൻഷുറൻസ് പ്ലാനുകൾ",
        assistant: "AI സഹായി"
      }
    }
  };

  const content = t[language] || t['en'];

  return (
    <footer className="w-full bg-muted/30 border-t pt-16 pb-8 mt-0">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold tracking-tight">AgriLens <span className="text-primary">AI</span></span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {content.about}
            </p>
            <div className="flex items-center gap-4">
              <button className="h-8 w-8 rounded-full bg-background border flex items-center justify-center hover:text-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 rounded-full bg-background border flex items-center justify-center hover:text-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 rounded-full bg-background border flex items-center justify-center hover:text-primary transition-colors">
                <Youtube className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">{content.quickLinks}</h3>
            <ul className="space-y-4 text-sm text-muted-foreground text-left">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-primary transition-colors">{content.links.home}</button></li>
              <li><button onClick={() => setActiveTab('analytics')} className="hover:text-primary transition-colors">{content.links.analytics}</button></li>
              <li><button onClick={() => setActiveTab('calculator')} className="hover:text-primary transition-colors">{content.links.calculator}</button></li>
              <li><button onClick={() => setActiveTab('insurance')} className="hover:text-primary transition-colors">{content.links.insurance}</button></li>
              <li><button onClick={() => setActiveTab('assistant')} className="hover:text-primary transition-colors">{content.links.assistant}</button></li>
            </ul>
          </div>

          {/* Government Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">{content.govLinks}</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <a href="https://pmfby.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  PMFBY Portal <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://agricoop.nic.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  Ministry of Agriculture <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://enam.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  e-NAM Portal <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://dbtdacfw.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  DBT Agriculture <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6">{content.contact}</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>{content.contactAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>{content.contactPhone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>{content.contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 AgriLens AI. {content.rights}</p>
          <div className="flex items-center gap-6">
            <button className="hover:text-primary">Privacy Policy</button>
            <button className="hover:text-primary">Terms of Service</button>
            <button className="hover:text-primary">Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
