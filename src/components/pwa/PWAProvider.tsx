import { ReactNode } from 'react';
import { InstallPrompt, DesktopInstallBanner } from './InstallPrompt';
import { UpdatePrompt, UpdateNotification } from './UpdatePrompt';
import { ManualInstallButton } from './ManualInstallButton';

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
      <ManualInstallButton />
      
      {/* PWA Update Prompts */}
      <UpdatePrompt />
      <UpdateNotification />
    </>
  );
}