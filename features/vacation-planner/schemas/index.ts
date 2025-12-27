import { z } from 'zod';

export const onboardingSchema = z.object({
  homeBase: z.string().min(1, 'Home base is required'),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  vibe: z.enum(['luxury', 'budget', 'balanced']),
});

export const createPlanSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  maxDailyHours: z.number().min(1).max(24),
  breakfastDuration: z.number().min(0).max(180).optional(),
  lunchDuration: z.number().min(0).max(180).optional(),
  dinnerDuration: z.number().min(0).max(240).optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const updatePlanSchema = z.object({
  destination: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  maxDailyHours: z.number().min(1).max(24).optional(),
  breakfastDuration: z.number().min(0).max(180).optional(),
  lunchDuration: z.number().min(0).max(180).optional(),
  dinnerDuration: z.number().min(0).max(240).optional(),
  status: z.enum(['draft', 'upcoming', 'active', 'completed']).optional(),
});

export const createActivitySchema = z.object({
  planId: z.number().int().positive(),
  locationId: z.number().int().positive().optional(),
  dayNumber: z.number().int().positive(),
  orderInDay: z.number().int().min(0),
  locationName: z.string().min(1, 'Location name is required'),
  visitDuration: z.number().int().min(1, 'Visit duration must be at least 1 minute'),
  transitDuration: z.number().int().min(0).optional(),
  category: z.string().min(1, 'Category is required'),
  notes: z.string().optional(),
  priority: z.number().int().min(1).max(10).optional(),
});

export const updateActivitySchema = z.object({
  dayNumber: z.number().int().positive().optional(),
  orderInDay: z.number().int().min(0).optional(),
  visitDuration: z.number().int().min(1).optional(),
  transitDuration: z.number().int().min(0).optional(),
  notes: z.string().optional(),
  priority: z.number().int().min(1).max(10).optional(),
});

export const reorderActivitiesSchema = z.object({
  activities: z.array(
    z.object({
      id: z.number().int().positive(),
      dayNumber: z.number().int().positive(),
      orderInDay: z.number().int().min(0),
    })
  ),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type CreatePlanFormData = z.infer<typeof createPlanSchema>;
export type UpdatePlanFormData = z.infer<typeof updatePlanSchema>;
export type CreateActivityFormData = z.infer<typeof createActivitySchema>;
export type UpdateActivityFormData = z.infer<typeof updateActivitySchema>;
export type ReorderActivitiesFormData = z.infer<typeof reorderActivitiesSchema>;



