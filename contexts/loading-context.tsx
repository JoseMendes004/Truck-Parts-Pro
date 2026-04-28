'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

const LOADING_ENABLED_KEY = 'truck-parts-loading-enabled';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  isLoadingScreenEnabled: boolean;
  setLoadingScreenEnabled: (val: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoadingScreenEnabled, setLoadingScreenEnabledState] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(LOADING_ENABLED_KEY);
    if (stored === 'false') {
      setLoadingScreenEnabledState(false);
      setIsLoading(false);
    }
  }, []);

  const showLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoadingScreenEnabled = useCallback((val: boolean) => {
    setLoadingScreenEnabledState(val);
    localStorage.setItem(LOADING_ENABLED_KEY, String(val));
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, isLoadingScreenEnabled, setLoadingScreenEnabled }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
