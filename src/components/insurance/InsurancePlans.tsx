import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Shield, CheckCircle2, Info, ArrowRight, Landmark, Sprout, CloudRain, RefreshCw, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LanguageCode } from '@/src/lib/languages';

interface InsurancePlansProps {
  language: LanguageCode;
}

export const InsurancePlans: React.FC<InsurancePlansProps> = ({ language }) => {
  const detailedRef = useRef<HTMLDivElement>(null);

  const scrollToDetails = () => {
    if (detailedRef.current) {
      detailedRef.current.scrollIntoView({ behavior: 'smooth' });
      // Fallback for some browsers/iframes
      const top = detailedRef.current.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleApplyNow = () => {
    window.open('https://pmfby.gov.in/farmerLogin', '_blank');
  };

  const t: Record<string, any> = {
    en: {
      title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      subtitle: "Comprehensive insurance coverage against crop failure",
      description: "PMFBY aims at supporting sustainable production in agriculture sector by way of providing financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
      plansTitle: "Available Insurance Schemes",
      benefits: "Key Benefits",
      eligibility: "Eligibility",
      officialScheme: "Official Scheme",
      compulsory: "Compulsory",
      voluntary: "Voluntary",
      loanee: "Loanee",
      nonLoanee: "Non-Loanee",
      eligibilityDesc: "All farmers including sharecroppers and tenant farmers growing the notified crops in the notified areas are eligible for coverage.",
      applyNow: "Apply Now",
      learnMore: "Learn More",
      premium: "Premium",
      schemes: [
        { id: "pmfby", name: "PMFBY (Standard)", type: "Yield Based", desc: "Covers yield losses due to non-preventable risks, such as natural fire and lightning, storm, hailstorm, cyclone, typhoon, tempest, hurricane, tornado etc.", premium: "2% Kharif / 1.5% Rabi", icon: Shield, color: "bg-blue-500" },
        { id: "rwbcis", name: "RWBCIS", type: "Weather Based", desc: "Restructured Weather Based Crop Insurance Scheme. Covers crop losses resulting from adverse weather conditions like rainfall, temperature, wind, humidity etc.", premium: "Varies by State", icon: CloudRain, color: "bg-indigo-500" },
        { id: "horticulture", name: "Horticulture", type: "Commercial", desc: "Specialized coverage for high-value horticultural and commercial crops like fruits, vegetables, and spices.", premium: "5% Fixed", icon: Sprout, color: "bg-green-500" }
      ],
      features: ["Low premium rates", "Full sum insured", "Smart tech claims", "Full cycle cover"],
      detailedInfoTitle: "Detailed Plan Information",
      coveredRisks: "Covered Risks & Benefits",
      claimProcess: "Claim Processing Procedure",
      contactSupport: "Contact & Support",
      detailedSchemes: [
        { name: "PMFBY (Standard)", risks: ["Yield loss (Drought, Flood)", "Sowing risk", "Post-harvest", "Local calamities"], procedure: "Intimate loss within 72h. Settlement within 30 days.", contact: "Toll Free: 1800-180-1551" },
        { name: "RWBCIS", risks: ["Adverse weather", "Wind & frost", "Disease breakout"], procedure: "Automatic weather station trigger.", contact: "Toll Free: 1800-200-5142" },
        { name: "Horticulture", risks: ["Total loss", "Quality drop", "Specific pests"], procedure: "Farm level assessment. Photo proof needed.", contact: "Toll Free: 1800-425-7012" }
      ]
    },
    hi: {
      title: "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
      subtitle: "फसल खराब होने के खिलाफ व्यापक बीमा कवरेज",
      description: "PMFBY का उद्देश्य अप्रत्याशित घटनाओं से फसल के नुकसान/क्षति का सामना करने वाले किसानों को वित्तीय सहायता प्रदान करके कृषि क्षेत्र में सतत उत्पादन का समर्थन करना है।",
      plansTitle: "उपलब्ध बीमा योजनाएं",
      benefits: "प्रमुख लाभ",
      eligibility: "पात्रता",
      officialScheme: "आधिकारिक योजना",
      compulsory: "अनिवार्य",
      voluntary: "स्वैच्छिक",
      loanee: "ऋणी",
      nonLoanee: "गैर-ऋणी",
      eligibilityDesc: "अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले सभी किसान कवरेज के लिए पात्र हैं।",
      applyNow: "अभी आवेदन करें",
      learnMore: "अधिक जानें",
      premium: "प्रीमियम",
      schemes: [
        { id: "pmfby", name: "PMFBY (मानक)", type: "उपज आधारित", desc: "प्राकृतिक आपदाओं के कारण होने वाले उपज नुकसान को कवर करता है।", premium: "2% खरीफ / 1.5% रबी", icon: Shield, color: "bg-blue-500" },
        { id: "rwbcis", name: "RWBCIS", type: "मौसम आधारित", desc: "प्रतिकूल मौसम स्थितियों से फसल के नुकसान को कवर करता है।", premium: "राज्य अनुसार", icon: CloudRain, color: "bg-indigo-500" },
        { id: "horticulture", name: "बागवानी", type: "वाणिज्यिक", desc: "उच्च मूल्य वाली बागवानी और वाणिज्यिक फसलों के लिए विशेष कवरेज।", premium: "5% निश्चित", icon: Sprout, color: "bg-green-500" }
      ],
      features: ["कम प्रीमियम दरें", "पूर्ण बीमा राशि", "स्मार्ट टेक दावे", "पूर्ण चक्र कवर"],
      detailedInfoTitle: "विस्तृत योजना जानकारी",
      coveredRisks: "कवर किए गए जोखिम",
      claimProcess: "दावा प्रक्रिया",
      contactSupport: "संपर्क और सहायता",
      detailedSchemes: [
        { name: "PMFBY (मानक)", risks: ["उपज हानि", "बुवाई जोखिम", "कटाई के बाद", "स्थानीय आपदा"], procedure: "72 घंटों में सूचना। 30 दिनों में भुगतान।", contact: "टोल फ्री: 1800-180-1551" },
        { name: "RWBCIS", risks: ["प्रतिकूल मौसम", "हवा और पाला", "बीमारी"], procedure: "स्वचालित मौसम केंद्र ट्रिगर।", contact: "टोल फ्री: 1800-200-5142" },
        { name: "बागवानी", risks: ["कुल हानि", "गुणवत्ता गिरावट", "विशिष्ट कीट"], procedure: "खेत स्तर का मूल्यांकन। फोटो प्रमाण आवश्यक।", contact: "टोल फ्री: 1800-425-7012" }
      ]
    },
    pa: {
      title: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ (PMFBY)",
      subtitle: "ਫਸਲ ਦੀ ਅਸਫਲਤਾ ਦੇ ਵਿਰੁੱਧ ਵਿਆਪਕ ਬੀਮਾ ਕਵਰੇਜ",
      description: "ਕਿਸਾਨਾਂ ਨੂੰ ਵਿੱਤੀ ਸਹਾਇਤਾ ਪ੍ਰਦਾਨ ਕਰਨ ਲਈ.",
      plansTitle: "ਉਪਲਬਧ ਬੀਮਾ ਯੋਜਨਾਵਾਂ",
      benefits: "ਮੁੱਖ ਲਾਭ",
      eligibility: "ਯੋਗਤਾ",
      officialScheme: "ਅਧਿਕਾਰਤ ਯੋਜਨਾ",
      compulsory: "ਲਾਜ਼ਮੀ",
      voluntary: "ਸਵੈਇੱਛੁਕ",
      loanee: "ਕਰਜ਼ਦਾਰ",
      nonLoanee: "ਗੈਰ-ਕਰਜ਼ਦਾਰ",
      eligibilityDesc: "ਸਾਰੇ ਕਿਸਾਨ ਯੋਗ ਹਨ।",
      applyNow: "ਹੁਣੇ ਅਪਲਾਈ ਕਰੋ",
      learnMore: "ਹੋਰ ਜਾਣੋ",
      premium: "ਪ੍ਰੀਮੀਅਮ",
      schemes: [
        { id: "pmfby", name: "PMFBY (ਮਿਆਰੀ)", type: "ਉਪਜ ਅਧਾਰਤ", desc: "ਉਪਜ ਦੇ ਨੁਕਸਾਨ ਨੂੰ ਕਵਰ ਕਰਦਾ ਹੈ।", premium: "2% ਖਰੀਫ / 1.5% ਹਾੜੀ", icon: Shield, color: "bg-blue-500" },
        { id: "rwbcis", name: "RWBCIS", type: "ਮੌਸਮ ਅਧਾਰਤ", desc: "ਮੌਸਮ ਕਾਰਨ ਹੋਏ ਨੁਕਸਾਨ ਨੂੰ ਕਵਰ ਕਰਦਾ ਹੈ।", premium: "ਰਾਜ ਅਨੁਸਾਰ", icon: CloudRain, color: "bg-indigo-500" },
        { id: "horticulture", name: "ਬਾਗਬਾਨੀ", type: "ਵਪਾਰਕ", desc: "ਵਪਾਰਕ ਫਸਲਾਂ ਲਈ ਵਿਸ਼ੇਸ਼ ਕਵਰੇਜ।", premium: "5% ਫਿਕਸਡ", icon: Sprout, color: "bg-green-500" }
      ],
      features: ["ਘੱਟ ਪ੍ਰੀਮੀਅਮ", "ਪੂਰਾ ਬੀਮਾ", "ਤੇਜ਼ ਦਾਅਵੇ", "ਪੂਰਾ ਚੱਕਰ ਕਵਰ"],
      detailedInfoTitle: "ਵਿਸਤ੍ਰਿਤ ਯੋਜਨਾ ਜਾਣਕਾਰੀ",
      coveredRisks: "ਕਵਰ ਕੀਤੇ ਜੋਖਮ",
      claimProcess: "ਦਾਅਵੇ ਦੀ ਪ੍ਰਕਿਰਿਆ",
      contactSupport: "ਸੰਪਰਕ ਅਤੇ ਸਹਾਇਤਾ",
      detailedSchemes: [
        { name: "PMFBY (ਮਿਆਰੀ)", risks: ["ਉਪਜ ਦਾ ਨੁਕਸਾਨ", "ਬਿਜਾਈ ਜੋਖਮ"], procedure: "72 ਘੰਟਿਆਂ ਵਿੱਚ ਸੂਚਨਾ।", contact: "ਟੋਲ ਫ੍ਰੀ: 1800-180-1551" },
        { name: "RWBCIS", risks: ["ਮਾੜਾ ਮੌਸਮ"], procedure: "ਆਟੋਮੈਟਿਕ ਟ੍ਰਿਗਰ।", contact: "ਟੋਲ ਫ੍ਰੀ: 1800-200-5142" },
        { name: "ਬਾਗਬਾਨੀ", risks: ["ਕੁੱಲ್ ਨੁਕਸਾਨ"], procedure: "ਫੋਟો ਸਬੂਤ ਲੋੜੀਂਦਾ ਹੈ।", contact: "ਟੋਲ ਫ੍ਰੀ: 1800-425-7012" }
      ]
    },
    mr: {
      title: "प्रधानमंत्री फसल विमा योजना (PMFBY)",
      subtitle: "पीक अपयशाविरुद्ध व्यापक विमा संरक्षण",
      description: "शेतकऱ्यांना आर्थिक मदत देण्यासाठी।",
      plansTitle: "उपलब्ध विमा योजना",
      benefits: "प्रमुख फायदे",
      eligibility: "पात्रता",
      officialScheme: "अधिकृत योजना",
      compulsory: "अनिवार्य",
      voluntary: "स्वैच्छिक",
      loanee: "कर्जदार",
      nonLoanee: "बिगर कर्जदार",
      eligibilityDesc: "सर्व शेतकरी पात्र आहेत।",
      applyNow: "आता अर्ज करा",
      learnMore: "अधिक जाणून घ्या",
      premium: "प्रीमियम",
      schemes: [
        { id: "pmfby", name: "PMFBY (मानक)", type: "उत्पन्न आधारित", desc: "उत्पन्नाचे नुकसान कव्हर करते।", premium: "2% खरीप / 1.5% रब्बी", icon: Shield, color: "bg-blue-500" },
        { id: "rwbcis", name: "RWBCIS", type: "हवामान आधारित", desc: "हवामानामुळे होणारे नुकसान कव्हर करते।", premium: "राज्यानुसार", icon: CloudRain, color: "bg-indigo-500" },
        { id: "horticulture", name: "बागवानी", type: "व्यावसायिक", desc: "व्यावसायिक पिकांसाठी विशेष कव्हरेज।", premium: "5% निश्चित", icon: Sprout, color: "bg-green-500" }
      ],
      features: ["कमी प्रीमियम", "पूर्ण विमा", "स्मार्ट दावे", "पूर्ण चक्र कव्वर"],
      detailedInfoTitle: "तपशीलवार योजना माहिती",
      coveredRisks: "जोखीम आणि फायदे",
      claimProcess: "दावा प्रक्रिया",
      contactSupport: "संपर्क आणि समर्थन",
      detailedSchemes: [
        { name: "PMFBY (मानक)", risks: ["उत्पन्न घट", "पेरणी जोखीम"], procedure: "72 तासांत कळवा।", contact: "टोल फ्री: 1800-180-1551" },
        { name: "RWBCIS", risks: ["प्रतिकूल हवामान"], procedure: "स्वयंचलित ट्रिगर।", contact: "टोल फ्री: 1800-200-5142" },
        { name: "बागवानी", risks: ["एकूण नुकसान"], procedure: "फोटो पुरावा आवश्यक।", contact: "टोल फ्री: 1800-425-7012" }
      ]
    },
    bn: {
      title: "প্রধানমন্ত্রী ফসল বিমা যোজনা (PMFBY)",
      subtitle: "ফসল নষ্ট হওয়ার বিরুদ্ধে ব্যাপক বিমা কভারেজ",
      description: "কৃষকদের আর্থিক সহায়তা প্রদানের জন্য।",
      plansTitle: "উপলব্ধ বিমা স্কিম",
      benefits: "মূল সুবিধা",
      eligibility: "যোগ্যতা",
      officialScheme: "অফিসিয়াল স্কিম",
      compulsory: "বাধ্যতামূলক",
      voluntary: "স্বেচ্ছায়",
      loanee: "ঋণগ্রহীতা",
      nonLoanee: "অ-ঋণগ্রহীতা",
      eligibilityDesc: "সব কৃষক যোগ্য।",
      applyNow: "এখনই আবেদন করুন",
      learnMore: "আরও জানুন",
      premium: "প্রিমিয়াম",
      schemes: [
        { id: "pmfby", name: "PMFBY (মানক)", type: "ফলন ভিত্তিক", desc: "ফলনের ক্ষতি কভার করে।", premium: "২% খরিফ / ১.৫% রবি", icon: Shield, color: "bg-blue-500" },
        { id: "rwbcis", name: "RWBCIS", type: "আবহাওয়া ভিত্তিক", desc: "আবহাওয়ার কারণে ক্ষতি কভার করে।", premium: "রাজ্য অনুযায়ী", icon: CloudRain, color: "bg-indigo-500" },
        { id: "horticulture", name: "উদ্যানপালন", type: "বাণিজ্যিক", desc: "বাণিজ্যিক ফসলের জন্য বিশেষ কভারেজ।", premium: "৫% নির্দিষ্ট", icon: Sprout, color: "bg-green-500" }
      ],
      features: ["কম প্রিমিয়াম", "পূর্ণ বিমা", "স্মার্ট দাবি", "পূর্ণ চক্র কভার"],
      detailedInfoTitle: "বিস্তারিত পরিকল্পনা তথ্য",
      coveredRisks: "আচ্ছাদিত ঝুঁকি",
      claimProcess: "দাবি প্রক্রিয়া",
      contactSupport: "যোগাযোগ ও সহায়তা",
      detailedSchemes: [
        { name: "PMFBY (মানক)", risks: ["ফলন হ্রাস", "বপন ঝুঁকি"], procedure: "৭২ ঘণ্টার মধ্যে জানান।", contact: "টোল ফ্রি: ১৮০০-১৮০-১৫৫১" },
        { name: "RWBCIS", risks: ["প্রতিকূল আবহাওয়া"], procedure: "স্বয়ংক্রিয় ট্রিগার।", contact: "টোল ফ্রি: ১৮০০-২০০-৫১৪২" },
        { name: "উদ্যানপালন", risks: ["মোট ক্ষতি"], procedure: "ফটোগ্রাফিক প্রমাণ প্রয়োজন।", contact: "টোল ফ্রি: ১৮০০-৪২৫-৭০১২" }
      ]
    },
    gu: {
      title: "પ્રધાનમંત્રી ફસલ બીમા યોજના (PMFBY)",
      subtitle: "પાક નિષ્ફળતા સામે વ્યાપક વીમા કવચ",
      description: "ખેડૂતોને આર્થિક સહાય પૂરી પાડવા માટે.",
      plansTitle: "ઉપલબ્ધ વીમા યોજનાઓ",
      benefits: "મુખ્ય લાભો",
      eligibility: "પાત્રતા",
      officialScheme: "સત્તાવાર યોજના",
      compulsory: "ફરજિયાત",
      voluntary: "સ્વૈચ્છિક",
      loanee: "ધિરાણદાર",
      nonLoanee: "બિન-ધિરાણદાર",
      eligibilityDesc: "તમામ ખેડૂતો પાત્ર છે.",
      applyNow: "હવે અરજી કરો",
      learnMore: "વધારે જાણો",
      premium: "પ્રીમિયમ",
      schemes: [
        { id: "pmfby", name: "PMFBY (માનક)", type: "ઉપજ આધારિત", desc: "ઉપજ નુકસાનને આવરી લે છે.", premium: "2% ખરીફ / 1.5% રવી", icon: Shield, color: "bg-blue-500" },
        { id: "rwbcis", name: "RWBCIS", type: "હવામાન આધારિત", desc: "હવામાનને કારણે થતા નુકસાનને આવરી લે છે.", premium: "રાજ્ય મુજબ", icon: CloudRain, color: "bg-indigo-500" },
        { id: "horticulture", name: "બાગાયત", type: "વાણિજ્યિક", desc: "વાણિજ્યિક પાકો માટે વિશેષ કવરેજ.", premium: "5% નિશ્ચિત", icon: Sprout, color: "bg-green-500" }
      ],
      features: ["ઓછું પ્રીમિયમ", "પૂર્ણ વીમો", "સ્માર્ટ દાવા", "પૂર્ણ ચક્ર કવર"],
      detailedInfoTitle: "વિગતવાર યોજના માહિતી",
      coveredRisks: "આવરી લીધેલ જોખમો",
      claimProcess: "દાવો પ્રક્રિયા",
      contactSupport: "સંપર્ક અને સપોર્ટ",
      detailedSchemes: [
        { name: "PMFBY (માનક)", risks: ["ઉપજ નુકસાન", "વાવણી જોખમ"], procedure: "72 કલાકમાં જાણ કરો.", contact: "ટોલ ફ્રી: 1800-180-1551" },
        { name: "RWBCIS", risks: ["પ્રતિકૂળ હવામાન"], procedure: "ઓટોમેટિક ટ્રિગર.", contact: "ટોલ ફ્રી: 1800-200-5142" },
        { name: "બાગાયત", risks: ["કુલ નુકસાન"], procedure: "ફોટો પુરાવો જરૂરી.", contact: "ટોલ ફ્રી: 1800-425-7012" }
      ]
    },
    ta: {
      title: "பிரதான் மந்திரி பயிர் காப்பீட்டுத் திட்டம் (PMFBY)",
      subtitle: "பயிர் இழப்பிற்கு எதிரான விரிவான காப்பீடு",
      description: "விவசாயிகளுக்கு நிதி உதவி வழங்க.",
      plansTitle: "கிடைக்கக்கூடிய காப்பீட்டுத் திட்டங்கள்",
      benefits: "முக்கிய நன்மைகள்",
      eligibility: "தகுதி",
      officialScheme: "அதிகாரப்பூர்வ திட்டம்",
      compulsory: "கட்டாயம்",
      voluntary: "விருப்பம்",
      loanee: "கடன் பெற்றவர்",
      nonLoanee: "கடன் பெறாதவர்",
      eligibilityDesc: "அனைத்து விவசாயிகளும் தகுதியுடையவர்கள்.",
      applyNow: "இப்போதே விண்ணப்பிக்கவும்",
      learnMore: "மேலும் அறிய",
      premium: "பிரீமியம்",
      schemes: [
        { id: "pmfby", name: "PMFBY (நிலையானது)", type: "மகசூல் அடிப்படை", desc: "மகசூல் இழப்பை ஈடுசெய்கிறது.", premium: "2% காரிஃப் / 1.5% ரபி", icon: Shield, color: "bg-blue-500" },
        { id: "rwbcis", name: "RWBCIS", type: "வானிலை அடிப்படை", desc: "வானிலையால் ஏற்படும் இழப்பை ஈடுசெய்கிறது.", premium: "மாநிலத்திற்கு மாறுபடும்", icon: CloudRain, color: "bg-indigo-500" },
        { id: "horticulture", name: "தோட்டக்கலை", type: "வணிக ரீதியானது", desc: "வணிகப் பயிர்களுக்கான சிறப்பு காப்பீடு.", premium: "5% நிலையானது", icon: Sprout, color: "bg-green-500" }
      ],
      features: ["குறைந்த பிரீமியம்", "முழு காப்பீடு", "வேகமான தீர்வு", "முழு சுழற்சி கவர்"],
      detailedInfoTitle: "விரிவான திட்டத் தகவல்",
      coveredRisks: "ஈடுசெய்யப்படும் அபாயங்கள்",
      claimProcess: "உரிமைகோருதல் நடைமுறை",
      contactSupport: "தொடர்பு மற்றும் ஆதரவு",
      detailedSchemes: [
        { name: "PMFBY (நிலையானது)", risks: ["மகசூல் இழப்பு", "விதைப்பு அபாயம்"], procedure: "72 மணி நேரத்திற்குள் தெரிவிக்கவும்.", contact: "கட்டணமில்லா எண்: 1800-180-1551" },
        { name: "RWBCIS", risks: ["பாதகமான வானிலை"], procedure: "தானியங்கி வானிலை நிலைய தூண்டுதல்.", contact: "கட்டணமில்லா எண்: 1800-200-5142" },
        { name: "தோட்டக்கலை", risks: ["முழுமையான இழப்பு"], procedure: "புகைப்படச் சான்று தேவை.", contact: "கட்டணமில்லா எண்: 1800-425-7012" }
      ]
    },
    te: {
      title: "ప్రధాన మంత్రి ఫసల్ బీమా యోజన (PMFBY)",
      subtitle: "పంట నష్టానికి వ్యతిరేకంగా సమగ్ర భీమా కవరేజ్",
      description: "రైతులకు ఆర్థిక సహాయం అందించడానికి.",
      plansTitle: "అందుబాటులో ఉన్న భీమా పథకాలు",
      benefits: "కీలక ప్రయోజనాలు",
      eligibility: "అర్హత",
      officialScheme: "అధికారిక పథకం",
      compulsory: "తప్పనిసరి",
      voluntary: "స్వచ్ఛందం",
      loanee: "రుణగ్రహీత",
      nonLoanee: "రుణం లేని వారు",
      eligibilityDesc: "రైతులందరూ అర్హులే.",
      applyNow: "ఇప్పుడే దరఖాస్తు చేసుకోండి",
      learnMore: "మరింత తెలుసుకోండి",
      premium: "ప్రీమియం",
      schemes: [
        { id: "pmfby", name: "PMFBY (ప్రామాణికం)", type: "దిగుబడి ఆధారిత", desc: "దిగుబడి నష్టాన్ని కవర్ చేస్తుంది.", premium: "2% ఖరీఫ్ / 1.5% రబీ", icon: Shield, color: "bg-blue-500" },
        { id: "rwbcis", name: "RWBCIS", type: "వాతావరణ ఆధారిత", desc: "వాతావరణం వల్ల కలిగే నష్టాలను కవర్ చేస్తుంది.", premium: "రాష్ట్రం బట్టి మారుతుంది", icon: CloudRain, color: "bg-indigo-500" },
        { id: "horticulture", name: "ఉద్యానవన పంటలు", type: "వాణిజ్య", desc: "వాణిజ్య పంటలకు ప్రత్యేక కవరేజ్.", premium: "5% స్థిరంగా", icon: Sprout, color: "bg-green-500" }
      ],
      features: ["తక్కువ ప్రీమియం", "పూర్తి భీమా", "వేగవంతమైన క్లెయిమ్స్", "పూర్తి చక్రం కవర్"],
      detailedInfoTitle: "వివరణాత్మక పథక సమాచారం",
      coveredRisks: "కవర్ చేసే నష్టాలు",
      claimProcess: "క్లెయిమ్ ప్రాసెసింగ్ విధానం",
      contactSupport: "సంప్రదించండి & మద్దతు",
      detailedSchemes: [
        { name: "PMFBY (ప్రామాణికం)", risks: ["దిగుబడి నష్టం", "విత్తే సమయంలో నష్టం"], procedure: "72 గంటల్లో సమాచారం ఇవ్వాలి.", contact: "టోల్ ఫ్రీ: 1800-180-1551" },
        { name: "RWBCIS", risks: ["ప్రతికూల వాతావరణం"], procedure: "వాతావరణ కేంద్రం ఆధారితం.", contact: "టోల్ ఫ్రీ: 1800-200-5142" },
        { name: "ఉద్యానవన పంటలు", risks: ["పూర్తి నష్టం"], procedure: "ఫోటో ఆధారాలు అవసరం.", contact: "టోల్ ఫ్రీ: 1800-425-7012" }
      ]
    },
    kn: {
      title: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (PMFBY)",
      subtitle: "ಬೆಳೆ ವೈಫಲ್ಯದ ವಿರುದ್ಧ ಸಮಗ್ರ ವಿಮಾ ರಕ್ಷಣೆ",
      description: "ರೈತರಿಗೆ ಆರ್ಥಿಕ ನೆರವು ನೀಡಲು.",
      plansTitle: "ಲಭ್ಯವಿರುವ ವಿಮಾ ಯೋಜನೆಗಳು",
      benefits: "ಪ್ರಮುಖ ಪ್ರಯೋಜನಗಳು",
      eligibility: "ಅರ್ಹತೆ",
      officialScheme: "ಅಧಿಕೃತ ಯೋಜನೆ",
      compulsory: "ಕಡ್ಡಾಯ",
      voluntary: "ಸ್ವಯಂಪ್ರೇರಿತ",
      loanee: "ಸಾಲಗಾರರು",
      nonLoanee: "ಸಾಲೇತರರು",
      eligibilityDesc: "ಎಲ್ಲಾ ರೈತರು ಅರ್ಹರು.",
      applyNow: "ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
      learnMore: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
      premium: "ಪ್ರೀಮಿಯಂ",
      schemes: [
        { id: "pmfby", name: "PMFBY (ಪ್ರಮಾಣಿತ)", type: "ಇಳುವರಿ ಆಧಾರಿತ", desc: "ಇಳುವರಿ ನಷ್ಟವನ್ನು ಸರಿದೂಗಿಸುತ್ತದೆ.", premium: "2% ಖಾರೀಫ್ / 1.5% ರಬಿ", icon: Shield, color: "bg-blue-500" },
        { id: "rwbcis", name: "RWBCIS", type: "ಹವಾಮಾನ ಆಧಾರಿತ", desc: "ಹವಾಮಾನ ನಷ್ಟವನ್ನು ಸರಿದೂಗಿಸುತ್ತದೆ.", premium: "ರಾಜ್ಯದಂತೆ ಬದಲಾಗುತ್ತದೆ", icon: CloudRain, color: "bg-indigo-500" },
        { id: "horticulture", name: "ತೋಟಗಾರಿಕೆ", type: "ವಾಣಿಜ್ಯ", desc: "ವಾಣಿಜ್ಯ ಬೆಳೆಗಳಿಗೆ ವಿಶೇಷ ವಿಮೆ.", premium: "5% ಸ್ಥಿರ", icon: Sprout, color: "bg-green-500" }
      ],
      features: ["ಕಡಿಮೆ ಪ್ರೀಮಿಯಂ", "ಪೂರ್ಣ ವಿಮೆ", "ಸ್ಮಾರ್ಟ್ ಹಕ್ಕುಗಳು", "ಪೂರ್ಣ ಚಕ್ರ ಕವರ್"],
      detailedInfoTitle: "ವಿವರವಾದ ಯೋಜನೆ ಮಾಹಿತಿ",
      coveredRisks: "ಒಳಪಡುವ ಅಪಾಯಗಳು",
      claimProcess: "ಹಕ್ಕು ಪ್ರಕ್ರಿಯೆಯ ವಿಧಾನ",
      contactSupport: "ಸಂಪರ್ಕ ಮತ್ತು ಬೆಂಬಲ",
      detailedSchemes: [
        { name: "PMFBY (ಪ್ರಮಾಣಿತ)", risks: ["ಇಳುವರಿ ನಷ್ಟ", "ಬಿತ್ತನೆ ಅಪಾಯ"], procedure: "72 ಗಂಟೆಗಳ ಒಳಗೆ ತಿಳಿಸಿ.", contact: "ಟೋಲ್ ಫ್ರೀ: 1800-180-1551" },
        { name: "RWBCIS", risks: ["ಪ್ರತಿಕೂಲ ಹವಾಮಾನ"], procedure: "ಸ್ವಯಂಚಾಲಿತ ಹವಾಮಾನ ಕೇಂದ್ರ ಪ್ರಚೋದಕ.", contact: "ಟೋಲ್ ಫ್ರೀ: 1800-200-5142" },
        { name: "ತೋಟಗಾರಿಕೆ", risks: ["ಸಂಪೂರ್ಣ ನಷ್ಟ"], procedure: "ಫೋಟೋ ದಾಖಲೆ ಅಗತ್ಯ.", contact: "ಟೋಲ್ ಫ್ರೀ: 1800-425-7012" }
      ]
    },
    ml: {
      title: "പ്രധാൻ മന്ത്രി ഫസൽ ബീമ യോജന (PMFBY)",
      subtitle: "വിളനാശത്തിനെതിരെ സമഗ്ര ഇൻഷുറൻസ് പരിരക്ഷ",
      description: "കർഷകർക്ക് സാമ്പത്തിക സഹായം നൽകാൻ.",
      plansTitle: "ലഭ്യമായ ഇൻഷുറൻസ് പദ്ധതികൾ",
      benefits: "പ്രധാന ആനുകൂല്യങ്ങൾ",
      eligibility: "യോഗ്യത",
      officialScheme: "ഔദ്യോഗിക പദ്ധതി",
      compulsory: "നിർബന്ധിതം",
      voluntary: "സ്വമേധയാ",
      loanee: "വായ്പയെടുത്തവർ",
      nonLoanee: "വായ്പയെടുക്കാത്തവർ",
      eligibilityDesc: "എല്ലാ കർഷകർക്കും അർහതയുണ്ട്.",
      applyNow: "ഇപ്പോൾ അപേക്ഷിക്കുക",
      learnMore: "കൂടുതൽ അറിയുക",
      premium: "പ്രീമിയം",
      schemes: [
        { id: "pmfby", name: "PMFBY (സ്റ്റാൻഡേർഡ്)", type: "ഉൽപ്പാദന അടിസ്ഥാനം", desc: "വിളനാശം പരിരക്ഷിക്കുന്നു.", premium: "2% ഖാരിഫ് / 1.5% റാബി", icon: Shield, color: "bg-blue-500" },
        { id: "rwbcis", name: "RWBCIS", type: "കാലാവസ്ഥാ അടിസ്ഥാനം", desc: "കാലാവസ്ഥ മൂലമുള്ള നഷ്ടം പരിരക്ഷിക്കുന്നു.", premium: "സംസ്ഥാനം അനുസരിച്ച്", icon: CloudRain, color: "bg-indigo-500" },
        { id: "horticulture", name: "ഹോർട്ടികൾച്ചർ", type: "വാണിജ്യം", desc: "വാണിಜ್ಯ വിളകൾക്കുള്ള പ്രത്യേക പരിരക്ഷ.", premium: "5% നിശ്ചിതം", icon: Sprout, color: "bg-green-500" }
      ],
      features: ["കുറഞ്ഞ പ്രീಮിയം", "പൂർണ്ണ പരിരക്ഷ", "സ്മാർട്ട് ക്ലെയിമുകൾ", "സമ്പൂർണ്ണ സൈക്കിൾ കവർ"],
      detailedInfoTitle: "വിശദമായ പ്ലാൻ വിവരങ്ങൾ",
      coveredRisks: "പരിരക്ഷിക്കപ്പെടുന്ന അപകടങ്ങൾ",
      claimProcess: "ക്ലെയിം നടപടിക്രമം",
      contactSupport: "ബന്ധപ്പെടുക & പിന്തുണ",
      detailedSchemes: [
        { name: "PMFBY (സ്റ്റാൻഡേർഡ്)", risks: ["വിളനഷ്ടം", "വിതയ്ക്കൽ അപകടം"], procedure: "72 മണിക്കൂറിനുള്ളിൽ അറിയിക്കുക.", contact: "ടോൾ ഫ്രീ: 1800-180-1551" },
        { name: "RWBCIS", risks: ["പ്രതികൂല കാലാവസ്ഥ"], procedure: "കാലാവസ്ഥാ സ്റ്റേഷൻ അധിഷ്ഠിതം.", contact: "ടೋಲ್ ಫ្រី: 1800-200-5142" },
        { name: "ಹോർട്ടികൾച്ചർ", risks: ["പൂർണ്ണനഷ്ടം"], procedure: "ഫോട്ടോ തെളിവ് ആവശ്യമാണ്.", contact: "ടೋಲ್ ಫ്രീ: 1800-425-7012" }
      ]
    }
  };

  const content = t[language] || t['en'];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 p-8 md:p-12 rounded-3xl border border-primary/10">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-6">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
              {content.officialScheme}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              {content.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {content.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full px-8" onClick={handleApplyNow}>
                {content.applyNow} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8" onClick={scrollToDetails}>
                {content.learnMore}
              </Button>
            </div>
          </div>
          <div className="flex-shrink-0 hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-background p-6 rounded-2xl shadow-2xl border border-primary/10">
                <Landmark className="h-32 w-32 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schemes Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">{content.plansTitle}</h2>
          <p className="text-muted-foreground">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.schemes.map((scheme: any, index: number) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-primary/10 group">
                <CardHeader>
                  <div className={`h-12 w-12 rounded-xl ${scheme.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <scheme.icon className="h-6 w-6" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{scheme.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{scheme.type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {scheme.desc}
                  </p>
                  <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{content.premium}</span>
                    <span className="text-sm font-bold text-primary">{scheme.premium}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5" onClick={scrollToDetails}>
                    {content.learnMore} <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features & Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Card className="border-primary/10 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              {content.benefits}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.features.map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-6 w-6 text-blue-500" />
              {content.eligibility}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {content.eligibilityDesc}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted text-center space-y-1">
                <span className="text-xs text-muted-foreground uppercase">{content.loanee}</span>
                <p className="font-bold">{content.compulsory}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted text-center space-y-1">
                <span className="text-xs text-muted-foreground uppercase">{content.nonLoanee}</span>
                <p className="font-bold">{content.voluntary}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Plan Information */}
      <section className="space-y-8 pt-8" ref={detailedRef}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-primary rounded-full"></div>
          <h2 className="text-3xl font-bold">{content.detailedInfoTitle}</h2>
        </div>

        <div className="space-y-6">
          {content.detailedSchemes.map((scheme: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-primary/10 overflow-hidden">
                <div className="bg-primary/5 px-6 py-4 border-b border-primary/10">
                  <h3 className="text-xl font-bold text-primary">{scheme.name}</h3>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-muted-foreground">
                        <Shield className="h-4 w-4 text-primary" />
                        {content.coveredRisks}
                      </div>
                      <ul className="space-y-2">
                        {scheme.risks.map((risk: string, rIdx: number) => (
                          <li key={rIdx} className="text-sm flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-muted-foreground">
                        <RefreshCw className="h-4 w-4 text-primary" />
                        {content.claimProcess}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {scheme.procedure}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-muted-foreground">
                        <Phone className="h-4 w-4 text-primary" />
                        {content.contactSupport}
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50 border border-border">
                        <p className="text-sm font-medium">
                          {scheme.contact}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};