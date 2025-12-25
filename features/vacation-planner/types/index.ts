export type LocationType = 'standard' | 'hidden_gem';
export type PlanStatus = 'draft' | 'upcoming' | 'active' | 'completed';

export interface UserPreferences {
  interests: string[];
  vibe: 'luxury' | 'budget' | 'balanced';
}

export interface Location {
  id: number;
  name: string;
  type: LocationType;
  category: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  typicalVisitDuration: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Plan {
  id: number;
  userId: string;
  destination: string;
  city: string;
  country: string;
  startDate: Date;
  endDate: Date;
  maxDailyHours: number;
  breakfastDuration: number;
  lunchDuration: number;
  dinnerDuration: number;
  status: PlanStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface PlanActivity {
  id: number;
  planId: number;
  locationId: number | null;
  dayNumber: number;
  orderInDay: number;
  locationName: string;
  visitDuration: number;
  transitDuration: number;
  category: string;
  notes: string | null;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface PlanWithActivities extends Plan {
  activities: PlanActivity[];
}

export interface DaySchedule {
  dayNumber: number;
  date: Date;
  activities: PlanActivity[];
  totalActivityTime: number;
  totalTransitTime: number;
  totalBreakTime: number;
  totalTime: number;
  isOverBudget: boolean;
  availableTime: number;
}

export interface ScheduleValidation {
  isValid: boolean;
  violations: ScheduleViolation[];
  suggestions: string[];
}

export interface ScheduleViolation {
  dayNumber: number;
  totalTime: number;
  maxTime: number;
  overageMinutes: number;
}

export interface OptimizationResult {
  optimizedActivities: PlanActivity[];
  totalTransitTimeSaved: number;
  reorderedDays: number[];
}

export interface CreatePlanInput {
  destination: string;
  city: string;
  country: string;
  startDate: Date;
  endDate: Date;
  maxDailyHours: number;
  breakfastDuration?: number;
  lunchDuration?: number;
  dinnerDuration?: number;
}

export interface UpdatePlanInput {
  destination?: string;
  city?: string;
  country?: string;
  startDate?: Date;
  endDate?: Date;
  maxDailyHours?: number;
  breakfastDuration?: number;
  lunchDuration?: number;
  dinnerDuration?: number;
  status?: PlanStatus;
}

export interface CreateActivityInput {
  planId: number;
  locationId?: number;
  dayNumber: number;
  orderInDay: number;
  locationName: string;
  visitDuration: number;
  transitDuration?: number;
  category: string;
  notes?: string;
  priority?: number;
}

export interface UpdateActivityInput {
  dayNumber?: number;
  orderInDay?: number;
  visitDuration?: number;
  transitDuration?: number;
  notes?: string;
  priority?: number;
}

export interface OnboardingInput {
  homeBase: string;
  interests: string[];
  vibe: 'luxury' | 'budget' | 'balanced';
}

