import { ReactNode } from 'react';
import { InstallPrompt, DesktopInstallBanner } from './InstallPrompt';
import { UpdatePrompt, UpdateNotification } from './UpdatePrompt';

interface PWAProviderProps {
  children: ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
  return (
    <>
      {children}
      
      {/* PWA Install Prompts */}
      <InstallPrompt />
      <DesktopInstallBanner />
      
      {/* PWA Update Prompts */}
      <UpdatePrompt />
      <UpdateNotification />
    </>
  );
}