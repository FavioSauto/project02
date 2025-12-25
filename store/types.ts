import { Feature01Slice } from '@/features/feature01/types';
import { VacationPlannerSlice } from '@/features/vacation-planner/slice';

export type AppState = Feature01Slice & VacationPlannerSlice & {};
