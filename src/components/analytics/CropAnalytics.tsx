import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Loader2, CheckCircle2, AlertTriangle, Save, FileText, RefreshCw, Download, Share2, Leaf, AlertCircle, ShieldCheck, ShieldAlert, Info, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { analyzeCropImage } from '@/src/services/geminiService';
import { Badge } from '@/components/ui/badge';
import { LanguageCode } from '@/src/lib/languages';
import { jsPDF } from 'jspdf';

interface CropAnalyticsProps {
  language: LanguageCode;
  preselectedCrop?: string | null;
  onReset?: () => void;
}

export const CropAnalytics: React.FC<CropAnalyticsProps> = ({ language, preselectedCrop, onReset }) => {
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (preselectedCrop) {
      // Show a sample analysis for the preselected crop
      const sampleData: Record<string, any> = {
        rice: {
          cropType: "Rice",
          condition: "Healthy (Sample Analysis)",
          confidence: 0.95,
          suggestions: [
            "Maintain water level at 2-5 cm.",
            "Apply nitrogen-based fertilizer if leaves turn yellow.",
            "Monitor for Brown Plant Hopper (BPH) signs."
          ],
          image: "https://images.unsplash.com/photo-1536633340743-34f754f9d04d?auto=format&fit=crop&w=800&q=80"
        },
        wheat: {
          cropType: "Wheat",
          condition: "Minor Yellow Rust Detected (Sample Analysis)",
          confidence: 0.88,
          suggestions: [
            "Apply Propiconazole 25 EC @ 0.1%.",
            "Avoid excessive irrigation during high humidity.",
            "Ensure proper spacing for air circulation."
          ],
          image: "https://images.unsplash.com/photo-1501430654243-c93fce111d99?auto=format&fit=crop&w=800&q=80"
        },
        maize: {
          cropType: "Maize",
          condition: "Healthy (Sample Analysis)",
          confidence: 0.92,
          suggestions: [
            "Ensure adequate drainage to avoid waterlogging.",
            "Apply Zinc Sulfate if interveinal chlorosis appears.",
            "Check for Fall Armyworm egg masses on leaf undersides."
          ],
          image: "https://images.unsplash.com/photo-1551730459-92db2a308d6a?auto=format&fit=crop&w=800&q=80"
        },
        cotton: {
          cropType: "Cotton",
          condition: "Healthy (Sample Analysis)",
          confidence: 0.94,
          suggestions: [
            "Monitor for Pink Bollworm activity.",
            "Maintain soil moisture during flowering stage.",
            "Use pheromone traps for pest monitoring."
          ],
          image: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&w=800&q=80"
        },
        sugarcane: {
          cropType: "Sugarcane",
          condition: "Healthy (Sample Analysis)",
          confidence: 0.96,
          suggestions: [
            "Ensure deep plowing before planting.",
            "Apply organic mulch to retain soil moisture.",
            "Monitor for Red Rot symptoms in stems."
          ],
          image: "https://images.unsplash.com/photo-1590732102889-13678074929c?auto=format&fit=crop&w=800&q=80"
        },
        mustard: {
          cropType: "Mustard",
          condition: "Aphid Infestation (Sample Analysis)",
          confidence: 0.85,
          suggestions: [
            "Spray Oxydemeton methyl 25 EC @ 1 ml/L.",
            "Remove and destroy infested plant parts.",
            "Encourage natural predators like ladybugs."
          ],
          image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80"
        },
        soyabean: {
          cropType: "Soyabean",
          condition: "Healthy (Sample Analysis)",
          confidence: 0.93,
          suggestions: [
            "Inoculate seeds with Rhizobium culture.",
            "Maintain soil pH between 6.0 and 7.0.",
            "Monitor for Girdle Beetle signs."
          ],
          image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80"
        },
        groundnut: {
          cropType: "Groundnut",
          condition: "Healthy (Sample Analysis)",
          confidence: 0.91,
          suggestions: [
            "Apply Gypsum @ 500 kg/ha at pegging stage.",
            "Ensure well-drained sandy loam soil.",
            "Check for Tikka Leaf Spot symptoms."
          ],
          image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80"
        }
      };

      const data = sampleData[preselectedCrop];
      if (data) {
        setImage(data.image);
        setResult(data);
      }
    }
  }, [preselectedCrop]);

  const lastAnalyzedLanguage = useRef<string>(language);

  // Automatically re-analyze if language changes and an image is present
  useEffect(() => {
    if (image && result && !analyzing && lastAnalyzedLanguage.current !== language) {
      // Don't re-analyze sample data (it's hardcoded)
      if (result.condition && result.condition.includes('Sample')) {
        lastAnalyzedLanguage.current = language;
        return;
      }
      
      startAnalysis(image);
      lastAnalyzedLanguage.current = language;
    }
  }, [language, image, result, analyzing]);

  const t: Record<string, any> = {
    en: {
      title: "AI Crop Analytics System",
      desc: "Upload or capture an image for real-time health analysis.",
      capture: "Capture Image",
      upload: "Upload Image",
      thinking: "Thinking...",
      analyzingDesc: "Analyzing crop condition...",
      detected: "Detected Condition",
      suggestions: "Treatment Suggestions",
      save: "Save Report",
      download: "Download Report",
      share: "Share Report",
      claim: "File PMFBY Claim",
      reset: "Analyze Another",
      confidence: "Confidence",
      sampleNotice: "Sample analysis. Upload real photo for accuracy.",
      wrong: "Wrong?",
      deviceName: "image.jpg",
      analysisResult: "Analysis Result",
      cropLabel: "Crop",
      detectedCrop: "Detected Crop",
      pdfReportTitle: "AgriLens AI - Health Report",
      summaryTitle: "Analysis Summary",
      generatedOn: "Generated on",
      conditionLabel: "Condition",
      confidenceScore: "Confidence Score",
      disclaimerFooter: "This is an AI-generated report for PMFBY support. Please consult an expert for critical decisions."
    },
    hi: {
      title: "एआई फसल विश्लेषण प्रणाली",
      desc: "रीयल-टाइम स्वास्थ्य विश्लेषण के लिए छवि अपलोड/कैप्चर करें।",
      capture: "छवि कैप्चर करें",
      upload: "छवि अपलोड करें",
      thinking: "सोच रहा हूँ...",
      analyzingDesc: "फसल की स्थिति का विश्लेषण कर रहा है...",
      detected: "नतीजा",
      suggestions: "सुझाव",
      save: "सहेजें",
      download: "डाउनलोड",
      share: "साझा करें",
      claim: "दावा दायर करें",
      reset: "पुनः प्रयास करें",
      confidence: "विश्वास",
      sampleNotice: "नमूना विश्लेषण। सटीक परिणामों के लिए फोटो अपलोड करें।",
      wrong: "गलत?",
      deviceName: "छवि.jpg",
      analysisResult: "विश्लेषण परिणाम",
      cropLabel: "फसल",
      detectedCrop: "पता लगाई गई फसल",
      pdfReportTitle: "AgriLens AI - स्वास्थ्य रिपोर्ट",
      summaryTitle: "विश्लेषण सारांश",
      generatedOn: "पर उत्पन्न",
      conditionLabel: "स्थिति",
      confidenceScore: "विश्वास स्कोर",
      disclaimerFooter: "यह PMFBY समर्थन के लिए AI-जनरेटेड रिपोर्ट है। महत्वपूर्ण निर्णयों के लिए विशेषज्ञ से सलाह लें।"
    },
    pa: {
      title: "AI ਫਸਲ ਵਿਸ਼ਲੇਸ਼ਣ ਪ੍ਰਣਾਲੀ",
      desc: "ਵਿਸ਼ਲੇਸ਼ਣ ਲਈ ਤਸਵੀਰ ਅਪਲੋਡ ਜਾਂ ਕੈਪਚਰ ਕਰੋ।",
      capture: "ਤਸਵੀਰ ਲਓ",
      upload: "ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ",
      thinking: "ਸੋਚ ਰਿਹਾ ਹੈ...",
      analyzingDesc: "ਫਸਲ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...",
      detected: "ਸਥਿਤੀ",
      suggestions: "ਸੁਝਾਅ",
      save: "ਸੇਵ ਕਰੋ",
      download: "ਡਾਊਨਲੋਡ",
      share: "ਸ਼ੇਅਰ ਕਰੋ",
      claim: "ਦਾਅਵਾ ਕਰੋ",
      reset: "ਹੋਰ ਵਿਸ਼ਲੇਸ਼ਣ",
      confidence: "ਭਰੋਸਾ",
      sampleNotice: "ਨਮੂਨਾ। ਸਹੀ ਨਤੀਜਿਆਂ ਲਈ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ।",
      wrong: "ਗ਼ਲਤ?",
      deviceName: "ਤਸਵੀਰ.jpg",
      analysisResult: "ਵਿਸ਼ਲੇਸ਼ਣ ਨਤੀਜਾ",
      cropLabel: "ਫਸਲ",
      detectedCrop: "ਪਛਾਣੀ ਗਈ ਫਸਲ"
    },
    mr: {
      title: "AI पीक विश्लेषण प्रणाली",
      desc: "विश्लेषणासाठी प्रतिमा अपलोड किंवा कॅप्चर करा।",
      capture: "प्रतिमा टिपून घ्या",
      upload: "प्रतिमा अपलोड करा",
      thinking: "विचार करत आहे...",
      analyzingDesc: "पीक स्थितीचे विश्लेषण करत आहे...",
      detected: "स्थिती",
      suggestions: "उपचार",
      save: "सेव्ह करा",
      download: "डाउनलोड",
      share: "शेअर करा",
      claim: "दावा करा",
      reset: "दुसरे विश्लेषण",
      confidence: "आत्मविश्वास",
      sampleNotice: "नमुना। अचूकतेसाठी मूळ फोटो अपलोड करा।",
      wrong: "चूक?",
      deviceName: "प्रतिमा.jpg",
      analysisResult: "विश्लेषण निकाल",
      cropLabel: "पीक",
      detectedCrop: "ओळखलेले पीक"
    },
    bn: {
      title: "AI ফসল বিশ্লেষণ সিস্টেম",
      desc: "বিশ্লেষণের জন্য ছবি আপলোড বা ক্যাপচার করুন।",
      capture: "ছবি তুলুন",
      upload: "ছবি আপলোড করুন",
      thinking: "চিন্তা করছে...",
      analyzingDesc: "ফসল বিশ্লেষণ করা হচ্ছে...",
      detected: "অবস্থা",
      suggestions: "পরামর্শ",
      save: "সংরক্ষণ",
      download: "ডাউনলোড",
      share: "শেয়ার করুন",
      claim: "দাবি করুন",
      reset: "আবার করুন",
      confidence: "বিশ্বাস",
      sampleNotice: "নমুনা। সঠিক ফলের জন্য আসল ছবি দিন।",
      wrong: "ভুল?",
      deviceName: "ছবি.jpg",
      analysisResult: "বিশ্লেষণ ফলাফল",
      cropLabel: "ফসল",
      detectedCrop: "শনাক্ত করা ফসল"
    },
    gu: {
      title: "AI પાક વિશ્લેષણ સિસ્ટમ",
      desc: "વિશ્લેષણ માટે છબી અપલોડ અથવા કેપ્ચર કરો.",
      capture: "ફોટો લો",
      upload: "ફોટો અપલોડ કરો",
      thinking: "વિચારી રહ્યું છે...",
      analyzingDesc: "પાકનું વિશ્લેષણ થઈ રહ્યું છે...",
      detected: "સ્થિતિ",
      suggestions: "સૂચનો",
      save: "સાચવો",
      download: "ડાઉનલોડ",
      share: "શેર કરો",
      claim: "દાવો કરો",
      reset: "બીજું જુઓ",
      confidence: "વિશ્વાસ",
      sampleNotice: "નમૂનો. સચોટ પરિણામો માટે અસલી ફોટો આપો.",
      wrong: "ખોટું?",
      deviceName: "ફોટો.jpg",
      analysisResult: "વિશ્લેષણ પરિણામ",
      cropLabel: "પાક",
      detectedCrop: "શોધાયેલ પાક"
    },
    ta: {
      title: "AI பயிர் பகுப்பாய்வு முறை",
      desc: "பகுப்பாய்வு செய்ய படத்தை பதிவேற்றவும் அல்லது பிடிக்கவும்.",
      capture: "படம் பிடிக்கவும்",
      upload: "பதிவேற்றவும்",
      thinking: "யோசிக்கிறது...",
      analyzingDesc: "பயிரை பகுப்பாய்வு செய்கிறது...",
      detected: "நிலை",
      suggestions: "ஆலோசனைகள்",
      save: "சேமி",
      download: "பதிவிறக்கம்",
      share: "பகிர்",
      claim: "காப்பீடு கோரு",
      reset: "மீண்டும் செய்",
      confidence: "நம்பிக்கை",
      sampleNotice: "மாதிரி. துல்லியத்திற்கு அசல் படத்தை பதிவேற்றவும்.",
      wrong: "தவறா?",
      deviceName: "படம்.jpg",
      analysisResult: "பகுப்பாய்வு முடிவு",
      cropLabel: "பயிர்",
      detectedCrop: "கண்டறியப்பட்ட பயிர்"
    },
    te: {
      title: "AI పంట విశ్లేషణ వ్యవస్థ",
      desc: "విశ్లేషణ కోసం చిత్రాన్ని అప్‌లోడ్ చేయండి లేదా తీయండి.",
      capture: "ఫోటో తీయండి",
      upload: "అప్‌లోడ్ చేయండి",
      thinking: "ఆలోచిస్తోంది...",
      analyzingDesc: "పంటను విశ్లేషిస్తోంది...",
      detected: "పరిస్థితి",
      suggestions: "సూచనలు",
      save: "సేవ్",
      download: "డౌన్‌లోడ్",
      share: "షేర్",
      claim: "క్లెయిమ్ చేయి",
      reset: "మళ్ళీ చేయి",
      confidence: "నమ్మకం",
      sampleNotice: "నమూనా. ఖచ్చితత్వం కోసం అసలు ఫోటో వాడండి.",
      wrong: "తప్పా?",
      deviceName: "చిత్రం.jpg",
      analysisResult: "విశ్లేషణ ఫలితం",
      cropLabel: "పంట",
      detectedCrop: "గుర్తించిన పంట"
    },
    kn: {
      title: "AI ಬೆಳೆ ವಿಶ್ಲೇಷಣೆ ವ್ಯವಸ್ಥೆ",
      desc: "ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಸೆರೆಹಿಡಿಯಿರಿ.",
      capture: "ಚಿತ್ರ ಸೆರೆಹಿಡಿಯಿರಿ",
      upload: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      thinking: "ಯೋಚಿಸುತ್ತಿದೆ...",
      analyzingDesc: "ಬೆಳೆಯನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",
      detected: "ಸ್ಥಿತಿ",
      suggestions: "ಸಲಹೆಗಳು",
      save: "ಉಳಿಸಿ",
      download: "ಡೌನ್‌ಲೋಡ್",
      share: "ಹಂಚಿಕೊಳ್ಳಿ",
      claim: "ವಿಮೆ ಕೇಳಿ",
      reset: "ಮತ್ತೆ ವಿಶ್ಲೇಷಿಸಿ",
      confidence: "ನಂಬಿಕೆ",
      sampleNotice: "ನಮೂನೆ. ನಿಖರತೆಗಾಗಿ ಅಸಲಿ ಚಿತ್ರ ಬಳಸಿ.",
      wrong: "ತಪ್ಪೇ?",
      deviceName: "ಚಿತ್ರ.jpg",
      analysisResult: "ವಿಶ್ಲೇಷಣೆ ಫಲಿತಾಂಶ",
      cropLabel: "ಬೆಳೆ",
      detectedCrop: "ಗುರುತಿಸಲಾದ ಬೆಳೆ"
    },
    ml: {
      title: "AI വിള വിശകലന സംവിധാനം",
      desc: "വിശകലനത്തിനായി ചിത്രം അപ്‌ಲೋഡ് ചെയ്യുക അല്ലെങ്കിൽ എടുക്കുക.",
      capture: "ചിത്രം എടുക്കുക",
      upload: "അപ്‌ലോഡ് ചെയ്യുക",
      thinking: "ചിന്തിക്കുന്നു...",
      analyzingDesc: "വിശകലനം ചെയ്യുന്നു...",
      detected: "അവസ്ഥ",
      suggestions: "നിർദ്ദേശങ്ങൾ",
      save: "സേവ് ചെയ്യുക",
      download: "ഡൗൺലോഡ്",
      share: "ഷെയർ ചെയ്യുക",
      claim: "ക്ലെയിം ചെയ്യുക",
      reset: "വീണ്ടും ചെയ്യുക",
      confidence: "വിശ്വാസം",
      sampleNotice: "മാതൃക. കൃത്യതയ്ക്കായി യഥാർത്ഥ ചിത്രം നൽകുക.",
      wrong: "തെറ്റാണോ?",
      deviceName: "ചിത്രം.jpg",
      analysisResult: "വിശകലന ഫലം",
      cropLabel: "വിള",
      detectedCrop: "കണ്ടെത്തിയ വിള"
    }
  };

  const content = t[language] || t['en'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        startAnalysis(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      setImageName(language === 'en' ? 'Captured Camera Image' : 'कैप्चर की गई छवि');
      
      // Stop camera stream
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setShowCamera(false);
      
      startAnalysis(dataUrl);
    }
  };

  const startAnalysis = async (imgData: string) => {
    setAnalyzing(true);
    setProgress(0);
    setResult(null);

    // Simulate progress faster
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 15;
      });
    }, 150);

    try {
      const analysisResult = await analyzeCropImage(imgData, language);
      clearInterval(interval);
      setProgress(100);
      setResult(analysisResult);
      setAnalyzing(false);
    } catch (error) {
      console.error(error);
      setAnalyzing(false);
      clearInterval(interval);
    }
  };

  const reset = () => {
    setImage(null);
    setImageName(null);
    setResult(null);
    setProgress(0);
    if (onReset) onReset();
  };

  const getConditionIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('healthy')) return <Leaf className="h-5 w-5 text-green-500" />;
    if (c.includes('disease') || c.includes('pest') || c.includes('deficiency')) return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    return <CheckCircle2 className="h-5 w-5 text-primary" />;
  };

  const getConfidenceIcon = (score: number) => {
    if (score >= 0.8) return <ShieldCheck className="h-4 w-4 text-green-600" />;
    if (score >= 0.6) return <ShieldAlert className="h-4 w-4 text-amber-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  const downloadReport = () => {
    if (!result) return;

    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    
    // Header
    doc.setFillColor(34, 197, 94); // Primary green
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text(content.pdfReportTitle, 20, 25);
    
    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`${content.generatedOn}: ${timestamp}`, 20, 50);
    
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text(content.summaryTitle, 20, 65);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${content.cropLabel}: ${result.cropType || content.detectedCrop}`, 20, 75);
    doc.text(`${content.conditionLabel || 'Condition'}: ${result.condition}`, 20, 85);
    doc.text(`${content.confidenceScore || 'Confidence'}: ${Math.round(result.confidence * 100)}%`, 20, 95);
    
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text(content.suggestions, 20, 110);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let yPos = 120;
    result.suggestions?.forEach((s: string, i: number) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${s}`, 170);
      doc.text(lines, 20, yPos);
      yPos += (lines.length * 7);
    });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    const footerLines = doc.splitTextToSize(content.disclaimerFooter, 170);
    doc.text(footerLines, 20, 280);
    
    doc.save(`AgriLens_Report_${result.cropType || 'Crop'}.pdf`);
  };

  const shareReport = async () => {
    if (!result) return;

    const shareData = {
      title: 'AgriLens AI Crop Health Report',
      text: `Crop: ${result.cropType || 'Detected Crop'}\nCondition: ${result.condition}\nConfidence: ${Math.round(result.confidence * 100)}%\n\nSuggestions:\n${result.suggestions?.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}\n\nGenerated via AgriLens AI`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to email
        const mailtoLink = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text + '\n\n' + shareData.url)}`;
        window.location.href = mailtoLink;
      }
    } catch (err) {
      console.error("Error sharing report:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
        <p className="text-muted-foreground">{content.desc}</p>
        {preselectedCrop && !analyzing && result && result.condition.includes('Sample') && (
          <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 py-2 px-4 rounded-full text-sm font-medium w-fit mx-auto border border-amber-200 mt-4">
            <Info className="h-4 w-4" />
            {content.sampleNotice}
          </div>
        )}
      </div>

      {!image && !showCamera && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer hover:border-primary transition-colors border-dashed border-2 flex flex-col items-center justify-center p-12 space-y-4"
            onClick={startCamera}
          >
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold">{content.capture}</h3>
              <p className="text-sm text-muted-foreground">Use device camera</p>
            </div>
          </Card>

          <Card 
            className="cursor-pointer hover:border-primary transition-colors border-dashed border-2 flex flex-col items-center justify-center p-12 space-y-4"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold">{content.upload}</h3>
              <p className="text-sm text-muted-foreground">Select from gallery</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload} 
            />
          </Card>
        </div>
      )}

      {showCamera && (
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-black">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
              <Button size="lg" variant="destructive" onClick={() => {
                const stream = videoRef.current?.srcObject as MediaStream;
                stream?.getTracks().forEach(track => track.stop());
                setShowCamera(false);
              }}>
                Cancel
              </Button>
              <Button size="lg" onClick={capturePhoto} className="rounded-full h-16 w-16 p-0">
                <div className="h-12 w-12 rounded-full border-4 border-white"></div>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {image && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="overflow-hidden h-fit">
            <CardHeader className="p-0">
              <img src={image} alt="Crop" className="w-full aspect-square object-cover" />
            </CardHeader>
            <div className="p-4 bg-muted/20 border-t flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <span className="text-[10px] font-medium truncate text-muted-foreground">{imageName || content.deviceName}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={reset}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2 font-bold gap-1 text-[10px]"
              >
                <XCircle className="h-3 w-3" />
                {content.wrong}
              </Button>
            </div>
            {analyzing && (
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {content.thinking}
                </div>
                <p className="text-sm text-muted-foreground">{content.analyzingDesc}</p>
                <Progress value={progress} className="h-2" />
              </CardContent>
            )}
          </Card>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full"
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          {content.analysisResult}
                        </CardTitle>
                        <CardDescription>
                          {content.cropLabel}: <span className="font-bold text-foreground">{result.cropType || content.detectedCrop}</span>
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={`flex items-center gap-1.5 ${
                        result.confidence >= 0.8 ? 'bg-green-50 text-green-700 border-green-200' :
                        result.confidence >= 0.6 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {getConfidenceIcon(result.confidence)}
                        <span className="text-[10px] sm:text-xs">{content.confidence}: {Math.round(result.confidence * 100)}%</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{content.detected}</h4>
                      <div className={`p-3 rounded-lg border flex items-center gap-3 font-bold text-sm sm:text-base ${
                        result.condition.toLowerCase().includes('healthy') ? 'bg-green-50 border-green-100 text-green-900' :
                        'bg-amber-50 border-amber-100 text-amber-900'
                      }`}>
                        {getConditionIcon(result.condition)}
                        {result.condition}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{content.suggestions}</h4>
                      <ul className="space-y-2">
                        {result.suggestions?.map((s: string, i: number) => (
                          <li key={i} className="flex gap-2 text-xs">
                            <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-1 w-1 rounded-full bg-primary"></div>
                            </div>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3 p-4 border-t bg-muted/5 mt-auto">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button className="w-full shadow-lg h-10 text-[9px] sm:text-[10px] font-bold px-1" onClick={downloadReport}>
                        <Download className="mr-1 h-3.5 w-3.5 shrink-0" /> <span className="truncate">{content.download}</span>
                      </Button>
                      <Button variant="secondary" className="w-full shadow-md h-10 text-[9px] sm:text-[10px] font-bold px-1" onClick={shareReport}>
                        <Share2 className="mr-1 h-3.5 w-3.5 shrink-0" /> <span className="truncate">{content.share}</span>
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button 
                        variant="outline" 
                        className="w-full border-orange-200 bg-orange-50/10 text-orange-700 hover:bg-orange-100 h-10 text-[9px] sm:text-[10px] font-bold px-1"
                        onClick={() => window.open('https://pmfby.gov.in/farmerLogin', '_blank')}
                      >
                        <ShieldCheck className="mr-1 h-3.5 w-3.5 shrink-0" /> <span className="truncate">{content.claim}</span>
                      </Button>
                      <Button variant="ghost" className="w-full text-muted-foreground h-10 text-[9px] sm:text-[10px] font-bold px-1" onClick={reset}>
                        <RefreshCw className="mr-1 h-3.5 w-3.5 shrink-0" /> <span className="truncate">{content.reset}</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </div>
  );
};
