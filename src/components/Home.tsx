import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Brain, Lightbulb, FileText, ArrowRight, Search, Zap, ShieldCheck, Users, Activity, Sprout, Wheat, Leaf, Flower2, Waves, User, History, TrendingUp, CheckCircle2 } from 'lucide-react';
import { apiUrl } from '@/src/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LanguageCode } from '@/src/lib/languages';
import { getCropReportsCacheKey, resolveCropReportOwnerIdentity } from '@/src/lib/cropReports';

interface DashboardCropReport {
  _id?: string;
  cropName: string;
  detectedCondition: string;
  damageSeverity: number;
  confidenceScore: number;
  capturedAt: string;
  cropImage?: string;
}

interface HomeProps {
  setActiveTab: (tab: string) => void;
  language: LanguageCode;
  onCropSelect?: (cropId: string) => void;
  user?: any;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, language, onCropSelect, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const t: Record<string, any> = {
    en: {
      searchPlaceholder: "Search for crops, diseases, or PMFBY info...",
      heroTitle: "Welcome to the AI-Based Real-Time Crop Image Analytics System 🌱",
      heroDesc: "This platform is designed to support farmers by analyzing crop images and providing instant insights for crop health and insurance (PMFBY).",
      cta: "Get Started",
      quickCrops: "Quick Crop Access",
      crops: [{ id: 'rice', name: 'Rice', icon: Waves }, { id: 'wheat', name: 'Wheat', icon: Wheat }, { id: 'maize', name: 'Maize', icon: Sprout }, { id: 'cotton', name: 'Cotton', icon: Flower2 }, { id: 'sugarcane', name: 'Sugarcane', icon: Leaf }, { id: 'mustard', name: 'Mustard', icon: Flower2 }, { id: 'soyabean', name: 'Soyabean', icon: Sprout }, { id: 'groundnut', name: 'Groundnut', icon: Leaf }],
      stats: { accuracy: "98.5% AI Accuracy", farmers: "50k+ Farmers Joined", claims: "₹12Cr Claims Processed" },
      features: { analytics: { title: "AI Crop Analytics", desc: "Our advanced CNN models analyze crop images in real-time to detect diseases and nutrient deficiencies with high precision.", tag: "Most Popular" }, calculator: { title: "Premium Calculator", desc: "Instant estimation of your PMFBY insurance premiums based on current government rates.", tag: "Tool" }, assistant: { title: "Digital Assistant", desc: "24/7 AI support for all your farming queries and PMFBY guidance.", tag: "Support" }, reports: { title: "Smart Reports", desc: "Generate and save detailed health reports for insurance claims.", tag: "New" }, profile: { title: "My Farmer Profile", desc: "Update your details, bank account, and document status.", tag: "Account" } },
      liveImpact: "Live Impact",
      previousReportsTitle: "Previous Crop Reports",
      previousReportsDesc: "View previously analyzed crop reports, disease detection history, and saved AI analysis results.",
      noHistoryReports: "No crop reports yet for this account.",
      noHistoryReportsDesc: "Analyze a crop image to see the latest detection history here.",
      farmerFallback: "Farmer",
      districtFallback: "District",
      stateFallback: "State",
      latestUpdateLabel: "Latest update"
    },
    hi: {
      searchPlaceholder: "फसलों, बीमारियों या PMFBY जानकारी के लिए खोजें...",
      heroTitle: "एआई-आधारित रीयल-टाइम फसल छवि विश्लेषण प्रणाली में आपका स्वागत है 🌱",
      heroDesc: "यह प्लेटफॉर्म फसल की छवियों का विश्लेषण करके और फसल स्वास्थ्य और बीमा (PMFBY) के लिए त्वरित अंतर्दृष्टि प्रदान करके किसानों की सहायता के लिए डिज़ाइन किया गया है।",
      cta: "शुरू करें",
      quickCrops: "त्वरित फसल पहुंच",
      crops: [{ id: 'rice', name: 'चावल', icon: Waves }, { id: 'wheat', name: 'गेहूं', icon: Wheat }, { id: 'maize', name: 'मक्का', icon: Sprout }, { id: 'cotton', name: 'कपास', icon: Flower2 }, { id: 'sugarcane', name: 'गन्ना', icon: Leaf }, { id: 'mustard', name: 'सरसों', icon: Flower2 }, { id: 'soyabean', name: 'सोयाबीन', icon: Sprout }, { id: 'groundnut', name: 'मूंगफली', icon: Leaf }],
      stats: { accuracy: "98.5% एआई सटीकता", farmers: "50k+ किसान जुड़े", claims: "₹12Cr दावों का निपटान" },
      features: { analytics: { title: "एआई फसल विश्लेषण", desc: "हमारे उन्नत CNN मॉडल बीमारियों और पोषक तत्वों की कमी का पता लगाने के लिए विश्लेषण करते हैं।", tag: "सबसे लोकप्रिय" }, calculator: { title: "प्रीमियम कैलकुलेटर", desc: "आपके PMFBY बीमा प्रीमियम का त्वरित अनुमान।", tag: "उपकरण" }, assistant: { title: "डिजिटल सहायक", desc: "आपकी सभी खेती संबंधी पूछताछ के लिए 24/7 सहायता।", tag: "सहायता" }, reports: { title: "स्मार्ट रिपोर्ट", desc: "बीमा दावों के लिए विस्तृत स्वास्थ्य रिपोर्ट तैयार करें।", tag: "नया" }, profile: { title: "मेरी किसान प्रोफ़ाइल", desc: "अपने विवरण और बैंक खाते अपडेट करें।", tag: "खाता" } },
      liveImpact: "लाइव प्रभाव",
      previousReportsTitle: "पिछले फसल विवरण",
      previousReportsDesc: "अपनी पिछली सहेजी गई फसल रिपोर्ट, बीमारी का पता लगाने का इतिहास और विस्तृत AI स्वास्थ्य विश्लेषण परिणाम देखें।",
      farmerFallback: "किसान",
      districtFallback: "जिला",
      stateFallback: "राज्य",
      latestUpdateLabel: "नवीनतम अपडेट"
    },
    pa: {
      searchPlaceholder: "ਫਸਲਾਂ, ਬੀਮਾਰੀਆਂ ਜਾਂ PMFBY ਜਾਣਕਾਰੀ ਲਈ ਖੋਜੋ...",
      heroTitle: "AI-ਅਧਾਰਿਤ ਰੀਅਲ-ਟਾਈਮ ਫਸਲ ਚਿੱਤਰ ਵਿਸ਼ਲੇਸ਼ਣ ਪ੍ਰਣਾਲੀ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ 🌱",
      heroDesc: "ਕਿਸਾਨਾਂ ਦੀ ਸਹਾਇత ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹੈ।",
      cta: "ਸ਼ੁਰੂ ਕਰੋ",
      quickCrops: "ਤੁਰੰਤ ਫਸਲ ਪਹੁੰਚ",
      crops: [{ id: 'rice', name: 'ਚਾਵਲ', icon: Waves }, { id: 'wheat', name: 'ਕਣਕ', icon: Wheat }, { id: 'maize', name: 'ਮੱਕੀ', icon: Sprout }, { id: 'cotton', name: 'ਕਪਾਹ', icon: Flower2 }, { id: 'sugarcane', name: 'ਗੰਨਾ', icon: Leaf }, { id: 'mustard', name: 'ਸਰ੍ਹੋਂ', icon: Flower2 }, { id: 'soyabean', name: 'ਸੋਇਆਬੀਨ', icon: Sprout }, { id: 'groundnut', name: 'ਮੂੰਗਫਲੀ', icon: Leaf }],
      stats: { accuracy: "98.5% AI ਸ਼ੁੱਧਤਾ", farmers: "50k+ ਕਿਸਾਨ ਜੁੜੇ", claims: "₹12Cr ਕਲੇਮ" },
      features: { analytics: { title: "AI ਫਸਲ ਵਿਸ਼ਲੇਸ਼ਣ", desc: "ਰੀਅਲ-ਟਾਈਮ ਵਿੱਚ ਫਸਲ ਦੀਆਂ ਤਸਵੀਰਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ।", tag: "ਸਭ ਤੋਂ ਪ੍ਰਸਿੱਧ" }, calculator: { title: "ਪ੍ਰੀਮੀਅਮ ਕੈਲਕੁਲੇਟਰ", desc: "ਬੀਮਾ ਪ੍ਰੀਮੀਅਮ ਦਾ ਅਨੁਮਾਨ।", tag: "ਟੂਲ" }, assistant: { title: "ਡਿਜੀਟਲ ਸਹਾਇక", desc: "24/7 AI ਸਹਾਇਤਾ।", tag: "ਸਹਾਇతా" }, reports: { title: "ਸਮਾਰਟ ਰਿਪੋਰਟਾਂ", desc: "ਵਿਸਤ੍ਰਿਤ ਸਿਹਤ ਰਿਪੋਰਟਾਂ।", tag: "ਨਵਾਂ" }, profile: { title: "ਮੇਰੀ ਕਿਸਾਨ ਪ੍ਰੋਫਾਈల్", desc: "ਵੇਰਵੇ ਅਪਡੇట్ ਕਰੋ।", tag: "ਖਾਤਾ" } }
    },
    mr: {
      searchPlaceholder: "पिके, रोग किंवा PMFBY माहितीसाठी शोधा...",
      heroTitle: "AI-आधारित रिअल-टाइम पीक प्रतिमा विश्लेषण प्रणालीमध्ये आपले स्वागत आहे 🌱",
      heroDesc: "शेतकऱ्यांना मदत करण्यासाठी डिझाइन केलेले आहे।",
      cta: "सुरू करा",
      quickCrops: "त्वरित पीक प्रवेश",
      crops: [{ id: 'rice', name: 'तांदूळ', icon: Waves }, { id: 'wheat', name: 'गहू', icon: Wheat }, { id: 'maize', name: 'मका', icon: Sprout }, { id: 'cotton', name: 'कापूस', icon: Flower2 }, { id: 'sugarcane', name: 'ऊस', icon: Leaf }, { id: 'mustard', name: 'मोहरी', icon: Flower2 }, { id: 'soyabean', name: 'सोयाबीन', icon: Sprout }, { id: 'groundnut', name: 'भुईमूग', icon: Leaf }],
      stats: { accuracy: "98.5% AI अचूकता", farmers: "50k+ शेतकरी", claims: "₹12Cr दावे" },
      features: { analytics: { title: "AI पीक विश्लेषण", desc: "पिकांच्या प्रतिमांचे विश्लेषण।", tag: "सर्वात लोकप्रिय" }, calculator: { title: "प्रीमियम कॅल्क्युलेटर", desc: "विमा प्रीमियमचा अंदाज।", tag: "साधन" }, assistant: { title: "डिजिटल सहाय्यक", desc: "24/7 AI समर्थन।", tag: "समर्थन" }, reports: { title: "स्मार्ट अहवाल", desc: "आरोग्य अहवाल तयार करा।", tag: "नवीन" }, profile: { title: "माझी शेतकरी प्रोफाइल", desc: "खाते अपडेट करा।", tag: "खाते" } }
    },
    bn: {
      searchPlaceholder: "ফসল, রোগ বা PMFBY তথ্যের জন্য অনুসন্ধান করুন...",
      heroTitle: "AI-ভিত্তিক রিয়েল-টাইম শস্য চিত্র বিশ্লেষণ সিস্টেমে স্বাগতম 🌱",
      heroDesc: "কৃষকদের সহায়তা করার জন্য ডিজাইন করা হয়েছে।",
      cta: "শুরু করুন",
      quickCrops: "দ্রুত ফসল অ্যাক্সেস",
      crops: [{ id: 'rice', name: 'ধান', icon: Waves }, { id: 'wheat', name: 'গম', icon: Wheat }, { id: 'maize', name: 'ভুট্টা', icon: Sprout }, { id: 'cotton', name: 'তুলা', icon: Flower2 }, { id: 'sugarcane', name: 'আখ', icon: Leaf }, { id: 'mustard', name: 'সরিষা', icon: Flower2 }, { id: 'soyabean', name: 'সয়াবিন', icon: Sprout }, { id: 'groundnut', name: 'চিনাবাদাম', icon: Leaf }],
      stats: { accuracy: "৯৮.৫% AI নির্ভুলতা", farmers: "৫০ হাজার+ কৃষক", claims: "১২ কোটি টাকার দাবি" },
      features: { analytics: { title: "AI শস্য বিশ্লেষণ", desc: "রিয়েল-টাইমে শস্যের ছবি বিশ্লেষণ।", tag: "সবচেয়ে জনপ্রিয়" }, calculator: { title: "প্রিমিয়াম ক্যালকুলেটর", desc: "বিমা প্রিমিয়ামের অনুমান।", tag: "সরঞ্জাম" }, assistant: { title: "ডিজিটাল সহকারী", desc: "২৪/৭ এআই সহায়তা।", tag: "সহায়তা" }, reports: { title: "স্মার্ট রিপোর্ট", desc: "স্বাস্থ্য রিপোর্ট তৈরি করুন।", tag: "নতুন" }, profile: { title: "আমার কৃষক প্রোফাইল", desc: "অ্যাকাউন্ট আপডেট করুন।", tag: "অ্যাকাউন্ট" } }
    },
    gu: {
      searchPlaceholder: "પાક, રોગો અથવા PMFBY માહિતી માટે શોધો...",
      heroTitle: "AI-આધારિત રિયલ-ટાઇમ પાક ઇમેજ એનાલિટિક્સ સિસ્ટમમાં આપનું સ્વાગત છે 🌱",
      heroDesc: "ખેડૂતોને ટેકો આપવા માટે રચાયેલ છે.",
      cta: "શરૂ કરો",
      quickCrops: "ઝડપી પાક પ્રવેશ",
      crops: [{ id: 'rice', name: 'ચોખા', icon: Waves }, { id: 'wheat', name: 'ઘઉં', icon: Wheat }, { id: 'maize', name: 'મકાઈ', icon: Sprout }, { id: 'cotton', name: 'કપાસ', icon: Flower2 }, { id: 'sugarcane', name: 'શેરડી', icon: Leaf }, { id: 'mustard', name: 'રાઈ', icon: Flower2 }, { id: 'soyabean', name: 'સોયાબીન', icon: Sprout }, { id: 'groundnut', name: 'મગફળી', icon: Leaf }],
      stats: { accuracy: "98.5% AI ચોકસાઈ", farmers: "50k+ ખેડૂતો", claims: "₹12Cr દાવાઓ" },
      features: { analytics: { title: "AI પાક વિશ્લેષણ", desc: "છબીઓનું વિશ્લેષણ કરે છે.", tag: "સૌથી વધુ લોકપ્રિય" }, calculator: { title: "પ્રીમિયમ કેલ્ક્યુલેટર", desc: "વીમા પ્રીમિયમનો અંદાજ.", tag: "સાધન" }, assistant: { title: "ડિજિટલ સહાયક", desc: "24/7 AI સપોર્ટ.", tag: "સપોર્ટ" }, reports: { title: "સ્માર્ટ રિપોર્ટ્સ", desc: "આરોગ્ય અહેવાલો બનાવો.", tag: "નવું" }, profile: { title: "મારી ખેડૂત પ્રોફાઇલ", desc: "ખાતું અપડેટ કરો.", tag: "ખાતું" } }
    },
    ta: {
      searchPlaceholder: "பயிர்கள், நோய்கள் அல்லது PMFBY தகவல்களைத் தேடுங்கள்...",
      heroTitle: "AI-அடிப்படையிலான நிகழ்நேர பயிர் பட பகுப்பாய்வு முறை 🌱",
      heroDesc: "விவசாயிகளுக்கு ஆதரவளிக்க வடிவமைக்கப்பட்டுள்ளது.",
      cta: "தொடங்குங்கள்",
      quickCrops: "விரைவான பயிர் அணுகல்",
      crops: [{ id: 'rice', name: 'நெல்', icon: Waves }, { id: 'wheat', name: 'கோதுமை', icon: Wheat }, { id: 'maize', name: 'சோளம்', icon: Sprout }, { id: 'cotton', name: 'பருத்தி', icon: Flower2 }, { id: 'sugarcane', name: 'கரும்பு', icon: Leaf }, { id: 'mustard', name: 'கடுகு', icon: Flower2 }, { id: 'soyabean', name: 'சோயாபீன்', icon: Sprout }, { id: 'groundnut', name: 'நிலக்கடலை', icon: Leaf }],
      stats: { accuracy: "98.5% AI துல்லியம்", farmers: "50k+ விவசாயிகள்", claims: "₹12Cr கோரிக்கைகள்" },
      features: { analytics: { title: "AI பயிர் பகுப்பாய்வு", desc: "பயிர் படங்களை பகுப்பாய்வு செய்கின்றன.", tag: "மிகவும் பிரபலமானது" }, calculator: { title: "ப்ரீமியம் கால்குலேட்டர்", desc: "பிரீமியத்தின் மதிப்பீடு.", tag: "கருவி" }, assistant: { title: "டிஜิตல் உதவியாளர்", desc: "24/7 AI ஆதரவு.", tag: "ஆதரவு" }, reports: { title: "ஸ்மார்ட் அறிக்கைகள்", desc: "சுகாதார அறிக்கைகளை உருவாக்கவும்.", tag: "புதியது" }, profile: { title: "எனது விவரக்குறிப்பு", desc: "கணக்கை புதுப்பிக்கவும்.", tag: "கணக்கு" } }
    },
    te: {
      searchPlaceholder: "పంటలు, వ్యాధులు లేదా PMFBY సమాచారం కోసం వెతకండి...",
      heroTitle: "AI-ఆధారిత నిజ-సమయ పంట చిత్ర విశ్లేషణ వ్యవస్థ 🌱",
      heroDesc: "రైతులకు మద్దతు ఇవ్వడానికి రూపొందించబడింది.",
      cta: "ప్రారంభించండి",
      quickCrops: "త్వరిత పంట ప్రాప్తి",
      crops: [{ id: 'rice', name: 'వరి', icon: Waves }, { id: 'wheat', name: 'గోధుమ', icon: Wheat }, { id: 'maize', name: 'మొక్కజొన్న', icon: Sprout }, { id: 'cotton', name: 'పత్తి', icon: Flower2 }, { id: 'sugarcane', name: 'చెరకు', icon: Leaf }, { id: 'mustard', name: 'ఆవాలు', icon: Flower2 }, { id: 'soyabean', name: 'సోయాబీన్', icon: Sprout }, { id: 'groundnut', name: 'వేరుశనగ', icon: Leaf }],
      stats: { accuracy: "98.5% AI ఖచ్చితత్వం", farmers: "50k+ రైతులు", claims: "₹12Cr క్లెయిమ్స్" },
      features: { analytics: { title: "AI పంట విశ్లేషణ", desc: "చిత్రాలను విశ్లేషిస్తాయి.", tag: "చాలా ప్రాచుర్యం పొందింది" }, calculator: { title: "ప్రీమియం క్యాలిక్యులేటర్", desc: "ప్రీమియం అంచనా.", tag: "సాధనం" }, assistant: { title: "డిజిటల్ సహాయకుడు", desc: "24/7 AI మద్దతు.", tag: "మద్దతు" }, reports: { title: "స్మార్ట్ నివేదికలు", desc: "నివేదికలను సృష్టించండి.", tag: "కొత్తది" }, profile: { title: "నా ప్రొఫైల్", desc: "ఖాతాను నవీకరించండి.", tag: "ఖాతా" } }
    },
    kn: {
      searchPlaceholder: "ಬೆಳೆಗಳು, ರೋಗಗಳು ಅಥವಾ PMFBY ಮಾಹಿತಿಗಾಗಿ ಹುಡುಕಿ...",
      heroTitle: "AI-ಆಧಾರಿತ ನೈಜ-ಸಮಯದ ಬೆಳೆ ಚಿತ್ರ ವಿಶ್ಲೇಷಣಾ ವ್ಯವಸ್ಥೆ 🌱",
      heroDesc: "ರೈತರನ್ನು ಬೆಂಬಲಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.",
      cta: "ಪ್ರಾರಂಭಿಸಿ",
      quickCrops: "ತ್ವರಿತ ಬೆಳೆ ಪ್ರವೇಶ",
      crops: [{ id: 'rice', name: 'ಭತ್ತ', icon: Waves }, { id: 'wheat', name: 'ಗೋಧಿ', icon: Wheat }, { id: 'maize', name: 'ಮೆಕ್ಕೆಜೋಳ', icon: Sprout }, { id: 'cotton', name: 'ಹತ್ತಿ', icon: Flower2 }, { id: 'sugarcane', name: 'ಕಬ್ಬು', icon: Leaf }, { id: 'mustard', name: 'ಸಾಸಿವೆ', icon: Flower2 }, { id: 'soyabean', name: 'ಸೋಯಾಬೀನ್', icon: Sprout }, { id: 'groundnut', name: 'ಕಡಲೆಕಾಯಿ', icon: Leaf }],
      stats: { accuracy: "98.5% AI ನಿಖರತೆ", farmers: "50k+ ರೈತರು", claims: "₹12Cr ಹಕ್ಕುಗಳು" },
      features: { analytics: { title: "AI ಬೆಳೆ ವಿಶ್ಲೇಷಣೆ", desc: "ಬೆಳೆ ಚಿತ್ರಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತವೆ.", tag: "ಅತ್ಯಂತ ಜನಪ್ರಿಯ" }, calculator: { title: "ಪ್ರೀಮಿಯಂ ಕ್ಯಾಲ್ಕುಲೇಟರ್", desc: "ಪ್ರೀಮಿಯಂ ಅಂದಾಜು.", tag: "ಪರಿಕರ" }, assistant: { title: "ಡಿಜಿಟಲ್ ಸಹಾಯಕ", desc: "24/7 AI ಬೆಂಬಲ.", tag: "ಬೆಂಬಲ" }, reports: { title: "ಸ್ಮಾರ್ಟ್ ವರದಿಗಳು", desc: "ವರದಿಗಳನ್ನು ರಚಿಸಿ.", tag: "ಹೊಸತು" }, profile: { title: "ನನ್ನ ಪ್ರೊಫೈಲ್", desc: "ಖಾತೆಯನ್ನು ನವೀಕರಿಸಿ.", tag: "ಖಾತೆ" } }
    },
    ml: {
      searchPlaceholder: "വിളകൾ, രോഗങ്ങൾ അല്ലെങ്കിൽ PMFBY വിവരങ്ങൾക്കായി തിരയുക...",
      heroTitle: "AI-അധിഷ്ഠിത തത്സമയ വിള ചിത്ര വിശകലന സംവിധാനം 🌱",
      heroDesc: "കർഷകരെ സഹായിക്കുന്നതിനാണ് ഈ പ്ലാറ്റ്‌ഫോം.",
      cta: "ആരംഭിക്കുക",
      quickCrops: "ദ്രുത വിള ആക്സസ്",
      crops: [{ id: 'rice', name: 'നെല്ല്', icon: Waves }, { id: 'wheat', name: 'ഗോതമ്പ്', icon: Wheat }, { id: 'maize', name: 'ചോളം', icon: Sprout }, { id: 'cotton', name: 'പരുത്തി', icon: Flower2 }, { id: 'sugarcane', name: 'കരിമ്പ്', icon: Leaf }, { id: 'mustard', name: 'കടുക്', icon: Flower2 }, { id: 'soyabean', name: 'സോയാബീൻ', icon: Sprout }, { id: 'groundnut', name: 'നിലക്കടല', icon: Leaf }],
      stats: { accuracy: "98.5% AI കൃത്യത", farmers: "50k+ കർഷകർ", claims: "₹12Cr ക്ലെയിമുകൾ" },
      features: { analytics: { title: "AI വിള വിശകലനം", desc: "ചിത്രങ്ങൾ വിശകലനം ചെയ്യുന്നു.", tag: "ഏറ്റവും പ്രശസ്തമായത്" }, calculator: { title: "പ്രീമിയം കാൽക്കുലേറ്റർ", desc: "പ്രീമിയം എസ്റ്റിമേറ്റ്.", tag: "ഉപകരണം" }, assistant: { title: "ഡിജിറ്റൽ അസിസ്റ്റന്റ്", desc: "24/7 AI പിന്തുണ.", tag: "പിന്തുണ" }, reports: { title: "സ്മാർട്ട് റിപ്പോർട്ടുകൾ", desc: "റിപ്പോർട്ടുകൾ തയ്യാറാക്കുക.", tag: "പുതിയത്" }, profile: { title: "എന്റെ പ്രൊഫൈൽ", desc: "അക്കൗണ്ട് പുതുക്കുക.", tag: "അക്കൗണ്ട്" } }
    }
  };

