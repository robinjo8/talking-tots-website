import React, { createContext, useContext, useState, useCallback } from 'react';
import { LogopedistChild, useLogopedistChildren } from '@/hooks/useLogopedistChildren';
import { useLogopedistLicense, LicenseStats } from '@/hooks/useLogopedistLicense';

interface LogopedistChildContextType {
  children: LogopedistChild[];
  selectedChild: LogopedistChild | null;
  selectChild: (childId: string) => void;
  clearSelection: () => void;
  isLoading: boolean;
  license: LicenseStats | null;
  hasLicense: boolean;
  isNearLimit: boolean;
  isAtLimit: boolean;
  refetch: () => void;
}

const LogopedistChildContext = createContext<LogopedistChildContextType | undefined>(undefined);

export function LogopedistChildProvider({ children: childrenProp }: { children: React.ReactNode }) {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  
  const { 
    children: childrenList, 
    isLoading: childrenLoading, 
    refetch: refetchChildren 
  } = useLogopedistChildren();
  
  const { 
    license, 
    hasLicense, 
    isNearLimit, 
    isAtLimit, 
    isLoading: licenseLoading,
    refetch: refetchLicense 
  } = useLogopedistLicense();

  const selectedChild = selectedChildId 
    ? childrenList.find(c => c.id === selectedChildId) || null 
    : null;

  const selectChild = useCallback((childId: string) => {
    setSelectedChildId(childId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedChildId(null);
  }, []);

  const refetch = useCallback(() => {
    refetchChildren();
    refetchLicense();
  }, [refetchChildren, refetchLicense]);

  return (
    <LogopedistChildContext.Provider
      value={{
        children: childrenList,
        selectedChild,
        selectChild,
        clearSelection,
        isLoading: childrenLoading || licenseLoading,
        license,
        hasLicense,
        isNearLimit,
        isAtLimit,
        refetch,
      }}
    >
      {childrenProp}
    </LogopedistChildContext.Provider>
  );
}

export function useLogopedistChildContext() {
  const context = useContext(LogopedistChildContext);
  if (context === undefined) {
    throw new Error('useLogopedistChildContext must be used within LogopedistChildProvider');
  }
  return context;
}
