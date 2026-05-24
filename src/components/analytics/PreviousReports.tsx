import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Search, Filter, Calendar, Trash2, Download, Eye, 
  CheckCircle, AlertTriangle, AlertCircle, BarChart2, ArrowRight,
  ShieldCheck, ArrowLeft, RefreshCw, Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LanguageCode } from '@/src/lib/languages';
import { getCropReportsCacheKey, resolveCropReportOwnerIdentity } from '@/src/lib/cropReports';
import { CropReportCard } from './CropReportCard.tsx';
import { CropReport, RiskLevel } from '../types.ts';

interface PreviousReportsProps {
  language: LanguageCode;
  onBack: () => void;
  user?: any;
}

interface ReportItem {
  id: string;
  date: string;
  cropName: string;
  cropImage?: string;
  disease: string;
  damage: number;
  confidence: number;
  status: 'Healthy' | 'Moderate Risk' | 'Severe Damage';
  details: string;
  recommendations: string[];
}

interface StoredCropReport {
  _id?: string;
  cropName: string;
  detectedCondition: string;
  confidenceScore: number;
  damageSeverity: number;
  treatmentSuggestions: string[];
  diagnosticType: string;
  status: string;
  capturedAt: string;
  fileName: string;
  cropImage?: string;
  pmfbyClaimFiled: boolean;
}

