import React, { useEffect, useMemo, useState } from 'react';
import { Cloud, CloudRain, CloudSun, Droplets, Loader2, Thermometer, Wind, AlertTriangle, Snowflake, CloudFog, CloudLightning } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { LanguageCode } from '@/src/lib/languages';

interface WeatherWidgetProps {
  language: LanguageCode;
  user?: {
    townName?: string;
    villageName?: string;
    district?: string;
    state?: string;
  } | null;
}

type WeatherState = {
  locationLabel: string;
  temperature: number | null;
  humidity: number | null;
  soilMoisture: number | null;
  windSpeed: number | null;
  rainChance: number | null;
  weatherCode: number | null;
  updatedAt: string | null;
  loading: boolean;
  error: string | null;
};

type GeocodingResult = {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
};

const INITIAL_STATE: WeatherState = {
  locationLabel: '',
  temperature: null,
  humidity: null,
  soilMoisture: null,
  windSpeed: null,
  rainChance: null,
  weatherCode: null,
  updatedAt: null,
  loading: true,
  error: null
};

const normalizeLocationPart = (value?: string) => value?.trim().replace(/\s+/g, ' ') || '';

const uniqueParts = (parts: string[]) => Array.from(new Set(parts.map(normalizeLocationPart).filter(Boolean)));

const buildLocationCandidates = (user?: WeatherWidgetProps['user']) => {
  const villageName = normalizeLocationPart(user?.villageName);
  const townName = normalizeLocationPart(user?.townName);
  const district = normalizeLocationPart(user?.district);
  const state = normalizeLocationPart(user?.state);

  return uniqueParts([
    villageName,
    townName,
    `${villageName}, ${district}`,
    `${townName}, ${district}`,
    `${villageName}, ${district}, ${state}`,
    `${townName}, ${district}, ${state}`,
    `${district}, ${state}`,
    `${state}`,
    `${district}, India`,
    `${state}, India`
  ]);
};

const scoreLocationMatch = (result: GeocodingResult, user?: WeatherWidgetProps['user']) => {
  const state = normalizeLocationPart(user?.state).toLowerCase();
  const district = normalizeLocationPart(user?.district).toLowerCase();
  const townName = normalizeLocationPart(user?.townName).toLowerCase();
  const villageName = normalizeLocationPart(user?.villageName).toLowerCase();
  const resultName = normalizeLocationPart(result.name).toLowerCase();
  const resultAdmin1 = normalizeLocationPart(result.admin1).toLowerCase();
  const resultCountry = normalizeLocationPart(result.country).toLowerCase();

  let score = 0;
  if (resultCountry === 'india') score += 25;
  if (state && (resultAdmin1.includes(state) || state.includes(resultAdmin1))) score += 30;
  if (district && (resultName.includes(district) || resultAdmin1.includes(district))) score += 20;
  if (townName && resultName.includes(townName)) score += 20;
  if (villageName && resultName.includes(villageName)) score += 20;
  if (townName === resultName || villageName === resultName) score += 15;

  return score;
};

