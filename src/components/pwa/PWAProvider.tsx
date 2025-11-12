import { ReactNode } from 'react';
import { UpdatePrompt, UpdateNotification } from './UpdatePrompt';
import { ManualInstallButton } from './ManualInstallButton';

interface PWAProviderProps {
  children: ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
  return (
    <>
      {children}
      
      {/* PWA Install Prompts - Only ManualInstallButton for desktop */}
      <ManualInstallButton />
      
      {/* PWA Update Prompts */}
      <UpdatePrompt />
      <UpdateNotification />
    </>
  );
}