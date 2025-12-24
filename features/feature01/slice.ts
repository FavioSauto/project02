import { StateCreator } from 'zustand';

import { AppState } from '@/store/types';
import { Feature01Slice } from '@/features/feature01/types';

export const createFeature01Slice: StateCreator<AppState, [], [], Feature01Slice> = (set) => ({
  featureState: {
    state1: 'state1',
    state2: 2,
  },
  featureActions: {
    setState1: (state1: string) => set((state) => ({ ...state, featureState: { ...state.featureState, state1 } })),
    setState2: (state2: number) => set((state) => ({ ...state, featureState: { ...state.featureState, state2 } })),
  },
});
