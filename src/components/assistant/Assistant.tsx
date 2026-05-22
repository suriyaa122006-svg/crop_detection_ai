import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Loader2, Image as ImageIcon, Sparkles, MessageSquare, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAssistantResponse } from '@/src/services/geminiService';
import { Badge } from '@/components/ui/badge';
import { LanguageCode } from '@/src/lib/languages';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AssistantProps {
  language: LanguageCode;
}

export const Assistant: React.FC<AssistantProps> = ({ language }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t: Record<string, any> = {
    en: {
      title: "Digital Farming Assistant",
      greeting: "Hi! 👋 Ask me about PMFBY, crops, or detections. I'm here to help you step by step!",
      placeholder: "Ask about PMFBY, crops, or seasons...",
      send: "Send",
      simScreenshot: "Simulate Screenshot",
      thinking: "Assistant is thinking...",
      clearChat: "Clear Chat",
      clearConfirm: "Are you sure you want to clear the chat history?",
      yesClear: "Yes, Clear",
      cancel: "Cancel",
      suggestInfo: "PMFBY Info",
      suggestSeason: "Seasons",
      suggestDisease: "Disease Detection",
      online: "Online"
    },
    hi: {
      title: "डिजिटल खेती सहायक",
      greeting: "नमस्ते! 👋 PMFBY, फसलों या बीमारी के बारे में पूछें। मैं यहां आपकी सहायता के लिए हूं!",
      placeholder: "PMFBY, फसलों या मौसमों के बारे में पूछें...",
      send: "भेजें",
      simScreenshot: "स्क्रीनशॉट सिमुलेट करें",
      thinking: "सहायक सोच रहा है...",
      clearChat: "चैट साफ़ करें",
      clearConfirm: "क्या आप वाकई चैट इतिहास साफ़ करना चाहते हैं?",
      yesClear: "हाँ, साफ़ करें",
      cancel: "रद्द करें",
      suggestInfo: "PMFBY जानकारी",
      suggestSeason: "मौसम",
      suggestDisease: "बीमारी का पता",
      online: "ऑनलाइन"
    },
    pa: {
      title: "ਡਿਜੀਟਲ ਖੇਤੀ ਸਹਾਇਕ",
      greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! 👋 ਫਸਲਾਂ ਜਾਂ PMFBY ਬਾਰੇ ਪੁੱਛੋ। ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਲਈ ਇੱਥੇ ਹਾਂ!",
      placeholder: "ਫਸਲਾਂ ਜਾਂ ਮੌਸਮ ਬਾਰੇ ਪੁੱਛੋ...",
      send: "ਭੇਜੋ",
      simScreenshot: "ਸਕ੍ਰੀਨਸ਼ਾਟ ਸਿਮੂਲੇਟ",
      thinking: "ਸਹਾਇਕ ਸੋਚ ਰਿਹਾ ਹੈ...",
      clearChat: "ਚੈਟ ਸਾਫ ਕਰੋ",
      clearConfirm: "ਕੀ ਤੁਸੀਂ ਚੈਟ ਇਤਿਹਾਸ ਨੂੰ ਸਾਫ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
      yesClear: "ਹਾਂ, ਸਾਫ ਕਰੋ",
      cancel: "ਰੱਦ ਕਰੋ",
      suggestInfo: "PMFBY ਜਾਣਕਾਰੀ",
      suggestSeason: "ਮੌਸਮ",
      suggestDisease: "ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ",
      online: "ਆਨਲਾਈਨ"
    },
    mr: {
      title: "डिजिटल शेती सहाय्यक",
      greeting: "नमस्कार! 👋 पिके किंवा PMFBY बद्दल विचारा। मी तुमच्या मदतीसाठी येथे आहे!",
      placeholder: "पिके किंवा हंगामाबद्दल विचारा...",
      send: "पाठवा",
      simScreenshot: "स्क्रीनशॉट सिम्युलेट",
      thinking: "सहाय्यक विचार करत आहे...",
      clearChat: "चॅट साफ करा",
      clearConfirm: "तुम्हाला चॅट इतिहास साफ करायचा आहे का?",
      yesClear: "हो, साफ करा",
      cancel: "रद्द करा",
      suggestInfo: "PMFBY माहिती",
      suggestSeason: "हंगाम",
      suggestDisease: "रोग शोधणे",
      online: "ऑनलाइन"
    },
    bn: {
      title: "ডিজিটাল কৃষি সহকারী",
      greeting: "হ্যালো! 👋 ফসল বা PMFBY সম্পর্কে জিজ্ঞাসা করুন। আমি আপনাকে সাহায্য করতে প্রস্তুত!",
      placeholder: "ফসল বা ঋতু সম্পর্কে জিজ্ঞাসা করুন...",
      send: "পাঠান",
      simScreenshot: "স্ক্রিনশট সিমুলেট",
      thinking: "সহকারী চিন্তা করছে...",
      clearChat: "চ্যাট মুছুন",
      clearConfirm: "আপনি কি চ্যাট ইতিহাস মুছতে চান?",
      yesClear: "হ্যাঁ, মুছুন",
      cancel: "বাতিল",
      suggestInfo: "PMFBY তথ্য",
      suggestSeason: "ঋতু",
      suggestDisease: "রোগ শনাক্তকরণ",
      online: "অনলাইন"
    },
    gu: {
      title: "ડિજિટલ ખેતી સહાયક",
      greeting: "નમસ્તે! 👋 પાક અથવા PMFBY વિશે પૂછો. હું તમારી મદદ માટે અહીં છું!",
      placeholder: "પાક અથવા ઋતુઓ વિશે પૂછો...",
      send: "મોકલો",
      simScreenshot: "સ્ક્રીનશોટ સિમ્યુલેટ",
      thinking: "સહાયક વિચારી રહ્યો છે...",
      clearChat: "ચેટ સાફ કરો",
      clearConfirm: "શું તમે ચેટ ઇતિહાસ સાફ કરવા માંગો છો?",
      yesClear: "હા, સાફ કરો",
      cancel: "રદ કરો",
      suggestInfo: "PMFBY માહિતી",
      suggestSeason: "ઋતુઓ",
      suggestDisease: "રોગની તપાસ",
      online: "ઓનલાઇન"
    },
    ta: {
      title: "டிஜிட்டல் விவசாய உதவியாளர்",
      greeting: "வணக்கம்! 👋 பயிர்கள் அல்லது PMFBY பற்றி கேளுங்கள். நான் உங்களுக்கு உதவ இங்கே இருக்கிறேன்!",
      placeholder: "பயிர்கள் அல்லது பருவங்கள் பற்றி கேளுங்கள்...",
      send: "அனுப்பு",
      simScreenshot: "ஸ்கிரீன்ஷாட் சிமுலேட்",
      thinking: "உதவியாளர் யோசிக்கிறார்...",
      clearChat: "அரட்டையை அழி",
      clearConfirm: "அரட்டை வரலாற்றை அழிக்க வேண்டுமா?",
      yesClear: "ஆம், அழி",
      cancel: "ரத்து செய்",
      suggestInfo: "PMFBY தகவல்",
      suggestSeason: "பருவங்கள்",
      suggestDisease: "நோய் கண்டறிதல்",
      online: "ஆன்லைன்"
    },
    te: {
      title: "డిజిటల్ వ్యవసాయ సహాయకుడు",
      greeting: "నమస్తే! 👋 పంటలు లేదా PMFBY గురించి అడగండి. నేను మీకు సహాయం చేస్తాను!",
      placeholder: "పంటలు లేదా సీజన్ల గురించి అడగండి...",
      send: "పంపండి",
      simScreenshot: "స్క్రీన్‌షాట్ సిమ్యులేట్",
      thinking: "సహాయకుడు ఆలోచిస్తున్నాడు...",
      clearChat: "చాట్ క్లియర్ చేయి",
      clearConfirm: "మీరు చాట్ చరిత్రను క్లియర్ చేయాలనుకుంటున్నారా?",
      yesClear: "అవును, క్లియర్ చేయి",
      cancel: "రద్దు చేయి",
      suggestInfo: "PMFBY సమాచారం",
      suggestSeason: "సీజన్లు",
      suggestDisease: "వ్యాధి గుర్తింపు",
      online: "ఆన్‌లైన్"
    },
    kn: {
      title: "ಡಿಜಿಟಲ್ ಕೃಷಿ ಸಹಾಯಕ",
      greeting: "ನಮಸ್ಕಾರ! 👋 ಬೆಳೆಗಳು ಅಥವಾ PMFBY ಬಗ್ಗೆ ಕೇಳಿ. ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ!",
      placeholder: "ಬೆಳೆಗಳು ಅಥವಾ ಋತುಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
      send: "ಕಳುಹಿಸಿ",
      simScreenshot: "ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಸಿಮ್ಯುಲೇಟ್",
      thinking: "ಸಹಾಯಕ ಯೋಚಿಸುತ್ತಿದ್ದಾನೆ...",
      clearChat: "ಚಾಟ್ ಅಳಿಸಿ",
      clearConfirm: "ನೀವು ಚಾಟ್ ಇತಿಹಾಸವನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?",
      yesClear: "ಹೌದು, ಅಳಿಸಿ",
      cancel: "ರದ್ದುಮಾಡಿ",
      suggestInfo: "PMFBY ಮಾಹಿತಿ",
      suggestSeason: "ಋತುಗಳು",
      suggestDisease: "ರೋಗ ಪತ್ತೆ",
      online: "ಆನ್‌ಲೈನ್"
    },
    ml: {
      title: "ഡിജിറ്റൽ കൃഷി സഹായി",
      greeting: "ഹലോ! 👋 വിളകളെക്കുറിച്ചോ PMFBY യെക്കുറിച്ചോ ചോദിക്കുക. ഞാൻ നിങ്ങളെ സഹായിക്കാം!",
      placeholder: "വിളകളെക്കുറിച്ചോ സീസണുകളെക്കുറിച്ചോ ചോദിക്കുക...",
      send: "അയക്കുക",
      simScreenshot: "സ്ക്രീൻഷോട്ട് സിമുലേറ്റ്",
      thinking: "സഹായി ചിന്തിക്കുന്നു...",
      clearChat: "ചാറ്റ് ക്ലിയർ ചെയ്യുക",
      clearConfirm: "ചാറ്റ് ചരിത്രം ക്ലിയർ ചെയ്യണമെന്ന് ഉറപ്പാണോ?",
      yesClear: "അതെ, ക്ലിയർ ചെയ്യുക",
      cancel: "റദ്ദാക്കുക",
      suggestInfo: "PMFBY വിവരം",
      suggestSeason: "സീസണുകൾ",
      suggestDisease: "രോഗം കണ്ടെത്തൽ",
      online: "ഓൺലൈൻ"
    }
  };

  const content = t[language] || t['en'];

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'model', text: content.greeting }]);
    } else if (messages.length === 1 && messages[0].role === 'model') {
      // Update greeting if language changed and it's the only message
      setMessages([{ role: 'model', text: content.greeting }]);
    }
  }, [language, content.greeting]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await getAssistantResponse(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', text: response || (language === 'en' ? "I'm sorry, I couldn't process that." : "क्षमा करें, मैं उसे संसाधित नहीं कर सका।") }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: language === 'en' ? "Sorry, I'm having trouble connecting right now." : "क्षमा करें, मुझे अभी जुड़ने में समस्या हो रही है।" }]);
    } finally {
      setLoading(false);
    }
  };

  const simulateScreenshot = () => {
    const msg = language === 'en' 
      ? "I've analyzed your current dashboard. It looks like you're interested in PMFBY premiums. Would you like to see a summary of enrollment trends for this season? 📊"
      : "मैंने आपके वर्तमान डैशबोर्ड का विश्लेषण किया है। ऐसा लगता है कि आप PMFBY प्रीमियम में रुचि रखते हैं। क्या आप इस सीजन के लिए नामांकन रुझानों का सारांश देखना चाहेंगे? 📊";
    
    setMessages(prev => [...prev, { role: 'model', text: msg }]);
  };

  const clearChat = () => {
    setMessages([{ role: 'model', text: content.greeting }]);
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] min-h-[750px] flex flex-col pb-4 relative">
      <Card className="flex-grow flex flex-col overflow-hidden border-primary/20 shadow-2xl mb-4">
        <CardHeader className="border-b bg-primary/5 flex flex-row items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg">{content.title}</CardTitle>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-muted-foreground font-medium">{content.online}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(true)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{content.clearChat}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={simulateScreenshot} className="hidden sm:flex">
              <ImageIcon className="mr-2 h-4 w-4" /> {content.simScreenshot}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-grow p-0 overflow-hidden relative bg-muted/5">
          <ScrollArea className="h-full p-4 sm:p-8" ref={scrollRef}>
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[90%] sm:max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                      m.role === 'user' ? 'bg-muted border border-border' : 'bg-primary text-primary-foreground'
                    }`}>
                      {m.role === 'user' ? <User className="h-4 w-4 sm:h-5 sm:w-5" /> : <Bot className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 text-sm sm:text-base shadow-sm leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-card text-foreground border border-border rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
                      <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="bg-card border border-border text-foreground rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 sm:p-6 border-t bg-card">
          <form 
            className="flex w-full items-center space-x-3 max-w-4xl mx-auto"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <Input
              placeholder={content.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow bg-muted/30 border-primary/10 h-11 sm:h-12 focus-visible:ring-primary"
              disabled={loading}
            />
            <Button type="submit" size="icon" className="h-11 w-11 sm:h-12 sm:w-12 rounded-full" disabled={loading || !input.trim()}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
        </CardFooter>
      </Card>
      
      {/* Quick Suggestions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
        <Badge 
          variant="secondary" 
          className="cursor-pointer hover:bg-primary/20 transition-colors py-2 px-4 text-xs sm:text-sm font-medium border border-primary/10"
          onClick={() => setInput(language === 'en' ? "Tell me about PMFBY" : (t[language]?.suggestInfo || "Tell me about PMFBY"))}
        >
          <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" /> {content.suggestInfo}
        </Badge>
        <Badge 
          variant="secondary" 
          className="cursor-pointer hover:bg-primary/20 transition-colors py-2 px-4 text-xs sm:text-sm font-medium border border-primary/10"
          onClick={() => setInput(language === 'en' ? "What is Kharif season?" : (t[language]?.suggestSeason || "What is Kharif?"))}
        >
          <MessageSquare className="mr-2 h-3.5 w-3.5 text-primary" /> {content.suggestSeason}
        </Badge>
        <Badge 
          variant="secondary" 
          className="cursor-pointer hover:bg-primary/20 transition-colors py-2 px-4 text-xs sm:text-sm font-medium border border-primary/10"
          onClick={() => setInput(language === 'en' ? "How to detect crop disease?" : (t[language]?.suggestDisease || "Detect disease"))}
        >
          <Bot className="mr-2 h-3.5 w-3.5 text-primary" /> {content.suggestDisease}
        </Badge>
      </div>
    </div>
  );
};
