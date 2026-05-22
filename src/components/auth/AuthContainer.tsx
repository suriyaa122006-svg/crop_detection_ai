import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SignIn } from './SignIn';
import { Register } from './Register';
import { LanguageCode } from '@/src/lib/languages';

interface AuthContainerProps {
  language: LanguageCode;
  initialMode: 'signin' | 'register';
  setActiveTab: (tab: string) => void;
  onLogin: (userData: any) => void;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ 
  language, 
  initialMode, 
  setActiveTab, 
  onLogin 
}) => {
  const [activeMode, setActiveMode] = useState<'signin' | 'register'>(initialMode);

  // Keep in sync with parent activeTab changes if applicable
  useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  const handleModeChange = (mode: 'signin' | 'register') => {
    setActiveMode(mode);
    setActiveTab(mode);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 md:py-8">
      {/* Render selected form with smooth fade-in sliding animation */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {activeMode === 'signin' ? (
              <SignIn 
                language={language} 
                setActiveTab={(tab) => {
                  if (tab === 'register') handleModeChange('register');
                  else setActiveTab(tab);
                }} 
                onLogin={onLogin} 
              />
            ) : (
              <Register 
                language={language} 
                setActiveTab={(tab) => {
                  if (tab === 'signin') handleModeChange('signin');
                  else setActiveTab(tab);
                }} 
                onLogin={onLogin} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
