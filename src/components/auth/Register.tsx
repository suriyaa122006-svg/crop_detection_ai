import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Landmark, MapPin, Phone, Mail, Lock, ShieldCheck, CreditCard, Building2, UserCircle, X, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { LanguageCode } from '@/src/lib/languages';

interface RegisterProps {
  language: LanguageCode;
  setActiveTab: (tab: string) => void;
  onLogin: (user: any) => void;
}

export const Register: React.FC<RegisterProps> = ({ language, setActiveTab, onLogin }) => {
  const [formData, setFormData] = useState({
    stakeholder: '',
    bankType: '',
    userCategory: '',
    state: '',
    district: '',
    bankName: '',
    branchName: '',
    personalTitle: '',
    name: '',
    aadhar: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    email: '',
    employeeId: '',
    landlineCode: '',
    landlineNo: '',
    searchByIFSC: 'NO',
    ifscCode: '',
    townName: '',
    villageName: '',
    pincode: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAadharVerifying, setIsAadharVerifying] = useState(false);
  const [isAadharVerified, setIsAadharVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAadharVerify = () => {
    if (!formData.aadhar || formData.aadhar.length !== 12) return;
    
    setIsAadharVerifying(true);
    // Placeholder service simulation
    setTimeout(() => {
      setIsAadharVerifying(false);
      setIsAadharVerified(true);
      setErrors(prev => ({ ...prev, aadhar: '' }));
    }, 1500);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%\^&*+\-=]).{8,}$/;

    if (!formData.stakeholder) newErrors.stakeholder = 'Stakeholder is required';
    if (!formData.bankType) newErrors.bankType = 'Bank type is required';
    if (!formData.userCategory) newErrors.userCategory = 'User category is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.bankName) newErrors.bankName = 'Bank name is required';
    if (!formData.branchName) newErrors.branchName = 'Branch name is required';
    if (!formData.personalTitle) newErrors.personalTitle = 'Title is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.aadhar) {
      newErrors.aadhar = 'Aadhar ID is required';
    } else if (formData.aadhar.length !== 12) {
      newErrors.aadhar = 'Aadhar ID must be 12 digits';
    } else if (!isAadharVerified) {
      newErrors.aadhar = 'Please verify your Aadhar ID';
    }

    if (!formData.mobile) {
      newErrors.mobile = language === 'en' ? 'Mobile number is required' : (t[language]?.placeholders?.mobile || 'Mobile number is required');
    } else {
      const mobileRegex = /^[6-9]\d{9}$/;
      if (formData.mobile.length !== 10) {
        newErrors.mobile = language === 'en' ? 'Mobile number must be exactly 10 digits' : 'मोबाइल नंबर ठीक 10 अंकों का होना चाहिए';
      } else if (!mobileRegex.test(formData.mobile)) {
        newErrors.mobile = language === 'en' ? 'Please enter a valid Indian mobile number' : 'कृपया एक वैध मोबाइल नंबर दर्ज करें';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password does not meet complexity requirements';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        onLogin(formData);
      }, 2000);
    }
  };

  const t: Record<string, any> = {
    en: {
      title: "Register New User",
      note: "Note: Primary Worker for conducting CCE can Register only through CCE APP",
      officialInfo: "Official Information",
      personalInfo: "Personal Information",
      stakeholder: "Stakeholder",
      bankType: "Choose Bank Type",
      userCategory: "User Category",
      state: "State",
      district: "District",
      bankName: "Bank Name",
      branchName: "Branch Name",
      searchIFSC: "Search Bank By IFSC",
      personalTitle: "Title",
      name: "Name",
      aadhar: "Aadhar ID",
      mobile: "Mobile No",
      password: "Password",
      confirmPassword: "Confirm Password",
      email: "Email",
      employeeId: "Employee ID",
      landline: "Office Landline No.",
      verify: "Verify",
      discard: "Discard",
      create: "Create",
      alreadyHave: "Already have an account?",
      signIn: "Sign In",
      placeholders: {
        stakeholder: "Select Stakeholder",
        bankType: "Select Bank Type",
        category: "Select Category",
        state: "Select State",
        district: "Select District",
        bank: "Select Bank",
        branch: "Select Branch",
        title: "Select",
        name: "Enter Name",
        aadhar: "Enter Aadhar ID",
        mobile: "Enter Mobile No.",
        password: "Enter Password",
        confirmPassword: "Enter Confirm Password",
        email: "Enter Email",
        empId: "Enter Employee ID",
        code: "Code",
        phone: "Phone No."
      },
      options: {
        bank: "BANK",
        insurance: "INSURANCE COMPANY",
        gov: "STATE GOVERNMENT",
        commercial: "COMMERCIAL",
        rural: "RURAL",
        cooperative: "COOPERATIVE",
        head: "Branch Head",
        user: "Branch User",
        admin: "State Admin"
      },
      passwordHint: "Password must be minimum 8 chars long with uppercase, lowercase, number & special character (@#$%\^&*+-=).",
      aadharSuccess: "Aadhar ID verified successfully via UIDAI"
    },
    hi: {
      title: "नया उपयोगकर्ता पंजीकरण",
      note: "नोट: सीसीई आयोजित करने के लिए प्राथमिक कार्यकर्ता केवल सीसीई ऐप के माध्यम से पंजीकरण कर सकते हैं",
      officialInfo: "आधिकारिक जानकारी",
      personalInfo: "व्यक्तिगत जानकारी",
      stakeholder: "हितधारक",
      bankType: "बैंक प्रकार चुनें",
      userCategory: "उपयोगकर्ता श्रेणी",
      state: "राज्य",
      district: "जिला",
      bankName: "बैंक का नाम",
      branchName: "शाखा का नाम",
      searchIFSC: "IFSC द्वारा बैंक खोजें",
      personalTitle: "शीर्षक",
      name: "नाम",
      aadhar: "आधार आईडी",
      mobile: "मोबाइल नंबर",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      email: "ईमेल",
      employeeId: "कर्मचारी आईडी",
      landline: "कार्यालय लैंडलाइन नंबर",
      verify: "सत्यापित करें",
      discard: "रद्द करें",
      create: "बनाएं",
      alreadyHave: "पहले से ही एक खाता है?",
      signIn: "साइन इन करें",
      placeholders: {
        stakeholder: "हितधारक चुनें",
        bankType: "बैंक प्रकार चुनें",
        category: "श्रेणी चुनें",
        state: "राज्य चुनें",
        district: "जिला चुनें",
        bank: "बैंक चुनें",
        branch: "शाखा चुनें",
        title: "चुनें",
        name: "नाम दर्ज करें",
        aadhar: "आधार आईडी दर्ज करें",
        mobile: "मोबाइल नंबर दर्ज करें",
        password: "पासवर्ड दर्ज करें",
        confirmPassword: "पुष्टि पासवर्ड दर्ज करें",
        email: "ईमेल दर्ज करें",
        empId: "कर्मचारी आईडी दर्ज करें",
        code: "कोड",
        phone: "फोन नंबर"
      },
      options: {
        bank: "बैंक",
        insurance: "बीमा कंपनी",
        gov: "राज्य सरकार",
        commercial: "वाणिज्यिक",
        rural: "ग्रामीण",
        cooperative: "सहकारी",
        head: "शाखा प्रमुख",
        user: "शाखा उपयोगकर्ता",
        admin: "राज्य व्यवस्थापक"
      },
      passwordHint: "पासवर्ड कम से कम 8 वर्ण लंबा होना चाहिए जिसमें बड़े अक्षर, छोटे अक्षर, संख्या और विशेष वर्ण (@#$%^&*+-=) हों।",
      aadharSuccess: "यूआईडीएआई के माध्यम से आधार आईडी सफलतापूर्वक सत्यापित"
    },
    pa: {
      title: "ਨਵਾਂ ਉਪਭੋਗਤਾ ਰਜਿਸਟਰ ਕਰੋ",
      note: "ਨੋਟ: CCE ਕਰਵਾਉਣ ਲਈ ਪ੍ਰਾਇਮਰੀ ਵਰਕਰ ਸਿਰਫ਼ CCE APP ਰਾਹੀਂ ਰਜਿਸਟਰ ਕਰ ਸਕਦੇ ਹਨ",
      officialInfo: "ਅਧਿਕਾਰਤ ਜਾਣਕਾਰੀ",
      personalInfo: "ਨਿੱਜੀ ਜਾਣਕਾਰੀ",
      stakeholder: "ਹਿੱਸੇਦਾਰ",
      bankType: "ਬੈਂਕ ਦੀ ਕਿਸਮ ਚੁਣੋ",
      userCategory: "ਉਪਭੋਗਤਾ ਸ਼੍ਰੇਣੀ",
      state: "ਰਾਜ",
      district: "ਜ਼ਿਲ੍ਹਾ",
      bankName: "ਬੈਂਕ ਦਾ ਨਾਮ",
      branchName: "ਸ਼ਾਖਾ ਦਾ ਨਾਮ",
      searchIFSC: "IFSC ਦੁਆਰਾ ਬੈਂਕ ਖੋਜੋ",
      personalTitle: "ਸਿਰਲੇਖ",
      name: "ਨਾਮ",
      aadhar: "ਆਧਾਰ ਆਈਡੀ",
      mobile: "ਮੋਬਾਈਲ ਨੰਬਰ",
      password: "ਪਾਸਵਰਡ",
      confirmPassword: "ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
      email: "ਈਮੇਲ",
      employeeId: "ਕਰਮਚਾਰੀ ਆਈਡੀ",
      landline: "ਦਫ਼ਤਰ ਲੈਂਡਲਾਈਨ ਨੰਬਰ",
      verify: "ਤਸਦੀਕ ਕਰੋ",
      discard: "ਰੱਦ ਕਰੋ",
      create: "ਬਣਾਓ",
      alreadyHave: "ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ?",
      signIn: "ਸਾਈਨ ਇਨ ਕਰੋ",
      placeholders: {
        stakeholder: "ਹਿੱਸੇਦਾਰ ਚੁਣੋ",
        bankType: "ਬੈਂਕ ਕਿਸਮ ਚੁਣੋ",
        category: "ਸ਼੍ਰੇਣੀ ਚੁਣੋ",
        state: "ਰਾਜ ਚੁਣੋ",
        district: "ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ",
        bank: "ਬੈਂਕ ਚੁਣੋ",
        branch: "ਸ਼ਾਖਾ ਚੁਣੋ",
        title: "ਚੁਣੋ",
        name: "ਨਾਮ ਦਰਜ ਕਰੋ",
        aadhar: "ਆਧਾਰ ਆਈਡੀ ਦਰਜ ਕਰੋ",
        mobile: "ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ",
        password: "ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ",
        confirmPassword: "ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
        email: "ਈਮੇਲ ਦਰਜ ਕਰੋ",
        empId: "ਕਰਮਚਾਰੀ ਆਈਡੀ ਦਰਜ ਕਰੋ",
        code: "ਕੋਡ",
        phone: "ਫੋਨ ਨੰਬਰ"
      },
      options: {
        bank: "ਬੈਂਕ",
        insurance: "ਬੀਮਾ ਕੰਪਨੀ",
        gov: "ਰਾਜ ਸਰਕਾਰ",
        commercial: "ਵਪਾਰਕ",
        rural: "ਦਿਹਾਤੀ",
        cooperative: "ਸਹਿਕਾਰੀ",
        head: "ਸ਼ਾਖਾ ਮੁਖੀ",
        user: "ਸ਼ਾਖਾ ਉਪਭੋਗਤਾ",
        admin: "ਰਾਜ ਪ੍ਰਸ਼ਾਸਕ"
      },
      passwordHint: "ਪਾਸਵਰਡ ਘੱਟੋ-ਘੱਟ 8 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
      aadharSuccess: "ਆਧਾਰ ਆਈਡੀ ਸਫ਼ਲਤਾਪੂਰਵਕ ਤਸਦੀਕ ਕੀਤੀ ਗਈ"
    },
    mr: {
      title: "नवीन वापरकर्ता नोंदणी",
      note: "टीप: CCE आयोजित करण्यासाठी प्राथमिक कार्यकर्ता केवळ CCE APP द्वारे नोंदणी करू शकतात",
      officialInfo: "अधिकृत माहिती",
      personalInfo: "वैयक्तिक माहिती",
      stakeholder: "हितधारक",
      bankType: "बँकेचा प्रकार निवडा",
      userCategory: "वापरकर्ता श्रेणी",
      state: "राज्य",
      district: "जिल्हा",
      bankName: "बँकेचे नाव",
      branchName: "शाखेचे नाव",
      searchIFSC: "IFSC द्वारे बँक शोधा",
      personalTitle: "शीर्षक",
      name: "नाव",
      aadhar: "आधार आयडी",
      mobile: "मोबाईल नंबर",
      password: "पासवर्ड",
      confirmPassword: "पासवर्डची पुष्टी करा",
      email: "ईमेल",
      employeeId: "कर्मचारी आयडी",
      landline: "कार्यालय लँडलाईन क्रमांक",
      verify: "सत्यापित करा",
      discard: "रद्द करा",
      create: "तयार करा",
      alreadyHave: "आधीच खाते आहे का?",
      signIn: "साइन इन करा",
      placeholders: {
        stakeholder: "हितधारक निवडा",
        bankType: "बँकेचा प्रकार निवडा",
        category: "श्रेणी निवडा",
        state: "राज्य निवडा",
        district: "जिल्हा निवडा",
        bank: "बँक निवडा",
        branch: "शाखा निवडा",
        title: "निवडा",
        name: "नाव प्रविष्ट करा",
        aadhar: "आधार आयडी प्रविष्ट करा",
        mobile: "मोबाईल नंबर प्रविष्ट करा",
        password: "पासवर्ड प्रविष्ट करा",
        confirmPassword: "पासवर्डची पुष्टी करा",
        email: "ईमेल प्रविष्ट करा",
        empId: "कर्मचारी आयडी प्रविष्ट करा",
        code: "कोड",
        phone: "फोन नंबर"
      },
      options: {
        bank: "बँक",
        insurance: "विमा कंपनी",
        gov: "राज्य सरकार",
        commercial: "व्यावसायिक",
        rural: "ग्रामीण",
        cooperative: "सहकारी",
        head: "शाखा प्रमुख",
        user: "शाखा वापरकर्ता",
        admin: "राज्य प्रशासक"
      },
      passwordHint: "पासवर्ड किमान 8 अक्षरांचा असावा।",
      aadharSuccess: "आधार आयडी यशस्वीरित्या सत्यापित"
    },
    bn: {
      title: "নতুন ব্যবহারকারী নিবন্ধন",
      note: "দ্রষ্টব্য: সিসিই পরিচালনার জন্য প্রাথমিক কর্মী কেবল সিসিই অ্যাপের মাধ্যমে নিবন্ধন করতে পারেন",
      officialInfo: "অফিসিয়াল তথ্য",
      personalInfo: "ব্যক্তিগত তথ্য",
      stakeholder: "অংশীদার",
      bankType: "ব্যাংকের ধরন চয়ন করুন",
      userCategory: "ব্যবহারকারী বিভাগ",
      state: "রাজ্য",
      district: "জেলা",
      bankName: "ব্যাংকের নাম",
      branchName: "শাখার নাম",
      searchIFSC: "IFSC দ্বারা ব্যাংক খুঁজুন",
      personalTitle: "উপাধি",
      name: "নাম",
      aadhar: "আধার আইডি",
      mobile: "মোবাইল নম্বর",
      password: "পাসওয়ার্ড",
      confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
      email: "ইমেল",
      employeeId: "কর্মচারী আইডি",
      landline: "অফিস ল্যান্ডলাইন নম্বর",
      verify: "যাচাই করুন",
      discard: "বাতিল করুন",
      create: "তৈরি করুন",
      alreadyHave: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?",
      signIn: "সাইন ইন করুন",
      placeholders: {
        stakeholder: "অংশীদার নির্বাচন করুন",
        bankType: "ব্যাংকের ধরন নির্বাচন করুন",
        category: "বিভাগ নির্বাচন করুন",
        state: "রাজ্য নির্বাচন করুন",
        district: "জেলা নির্বাচন করুন",
        bank: "ব্যাংক নির্বাচন করুন",
        branch: "শাখা নির্বাচন করুন",
        title: "নির্বাচন",
        name: "নাম লিখুন",
        aadhar: "আধার আইডি লিখুন",
        mobile: "মোবাইল নম্বর লিখুন",
        password: "পাসওয়ার্ড লিখুন",
        confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
        email: "ইমেল লিখুন",
        empId: "কর্মচারী আইডি লিখুন",
        code: "কোড",
        phone: "ফোন নম্বর"
      },
      options: {
        bank: "ব্যাংক",
        insurance: "বীমা কোম্পানি",
        gov: "রাজ্য সরকার",
        commercial: "বাণিজ্যিক",
        rural: "গ্রামীণ",
        cooperative: "সমবায়",
        head: "শাখা প্রধান",
        user: "শাখা ব্যবহারকারী",
        admin: "রাজ্য প্রশাসক"
      },
      passwordHint: "পাসওয়ার্ডটি কমপক্ষে ৮ অক্ষরের হতে হবে।",
      aadharSuccess: "আধার আইডি সফলভাবে যাচাই করা হয়েছে"
    },
    gu: {
      title: "નવા વપરાશકર્તાની નોંધણી",
      note: "નોંધ: CCE ચલાવવા માટેના પ્રાથમિક કાર્યકર માત્ર CCE APP દ્વારા નોંધણી કરાવી શકે છે",
      officialInfo: "સત્તાવાર માહિતી",
      personalInfo: "વ્યક્તિગત માહિતી",
      stakeholder: "હિતધારક",
      bankType: "બેંકનો પ્રકાર પસંદ કરો",
      userCategory: "વપરાશકર્તા શ્રેણી",
      state: "રાજ્ય",
      district: "જિલ્લો",
      bankName: "બેંકનું નામ",
      branchName: "શાખાનું નામ",
      searchIFSC: "IFSC દ્વારા બેંક શોધો",
      personalTitle: "શીર્ષક",
      name: "નામ",
      aadhar: "આધાર આઈડી",
      mobile: "મોબાઈલ નંબર",
      password: "પાસવર્ડ",
      confirmPassword: "પાસવર્ડની પુષ્ટિ કરો",
      email: "ઈમેલ",
      employeeId: "કર્મચારી આઈડી",
      landline: "ઓફિસ લેન્ડલાઇન નંબર",
      verify: "ચકાસો",
      discard: "રદ કરો",
      create: "બનાવો",
      alreadyHave: "પહેલેથી જ એકાઉન્ટ છે?",
      signIn: "સાઇન ઇન કરો",
      placeholders: {
        stakeholder: "હિતધારક પસંદ કરો",
        bankType: "બેંક પ્રકાર પસંદ કરો",
        category: "શ્રેણી પસંદ કરો",
        state: "રાજ્ય પસંદ કરો",
        district: "જિલ્લો પસંદ કરો",
        bank: "બેંક પસંદ કરો",
        branch: "શાખા પસંદ કરો",
        title: "પસંદ કરો",
        name: "નામ દાખલ કરો",
        aadhar: "આધાર આઈડી દાખલ કરો",
        mobile: "મોબાઈલ નંબર દાખલ કરો",
        password: "પાસવર્ડ દાખલ કરો",
        confirmPassword: "પાસવર્ડની પુષ્ટિ કરો",
        email: "ઈમેલ દાખલ કરો",
        empId: "કર્મચારી આઈડી દાખલ કરો",
        code: "કોડ",
        phone: "ફોન નંબર"
      },
      options: {
        bank: "બેંક",
        insurance: "વીમા કંપની",
        gov: "રાજ્ય સરકાર",
        commercial: "વ્યાપારી",
        rural: "ગ્રામીણ",
        cooperative: "સહકારી",
        head: "શાખા વડા",
        user: "શાખા વપરાશકર્તા",
        admin: "રાજ્ય સંચાલક"
      },
      passwordHint: "પાસવર્ડ ઓછામાં ઓછો 8 અક્ષરોનો હોવો જોઈએ।",
      aadharSuccess: "આધાર આઈડી સફળતાપૂર્વક ચકાસવામાં આવી"
    },
    ta: {
      title: "புதிய பயனரை பதிவு செய்யவும்",
      note: "குறிப்பு: சிசிஇ நடத்துவதற்கான முதன்மை பணியாளர் சிசிஇ ஆப் மூலம் மட்டுமே பதிவு செய்ய முடியும்",
      officialInfo: "அதிகாரப்பூர்வ தகவல்",
      personalInfo: "தனிப்பட்ட தகவல்",
      stakeholder: "பங்குதாரர்",
      bankType: "வங்கி வகையைத் தேர்ந்தெடுக்கவும்",
      userCategory: "பயனர் வகை",
      state: "மாநிலம்",
      district: "மாவட்டம்",
      bankName: "வங்கி பெயர்",
      branchName: "கிளை பெயர்",
      searchIFSC: "IFSC மூலம் வங்கியைத் தேடுங்கள்",
      personalTitle: "தலைப்பு",
      name: "பெயர்",
      aadhar: "ஆதார் ஐடி",
      mobile: "கைபேசி எண்",
      password: "கடவுச்சொல்",
      confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
      email: "மின்னஞ்சல்",
      employeeId: "பணியாளர் ஐடி",
      landline: "அலுவலக தரைவழி எண்.",
      verify: "சரிபார்க்கவும்",
      discard: "நிராகரிக்கவும்",
      create: "உருவாக்கவும்",
      alreadyHave: "ஏற்கனவே கணக்கு உள்ளதா?",
      signIn: "உள்நுழைக",
      placeholders: {
        stakeholder: "பங்குதாரரைத் தேர்ந்தெடுக்கவும்",
        bankType: "வங்கி வகையைத் தேர்ந்தெடுக்கவும்",
        category: "வகையைத் தேர்ந்தெடுக்கவும்",
        state: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
        district: "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
        bank: "வங்கியைத் தேர்ந்தெடுக்கவும்",
        branch: "கிளையைத் தேர்ந்தெடுக்கவும்",
        title: "தேர்ந்தெடு",
        name: "பெயரை உள்ளிடவும்",
        aadhar: "ஆதார் ஐடியை உள்ளிடவும்",
        mobile: "கைபேசி எண்ணை உள்ளிடவும்",
        password: "கடவுச்சொல்லை உள்ளிடவும்",
        confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
        email: "மின்னஞ்சலை உள்ளிடவும்",
        empId: "பணியாளர் ஐடியை உள்ளிடவும்",
        code: "குறியீடு",
        phone: "தொலைபேசி எண்."
      },
      options: {
        bank: "வங்கி",
        insurance: "காப்பீட்டு நிறுவனம்",
        gov: "மாநில அரசு",
        commercial: "வணிக",
        rural: "கிராமப்புற",
        cooperative: "கூட்டுறவு",
        head: "கிளைத் தலைவர்",
        user: "கிளைப் பயனர்",
        admin: "மாநில நிர்வாகி"
      },
      passwordHint: "கடவுச்சொல் குறைந்தது 8 எழுத்துக்கள் நீளமாக இருக்க வேண்டும்।",
      aadharSuccess: "ஆதார் ஐடி வெற்றிகரமாகச் சரிபார்க்கப்பட்டது"
    },
    te: {
      title: "కొత్త వినియోగదారుని నమోదు చేయండి",
      note: "గమనిక: CCE నిర్వహించడానికి ప్రాథమిక కార్యకర్తలు CCE APP ద్వారా మాత్రమే నమోదు చేసుకోవచ్చు",
      officialInfo: "అధికారిక సమాచారం",
      personalInfo: "వ్యక్తిగత సమాచారం",
      stakeholder: "స్టేక్‌హోల్డర్",
      bankType: "బ్యాంక్ రకాన్ని ఎంచుకోండి",
      userCategory: "వినియోగదారు వర్గం",
      state: "రాష్ట్రం",
      district: "జిల్లా",
      bankName: "బ్యాంక్ పేరు",
      branchName: "బ్రాంచ్ పేరు",
      searchIFSC: "IFSC ద్వారా బ్యాంక్ కోసం వెతకండి",
      personalTitle: "శీర్షిక",
      name: "పేరు",
      aadhar: "ఆధార్ ఐడి",
      mobile: "మొబైల్ నంబర్",
      password: "పాస్‌వర్డ్",
      confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి",
      email: "ఈమెయిల్",
      employeeId: "ఉద్యోగి ఐడి",
      landline: "ఆఫీస్ ల్యాండ్‌లైన్ నంబర్",
      verify: "ధృవీకరించండి",
      discard: "తిరస్కరించు",
      create: "సృష్టించు",
      alreadyHave: "ఇప్పటికే ఖాతా ఉందా?",
      signIn: "సైన్ ఇన్ చేయండి",
      placeholders: {
        stakeholder: "స్టేక్‌హోల్డర్‌ను ఎంచుకోండి",
        bankType: "బ్యాంక్ రకాన్ని ఎంచుకోండి",
        category: "వర్గాన్ని ఎంచుకోండి",
        state: "రాష్ట్రాన్ని ఎంచుకోండి",
        district: "జిల్లాను ఎంచుకోండి",
        bank: "బ్యాంక్‌ను ఎంచుకోండి",
        branch: "బ్రాంచ్‌ను ఎంచుకోండి",
        title: "ఎంచుకోండి",
        name: "పేరు నమోదు చేయండి",
        aadhar: "ఆధార్ ఐడి నమోదు చేయండి",
        mobile: "మొబైల్ నంబర్ నమోదు చేయండి",
        password: "పాస్‌వర్డ్ నమోదు చేయండి",
        confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి",
        email: "ఈమెయిల్ నమోదు చేయండి",
        empId: "ఉద్యోగి ఐడి నమోదు చేయండి",
        code: "కోడ్",
        phone: "ఫోన్ నంబర్"
      },
      options: {
        bank: "బ్యాంక్",
        insurance: "భీమా సంస్థ",
        gov: "రాష్ట్ర ప్రభుత్వం",
        commercial: "వాణిజ్య",
        rural: "గ్రామీణ",
        cooperative: "సహకార",
        head: "బ్రాంచ్ హెడ్",
        user: "బ్రాంచ్ యూజర్",
        admin: "స్టేట్ అడ్మిన్"
      },
      passwordHint: "పాస్‌వర్డ్ కనీసం 8 అక్షరాల పొడవు ఉండాలి।",
      aadharSuccess: "ఆధార్ ఐడి విజయవంతంగా ధృవీకరించబడింది"
    },
    kn: {
      title: "ಹೊಸ ಬಳಕೆದಾರರನ್ನು ನೋಂದಾಯಿಸಿ",
      note: "ಗಮನಿಸಿ: ಸಿಸಿಇ ನಡೆಸಲು ಪ್ರಾಥಮಿಕ ಕಾರ್ಯಕರ್ತರು ಸಿಸಿಇ ಆಪ್ ಮೂಲಕ ಮಾತ್ರ ನೋಂದಾಯಿಸಿಕೊಳ್ಳಬಹುದು",
      officialInfo: "ಅಧಿಕೃತ ಮಾಹಿತಿ",
      personalInfo: "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ",
      stakeholder: "ಪಾಲುದಾರ",
      bankType: "ಬ್ಯಾಂಕ್ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      userCategory: "ಬಳಕೆದಾರ ವರ್ಗ",
      state: "ರಾಜ್ಯ",
      district: "ಜಿಲ್ಲೆ",
      bankName: "ಬ್ಯಾಂಕ್ ಹೆಸರು",
      branchName: "ಶಾಖೆಯ ಹೆಸರು",
      searchIFSC: "IFSC ಮೂಲಕ ಬ್ಯಾಂಕ್ ಹುಡುಕಿ",
      personalTitle: "ಶೀರ್ಷಿಕೆ",
      name: "ಹೆಸರು",
      aadhar: "ಆಧಾರ್ ಐಡಿ",
      mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      password: "ಪಾಸ್‌ವರ್ಡ್",
      confirmPassword: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
      email: "ಇಮೇಲ್",
      employeeId: "ಉದ್ಯೋಗಿ ಐಡಿ",
      landline: "ಕಚೇರಿ ಲ್ಯಾಂಡ್‌ಲೈನ್ ಸಂಖ್ಯೆ",
      verify: "ಪರಿಶೀಲಿಸಿ",
      discard: "ತಿರಸ್ಕರಿಸಿ",
      create: "ರಚಿಸಿ",
      alreadyHave: "ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?",
      signIn: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
      placeholders: {
        stakeholder: "ಪಾಲುದಾರರನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        bankType: "ಬ್ಯಾಂಕ್ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        category: "ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        state: "ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        district: "ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        bank: "ಬ್ಯಾಂಕ್ ಆಯ್ಕೆಮಾಡಿ",
        branch: "ಶಾಖೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        title: "ಆಯ್ಕೆಮಾಡಿ",
        name: "ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
        aadhar: "ಆಧಾರ್ ಐಡಿ ನಮೂದಿಸಿ",
        mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ",
        password: "ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
        confirmPassword: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
        email: "ಇಮೇಲ್ ನಮೂದಿಸಿ",
        empId: "ಉದ್ಯೋಗಿ ಐಡಿ ನಮೂದಿಸಿ",
        code: "ಕೋಡ್",
        phone: "ಫೋನ್ ಸಂಖ್ಯೆ"
      },
      options: {
        bank: "ಬ್ಯಾಂಕ್",
        insurance: "ವಿಮಾ ಸಂಸ್ಥೆ",
        gov: "ರಾಜ್ಯ ಸರ್ಕಾರ",
        commercial: "ವಾಣಿಜ್ಯ",
        rural: "ಗ್ರಾಮೀಣ",
        cooperative: "ಸಹಕಾರಿ",
        head: "ಶಾಖಾ ಮುಖ್ಯಸ್ಥ",
        user: "ಶಾಖಾ ಬಳಕೆದಾರ",
        admin: "ರಾಜ್ಯ ನಿರ್ವಾಹಕ"
      },
      passwordHint: "ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳಿರಬೇಕು।",
      aadharSuccess: "ಆಧಾರ್ ಐಡಿ ಯಶಸ್ವಿಯಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ"
    },
    ml: {
      title: "പുതിയ ഉപയോക്താവിനെ രജിസ്റ്റർ ചെയ്യുക",
      note: "കുറിപ്പ്: സിസിഇ നടത്തുന്നതിനായുള്ള പ്രാഥമിക തൊഴിലാളിക്ക് സിസിഇ ആപ്പ് വഴി മാത്രമേ രജിസ്റ്റർ ചെയ്യാൻ കഴിയൂ",
      officialInfo: "ഔദ്യോഗിക വിവരങ്ങൾ",
      personalInfo: "വ്യക്തിഗത വിവരങ്ങൾ",
      stakeholder: "പങ്കാളി",
      bankType: "ബാങ്ക് തരം തിരഞ്ഞെടുക്കുക",
      userCategory: "ഉപയോക്തൃ വിഭാഗം",
      state: "സംസ്ഥാനം",
      district: "ജില്ല",
      bankName: "ബാങ്കിന്റെ പേര്",
      branchName: "ബ്രാഞ്ചിന്റെ പേര്",
      searchIFSC: "IFSC വഴി ബാങ്ക് തിരയുക",
      personalTitle: "ശീർഷകം",
      name: "പേര്",
      aadhar: "ആധാർ ഐഡി",
      mobile: "മൊബൈൽ നമ്പർ",
      password: "പാസ്‌വേഡ്",
      confirmPassword: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
      email: "ഇമെയിൽ",
      employeeId: "ജീവനക്കാരന്റെ ഐഡി",
      landline: "ഓഫീസ് ലാൻഡ്‌ലൈൻ നമ്പർ.",
      verify: "പരിശോധിക്കുക",
      discard: "നിരസിക്കുക",
      create: "സൃഷ്ടിക്കുക",
      alreadyHave: "ഇതിനകം ഒരു അക്കൗണ്ട് ഉണ്ടോ?",
      signIn: "സൈൻ ഇൻ ചെയ്യുക",
      placeholders: {
        stakeholder: "പങ്കാളിയെ തിരഞ്ഞെടുക്കുക",
        bankType: "ബാങ്ക് തരം തിരഞ്ഞെടുക്കുക",
        category: "വിഭാഗം തിരഞ്ഞെടുക്കുക",
        state: "സംസ്ഥാനം തിരഞ്ഞെടുക്കുക",
        district: "ജില്ല തിരഞ്ഞെടുക്കുക",
        bank: "ബാങ്ക് തിരഞ്ഞെടുക്കുക",
        branch: "ബ്രാഞ്ച് തിരഞ്ഞെടുക്കുക",
        title: "തിരഞ്ഞെടുക്കുക",
        name: "പേര് നൽകുക",
        aadhar: "ആധാർ ഐഡി നൽകുക",
        mobile: "മൊബൈൽ നമ്പർ നൽകുക",
        password: "പാസ്‌വേഡ് നൽകുക",
        confirmPassword: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
        email: "ഇമെയിൽ നൽകുക",
        empId: "ജീവനക്കാരന്റെ ഐഡി നൽകുക",
        code: "കോഡ്",
        phone: "ഫോൺ നമ്പർ."
      },
      options: {
        bank: "ബാങ്ക്",
        insurance: "ഇൻഷുറൻസ് കമ്പനി",
        gov: "സംസ്ഥാന സർക്കാർ",
        commercial: "കൊമേഴ്സ്യൽ",
        rural: "റൂറൽ",
        cooperative: "കോഓപ്പറേറ്റീവ്",
        head: "ബ്രാഞ്ച് ഹെഡ്",
        user: "ബ്രാഞ്ച് യൂസർ",
        admin: "സംസ്ഥാന അഡ്മിൻ"
      },
      passwordHint: "പാസ്‌വേഡ് കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ നീളമുള്ളതായിരിക്കണം।",
      aadharSuccess: "ആധാർ ഐഡി വിജയകരമായി പരിശോധിച്ചു"
    }
  };

  const content = t[language] || t['en'];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-primary">{content.title}</h1>
          <p className="text-sm text-muted-foreground">{content.note}</p>
        </div>
      </div>

      <Card className="border-primary/10 shadow-lg">
        <CardContent className="p-8 space-y-10">
          {/* Official Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Building2 className="h-5 w-5" />
              <h2 className="text-xl font-bold">{content.officialInfo}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="flex gap-1">
                  {content.stakeholder} <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.stakeholder} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, stakeholder: value }));
                    setErrors(prev => ({ ...prev, stakeholder: '' }));
                  }}
                >
                  <SelectTrigger className={errors.stakeholder ? 'border-destructive' : ''}>
                    <SelectValue placeholder={content.placeholders.stakeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">{content.options.bank}</SelectItem>
                    <SelectItem value="insurance">{content.options.insurance}</SelectItem>
                    <SelectItem value="gov">{content.options.gov}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.stakeholder && <p className="text-[10px] text-destructive font-medium">{errors.stakeholder}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex gap-1">
                  {content.bankType} <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.bankType} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, bankType: value }));
                    setErrors(prev => ({ ...prev, bankType: '' }));
                  }}
                >
                  <SelectTrigger className={errors.bankType ? 'border-destructive' : ''}>
                    <SelectValue placeholder={content.placeholders.bankType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commercial">{content.options.commercial}</SelectItem>
                    <SelectItem value="rural">{content.options.rural}</SelectItem>
                    <SelectItem value="cooperative">{content.options.cooperative}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bankType && <p className="text-[10px] text-destructive font-medium">{errors.bankType}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex gap-1">
                  {content.userCategory} <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.userCategory} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, userCategory: value }));
                    setErrors(prev => ({ ...prev, userCategory: '' }));
                  }}
                >
                  <SelectTrigger className={errors.userCategory ? 'border-destructive' : ''}>
                    <SelectValue placeholder={content.placeholders.category} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="head">{content.options.head}</SelectItem>
                    <SelectItem value="user">{content.options.user}</SelectItem>
                    <SelectItem value="admin">{content.options.admin}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.userCategory && <p className="text-[10px] text-destructive font-medium">{errors.userCategory}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex gap-1">
                  {content.state} <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.state} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, state: value }));
                    setErrors(prev => ({ ...prev, state: '' }));
                  }}
                >
                  <SelectTrigger className={errors.state ? 'border-destructive' : ''}>
                    <SelectValue placeholder={content.placeholders.state} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="up">Uttar Pradesh</SelectItem>
                    <SelectItem value="mp">Madhya Pradesh</SelectItem>
                    <SelectItem value="mh">Maharashtra</SelectItem>
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-[10px] text-destructive font-medium">{errors.state}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex gap-1">
                  {content.district} <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.district} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, district: value }));
                    setErrors(prev => ({ ...prev, district: '' }));
                  }}
                >
                  <SelectTrigger className={errors.district ? 'border-destructive' : ''}>
                    <SelectValue placeholder={content.placeholders.district} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="d1">District 1</SelectItem>
                    <SelectItem value="d2">District 2</SelectItem>
                  </SelectContent>
                </Select>
                {errors.district && <p className="text-[10px] text-destructive font-medium">{errors.district}</p>}
              </div>

              <div className="space-y-2">
                <Label>{content.searchIFSC}</Label>
                <div className="flex items-center gap-4 h-10 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="ifsc" 
                      checked={formData.searchByIFSC === 'YES'}
                      onChange={() => setFormData(prev => ({ ...prev, searchByIFSC: 'YES' }))}
                      className="accent-primary h-4 w-4" 
                    />
                    <span className="text-sm font-semibold">YES</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="ifsc" 
                      checked={formData.searchByIFSC === 'NO'}
                      onChange={() => setFormData(prev => ({ ...prev, searchByIFSC: 'NO' }))}
                      className="accent-primary h-4 w-4" 
                    />
                    <span className="text-sm font-semibold">NO</span>
                  </label>
                </div>
              </div>

              {formData.searchByIFSC === 'YES' && (
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label className="flex gap-1 font-bold">
                    IFSC Code <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    placeholder="Enter IFSC Code (e.g. SBIN0001234)" 
                    value={formData.ifscCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="flex gap-1 font-bold">
                  Town Name <span className="text-destructive">*</span>
                </Label>
                <Input 
                  placeholder="Enter Town Name" 
                  value={formData.townName}
                  onChange={(e) => setFormData(prev => ({ ...prev, townName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex gap-1 font-bold">
                  Village Name <span className="text-destructive">*</span>
                </Label>
                <Input 
                  placeholder="Enter Village Name" 
                  value={formData.villageName}
                  onChange={(e) => setFormData(prev => ({ ...prev, villageName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex gap-1 font-bold">
                  Pincode <span className="text-destructive">*</span>
                </Label>
                <Input 
                  placeholder="Enter 6-digit Pincode" 
                  value={formData.pincode}
                  maxLength={6}
                  onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '') }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex gap-1">
                  {content.bankName} <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.bankName} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, bankName: value }));
                    setErrors(prev => ({ ...prev, bankName: '' }));
                  }}
                >
                  <SelectTrigger className={errors.bankName ? 'border-destructive' : ''}>
                    <SelectValue placeholder={content.placeholders.bank} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sbi">State Bank of India</SelectItem>
                    <SelectItem value="pnb">Punjab National Bank</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bankName && <p className="text-[10px] text-destructive font-medium">{errors.bankName}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex gap-1">
                  {content.branchName} <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.branchName} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, branchName: value }));
                    setErrors(prev => ({ ...prev, branchName: '' }));
                  }}
                >
                  <SelectTrigger className={errors.branchName ? 'border-destructive' : ''}>
                    <SelectValue placeholder={content.placeholders.branch} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="b1">Branch 1</SelectItem>
                    <SelectItem value="b2">Branch 2</SelectItem>
                  </SelectContent>
                </Select>
                {errors.branchName && <p className="text-[10px] text-destructive font-medium">{errors.branchName}</p>}
              </div>
            </div>
          </div>

          <Separator />

          {/* Personal Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <UserCircle className="h-5 w-5" />
              <h2 className="text-xl font-bold">{content.personalInfo}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="flex gap-1">
                  {content.personalTitle} <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.personalTitle} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, personalTitle: value }));
                    setErrors(prev => ({ ...prev, personalTitle: '' }));
                  }}
                >
                  <SelectTrigger className={errors.personalTitle ? 'border-destructive' : ''}>
                    <SelectValue placeholder={content.placeholders.title} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mr">Mr.</SelectItem>
                    <SelectItem value="ms">Ms.</SelectItem>
                    <SelectItem value="mrs">Mrs.</SelectItem>
                  </SelectContent>
                </Select>
                {errors.personalTitle && <p className="text-[10px] text-destructive font-medium">{errors.personalTitle}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex gap-1">
                  {content.name} <span className="text-destructive">*</span>
                </Label>
                <Input 
                  placeholder={content.placeholders.name} 
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-[10px] text-destructive font-medium">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex gap-1">
                  {content.aadhar} <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder={content.placeholders.aadhar} 
                    value={formData.aadhar}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, aadhar: e.target.value.replace(/\D/g, '').slice(0, 12) }));
                      setErrors(prev => ({ ...prev, aadhar: '' }));
                    }}
                    disabled={isAadharVerified || isAadharVerifying}
                    className={errors.aadhar ? 'border-destructive' : ''}
                  />
                  <Button 
                    variant="secondary" 
                    className={`${isAadharVerified ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white min-w-[100px]`}
                    onClick={handleAadharVerify}
                    disabled={isAadharVerified || isAadharVerifying || formData.aadhar.length !== 12}
                  >
                    {isAadharVerifying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isAadharVerified ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      content.verify
                    )}
                  </Button>
                </div>
                {errors.aadhar && <p className="text-[10px] text-destructive font-medium">{errors.aadhar}</p>}
                {isAadharVerified && (
                  <p className="text-[10px] text-green-600 font-medium">{content.aadharSuccess}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex gap-1">
                  {content.mobile} <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder={content.placeholders.mobile} 
                    value={formData.mobile}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }));
                      setErrors(prev => ({ ...prev, mobile: '' }));
                    }}
                    className={errors.mobile ? 'border-destructive' : ''}
                  />
                  <Button variant="secondary" className="bg-indigo-600 text-white hover:bg-indigo-700">
                    {content.verify}
                  </Button>
                </div>
                {errors.mobile && <p className="text-[10px] text-destructive font-medium">{errors.mobile}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex gap-1">
                  {content.password} <span className="text-destructive">*</span>
                </Label>
                <Input 
                  type="password" 
                  placeholder={content.placeholders.password} 
                  value={formData.password}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, password: e.target.value }));
                    setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && <p className="text-[10px] text-destructive font-medium">{errors.password}</p>}
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {content.passwordHint}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex gap-1">
                  {content.confirmPassword} <span className="text-destructive">*</span>
                </Label>
                <Input 
                  type="password" 
                  placeholder={content.placeholders.confirmPassword} 
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                    setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  className={errors.confirmPassword ? 'border-destructive' : ''}
                />
                {errors.confirmPassword && <p className="text-[10px] text-destructive font-medium">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label>{content.email}</Label>
                <Input 
                  type="email" 
                  placeholder={content.placeholders.email} 
                  value={formData.email}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, email: e.target.value }));
                    setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-[10px] text-destructive font-medium">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label>{content.employeeId}</Label>
                <Input 
                  placeholder={content.placeholders.empId} 
                  value={formData.employeeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>{content.landline}</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder={content.placeholders.code} 
                    className="w-20" 
                    value={formData.landlineCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, landlineCode: e.target.value.replace(/\D/g, '') }))}
                  />
                  <Input 
                    placeholder={content.placeholders.phone} 
                    className="flex-grow" 
                    value={formData.landlineNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, landlineNo: e.target.value.replace(/\D/g, '') }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button variant="outline" size="lg" className="px-8" onClick={() => setActiveTab('home')}>
              {content.discard}
            </Button>
            <Button 
              size="lg" 
              className="px-8 bg-primary hover:bg-primary/90 text-white font-bold"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : content.create}
            </Button>
          </div>

          <div className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {content.alreadyHave}{' '}
              <button 
                onClick={() => setActiveTab('signin')}
                className="text-primary font-bold hover:underline"
              >
                {content.signIn}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
