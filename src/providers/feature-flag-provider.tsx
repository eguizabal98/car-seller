'use client';

import { createContext, useContext, useMemo } from 'react';
import type { FeatureFlag } from '@/lib/features';

const FeatureFlagContext = createContext<Record<string, boolean>>({});

export function FeatureFlagProvider({ 
  children, 
  initialFlags 
}: { 
  children: React.ReactNode, 
  initialFlags: FeatureFlag[] 
}) {
  const flagsMap = useMemo(() => 
    initialFlags.reduce((acc, flag) => ({ ...acc, [flag.key]: flag.is_enabled }), {}), 
  [initialFlags]);

  return (
    <FeatureFlagContext.Provider value={flagsMap}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export const useFeature = (key: string) => {
  const context = useContext(FeatureFlagContext);
  return context[key] ?? false;
}
