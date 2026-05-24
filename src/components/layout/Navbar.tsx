import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/src/lib/ThemeContext';
import { Sun, Moon, SunMedium, Menu, X, Languages, Check, Home as HomeIcon, Brain, ShieldCheck, Calculator, Bot, MessageSquare, ChevronDown, LayoutGrid, Sprout, UserCircle } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { languages, LanguageCode } from '@/src/lib/languages';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  user: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, language, setLanguage, user, onLogout }) => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const t: Record<string, any> = {
    en: { nav: { analytics: 'AI Analytics', insurance: 'Insurance', calculator: 'Calculator', assistant: 'Assistant' }, auth: { signin: 'Sign In', start: 'Get Started', logout: 'Logout', user: 'User' } },
    hi: { nav: { analytics: 'एआई विश्लेषण', insurance: 'बीमा', calculator: 'कैलकुलेटर', assistant: 'सहायक' }, auth: { signin: 'साइन इन', start: 'शुरू करें', logout: 'लॉग आउट', user: 'उपयोगकर्ता' } },
    ta: { nav: { analytics: 'AI பகுப்பாய்வு', insurance: 'காப்பீடு', calculator: 'கால்குலேட்டர்', assistant: 'உதவியாளர்' }, auth: { signin: 'உள்நுழைக', start: 'தொடங்குங்கள்', logout: 'வெளியேறு', user: 'பயனர்' } },
    te: { nav: { analytics: 'AI విశ్లేషణ', insurance: 'భీమా', calculator: 'క్యాలిక్యులేటర్', assistant: 'సహాయకుడు' }, auth: { signin: 'సైన్ ఇన్', start: 'ప్రారంభించండి', logout: 'లాగ్ అవుట్', user: 'వినియోగదారు' } },
    kn: { nav: { analytics: 'AI ವಿಶ್ಲೇಷಣೆ', insurance: 'ವಿಮೆ', calculator: 'ಕ್ಯಾಲ್ಕುಲೇಟರ್', assistant: 'ಸಹಾಯಕ' }, auth: { signin: 'ಸೈನ್ ಇನ್', start: 'ಪ್ರಾರಂಭಿಸಿ', logout: 'ಲಾಗ್ ಔಟ್', user: 'ಬಳಕೆದಾರ' } },
    ml: { nav: { analytics: 'AI അനലിറ്റിക്സ്', insurance: 'ഇൻഷുറൻസ്', calculator: 'കാൽക്കുലേറ്റർ', assistant: 'അസിസ്റ്റന്റ്' }, auth: { signin: 'സൈൻ ഇൻ', start: 'ആരംഭിക്കുക', logout: 'ലോഗ് ഔട്ട്', user: 'ഉപയോക്താവ്' } },
    pa: { nav: { analytics: 'AI ਵਿਸ਼ਲੇਸ਼ਣ', insurance: 'ਬੀਮਾ', calculator: 'ਕੈਲਕੁਲੇਟਰ', assistant: 'ਸਹਾਇਕ' }, auth: { signin: 'ਸਾਈਨ ਇਨ', start: 'ਸ਼ੁਰੂ ਕਰੋ', logout: 'ਲੌਗ ਆਉਟ', user: 'ਉਪਭੋਗਤਾ' } },
    gu: { nav: { analytics: 'AI વિશ્લેષણ', insurance: 'વીમો', calculator: 'કેલ્ક્યુલેટર', assistant: 'સહાયક' }, auth: { signin: 'સાઇન ઇન', start: 'શરૂ કરો', logout: 'લોગ આઉટ', user: 'વપરાશકર્તા' } },
    bn: { nav: { analytics: 'AI বিশ্লেষণ', insurance: 'বীমা', calculator: 'ক্যালকুলেটর', assistant: 'সহকারী' }, auth: { signin: 'সাইন ইন', start: 'শুরু করুন', logout: 'লগ আউট', user: 'ব্যবহারকারী' } },
    mr: { nav: { analytics: 'AI विश्लेषण', insurance: 'विमा', calculator: 'कॅल्क्युलेटर', assistant: 'सहाय्यक' }, auth: { signin: 'साइन इन', start: 'सुरू करा', logout: 'लॉग आउट', user: 'वापरकर्ता' } }
  };

  const content = t[language] || t['en'];

  const navItems = [
    { id: 'analytics', label: content.nav.analytics, hasDropdown: true },
    { id: 'insurance', label: content.nav.insurance, hasDropdown: true },
    { id: 'calculator', label: content.nav.calculator, hasDropdown: true },
    { id: 'assistant', label: content.nav.assistant, hasDropdown: false },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-black text-white py-2 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab(user ? 'home' : 'landing')}
          >
            <div className="relative">
              <Sprout className="h-8 w-8 text-[#22C55E] group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute -inset-1 bg-[#22C55E]/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-bold tracking-tight text-white">AgriLens AI</span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Smart Farming</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 ml-12 flex-grow">
            {user && navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center gap-1 text-[15px] font-medium transition-colors duration-200",
                  activeTab === item.id 
                    ? "text-white" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="h-4 w-4 opacity-50" />}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <div className="relative bg-[#18181B] p-1 rounded-full flex items-center shadow-lg border border-zinc-800 w-64 h-10 max-w-full">
                  <div className="absolute inset-y-1 left-1 right-1 pointer-events-none w-1/2 animate-none">
                    <motion.div 
                      className="h-full bg-[#22C55E] rounded-full shadow-md"
                      initial={false}
                      animate={{
                        x: (activeTab === 'register') ? '100%' : 0,
                      }}
                      style={{
                        width: '100%'
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => setActiveTab('signin')}
                    className={`relative z-10 w-1/2 h-full text-xs font-black text-center rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center border-none bg-transparent ${
                      (activeTab !== 'register') ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {content.auth.signin}
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className={`relative z-10 w-1/2 h-full text-xs font-black text-center rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center border-none bg-transparent ${
                      (activeTab === 'register') ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {content.auth.start}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div 
                    className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 cursor-pointer hover:bg-white/20 transition-all active:scale-95"
                    onClick={() => setActiveTab('profile')}
                  >
                    <UserCircle className="h-5 w-5 text-[#22C55E]" />
                    <span className="text-sm font-bold truncate max-w-[120px]">
                      {user.name || user.mobile || content.auth.user}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-red-500/20 hover:text-red-400 border border-white/20 px-4 h-10 rounded-md font-semibold text-sm transition-colors"
                    onClick={onLogout}
                  >
                    {content.auth.logout}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 border-l border-white/10 pl-4 ml-2">
              {/* Language Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger 
                  className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-gray-400 hover:text-white hover:bg-white/10")}
                  title="Switch Language"
                >
                  <Languages className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className="hover:bg-zinc-800 focus:bg-zinc-800"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{lang.nativeName}</span>
                        <span className="text-[10px] text-gray-400">{lang.name}</span>
                      </div>
                      {language === lang.code && <Check className="h-4 w-4 ml-2 text-[#22C55E]" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-gray-400 hover:text-white hover:bg-white/10")}>
                  {theme === 'light' && <Sun className="h-5 w-5" />}
                  {theme === 'dark' && <Moon className="h-5 w-5" />}
                  {theme === 'sunlight' && <SunMedium className="h-5 w-5 text-yellow-500" />}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
                  <DropdownMenuItem onClick={() => setTheme('light')} className="hover:bg-zinc-800 focus:bg-zinc-800">
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')} className="hover:bg-zinc-800 focus:bg-zinc-800">
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('sunlight')} className="hover:bg-zinc-800 focus:bg-zinc-800">
                    <SunMedium className="mr-2 h-4 w-4" />
                    <span>Sunlight Mode</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-black overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {user && navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    activeTab === item.id 
                      ? "bg-white/10 text-white" 
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="h-4 w-4 opacity-50" />}
                </button>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                {!user ? (
                  <div className="relative bg-[#18181B] p-1 rounded-full flex items-center shadow-lg border border-zinc-800 w-full h-11">
                    <div className="absolute inset-y-1 left-1 right-1 pointer-events-none w-1/2">
                      <motion.div 
                        className="h-full bg-[#22C55E] rounded-full shadow-md animate-none"
                        initial={false}
                        animate={{
                          x: (activeTab === 'register') ? '100%' : 0,
                        }}
                        style={{
                          width: '100%'
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveTab('signin');
                        setIsMenuOpen(false);
                      }}
                      className={`relative z-10 w-1/2 h-full text-xs font-black text-center rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center border-none bg-transparent ${
                        (activeTab !== 'register') ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {content.auth.signin}
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveTab('register');
                        setIsMenuOpen(false);
                      }}
                      className={`relative z-10 w-1/2 h-full text-xs font-black text-center rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center border-none bg-transparent ${
                        (activeTab === 'register') ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {content.auth.start}
                    </button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="text-black bg-white border-zinc-200 hover:bg-red-500/20 hover:text-red-500 dark:text-white dark:bg-transparent dark:border-white/20 dark:hover:text-red-400"
                    onClick={onLogout}
                  >
                    {content.auth.logout}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
