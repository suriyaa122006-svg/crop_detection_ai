import React, { useState } from 'react';
import { ThemeProvider } from '@/src/lib/ThemeContext';
import { Navbar } from '@/src/components/layout/Navbar';
import { Footer } from '@/src/components/layout/Footer';
import { Home } from '@/src/components/Home';
import { CropAnalytics } from '@/src/components/analytics/CropAnalytics';
import { PremiumCalculator } from '@/src/components/calculator/PremiumCalculator';
import { Assistant } from '@/src/components/assistant/Assistant';
import { InsurancePlans } from '@/src/components/insurance/InsurancePlans';
import { WeatherWidget } from '@/src/components/dashboard/WeatherWidget';
import { SignIn } from '@/src/components/auth/SignIn';
import { Register } from '@/src/components/auth/Register';
import { Profile } from '@/src/components/profile/Profile';
import { PreviousReports } from '@/src/components/analytics/PreviousReports';
import { motion, AnimatePresence } from 'motion/react';
import { Search, User, LogIn, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LanguageCode } from '@/src/lib/languages';

export default function App() {
  React.useEffect(() => {
    console.log('APP LOADED');
  }, []);

  const normalizeUser = (userData: any) => {
    if (!userData) {
      return null;
    }

    const registrationData = userData.registrationData || {};

    return {
      ...registrationData,
      ...userData,
      name: userData.name || registrationData.name,
      mobile: userData.mobile || registrationData.mobile,
      email: userData.email || registrationData.email,
      photo: userData.photo || registrationData.photo,
      state: userData.state || registrationData.state,
      district: userData.district || registrationData.district,
      townName: userData.townName || registrationData.townName,
      villageName: userData.villageName || registrationData.villageName,
      bankName: userData.bankName || registrationData.bankName,
      branchName: userData.branchName || registrationData.branchName,
      bankAcc: userData.bankAcc || registrationData.bankAcc,
      bankType: userData.bankType || registrationData.bankType,
      aadhar: userData.aadhar || registrationData.aadhar
    };
  };

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') {
      return 'signin';
    }

    return localStorage.getItem('user') ? 'home' : 'signin';
  });
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [user, setUser] = useState<any>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return null;
    }

    try {
      return normalizeUser(JSON.parse(storedUser));
    } catch {
      return null;
    }
  });

  const smoothScrollToTop = () => {
    const duration = 1500; // 1.5 seconds for slower transition
    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    const scroll = (timestamp: number) => {
      const currentTime = 'now' in window.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, (currentTime - startTime) / duration);
      const ease = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time;
      
      window.scrollTo(0, Math.ceil(ease * (0 - start) + start));
      if (window.pageYOffset === 0) return;
      requestAnimationFrame(scroll);
    };

    requestAnimationFrame(scroll);
  };

  // Scroll to top when activeTab changes
  React.useEffect(() => {
    smoothScrollToTop();
  }, [activeTab]);

  const handleLogin = (userData: any) => {
    // Enrich user data with mock defaults if fields are missing
    const enrichedUser = normalizeUser({
      ...userData,
      email: userData.email || 'farmer.help@example.com',
      aadhar: userData.aadhar || 'XXXX-XXXX-4521',
      bankName: userData.bankName || 'State Bank of India',
      branchName: userData.branchName || 'Nagpur Central',
      bankAcc: userData.bankAcc || 'XXXXXXXX4582',
      state: userData.state || 'Maharashtra',
      district: userData.district || 'Nagpur',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'
    });
    localStorage.setItem('user', JSON.stringify(enrichedUser));
    setUser(enrichedUser);
    setActiveTab('home');
  };

  const handleUpdateUser = (updatedData: any) => {
    const nextUser = normalizeUser({
      ...(user || {}),
      ...updatedData
    });

    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('signin');
  };

  const handleTabChange = (tab: string) => {
    if (tab !== 'analytics') {
      setSelectedCrop(null);
    }
    setActiveTab(tab);
  };

  const handleCropSelect = (cropId: string) => {
    setSelectedCrop(cropId);
    setActiveTab('analytics');
  };

  const handleResetCrop = () => {
    setSelectedCrop(null);
  };

  const backToHomeT: Record<string, string> = {
    en: 'Back to Home',
    hi: 'मुख्य पृष्ठ पर वापस',
    ta: 'முகப்பு பக்கத்திற்கு திரும்பு',
    te: 'హోమ్ పేజీకి తిరిగి వెళ్ళు',
    kn: 'ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ',
    ml: 'ഹോം പേജിലേക്ക് മടങ്ങുക',
    pa: 'ਮੁੱਖ ਪੰਨੇ ਤੇ ਵਾਪਸ',
    gu: 'મુખ્ય પૃષ્ઠ પર પાછા ફરો',
    bn: 'হোম পেজে ফিরে যান',
    mr: 'मुख्य पृष्ठावर परत जा'
  };

  const renderContent = () => {
    if (!user) {
      if (activeTab === 'register') {
        return (
          <Register
            language={language}
            setActiveTab={handleTabChange}
            onLogin={handleLogin}
          />
        );
      }

      return (
        <SignIn
          language={language} 
          setActiveTab={handleTabChange}
          onLogin={handleLogin}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={handleTabChange} language={language} onCropSelect={handleCropSelect} user={user} />;
      case 'analytics':
        return <CropAnalytics language={language} preselectedCrop={selectedCrop} onReset={handleResetCrop} />;
      case 'calculator':
        return <PremiumCalculator language={language} />;
      case 'insurance':
        return <InsurancePlans language={language} />;
      case 'assistant':
        return <Assistant language={language} />;
      case 'reports':
        return <PreviousReports language={language} onBack={() => handleTabChange('home')} />;
      case 'profile':
        return <Profile 
          language={language} 
          user={user} 
          onUpdateUser={handleUpdateUser} 
          onLogout={handleLogout}
          onBack={() => setActiveTab('home')}
        />;
      default:
        return <Home setActiveTab={handleTabChange} language={language} onCropSelect={handleCropSelect} user={user} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
          language={language} 
          setLanguage={setLanguage} 
          user={user}
          onLogout={handleLogout}
        />
        
        <main className="container mx-auto px-4 py-8">
          {activeTab !== 'home' && activeTab !== 'signin' && activeTab !== 'register' && activeTab !== 'reports' && user && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => handleTabChange('home')}
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all mb-6 group bg-primary/5 px-4 py-2 rounded-full w-fit border border-primary/10"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              {backToHomeT[language] || backToHomeT['en']}
            </motion.button>
          )}

          {activeTab === 'home' && user && (
            <div className="mb-4">
              <WeatherWidget language={language} user={user} />
            </div>
          )}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer language={language} setActiveTab={handleTabChange} />
      </div>
    </ThemeProvider>
  );
}
