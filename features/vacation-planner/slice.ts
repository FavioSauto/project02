import type { StateCreator } from 'zustand';
import type { Plan, PlanActivity, DaySchedule } from './types';

export interface VacationPlannerSlice {
  currentPlan: Plan | null;
  currentActivities: PlanActivity[];
  daySchedules: DaySchedule[];
  selectedDay: number | null;
  isOptimizing: boolean;
  
  setCurrentPlan: (plan: Plan | null) => void;
  setCurrentActivities: (activities: PlanActivity[]) => void;
  setDaySchedules: (schedules: DaySchedule[]) => void;
  setSelectedDay: (day: number | null) => void;
  setIsOptimizing: (isOptimizing: boolean) => void;
  
  addActivity: (activity: PlanActivity) => void;
  updateActivity: (activityId: number, updates: Partial<PlanActivity>) => void;
  removeActivity: (activityId: number) => void;
  
  clearPlannerState: () => void;
}

export const createVacationPlannerSlice: StateCreator<
  VacationPlannerSlice,
  [],
  [],
  VacationPlannerSlice
> = (set) => ({
  currentPlan: null,
  currentActivities: [],
  daySchedules: [],
  selectedDay: null,
  isOptimizing: false,

  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  
  setCurrentActivities: (activities) => set({ currentActivities: activities }),
  
  setDaySchedules: (schedules) => set({ daySchedules: schedules }),
  
  setSelectedDay: (day) => set({ selectedDay: day }),
  
  setIsOptimizing: (isOptimizing) => set({ isOptimizing }),
  
  addActivity: (activity) =>
    set((state) => ({
      currentActivities: [...state.currentActivities, activity],
    })),
  
  updateActivity: (activityId, updates) =>
    set((state) => ({
      currentActivities: state.currentActivities.map((activity) =>
        activity.id === activityId ? { ...activity, ...updates } : activity
      ),
    })),
  
  removeActivity: (activityId) =>
    set((state) => ({
      currentActivities: state.currentActivities.filter(
        (activity) => activity.id !== activityId
      ),
    })),
  
  clearPlannerState: () =>
    set({
      currentPlan: null,
      currentActivities: [],
      daySchedules: [],
      selectedDay: null,
      isOptimizing: false,
    }),
});

