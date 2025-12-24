import { create } from 'zustand';

import { AppState } from '@/store/types';
import { createFeature01Slice } from '@/features/feature01/slice';

export function createStore() {
  return create<AppState>()((...a) => ({
    ...createFeature01Slice(...a),
  }));
}