const resolveLocation = async (user: WeatherWidgetProps['user'], signal: AbortSignal) => {
  const candidates = buildLocationCandidates(user);
  let best: GeocodingResult | null = null;
  let bestScore = -1;

  for (const candidate of candidates) {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(candidate)}&count=5&language=en&format=json`,
      { signal }
    );

    if (!response.ok) continue;

    const payload = await response.json();
    const results: GeocodingResult[] = Array.isArray(payload?.results) ? payload.results : [];

    for (const result of results) {
      const score = scoreLocationMatch(result, user);
      if (score > bestScore) {
        best = result;
        bestScore = score;
      }
    }

    if (bestScore >= 40) break;
  }

  return best;
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ language, user }) => {
  const [weather, setWeather] = useState<WeatherState>(INITIAL_STATE);

  const t: Record<string, any> = {
    en: {
      title: "Local Weather & Soil Status",
      temp: "Temperature",
      humidity: "Humidity",
      soil: "Soil Moisture",
      forecast: "Upcoming Rain Forecast",
      statusGood: "Good for sowing",
      statusDry: "Dry spell risk",
      statusRain: "Rain likely",
      statusStorm: "Storm watch",
      statusCold: "Cold conditions",
      wind: "Wind",
      location: "Location",
      loading: "Loading live weather...",
      noLocation: "Add town or village name in your profile to get live weather.",
      updated: "Updated",
      error: "Unable to load live weather right now."
    },
    hi: {
      title: "स्थानीय मौसम और मिट्टी की स्थिति",
      temp: "तापमान",
      humidity: "आर्द्रता",
      soil: "मिट्टी की नमी",
      forecast: "आगामी वर्षा का पूर्वानुमान",
      statusGood: "बुवाई के लिए अच्छा है",
      statusDry: "सूखे का खतरा",
      statusRain: "बारिश की संभावना",
      statusStorm: "तूफान पर नजर",
      statusCold: "ठंडी स्थिति",
      wind: "हवा",
      location: "स्थान",
      loading: "लाइव मौसम लोड हो रहा है...",
      noLocation: "लाइव मौसम देखने के लिए प्रोफ़ाइल में अपना शहर या गांव जोड़ें।",
      updated: "अद्यतन",
      error: "अभी लाइव मौसम लोड नहीं हो सका।"
    },
    pa: {
      title: "ਸਥਾਨਕ ਮੌਸਮ ਅਤੇ ਮਿੱਟੀ ਦੀ ਸਥਿਤੀ",
      temp: "ਤਾਪਮਾਨ",
      humidity: "ਨਮੀ",
      soil: "ਮਿੱਟੀ ਦੀ ਨਮੀ",
      forecast: "ਆਉਣ ਵਾਲੀ ਬਾਰਿਸ਼ ਦਾ ਪੂਰਵ ਅਨੁਮਾਨ",
      statusGood: "ਬਿਜਾਈ ਲਈ ਵਧੀਆ",
      statusDry: "ਸੁੱਕੇ ਦਾ ਖਤਰਾ",
      statusRain: "ਬਰਸਾਤ ਦੀ ਸੰਭਾਵਨਾ",
      statusStorm: "ਤੂਫ਼ਾਨ ਨਿਗਰਾਨੀ",
      statusCold: "ਠੰਢੀਆਂ ਹਾਲਤਾਂ",
      wind: "ਹਵਾ"
    },
    mr: {
      title: "स्थानिक हवामान आणि जमिनीची स्थिती",
      temp: "तापमान",
      humidity: "आर्द्रता",
      soil: "जमिनीतील ओलावा",
      forecast: "येणारा पावसाचा अंदाज",
      statusGood: "पेरणीसाठी चांगले",
      statusDry: "दुष्काळाचा धोका",
      statusRain: "पावसाची शक्यता",
      statusStorm: "वादळावर लक्ष",
      statusCold: "थंड परिस्थिती",
      wind: "वारा"
    },
    bn: {
      title: "স্থানীয় আবহাওয়া ও মাটির অবস্থা",
      temp: "तापমাত্রা",
      humidity: "আর্দ্রতা",
      soil: "মাটির আর্দ্রতা",
      forecast: "আগামী বৃষ্টির পূর্বাভাস",
      statusGood: "বপনের জন্য ভালো",
      statusDry: "শুষ্কতার ঝুঁকি",
      statusRain: "বৃষ্টির সম্ভাবনা",
      statusStorm: "ঝড় সতর্কতা",
      statusCold: "ঠান্ডা পরিস্থিতি",
      wind: "বাতাস"
    },
    gu: {
      title: "સ્થાનિક હવામાન અને જમીનની સ્થિતિ",
      temp: "તાપમાન",
      humidity: "ભેજ",
      soil: "જમીનનો ભેજ",
      forecast: "આગામી વરસાદની આગાહી",
      statusGood: "વાવણી માટે સારું",
      statusDry: "સુકાવાનો જોખમ",
      statusRain: "વરસાદની શક્યતા",
      statusStorm: "તોફાનની નજર",
      statusCold: "ઠંડી સ્થિતિ",
      wind: "પવન"
    },
    ta: {
      title: "உள்ளூர் வானிலை மற்றும் மண் நிலை",
      temp: "வெப்பநிலை",
      humidity: "ஈரப்பதம்",
      soil: "மண் ஈரப்பதம்",
      forecast: "வரவிருக்கும் மழை முன்னறிவிப்பு",
      statusGood: "விதைப்பதற்கு ஏற்றது",
      statusDry: "வறட்சி அபாயம்",
      statusRain: "மழை வாய்ப்பு",
      statusStorm: "புயல் கண்காணிப்பு",
      statusCold: "குளிர்ந்த நிலை",
      wind: "காற்று"
    },
    te: {
      title: "స్థానిక వాతావరణం & నేల స్థితి",
      temp: "ఉష్ణోగ్రత",
      humidity: "తేమ",
      soil: "నేల తేమ",
      forecast: "రాబోయే వర్ష సూచన",
      statusGood: "విత్తడానికి అనుకూలం",
      statusDry: "ఎండతడి ప్రమాదం",
      statusRain: "వర్ష అవకాశం",
      statusStorm: "తుఫాను పర్యవేక్షణ",
      statusCold: "చల్లని పరిస్థితులు",
      wind: "గాలి"
    },
    kn: {
      title: "ಸ್ಥಳೀಯ ಹವಾಮಾನ ಮತ್ತು ಮಣ್ಣಿನ ಸ್ಥಿತಿ",
      temp: "ತಾಪಮಾನ",
      humidity: "ಆರ್ದ್ರತೆ",
      soil: "ಮಣ್ಣಿನ ತೇವಾಂಶ",
      forecast: "ಮುಂಬರುವ ಮಳೆಯ ಮುನ್ಸೂಚನೆ",
      statusGood: "ಬಿತ್ತನೆಗೆ ಉತ್ತಮವಾಗಿದೆ",
      statusDry: "ಒಣಹವೆಯ ಅಪಾಯ",
      statusRain: "ಮಳೆಯ ಸಾಧ್ಯತೆ",
      statusStorm: "ಚಂಡಮಾರುತ ಮೇಲ್ವಿಚಾರಣೆ",
      statusCold: "ತಣ್ಣನೆಯ ಪರಿಸ್ಥಿತಿ",
      wind: "ಗಾಳಿ"
    },
    ml: {
      title: "പ്രാദേശിക കാലാവസ്ഥയും മണ്ണും",
      temp: "താപനില",
      humidity: "ആർദ്രത",
      soil: "മണ്ണിലെ ഈർപ്പം",
      forecast: "മഴ പ്രവചനം",
      statusGood: "വിതയ്ക്കാൻ അനുയോജ്യം",
      statusDry: "വരൾച്ചാ ഭീഷണി",
      statusRain: "മഴ സാധ്യത",
      statusStorm: "കൊടുങ്കാറ്റ് നിരീക്ഷണം",
      statusCold: "തണുത്ത സാഹചര്യം",
      wind: "കാറ്റ്"
    }
  };

  const content = t[language] || t['en'];
  const localeMap: Record<LanguageCode, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    pa: 'pa-IN',
    mr: 'mr-IN',
    bn: 'bn-IN',
    gu: 'gu-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    ml: 'ml-IN'
  };
  const currentDate = new Date();
  const locale = localeMap[language] || 'en-IN';
  const formattedDate = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(currentDate);

  const locationQuery = useMemo(() => {
    const parts = [user?.villageName, user?.townName, user?.district, user?.state, 'India'].filter(Boolean) as string[];
    return parts.join(', ');
  }, [user?.district, user?.state, user?.townName, user?.villageName]);

  const displayLocation = weather.locationLabel || locationQuery || content.location;

  const weatherStatus = useMemo(() => {
    if (weather.error) return content.error;
    if (weather.loading) return content.loading;
    if (weather.weatherCode === null && weather.rainChance === null) return content.statusGood;

    const code = weather.weatherCode ?? 0;
    const rainChance = weather.rainChance ?? 0;

    if ([95, 96, 99].includes(code)) return content.statusStorm;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return content.statusCold;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code) || rainChance >= 60) return content.statusRain;
    if ((weather.temperature ?? 0) >= 34 || (weather.humidity ?? 0) <= 30) return content.statusDry;
    return content.statusGood;
  }, [content.error, content.loading, content.statusCold, content.statusDry, content.statusGood, content.statusRain, content.statusStorm, weather.error, weather.humidity, weather.loading, weather.rainChance, weather.temperature, weather.weatherCode]);

  useEffect(() => {
    const controller = new AbortController();

    const loadWeather = async () => {
      const candidates = buildLocationCandidates(user);

      if (candidates.length === 0) {
        setWeather({
          ...INITIAL_STATE,
          loading: false,
          error: content.noLocation
        });
        return;
      }

      setWeather((current) => ({ ...current, loading: true, error: null }));

      try {
        const resolvedLocation = await resolveLocation(user, controller.signal);

        if (!resolvedLocation) {
          setWeather({
            ...INITIAL_STATE,
            loading: false,
            error: content.error,
            locationLabel: locationQuery
          });
          return;
        }

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${resolvedLocation.latitude}&longitude=${resolvedLocation.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=soil_moisture_0_to_1cm,precipitation_probability&daily=precipitation_probability_max&forecast_days=3&timezone=auto`,
          { signal: controller.signal }
        );

        if (!weatherResponse.ok) {
          throw new Error(`Weather request failed (${weatherResponse.status})`);
        }

        const weatherPayload = await weatherResponse.json();
        const currentTime = weatherPayload?.current?.time;
        const hourlyTimes: string[] = weatherPayload?.hourly?.time || [];
        const hourlyIndex = currentTime ? hourlyTimes.indexOf(currentTime) : -1;
        const nearestIndex = hourlyIndex >= 0 ? hourlyIndex : 0;
        const soilMoistureRaw = weatherPayload?.hourly?.soil_moisture_0_to_1cm?.[nearestIndex];
        const rainChance = weatherPayload?.daily?.precipitation_probability_max?.[0] ?? weatherPayload?.hourly?.precipitation_probability?.[nearestIndex] ?? null;

        setWeather({
          locationLabel: [resolvedLocation.name, resolvedLocation.admin1, resolvedLocation.country].filter(Boolean).join(', '),
          temperature: typeof weatherPayload?.current?.temperature_2m === 'number' ? weatherPayload.current.temperature_2m : null,
          humidity: typeof weatherPayload?.current?.relative_humidity_2m === 'number' ? weatherPayload.current.relative_humidity_2m : null,
          soilMoisture: typeof soilMoistureRaw === 'number' ? Math.round(soilMoistureRaw * 100) : null,
          windSpeed: typeof weatherPayload?.current?.wind_speed_10m === 'number' ? weatherPayload.current.wind_speed_10m : null,
          rainChance: typeof rainChance === 'number' ? rainChance : null,
          weatherCode: typeof weatherPayload?.current?.weather_code === 'number' ? weatherPayload.current.weather_code : null,
          updatedAt: currentTime || new Date().toISOString(),
          loading: false,
          error: null
        });
      } catch (error: any) {
        if (error?.name === 'AbortError') return;
        setWeather({
          ...INITIAL_STATE,
          loading: false,
          error: content.error,
          locationLabel: locationQuery
        });
      }
    };

    loadWeather();

    return () => controller.abort();
  }, [content.error, content.noLocation, locationQuery, user?.district, user?.state, user?.townName, user?.villageName]);

  const dayLabels = useMemo(() => {
    const baseDate = weather.updatedAt ? new Date(weather.updatedAt) : new Date();
    return [1, 2, 3].map((offset) => {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + offset);
      return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);
    });
  }, [locale, weather.updatedAt]);

  const currentWeatherIcon = () => {
    const code = weather.weatherCode ?? -1;
    if ([95, 96, 99].includes(code)) return <CloudLightning className="h-6 w-6 text-white/80" />;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return <Snowflake className="h-6 w-6 text-white/80" />;
    if ([45, 48].includes(code)) return <CloudFog className="h-6 w-6 text-white/80" />;
    if ([1, 2, 3].includes(code)) return <CloudSun className="h-6 w-6 text-white/80" />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className="h-6 w-6 text-white/80" />;
    return <Cloud className="h-6 w-6 text-white/80" />;
  };

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg overflow-hidden">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold flex items-center gap-2">
              {weather.loading ? <Loader2 className="h-6 w-6 animate-spin text-white/80" /> : `${weather.temperature ?? '--'}°C`} {currentWeatherIcon()}
            </div>
            <p className="text-[10px] font-medium bg-white/20 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">
              {weatherStatus}
            </p>
          </div>
          <div className="text-right text-[10px] opacity-70">
            <p>{content.location}: {displayLocation}</p>
            <p>{formattedDate}</p>
            {weather.updatedAt && <p>{content.updated}: {new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(weather.updatedAt))}</p>}
          </div>
        </div>

        {!weather.loading && weather.error && (
          <div className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-[11px] font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{weather.error}</span>
          </div>
        )}

        {!weather.loading && !weather.error && !weather.locationLabel && (
          <div className="rounded-lg bg-white/15 px-3 py-2 text-[11px] font-medium">
            {content.noLocation}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 bg-white/10 p-2 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <Droplets className="h-4 w-4 opacity-80" />
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-tighter opacity-70">{content.humidity}</span>
              <span className="text-xs font-bold leading-none">{weather.humidity ?? '--'}%</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 border-x border-white/10">
            <Thermometer className="h-4 w-4 opacity-80" />
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-tighter opacity-70">{content.soil}</span>
              <span className="text-xs font-bold leading-none">{weather.soilMoisture ?? '--'}%</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Wind className="h-4 w-4 opacity-80" />
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-tighter opacity-70">{content.wind}</span>
              <span className="text-xs font-bold leading-none">{weather.windSpeed ?? '--'} km/h</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-semibold opacity-80">{content.forecast}</span>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <span className="opacity-70">{dayLabels[0]}</span>
                <CloudRain className="h-3 w-3" />
                <span className="font-bold">{weather.rainChance ?? '--'}%</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="opacity-70">{dayLabels[1]}</span>
                <CloudRain className="h-3 w-3" />
                <span className="font-bold">{Math.max(0, Math.min(100, (weather.rainChance ?? 0) - 15))}%</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="opacity-70">{dayLabels[2]}</span>
                <Cloud className="h-3 w-3" />
                <span className="font-bold">{Math.max(0, Math.min(100, (weather.rainChance ?? 0) - 35))}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
