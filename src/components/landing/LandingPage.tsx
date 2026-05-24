import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Variants } from 'motion/react';
import {
  Sprout,
  Brain,
  ShieldCheck,
  Play,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Droplet,
  Wheat,
  Flower2,
  Leaf,
  CloudRain,
  Users,
  HelpCircle,
  Calculator,
  Bot,
  Loader2,
  ArrowUpRight,
  Stethoscope,
  BadgeIndianRupee,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LanguageCode } from '@/src/lib/languages';

interface LandingPageProps {
  language: LanguageCode;
  setActiveTab: (tab: string) => void;
}

type DemoKey = 'healthy' | 'blight' | 'rust';

type PremiumState = 'maharashtra' | 'karnataka' | 'punjab' | 'rajasthan';
type PremiumCrop = 'rice' | 'wheat' | 'maize' | 'cotton';

export const LandingPage: React.FC<LandingPageProps> = ({ language, setActiveTab }) => {
  const [selectedDemo, setSelectedDemo] = useState<DemoKey>('healthy');
  const [scanPhase, setScanPhase] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [premiumState, setPremiumState] = useState<PremiumState>('maharashtra');
  const [premiumCrop, setPremiumCrop] = useState<PremiumCrop>('rice');
  const [hectares, setHectares] = useState(2.5);

  const t: Record<string, any> = {
    en: {
      badge: 'Government-backed crop intelligence',
      heroTitle: 'AgriLens turns field photos into action.',
      heroDesc: 'Detect crop damage, estimate PMFBY coverage, and guide farmers from one polished, mobile-ready experience.',
      heroSub: 'AI diagnostics, insurance estimates, and local-language support in one flow.',
      ctaPrimary: 'Register Now',
      ctaSecondary: 'Sign In',
      ctaDemo: 'Try Live Demo',
      trust: ['CNN leaf scan', 'PMFBY premium estimator', 'Bilingual support'],
      stats: {
        accuracy: '98.5% AI accuracy',
        claims: 'PMFBY-ready reports',
        farmers: 'Built for rural farmers',
        speed: '2 second scan mode',
      },
      demo: {
        title: 'Interactive AI diagnostic emulator',
        desc: 'Pick a sample leaf and watch the scanner reveal crop condition, pathology flags, and claim guidance.',
        healthy: 'Healthy Rice',
        blight: 'Bacterial Blight',
        rust: 'Yellow Rust',
        scanning: 'CNN scan in progress...',
        healthyReport: {
          crop: 'Rice',
          status: 'Healthy canopy, strong chlorophyll response, and no pathogen trace detected.',
          advice: 'Continue irrigation and routine nutrient management. No fungicide required.',
          claim: 'PMFBY claim estimate: not eligible, no measurable loss detected.',
          label: 'Healthy / Stable',
        },
        blightReport: {
          crop: 'Rice',
          status: 'Pathology flags show bacterial blight with rapid leaf edge necrosis.',
          advice: 'Spray Streptocycline + Copper Oxychloride and improve field drainage immediately.',
          claim: 'PMFBY claim estimate: eligible with high-loss documentation support.',
          label: 'Severe / Claim Support',
        },
        rustReport: {
          crop: 'Wheat',
          status: 'Spore-like streaking and chlorotic bands point to yellow rust development.',
          advice: 'Apply Propiconazole 25 EC and avoid excess irrigation during the next 72 hours.',
          claim: 'PMFBY claim estimate: moderate-loss documentation likely eligible.',
          label: 'Moderate / Monitor',
        },
      },
      premium: {
        title: 'Subsidized PMFBY premium calculator',
        desc: 'Estimate sum insured, government subsidy, and farmer payable premium from state, crop, and cultivated area.',
        crop: 'Crop',
        state: 'State',
        area: 'Area (hectares)',
        results: 'Coverage estimate',
        sumInsured: 'Crop sum insured',
        subsidy: 'Government subsidy share (98%)',
        farmer: 'Farmer payable premium (2.0%)',
        disclaimer: 'Indicative estimates only. Final figures depend on scheme rules and notified rates.',
      },
      features: {
        title: 'Built for Indian agriculture',
        subtitle: 'A bento-grid of diagnostics, insurance support, and communication tools designed for practical farm workflows.',
        list: [
          { title: 'Optical deep diagnostics', desc: 'Single-image disease recognition for rice, wheat, maize, and cotton.', icon: Brain },
          { title: 'PMFBY-ready reports', desc: 'Export shareable summaries with claim-oriented guidance and estimates.', icon: ShieldCheck },
          { title: 'Local-language assistance', desc: 'Bilingual interface designed for quick switching between English and Hindi.', icon: Bot },
          { title: 'Climate-aware planning', desc: 'Keep an eye on crop stress with a compact, decision-friendly workflow.', icon: CloudRain },
        ],
      },
      testimonials: {
        title: 'Voices from the field',
        subtitle: 'Real-world style stories that show why fast diagnostics matter.',
        items: [
          {
            quote: 'The report helped me document the damage fast enough for the PMFBY surveyor to approve my claim.',
            name: 'Ramachandra Gowda',
            place: 'Mandya, Karnataka',
          },
          {
            quote: 'The rust guidance saved my wheat crop and stopped me from buying the wrong chemical mix.',
            name: 'Harpreet Singh',
            place: 'Bhatinda, Punjab',
          },
        ],
      },
      faqs: {
        title: 'Frequently asked questions',
        items: [
          { q: 'How does the AI scan work?', a: 'The emulator mimics a CNN-based leaf scan. In the real app, crop images are analyzed to surface disease clues and treatment steps.' },
          { q: 'Is the premium calculator realistic?', a: 'It uses state, crop, and area inputs to produce a PMFBY-style estimate. The result is indicative, not a legal quote.' },
          { q: 'Can I switch languages later?', a: 'Yes. The full experience supports English and Hindi, and the copy updates instantly when the language changes.' },
        ],
      },
    },
    hi: {
      badge: 'सरकारी सहायता प्राप्त फसल बुद्धिमत्ता',
      heroTitle: 'AgriLens खेत की तस्वीरों को तुरंत कार्रवाई में बदलता है।',
      heroDesc: 'एक ही मोबाइल-रेडी अनुभव में फसल क्षति पहचानें, पीएमएफबीवाई कवरेज का अनुमान लगाएं, और किसानों को सही दिशा दें।',
      heroSub: 'एआई निदान, बीमा अनुमान और स्थानीय भाषा समर्थन एक साथ।',
      ctaPrimary: 'अभी पंजीकरण करें',
      ctaSecondary: 'साइन इन करें',
      ctaDemo: 'लाइव डेमो देखें',
      trust: ['सीएनएन पत्ती स्कैन', 'पीएमएफबीवाई प्रीमियम अनुमानक', 'द्विभाषी समर्थन'],
      stats: {
        accuracy: '98.5% एआई सटीकता',
        claims: 'पीएमएफबीवाई-तैयार रिपोर्ट',
        farmers: 'ग्रामीण किसानों के लिए बना',
        speed: '2 सेकंड स्कैन मोड',
      },
      demo: {
        title: 'इंटरैक्टिव एआई निदान एम्युलेटर',
        desc: 'एक नमूना पत्ती चुनें और स्कैनर को फसल की स्थिति, रोग संकेत, और दावा मार्गदर्शन दिखाते हुए देखें।',
        healthy: 'स्वस्थ धान',
        blight: 'जीवाणु झुलसा',
        rust: 'पीला रतुआ',
        scanning: 'सीएनएन स्कैन चल रहा है...',
        healthyReport: {
          crop: 'धान',
          status: 'स्वस्थ फसल, मजबूत क्लोरोफिल प्रतिक्रिया, और कोई रोग संकेत नहीं मिला।',
          advice: 'सिंचाई और पोषक प्रबंधन जारी रखें। किसी फफूंदनाशी की आवश्यकता नहीं।',
          claim: 'पीएमएफबीवाई दावा अनुमान: नुकसान नहीं, दावा योग्य नहीं।',
          label: 'स्वस्थ / स्थिर',
        },
        blightReport: {
          crop: 'धान',
          status: 'पत्ती के किनारों पर तेजी से सूखना जीवाणु झुलसा के संकेत दिखाता है।',
          advice: 'तुरंत स्ट्रेप्टोसाइक्लिन + कॉपर ऑक्सीक्लोराइड छिड़कें और जल निकासी सुधारें।',
          claim: 'पीएमएफबीवाई दावा अनुमान: उच्च-हानि दस्तावेज़ीकरण के साथ योग्य।',
          label: 'गंभीर / दावा समर्थन',
        },
        rustReport: {
          crop: 'गेहूं',
          status: 'धारदार पीले धब्बे और क्लोरोसिस पीले रतुआ की ओर संकेत करते हैं।',
          advice: 'प्रोपिकोनाज़ोल 25 EC का छिड़काव करें और अगले 72 घंटे अतिरिक्त सिंचाई से बचें।',
          claim: 'पीएमएफबीवाई दावा अनुमान: मध्यम नुकसान के साथ योग्य हो सकता है।',
          label: 'मध्यम / निगरानी',
        },
      },
      premium: {
        title: 'सब्सिडी वाला पीएमएफबीवाई प्रीमियम कैलकुलेटर',
        desc: 'राज्य, फसल और खेत के आकार के आधार पर बीमित राशि, सरकारी सब्सिडी और किसान-देय प्रीमियम का अनुमान लगाएं।',
        crop: 'फसल',
        state: 'राज्य',
        area: 'क्षेत्र (हेक्टेयर)',
        results: 'कवरेज अनुमान',
        sumInsured: 'कुल बीमित राशि',
        subsidy: 'सरकारी सब्सिडी हिस्सा (98%)',
        farmer: 'किसान-देय प्रीमियम (2.0%)',
        disclaimer: 'यह केवल अनुमान है। अंतिम आंकड़े योजना के नियम और अधिसूचित दरों पर निर्भर करते हैं।',
      },
      features: {
        title: 'भारतीय कृषि के लिए बनाया गया',
        subtitle: 'निदान, बीमा सहायता और संचार के लिए एक बेंटो-ग्रिड, जिसे खेती के वास्तविक काम के लिए बनाया गया है।',
        list: [
          { title: 'गहन ऑप्टिकल निदान', desc: 'धान, गेहूं, मक्का और कपास की एक तस्वीर से रोग पहचान।', icon: Brain },
          { title: 'पीएमएफबीवाई-तैयार रिपोर्ट', desc: 'दावा-उन्मुख मार्गदर्शन के साथ साझा करने योग्य रिपोर्ट निर्यात करें।', icon: ShieldCheck },
          { title: 'स्थानीय भाषा सहायता', desc: 'अंग्रेजी और हिंदी के बीच तुरंत स्विच करने वाला अनुभव।', icon: Bot },
          { title: 'मौसम-सचेत योजना', desc: 'एक साफ, निर्णय-मैत्रीपूर्ण कार्यप्रवाह के साथ फसल तनाव पर नजर रखें।', icon: CloudRain },
        ],
      },
      testimonials: {
        title: 'खेत से आवाजें',
        subtitle: 'तेज निदान के महत्व को दिखाने वाली कहानी-शैली की प्रतिक्रियाएं।',
        items: [
          {
            quote: 'रिपोर्ट ने नुकसान को इतनी जल्दी दर्ज करने में मदद की कि पीएमएफबीवाई सर्वेक्षक ने मेरा दावा मंजूर कर दिया।',
            name: 'रामचंद्र गौड़ा',
            place: 'मांड्या, कर्नाटक',
          },
          {
            quote: 'रतुआ की सही सलाह ने मेरी गेहूं की फसल बचा ली और गलत दवा खरीदने से भी रोका।',
            name: 'हरप्रीत सिंह',
            place: 'बठिंडा, पंजाब',
          },
        ],
      },
      faqs: {
        title: 'अक्सर पूछे जाने वाले प्रश्न',
        items: [
          { q: 'एआई स्कैन कैसे काम करता है?', a: 'यह एम्युलेटर सीएनएन-आधारित पत्ती स्कैन की नकल करता है। वास्तविक ऐप में फसल तस्वीरों से रोग संकेत और उपचार चरण निकाले जाते हैं।' },
          { q: 'क्या प्रीमियम कैलकुलेटर भरोसेमंद है?', a: 'यह राज्य, फसल और क्षेत्र के आधार पर पीएमएफबीवाई-शैली का अनुमान देता है। यह केवल सांकेतिक है, कानूनी उद्धरण नहीं।' },
          { q: 'क्या मैं बाद में भाषा बदल सकता हूं?', a: 'हाँ। अनुभव अंग्रेजी और हिंदी दोनों का समर्थन करता है, और भाषा बदलते ही पूरा पाठ तुरंत अपडेट हो जाता है।' },
        ],
      },
    },
  };

  const content = t[language] || t.en;

  const demoCards: Array<{ id: DemoKey; title: string; icon: React.ComponentType<{ className?: string }>; }>= [
    { id: 'healthy', title: content.demo.healthy, icon: Sprout },
    { id: 'blight', title: content.demo.blight, icon: Droplet },
    { id: 'rust', title: content.demo.rust, icon: Wheat },
  ];

  const demoResult = useMemo(() => {
    if (scanPhase !== 'done') return null;
    if (selectedDemo === 'healthy') return content.demo.healthyReport;
    if (selectedDemo === 'blight') return content.demo.blightReport;
    return content.demo.rustReport;
  }, [content, scanPhase, selectedDemo]);

  const premiumConfig: Record<PremiumCrop, { base: number; label: string }> = {
    rice: { base: 52000, label: language === 'hi' ? 'धान / चावल' : 'Rice / Paddy' },
    wheat: { base: 48000, label: language === 'hi' ? 'गेहूं' : 'Wheat' },
    maize: { base: 45000, label: language === 'hi' ? 'मक्का' : 'Maize' },
    cotton: { base: 65000, label: language === 'hi' ? 'कपास' : 'Cotton' },
  };

  const stateMultipliers: Record<PremiumState, number> = {
    maharashtra: 1,
    karnataka: 0.96,
    punjab: 1.08,
    rajasthan: 0.9,
  };

  const premiumResult = useMemo(() => {
    const sumInsured = Math.round(premiumConfig[premiumCrop].base * hectares * stateMultipliers[premiumState]);
    const grossPremium = Math.round(sumInsured * 0.1);
    const governmentSubsidy = Math.round(grossPremium * 0.98);
    const farmerPremium = Math.round(grossPremium * 0.02);

    return {
      sumInsured,
      grossPremium,
      governmentSubsidy,
      farmerPremium,
    };
  }, [hectares, premiumCrop, premiumState]);

  useEffect(() => {
    if (scanPhase !== 'scanning') return;

    const timer = window.setTimeout(() => setScanPhase('done'), 2000);
    return () => window.clearTimeout(timer);
  }, [scanPhase]);

  const startDemo = (demo: DemoKey) => {
    setSelectedDemo(demo);
    setScanPhase('scanning');
  };

  const sectionIn: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="overflow-hidden bg-[#f5f1e8] text-neutral-950 dark:bg-[#0c0c0c] dark:text-neutral-50">
      <section className="relative mx-auto max-w-7xl px-4 pt-10 pb-14 md:pt-16 lg:pb-20">
        <div className="absolute left-1/2 top-0 h-[480px] w-[1200px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute right-0 top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr]">
          <motion.div variants={sectionIn} initial="hidden" animate="show" className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              {content.badge}
            </div>

            <div className="space-y-5 max-w-3xl">
              <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                {content.heroTitle}
                <span className="mt-4 block max-w-2xl text-lg font-semibold leading-relaxed text-neutral-700 dark:text-neutral-300 md:text-xl">
                  {content.heroDesc}
                </span>
              </h1>
              <p className="max-w-2xl text-base font-medium leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
                {content.heroSub}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="h-14 rounded-full bg-emerald-600 px-8 font-black text-white shadow-lg shadow-emerald-600/25 transition-transform hover:bg-emerald-700 active:scale-[0.99]"
                onClick={() => setActiveTab('register')}
              >
                {content.ctaPrimary}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-neutral-300 px-8 font-black hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
                onClick={() => setActiveTab('signin')}
              >
                {content.ctaSecondary}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-14 rounded-full px-3 font-bold text-neutral-700 hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:bg-white/5"
                onClick={() => document.getElementById('landing-demo')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                {content.ctaDemo}
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              {content.trust.map((item: string) => (
                <Badge key={item} className="rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-[11px] font-bold text-neutral-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/70 dark:text-neutral-300">
                  {item}
                </Badge>
              ))}
            </div>

            <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: content.stats.accuracy, icon: Brain },
                { label: content.stats.claims, icon: ShieldCheck },
                { label: content.stats.farmers, icon: Users },
                { label: content.stats.speed, icon: BadgeIndianRupee },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.45 }}
                  className="h-full rounded-3xl border border-neutral-200 bg-white/85 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80"
                >
                  <div className="mb-3 inline-flex rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-black uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={sectionIn} initial="hidden" animate="show" transition={{ delay: 0.1 }} className="relative z-10">
            <Card className="overflow-hidden rounded-[32px] border-neutral-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] dark:border-neutral-800 dark:bg-neutral-950">
              <CardContent className="flex h-full flex-col space-y-6 p-6 md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Badge className="rounded-full bg-neutral-950 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-white dark:bg-white dark:text-neutral-950">
                      {content.demo.title}
                    </Badge>
                    <p className="mt-3 max-w-sm text-sm font-medium leading-relaxed text-neutral-600 dark:text-neutral-400">{content.demo.desc}</p>
                  </div>
                  <div className="hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-right md:block">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Scan mode</p>
                    <p className="text-xs font-bold text-neutral-700 dark:text-neutral-200">CNN + pathology flags</p>
                  </div>
                </div>

                <div className="grid items-stretch gap-3 sm:grid-cols-3">
                  {demoCards.map((item) => {
                    const active = selectedDemo === item.id && scanPhase !== 'idle';
                    return (
                      <button
                        key={item.id}
                        onClick={() => startDemo(item.id)}
                        className={`group flex h-full flex-col justify-between rounded-3xl border p-4 text-left transition-all ${active ? 'border-emerald-500 bg-emerald-500/10 shadow-md' : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/70'}`}
                      >
                        <div className={`mb-3 inline-flex rounded-2xl p-3 ${active ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'}`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-black text-neutral-900 dark:text-neutral-100">{item.title}</p>
                        <div className="mt-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                          <span>{active ? (language === 'hi' ? 'सक्रिय' : 'Active') : (language === 'hi' ? 'टैप करें' : 'Tap to scan')}</span>
                          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-[28px] border border-neutral-200 bg-neutral-950 p-4 text-white dark:border-neutral-800">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${scanPhase === 'scanning' ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
                      <span className="text-[10px] font-black uppercase tracking-[0.24em] text-neutral-400">AgriLens CNN</span>
                    </div>
                    <Badge className="rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-300">PMFBY ready</Badge>
                  </div>

                  <div className="relative mt-5 min-h-[350px] overflow-hidden rounded-[24px] bg-neutral-900/60 p-4">
                    <AnimatePresence mode="wait">
                      {scanPhase === 'idle' && (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex min-h-[310px] items-center justify-center text-center"
                        >
                          <div className="max-w-xs space-y-4">
                            <div className="mx-auto inline-flex rounded-3xl bg-emerald-500/10 p-4 text-emerald-400">
                              <Sprout className="h-8 w-8" />
                            </div>
                            <p className="text-sm font-semibold leading-relaxed text-neutral-300">
                              {language === 'hi'
                                ? 'एक पत्ती टेम्पलेट चुनें और स्कैनर को रोग संकेत, उपचार और दावा अनुमान दिखाते हुए देखें।'
                                : 'Select a leaf template to reveal pathology flags, treatment guidance, and claim estimates.'}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {scanPhase === 'scanning' && (
                        <motion.div
                          key="scanning"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-5"
                        >
                          <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-[28px] border border-emerald-500/40 bg-neutral-800">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_62%)]" />
                            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-40">
                              {Array.from({ length: 36 }).map((_, idx) => (
                                <div key={idx} className="border border-white/5" />
                              ))}
                            </div>
                            <motion.div
                              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_14px_rgba(52,211,153,0.9)]"
                              animate={{ top: ['0%', '100%', '0%'] }}
                              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-black text-emerald-400">{content.demo.scanning}</p>
                            <p className="mt-1 text-xs font-medium text-neutral-400">{language === 'hi' ? 'सूक्ष्म रोग पैटर्न और संभावित नुकसान प्रतिशत निकाले जा रहे हैं।' : 'Microscopic disease patterns and damage estimates are being extracted.'}</p>
                          </div>
                        </motion.div>
                      )}

                      {scanPhase === 'done' && demoResult && (
                        <motion.div
                          key="done"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-neutral-400">{language === 'hi' ? 'फसल विवरण' : 'Crop profile'}</p>
                              <h3 className="mt-1 text-2xl font-black text-white">{demoResult.crop}</h3>
                            </div>
                            <Badge className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-neutral-200">
                              {demoResult.label}
                            </Badge>
                          </div>

                          <div className="space-y-3 rounded-[24px] border border-white/10 bg-white/5 p-4">
                            <div className="flex items-start gap-3 text-sm text-neutral-200">
                              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                              <p>{demoResult.status}</p>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-neutral-200">
                              <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                              <p>{demoResult.advice}</p>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-neutral-200">
                              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                              <p>{demoResult.claim}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-semibold text-neutral-400">
                    <span>{language === 'hi' ? 'दावा और उपचार का त्वरित पूर्वावलोकन' : 'Quick treatment + claim preview'}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full px-3 text-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-300"
                      onClick={() => setActiveTab('register')}
                    >
                      {content.ctaPrimary}
                      <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section id="landing-demo" className="mx-auto max-w-7xl px-4 py-6 md:py-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={sectionIn} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }}>
            <Card className="rounded-[32px] border-neutral-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-neutral-800 dark:bg-neutral-950">
              <CardContent className="p-6 md:p-8">
                <Badge className="rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-white dark:bg-white dark:text-neutral-950">
                  {content.premium.title}
                </Badge>
                <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{content.premium.title}</h2>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-neutral-600 dark:text-neutral-400">{content.premium.desc}</p>

                <div className="mt-6 rounded-[28px] border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/60">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="space-y-2 text-sm font-bold">
                      <span className="block text-neutral-500 dark:text-neutral-400">{content.premium.crop}</span>
                      <select className="h-11 w-full rounded-2xl border border-neutral-200 bg-white px-3 text-sm font-semibold dark:border-neutral-800 dark:bg-neutral-950" value={premiumCrop} onChange={(e) => setPremiumCrop(e.target.value as PremiumCrop)}>
                        <option value="rice">{language === 'hi' ? 'धान / चावल' : 'Rice / Paddy'}</option>
                        <option value="wheat">{language === 'hi' ? 'गेहूं' : 'Wheat'}</option>
                        <option value="maize">{language === 'hi' ? 'मक्का' : 'Maize'}</option>
                        <option value="cotton">{language === 'hi' ? 'कपास' : 'Cotton'}</option>
                      </select>
                    </label>

                    <label className="space-y-2 text-sm font-bold">
                      <span className="block text-neutral-500 dark:text-neutral-400">{content.premium.state}</span>
                      <select className="h-11 w-full rounded-2xl border border-neutral-200 bg-white px-3 text-sm font-semibold dark:border-neutral-800 dark:bg-neutral-950" value={premiumState} onChange={(e) => setPremiumState(e.target.value as PremiumState)}>
                        <option value="maharashtra">Maharashtra</option>
                        <option value="karnataka">Karnataka</option>
                        <option value="punjab">Punjab</option>
                        <option value="rajasthan">Rajasthan</option>
                      </select>
                    </label>

                    <label className="space-y-2 text-sm font-bold">
                      <span className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                        <span>{content.premium.area}</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{hectares.toFixed(1)}</span>
                      </span>
                      <input
                        type="range"
                        min={0.5}
                        max={10}
                        step={0.5}
                        value={hectares}
                        onChange={(e) => setHectares(parseFloat(e.target.value))}
                        className="h-2 w-full cursor-pointer rounded-full accent-emerald-600"
                      />
                    </label>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: content.premium.sumInsured, value: premiumResult.sumInsured, icon: BadgeIndianRupee },
                      { label: content.premium.subsidy, value: premiumResult.governmentSubsidy, icon: ShieldCheck },
                      { label: content.premium.farmer, value: premiumResult.farmerPremium, icon: Calculator },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[24px] border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                        <div className="mb-3 inline-flex rounded-2xl bg-emerald-500/10 p-2.5 text-emerald-700 dark:text-emerald-300">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">{item.label}</p>
                        <p className="mt-2 text-xl font-black tracking-tight text-neutral-950 dark:text-white">₹{item.value.toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-[24px] border border-dashed border-emerald-500/30 bg-emerald-500/5 p-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    <div className="flex items-center gap-2 font-black text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      {content.premium.results}
                    </div>
                    <p className="mt-2 leading-relaxed">{language === 'hi' ? `चुनी गई फसल: ${premiumConfig[premiumCrop].label} | क्षेत्र: ${hectares.toFixed(1)} हेक्टेयर` : `Selected crop: ${premiumConfig[premiumCrop].label} | Area: ${hectares.toFixed(1)} hectares`}</p>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{content.premium.disclaimer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={sectionIn} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }}>
            <div className="grid items-stretch gap-4 md:grid-cols-2">
              {content.features.list.map((feature: any) => (
                <Card key={feature.title} className="h-full rounded-[28px] border-neutral-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)] dark:border-neutral-800 dark:bg-neutral-950">
                  <CardContent className="flex h-full flex-col space-y-3 p-6">
                    <div className="inline-flex rounded-2xl bg-neutral-950 p-3 text-white dark:bg-white dark:text-neutral-950">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight">{feature.title}</h3>
                    <p className="text-sm font-medium leading-relaxed text-neutral-600 dark:text-neutral-400">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <motion.div variants={sectionIn} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} className="grid items-stretch gap-6 lg:grid-cols-2">
          <Card className="h-full rounded-[32px] border-neutral-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.05)] dark:border-neutral-800 dark:bg-neutral-950">
            <CardContent className="flex h-full flex-col p-6 md:p-8">
              <h2 className="text-3xl font-black tracking-tight">{content.testimonials.title}</h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-neutral-600 dark:text-neutral-400">{content.testimonials.subtitle}</p>

              <div className="mt-6 space-y-4">
                {content.testimonials.items.map((item: any) => (
                  <div key={item.name} className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/60">
                    <p className="text-sm font-semibold leading-relaxed text-neutral-700 dark:text-neutral-300">“{item.quote}”</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-neutral-950 dark:text-white">{item.name}</p>
                        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{item.place}</p>
                      </div>
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="h-full rounded-[32px] border-neutral-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.05)] dark:border-neutral-800 dark:bg-neutral-950">
            <CardContent className="flex h-full flex-col p-6 md:p-8">
              <h2 className="text-3xl font-black tracking-tight">{content.faqs.title}</h2>
              <div className="mt-6 space-y-3">
                {content.faqs.items.map((faq: any, index: number) => {
                  const open = expandedFaq === index;
                  return (
                    <div key={faq.q} className="overflow-hidden rounded-[24px] border border-neutral-200 dark:border-neutral-800">
                      <button
                        onClick={() => setExpandedFaq(open ? null : index)}
                        className="flex w-full items-center justify-between gap-4 bg-neutral-50 px-5 py-4 text-left font-black text-neutral-900 transition-colors hover:bg-neutral-100 dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-900"
                      >
                        <span>{faq.q}</span>
                        <HelpCircle className={`h-4.5 w-4.5 shrink-0 text-emerald-500 transition-transform ${open ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 md:pb-20">
        <div className="rounded-[36px] border border-emerald-500/15 bg-neutral-950 px-6 py-10 text-center text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] md:px-10 md:py-14">
          <div className="mx-auto max-w-2xl space-y-5">
            <Badge className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-white">
              {language === 'hi' ? 'तुरंत शुरू करें' : 'Start instantly'}
            </Badge>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              {language === 'hi' ? 'अब अपनी अगली फसल के लिए AgriLens आज़माएं' : 'Try AgriLens on your next crop cycle'}
            </h2>
            <p className="text-sm font-medium leading-relaxed text-neutral-300 md:text-base">
              {language === 'hi'
                ? 'पंजीकरण करें, पहला फोटो अपलोड करें, और तुरंत पहचान, प्रीमियम अनुमान और रिपोर्टिंग शुरू करें।'
                : 'Register once, upload your first crop photo, and start diagnostics, insurance estimates, and reporting right away.'}
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-14 rounded-full bg-emerald-500 px-8 font-black text-white hover:bg-emerald-400"
                onClick={() => setActiveTab('register')}
              >
                {content.ctaPrimary}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-white/20 px-8 font-black text-white hover:bg-white/10"
                onClick={() => setActiveTab('signin')}
              >
                {content.ctaSecondary}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};