import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Info, Landmark, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LanguageCode } from '@/src/lib/languages';

interface PremiumCalculatorProps {
  language: LanguageCode;
}

export const PremiumCalculator: React.FC<PremiumCalculatorProps> = ({ language }) => {
  const [cropType, setCropType] = useState('');
  const [landArea, setLandArea] = useState('');
  const [premium, setPremium] = useState<number | null>(null);

  const t: Record<string, any> = {
    en: {
      title: "PMFBY Premium Calculator",
      desc: "Estimate your insurance premium based on crop type and land area.",
      cropLabel: "Crop Type",
      areaLabel: "Land Area (in Hectares)",
      calculate: "Calculate Premium",
      result: "Estimated Premium",
      summary: "Policy Summary",
      kharif: "Kharif Season (2% Premium)",
      rabi: "Rabi Season (1.5% Premium)",
      commercial: "Commercial/Horticultural (5% Premium)",
      disclaimer: "Note: These are estimated values. Actual premiums may vary based on state and district policies.",
      inputTitle: "Input Details",
      selectCrop: "Select crop",
      areaPlaceholder: "e.g. 2.5",
      forArea: "For {{area}} Hectares",
      sumInsured: "Sum Insured",
      placeholderText: "Enter details to see your estimated premium",
      cropNames: {
        rice: "Rice (Kharif)",
        wheat: "Wheat (Rabi)",
        maize: "Maize (Kharif)",
        sugarcane: "Sugarcane (Commercial)",
        cotton: "Cotton (Commercial)"
      }
    },
    hi: {
      title: "PMFBY प्रीमियम कैलकुलेटर",
      desc: "फसल के प्रकार और भूमि क्षेत्र के आधार पर अपने बीमा प्रीमियम का अनुमान लगाएं।",
      cropLabel: "फसल का प्रकार",
      areaLabel: "भूमि क्षेत्र (हेक्टेयर में)",
      calculate: "प्रीमियम की गणना करें",
      result: "अनुमानित प्रीमियम",
      summary: "नीति सारांश",
      kharif: "खरीफ सीजन (2% प्रीमियम)",
      rabi: "रबी सीजन (1.5% प्रीमियम)",
      commercial: "वाणिज्यिक/बागवानी (5% प्रीमियम)",
      disclaimer: "नोट: ये अनुमानित मूल्य हैं। वास्तविक प्रीमियम राज्य और जिला नीतियों के आधार पर भिन्न हो सकते हैं।",
      inputTitle: "इनपुट विवरण",
      selectCrop: "फसल चुनें",
      areaPlaceholder: "उदा. 2.5",
      forArea: "{{area}} हेक्टेयर के लिए",
      sumInsured: "बीमा राशि",
      placeholderText: "अनुमानित प्रीमियम देखने के लिए विवरण दर्ज करें",
      cropNames: {
        rice: "चावल (खरीफ)",
        wheat: "गेहूं (रबी)",
        maize: "मक्का (खरीफ)",
        sugarcane: "गन्ना (वाणिज्यिक)",
        cotton: "कपास (वाणिज्यिक)"
      }
    },
    pa: {
      title: "PMFBY ਪ੍ਰੀਮੀਅਮ ਕੈਲਕੁਲੇਟਰ",
      desc: "ਫਸਲ ਦੀ ਕਿਸਮ ਅਤੇ ਜ਼ਮੀਨ ਦੇ ਅਧਾਰ ਤੇ ਆਪਣੇ ਬੀਮਾ ਪ੍ਰੀਮੀਅਮ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ।",
      cropLabel: "ਫਸਲ ਦੀ ਕਿਸਮ",
      areaLabel: "ਜ਼ਮੀਨ ਦਾ ਖੇਤਰ (ਹੈਕਟੇਅਰ ਵਿੱਚ)",
      calculate: "ਪ੍ਰੀਮੀਅਮ ਦੀ ਗਣਨਾ ਕਰੋ",
      result: "ਅਨੁਮਾਨਿਤ ਪ੍ਰੀਮੀਅਮ",
      summary: "ਪਾਲਿਸੀ ਸਾਰ",
      kharif: "ਖਰੀਫ ਸੀਜ਼ਨ (2% ਪ੍ਰੀਮੀਅਮ)",
      rabi: "ਹਾੜੀ ਸੀਜ਼ਨ (1.5% ਪ੍ਰੀਮੀਅਮ)",
      commercial: "ਵਪਾਰਕ (5% ਪ੍ਰੀਮੀਅਮ)",
      disclaimer: "ਨੋਟ: ਇਹ ਅਨੁਮਾਨਿਤ ਮੁੱਲ ਹਨ।",
      inputTitle: "ਵੇਰਵੇ ਦਰਜ ਕਰੋ",
      selectCrop: "ਫਸਲ ਚੁਣੋ",
      areaPlaceholder: "ਉਦਾਹਰਨ 2.5",
      forArea: "{{area}} ਹੈਕਟੇਅਰ ਲਈ",
      sumInsured: "ਬੀਮਾ ਰਾਸ਼ੀ",
      placeholderText: "ਅੰਦਾਜ਼ਾ ਦੇਖਣ ਲਈ ਵੇਰਵੇ ਦਰਜ ਕਰੋ",
      cropNames: {
        rice: "ਚਾਵਲ (ਖਰੀਫ)",
        wheat: "ਕਣਕ (ਹਾੜੀ)",
        maize: "ਮੱਕੀ (ਖਰੀਫ)",
        sugarcane: "ਗੰਨਾ (ਵਪਾਰਕ)",
        cotton: "ਕਪਾਹ (ਵਪਾਰਕ)"
      }
    },
    mr: {
      title: "PMFBY प्रीमियम कॅल्क्युलेटर",
      desc: "पिकाचा प्रकार आणि जमिनीच्या क्षेत्राच्या आधारावर तुमच्या विमा प्रीमियमचा अंदाज लावा।",
      cropLabel: "पिकाचा प्रकार",
      areaLabel: "जमीन क्षेत्र (हेक्टरमध्ये)",
      calculate: "प्रीमियम मोजा",
      result: "अंदाजित प्रीमियम",
      summary: "पॉलिसी सारांश",
      kharif: "खरीप हंगाम (2% प्रीमियम)",
      rabi: "रब्बी हंगाम (1.5% प्रीमियम)",
      commercial: "व्यावसायिक (5% प्रीमियम)",
      disclaimer: "टीप: ही अंदाजित मूल्ये आहेत।",
      inputTitle: "तपशील प्रविष्ट करा",
      selectCrop: "पीक निवडा",
      areaPlaceholder: "उदा. 2.5",
      forArea: "{{area}} हेक्टरसाठी",
      sumInsured: "विमा रक्कम",
      placeholderText: "अंदाज पाहण्यासाठी तपशील प्रविष्ट करा",
      cropNames: {
        rice: "तांदूळ (खरीप)",
        wheat: "गहू (रब्बी)",
        maize: "मका (खरीप)",
        sugarcane: "ऊस (व्यावसायिक)",
        cotton: "कापूस (व्यावसायिक)"
      }
    },
    bn: {
      title: "PMFBY প্রিমিয়াম ক্যালকুলেটর",
      desc: "ফসলের ধরন এবং জমির আয়তনের ভিত্তিতে আপনার বিমা প্রিমিয়াম অনুমান করুন।",
      cropLabel: "ফসলের ধরন",
      areaLabel: "জমির পরিমাণ (হেক্টর)",
      calculate: "প্রিমিয়াম গণনা করুন",
      result: "আনুমানিক প্রিমিয়াম",
      summary: "পলিসি সারাংশ",
      kharif: "খরিফ মরসুম (২% প্রিমিয়াম)",
      rabi: "রবি মরসুম (১.৫% প্রিমিয়াম)",
      commercial: "বাণিজ্যিক (৫% প্রিমিয়াম)",
      disclaimer: "দ্রষ্টব্য: এগুলি আনুমানিক মান।",
      inputTitle: "বিবরণ লিখুন",
      selectCrop: "ফসল নির্বাচন করুন",
      areaPlaceholder: "যেমন ২.৫",
      forArea: "{{area}} হেক্টরের জন্য",
      sumInsured: "বিমাকৃত রাশি",
      placeholderText: "অনুমান দেখতে বিবরণ লিখুন",
      cropNames: {
        rice: "ধান (খরিফ)",
        wheat: "গম (রবি)",
        maize: "ভুট্টা (খরিফ)",
        sugarcane: "আখ (বাণিজ্যিক)",
        cotton: "তুলা (বাণিজ্যিক)"
      }
    },
    gu: {
      title: "PMFBY પ્રીમિયમ કેલ્ક્યુલેટર",
      desc: "પાકના પ્રકાર અને જમીન વિસ્તારના આધારે તમારા વીમા પ્રીમિયમનો અંદાજ કાઢો.",
      cropLabel: "પાકનો પ્રકાર",
      areaLabel: "જમીન વિસ્તાર (હેક્ટરમાં)",
      calculate: "પ્રીમિયમ ગણો",
      result: "અંદાજિત પ્રીમિયમ",
      summary: "પોલિસી સારાંશ",
      kharif: "ખરીફ સિઝન (2% પ્રીમિયમ)",
      rabi: "રવી સિઝન (1.5% પ્રીમિયમ)",
      commercial: "વાણિજ્યિક (5% પ્રીમિયમ)",
      disclaimer: "નોંધ: આ અંદાજિત મૂલ્યો છે.",
      inputTitle: "વિગતો દાખલ કરો",
      selectCrop: "પાક પસંદ કરો",
      areaPlaceholder: "દા.ત. 2.5",
      forArea: "{{area}} હેક્ટર માટે",
      sumInsured: "વીમા રકમ",
      placeholderText: "અંદાજ જોવા માટે વિગતો દાખલ કરો",
      cropNames: {
        rice: "ચોખા (ખરીફ)",
        wheat: "ઘઉં (રવી)",
        maize: "મકાઈ (ખરીફ)",
        sugarcane: "શેરડી (વાણિજ્યિક)",
        cotton: "કપાસ (વાણિજ્યિક)"
      }
    },
    ta: {
      title: "PMFBY பிரீமியம் கால்குலேட்டர்",
      desc: "பயிர் வகை மற்றும் நிலப்பரப்பின் அடிப்படையில் உங்கள் காப்பீட்டு பிரீமியத்தை மதிப்பிடுங்கள்.",
      cropLabel: "பயிர் வகை",
      areaLabel: "நிலப்பரப்பு (ஹெக்டேரில்)",
      calculate: "பிரீமியத்தை கணக்கிடுங்கள்",
      result: "மதிப்பிடப்பட்ட பிரீமியம்",
      summary: "பாலிசி சுருக்கம்",
      kharif: "காரிஃப் பருவம் (2% பிரீமியம்)",
      rabi: "ரபி பருவம் (1.5% பிரீமியம்)",
      commercial: "வணிகம் (5% பிரீமியம்)",
      disclaimer: "குறிப்பு: இவை மதிப்பிடப்பட்ட மதிப்புகள்.",
      inputTitle: "விவரங்களை உள்ளிடவும்",
      selectCrop: "பயிரைத் தேர்ந்தெடுக்கவும்",
      areaPlaceholder: "உதாரணம் 2.5",
      forArea: "{{area}} ஹெக்டேருக்கு",
      sumInsured: "காப்பீட்டுத் தொகை",
      placeholderText: "மதிப்பீட்டைப் பார்க்க விவரங்களை உள்ளிடவும்",
      cropNames: {
        rice: "நெல் (காரிஃப்)",
        wheat: "கோதுமை (ரபி)",
        maize: "சோளம் (காரிஃப்)",
        sugarcane: "கரும்பு (வணிகம்)",
        cotton: "பருத்தி (வணிகம்)"
      }
    },
    te: {
      title: "PMFBY ప్రీమియం క్యాలిక్యులేటర్",
      desc: "పంట రకం మరియు భూమి వైశాల్యం ఆధారంగా మీ భీమా ప్రీమియంను అంచనా వేయండి.",
      cropLabel: "పంట రకం",
      areaLabel: "భూమి వైశాల్యం (హెక్టార్లలో)",
      calculate: "ప్రీమియం లెక్కించు",
      result: "అంచనా వేసిన ప్రీమియం",
      summary: "పాలసీ సారాంశం",
      kharif: "ఖరీఫ్ సీజన్ (2% ప్రీమియం)",
      rabi: "రబీ సీజన్ (1.5% ప్రీమియం)",
      commercial: "వాణిజ్య (5% ప్రీమియం)",
      disclaimer: "గమనిక: ఇవి అంచనా వేసిన విలువలు.",
      inputTitle: "వివరాలను నమోదు చేయండి",
      selectCrop: "పంటను ఎంచుకోండి",
      areaPlaceholder: "ఉదాహరణ: 2.5",
      forArea: "{{area}} హెక్టార్లకు",
      sumInsured: "భీమా మొత్తం",
      placeholderText: "అంచనాను చూడటానికి వివరాలను నమోదు చేయండి",
      cropNames: {
        rice: "వరి (ఖరీఫ్)",
        wheat: "గోధుమ (రబీ)",
        maize: "మొక్కజొన్న (ఖరీఫ్)",
        sugarcane: "చెరకు (వాణిజ్య)",
        cotton: "పత్తి (వాణిజ్య)"
      }
    },
    kn: {
      title: "PMFBY ಪ್ರೀಮಿಯಂ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
      desc: "ಬೆಳೆ ಪ್ರಕಾರ ಮತ್ತು ಭೂ ವಿಸ್ತೀರ್ಣದ ಆಧಾರದ ಮೇಲೆ ನಿಮ್ಮ ವಿಮಾ ಪ್ರೀಮಿಯಂ ಅನ್ನು ಅಂದಾಜು ಮಾಡಿ.",
      cropLabel: "ಬೆಳೆ ಪ್ರಕಾರ",
      areaLabel: "ಭೂ ವಿಸ್ತೀರ್ಣ (ಹೆಕ್ಟೇರ್‌ಗಳಲ್ಲಿ)",
      calculate: "ಪ್ರೀಮಿಯಂ ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ",
      result: "ಅಂದಾಜು ಪ್ರೀಮಿಯಂ",
      summary: "ಪಾಲಿಸಿ ಸಾರಾಂಶ",
      kharif: "ಖಾರೀಫ್ ಹಂಗಾಮು (2% ಪ್ರೀಮಿಯಂ)",
      rabi: "ರಬಿ ಹಂಗಾಮು (1.5% ಪ್ರೀಮಿಯಂ)",
      commercial: "ವಾಣಿಜ್ಯ (5% ಪ್ರೀಮಿಯಂ)",
      disclaimer: "ಗಮನಿಸಿ: ಇವು ಅಂದಾಜು ಮೌಲ್ಯಗಳು.",
      inputTitle: "ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ",
      selectCrop: "ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ",
      areaPlaceholder: "ಉದಾಹರಣೆಗೆ 2.5",
      forArea: "{{area}} ಹೆಕ್ಟೇರ್‌ಗಳಿಗೆ",
      sumInsured: "ವಿಮಾ ಮೊತ್ತ",
      placeholderText: "ಅಂದಾಜು ನೋಡಲು ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ",
      cropNames: {
        rice: "ಭತ್ತ (ಖಾರೀಫ್)",
        wheat: "ಗೋಧಿ (ರಬಿ)",
        maize: "ಮೆಕ್ಕೆಜೋಳ (ಖಾರೀಫ್)",
        sugarcane: "ಕಬ್ಬು (ವಾಣಿಜ್ಯ)",
        cotton: "ಹತ್ತಿ (ವಾணிಜ್ಯ)"
      }
    },
    ml: {
      title: "PMFBY പ്രീമിയം കാൽക്കുലേറ്റർ",
      desc: "വിളയുടെ തരവും ഭൂമിയുടെ വിസ്തീർണ്ണവും അനുസരിച്ച് നിങ്ങളുടെ ഇൻഷുറൻസ് പ്രീമിയം കണക്കാക്കുക.",
      cropLabel: "വിളയുടെ തരം",
      areaLabel: "ഭൂമിയുടെ വിസ്തീർണ്ണം (ഹെക്ടറിൽ)",
      calculate: "പ്രീമിയം കണക്കാക്കുക",
      result: "കണക്കാക്കിയ പ്രീമിയം",
      summary: "പോളിസി സംഗ്രഹം",
      kharif: "ഖാരിഫ് സീസൺ (2% പ്രീമിയം)",
      rabi: "റാബി സീസൺ (1.5% പ്രീമിയം)",
      commercial: "കൊമേഴ്സ്യൽ (5% പ്രീമിയം)",
      disclaimer: "ശ്രദ്ധിക്കുക: ഇവ കണക്കാക്കിയ മൂല്യങ്ങളാണ്.",
      inputTitle: "വിവരങ്ങൾ നൽകുക",
      selectCrop: "വിള തിരഞ്ഞെടുക്കുക",
      areaPlaceholder: "ഉദാഹരണത്തിന് 2.5",
      forArea: "{{area}} ഹെക്ടറിന്",
      sumInsured: "ഇൻഷുറൻസ് തുക",
      placeholderText: "എസ്റ്റിമേറ്റ് കാണുന്നതിന് വിവരങ്ങൾ നൽകുക",
      cropNames: {
        rice: "നെല്ല് (ഖാരിഫ്)",
        wheat: "ഗോതമ്പ് (റാബി)",
        maize: "ചോളം (ഖാരിഫ്)",
        sugarcane: "കരിമ്പ് (കൊമേഴ്സ്യൽ)",
        cotton: "പരുത്തി (കൊമേഴ്സ്യൽ)"
      }
    }
  };

  const content = t[language] || t['en'];

  const crops = [
    { id: 'rice', name: content.cropNames.rice, rate: 0.02 },
    { id: 'wheat', name: content.cropNames.wheat, rate: 0.015 },
    { id: 'maize', name: content.cropNames.maize, rate: 0.02 },
    { id: 'sugarcane', name: content.cropNames.sugarcane, rate: 0.05 },
    { id: 'cotton', name: content.cropNames.cotton, rate: 0.05 },
  ];

  const handleCalculate = () => {
    const selectedCrop = crops.find(c => c.id === cropType);
    const area = parseFloat(landArea);
    if (selectedCrop && !isNaN(area)) {
      // Assuming a base sum insured of 50,000 per hectare
      const sumInsured = 50000 * area;
      const calculatedPremium = sumInsured * selectedCrop.rate;
      setPremium(calculatedPremium);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
        <p className="text-muted-foreground">{content.desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              {content.inputTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2" key={language}>
              <Label htmlFor="crop">{content.cropLabel}</Label>
              <Select value={cropType} onValueChange={setCropType}>
                <SelectTrigger id="crop">
                  <SelectValue placeholder={content.selectCrop} />
                </SelectTrigger>
                <SelectContent>
                  {crops.map(crop => (
                    <SelectItem key={crop.id} value={crop.id}>{crop.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">{content.areaLabel}</Label>
              <Input 
                id="area" 
                type="number" 
                placeholder={content.areaPlaceholder} 
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
              />
            </div>

            <Button className="w-full" size="lg" onClick={handleCalculate} disabled={!cropType || !landArea}>
              {content.calculate}
            </Button>
          </CardContent>
          <CardFooter className="bg-muted/30 p-4 rounded-b-lg">
            <p className="text-xs text-muted-foreground flex gap-2">
              <Info className="h-4 w-4 flex-shrink-0" />
              {content.disclaimer}
            </p>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {premium !== null ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="bg-primary text-primary-foreground overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Landmark className="h-24 w-24" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg opacity-90">{content.result}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="text-4xl font-bold">₹{premium.toLocaleString()}</div>
                    <p className="text-sm opacity-80">{content.forArea.replace('{{area}}', landArea)}</p>
                  </CardContent>
                  <CardFooter className="bg-black/10 p-4">
                    <div className="flex justify-between w-full items-center">
                      <span className="text-sm font-medium">{content.sumInsured}: ₹{(parseFloat(landArea) * 50000).toLocaleString()}</span>
                      <Badge variant="secondary" className="bg-white/20 text-white border-none">PMFBY</Badge>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full"
              >
                <Card className="h-full border-dashed flex flex-col items-center justify-center p-12 text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">{content.placeholderText}</p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
