import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { OnboardingModal } from './OnboardingModal';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Mostra loader durante il caricamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se l'utente non ha completato l'onboarding, mostra la modale
  const needsOnboarding = user && !user.onboardingCompleted;

  return (
    <>
      {needsOnboarding && <OnboardingModal open={true} />}
      {/* Mostra il contenuto solo se l'onboarding è completato */}
      <div className={needsOnboarding ? 'pointer-events-none opacity-50 blur-sm' : ''}>
        {children}
      </div>
    </>
  );
};