export const PreviousReports: React.FC<PreviousReportsProps> = ({ language, onBack, user }) => {
  const t: Record<string, any> = {
    en: {
      title: "Previous Crop Reports",
      desc: "Access saved AI-generated crop health analysis and disease detection reports.",
      back: "Back",
      totalReports: "Total Reports",
      healthyCrops: "Healthy Crops",
      damagedCrops: "Damaged Crops",
      aiAccuracy: "AI Accuracy",
      searchPlaceholder: "Search crop name or disease...",
      noReports: "No previous crop analysis reports available.",
      noReportsDesc: "Upload and analyze crop images from the AI Crop Analytics tab to generate detailed health records.",
      viewReport: "View Report",
      pdf: "PDF",
      close: "Close",
      reportDetails: "Report Details",
      cropStatus: "Crop Status",
      date: "Date",
      diagnostic: "Disease Diagnostic",
      confidence: "Confidence Level",
      summary: "AI Assessment Summary",
      recommendations: "Recommended Pesticide & Care Measures",
      downloadDoc: "Download Document",
      statusHealthy: "Healthy",
      statusMod: "Moderate Risk",
      statusSev: "Severe Damage",
      diseaseText: "Disease",
      damageText: "Damage",
      confidenceText: "Confidence",
      filterAll: "All",
      filterHealthy: "Healthy",
      filterDamaged: "Damaged",
      filterHighRisk: "High Risk",
      filterModRisk: "Moderate Risk",
      loadingReports: "Loading crop reports...",
      unableToLoadReports: "Unable to load reports",
      accurateSuffix: "Accurate",
      loadError: "Failed to load reports",
      refresh: "Refresh",
      refreshing: "Refreshing",
      refreshReportsTitle: "Sync reports",
      capturedOn: "Captured",
      bioDiagnostic: "Bio-Spectrum Diagnostic",
      damageSeverityCard: "Damage Severity",
      aiValidationConfidence: "AI Validation Confidence",
      riskHighLabel: "Critical Priority",
      riskModerateLabel: "Warning / Monitor",
      riskLowLabel: "Low Severity",
      riskHealthyLabel: "Healthy / Active",
      urgentAction: "Urgent threat: direct action required",
      monitorMessage: "Persistent layout: observe closely",
      stableMessage: "Subcritical status: stable",
      modelValidationActive: "Diagnostic model validation is active",
      detailedDiagnosticFile: "Detailed Diagnostic File",
      pdfExport: "PDF Export",
      deleteReportAria: "Delete diagnostic report"
    },
    hi: {
      title: "पिछले फसल विवरण",
      desc: "सहेजे गए एआई-जनरेटेड फसल स्वास्थ्य विश्लेषण और रोग पहचान रिपोर्ट तक पहुंचें।",
      back: "पीछे",
      totalReports: "कुल रिपोर्ट",
      healthyCrops: "स्वस्थ फसलें",
      damagedCrops: "प्रभावित फसलें",
      aiAccuracy: "एआई सटीकता",
      searchPlaceholder: "फसल का नाम या बीमारी खोजें...",
      noReports: "कोई पिछला फसल विश्लेषण रिपोर्ट उपलब्ध नहीं है।",
      noReportsDesc: "विस्तृत स्वास्थ्य रिकॉर्ड उत्पन्न करने के लिए एआई फसल विश्लेषण टैब से फसल छवियों को अपलोड और विश्लेषण करें।",
      viewReport: "रिपोर्ट देखें",
      pdf: "पीडीएफ",
      close: "बंद करें",
      reportDetails: "रिपोर्ट विवरण",
      cropStatus: "फसल की स्थिति",
      date: "दिनांक",
      diagnostic: "रोग निदान",
      confidence: "सटीकता स्तर",
      summary: "एआई मूल्यांकन सारांश",
      recommendations: "अनुशंसित कीटनाशक और निवारक उपाय",
      downloadDoc: "दस्तावेज़ डाउनलोड करें",
      statusHealthy: "स्वस्थ",
      statusMod: "मध्यम जोखिम",
      statusSev: "गंभीर क्षति",
      diseaseText: "बीमारी",
      damageText: "क्षति",
      confidenceText: "सटीकता",
      filterAll: "सभी",
      filterHealthy: "स्वस्थ",
      filterDamaged: "प्रभावित",
      filterHighRisk: "उच्च जोखिम",
      filterModRisk: "मध्यम जोखिम",
      loadingReports: "फसल रिपोर्ट लोड हो रही हैं...",
      unableToLoadReports: "रिपोर्ट लोड नहीं हो सकीं",
      accurateSuffix: "सटीक",
      refresh: "रिफ्रेश",
      refreshing: "रीफ्रेश हो रहा है",
      refreshReportsTitle: "रिपोर्ट सिंक करें",
      capturedOn: "कैप्चर किया गया",
      bioDiagnostic: "बायो-स्पेक्ट्रम निदान",
      damageSeverityCard: "क्षति की गंभीरता",
      aiValidationConfidence: "एआई सत्यापन सटीकता",
      riskHighLabel: "गंभीर प्राथमिकता",
      riskModerateLabel: "चेतावनी / निगरानी",
      riskLowLabel: "कम गंभीरता",
      riskHealthyLabel: "स्वस्थ / सक्रिय",
      urgentAction: "तत्काल खतरा: तुरंत कार्रवाई आवश्यक",
      monitorMessage: "निरंतर जोखिम: नज़दीकी निगरानी रखें",
      stableMessage: "स्थिर स्थिति: नियंत्रण में",
      modelValidationActive: "निदान मॉडल सत्यापन सक्रिय है",
      detailedDiagnosticFile: "विस्तृत निदान फ़ाइल",
      pdfExport: "पीडीएफ निर्यात",
      deleteReportAria: "निदान रिपोर्ट हटाएं"
    },
    pa: {
      title: "ਪਿਛਲੀਆਂ ਫ਼ਸਲਾਂ ਦੀਆਂ ਰਿਪੋਰਟਾਂ",
      desc: "ਸੁਰੱਖਿਅਤ ਕੀਤੀਆਂ ਏਆਈ-ਜਨਰੇਟਡ ਫ਼ਸਲ ਸਿਹਤ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਬਿਮਾਰੀ ਖੋਜ ਰਿਪੋਰਟਾਂ ਤੱਕ ਪਹੁੰਚੋ।",
      back: "ਪਿੱਛੇ",
      totalReports: "ਕੁੱਲ ਰਿਪੋਰਟਾਂ",
      healthyCrops: "ਸਿਹਤਮੰਦ ਫ਼ਸਲਾਂ",
      damagedCrops: "ਨੁਕਸਾਨੀਆਂ ਫ਼ਸਲਾਂ",
      aiAccuracy: "ਏਆਈ ਸ਼ੁੱਧਤਾ",
      searchPlaceholder: "ਫ਼ਸਲ ਦਾ ਨਾਮ ਜਾਂ ਬਿਮਾਰੀ ਖੋਜੋ...",
      noReports: "ਕੋਈ ਪਿਛਲੀ ਫ਼ਸਲ ਵਿਸ਼ਲੇਸ਼ਣ ਰਿਪੋਰਟ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
      noReportsDesc: "ਵਿਸਥਾਰਤ ਸਿਹਤ ਰਿਕਾਰਡ ਤਿਆਰ ਕਰਨ ਲਈ ਫ਼ਸਲ ਵਿਸ਼ਲੇਸ਼ਣ ਟੈਬ ਤੋਂ ਫ਼ਸਲ ਦੀਆਂ ਤਸਵੀਰਾਂ ਅਪਲੋਡ ਅਤੇ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ।",
      viewReport: "ਰਿਪੋਰਟ ਦੇਖੋ",
      pdf: "ਪੀਡੀਐਫ",
      close: "ਬੰਦ ਕਰੋ",
      reportDetails: "ਰਿਪੋਰਟ ਵੇਰਵੇ",
      cropStatus: "ਫ਼ਸਲ ਦੀ ਸਥਿਤੀ",
      date: "ਮਿਤੀ",
      diagnostic: "ਬਿਮਾਰੀ ਨਿਦਾਨ",
      confidence: "ਸ਼ੁੱਧਤਾ ਦਾ ਪੱਧਰ",
      summary: "ਏਆਈ ਮੁਲਾਂਕਣ ਸੰਖੇਪ",
      recommendations: "ਸਿਫਾਰਸ਼ ਕੀਤੇ ਕੀਟਨਾਸ਼ਕ ਅਤੇ ਸੁਰੱਖਿਆ ਉਪਾਅ",
      downloadDoc: "ਦਸਤਾਵੇਜ਼ ਡਾਊਨਲੋਡ ਕਰੋ",
      statusHealthy: "ਸਿਹਤਮੰਦ",
      statusMod: "ਦਰਮਿਆਨਾ ਜੋਖਮ",
      statusSev: "ਗੰਭੀਰ ਨੁਕਸਾਨ",
      diseaseText: "ਬਿਮਾਰੀ",
      damageText: "ਨੁਕਸਾਨ",
      confidenceText: "ਸ਼ੁੱਧਤਾ",
      filterAll: "ਸਾਰੇ",
      filterHealthy: "ਸਿਹਤਮੰਦ",
      filterDamaged: "ਨੁਕਸਾਨੀ",
      filterHighRisk: "ਉੱਚ ਜੋਖਮ",
      filterModRisk: "ਦਰਮਿਆਨਾ ਜੋਖਮ"
      ,
      refresh: "ਤਾਜ਼ਾ ਕਰੋ",
      refreshing: "ਤਾਜ਼ਾ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ",
      refreshReportsTitle: "ਰਿਪੋਰਟਾਂ ਸਿੰਕ ਕਰੋ"
    },
    mr: {
      title: "मागील पीक अहवाल",
      desc: "जतन केलेले एआय-व्युत्पन्न पीक आरोग्य विश्लेषण आणि रोग शोध अहवाल पहा.",
      back: "मागे",
      totalReports: "एकूण अहवाल",
      healthyCrops: "निरोगी पिके",
      damagedCrops: "बाधित पिके",
      aiAccuracy: "एआय अचूकता",
      searchPlaceholder: "पीक नाव किंवा रोग शोधा...",
      noReports: "कोणतेही मागील पीक विश्लेषण अहवाल उपलब्ध नाहीत.",
      noReportsDesc: "तपशीलवार आरोग्य रेकॉर्ड तयार करण्यासाठी पीक विश्लेषण टॅबमधून पीक प्रतिमा अपलोड आणि विश्लेषण करा.",
      viewReport: "अहवाल पहा",
      pdf: "पीडीएफ",
      close: "बंद करा",
      reportDetails: "अहवाल तपशील",
      cropStatus: "पिकाची स्थिती",
      date: "दिनांक",
      diagnostic: "रोग निदान",
      confidence: "विश्वासार्हता पातळी",
      summary: "एआय मूल्यांकन सारांश",
      recommendations: "शिफारस केलेले कीटकनाशक आणि काळजीचे उपाय",
      downloadDoc: "दस्तऐवज डाउनलोड करा",
      statusHealthy: "निरोगी",
      statusMod: "मध्यम जोखीम",
      statusSev: "गंभीर नुकसान",
      diseaseText: "रोग",
      damageText: "नुकसान",
      confidenceText: "अचूकता",
      filterAll: "सर्व",
      filterHealthy: "निरोगी",
      filterDamaged: "बाधित",
      filterHighRisk: "उच्च जोखीम",
      filterModRisk: "मध्यम जोखीम"
      ,
      refresh: "रिफ्रेश",
      refreshing: "रिफ्रेश होत आहे",
      refreshReportsTitle: "रिपोर्ट सिंक करा"
    },
    bn: {
      title: "পূর্ববর্তী ফসলের রিপোর্ট",
      desc: "সংরক্ষিত এআই-জেনারেটেড ফসলের স্বাস্থ্য विश्लेषण এবং রোগ সনাক্তকরণ রিপোর্ট দেখুন।",
      back: "ফিরে যান",
      totalReports: "মোট রিপোর্ট",
      healthyCrops: "সুস্থ ফসল",
      damagedCrops: "আক্রান্ত ফসল",
      aiAccuracy: "এআই নির্ভুলতা",
      searchPlaceholder: "ফসলের নাম বা রোগ অনুসন্ধান করুন...",
      noReports: "কোনো পূর্ববর্তী ফসল বিশ্লেষণ রিপোর্ট উপলব্ধ নেই।",
      noReportsDesc: "বিস্তারিত স্বাস্থ্য রেকর্ড তৈরি করতে ফসল বিশ্লেষণ ট্যাব থেকে ফসলের ছবি আপলোড এবং বিশ্লেষণ করুন।",
      viewReport: "রিপোর্ট দেখুন",
      pdf: "পিডিএফ",
      close: "বন্ধ করুন",
      reportDetails: "রিপোর্টের বিবরণ",
      cropStatus: "ফসলের অবস্থা",
      date: "তারিখ",
      diagnostic: "রোগ নির্ণয়",
      confidence: "নির্ভুলতার হার",
      summary: "এআই মূল্যায়ন সারাংশ",
      recommendations: "প্রস্তাবিত কীটনাশক এবং যত্ন ব্যবস্থা",
      downloadDoc: "ডকুমেন্ট ডাউনলোড করুন",
      statusHealthy: "সুস্থ",
      statusMod: "মাঝারি ঝুঁকি",
      statusSev: "গুরুতর ক্ষতি",
      diseaseText: "রোগ",
      damageText: "ক্ষতি",
      confidenceText: "নির্ভুলতা",
      filterAll: "সব",
      filterHealthy: "সুস্থ",
      filterDamaged: "আক্রান্ত",
      filterHighRisk: "উচ্চ ঝুঁকি",
      filterModRisk: "মাঝারি ঝুঁকি"
      ,
      refresh: "রিফ্রেশ",
      refreshing: "রিফ্রেশ হচ্ছে",
      refreshReportsTitle: "রিপোর্ট সিঙ্ক করুন"
    },
    gu: {
      title: "પાછલા પાક અહેવાલો",
      desc: "સાચવેલા એઆઈ-જનરેટેડ પાક સ્વાસ્થ્ય વિશ્લેષણ અને રોગ ઓળખ અહેવાલો જુઓ.",
      back: "પાછા જાઓ",
      totalReports: "કુલ અહેવાલો",
      healthyCrops: "સ્વસ્થ પાક",
      damagedCrops: "નુકસાન પામેલ પાક",
      aiAccuracy: "એઆઈ ચોકસાઈ",
      searchPlaceholder: "પાકનું નામ અથવા રોગ શોધો...",
      noReports: "કોઈ પાછલા પાક વિશ્લેષણ અહેવાલો ઉપલબ્ધ નથી.",
      noReportsDesc: "વિગતવાર આરોગ્ય રેકોર્ડ જનરેટ કરવા માટે પાક વિશ્લેષણ ટેબમાંથી પાકની છબીઓ અપલોડ અને વિશ્લેષણ કરો.",
      viewReport: "અહેવાલ જુઓ",
      pdf: "પીડીએફ",
      close: "બંધ કરો",
      reportDetails: "અહેવાલ વિગતો",
      cropStatus: "પાકની સ્થિતિ",
      date: "તારીખ",
      diagnostic: "રોગ નિદાન",
      confidence: "ચોકસાઈ સ્તર",
      summary: "એઆઈ મૂલ્યાંકન સારાંશ",
      recommendations: "ભલામણ કરેલ જંતુનાશકો અને સંભાળના પગલાં",
      downloadDoc: "દસ્તાવેજ ડાઉનલોડ કરો",
      statusHealthy: "સ્વસ્થ",
      statusMod: "મધ્યમ જોખમ",
      statusSev: "ગંભીર નુકસાન",
      diseaseText: "રોગ",
      damageText: "નુકસાન",
      confidenceText: "ચોકસાઈ",
      filterAll: "તમામ",
      filterHealthy: "સ્વસ્થ",
      filterDamaged: "નુકસાન પામેલ",
      filterHighRisk: "ઉચ્ચ જોખમ",
      filterModRisk: "મધ્યમ જોખમ"
      ,
      refresh: "રિફ્રેશ",
      refreshing: "રિફ્રેશ થઈ રહ્યું છે",
      refreshReportsTitle: "રિપોર્ટ્સ સિંક કરો"
    },
    ta: {
      title: "முந்தைய பயிர் அறிக்கைகள்",
      desc: "சேமிக்கப்பட்ட AI-உருவாக்கிய பயிர் சுகாதார பகுப்பாய்வு மற்றும் நோய் கண்டறிதல் அறிக்கைகளை அணுகவும்.",
      back: "பின்செல்",
      totalReports: "மொத்த அறிக்கைகள்",
      healthyCrops: "ஆரோக்கியமான பயிர்கள்",
      damagedCrops: "பாதிக்கப்பட்ட பயிர்கள்",
      aiAccuracy: "AI துல்லியம்",
      searchPlaceholder: "பயிர் பெயர் அல்லது நோயைத் தேடுக...",
      noReports: "முந்தைய பயிர் பகுப்பாய்வு அறிக்கைகள் எதுவும் இல்லை.",
      noReportsDesc: "விரிவான சுகாதார பதிவுகளை உருவாக்க AI பயிர் பகுப்பாய்வு தாவலில் இருந்து பயிர் படங்களை பதிவேற்றி பகுப்பாய்வு செய்யவும்.",
      viewReport: "அறிக்கையைப் பார்",
      pdf: "PDF",
      close: "மூடு",
      reportDetails: "அறிக்கை விவரங்கள்",
      cropStatus: "பயிர் நிலை",
      date: "தேதி",
      diagnostic: "நோய் கண்டறிதல்",
      confidence: "துல்லிய நிலை",
      summary: "AI மதிப்பீட்டுச் சுருக்கம்",
      recommendations: "பரிந்துரைக்கப்பட்ட பூச்சிக்கொல்லி மற்றும் பராமரிப்பு முறைகள்",
      downloadDoc: "அறிக்கையை பதிவிறக்கு",
      statusHealthy: "ஆரோக்கியமானது",
      statusMod: "மிதமான ஆபத்து",
      statusSev: "கடுமையான பாதிப்பு",
      diseaseText: "நோய்",
      damageText: "பாதிப்பு",
      confidenceText: "துல்லியம்",
      filterAll: "அனைத்தும்",
      filterHealthy: "ஆரோக்கியமானது",
      filterDamaged: "பாதிக்கப்பட்டது",
      filterHighRisk: "அதிக ஆபத்து",
      filterModRisk: "மிதமான ஆபத்து"
      ,
      refresh: "புதுப்பி",
      refreshing: "புதுப்பிக்கிறது",
      refreshReportsTitle: "அறிக்கைகளை ஒத்திசை"
    },
    te: {
      title: "முనుపటి పంట నివేదికలు",
      desc: "సేవ్ చేయబడిన AI-జనరేటెడ్ పంట ఆరోగ్య విశ్లేషణ మరియు వ్యాధి గుర్తింపు నివేదికలను యాక్సెస్ చేయండి.",
      back: "వెనుకకు",
      totalReports: "మొత్తం నివేదికలు",
      healthyCrops: "ఆరోగ్యకరమైన పంటలు",
      damagedCrops: "దెబ్బతిన్న పంటలు",
      aiAccuracy: "AI ఖచ్చితత్వం",
      searchPlaceholder: "పంట పేరు లేదా వ్యాధిని వెతకండి...",
      noReports: "ఎటువంటి మునుపటి పంట విశ్లేషణ నివేదికలు అందుబాటులో లేవు.",
      noReportsDesc: "వివరమైన ఆరోగ్య నివేదికలను రూపొందించడానికి AI పంట విశ్లేషణ ట్యాబ్ నుండి పంట చిత్రాలను అప్‌లోడ్ చేసి విశ్లేషించండి.",
      viewReport: "నివేదికను చూడు",
      pdf: "PDF",
      close: "మూసివేయి",
      reportDetails: "నివేదిక వివరాలు",
      cropStatus: "పంట స్థితి",
      date: "తేదీ",
      diagnostic: "ವ್ಯಾಧಿ ನಿರ್ಧಾರಣ",
      confidence: "ఖచ్చితత్వ శాతం",
      summary: "AI విశ్లేషణ సారాంశం",
      recommendations: "సిఫార్సు చేయబడిన పురుగుమందులు & జాగ్రత్తలు",
      downloadDoc: "పత్రాన్ని డౌన్‌లోడ్ చేయి",
      statusHealthy: "ఆరోగ్యకరం",
      statusMod: "మధ్యస్థ ప్రమాదం",
      statusSev: "తీవ్రమైన నష్టం",
      diseaseText: "వ్యాధి",
      damageText: "నష్టం",
      confidenceText: "ఖచ్చితత్వం",
      filterAll: "అన్నీ",
      filterHealthy: "ఆరోగ్యకరం",
      filterDamaged: "దెబ్బతిన్నవి",
      filterHighRisk: "అధిక ప్రమాదం",
      filterModRisk: "మధ్యస్థ ప్రమాదం"
      ,
      refresh: "రిఫ్రెష్",
      refreshing: "రిఫ్రెష్ అవుతోంది",
      refreshReportsTitle: "నివేదికలను సమకాలీకరించండి"
    },
    kn: {
      title: "ಹಿಂದಿನ ಬೆಳೆ ವರದಿಗಳು",
      desc: "ಉಳಿಸಿದ ಇಐ-ರಚಿತ ಬೆಳೆ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ರೋಗ ಪತ್ತೆ ವರದಿಗಳನ್ನು ಹೊಂದಿರಿ.",
      back: "ಹಿಂದಕ್ಕೆ",
      totalReports: "ಒಟ್ಟು ವರದಿಗಳು",
      healthyCrops: "ಆರೋಗ್ಯಕರ ಬೆಳೆಗಳು",
      damagedCrops: "ಹಾನಿಗೊಳಗಾದ ಬೆಳೆಗಳು",
      aiAccuracy: "AI ನಿಖರತೆ",
      searchPlaceholder: "ಬೆಳೆ ಹೆಸರು ಅಥವಾ ರೋಗವನ್ನು ಹುಡುಕಿ...",
      noReports: "ಯಾವುದೇ ಹಿಂದಿನ ಬೆಳೆ ವಿಶ್ಲೇಷಣಾ ವರದಿಗಳು ಲಭ್ಯವಿಲ್ಲ.",
      noReportsDesc: "ವಿವರವಾದ ಆರೋಗ್ಯ ವರದಿ ಪಡೆಯಲು ಬೆಳೆ ವಿಶ್ಲೇಷಣಾ ಟ್ಯಾಬ್‌ನಿಂದ ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ವಿಶ್ಲೇಷಿಸಿ.",
      viewReport: "ವರದಿ ವೀಕ್ಷಿಸಿ",
      pdf: "PDF",
      close: "ಮುಚ್ಚಿ",
      reportDetails: "ವರದಿ ವಿವರಗಳು",
      cropStatus: "ಬೆಳೆಯ ಸ್ಥಿತಿ",
      date: "ದಿನಾಂಕ",
      diagnostic: "ರೋಗ ಪತ್ತೆಹಚ್ಚುವಿಕೆ",
      confidence: "ನಿಖರತೆಯ ಮಟ್ಟ",
      summary: "AI ಮೌಲ್ಯಮಾಪನ ಸಾರಾಂಶ",
      recommendations: "ಶಿಫಾರಸು ಮಾಡಿದ ಕೀಟನಾಶಕ ಮತ್ತು ಆರೈಕೆಯ ಕ್ರಮಗಳು",
      downloadDoc: "ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
      statusHealthy: "ಆರೋಗ್ಯಕರ",
      statusMod: "ಮಧ್ಯಮ ಅಪಾಯ",
      statusSev: "ಗಂಭೀರ ಹಾನಿ",
      diseaseText: "ರೋಗ",
      damageText: "ಹಾನಿ",
      confidenceText: "ನಿಖರತೆ",
      filterAll: "ಎಲ್ಲಾ",
      filterHealthy: "ಆರೋಗ್ಯಕರ",
      filterDamaged: "ಹಾನಿಗೊಳಗಾದ",
      filterHighRisk: "ಹೆಚ್ಚಿನ ಅಪಾಯ",
      filterModRisk: "ಮಧ್ಯಮ ಅಪಾಯ"
      ,
      refresh: "ರಿಫ್ರೆಶ್",
      refreshing: "ರಿಫ್ರೆಶ್ ಆಗುತ್ತಿದೆ",
      refreshReportsTitle: "ವರದಿಗಳನ್ನು ಸಿಂಕ್ ಮಾಡಿ"
    },
    ml: {
      title: "മുൻപത്തെ വിള റിപ്പോർട്ടുകൾ",
      desc: "ശേഖരിച്ചുവെച്ച AI വിള ആരോഗ്യ വിശകലനവും രോഗനിർണ്ണയ റിപ്പോർട്ടുകളും പരിശോധിക്കുക.",
      back: "പിന്നിലേക്ക്",
      totalReports: "ആകെ റിപ്പോർട്ടുകൾ",
      healthyCrops: "ആരോഗ്യമുള്ള വിളകൾ",
      damagedCrops: "രോഗബാധിത വിളകൾ",
      aiAccuracy: "AI കൃത്യത",
      searchPlaceholder: "വിളയുടെ പേരോ രോഗമോ തിരയുക...",
      noReports: "മുൻപത്തെ വിള വിശകലന റിപ്പോർട്ടുകൾ ഒന്നും ലഭ്യമല്ല.",
      noReportsDesc: "വിശദമായ വിള ആരോഗ്യ റിപ്പോർട്ടുകൾ നിർമ്മിക്കാൻ വിള വിശകലന വിഭാഗത്തിലൂടെ ചിത്രങ്ങൾ അപ്‌ലോഡ് ചെയ്തു അപഗ്രഥിക്കുക.",
      viewReport: "റിപ്പോർട്ട് കാണുക",
      pdf: "PDF",
      close: "അടയ്ക്കക്കുക",
      reportDetails: "റിപ്പോർട്ട് വിവരങ്ങൾ",
      cropStatus: "വിള നില",
      date: "തീയതി",
      diagnostic: "രോഗനിർണ്ണയം",
      confidence: "കൃത്യത നിലവാരം",
      summary: "AI വിലയിരുത്തൽ ചുരുക്കം",
      recommendations: "ശുപാർശ ചെയ്യപ്പെട്ട കീടനാശിനികളും പ്രതിരോധ മാർഗ്ഗങ്ങളും",
      downloadDoc: "റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്യുക",
      statusHealthy: "ആരോഗ്യമുള്ളത്",
      statusMod: "മിതമായ അപകടസാധ്യത",
      statusSev: "ഗുരുതരമായ കേടുപാടുകൾ",
      diseaseText: "രോഗം",
      damageText: "കേടുപാടുകൾ",
      confidenceText: "കൃത്യത",
      filterAll: "എല്ലാം",
      filterHealthy: "ആരോഗ്യമുള്ളത്",
      filterDamaged: "രോഗബാധിതങ്ങൾ",
      filterHighRisk: "ഉയർന്ന അപകടസാധ്യത",
      filterModRisk: "മിതമായ അപകടസാധ്യത"
      ,
      refresh: "റിഫ്രെഷ്",
      refreshing: "റിഫ്രെഷ് ചെയ്യുന്നു",
      refreshReportsTitle: "റിപ്പോർട്ടുകൾ സിങ്ക് ചെയ്യുക"
    }
  };

  const content = t[language] || t['en'];
  const ownerIdentity = resolveCropReportOwnerIdentity(user);
  const reportsCacheKey = getCropReportsCacheKey(ownerIdentity?.userMobile);

  const readCachedReports = (): StoredCropReport[] => {
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

  const writeCachedReports = (items: StoredCropReport[]) => {
    if (typeof window === 'undefined') return;

    try {
      // Keep cache lightweight to avoid sessionStorage quota issues.
      const lightweight = items.map((item) => ({ ...item, cropImage: undefined }));
      window.sessionStorage.setItem(reportsCacheKey, JSON.stringify(lightweight));
    } catch (error) {
      console.warn('Unable to cache crop reports in sessionStorage:', error);
    }
  };

  const [reports, setReports] = useState<ReportItem[]>(() => readCachedReports().map(mapStoredReportToItem));
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Healthy' | 'Damaged' | 'High Risk' | 'Moderate Risk'>('All');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [loadingReports, setLoadingReports] = useState(() => readCachedReports().length === 0);
  const [refreshingReports, setRefreshingReports] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);

  const normalizeTranslationKey = (text: string): string =>
    text
      .trim()
      .toLowerCase()
      .replace(/[’']/g, "'")
      .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const translateText = (text: string): string => {
    const dictionary: Record<string, Record<string, string>> = {
      // crops
      "Tomato": { hi: "टमाटर", pa: "ਟਮਾਟਰ", mr: "टोमॅटो", bn: "টমেটো", gu: "ટામેટાં", ta: "தக்காளி", te: "టమోటా", kn: "ಟೊಮೆಟೊ", ml: "തക്കാളി" },
      "Rice": { hi: "धान (चावल)", pa: "ਝੋਨਾ (ਚੌਲ)", mr: "भात (तांदूळ)", bn: "ধান (চাল)", gu: "ડાંગર (ચોખા)", ta: "நெல் (அரிசி)", te: "వరి (బియ్యం)", kn: "ಭತ್ತ (ಅಕ್ಕಿ)", ml: "നെല്ല് (അരി)" },
      "Corn": { hi: "मक्का", pa: "ਮੱਕੀ", mr: "मका", bn: "ভুট্টা", gu: "મકાઈ", ta: "மக்காச்சோளம்", te: "మొక్కజొన్న", kn: "ಮೆಕ್ಕೆಜೋಳ", ml: "ചോളം" },
      "Corn (Maize)": { hi: "मक्का (मकई)", pa: "ਮੱਕੀ", mr: "मका", bn: "ভুট্টা", gu: "મકાઈ", ta: "மக்காச்சோளம்", te: "మొక్కజొన్న", kn: "ಮೆಕ್ಕೆಜೋಳ", ml: "ചോളം" },
      "Maize": { hi: "मक्का", pa: "ਮੱਕੀ", mr: "मका", bn: "ভুট্টা", gu: "મકાઈ", ta: "மக்காச்சோளம்", te: "మొక్కజొన్న", kn: "ಮೆಕ್ಕೆಜೋಳ", ml: "ചോളം" },
      "Potato": { hi: "आलू", pa: "ਆਲੂ", mr: "बटाटा", bn: "আলু", gu: "બટાટા", ta: "உருளைக்கிழங்கு", te: "బంగాళాదుంప", kn: "ಆಲೂಗಡ್ಡೆ", ml: "ഉരുളക്കിഴങ്ങ്" },
      "Cotton": { hi: "कपास", pa: "ਕਪਾਹ", mr: "कापूस", bn: "তুলা", gu: "કપાસ", ta: "பருத்தி", te: "పత్తి", kn: "ಹತ್ತಿ", ml: "പരുത്തി" },
      "Sugarcane": { hi: "गन्ना", pa: "ਗੰਨਾ", mr: "ऊस", bn: "আখ", gu: "શેરડી", ta: "கரும்பு", te: "చెరకు", kn: "ಕಬ್ಬು", ml: "കരിമ്പ്" },
      "Mustard": { hi: "सरसों", pa: "ਸਰ੍ਹੋਂ", mr: "मोहरी", bn: "সরিষা", gu: "રાઈ", ta: "கடுகு", te: "ఆవాలు", kn: "ಸಾಸಿವೆ", ml: "കടുക്" },
      "Soyabean": { hi: "सोयाबीन", pa: "ਸੋਇਆਬੀਨ", mr: "सोयाबीन", bn: "সয়াবিন", gu: "સોયાબીન", ta: "சோயாபீன்", te: "సోయాబీన్", kn: "ಸೋಯಾಬೀನ್", ml: "സോയാബീൻ" },
      "Groundnut": { hi: "मूंगफली", pa: "ਮੂੰਗਫਲੀ", mr: "भुईमूग", bn: "চিনাবাদাম", gu: "મગફળી", ta: "நிலக்கடலை", te: "వేరుశనగ", kn: "ಕಡಲೆಕಾಯಿ", ml: "നിലക്കടല" },

      // diseases
      "Early Blight": { hi: "अगेती झुलसा", pa: "ਅਗੇਤੀ ਝੁਲਸ ਰੋਗ", mr: "अगेती करपा", bn: "আগেতি ধসা রোগ", gu: "આગોતરો સુકારો", ta: "ஆரம்ப கருகல் நோய்", te: "ఆకులు మాడిపోవు తెగులు", kn: "ಮುಂಗಾರು ಕರಕಲು ರೋಗ", ml: "മുരടിപ്പ് രോഗം" },
      "Leaf Blast": { hi: "पत्ती झोंका रोग", pa: "ਪੱਤਾ ਬਲਾਸਟ", mr: "पानावरील करपा", bn: "পাতা ব্লাস্ট রোগ", gu: "પાંદડાનો કરપો", ta: "இலை கருகல் நோய்", te: "ఆకు ముడత తెగులు", kn: "ಎಲೆ ಬ್ಲಾಸ್ಟ್ ರೋಗ", ml: "ഇലക്കരിച്ചിൽ" },
      "Healthy Crop": { hi: "स्वस्थ फसल", pa: "ਸਿਹਤਮੰਦ ਫ਼ਸਲ", mr: "निरोगी पीक", bn: "সুস্থ ফসল", gu: "સ્વસ્થ પાક", ta: "ஆரோக்கியமான பயிர்", te: "ఆరోగ్యకరమైన పంట", kn: "ಆರೋಗ್ಯಕರ ಬೆಳೆ", ml: "ആരോഗ്യമുള്ള വിള" },
      "Wilt Infestation": { hi: "मुरझान रोग संक्रमण", pa: "ਉਖੇੜਾ ਰੋਗ", mr: "मर रोग", bn: "ঢলে পড়া রোগ", gu: "સુકારો રોગ", ta: "வாடல் நோய் தாக்குதல்", te: "వాడ తెగులు ప్రకోపం", kn: "ಬಾಡಲು ರೋಗ", ml: "ವಾട്ടം രോഗബാധ" },
      "Red Rot": { hi: "लाल सड़न रोग", pa: "ਲਾਲ ਸੜਨ ਰੋਗ", mr: "तांबेरा रोग", bn: "লাল পচা রোগ", gu: "લાલ સડો રોગ", ta: "செவ்வழுகல் நோய்", te: "ఎర్ర కుళ్లు తెగులు", kn: "ಕೆಂಪು ಕೊಳೆ ರೋಗ", ml: "ചുവപ്പ് ചീയൽ" },
      "Severe Drought Stress": { hi: "गंभीर सूखा तनाव", pa: "ਗੰਭੀਰ ਸੁੱਕਾ ਤਣਾਅ", mr: "तीव्र दुष्काळ ताण", bn: "তীব্র খরা চাপ", gu: "ગંભીર દુષ્કાળ તણાવ", ta: "கடுமையான வறட்சி அழுத்தம்", te: "తీవ్రమైన ఎండతడి ఒత్తిడి", kn: "ತೀವ್ರ ಬರ ಒತ್ತಡ", ml: "കടുത്ത വരൾച്ച സമ്മർദം" },
      "Stalk Rot": { hi: "तना सड़न", pa: "ਡੰਡੀ ਸੜਨ", mr: "खोड कुज", bn: "কাণ্ড পচা", gu: "દાંડી સડો", ta: "தண்டு அழுகல்", te: "కాండం కుళ్లు", kn: "ಕಾಂಡ ಕೊಳೆ", ml: "തണ്ടു ചീയൽ" },
      "Yellow Rust": { hi: "पीला रतुआ", pa: "ਪੀਲੀ ਜੰਗਾਲ", mr: "पिवळी तांबेरा", bn: "হলুদ মরিচা", gu: "પીળો રસ્ટ", ta: "மஞ்சள் துரு", te: "పసుపు తుప్పు", kn: "ಹಳದಿ ರಸ್ಟ್", ml: "മഞ്ഞ മങ്ങൽ" },
      "Aphid Infestation": { hi: "माहू संक्रमण", pa: "ਮੱਖੀ ਦਾ ਹਮਲਾ", mr: "मावा प्रादुर्भाव", bn: "এফিডের আক্রমণ", gu: "એફિડનો હુમલો", ta: "அஃபிட் தாக்குதல்", te: "ఎఫిడ్ దాడి", kn: "ಆಫಿಡ್ ಆಕ್ರಮಣ", ml: "അഫിഡ് ബാധ" },
      "Minor Yellow Rust Detected (Sample Analysis)": { hi: "हल्का पीला रतुआ पाया गया (नमूना विश्लेषण)", pa: "ਹਲਕੀ ਪੀਲੀ ਜੰਗਾਲ ਮਿਲੀ (ਨਮੂਨਾ ਵਿਸ਼ਲੇਸ਼ਣ)", mr: "हलका पिवळा तांबेरा आढळला (नमुना विश्लेषण)", bn: "হালকা হলুদ মরিচা সনাক্ত হয়েছে (নমুনা বিশ্লেষণ)", gu: "હળવો પીળો રસ્ટ મળ્યો (નમૂના વિશ્લેષણ)", ta: "லேசான மஞ்சள் துரு கண்டறியப்பட்டது (மாதிரி பகுப்பாய்வு)", te: "తక్కువ స్థాయి పసుపు తుప్పు గుర్తించబడింది (నమూనా విశ్లేషణ)", kn: "ಸಣ್ಣ ಹಳದಿ ರಸ್ಟ್ ಪತ್ತೆಯಾಗಿದೆ (ಮಾದರಿ ವಿಶ್ಲೇಷಣೆ)", ml: "നിസാര മഞ്ഞ മങ്ങൽ കണ്ടെത്തി (മാതൃക വിശകലനം)" },

      // details
      "Broad brown spots with concentric rings resembling targetboards on older leaves first.": {
        hi: "बड़ी पत्ती पर संकेंद्रित छल्लों के साथ भूरे रंग के धब्बे जो सबसे पहले पुरानी पत्तियों पर दिखाई देते हैं।",
        pa: "ਪੁਰਾਣੇ ਪੱਤਿਆਂ 'ਤੇ ਪਹਿਲਾਂ ਨਿਸ਼ਾਨਾ ਬੋਰਡਾਂ ਵਰਗੇ ਕੇਂਦਰੀ ਚੱਕਰਾਂ ਵਾਲੇ ਚੌੜੇ ਭੂਰੇ ਧੱਬੇ ਪੈਣਾ।",
        mr: "जुन्या पानांवर आधी लक्ष केंद्रित करणाऱ्या कड्यांसारखे गोल गोल तपकिरी डाग पडणे.",
        bn: "প্রথমে পুরনো পাতায় লক্ষ্যবস্তুর মতো খাঁজযুক্ত বৃত্তাকার বাদামী দাগ দেখা দেয়।",
        gu: "જૂના પાંદડાઓ પર સૌપ્રથમ કેન્દ્રિત વલયો સાથે પહોળા કથ્થઈ રંગના ડાઘ દેખાવા.",
        ta: "முதிர்ந்த இலைகளில் வளைய வடிவிலான பழுப்பு நிற புள்ளிகள் முதலில் தோன்றும்.",
        te: "ముసలి ఆకులపై ముందుగా లక్ష్య బోర్డులను పోలిన వలయాకారపు గోధుమ రంగు మచ్చలు ఏర్పడతాయి.",
        kn: "ಹಳೆಯ ಎಲೆಗಳ ಮೇಲೆ ಮೊದಲು ವರ್ತುಲಾಕಾರದ ಕಂದು ಬಣ್ಣದ ಚುಕ್ಕೆಗಳು ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತವೆ.",
        ml: "പഴയ ഇലകളിൽ ആദ്യം കടും തവിട്ടു വളയങ്ങളുള്ള പുള്ളികൾ പ്രത്യക്ഷപ്പെടുന്നു."
      },
      "Spindle-shaped lesions with grayish centers and dark borders scattered across the canopy.": {
        hi: "चंदवा पर बिखरे हुए भूरे रंग के केंद्र और गहरे बॉर्डर वाले धुरी के आकार के घाव।",
        pa: "ਪੱਤਿਆਂ 'ਤੇ ਸਲੇਟੀ ਕੇਂਦਰ ਅਤੇ ਗੂੜ੍ਹੇ ਕਿਨਾਰਿਆਂ ਵਾਲੇ ਤੱਕਲੇ ਵਰਗੇ ਜ਼ਖਮ ਫੈਲਣਾ।",
        mr: "पानांवर राखाडी केंद्र आणि गडद कडा असलेले लांबट डाग पसरणे.",
        bn: "পাতার ওপর ধূসর কেন্দ্র এবং গাঢ় কিনারাযুক্ত মাকু আকৃতির দাগ ছড়িয়ে পড়া।",
        gu: "પાંદડા પર રાખોડી કેન્દ્ર અને ઘેરી કિનારીઓ સાથે ત્રાકાકાર ડાઘ ફેલાવા.",
        ta: "சாம்பல் நிற மையமும் கரும் விளிம்பும் கொண்ட கதிர்வடிவ தழும்புகள் இலைகளில் காணப்படும்.",
        te: "ఆకులపై బూడిద రంగు కేంద్రం మరియు ముదురు అంచులతో కండె ఆకారపు మచ్చలు ఏర్పడతాయి.",
        kn: "ಎಲೆಗಳ ಮೇಲೆ ಬೂದು ಬಣ್ಣದ ಮಧ್ಯಭಾಗ ಮತ್ತು ಕಡು ಅಂಚಿನ ಕದಿರು ಆಕಾರದ ಗಾಯಗಳು ಹರಡುತ್ತವೆ.",
        ml: "ഇലകളിൽ ചാരനിറത്തോടുകൂടിയതും ഇരുണ്ടതുമായ തരിപ്പുള്ളികൾ പടരുന്നു."
      },
      "Vigorous crop growth with zero signature infestation symptoms detected.": {
        hi: "शून्य संक्रमण लक्षणों के साथ फसल का बेहतरीन और स्वस्थ विकास।",
        pa: "ਬਿਨਾਂ ਕਿਸੇ ਬਿਮਾਰੀ ਦੇ ਚਿੰਨ੍ਹ ਦੇ ਫ਼ਸਲ ਦਾ ਵਧੀਆ ਅਤੇ ਜੋਰਦਾਰ ਵਿਕਾਸ।",
        mr: "कोणतेही रोगाचे लक्षण नसून पिकाची जोमदार व निरोगी वाढ.",
        bn: "কোনো রোগ বা সংক্রমণের লক্ষণ ছাড়াই ফসলের চমৎকার ও সতেজ বৃদ্ধি।",
        gu: "કોઈપણ રોગના લક્ષણ વગર પાકનો ઉત્તમ અને જોરદાર વિકાસ.",
        ta: "எந்தவொரு நோய் தாக்குதலும் இன்றி பயிர் மிக ஆரோக்கியமாக வளர்ந்துள்ளது.",
        te: "ఎటువంటి తెగులు లక్షణాలు లేకుండా పంట నిగనిగలాడుతూ పెరుగుతోంది.",
        kn: "ಯಾವುದೇ ರೋಗದ ಲಕ್ಷಣವಿಲ್ಲದೆ ಅತ್ಯುತ್ತಮವಾದ ಬೆಳೆ ಬೆಳವಣಿಗೆ.",
        ml: "രോഗലಕ್ಷಣങ്ങൾ ഒന്നുമില്ലാത്ത മികച്ച വിള വളർച്ച."
      },
      "Severe yellowing, wilting and necrosis across extensive leaf area.": {
        hi: "व्यापक पत्ती क्षेत्र में गंभीर पीलापन, मुरझाना और ऊतकक्षय।",
        pa: "ਪੱਤਿਆਂ 'ਤੇ ਭਾਰੀ ਪੀਲਾਪਨ, ਉਖੇੜਾ ਅਤੇ ਸੁੱਕ ਕੇ ਨਸ਼ਟ ਹੋਣਾ।",
        mr: "मोठ्या प्रमाणावर पाने पिवळी पडणे, सुकणे आणि पूर्णपणे वाळणे.",
        bn: "ব্যাপক পাতা জুড়ে তীব্র হলুদ হয়ে যাওয়া, ঢলে পড়া এবং টিস্যু ক্ষয়।",
        gu: "મોટાભાગના પાંદડાઓ પર ભારે પીળાશ, સુકારો અને નસો સુકાઈ જવી.",
        ta: "பரவலான இலைப்பகுதியில் கடுமையான மஞ்சள் நிறமாதல், வாடுதல் மற்றும் திசுக்கள் கருகல்.",
        te: "ఆకులు విస్తృతంగా పసుపు రంగులోకి మారడం, వాడిపోవడం మరియు కణజాలం నశించడం.",
        kn: "ಹೆಚ್ಚಿನ ಪ್ರಮಾಣದ ಎಲೆಗಳು ಹಳದಿಯಾಗುವುದು, ಒಣಗುವುದು ಮತ್ತು ಕೊಳೆಯುವುದು ಸಂಭವಿಸಿದೆ.",
        ml: "ഇലകളിൽ ഭൂരിഭാഗവും കടുത്ത മഞ്ഞനിറം വന്ന് വാടി കരിഞ്ഞുണങ്ങുന്നു."
      },
      "Minimal symptoms present. Controlled biological agents are working stably.": {
        hi: "अत्यंत कम लक्षण मौजूद हैं। नियंत्रित जैविक एजेंट स्थिरता से काम कर रहे हैं।",
        pa: "ਬਹੁਤ ਘੱਟ ਲੱਛਣ ਮੌਜੂਦ ਹਨ। ਜੈਵਿਕ ਨਿਯੰਤਰਣ ਕਾਰਕ ਸਥਿਰਤਾ ਨਾਲ ਕੰਮ ਕਰ ਰਹੇ ਹਨ।",
        mr: "अतिशय कमी लक्षणे आहेत. जैविक नियंत्रक घटक योग्य प्रकारे कार्य करत आहेत.",
        bn: "নগণ্য লক্ষণ উপস্থিত। নিয়ন্ত্রিত জৈব উপাদানগুলি স্থিতিশীলভাবে কাজ করছে।",
        gu: "ખૂબ જ ઓછા લક્ષણો જોવા મળે છે. નિયંત્રિત જૈવિક એજન્ટો સ્થિર રીતે કામ કરે છે.",
        ta: "மிகக் குறைந்த அளவே அறிகுறி உள்ளது. உயிரியல் பாதுகாப்பு முறைகள் வெற்றிகரமாக செயல்படுகின்றன.",
        te: "చాలా తక్కువ లక్షణాలు ఉన్నాయి. జీవ నియంత్రణ ఏజెంట్లు స్థిరంగా పనిచేస్తున్నాయి.",
        kn: "ಅತ್ಯಂತ ಕಡಿಮೆ ಲಕ್ಷಣಗಳಿವೆ. ಜೈವಿಕ ನಿಯಂತ್ರಕಗಳು ಯಶಸ್ವಿಯಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿವೆ.",
        ml: "വളരെ കുറഞ്ഞ രോഗലക്ഷണങ്ങൾ മാത്രം. ജൈവ നിയന്ത്രണം ഫലപ്രദമായി പ്രവർത്തിക്കുന്നു."
      },
      "Severe Drought and Stalk Rot": {
        hi: "गंभीर सूखा और तना सड़न",
        pa: "ਗੰਭੀਰ ਸੁੱਕਾ ਅਤੇ ਡੰਡੀ ਸੜਨ",
        mr: "तीव्र दुष्काळ आणि खोड कुज",
        bn: "তীব্র খরা ও কাণ্ড পচা",
        gu: "ગંભીર દુષ્કાળ અને દાંડી સડો",
        ta: "கடுமையான வறட்சி மற்றும் தண்டு அழுகல்",
        te: "తీవ్రమైన ఎండతడి మరియు కాండం కుళ్లు",
        kn: "ತೀವ್ರ ಬರ ಮತ್ತು ಕಾಂಡ ಕೊಳೆ",
        ml: "കടുത്ത വരൾച്ചയും തണ്ടു ചീയലും"
      },
      "Severe Drought Stress and Stalk Rot": {
        hi: "गंभीर सूखा तनाव और तना सड़न",
        pa: "ਗੰਭੀਰ ਸੁੱਕਾ ਤਣਾਅ ਅਤੇ ਡੰਡੀ ਸੜਨ",
        mr: "तीव्र दुष्काळ ताण आणि खोड कुज",
        bn: "তীব্র খরা চাপ ও কাণ্ড পচা",
        gu: "ગંભીર દુષ્કાળ તણાવ અને દાંડી સડો",
        ta: "கடுமையான வறட்சி அழுத்தம் மற்றும் தண்டு அழுகல்",
        te: "తీవ్రమైన ఎండతడి ఒత్తిడి మరియు కాండం కుళ్లు",
        kn: "ತೀವ್ರ ಬರ ಒತ್ತಡ ಮತ್ತು ಕಾಂಡ ಕೊಳೆ",
        ml: "കടുത്ത വരൾച്ച സമ്മർദവും തണ്ടു ചീയലും"
      },
      "Harvest immediately to salvage any viable grain and avoid total crop loss.": {
        hi: "किसी भी बचने योग्य दाने को बचाने और पूरी फसल हानि से बचने के लिए तुरंत कटाई करें।",
        pa: "ਬਚਣ ਯੋਗ ਅਨਾਜ ਬਚਾਉਣ ਅਤੇ ਪੂਰੀ ਫ਼ਸਲ ਨੁਕਸਾਨ ਤੋਂ ਬਚਣ ਲਈ ਤੁਰੰਤ ਕਟਾਈ ਕਰੋ।",
        mr: "वाचवता येईल असे धान्य वाचवण्यासाठी आणि संपूर्ण पीक नुकसान टाळण्यासाठी तात्काळ कापणी करा.",
        bn: "বাঁচানো সম্ভব এমন শস্য রক্ষার জন্য এবং সম্পূর্ণ ফসলহানি এড়াতে অবিলম্বে কাটাই করুন।",
        gu: "બચાવી શકાય તેવું અનાજ બચાવવા અને કુલ પાક નુકસાન ટાળવા માટે તરત કાપણી કરો.",
        ta: "பயனுள்ள தானியத்தை காப்பாற்றவும் மற்றும் முழு பயிர் இழப்பை தவிர்க்கவும் உடனடியாக அறுவடை செய்யுங்கள்.",
        te: "మిగిలే ధాన్యాన్ని రక్షించి మొత్తం పంట నష్టాన్ని నివారించేందుకు వెంటనే కోత కోయండి.",
        kn: "ಉಳಿಸಬಹುದಾದ ಧಾನ್ಯವನ್ನು ಉಳಿಸಿ ಮತ್ತು ಸಂಪೂರ್ಣ ಬೆಳೆ ನಷ್ಟವನ್ನು ತಪ್ಪಿಸಲು ತಕ್ಷಣವೇ ಕೊಯ್ಲು ಮಾಡಿ.",
        ml: "ഉപയോഗയോഗ്യമായ ധാനം രക്ഷിക്കുകയും പൂർണ്ണ വിളനഷ്ടം ഒഴിവാക്കുകയും ചെയ്യാൻ ഉടൻ കൊയ്ത്തെടുക്കുക."
      },
      "Implement consistent irrigation practices to reduce crop stress.": {
        hi: "फसल पर तनाव कम करने के लिए नियमित सिंचाई पद्धति अपनाएं।",
        pa: "ਫ਼ਸਲ ਦੇ ਤਣਾਅ ਨੂੰ ਘਟਾਉਣ ਲਈ ਲਗਾਤਾਰ ਸਿੰਚਾਈ ਅਪਣਾਓ।",
        mr: "पीक ताण कमी करण्यासाठी नियमित सिंचन पद्धतीचा अवलंब करा.",
        bn: "ফসলের চাপ কমাতে সঠিক ও নিয়মিত সেচ ব্যবস্থা গ্রহণ করুন।",
        gu: "પાક પરનું તાણ ઘટાડવા માટે નિયમિત સિંચાઈ પદ્ધતિ અમલમાં લાવો.",
        ta: "பயிர் அழுத்தத்தை குறைக்க ஒழுங்கான நீர்ப்பாசன முறையை பின்பற்றவும்.",
        te: "పంట ఒత్తిడిని తగ్గించేందుకు స్థిరమైన సాగునీటి పద్ధతులను అమలు చేయండి.",
        kn: "ಬೆಳೆ ಒತ್ತಡವನ್ನು ಕಡಿಮೆ ಮಾಡಲು ನಿಯಮಿತ ನೀರಾವರಿ ಕ್ರಮಗಳನ್ನು ಅನುಸರಿಸಿ.",
        ml: "വിള സമ്മർദം കുറയ്ക്കാൻ സ്ഥിരതയുള്ള ജലസേചനം പാലിക്കുക."
      },
      "Maintain soil moisture and monitor for secondary rot.": {
        hi: "मिट्टी में नमी बनाए रखें और द्वितीयक सड़न पर नज़र रखें।",
        pa: "ਮਿੱਟੀ ਦੀ ਨਮੀ ਬਣਾਈ ਰੱਖੋ ਅਤੇ ਦੂਸਰੀ ਸੜਨ 'ਤੇ ਨਜ਼ਰ ਰੱਖੋ।",
        mr: "मातीतील ओलावा राखा आणि दुय्यम कुज येते का ते तपासा.",
        bn: "মাটির আর্দ্রতা বজায় রাখুন এবং সেকেন্ডারি পচন পর্যবেক্ষণ করুন।",
        gu: "માટીની ભેજ જાળવી રાખો અને દ્વિતીય સડો પર નજર રાખો.",
        ta: "மண்ணின் ஈரப்பதத்தை பராமரித்து இரண்டாம் நிலை அழுகலை கண்காணிக்கவும்.",
        te: "నేల తేమను నిలుపుకుని ద్వితీయ కుళ్లును పర్యవేక్షించండి.",
        kn: "ಮಣ್ಣಿನ ತೇವಾಂಶವನ್ನು ಕಾಪಾಡಿ ಮತ್ತು ದ್ವಿತೀಯ ಕೊಳೆಯನ್ನೇ ಗಮನಿಸಿ.",
        ml: "മണ്ണിലെ ഈർപ്പം നിലനിർത്തി രണ്ടാമത്തെ ചീയൽ ലക്ഷണങ്ങൾ പരിശോധിക്കുക."
      },
      "Remove and destroy infected stalks and residues.": {
        hi: "संक्रमित डंठलों और अवशेषों को हटाकर नष्ट करें।",
        pa: "ਸੰਕਰਮਿਤ ਡੰਡੀਆਂ ਅਤੇ ਬਚੇਖੁਚੇ ਹਿੱਸਿਆਂ ਨੂੰ ਹਟਾਓ ਅਤੇ ਨਸ਼ਟ ਕਰੋ।",
        mr: "बाधित कांडे आणि अवशेष काढून नष्ट करा.",
        bn: "আক্রান্ত কাণ্ড ও অবশিষ্টাংশ সরিয়ে ধ্বংস করুন।",
        gu: "સંક્રમિત ડાંગર અને અવશેષો દૂર કરીને નાશ કરો.",
        ta: "பாதிக்கப்பட்ட தண்டுகள் மற்றும் எச்சங்களை அகற்றி அழிக்கவும்.",
        te: "సోకిన కాండాలు మరియు అవశేషాలను తొలగించి నాశనం చేయండి.",
        kn: "ಸೋಂಕಿತ ಕಾಂಡಗಳು ಮತ್ತು ಉಳಿದ ಭಾಗಗಳನ್ನು ತೆಗೆದು ನಾಶಪಡಿಸಿ.",
        ml: "ബാധിത തണ്ടുകളും അവശിഷ്ടങ്ങളും നീക്കം ചെയ്ത് നശിപ്പിക്കുക."
      },
      "Apply Propiconazole 25 EC @ 0.1%.": {
        hi: "प्रोपिकोनाज़ोल 25 ईसी @ 0.1% का छिड़काव करें।",
        pa: "ਪ੍ਰੋਪਿਕੋਨਾਜੋਲ 25 EC @ 0.1% ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
        mr: "प्रोपिकोनाझोल 25 ईसी @ 0.1% फवारणी करा.",
        bn: "প্রোপিকোনাজল ২৫ ইসি @ ০.১% প্রয়োগ করুন।",
        gu: "પ્રોપિકોનાઝોલ 25 EC @ 0.1% નો છંટકાવ કરો.",
        ta: "Propiconazole 25 EC @ 0.1% பயன்படுத்துங்கள்.",
        te: "Propiconazole 25 EC @ 0.1% పిచికారీ చేయండి.",
        kn: "Propiconazole 25 EC @ 0.1% ಸಿಂಪಡಿಸಿ.",
        ml: "Propiconazole 25 EC @ 0.1% പ്രയോഗിക്കുക."
      },
      "Avoid excessive irrigation during high humidity.": {
        hi: "अधिक आर्द्रता के दौरान अत्यधिक सिंचाई से बचें।",
        pa: "ਜ਼ਿਆਦਾ ਨਮੀ ਸਮੇਂ ਵੱਧ ਸਿੰਚਾਈ ਤੋਂ ਬਚੋ।",
        mr: "जास्त आर्द्रतेत जास्त पाणी देणे टाळा.",
        bn: "উচ্চ আর্দ্রতার সময় অতিরিক্ত সেচ এড়িয়ে চলুন।",
        gu: "ઉચ્ચ ભેજ દરમિયાન વધુ સિંચાઈ ટાળો.",
        ta: "அதிக ஈரப்பதத்தில் அதிகப்படியான நீர்ப்பாசனத்தைத் தவிர்க்கவும்.",
        te: "అధిక ఆర్ద్రత సమయంలో అధిక నీటివ్వడం నివారించండి.",
        kn: "ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆಯ ಸಮಯದಲ್ಲಿ ಅತಿಯಾದ ನೀರಾವರಿಯನ್ನು ತಪ್ಪಿಸಿ.",
        ml: "ഉയർന്ന ഈർപ്പം സമയത്ത് അതിയായ ജലസേചനം ഒഴിവാക്കുക."
      },

      // Recommendations
      "Apply copper-based fungicides immediately.": {
        hi: "तुरंत तांबा-आधारित कवकनाशी का छिड़काव करें।",
        pa: "ਤੁਰੰਤ ਤਾਂਬੇ-ਅਧਾਰਿਤ ਉੱਲੀਨਾਸ਼ਕ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
        mr: "ताबडतोब तांबे-आधारित बुरशीनाशकाची फवारणी करा.",
        bn: "অবিলম্বে তামা-ভিত্তিক ছত্রাকনাশক প্রয়োগ করুন।",
        gu: "તરત જ કોપર-આધારિત ફૂગનાશકનો છંટકાવ કરો.",
        ta: "உடனடியாக தாமிர பூஞ்சைக்கொல்லியைப் பயன்படுத்துங்கள்.",
        te: "వెంటనే రాగి ఆధారిత శిలీంద్రనాశినిని పిచికారీ చేయండి.",
        kn: "ತಕ್ಷಣವೇ ತಾಮ್ರ ಆಧಾರಿತ ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಸಿಂಪಡಿಸಿ.",
        ml: "ഉടൻ തന്നെ ചെമ്പ് അടങ്ങിയ കുമിൾനാശിനി പ്രയോഗിക്കുക."
      },
      "Improve air circulation by pruning lower stakes.": {
        hi: "निचली डालियों की छंटाई करके हवा का संचार बढ़ाएं।",
        pa: "ਹੇਠਲੀਆਂ ਟਾਹਣੀਆਂ ਦੀ ਕਟਾਈ ਕਰਕੇ ਹਵਾ ਦਾ ਸੰਚਾਰ ਵਧਾਓ।",
        mr: "खालच्या डहाळ्यांची छाटणी करून हवेचा खेळतेपणा वाढवा.",
        bn: "নিচের ডাল ছাঁটাই করে বাতাস চলাচলের ব্যবস্থা উন্নত করুন।",
        gu: "નીચેની ડાળીઓની કાપણી કરીને હવાની અવરજવર વધારો.",
        ta: "கீழ் கிளைகளை கத்தரிப்பதன் மூலம் காற்று சுழற்சியை மேம்படுத்தவும்.",
        te: "క్రింది కొమ్మలను కత్తిరించడం ద్వారా గాలి ప్రసరణను మెరుగుపరచండి.",
        kn: "ಕೆಳಗಿನ ಕೊಂಬೆಗಳನ್ನು ಕತ್ತರಿಸುವ ಮೂಲಕ ಗಾಳಿಯ ಪ್ರಸರಣವನ್ನು ಹೆಚ್ಚಿಸಿ.",
        ml: "താഴത്തെ ശാഖകൾ കോതി ഒതുക്കി തോട്ടത്തിൽ കാറ്റോട്ടം കൂട്ടുക."
      },
      "Avoid overhead watering to minimize leaf wetness.": {
        hi: "पत्तियों के गीलेपन को कम करने के लिए ऊपर से पानी देने से बचें।",
        pa: "ਪੱਤਿਆਂ 'ਤੇ ਗਿੱਲਾਪਣ ਘਟਾਉਣ ਲਈ ਉੱਪਰੋਂ ਪਾਣੀ ਦੇਣ ਤੋਂ ਬਚੋ।",
        mr: "पाने ओली राहू नयेत म्हणून वरून पाणी देणे टाळा.",
        bn: "পাতার আর্দ্রতা কমাতে ওপর দিয়ে জল দেওয়া এড়িয়ে চলুন।",
        gu: "પાંદડા ભીના થતા અટકાવવા માટે ઉપરથી પાણી આપવાનું ટાળો.",
        ta: "இலைகள் ஈரமாவதைத் தவிர்க்க மேலே இருந்து நீர் ஊற்றுவதைத் தவிர்க்கவும்.",
        te: "ఆకులు తడవకుండా ఉండేందుకు పైనుంచి నీరు పోయడం నివారించండి.",
        kn: "ಎಲೆಗಳು ಒದ್ದೆಯಾಗುವುದನ್ನು ತಪ್ಪಿಸಲು ಮೇಲಿನಿಂದ ನೀರುಣಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ.",
        ml: "ഇലകൾ എപ്പോഴും നനഞ്ഞിരിക്കുന്നത് ഒഴിവാക്കാൻ മുകളിൽ നിന്നുള്ള നന ഒഴിവാക്കുക."
      },
      "Avoid excessive nitrogen fertilizer application.": {
        hi: "अत्यधिक नाइट्रोजन उर्वरक के प्रयोग से बचें।",
        pa: "ਨਾਈਟ੍ਰੋਜਨ ਖਾਦ ਦੀ ਬਹੁਤ ਜ਼ਿਆਦਾ ਵਰਤੋਂ ਤੋਂ ਬਚੋ।",
        mr: "अवाजवी नायट्रोजन खतांचा वापर टाळा.",
        bn: "অতিরিক্ত নাইট্রোজেন সার ব্যবহার করা এড়িয়ে চলুন।",
        gu: "વધુ પડતા નાઇટ્રોજન ખાતરનો ઉપયોગ ટાળો.",
        ta: "அதிகப்படியான நைட்ரஜன் உரங்களைப் பயன்படுத்துவதைத் தவிர்க்கவும்.",
        te: "అధిక నత్రజని ఎరువుల వినియోగాన్ని నివారించండి.",
        kn: "ಅತಿಯಾದ ಸಾರಜನಕ ಗೊಬ್ಬರದ ಬಳಕೆಯನ್ನು ತಪ್ಪಿಸಿ.",
        ml: "നൈട്രജൻ വളങ്ങളുടെ അമിത ഉപയോഗം ഒഴിവാക്കുക."
      },
      "Maintain adequate water depth in paddy fields.": {
        hi: "धान के खेतों में पर्याप्त पानी की मात्रा बनाए रखें।",
        pa: "ਝੋਨੇ ਦੇ ਖੇਤਾਂ ਵਿੱਚ ਪਾਣੀ ਦਾ ਢੁਕਵਾਂ ਪੱਧਰ ਬਣਾਈ ਰੱਖੋ।",
        mr: "भाताच्या शेतात पाण्याची योग्य पातळी राखा.",
        bn: "ধানের জমিতে পর্যাপ্ত জলের গভীরতা বজায় রাখুন।",
        gu: "ડાંગરના ખેતરોમાં પાણીનું પૂરતું સ્તર જાળવી રાખો.",
        ta: "நெல் வயல்களில் போதிய அளவு தண்ணீர் தேங்குவதை உறுதி செய்யவும்.",
        te: "వరి పొలాల్లో తగినంత నీటి మట్టాన్ని నిర్వహించండి.",
        kn: "ಭತ್ತದ ಗದ್ದೆಗಳಲ್ಲಿ ಸೂಕ್ತ ನೀರಿನ ಮಟ್ಟವನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಿ.",
        ml: "നെൽവയലുകളിൽ ആവശ്യത്തിന് ജലനിരപ്പ് നിലനിർത്തുക."
      },
      "Use certified disease-free seeds next season.": {
        hi: "अगले सीजन में प्रमाणित रोगमुक्त बीजों का ही उपयोग करें।",
        pa: "ਅਗਲੇ ਸੀਜ਼ਨ ਵਿੱਚ ਪ੍ਰਮਾਣਿਤ ਬਿਮਾਰੀ-ਮੁਕਤ ਬੀਜਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
        mr: "पुढील हंगामात प्रमाणित रोगमुक्त बियाण्यांचा वापर करा.",
        bn: "পরবর্তী মরসুমে প্রত্যয়িত রোগমুক্ত বীজ ব্যবহার করুন।",
        gu: "આવતા ના સત્રમાં પ્રમાણિત રોગમુક્ત બિયારણનો ઉપયોગ કરો.",
        ta: "அடுத்த பருவத்தில் சான்றளிக்கப்பட்ட நோய் இல்லாத விதைகளைப் பயன்படுத்தவும்.",
        te: "వచ్చే సీజన్‌లో ధృవీకరించబడిన వ్యాధి రహిత విత్తనాలను ఉపయోగించండి.",
        kn: "ಮುಂದಿನ ಋತುವಿನಲ್ಲಿ ಪ್ರಮಾಣೀಕೃತ ರೋಗಮುಕ್ತ ಬೀಜಗಳನ್ನು ಬಳಸಿ.",
        ml: "അടുത്ത സീസണിൽ സാക്ഷ്യപ്പെടുത്തിയിട്ടുള്ള രോഗരഹിത വിത്തുകൾ ഉപയോഗിക്കുക."
      },
      "No critical treatment required.": {
        hi: "किसी गंभीर उपचार की आवश्यकता नहीं है।",
        pa: "ਕਿਸੇ ਗੰਭੀਰ ਇਲਾਜ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।",
        mr: "कोणत्याही गंभीर उपचारांची आवश्यकता नाही.",
        bn: "কোনো জরুরি চিকিৎসার প্রয়োজন নেই।",
        gu: "કોઈપણ ગંભીર સારવારની જરૂર નથી.",
        ta: "எந்தவொரு தீவிர சிகிச்சையும் தேவையில்லை.",
        te: "ఎటువంటి క్లిష్టమైన చికిత్స అవసరం లేదు.",
        kn: "ಯಾವುದೇ ಗಂಭೀರ ಚಿಕಿತ್ಸೆಯ ಅಗತ್ಯವಿಲ್ಲ.",
        ml: "പ്രത്യേക ചികിത്സയോ പ്രതിരോധമോ ആവശ്യമില്ല."
      },
      "Continue regular soil nutrition levels.": {
        hi: "नियमित मृदा पोषण स्तर बनाए रखें।",
        pa: "ਮਿੱਟੀ ਦੀ ਨਿਯਮਤ ਪੋਸ਼ਣ ਮਾਤਰਾ ਬਣਾਈ ਰੱਖੋ।",
        mr: "नियमित मातीचे पोषण स्तर राखत राहा.",
        bn: "মাটির নিয়মিত পুষ্টির মাত্রা বজায় রাখুন।",
        gu: "નિયમિત જમીન પોષણ સ્તર જાળવી રાખો.",
        ta: "மண்ணின் வழக்கமான ஊட்டச்சத்து அளவைத் தொடரவும்.",
        te: "క్రమం తప్పకుండా నేల పోషకాల స్థాయిని కొనసాగించండి.",
        kn: "ನಿಯಮಿತ ಮಣ್ಣಿನ ಪೋಷಕಾಂಶಗಳ ಮಟ್ಟವನ್ನು ಮುಂದುವರಿಸಿ.",
        ml: "മണ്ണിലെ പോഷകഗുണം യഥാസമയം നിലനിർത്തുക."
      },
      "Monitor weekly for late blight conditions.": {
        hi: "पछेती झुलसा की स्थिति के लिए साप्ताहिक निगरानी करें।",
        pa: "ਪਛੇਤੀ ਝੁਲਸ ਰੋਗ ਦੀਆਂ ਸਥਿਤੀਆਂ ਲਈ ਹਫ਼ਤਾਵਾਰੀ ਨਿਗਰਾਨੀ ਕਰੋ।",
        mr: "लेट ब्लाइट परिस्थितीसाठी साप्ताहिक लक्ष ठेवा.",
        bn: "নাবি ধসা রোগের জন্য साप्ताहिक পর্যবেক্ষণ বজায় রাখুন।",
        gu: "મોડા સુકારાની સ્થિતિ માટે साપ્ताहिक દેખરેખ રાખો.",
        ta: "தாமதமான கருகல் நோய் நிலைமைகளை வாரந்தோறும் கண்காணிக்கவும்.",
        te: "చివరి దశ మాగుడు తెగులు కోసం వారానికోసారి పర్యవేక్షించండి.",
        kn: "ಲೇಟ್ ಬ್ಲೈಟ್ ರೋಗದ ಸ್ಥಿತಿಗಾಗಿ ವಾರಕ್ಕೊಮ್ಮೆ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",
        ml: "ലേറ്റ് ബ്ലൈറ്റ് രോഗലക്ഷണങ്ങൾക്കായി ആഴ്ചതോറും നിരീക്ഷിക്കുക."
      },
      "Quarantine infected area immediately to prevent spreading.": {
        hi: "संक्रमण फैलने से रोकने के लिए संक्रमित क्षेत्र को तुरंत अलग करें।",
        pa: "ਬਿमਾਰੀ ਫੈਲਣ ਤੋਂ ਰੋਕਣ ਲਈ ਪ੍ਰਭਾਵਿਤ ਖੇਤਰ ਨੂੰ ਤੁਰੰਤ ਅਲੱਗ ਕਰੋ।",
        mr: "रोग पसरण्यापासून रोखण्यासाठी बाधित क्षेत्र ताबडतोब अलग करा.",
        bn: "রোগ ছড়ানো রোধ করতে অবিলম্বে আক্রান্ত এলাকা আলাদা করুন।",
        gu: "રોગ ફેલાતો અટકાવવા માટે સંક્રમિત વિસ્તારને તરત અલગ કરો.",
        ta: "நோய் பரவுவதைத் தடுக்க பாதிக்கப்பட்ட பகுதியை உடனடியாக தனிமைப்படுத்தவும்.",
        te: "వ్యాప్తిని అరికట్టడానికి సోకిన ప్రాంతాన్ని వెంటనే దిగ్బంధం చేయండి.",
        kn: "ರೋಗ ಹರಡುವುದನ್ನು ತಡೆಯಲು ಸೋಂಕಿತ ಪ್ರದೇಶವನ್ನು ತಕ್ಷಣವೇ ಪ್ರತ್ಯೇಕಿಸಿ.",
        ml: "രോഗം പടരുന്നത് തടയാൻ ബാധിത പ്രദേശം ഉടൻ തന്നെ മറ്റുള്ളവയിൽ നിന്നും മാറ്റുക."
      },
      "Apply biological control agents like Trichoderma viride.": {
        hi: "ट्राइकोडर्मा विरिडी जैसे जैविक नियंत्रण एजेंटों का प्रयोग करें।",
        pa: "ਟ੍ਰਾਈਕੋਡਰਮਾ ਵਿਰੀਡੀ ਵਰਗੇ ਜੈਵਿਕ ਨਿਯੰਤਰਣ ਕਾਰਕਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
        mr: "ट्रायकोडर्मा व्हिरिडीसारख्या जैविक नियंत्रण घटकांचा वापर करा.",
        bn: "ট্রাইকোডার্মা ভিরিডির মতো জৈবিক নিয়ন্ত্রণ উপাদান প্রয়োগ করুন।",
        gu: "ટ્રાઇકોડર્મા વિરીડી જેવા જૈવિક નિયંત્રણ એજન્ટો લાગુ કરો.",
        ta: "டிரைக்கோடெர்மா விரிடி போன்ற உயிரியல் கட்டுப்பாட்டுப் பூச்சிகளைப் பயன்படுத்தவும்.",
        te: "ట్రైకోడెర్మా విరిడే వంటి జీవ నియంత్రణ కారకాలను వర్తింపజేయండి.",
        kn: "ಟ್ರೈಕೋಡರ್ಮಾ ವಿರಿಡಿಯಂತಹ ಜೈವಿಕ ನಿಯಂತ್ರಣ ಕಾರಕಗಳನ್ನು ಬಳಸಿ.",
        ml: "ട്രൈക്കോഡെർമ വിരിഡി പോലുള്ള ജൈവ നിയന്ത്രണം ഉപയോഗിക്കുക."
      },
      "Adopt crop rotation for at least 3 years.": {
        hi: "कम से कम 3 वर्षों के लिए फसल चक्र अपनाएं।",
        pa: "ਘੱਟੋ-ਘੱਟ 3 ਸਾਲਾਂ ਲਈ ਫ਼ਸਲੀ ਚੱਕਰ ਅਪਣਾਓ।",
        mr: "किमान ३ वर्षे पीक फेरपालट पद्धतीचा अवलंब करा.",
        bn: "কমপক্ষে ৩ বছরের জন্য শস্য আবর্তন গ্রহণ করুন।",
        gu: "ઓછામાં ઓછા ૩ વર્ષ માટે પાક ચક્ર અપનાવો.",
        ta: "குறைந்தது 3 ஆண்டுகளுக்கு பயிர் சுழற்சி முறையை மேற்கொள்ளவும்.",
        te: "కనీసం 3 సంవత్సరాల పాటు పంట మార్పిడి పద్ధతిని అవలंबించండి.",
        kn: "ಕನಿಷ್ಠ 3 ವರ್ಷಗಳ ಕಾಲ ಬೆಳೆ ಸರದಿಯನ್ನು ಅಳವಡಿಸಿಕೊಳ್ಳಿ.",
        ml: "കുറഞ്ഞത് മൂന്ന് വർഷമെങ്കിലും വിളവിപര്യയം ശീലിക്കുക."
      },
      "Select resistant cultivars for upcoming cycles.": {
        hi: "आगामी चक्रों के लिए प्रतिरोधी प्रजातियों का चयन करें।",
        pa: "ਅਗਲੀਆਂ ਫ਼ਸਲਾਂ ਲਈ ਬਿਮਾਰੀ-ਰੋਧਕ ਕਿਸਮਾਂ ਦੀ ਚੋਣ ਕਰੋ।",
        mr: "पुढील पीक चक्रासाठी रोगप्रतिकारक जातींची निवड करा.",
        bn: "আসন্ন চাষের জন্য রোগ প্রতিরোধী জাত নির্বাচন করুন।",
        gu: "આવતા સત્રો માટે રોગ પ્રતિકારક જાતો પસંદ કરો.",
        ta: "அடுத்தடுத்த பயிர் சுழற்சிகளுக்கு நோய் எதிர்ப்பு ரகங்களைத் தேர்ந்தெடுக்கவும்.",
        te: "రాబోయే పంటల కోసం వ్యాధి నిరోధక రకాలను ఎంచుకోండి.",
        kn: "ಮುಂದಿನ ಬೆಳೆ ಚಕ್ರಕ್ಕೆ ರೋಗ ನಿರೋಧಕ ತಳಿಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",
        ml: "വരും സീസണുകളിൽ രോഗപ്രതിരോധ ശേഷിയുള്ള വിത്തിനങ്ങളെ തിരഞ്ഞെടുക്കുക."
      },
      "Set proper drainage channels.": {
        hi: "जल निकासी के लिए उचित नालियां बनाएं।",
        pa: "ਪਾਣੀ ਦੀ ਨਿਕਾਸੀ ਲਈ ਉਚਿਤ ਪ੍ਰਬੰਧ ਕਰੋ।",
        mr: "पाण्याच्या निचऱ्यासाठी योग्य व्यवस्था करा.",
        bn: "যথাযথ নিষ্কাশন ব্যবস্থার ব্যবস্থা করুন।",
        gu: "પાણીના નિકાલની યોગ્ય વ્યવસ્થા કરો.",
        ta: "முறையான வடிகால் அமைப்புகளை ஏற்படுத்தவும்.",
        te: "సరైన నీటి పారుదల కాలువలను ఏర్పాటు చేయండి.",
        kn: "ಸೂಕ್ತ ನೀರು ಹರಿದುಹೋಗುವ ಚರಂಡಿ ವ್ಯವಸ್ಥೆಯನ್ನು ಮಾಡಿ.",
        ml: "കൃത്യമായ രീതിയിൽ നീർവാർച്ചാ സൗകര്യം ഉറപ്പാക്കുക."
      },
      "Remove and destroy scattered infected plants.": {
        hi: "बिखरे हुए संक्रमित पौधों को उखाड़कर नष्ट कर दें।",
        pa: "ਖਿੰਡੇ ਹੋਏ ਪ੍ਰਭਾਵਿਤ ਪੌਦਿਆਂ ਨੂੰ ਪੁੱਟ ਕੇ ਨਸ਼ਟ ਕਰੋ।",
        mr: "इतस्ततः पसरलेली बाधित झाडे काढून नष्ट करा.",
        bn: "ছড়িয়ে থাকা আক্রান্ত গাছগুলি উপড়ে ফেলে ধ্বংস করুন।",
        gu: "વિખરાયેલા સંક્રમિત છોડને દૂર કરી નાશ કરો.",
        ta: "பாதிக்கப்பட்ட செடிகளை உடனடியாக அகற்றி அழித்து விடவும்.",
        te: "సోకిన మొక్కలను పీకి వేసి కాల్చివేయండి.",
        kn: "ರೋಗಪೀಡಿತ ಗಿಡಗಳನ್ನು ಕಿತ್ತು ನಾಶಪಡಿಸಿ.",
        ml: "രോഗം ബാധിച്ച ചെടികൾ നശിപ്പിച്ചു കളയുക."
      }
    };

    const normalizedDictionary = Object.entries(dictionary).reduce((acc, [key, value]) => {
      acc[normalizeTranslationKey(key)] = value;
      return acc;
    }, {} as Record<string, Record<string, string>>);

    const exactMatch = dictionary[text];
    if (exactMatch) {
      return exactMatch[language] || text;
    }

    const normalizedMatch = normalizedDictionary[normalizeTranslationKey(text)];
    if (normalizedMatch) {
      return normalizedMatch[language] || text;
    }

    return text;
  };

  const translateFilter = (opt: string): string => {
    switch (opt) {
      case 'All': return content.filterAll || 'All';
      case 'Healthy': return content.filterHealthy || 'Healthy';
      case 'Damaged': return content.filterDamaged || 'Damaged';
      case 'High Risk': return content.filterHighRisk || 'High Risk';
      case 'Moderate Risk': return content.filterModRisk || 'Moderate Risk';
      default: return opt;
    }
  };
  
  // Get dark mode from document or default to system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!ownerIdentity?.userMobile) {
      setReports([]);
      setLoadingReports(false);
      setReportsError(null);
      return;
    }

    const controller = new AbortController();
    const cachedReports = readCachedReports();

    if (cachedReports.length > 0) {
      setReports(cachedReports.map(mapStoredReportToItem));
      setLoadingReports(false);
      setReportsError(null);
    } else {
      setLoadingReports(true);
    }

    const loadReports = async () => {
      try {
        setReportsError(null);

        const data = await fetchReportsFromServer(controller.signal);
        writeCachedReports(data);
        setReports(data.map(mapStoredReportToItem));
        setReportsError(null);
      } catch (error: any) {
        if (error?.name !== 'AbortError') {
          setReportsError(error?.message || content.loadError || t.en.loadError);
          setReports([]);
        }
      } finally {
        setLoadingReports(false);
      }
    };

    loadReports();

    return () => controller.abort();
  }, [ownerIdentity?.userMobile, reportsCacheKey]);

  const handleRefreshReports = async () => {
    if (!ownerIdentity?.userMobile) return;

    setRefreshingReports(true);
    try {
      setReportsError(null);
      const data = await fetchReportsFromServer();
      writeCachedReports(data);
      setReports(data.map(mapStoredReportToItem));
    } catch (error: any) {
      setReportsError(error?.message || content.loadError || t.en.loadError);
    } finally {
      setRefreshingReports(false);
    }
  };

  // Helper function to convert ReportItem to CropReport
  const convertToCropReport = (item: ReportItem): CropReport => {
    const riskLevelMap: Record<string, RiskLevel> = {
      'Healthy': 'healthy',
      'Moderate Risk': 'moderate',
      'Severe Damage': 'high'
    };

    const cropCodeMap: Record<string, string> = {
      'Tomato': 'TO',
      'Rice': 'RI',
      'Potato': 'PO',
      'Cotton': 'CO',
      'Sugarcane': 'SU'
    };

    return {
      id: item.id,
      date: item.date,
      cropName: translateText(item.cropName),
      cropCode: cropCodeMap[item.cropName] || 'XX',
      cropImage: item.cropImage,
      disease: translateText(item.disease),
      riskLevel: riskLevelMap[item.status] || 'moderate',
      damage: item.damage,
      confidence: item.confidence,
      recommendation: item.recommendations.length > 0
        ? item.recommendations.map((recommendation) => translateText(recommendation)).join(' ')
        : translateText(item.details)
    };
  };

  function mapStoredReportToItem(report: StoredCropReport): ReportItem {
    const damage = Number(report.damageSeverity || 0);
    const confidence = Number(report.confidenceScore || 0);
    const status = report.status === 'Healthy' || report.status === 'Moderate Risk' || report.status === 'Severe Damage'
      ? report.status
      : damage >= 60
        ? 'Severe Damage'
        : damage >= 20
          ? 'Moderate Risk'
          : 'Healthy';

    return {
      id: report._id || `${report.fileName}-${report.capturedAt}`,
      date: new Date(report.capturedAt).toISOString().slice(0, 10),
      cropName: report.cropName,
      cropImage: report.cropImage,
      disease: report.detectedCondition,
      damage,
      confidence,
      status,
      details: report.treatmentSuggestions.length > 0 ? report.treatmentSuggestions.join(' ') : report.detectedCondition,
      recommendations: report.treatmentSuggestions,
    };
  }

  const fetchReportsFromServer = async (signal?: AbortSignal) => {
    if (!ownerIdentity?.userMobile) {
      return [] as StoredCropReport[];
    }

    const response = await fetch(`/api/cropreports?mobile=${encodeURIComponent(ownerIdentity.userMobile)}`, { signal });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<StoredCropReport[]>;
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/cropreports/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMobile: ownerIdentity?.userMobile }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }

      setReports(prev => prev.filter(r => r.id !== id));
      if (selectedReport?.id === id) {
        setSelectedReport(null);
      }

      if (typeof window !== 'undefined') {
        const cachedReports = readCachedReports().filter((report) => (report._id || `${report.fileName}-${report.capturedAt}`) !== id);
        writeCachedReports(cachedReports);
      }
    } catch (error) {
      console.error('Failed to delete crop report:', error);
    }
  };

  const handleDownloadPDF = (report: ReportItem) => {
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF();
      doc.setFillColor(46, 125, 50); // Agri Green
      doc.rect(0, 0, 210, 40, 'F');
      
      // Header Text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('AgriLens AI Crop Analysis Report', 15, 25);
      
      // Body Content
      doc.setTextColor(33, 33, 33);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      doc.text(`Scan Date: ${report.date}`, 15, 60);
      doc.text(`Crop Name: ${translateText(report.cropName)}`, 15, 70);
      doc.text(`Analysis Outcome: ${translateText(report.disease)}`, 15, 80);
      doc.text(`Infestation Level: ${report.damage}%`, 15, 90);
      doc.text(`Confidence Level: ${report.confidence}%`, 15, 100);
      doc.text(`Overall Status: ${translateText(report.status)}`, 15, 110);
      
      doc.setFont('helvetica', 'bold');
      doc.text('AI Recommendation:', 15, 130);
      doc.setFont('helvetica', 'italic');
      let offset = 140;
      report.recommendations.forEach((rec, idx) => {
        doc.text(`${idx + 1}. ${translateText(rec)}`, 20, offset);
        offset += 10;
      });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text('This is a verified smart report secured by PMFBY digital agriculture guidelines.', 15, 260);
      
      doc.save(`AgriLens_Report_${report.cropName}_${report.date}.pdf`);
    }).catch(err => {
      console.error("PDF engine failure:", err);
      alert(`Downloading Report: \nCrop: ${translateText(report.cropName)}\nDate: ${report.date}\nStatus: ${translateText(report.status)}`);
    });
  };

  // Compute stats
  const totalCount = reports.length;
  const healthyCount = reports.filter(r => r.status === 'Healthy').length;
  const damagedCount = reports.filter(r => r.status === 'Severe Damage' || r.status === 'Moderate Risk').length;
  const avgAccuracy = totalCount > 0 ? Math.round(reports.reduce((acc, current) => acc + current.confidence, 0) / totalCount) : 0;

  // Filter & Search
  const filteredReports = reports.filter(r => {
    const translatedName = translateText(r.cropName).toLowerCase();
    const translatedDisease = translateText(r.disease).toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch = translatedName.includes(query) || 
                          translatedDisease.includes(query) ||
                          r.cropName.toLowerCase().includes(query) ||
                          r.disease.toLowerCase().includes(query);
    if (!matchesSearch) return false;

    if (filter === 'All') return true;
    if (filter === 'Healthy') return r.status === 'Healthy';
    if (filter === 'Damaged') return r.status === 'Severe Damage';
    if (filter === 'High Risk') return r.status === 'Severe Damage';
    if (filter === 'Moderate Risk') return r.status === 'Moderate Risk';
    return true;
  });



  return (
    <div className="space-y-8 pb-12">
      {/* Navigation and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            {content.title}
          </h1>
          <p className="text-muted-foreground font-medium">
            {content.desc}
          </p>
        </div>
        <Button onClick={onBack} variant="outline" className="font-bold border-primary/20 text-primary hover:bg-primary/5 self-start sm:self-auto">
          <ArrowLeft className="h-4 w-4 mr-2" /> {content.back}
        </Button>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-none shadow-md bg-white dark:bg-zinc-900 border-l-4 border-l-primary overflow-hidden">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{content.totalReports}</p>
              <h3 className="text-xl font-black text-foreground">{totalCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white dark:bg-zinc-900 border-l-4 border-l-green-500 overflow-hidden">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{content.healthyCrops}</p>
              <h3 className="text-xl font-black text-foreground">{healthyCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white dark:bg-zinc-900 border-l-4 border-l-amber-500 overflow-hidden">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{content.damagedCrops}</p>
              <h3 className="text-xl font-black text-foreground">{damagedCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white dark:bg-zinc-900 border-l-4 border-l-indigo-500 overflow-hidden">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{content.aiAccuracy}</p>
              <h3 className="text-xl font-black text-foreground">{avgAccuracy}%</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white dark:bg-zinc-900 border-l-4 border-l-sky-500 overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{content.refreshReportsTitle || t.en.refreshReportsTitle}</p>
              <h3 className="text-sm font-black text-foreground">{content.refreshReportsTitle || t.en.refreshReportsTitle}</h3>
            </div>
            <Button
              onClick={handleRefreshReports}
              disabled={refreshingReports}
              size="sm"
              variant="outline"
              className="rounded-full font-bold border-sky-500/20 bg-white text-sky-700 hover:bg-sky-500/5 dark:bg-neutral-950 dark:text-sky-300"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshingReports ? 'animate-spin' : ''}`} />
              {refreshingReports ? (content.refreshing || t.en.refreshing) : (content.refresh || t.en.refresh)}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={content.searchPlaceholder} 
            className="pl-10 bg-muted/20 border-muted-foreground/20 hover:border-primary/40 focus:bg-background transition-all"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto items-center">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
          <div className="grid grid-cols-2 sm:flex gap-1.5 w-full md:w-auto">
            {(['All', 'Healthy', 'Damaged', 'High Risk', 'Moderate Risk'] as const).map((filterOpt) => (
              <Button
                key={filterOpt}
                variant={filter === filterOpt ? 'default' : 'outline'}
                onClick={() => setFilter(filterOpt)}
                size="sm"
                className={`font-semibold text-xs rounded-full h-8 px-3.5 transition-all ${
                  filter === filterOpt ? 'shadow-sm' : 'border-muted-foreground/25 hover:bg-primary/5 text-muted-foreground hover:text-foreground'
                }`}
              >
                {translateFilter(filterOpt)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Listing */}
      {loadingReports ? (
        <Card className="border border-dashed border-border/80 bg-muted/10 p-12 text-center rounded-[24px]">
          <CardContent className="space-y-3 max-w-md mx-auto">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground mx-auto">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
            <h3 className="font-extrabold text-lg text-foreground">{content.loadingReports || t.en.loadingReports}</h3>
          </CardContent>
        </Card>
      ) : reportsError ? (
        <Card className="border border-dashed border-border/80 bg-muted/10 p-12 text-center rounded-[24px]">
          <CardContent className="space-y-3 max-w-md mx-auto">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center text-destructive mx-auto">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="font-extrabold text-lg text-foreground">{content.unableToLoadReports || t.en.unableToLoadReports}</h3>
            <p className="text-sm text-muted-foreground">{reportsError}</p>
          </CardContent>
        </Card>
      ) : filteredReports.length === 0 ? (
        <Card className="border border-dashed border-border/80 bg-muted/10 p-12 text-center rounded-[24px]">
          <CardContent className="space-y-4 max-w-md mx-auto">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground mx-auto">
              <Layers className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-foreground">{content.noReports}</h3>
              <p className="text-sm text-muted-foreground">{content.noReportsDesc}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <AnimatePresence>
            {filteredReports.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className="h-full"
              >
                <CropReportCard
                  report={convertToCropReport(report)}
                  isDarkMode={isDarkMode}
                  labels={{
                    riskHigh: content.riskHighLabel || t.en.riskHighLabel,
                    riskModerate: content.riskModerateLabel || t.en.riskModerateLabel,
                    riskLow: content.riskLowLabel || t.en.riskLowLabel,
                    riskHealthy: content.riskHealthyLabel || t.en.riskHealthyLabel,
                    capturedOn: content.capturedOn || t.en.capturedOn,
                    bioDiagnostic: content.bioDiagnostic || t.en.bioDiagnostic,
                    damageSeverity: content.damageSeverityCard || t.en.damageSeverityCard,
                    aiValidationConfidence: content.aiValidationConfidence || t.en.aiValidationConfidence,
                    urgentAction: content.urgentAction || t.en.urgentAction,
                    monitorMessage: content.monitorMessage || t.en.monitorMessage,
                    stableMessage: content.stableMessage || t.en.stableMessage,
                    modelValidationActive: content.modelValidationActive || t.en.modelValidationActive,
                    detailedDiagnosticFile: content.detailedDiagnosticFile || t.en.detailedDiagnosticFile,
                    pdfExport: content.pdfExport || t.en.pdfExport,
                    deleteReportAria: content.deleteReportAria || t.en.deleteReportAria,
                  }}
                  onViewReport={(_cropReport: CropReport) => setSelectedReport(report)}
                  onDownloadPDF={(_cropReport: CropReport) => handleDownloadPDF(report)}
                  onDeleteReport={(id: string) => handleDelete(id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal Dialog for detailed report view */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-background border border-border rounded-[24px] w-full max-w-sm md:max-w-md h-[min(88vh,760px)] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Dual-color banner */}
              <div className="bg-zinc-950 dark:bg-white text-zinc-100 dark:text-zinc-950 p-4 md:p-5 border-b border-zinc-900 dark:border-neutral-200 transition-colors relative">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#2e7d32] dark:text-green-600 bg-[#2e7d32]/10 dark:bg-green-600/10 px-2.5 py-0.5 rounded-full inline-block">
                    {content.reportDetails}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black mt-2 leading-tight">
                    {translateText(selectedReport.cropName)} {content.cropStatus}
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1 mt-1 font-semibold">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> {content.date}: {selectedReport.date}
                  </p>
                </div>
              </div>

              <div className="flex-1 min-h-0 p-4 md:p-5">
                <div className="h-full rounded-2xl border border-border/70 bg-muted/20 p-4 md:p-5 space-y-4 md:space-y-5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="bg-background/85 p-3 rounded-xl border border-border/10 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">{content.diagnostic}</span>
                      <p className="font-extrabold text-foreground text-sm mt-0.5 leading-snug">{translateText(selectedReport.disease)}</p>
                    </div>
                    <div className="bg-background/85 p-3 rounded-xl border border-border/10 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">{content.confidence}</span>
                      <p className="font-extrabold text-primary text-sm mt-0.5">{selectedReport.confidence}% {content.accurateSuffix || t.en.accurateSuffix}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-background/85 rounded-xl border border-border/10 p-3 shadow-sm">
                    <span className="text-xs font-bold text-muted-foreground">{content.summary}</span>
                    <p className="text-xs text-foreground/80 leading-relaxed font-semibold">
                      {translateText(selectedReport.details)}
                    </p>
                  </div>

                  <div className="space-y-2 bg-background/85 rounded-xl border border-border/10 p-3 shadow-sm">
                    <span className="text-xs font-bold text-muted-foreground">{content.recommendations}</span>
                    <div className="space-y-1.5">
                      {selectedReport.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-xs text-foreground/90 font-medium rounded-lg border border-border/10 bg-muted/30 p-2">
                          <span className="h-5 w-5 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">{idx + 1}</span>
                          <p className="mt-0.5 font-semibold leading-normal">{translateText(rec)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/70 bg-background/95 p-4 md:p-5">
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-white hover:bg-neutral-100 text-neutral-950 font-bold rounded-full py-4 border border-neutral-200 dark:bg-white dark:text-neutral-950"
                    onClick={() => handleDownloadPDF(selectedReport)}
                  >
                    <Download className="h-4 w-4 mr-2" /> {content.downloadDoc}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="font-bold border-border rounded-full py-4 text-neutral-900 dark:text-foreground"
                    onClick={() => setSelectedReport(null)}
                  >
                    {content.close}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
