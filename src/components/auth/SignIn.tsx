import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, Phone, RefreshCw, X, ArrowRight } from 'lucide-react';
import { apiUrl } from '@/src/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LanguageCode } from '@/src/lib/languages';

console.log('SIGNIN LOADED');

interface SignInProps {
  language: LanguageCode;
  setActiveTab: (tab: string) => void;
  onLogin: (user: any) => void;
}

export const SignIn: React.FC<SignInProps> = ({ language, setActiveTab, onLogin }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'form' | 'confirm'>('form');
  const [deleteMobile, setDeleteMobile] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotMobile, setForgotMobile] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [isRequestingForgot, setIsRequestingForgot] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [tempExpiresAt, setTempExpiresAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  const generateCaptcha = React.useCallback(() => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(result);
    setCaptchaInput('');
    setError(null);
  }, []);

  React.useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
    setDeleteStep('form');
    setDeleteMobile('');
    setDeletePassword('');
    setDeleteConfirmPassword('');
    setDeleteError(null);
  };

  const openForgotDialog = () => {
    setIsForgotOpen(true);
    setForgotMobile('');
    setForgotError(null);
    setTempPassword(null);
    setTempExpiresAt(null);
    setRemainingSeconds(0);
  };

  const closeForgotDialog = () => {
    setIsForgotOpen(false);
    setForgotError(null);
    setTempPassword(null);
    setTempExpiresAt(null);
    setRemainingSeconds(0);
  };

  React.useEffect(() => {
    let timer: any = null;
    if (tempExpiresAt) {
      const update = () => {
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((tempExpiresAt - now) / 1000));
        setRemainingSeconds(diff);
        if (diff <= 0 && timer) {
          clearInterval(timer);
          timer = null;
        }
      };
      update();
      timer = setInterval(update, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [tempExpiresAt]);

  const handleForgotSubmit = async () => {
    setForgotError(null);
    if (!forgotMobile || forgotMobile.length !== 10) {
      setForgotError('Please enter a valid 10-digit mobile number');
      return;
    }

    // If we already have a temp password and it's not expired, just keep showing it
    if (tempPassword && tempExpiresAt && tempExpiresAt > Date.now()) {
      return;
    }

    setIsRequestingForgot(true);
    try {
      const res = await fetch(apiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: forgotMobile })
      });
      const data = await res.json();
      if (!res.ok) {
        setForgotError(data.message || data.error || 'Unable to generate temporary password');
        return;
      }

      if (data.tempPassword && data.expiresAt) {
        setTempPassword(data.tempPassword);
        setTempExpiresAt(Number(data.expiresAt));
      } else {
        setForgotError('Unexpected response from server');
      }
    } catch (err) {
      setForgotError('Unable to request temporary password right now');
    } finally {
      setIsRequestingForgot(false);
    }
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteStep('form');
    setDeleteError(null);
  };

  const handleDeleteAccount = async () => {
    if (deleteStep === 'form') {
      if (!deleteMobile || !deletePassword || !deleteConfirmPassword) {
        setDeleteError('Please enter mobile number, password, and confirm password.');
        return;
      }

      if (deletePassword !== deleteConfirmPassword) {
        setDeleteError('Password and confirm password must match.');
        return;
      }

      setDeleteError(null);
      setDeleteStep('confirm');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(apiUrl('/api/auth/delete-account'), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: deleteMobile,
          password: deletePassword,
          confirmPassword: deleteConfirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.message || data.error || 'Failed to delete account');
        return;
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      closeDeleteDialog();
      setMobile('');
      setPassword('');
      setCaptchaInput('');
      setError(null);
      generateCaptcha();
    } catch {
      setDeleteError('Unable to delete account right now. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLoginSubmit = async (
    event?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    event?.preventDefault();
    console.log('LOGIN CLICKED');
    if (!mobile || !password) {
      setError(content.errors.required);
      return;
    }

    // Indian Mobile Number Regex (Starts with 6-9, followed by 9 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (mobile.length !== 10) {
      setError(language === 'en' ? 'Mobile number must be exactly 10 digits' : 'मोबाइल नंबर ठीक 10 अंकों का होना चाहिए');
      return;
    }
    if (!mobileRegex.test(mobile)) {
      setError(content.errors.invalidMobile);
      return;
    }

    if (captchaInput.toUpperCase() !== generatedCaptcha) {
      setError(content.errors.captcha);
      generateCaptcha();
      return;
    }

    try{
      const res = await fetch(apiUrl('/api/auth/login'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mobile,password})});
      const data = await res.json();
      if(!res.ok){
        setError(data.message || "Login failed");
        generateCaptcha();
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
      setActiveTab("home");
    }catch(err){
      setError("User Not Found! Please sign Up.");
    }
  };

  const t: Record<string, any> = {
    en: {
      title: "Sign In",
      farmerLogin: "Are you a Farmer? Login from here",
      clickHere: "Click Here",
      mobileLabel: "Mobile No.",
      passwordLabel: "Password",
      captchaLabel: "Captcha",
      captchaPlaceholder: "Enter Captcha Code",
      mobilePlaceholder: "Enter Mobile No.",
      passwordPlaceholder: "Enter Password",
      login: "Login",
      forgot: "Forgot Password?",
      deactivate: "Deactivate Account",
      noAccount: "Don't have an account?",
      register: "Register Now",
      errors: {
        required: "Please enter mobile number and password.",
        invalidMobile: "Please enter a valid 10-digit mobile number.",
        captcha: "Incorrect captcha code."
      }
    },
    hi: {
      title: "साइन इन करें",
      farmerLogin: "क्या आप किसान हैं? यहाँ से लॉगिन करें",
      clickHere: "यहाँ क्लिक करें",
      mobileLabel: "मोबाइल नंबर",
      passwordLabel: "पासवर्ड",
      captchaLabel: "कैप्चा",
      captchaPlaceholder: "कैप्चा कोड दर्ज करें",
      mobilePlaceholder: "मोबाइल नंबर दर्ज करें",
      passwordPlaceholder: "पासवर्ड दर्ज करें",
      login: "लॉगिन",
      forgot: "पासवर्ड भूल गए?",
      deactivate: "खाता निष्क्रिय करें",
      noAccount: "खाता नहीं है?",
      register: "अभी पंजीकरण करें",
      errors: {
        required: "कृपया मोबाइल नंबर और पासवर्ड दर्ज करें।",
        invalidMobile: "कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।",
        captcha: "गलत कैप्चा कोड।"
      }
    },
    pa: {
      title: "ਸਾਈਨ ਇਨ ਕਰੋ",
      farmerLogin: "ਕੀ ਤੁਸੀਂ ਕਿਸਾਨ ਹੋ? ਇੱਥੋਂ ਲੌਗਇਨ ਕਰੋ",
      clickHere: "ਇੱਥੇ ਕਲਿੱਕ ਕਰੋ",
      mobileLabel: "ਮੋਬਾਈਲ ਨੰਬਰ",
      passwordLabel: "ਪਾਸਵਰਡ",
      captchaLabel: "ਕੈਪਚਾ",
      captchaPlaceholder: "ਕੈਪਚਾ ਕੋਡ ਦਰਜ ਕਰੋ",
      mobilePlaceholder: "ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ",
      passwordPlaceholder: "ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ",
      login: "ਲੌਗਇਨ",
      forgot: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
      deactivate: "ਖਾਤਾ ਅਕਿਰਿਆਸ਼ੀਲ ਕਰੋ",
      noAccount: "ਖਾਤਾ ਨਹੀਂ ਹੈ?",
      register: "ਹੁਣੇ ਰਜਿਸਟਰ ਕਰੋ",
      errors: {
        required: "ਕਿਰਪਾ ਕਰਕੇ ਮੋਬਾਈਲ ਨੰਬਰ ਅਤੇ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ।",
        invalidMobile: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ 10-ਅੰਕੀ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ।",
        captcha: "ਗਲਤ ਕੈਪਚਾ ਕੋਡ।"
      }
    },
    mr: {
      title: "साइन इन करा",
      farmerLogin: "तुम्ही शेतकरी आहात का? इथून लॉगिन करा",
      clickHere: "येथे क्लिक करा",
      mobileLabel: "मोबाईल नंबर",
      passwordLabel: "पासवर्ड",
      captchaLabel: "कॅप्चा",
      captchaPlaceholder: "कॅप्चा कोड प्रविष्ट करा",
      mobilePlaceholder: "मोबाईल नंबर प्रविष्ट करा",
      passwordPlaceholder: "पासवर्ड प्रविष्ट करा",
      login: "लॉगिन",
      forgot: "पासवर्ड विसरलात?",
      deactivate: "खाते निष्क्रिय करा",
      noAccount: "खाते नाही?",
      register: "आता नोंदणी करा",
      errors: {
        required: "कृपया मोबाईल नंबर आणि पासवर्ड प्रविष्ट करा।",
        invalidMobile: "कृपया वैध 10-अंकी मोबाईल नंबर प्रविष्ट करा।",
        captcha: "चुकीचा कॅप्चा कोड।"
      }
    },
    bn: {
      title: "সাইন ইন করুন",
      farmerLogin: "আপনি কি একজন কৃষক? এখান থেকে লগইন করুন",
      clickHere: "এখানে ক্লিক করুন",
      mobileLabel: "মোবাইল নম্বর",
      passwordLabel: "পাসওয়ার্ড",
      captchaLabel: "ক্যাপচা",
      captchaPlaceholder: "ক্যাপচা কোড লিখুন",
      mobilePlaceholder: "মোবাইল নম্বর লিখুন",
      passwordPlaceholder: "পাসওয়ার্ড লিখুন",
      login: "লগইন",
      forgot: "পাসওয়ার্ড ভুলে গেছেন?",
      deactivate: "অ্যাকাউন্ট নিষ্ক্রিয় করুন",
      noAccount: "অ্যাকাউন্ট নেই?",
      register: "এখন নিবন্ধন করুন",
      errors: {
        required: "অনুগ্রহ করে মোবাইল নম্বর এবং পাসওয়ার্ড লিখুন।",
        invalidMobile: "অনুগ্রহ করে একটি বৈধ ১০-অঙ্কের মোবাইল নম্বর লিখুন।",
        captcha: "ভুল ক্যাপচা কোড।"
      }
    },
    gu: {
      title: "સાઇન ઇન કરો",
      farmerLogin: "શું તમે ખેડૂત છો? અહીંથી લોગિન કરો",
      clickHere: "અહીં ક્લિક કરો",
      mobileLabel: "મોબાઈલ નંબર",
      passwordLabel: "પાસવર્ડ",
      captchaLabel: "કેપ્ચા",
      captchaPlaceholder: "કેપ્ચા કોડ દાખલ કરો",
      mobilePlaceholder: "મોબાઈલ નંબર દાખલ કરો",
      passwordPlaceholder: "પાસવર્ડ દાખલ કરો",
      login: "લોગિન",
      forgot: "પાસવર્ડ ભૂલી ગયા છો?",
      deactivate: "ખાતું નિષ્ક્રિય કરો",
      noAccount: "ખાતું નથી?",
      register: "હવે નોંધણી કરો",
      errors: {
        required: "કૃપા કરીને મોબાઈલ નંબર અને પાસવર્ડ દાખલ કરો.",
        invalidMobile: "કૃપા કરીને માન્ય 10-અંકનો મોબાઈલ નંબર દાખલ કરો.",
        captcha: "ખોટો કેપ્ચા કોડ."
      }
    },
    ta: {
      title: "உள்நுழைக",
      farmerLogin: "நீங்கள் விவசாயியா? இங்கிருந்து உள்நுழையவும்",
      clickHere: "இங்கே கிளிக் செய்க",
      mobileLabel: "கைபேசி எண்",
      passwordLabel: "கடவுச்சொல்",
      captchaLabel: "கேப்ட்சா",
      captchaPlaceholder: "கேப்ட்சா குறியீட்டை உள்ளிடவும்",
      mobilePlaceholder: "கைபேசி எண்ணை உள்ளிடவும்",
      passwordPlaceholder: "கடவுச்சொல்லை உள்ளிடவும்",
      login: "உள்நுழைக",
      forgot: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
      deactivate: "கணக்கை முடக்கவும்",
      noAccount: "கணக்கு இல்லையா?",
      register: "இப்போதே பதிவு செய்யுங்கள்",
      errors: {
        required: "கைபேசி எண் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.",
        invalidMobile: "செல்லுபடியாகும் 10 இலக்க கைபேசி எண்ணை உள்ளிடவும்.",
        captcha: "தவறான கேப்ட்சா குறியீடு."
      }
    },
    te: {
      title: "సైన్ ఇన్ చేయండి",
      farmerLogin: "మీరు రైతులా? ఇక్కడ నుండి లాగిన్ అవ్వండి",
      clickHere: "ఇక్కడ క్లిక్ చేయండి",
      mobileLabel: "మొబైల్ నంబర్",
      passwordLabel: "పాస్‌వర్డ్",
      captchaLabel: "క్యాప్చా",
      captchaPlaceholder: "క్యాప్చా కోడ్‌ను నమోదు చేయండి",
      mobilePlaceholder: "మొబైల్ నంబర్ నమోదు చేయండి",
      passwordPlaceholder: "పాస్‌వర్డ్ నమోదు చేయండి",
      login: "లాగిన్",
      forgot: "పాస్‌వర్డ్ మర్చిపోయారా?",
      deactivate: "ఖాతాను నిష్క్రియం చేయండి",
      noAccount: "ఖాతా లేదా?",
      register: "ఇప్పుడే నమోదు చేసుకోండి",
      errors: {
        required: "దయచేసి మొబైల్ నంబర్ మరియు పాస్‌వర్డ్ నమోదు చేయండి.",
        invalidMobile: "దయచేసి సరైన 10-అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి.",
        captcha: "తప్పు క్యాప్చా కోడ్."
      }
    },
    kn: {
      title: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
      farmerLogin: "ನೀವು ರೈತರೇ? ಇಲ್ಲಿಂದ ಲಾಗಿನ್ ಮಾಡಿ",
      clickHere: "ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ",
      mobileLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      passwordLabel: "ಪಾಸ್‌ವರ್ಡ್",
      captchaLabel: "ಕ್ಯಾಪ್ಚಾ",
      captchaPlaceholder: "ಕ್ಯಾಪ್ಚಾ ಕೋಡ್ ನಮೂದಿಸಿ",
      mobilePlaceholder: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ",
      passwordPlaceholder: "ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
      login: "ಲಾಗಿನ್",
      forgot: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
      deactivate: "ಖಾತೆಯನ್ನು ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಿ",
      noAccount: "ಖಾತೆ ಹೊಂದಿಲ್ಲವೇ?",
      register: "ಈಗಲೇ ನೋಂದಾಯಿಸಿ",
      errors: {
        required: "ದಯವಿಟ್ಟು ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.",
        invalidMobile: "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
        captcha: "ತಪ್ಪಾದ ಕ್ಯಾಪ್ಚಾ ಕೋಡ್."
      }
    },
    ml: {
      title: "സൈൻ ഇൻ ചെയ്യുക",
      farmerLogin: "നിങ്ങൾ ഒരു കർഷകനാണോ? ഇവിടെ നിന്ന് ലോഗിൻ ചെയ്യുക",
      clickHere: "ഇവിടെ ക്ലിക്ക് ചെയ്യുക",
      mobileLabel: "മൊബൈൽ നമ്പർ",
      passwordLabel: "പാസ്‌വേഡ്",
      captchaLabel: "ക്യാപ്‌ച",
      captchaPlaceholder: "ക്യാപ്‌ച കോഡ് നൽകുക",
      mobilePlaceholder: "മൊബൈൽ നമ്പർ നൽകുക",
      passwordPlaceholder: "പാസ്‌വേഡ് നൽകുക",
      login: "ലോഗിൻ",
      forgot: "പാസ്‌വേഡ് മറന്നോ?",
      deactivate: "അക്കൗണ്ട് നിർജ്ജീവമാക്കുക",
      noAccount: "അക്കൗണ്ട് ഇല്ലേ?",
      register: "ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യുക",
      errors: {
        required: "മൊബൈൽ നമ്പറും പാസ്‌വേഡും നൽകുക.",
        invalidMobile: "സാധുവായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക.",
        captcha: "തെറ്റായ ക്യാപ്‌ച കോഡ്."
      }
    }
  };

  const content = t[language] || t['en'];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="overflow-hidden border-none shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Side - Visual */}
          <div className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-800 p-8 flex flex-col items-center justify-center text-white text-center space-y-6 min-h-[400px]">
            <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl font-extrabold leading-tight drop-shadow-md">{content.farmerLogin}</h2>
              <Button 
                size="lg" 
                className="rounded-full bg-white text-black hover:bg-gray-100 font-extrabold px-8 shadow-xl transition-all hover:scale-105 border-none dark:bg-white dark:text-black dark:hover:bg-gray-100 mt-2"
                onClick={() => setActiveTab('register')}
              >
                {content.clickHere} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="relative z-10 mt-8">
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80" 
                alt="Farmer Family" 
                className="rounded-2xl shadow-2xl max-w-[280px] mx-auto border-4 border-white/30"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 bg-background relative flex flex-col justify-center">
            <div className="space-y-8 max-w-sm mx-auto w-full">
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{content.title}</h1>
                <div className="h-1.5 w-16 bg-primary rounded-full shadow-sm"></div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-bold text-destructive bg-destructive/10 p-2 rounded border border-destructive/20"
                >
                  {error}
                </motion.p>
              )}

              <form className="space-y-5" onSubmit={handleLoginSubmit}>
                <div className="space-y-2.5">
                  <Label htmlFor="mobile" className="text-sm font-semibold text-foreground/80">{content.mobileLabel}</Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="mobile" 
                      placeholder={content.mobilePlaceholder} 
                      className="pl-10 bg-muted/30 border-muted focus:bg-background transition-all"
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value);
                        setError(null);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">{content.passwordLabel}</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder={content.passwordPlaceholder} 
                      className="pl-10 bg-muted/30 border-muted focus:bg-background transition-all"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="captcha" className="text-sm font-semibold text-foreground/80">{content.captchaLabel}</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="captcha" 
                      placeholder={content.captchaPlaceholder}
                      className="bg-muted/30 border-muted focus:bg-background transition-all"
                      value={captchaInput}
                      onChange={(e) => {
                        setCaptchaInput(e.target.value);
                        setError(null);
                      }}
                    />
                    <div className="flex items-center gap-2 bg-muted px-4 rounded-md border border-muted/50 select-none shadow-sm min-w-[120px] justify-between">
                      <span className="font-mono font-bold tracking-widest text-lg italic line-through decoration-primary/30 text-foreground/70">{generatedCaptcha}</span>
                      <RefreshCw 
                        className="h-4 w-4 text-primary cursor-pointer hover:rotate-180 transition-transform duration-500 shrink-0" 
                        onClick={generateCaptcha}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-7 text-lg shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                  onClick={handleLoginSubmit}
                >
                  {content.login}
                </Button>

                <div className="flex flex-col items-center gap-2 pt-2">
                  <button type="button" className="text-sm text-primary hover:underline font-medium" onClick={openForgotDialog}>
                    {content.forgot}
                  </button>
                  <button
                    type="button"
                    className="text-sm text-destructive hover:underline font-medium"
                    onClick={openDeleteDialog}
                  >
                    Delete Account
                  </button>
                </div>

                <div className="pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground">
                    {content.noAccount}{' '}
                    <button 
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="text-primary font-bold hover:underline"
                    >
                      {content.register}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Card>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (open) {
            setIsDeleteDialogOpen(true);
            return;
          }

          closeDeleteDialog();
        }}
      >
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-md border-border bg-background text-foreground shadow-2xl">
          <DialogHeader className="space-y-2 pr-8">
            <DialogTitle className="text-xl font-bold">
              {deleteStep === 'form' ? 'Delete Account' : 'Are you sure you want to delete this account?'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {deleteStep === 'form'
                ? 'Enter your registered mobile number, password, and confirm password to continue.'
                : 'This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>

          {deleteStep === 'form' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground/80">Mobile No. *</Label>
                <Input
                  placeholder="Enter Mobile No."
                  value={deleteMobile}
                  onChange={(event) => {
                    setDeleteMobile(event.target.value.replace(/\D/g, '').slice(0, 10));
                    setDeleteError(null);
                  }}
                  className="bg-muted/30 border-muted focus:bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground/80">Password *</Label>
                <Input
                  type="password"
                  placeholder="Enter Password"
                  value={deletePassword}
                  onChange={(event) => {
                    setDeletePassword(event.target.value);
                    setDeleteError(null);
                  }}
                  className="bg-muted/30 border-muted focus:bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground/80">Confirm Password *</Label>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={deleteConfirmPassword}
                  onChange={(event) => {
                    setDeleteConfirmPassword(event.target.value);
                    setDeleteError(null);
                  }}
                  className="bg-muted/30 border-muted focus:bg-background"
                />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4">
              <p className="text-sm font-semibold text-foreground">Are you sure you want to delete this account?</p>
              <p className="mt-1 text-sm text-muted-foreground">This action cannot be undone.</p>
            </div>
          )}

          {deleteError && (
            <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
              {deleteError}
            </p>
          )}

          <DialogFooter className="bg-muted/30 border-t border-border sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={closeDeleteDialog}
              className="border-border bg-background text-foreground hover:bg-muted"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : deleteStep === 'form' ? 'Delete' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog
        open={isForgotOpen}
        onOpenChange={(open) => {
          if (open) {
            setIsForgotOpen(true);
            return;
          }

          closeForgotDialog();
        }}
      >
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-md border-border bg-background text-foreground shadow-2xl">
          <DialogHeader className="space-y-2 pr-8">
            <DialogTitle className="text-xl font-bold">Forgot Password</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Enter your registered mobile number to generate a temporary password valid for 3 minutes.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground/80">Mobile No. *</Label>
              <Input
                placeholder={content.mobilePlaceholder}
                value={forgotMobile}
                onChange={(event) => {
                  setForgotMobile(event.target.value.replace(/\D/g, '').slice(0, 10));
                  setForgotError(null);
                }}
                className="bg-muted/30 border-muted focus:bg-background"
              />
            </div>

            {tempPassword && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground/80">Temporary Password</Label>
                <div className="flex items-center gap-2">
                  <Input readOnly value={tempPassword} className="font-mono" />
                  <div className="text-sm text-muted-foreground">{remainingSeconds > 0 ? `Expires in ${remainingSeconds}s` : 'Expired'}</div>
                </div>
                <p className="text-xs text-muted-foreground">Use this password to login. It will be valid for 3 minutes.</p>
              </div>
            )}

            {forgotError && (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">{forgotError}</p>
            )}
          </div>

          <DialogFooter className="bg-muted/30 border-t border-border sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={closeForgotDialog}
              className="border-border bg-background text-foreground hover:bg-muted"
              disabled={isRequestingForgot}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={async () => {
                // If password exists and not expired, allow close. Otherwise request.
                if (tempPassword && tempExpiresAt && tempExpiresAt > Date.now()) {
                  // keep dialog open so user can copy; we'll not auto-close
                  return;
                }
                if (remainingSeconds <= 0 && tempPassword) {
                  // expired -> just close
                  closeForgotDialog();
                  return;
                }
                await handleForgotSubmit();
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isRequestingForgot}
            >
              {isRequestingForgot ? 'Requesting...' : tempPassword && remainingSeconds <= 0 ? 'Close' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
