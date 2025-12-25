import { create } from 'zustand';

import { AppState } from '@/store/types';
import { createFeature01Slice } from '@/features/feature01/slice';
import { createVacationPlannerSlice } from '@/features/vacation-planner/slice';

export function createStore() {
  return create<AppState>()((...a) => ({
    ...createFeature01Slice(...a),
    ...createVacationPlannerSlice(...a),
  }));
}