  const content = t[language] || t['en'];

  const historyT: Record<string, any> = {
    en: {
      title: "Crop Detection History",
      desc: "Overall historical health metrics of analyzed crop photos",
      score: "Avg Health Score",
      status: "94.5% Optimal & Healthy",
      report: "Report: Out of all crop photos uploaded up to date, 94.5% of analyzed fields show no pathogen flags. General health status is excellent.",
      paddy: "Paddy (Rice)",
      wheat: "Wheat",
      maize: "Maize",
      paddyStatus: "96% Healthy & Stable",
      wheatStatus: "92% Healthy (Mild Yellowing)",
      maizeStatus: "95% Optimal Growth",
      highRisk: "High Risk",
      monitor: "Monitor",
      healthy: "Healthy"
    },
    hi: {
      title: "फ़सल पहचान इतिहास",
      desc: "विश्लेषण की गई फसल तस्वीरों के समग्र स्कोर",
      score: "औसत स्वास्थ्य स्कोर",
      status: "94.5% अनुकूल और स्वस्थ",
      report: "रिपोर्ट: आज तक अपलोड किए गए सभी फोटो में से, 94.5% से अधिक फसलें रोगमुक्त पाई गईं। पूर्ण फसल स्वास्थ्य उत्कृष्ट है।",
      paddy: "धान (चावल)",
      wheat: "गेहूं",
      maize: "मक्का",
      paddyStatus: "96% स्वस्थ और मजबूत",
      wheatStatus: "92% स्वस्थ (हल्का पीलापन)",
      maizeStatus: "95% उत्कृष्ट फसल स्वास्थ्य",
      highRisk: "उच्च जोखिम",
      monitor: "निगरानी",
      healthy: "स्वस्थ"
    },
    mr: {
      title: "पीक ओळख इतिहास",
      desc: "विश्लेषण केलेल्या पिकांच्या फोटोंचे समग्र गुण",
      score: "सरासरी पीक आरोग्य",
      status: "94.5% अनुकूल आणि निरोगी",
      report: "अहवाल: आजपर्यंत अपलोड केलेल्या सर्व फोटोंपैकी, 94.5% पिके रोगमुक्त आढळली. पीक स्थिती उत्कृष्ट आहे.",
      paddy: "भात (तांदूळ)",
      wheat: "गहू",
      maize: "मका",
      paddyStatus: "96% सुरक्षित आणि निरोगी",
      wheatStatus: "92% ठीक (सौम्य पिवळसरपणा)",
      maizeStatus: "95% उत्कृष्ट पीक स्थिती",
      highRisk: "उच्च जोखीम",
      monitor: "निगराणी",
      healthy: "निरोगी"
    },
    ta: {
      title: "பயிர் கண்டறிதல் வரலாறு",
      desc: "பகுப்பாய்வு செய்யப்பட்ட பயிர் புகைப்படங்களின் ஒட்டுமொத்த அளவீடுகள்",
      score: "சராசரி பயிர் ஆரோக்கியம்",
      status: "94.5% சிறந்த மற்றும் ஆரோக்கியமானது",
      report: "அறிக்கை: இதுவரை பதிவேற்றப்பட்ட புகைப்படங்களில், 94.5% பயிர்கள் மிகவும் ஆரோக்கியமாக இருப்பது கண்டறியப்பட்டுள்ளது.",
      paddy: "நெல்",
      wheat: "கோதுமை",
      maize: "சோளம்",
      paddyStatus: "96% ஆரோக்கியமான வளர்ச்சி",
      wheatStatus: "92% மிதமான சத்து குறைபாடு",
      maizeStatus: "95% உகந்த பயிர் ஆரோக்கியம்",
      highRisk: "அதிக ஆபத்து",
      monitor: "கண்காணிப்பு",
      healthy: "ஆரோக்கியமானது"
    }
  };

