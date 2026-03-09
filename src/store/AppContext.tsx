import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Category, ToneMode, Verdict } from '@/types';

interface AppState {
  // Submission form
  submission: string;
  category: Category;
  tone: ToneMode;
  
  // Analysis state
  isAnalyzing: boolean;
  analysisStep: number;
  
  // Verdict
  verdict: Verdict | null;
  
  // Appeal
  isAppealOpen: boolean;
  
  // Feed filter
  feedFilter: Category | 'all';
}

interface AppContextType extends AppState {
  setSubmission: (text: string) => void;
  setCategory: (cat: Category) => void;
  setTone: (tone: ToneMode) => void;
  startAnalysis: () => void;
  setVerdict: (verdict: Verdict) => void;
  reset: () => void;
  openAppeal: () => void;
  closeAppeal: () => void;
  setFeedFilter: (filter: Category | 'all') => void;
}

const initialState: AppState = {
  submission: '',
  category: 'idea',
  tone: 'professional',
  isAnalyzing: false,
  analysisStep: 0,
  verdict: null,
  isAppealOpen: false,
  feedFilter: 'all',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const setSubmission = useCallback((text: string) => {
    setState(prev => ({ ...prev, submission: text }));
  }, []);

  const setCategory = useCallback((category: Category) => {
    setState(prev => ({ ...prev, category }));
  }, []);

  const setTone = useCallback((tone: ToneMode) => {
    setState(prev => ({ ...prev, tone }));
  }, []);

  const startAnalysis = useCallback(() => {
    setState(prev => ({ ...prev, isAnalyzing: true, analysisStep: 0 }));
  }, []);

  const setVerdict = useCallback((verdict: Verdict) => {
    setState(prev => ({ ...prev, verdict, isAnalyzing: false }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const openAppeal = useCallback(() => {
    setState(prev => ({ ...prev, isAppealOpen: true }));
  }, []);

  const closeAppeal = useCallback(() => {
    setState(prev => ({ ...prev, isAppealOpen: false }));
  }, []);

  const setFeedFilter = useCallback((filter: Category | 'all') => {
    setState(prev => ({ ...prev, feedFilter: filter }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setSubmission,
        setCategory,
        setTone,
        startAnalysis,
        setVerdict,
        reset,
        openAppeal,
        closeAppeal,
        setFeedFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
