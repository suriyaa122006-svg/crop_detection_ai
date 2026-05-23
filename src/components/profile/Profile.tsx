import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { User, Phone, Mail, Landmark, CreditCard, Building2, MapPin, Camera, Save, LogOut, ArrowLeft, ShieldCheck, UserCircle, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LanguageCode } from '@/src/lib/languages';

interface ProfileProps {
  language: LanguageCode;
  user: any;
  onUpdateUser: (userData: any) => void;
  onLogout: () => void;
  onBack: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ language, user, onUpdateUser, onLogout, onBack }) => {
  const MOBILE_REGEX = /^\d{10}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  const PASSWORD_MASK = '********';

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    aadhar: user?.aadhar || '',
    bankName: user?.bankName || '',
    branchName: user?.branchName || '',
    bankAcc: user?.bankAcc || '',
    state: user?.state || '',
    district: user?.district || '',
    photo: user?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    bankType: user?.bankType || 'Commercial',
    townName: user?.townName || '',
    villageName: user?.villageName || '',
    newPassword: ''
  });

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      mobile: user?.mobile || '',
      email: user?.email || '',
      aadhar: user?.aadhar || user?.registrationData?.aadhar || '',
      bankName: user?.bankName || user?.registrationData?.bankName || '',
      branchName: user?.branchName || user?.registrationData?.branchName || '',
      bankAcc: user?.bankAcc || user?.registrationData?.bankAcc || '',
      state: user?.state || user?.registrationData?.state || '',
      district: user?.district || user?.registrationData?.district || '',
      photo: user?.photo || user?.registrationData?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
      bankType: user?.bankType || user?.registrationData?.bankType || 'Commercial',
      townName: user?.townName || user?.registrationData?.townName || '',
      villageName: user?.villageName || user?.registrationData?.villageName || '',
      newPassword: ''
    });
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const [passwordStatusMessage, setPasswordStatusMessage] = useState('');
  const hasPendingPasswordChange = isEditing && formData.newPassword !== '' && !isPasswordConfirmed;

  const t: Record<string, any> = {
    en: {
      title: "User Profile",
      description: "Manage your personal and account details",
      personalInfo: "Personal Details",
      contactInfo: "Contact Information",
      bankInfo: "Bank Details",
      addressInfo: "Location Details",
      name: "Full Name",
      mobile: "Mobile Number",
      email: "Email Address",
      aadhar: "Aadhar ID",
      bankName: "Bank Name",
      branchName: "Branch Name",
      bankAcc: "Bank Account No.",
      state: "State",
      district: "District",
      saveChanges: "Save Changes",
      logout: "Logout from Device",
      edit: "Edit Profile",
      cancel: "Cancel",
      verified: "Verified",
      photoUpdate: "Change Photo",
      editTitle: "Edit Profile",
      cancelEdit: "Cancel Editing",
      updateDetails: "Update Details",
      discardChanges: "Discard Changes",
      notProvided: "Not provided",
      changePassword: "Change Password",
      enterNewPassword: "Enter new password",
      confirmPassword: "Confirm",
      changePasswordPlaceholder: "Change the password",
      passwordConfirmRequired: "Please confirm the password change before saving.",
      passwordConfirmed: "Password change confirmed.",
      invalidMobile: "Mobile number must be exactly 10 digits.",
      invalidEmail: "Please enter a valid email address.",
      invalidPassword: "Password must be 8+ characters with uppercase, lowercase, number, and special character.",
      bankType: "Bank Type",
      bankTypePlaceholder: "e.g. Commercial, Rural, Cooperative",
      townName: "Town Name",
      townPlaceholder: "Enter Town Name",
      villageName: "Village Name",
      villagePlaceholder: "Enter Village Name"
    },
    hi: {
      title: "उपयोगकर्ता प्रोफ़ाइल",
      description: "अपने व्यक्तिगत और खाता विवरण प्रबंधित करें",
      personalInfo: "व्यक्तिगत विवरण",
      contactInfo: "संपर्क जानकारी",
      bankInfo: "बैंक विवरण",
      addressInfo: "स्थान विवरण",
      name: "पूरा नाम",
      mobile: "मोबाइल नंबर",
      email: "ईमेल पता",
      aadhar: "आधार आईडी",
      bankName: "बैंक का नाम",
      branchName: "शाखा का नाम",
      bankAcc: "बैंक खाता संख्या",
      state: "राज्य",
      district: "जिला",
      saveChanges: "परिवर्तन सहेजें",
      logout: "डिवाइस से लॉगआउट करें",
      edit: "प्रोफ़ाइल संपादित करें",
      cancel: "रद्द करें",
      verified: "सत्यापित",
      photoUpdate: "फोटो बदलें",
      editTitle: "प्रोफ़ाइल संपादित करें",
      cancelEdit: "संपादन रद्द करें",
      updateDetails: "विवरण बदलें",
      discardChanges: "परिवर्तन छोड़ें"
    },
    pa: {
      title: "ਉਪਭੋਗਤਾ ਪ੍ਰੋਫਾਈਲ",
      description: "ਆਪਣੇ ਨਿੱਜੀ ਅਤੇ ਖਾਤੇ ਦੇ ਵੇਰਵਿਆਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ",
      personalInfo: "ਨਿੱਜੀ ਵੇਰਵੇ",
      contactInfo: "ਸੰਪਰਕ ਜਾਣਕਾਰੀ",
      bankInfo: "ਬੈਂਕ ਵੇਰਵੇ",
      addressInfo: "ਸਥਾਨ ਦੇ ਵੇਰਵੇ",
      name: "ਪੂਰਾ ਨਾਮ",
      mobile: "ਮੋਬਾਈਲ ਨੰਬਰ",
      email: "ਈਮੇਲ ਪਤਾ",
      aadhar: "ਆਧਾਰ ਆਈਡੀ",
      bankName: "ਬੈਂਕ ਦਾ ਨਾਮ",
      branchName: "ਬ੍ਰਾਂਚ ਦਾ ਨਾਮ",
      bankAcc: "ਬੈਂਕ ਖਾਤਾ ਨੰ.",
      state: "ਰਾਜ",
      district: "ਜ਼ਿਲ੍ਹਾ",
      saveChanges: "ਤਬਦੀਲੀਆਂ ਸੁਰੱਖਿਅਤ ਕਰੋ",
      logout: "ਡਿਵਾਈਸ ਤੋਂ ਲੌਗਆਉਟ ਕਰੋ",
      edit: "ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ",
      cancel: "ਰੱਦ ਕਰੋ",
      verified: "ਪ੍ਰਮਾਣਿਤ",
      photoUpdate: "ਫੋਟੋ ਬਦਲੋ",
      editTitle: "ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ",
      cancelEdit: "ਸੋਧਣਾ ਰੱਦ ਕਰੋ",
      updateDetails: "ਵੇਰਵੇ ਅੱਪਡੇਟ ਕਰੋ",
      discardChanges: "ਤਬਦੀਲੀਆਂ ਰੱਦ ਕਰੋ"
    },
    mr: {
      title: "वापरकर्ता प्रोफाइल",
      description: "आपले वैयक्तिक आणि खाते तपशील व्यवस्थापित करा",
      personalInfo: "वैयक्तिक तपशील",
      contactInfo: "संपर्क माहिती",
      bankInfo: "बँकेचा तपशील",
      addressInfo: "स्थानाचा तपशील",
      name: "पूर्ण नाव",
      mobile: "मोबाईल नंबर",
      email: "ईमेल पत्ता",
      aadhar: "आधार आयडी",
      bankName: "बँकेचे नाव",
      branchName: "शाखेचे नाव",
      bankAcc: "बँक खाते क्रमांक",
      state: "राज्य",
      district: "जिल्हा",
      saveChanges: "बदल जतन करा",
      logout: "डिव्हाइसमधून लॉगआउट करा",
      edit: "प्रोफाइल संपादित करा",
      cancel: "रद्द करा",
      verified: "सत्यापित",
      photoUpdate: "फोटो बदला",
      editTitle: "प्रोफाइल संपादित करा",
      cancelEdit: "संपादन रद्द करा",
      updateDetails: "तपशील बदला",
      discardChanges: "बदल रद्द करा"
    },
    bn: {
      title: "ব্যবহারকারী প্রোফাইল",
      description: "আপনার ব্যক্তিগত এবং অ্যাকাউন্ট বিবরণ পরিচালনা করুন",
      personalInfo: "ব্যক্তিগত বিবরণ",
      contactInfo: "যোগাযোগ তথ্য",
      bankInfo: "ব্যাঙ্কের বিবরণ",
      addressInfo: "অবস্থানের বিবরণ",
      name: "সম্পূর্ণ নাম",
      mobile: "মোবাইল নম্বর",
      email: "ইমেল ঠিকানা",
      aadhar: "আধার আইডি",
      bankName: "ব্যাঙ্কের নাম",
      branchName: "শাখার নাম",
      bankAcc: "ব্যাঙ্ক অ্যাকাউন্ট নম্বর",
      state: "রাজ্য",
      district: "জেলা",
      saveChanges: "পরিবর্তন সংরক্ষণ করুন",
      logout: "ডিভাইস থেকে লগআউট করুন",
      edit: "প্রোফাইল সম্পাদন করুন",
      cancel: "বাতিল করুন",
      verified: "যাচাইকৃত",
      photoUpdate: "ছবি পরিবর্তন করুন",
      editTitle: "প্রোফাইল সম্পাদন করুন",
      cancelEdit: "সম্পাদনা বাতিল করুন",
      updateDetails: "বিবরণ পরিবর্তন করুন",
      discardChanges: "পরিবর্তন বাতিল করুন"
    },
    gu: {
      title: "વપરાશકર્તા પ્રોફાઇલ",
      description: "તમારી વ્યક્તિગત અને ખાતાની વિગતો સંચાલિત કરો",
      personalInfo: "વ્યક્તિગત વિગતો",
      contactInfo: "સંપર્ક માહિતી",
      bankInfo: "બેંક વિગતો",
      addressInfo: "સ્થાન વિગતો",
      name: "પૂરું નામ",
      mobile: "મોબાઇલ નંબર",
      email: "ઇમેઇલ સરનામું",
      aadhar: "આધાર કાર્ડ નંબર",
      bankName: "બેંકનું નામ",
      branchName: "શાખાનું નામ",
      bankAcc: "બેંક ખાતા નંબર",
      state: "રાજ્ય",
      district: "જિલ્લો",
      saveChanges: "ફેરફારો સાચવો",
      logout: "ઉપકરણમાંથી લોગઆઉટ કરો",
      edit: "પ્રોફાઇલ સંપાદિત કરો",
      cancel: "રદ કરો",
      verified: "ચકાસાયેલ",
      photoUpdate: "ફોટો બદલો",
      editTitle: "પ્રોફાઇલ સંપાદિત કરો",
      cancelEdit: "સંપાદન રદ કરો",
      updateDetails: "વિગતો બદલો",
      discardChanges: "ફેરફારો રદ કરો"
    },
    ta: {
      title: "பயனர் சுயவிவரம்",
      description: "உங்கள் தனிப்பட்ட மற்றும் கணக்கு विवरणங்களை நிர்வகிக்கவும்",
      personalInfo: "தனிப்பட்ட விவரங்கள்",
      contactInfo: "தொடர்பு தகவல்",
      bankInfo: "வங்கி விவரங்கள்",
      addressInfo: "இருப்பிட விவரங்கள்",
      name: "முழு பெயர்",
      mobile: "கைபேசி எண்",
      email: "மின்னஞ்சல் முகவரி",
      aadhar: "ஆதார் எண்",
      bankName: "வங்கி பெயர்",
      branchName: "கிளை பெயர்",
      bankAcc: "வங்கி கணக்கு எண்",
      state: "மாநிலம்",
      district: "மாவட்டம்",
      saveChanges: "மாற்றங்களைச் சேமி",
      logout: "சாதனத்திலிருந்து வெளியேறு",
      edit: "சுயவிவரத்தைத் திருத்து",
      cancel: "ரத்துசெய்",
      verified: "சரிபார்க்கப்பட்டது",
      photoUpdate: "புகைப்படத்தை மாற்று",
      editTitle: "சுயவிவரத்தைத் திருத்து",
      cancelEdit: "திருத்துவதை ரத்துசெய்",
      updateDetails: "விவரங்களை மாற்று",
      discardChanges: "மாற்றங்களை தவிர்"
    },
    te: {
      title: "వినియోగదారు ప్రొఫైల్",
      description: "మీ వ్యక్తిగత మరియు ఖాతా వివరాలను నిర్వహించండి",
      personalInfo: "వ్యక్తిగత వివరాలు",
      contactInfo: "సంప్రదింపు సమాచారం",
      bankInfo: "బ్యాంకు వివరాలు",
      addressInfo: "స్థాన వివరాలు",
      name: "పూర్తి పేరు",
      mobile: "మొబైల్ సంఖ్య",
      email: "ఈమెయిల్ చిరునామా",
      aadhar: "ఆధార్ ఐడీ",
      bankName: "బ్యాంకు పేరు",
      branchName: "శాఖ పేరు",
      bankAcc: "బ్యాంకు ఖాతా సంఖ్య",
      state: "రాష్ట్రం",
      district: "జిల్లా",
      saveChanges: "మార్పులను సేవ్ చేయి",
      logout: "పరికరం నుండి లాగ్ అవుట్ చేయి",
      edit: "ప్రొఫైల్ ఎడిట్ చేయి",
      cancel: "ರದ್ದು చేయి",
      verified: "ధృవీకరించబడింది",
      photoUpdate: "ఫోటో మార్చండి",
      editTitle: "ప్రొఫైల్ ఎడిట్ చేయి",
      cancelEdit: "ఎడిటింగ్ రద్దు చేయి",
      updateDetails: "వివరాలు మార్చండి",
      discardChanges: "మార్పులను వదిలివేయి"
    },
    kn: {
      title: "ಬಳಕೆದಾರರ ಪ್ರೊಫೈಲ್",
      description: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮತ್ತು ಖಾತೆ ವಿವರಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
      personalInfo: "ವೈಯಕ್ತಿಕ ವಿವರಗಳು",
      contactInfo: "ಸಂಪರ್ಕ ಮಾಹಿತಿ",
      bankInfo: "ಬ್ಯಾಂಕ್ ವಿವರಗಳು",
      addressInfo: "ಸ್ಥಳ ವಿವರಗಳು",
      name: "ಪೂರ್ಣ ಹೆಸರು",
      mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      email: "ಇಮೇಲ್ ವಿಳಾಸ",
      aadhar: "ಆಧಾರ್ ಸಂಖ್ಯೆ",
      bankName: "ಬ್ಯಾಂಕ್ ಹೆಸರು",
      branchName: "ಶಾಖೆಯ ಹೆಸರು",
      bankAcc: "ಬ್ಯಾಂಕ್ ಖಾತೆ ಸಂಖ್ಯೆ",
      state: "ರಾಜ್ಯ",
      district: "ಜಿಲ್ಲೆ",
      saveChanges: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
      logout: "ಸಾಧನದಿಂದ ಹೊರಹೋಗಿ",
      edit: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
      cancel: "ರದ್ದುಗೊಳಿಸಿ",
      verified: "ದೃಢೀಕರಿಸಲಾಗಿದೆ",
      photoUpdate: "ಚಿತ್ರ ಬದಲಾಯಿಸಿ",
      editTitle: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
      cancelEdit: "ಸಂಪಾದನೆ ರದ್ದುಗೊಳಿಸಿ",
      updateDetails: "ವಿವರಗಳನ್ನು ಬದಲಾಯಿಸಿ",
      discardChanges: "ಬದಲಾವಣೆಗಳನ್ನು ಬಿಟ್ಟುಬಿಡಿ"
    },
    ml: {
      title: "ഉപയോക്തൃ പ്രൊഫൈൽ",
      description: "നിങ്ങളുടെ വ്യക്തിഗത-അക്കൗണ്ട് വിവരങ്ങൾ നിയന്ത്രിക്കുക",
      personalInfo: "ব্যক্তিഗത വിവരങ്ങൾ",
      contactInfo: "ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ",
      bankInfo: "ബാങ്ക് വിവരങ്ങൾ",
      addressInfo: "സ്ഥലം വിവരങ്ങൾ",
      name: "മുഴുവൻ പേര്",
      mobile: "മൊബൈൽ നമ്പർ",
      email: "ഇമെയിൽ വിലാസം",
      aadhar: "ആധാർ ഐഡി",
      bankName: "ബാങ്കിൻ്റെ പേര്",
      branchName: "ബ്രാഞ്ച് പേര്",
      bankAcc: "ബാങ്ക് അക്കൗണ്ട് നമ്പർ",
      state: "സംസ്ഥാനം",
      district: "ജില്ല",
      saveChanges: "മാറ്റങ്ങൾ സംരക്ഷിക്കുക",
      logout: "ഉപകരണത്തിൽ നിന്ന് പുറത്തുകടക്കുക",
      edit: "പ്രൊഫൈൽ തിരുത്തുക",
      cancel: "റദ്ദാക്കുക",
      verified: "സ്ഥിരീകരിച്ചു",
      photoUpdate: "ഫോട്ടോ മാറ്റുക",
      editTitle: "പ്രൊഫൈൽ തിരുത്തുക",
      cancelEdit: "തിരുത്തൽ റദ്ദാക്കുക",
      updateDetails: "വിവരങ്ങൾ മാറ്റുക",
      discardChanges: "മാറ്റങ്ങൾ ഒഴിവാക്കുക"
    }
  };

  const content = t[language] || t['en'];

  const handleSave = () => {
    const trimmedMobile = formData.mobile.trim();
    const trimmedEmail = formData.email.trim();

    if (!MOBILE_REGEX.test(trimmedMobile)) {
      setSaveError(content.invalidMobile || t.en.invalidMobile);
      return;
    }

    if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
      setSaveError(content.invalidEmail || t.en.invalidEmail);
      return;
    }

    if (formData.newPassword && !isPasswordConfirmed) {
      setPasswordStatusMessage(content.passwordConfirmRequired || t.en.passwordConfirmRequired);
      return;
    }

    const updatedData = {
      ...formData,
      mobile: trimmedMobile,
      email: trimmedEmail,
      password: formData.newPassword ? formData.newPassword : undefined,
      newPassword: ''
    };

    const persistProfile = async () => {
      setIsSaving(true);
      setSaveError('');

      try {
        const userIdentifier = user?._id || user?.id || user?.mobile;
        if (!userIdentifier) {
          throw new Error('Missing user identifier. Please sign in again.');
        }

        const response = await fetch(`/api/auth/profile/${encodeURIComponent(userIdentifier)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload?.error || payload?.message || 'Profile update failed');
        }

        onUpdateUser(payload.user);
        setFormData((current) => ({ ...current, ...payload.user, newPassword: '' }));
        setIsEditing(false);
        setIsPasswordTouched(false);
        setIsPasswordConfirmed(false);
        setPasswordStatusMessage('');
      } catch (error: any) {
        setSaveError(error?.message || 'Profile update failed');
      } finally {
        setIsSaving(false);
      }
    };

    void persistProfile();
  };

  const handlePasswordConfirm = () => {
    if (!hasPendingPasswordChange) return;

    if (!PASSWORD_REGEX.test(formData.newPassword)) {
      setPasswordStatusMessage(content.invalidPassword || t.en.invalidPassword);
      setIsPasswordConfirmed(false);
      return;
    }

    setIsPasswordConfirmed(true);
    setIsPasswordTouched(false);
    setPasswordStatusMessage(content.passwordConfirmed || t.en.passwordConfirmed);
  };

  const handleEditToggle = () => {
    setIsEditing(prev => {
      const next = !prev;
      setIsPasswordTouched(false);
      setIsPasswordConfirmed(false);
      setPasswordStatusMessage('');
      setFormData(current => ({ ...current, newPassword: '' }));

      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">{content.title}</h1>
          <p className="text-muted-foreground">{content.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Left Column: Profile Card + Action Buttons Stack */}
        <div className="md:col-span-1 flex flex-col gap-6 h-full justify-between">
          <Card className="overflow-hidden border-primary/10 shadow-xl flex-shrink-0">
            <div className="h-24 bg-gradient-to-r from-primary/80 to-primary"></div>
            <CardContent className="pt-0 relative px-6 pb-8">
              <div className="flex flex-col items-center -mt-12 space-y-4">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-full border-4 border-background overflow-hidden shadow-2xl bg-muted">
                    <img src={formData.photo} alt="Profile" className="h-full w-full object-cover" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold">{formData.name || 'User'}</h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none font-bold">
                      <ShieldCheck className="h-3 w-3 mr-1" /> {content.verified}
                    </Badge>
                  </div>
                </div>
                <div className="w-full space-y-3 pt-4 font-medium text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" /> {formData.mobile || content.notProvided || t.en.notProvided}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" /> {formData.email || content.notProvided || t.en.notProvided}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {formData.district}, {formData.state}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile (White Card, black text/icon) and Logout Stack (height 1/4th of edit) */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Edit Profile Card Button Box */}
            <div 
              onClick={handleEditToggle}
              className="flex-[4] min-h-[160px] bg-gradient-to-br from-white to-neutral-50 text-black border border-neutral-200 hover:border-black rounded-[24px] flex flex-col items-center justify-center p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer select-none group relative overflow-hidden"
            >
              {/* Premium glare effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-neutral-100/50 via-transparent to-neutral-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="p-3.5 rounded-full bg-neutral-100 text-black group-hover:bg-black group-hover:text-white transition-all duration-300 mb-3 shadow-inner">
                <Edit2 className="h-6 w-6 transition-transform group-hover:rotate-12 duration-300" />
              </div>
              
              <span className="font-black text-lg tracking-tight text-neutral-900 group-hover:text-black transition-colors">
                {isEditing ? content.cancelEdit : content.editTitle}
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400 group-hover:text-neutral-600 transition-colors mt-1.5">
                {isEditing ? content.discardChanges : content.updateDetails}
              </span>
            </div>

            {/* Logout Button (exactly 1/4th of edit profile height) */}
            <button
              onClick={onLogout}
              className="flex-[1] min-h-[40px] w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:via-rose-500 hover:to-red-500 active:scale-95 text-white font-extrabold rounded-[18px] flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(220,38,38,0.25)] hover:shadow-[0_8px_24px_rgba(220,38,38,0.4)] transition-all duration-300 cursor-pointer border border-red-700/50 select-none group"
            >
              <LogOut className="h-4 w-4 text-white group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs uppercase tracking-widest text-white font-black">{content.logout || 'Logout'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> {content.personalInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{content.name}</Label>
                  <div className="relative">
                    <Input 
                      disabled={true} 
                      value={formData.name} 
                      className="bg-muted/50 pl-10 font-medium cursor-not-allowed border-neutral-300 dark:border-neutral-700 select-none opacity-70"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{content.mobile}</Label>
                  <Input 
                    disabled={!isEditing} 
                    value={formData.mobile} 
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{content.email}</Label>
                  <Input 
                    disabled={!isEditing} 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{content.aadhar}</Label>
                  <div className="relative">
                    <Input 
                      disabled={true} 
                      value={formData.aadhar} 
                      className="bg-muted/50 font-mono tracking-widest pl-10 cursor-not-allowed border-neutral-300 dark:border-neutral-700 select-none opacity-70"
                    />
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{content.changePassword || t.en.changePassword}</Label>
                  <div className="flex items-center gap-3">
                    <Input 
                      type="password"
                      disabled={!isEditing} 
                      placeholder={isEditing && isPasswordTouched && !isPasswordConfirmed ? (content.changePasswordPlaceholder || t.en.changePasswordPlaceholder) : ''} 
                      value={!isEditing || !isPasswordTouched || isPasswordConfirmed ? PASSWORD_MASK : formData.newPassword} 
                      onFocus={() => {
                        if (!isEditing) return;
                        if (!isPasswordTouched && !isPasswordConfirmed) {
                          setIsPasswordTouched(true);
                          setPasswordStatusMessage('');
                          setFormData(prev => ({ ...prev, newPassword: '' }));
                        }
                      }}
                      onChange={(e) => {
                        if (!isEditing || !isPasswordTouched || isPasswordConfirmed) return;
                        setIsPasswordTouched(true);
                        setIsPasswordConfirmed(false);
                        setPasswordStatusMessage('');
                        setFormData(prev => ({ ...prev, newPassword: e.target.value }));
                      }}
                      className={`flex-1 bg-muted/30 font-mono tracking-widest ${isEditing ? 'opacity-100' : 'opacity-60'}`}
                    />
                    {hasPendingPasswordChange && (
                      <Button
                        type="button"
                        onClick={handlePasswordConfirm}
                        size="sm"
                        className="h-10 shrink-0 rounded-full border border-emerald-400/30 bg-emerald-500/90 px-4 font-semibold text-white shadow-[0_10px_22px_rgba(16,185,129,0.22)] hover:bg-emerald-400"
                      >
                        {content.confirmPassword || t.en.confirmPassword}
                      </Button>
                    )}
                  </div>
                  {passwordStatusMessage && (
                    <p className={`text-xs font-medium ${passwordStatusMessage.includes('confirmed') ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {passwordStatusMessage}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-bold flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-primary" /> {content.bankInfo}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{content.bankName}</Label>
                    <Input 
                      disabled={!isEditing} 
                      value={formData.bankName} 
                      onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{content.branchName}</Label>
                    <Input 
                      disabled={!isEditing} 
                      value={formData.branchName} 
                      onChange={(e) => setFormData({...formData, branchName: e.target.value})}
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{content.bankType || t.en.bankType}</Label>
                    <Input 
                      disabled={!isEditing} 
                      value={formData.bankType} 
                      onChange={(e) => setFormData({...formData, bankType: e.target.value})}
                      className="bg-muted/30"
                      placeholder={content.bankTypePlaceholder || t.en.bankTypePlaceholder}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>{content.bankAcc}</Label>
                    <div className="relative">
                      <Input 
                        disabled={!isEditing} 
                        value={formData.bankAcc} 
                        type="password"
                        onChange={(e) => setFormData({...formData, bankAcc: e.target.value})}
                        className="bg-muted/30 pl-10"
                      />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> {content.addressInfo}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{content.state}</Label>
                    <Input 
                      disabled={!isEditing} 
                      value={formData.state} 
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{content.district}</Label>
                    <Input 
                      disabled={!isEditing} 
                      value={formData.district} 
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{content.townName || t.en.townName}</Label>
                    <Input 
                      disabled={!isEditing} 
                      value={formData.townName} 
                      onChange={(e) => setFormData({...formData, townName: e.target.value})}
                      className="bg-muted/30"
                      placeholder={content.townPlaceholder || t.en.townPlaceholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{content.villageName || t.en.villageName}</Label>
                    <Input 
                      disabled={!isEditing} 
                      value={formData.villageName} 
                      onChange={(e) => setFormData({...formData, villageName: e.target.value})}
                      className="bg-muted/30"
                      placeholder={content.villagePlaceholder || t.en.villagePlaceholder}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="pt-6">
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="w-full bg-white hover:bg-neutral-100 text-black dark:text-black dark:bg-white dark:hover:bg-neutral-100 font-extrabold py-6 gap-2 text-lg border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-2xl cursor-pointer"
                  >
                    <Save className="h-5 w-5 text-black" /> {isSaving ? 'Saving...' : content.saveChanges}
                  </Button>
                  {saveError && <p className="mt-3 text-sm font-medium text-red-500">{saveError}</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
