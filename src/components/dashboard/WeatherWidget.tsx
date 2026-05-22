import React from 'react';
import { Cloud, CloudRain, Droplets, Thermometer, Wind } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { LanguageCode } from '@/src/lib/languages';

interface WeatherWidgetProps {
  language: LanguageCode;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ language }) => {
  const t: Record<string, any> = {
    en: {
      title: "Local Weather & Soil Status",
      temp: "Temperature",
      humidity: "Humidity",
      soil: "Soil Moisture",
      forecast: "Upcoming Rain Forecast",
      status: "Good for sowing",
      wind: "Wind"
    },
    hi: {
      title: "स्थानीय मौसम और मिट्टी की स्थिति",
      temp: "तापमान",
      humidity: "आर्द्रता",
      soil: "मिट्टी की नमी",
      forecast: "आगामी वर्षा का पूर्वानुमान",
      status: "बुवाई के लिए अच्छा है",
      wind: "हवा"
    },
    pa: {
      title: "ਸਥਾਨਕ ਮੌਸਮ ਅਤੇ ਮਿੱਟੀ ਦੀ ਸਥਿਤੀ",
      temp: "ਤਾਪਮਾਨ",
      humidity: "ਨਮੀ",
      soil: "ਮਿੱਟੀ ਦੀ ਨਮੀ",
      forecast: "ਆਉਣ ਵਾਲੀ ਬਾਰਿਸ਼ ਦਾ ਪੂਰਵ ਅਨੁਮਾਨ",
      status: "ਬਿਜਾਈ ਲਈ ਵਧੀਆ",
      wind: "ਹਵਾ"
    },
    mr: {
      title: "स्थानिक हवामान आणि जमिनीची स्थिती",
      temp: "तापमान",
      humidity: "आर्द्रता",
      soil: "जमिनीतील ओलावा",
      forecast: "येणारा पावसाचा अंदाज",
      status: "पेरणीसाठी चांगले",
      wind: "वारा"
    },
    bn: {
      title: "স্থানীয় আবহাওয়া ও মাটির অবস্থা",
      temp: "तापমাত্রা",
      humidity: "আর্দ্রতা",
      soil: "মাটির আর্দ্রতা",
      forecast: "আগামী বৃষ্টির পূর্বাভাস",
      status: "বপনের জন্য ভালো",
      wind: "বাতাস"
    },
    gu: {
      title: "સ્થાનિક હવામાન અને જમીનની સ્થિતિ",
      temp: "તાપમાન",
      humidity: "ભેજ",
      soil: "જમીનનો ભેજ",
      forecast: "આગામી વરસાદની આગાહી",
      status: "વાવણી માટે સારું",
      wind: "પવન"
    },
    ta: {
      title: "உள்ளூர் வானிலை மற்றும் மண் நிலை",
      temp: "வெப்பநிலை",
      humidity: "ஈரப்பதம்",
      soil: "மண் ஈரப்பதம்",
      forecast: "வரவிருக்கும் மழை முன்னறிவிப்பு",
      status: "விதைப்பதற்கு ஏற்றது",
      wind: "காற்று"
    },
    te: {
      title: "స్థానిక వాతావరణం & నేల స్థితి",
      temp: "ఉష్ణోగ్రత",
      humidity: "తేమ",
      soil: "నేల తేమ",
      forecast: "రాబోయే వర్ష సూచన",
      status: "విత్తడానికి అనుకూలం",
      wind: "గాలి"
    },
    kn: {
      title: "ಸ್ಥಳೀಯ ಹವಾಮಾನ ಮತ್ತು ಮಣ್ಣಿನ ಸ್ಥಿತಿ",
      temp: "ತಾಪಮಾನ",
      humidity: "ಆರ್ದ್ರತೆ",
      soil: "ಮಣ್ಣಿನ ತೇವಾಂಶ",
      forecast: "ಮುಂಬರುವ ಮಳೆಯ ಮುನ್ಸೂಚನೆ",
      status: "ಬಿತ್ತನೆಗೆ ಉತ್ತಮವಾಗಿದೆ",
      wind: "ಗಾಳಿ"
    },
    ml: {
      title: "പ്രാദേശിക കാലാവസ്ഥയും മണ്ണും",
      temp: "താപനില",
      humidity: "ആർദ്രത",
      soil: "മണ്ണിലെ ഈർപ്പം",
      forecast: "മഴ പ്രവചനം",
      status: "വിതയ്ക്കാൻ അനുയോജ്യം",
      wind: "കാറ്റ്"
    }
  };

  const content = t[language] || t['en'];

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg overflow-hidden">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold flex items-center gap-2">
              32°C <Cloud className="h-6 w-6 text-white/80" />
            </div>
            <p className="text-[10px] font-medium bg-white/20 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">
              {content.status}
            </p>
          </div>
          <div className="text-right text-[10px] opacity-70">
            <p>New Delhi, India</p>
            <p>April 08, 2026</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-white/10 p-2 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <Droplets className="h-4 w-4 opacity-80" />
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-tighter opacity-70">{content.humidity}</span>
              <span className="text-xs font-bold leading-none">65%</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 border-x border-white/10">
            <Thermometer className="h-4 w-4 opacity-80" />
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-tighter opacity-70">{content.soil}</span>
              <span className="text-xs font-bold leading-none">42%</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Wind className="h-4 w-4 opacity-80" />
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-tighter opacity-70">{content.wind}</span>
              <span className="text-xs font-bold leading-none">12 km/h</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-semibold opacity-80">{content.forecast}</span>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <span className="opacity-70">Thu</span>
                <CloudRain className="h-3 w-3" />
                <span className="font-bold">20%</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="opacity-70">Fri</span>
                <CloudRain className="h-3 w-3" />
                <span className="font-bold">80%</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="opacity-70">Sat</span>
                <Cloud className="h-3 w-3" />
                <span className="font-bold">10%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
