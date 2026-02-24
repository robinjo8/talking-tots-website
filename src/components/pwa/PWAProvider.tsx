import { ReactNode } from 'react';
import { UpdatePrompt, UpdateNotification } from './UpdatePrompt';
import { ManualInstallButton } from './ManualInstallButton';
import { IOSInstallBanner } from './IOSInstallBanner';

interface PWAProviderProps {
  children: ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
  return (
    <>
      {children}
      
      {/* PWA Install Prompts - Only ManualInstallButton for desktop */}
      <ManualInstallButton />
      
      {/* iOS Safari Install Banner */}
      <IOSInstallBanner />
      
      {/* PWA Update Prompts */}
      <UpdatePrompt />
      <UpdateNotification />
    </>
  );
}