  const hContent = historyT[language] || historyT['en'];
  const ownerIdentity = resolveCropReportOwnerIdentity(user);
  const reportsCacheKey = getCropReportsCacheKey(ownerIdentity?.userMobile);

  const readCachedReports = (): DashboardCropReport[] => {
    if (typeof window === 'undefined') return [];

    try {
      const cached = window.sessionStorage.getItem(reportsCacheKey);
      if (!cached) return [];

      const parsed = JSON.parse(cached);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const [recentReports, setRecentReports] = useState<DashboardCropReport[]>(() => readCachedReports().slice(0, 3));
  const [reportsError, setReportsError] = useState<string | null>(null);

  const writeCachedReports = (items: DashboardCropReport[]) => {
    if (typeof window === 'undefined') return;

    try {
      // Keep cache small so storage quota issues do not break UI updates.
      const lightweight = items.map((item) => ({ ...item, cropImage: undefined }));
      window.sessionStorage.setItem(reportsCacheKey, JSON.stringify(lightweight));
    } catch (error) {
      console.warn('Unable to cache dashboard crop reports:', error);
    }
  };

  const loadRecentReports = async (signal?: AbortSignal) => {
    if (!ownerIdentity?.userMobile) {
      setRecentReports([]);
      setReportsError(null);
      return;
    }

    try {
      const cachedReports = readCachedReports();
      if (cachedReports.length > 0) {
        setRecentReports(cachedReports.slice(0, 3));
        setReportsError(null);
      }

      const response = await fetch(apiUrl(`/api/cropreports?mobile=${encodeURIComponent(ownerIdentity.userMobile)}`), { signal });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }

      const data: DashboardCropReport[] = await response.json();
      writeCachedReports(data);
      setRecentReports(data.slice(0, 3));
      setReportsError(null);
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        setReportsError(error?.message || 'Failed to load crop history');
        setRecentReports([]);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadRecentReports(controller.signal);

    const intervalId = window.setInterval(() => {
      loadRecentReports();
    }, 15000);

    const handleFocus = () => {
      loadRecentReports();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [ownerIdentity?.userMobile, reportsCacheKey]);

  const healthScore = useMemo(() => {
    if (recentReports.length === 0) return 0;

    const averageDamage = recentReports.reduce((total, report) => total + Number(report.damageSeverity || 0), 0) / recentReports.length;
    return Math.max(0, Math.min(100, Math.round(100 - averageDamage)));
  }, [recentReports]);

  const historySummary = useMemo(() => {
    if (recentReports.length === 0) {
      return [];
    }

    return recentReports.map((report) => ({
      label: report.cropName,
      value: `${Math.max(0, Math.min(100, Math.round(100 - Number(report.damageSeverity || 0))))}% ${Number(report.damageSeverity || 0) > 50 ? (hContent.highRisk || historyT.en.highRisk) : Number(report.damageSeverity || 0) > 20 ? (hContent.monitor || historyT.en.monitor) : (hContent.healthy || historyT.en.healthy)}`,
    }));
  }, [hContent.healthy, hContent.highRisk, hContent.maize, hContent.maizeStatus, hContent.monitor, hContent.paddy, hContent.paddyStatus, hContent.wheat, hContent.wheatStatus, recentReports]);

  return (
    <div className="space-y-4 pb-12">
      {/* Quick Crop Selection Bar */}
      <section className="container mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Search className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-primary whitespace-nowrap">{content.quickCrops}</span>
          </div>
          {content.crops.map((crop: any) => (
            <motion.button
              key={crop.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCropSelect ? onCropSelect(crop.id) : setActiveTab('analytics')}
              className="flex-shrink-0 flex items-center gap-2 px-6 py-2 rounded-full bg-background border border-border hover:border-primary hover:bg-primary/5 transition-all shadow-sm group"
            >
              <crop.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium whitespace-nowrap">{crop.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Bento Grid Features - housed in a highly polished rectangular container structure */}
      <section className="container mx-auto px-4">
        <div className="bg-card border border-border/60 rounded-[32px] p-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-40 pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            
            {/* Main AI Analytics Card - Large - 2x2 Area */}
            <motion.div
              className="md:col-span-2 md:row-span-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card 
                className="h-full relative overflow-hidden group cursor-pointer border-primary/20 hover:border-primary/40 transition-all duration-500"
                onClick={() => setActiveTab('analytics')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent group-hover:from-primary/20 transition-colors"></div>
                <CardHeader className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                      <Brain className="h-8 w-8 text-primary" />
                    </div>
                    <Badge className="bg-primary text-primary-foreground">{content.features.analytics.tag}</Badge>
                  </div>
                  <CardTitle className="text-3xl font-bold">{content.features.analytics.title}</CardTitle>
                  <CardDescription className="text-lg mt-2 max-w-md">
                    {content.features.analytics.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 flex items-end h-[calc(100%-180px)]">
                  <Button className="rounded-full px-6 group-hover:translate-x-2 transition-transform">
                    {content.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
                <div className="absolute -bottom-12 -right-12 h-48 w-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              </Card>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              className="md:col-span-1 md:row-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full bg-primary text-primary-foreground border-none shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <Activity className="h-20 w-20" />
                </div>
                <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                  <div className="space-y-1">
                    <p className="text-xs font-medium opacity-80 uppercase tracking-widest">{content.liveImpact || t.en.liveImpact}</p>
                    <h3 className="text-xl font-bold">{content.stats.accuracy}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4" /> {content.stats.farmers}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Calculator Card */}
            <motion.div
              className="md:col-span-1 md:row-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card 
                className="h-full hover:shadow-lg transition-all border-primary/20 cursor-pointer group"
                onClick={() => setActiveTab('calculator')}
              >
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    <Zap className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{content.features.calculator.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{content.features.calculator.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Assistant Card */}
            <motion.div
              className="md:col-span-1 md:row-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card 
                className="h-full hover:shadow-lg transition-all border-primary/20 cursor-pointer group"
                onClick={() => setActiveTab('assistant')}
              >
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{content.features.assistant.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{content.features.assistant.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Previous Crop Reports Card */}
            <motion.div
              className="md:col-span-1 md:row-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card 
                className="h-full hover:shadow-xl hover:translate-y-[-4px] border-green-200 hover:border-green-400 bg-white dark:bg-zinc-900 transition-all duration-300 cursor-pointer group shadow-sm overflow-hidden relative"
                onClick={() => setActiveTab('reports')}
              >
                <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                  <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white transition-colors group-hover:text-green-600 dark:group-hover:text-green-400">
                      {content.previousReportsTitle || t.en.previousReportsTitle}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 mt-1">
                      {content.previousReportsDesc || t.en.previousReportsDesc}
                    </p>
                  </div>
                </CardContent>
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-xl pointer-events-none -mr-4 -mt-4 transition-all group-hover:bg-green-500/10" />
              </Card>
            </motion.div>

            {/* Profile Card - Expanded to Spans 2 column-width on wider viewports */}
            <motion.div
              className="md:col-span-2 md:row-span-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card 
                className="h-full hover:shadow-lg transition-all border-primary/10 border-2 cursor-pointer group overflow-hidden relative"
                onClick={() => setActiveTab('profile')}
              >
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {user?.photo ? (
                        <img src={user.photo} className="h-full w-full object-cover rounded-xl" alt="P" />
                      ) : (
                        <Users className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-tighter border-primary/30 text-primary px-2.5 py-0.5">
                      {content.features.profile.tag}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{content.features.profile.title}</h3>
                    <p className="text-xs text-muted-foreground font-semibold mt-1">
                      {user?.name || content.farmerFallback || t.en.farmerFallback} &bull; {user?.district || content.districtFallback || t.en.districtFallback}, {user?.state || content.stateFallback || t.en.stateFallback}
                    </p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-2 font-medium">{content.features.profile.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Crop Detection History Card - Added symmetrically next to Farmer Profile */}
            <motion.div
              className="md:col-span-2 md:row-span-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 }}
            >
              <Card className="h-full border-primary/20 hover:border-primary/40 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col justify-between p-6">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <History className="h-24 w-24 text-primary" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <History className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg text-foreground">{hContent.title}</h3>
                        <p className="text-[10px] text-muted-foreground">{hContent.desc}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold text-xs px-2.5 py-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> {hContent.score}: {healthScore}%
                    </Badge>
                  </div>

                  {historySummary.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {historySummary.map((item, index) => (
                        <div key={`${item.label}-${index}`} className="bg-primary/5 dark:bg-primary/10 p-2.5 rounded-lg border border-primary/10 flex flex-col justify-center min-h-[58px]">
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider truncate">{item.label}</span>
                          <span className="text-[11px] font-bold text-primary mt-0.5 truncate">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-5 text-center">
                      <p className="text-sm font-bold text-foreground">{content.noHistoryReports || t.en.noHistoryReports}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{content.noHistoryReportsDesc || t.en.noHistoryReportsDesc}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-border/80 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    {reportsError ? (
                      <p className="text-[11px] text-red-500 leading-relaxed font-semibold truncate">
                        {reportsError}
                      </p>
                    ) : recentReports.length > 0 ? (
                      <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold">
                        {content.latestUpdateLabel || t.en.latestUpdateLabel}: {recentReports[0].cropName} - {recentReports[0].detectedCondition}
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold">
                        {content.noHistoryReportsDesc || t.en.noHistoryReportsDesc}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};
