'use client';
import { ReactNode, createContext, useRef, useContext } from 'react';
import { useStore as useZustandStore } from 'zustand';

import { createStore } from '@/store';

import type { AppState } from '@/store/types';

type StoreType = ReturnType<typeof createStore>;

const StoreContext = createContext<StoreType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<StoreType>(null);

  if (!storeRef.current) {
    storeRef.current = createStore();
  }

  return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>;
}

export function useStore<T>(selector: (state: AppState) => T): T {
  const store = useContext(StoreContext);
  if (!store) throw new Error('Missing StoreProvider');

  return useZustandStore(store, selector);
}

/*//////////////////////////////////////////////////////////////
                            FEATURE01
//////////////////////////////////////////////////////////////*/
export const useFeature01State1 = () => useStore((state) => state.featureState.state1);
export const useFeature01State2 = () => useStore((state) => state.featureState.state2);

export const useFeature01Actions = () => useStore((state) => state.featureActions);
