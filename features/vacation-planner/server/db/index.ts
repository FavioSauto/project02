import { db } from '@/drizzle/db';
import { user, plan, planActivity, location } from '@/drizzle/schema';
import { eq, and, isNull, desc, asc } from 'drizzle-orm';
import type {
  Plan,
  PlanActivity,
  Location,
  CreatePlanInput,
  UpdatePlanInput,
  CreateActivityInput,
  UpdateActivityInput,
  PlanWithActivities,
  UserPreferences,
} from '../../types';

export async function getUserOnboardingStatus(userId: string) {
  const result = await db
    .select({
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      homeBase: user.homeBase,
      preferences: user.preferences,
    })
    .from(user)
    .where(and(eq(user.id, userId), isNull(user.deletedAt)))
    .limit(1);

  return result[0] || null;
}

export async function updateUserOnboarding(
  userId: string,
  homeBase: string,
  preferences: UserPreferences
) {
  await db
    .update(user)
    .set({
      homeBase,
      preferences,
      hasCompletedOnboarding: true,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId));
}

export async function createPlan(userId: string, input: CreatePlanInput): Promise<Plan> {
  const result = await db
    .insert(plan)
    .values({
      userId,
      destination: input.destination,
      city: input.city,
      country: input.country,
      startDate: input.startDate,
      endDate: input.endDate,
      maxDailyHours: input.maxDailyHours,
      breakfastDuration: input.breakfastDuration ?? 60,
      lunchDuration: input.lunchDuration ?? 90,
      dinnerDuration: input.dinnerDuration ?? 120,
      status: 'draft',
    })
    .returning();

  return result[0] as Plan;
}

export async function getPlanById(planId: number): Promise<Plan | null> {
  const result = await db
    .select()
    .from(plan)
    .where(and(eq(plan.id, planId), isNull(plan.deletedAt)))
    .limit(1);

  return (result[0] as Plan) || null;
}

export async function getPlanWithActivities(planId: number): Promise<PlanWithActivities | null> {
  const planResult = await db
    .select()
    .from(plan)
    .where(and(eq(plan.id, planId), isNull(plan.deletedAt)))
    .limit(1);

  if (!planResult[0]) {
    return null;
  }

  const activities = await db
    .select()
    .from(planActivity)
    .where(and(eq(planActivity.planId, planId), isNull(planActivity.deletedAt)))
    .orderBy(asc(planActivity.dayNumber), asc(planActivity.orderInDay));

  return {
    ...(planResult[0] as Plan),
    activities: activities as PlanActivity[],
  };
}

export async function getUserPlans(userId: string): Promise<Plan[]> {
  const result = await db
    .select()
    .from(plan)
    .where(and(eq(plan.userId, userId), isNull(plan.deletedAt)))
    .orderBy(desc(plan.createdAt));

  return result as Plan[];
}

export async function getUserPlansByStatus(userId: string, status: string): Promise<Plan[]> {
  const result = await db
    .select()
    .from(plan)
    .where(and(eq(plan.userId, userId), eq(plan.status, status), isNull(plan.deletedAt)))
    .orderBy(desc(plan.startDate));

  return result as Plan[];
}

export async function updatePlan(planId: number, input: UpdatePlanInput): Promise<Plan | null> {
  const result = await db
    .update(plan)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(and(eq(plan.id, planId), isNull(plan.deletedAt)))
    .returning();

  return (result[0] as Plan) || null;
}

export async function deletePlan(planId: number): Promise<void> {
  await db
    .update(plan)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(plan.id, planId));
}

export async function clonePlan(originalPlanId: number, userId: string): Promise<Plan> {
  const originalPlan = await getPlanWithActivities(originalPlanId);

  if (!originalPlan) {
    throw new Error('Original plan not found');
  }

  const newPlan = await createPlan(userId, {
    destination: originalPlan.destination,
    city: originalPlan.city,
    country: originalPlan.country,
    startDate: originalPlan.startDate,
    endDate: originalPlan.endDate,
    maxDailyHours: originalPlan.maxDailyHours,
    breakfastDuration: originalPlan.breakfastDuration,
    lunchDuration: originalPlan.lunchDuration,
    dinnerDuration: originalPlan.dinnerDuration,
  });

  for (const activity of originalPlan.activities) {
    await createActivity({
      planId: newPlan.id,
      locationId: activity.locationId ?? undefined,
      dayNumber: activity.dayNumber,
      orderInDay: activity.orderInDay,
      locationName: activity.locationName,
      visitDuration: activity.visitDuration,
      transitDuration: activity.transitDuration,
      category: activity.category,
      notes: activity.notes ?? undefined,
      priority: activity.priority,
    });
  }

  return newPlan;
}

export async function createActivity(input: CreateActivityInput): Promise<PlanActivity> {
  const result = await db
    .insert(planActivity)
    .values({
      planId: input.planId,
      locationId: input.locationId ?? null,
      dayNumber: input.dayNumber,
      orderInDay: input.orderInDay,
      locationName: input.locationName,
      visitDuration: input.visitDuration,
      transitDuration: input.transitDuration ?? 0,
      category: input.category,
      notes: input.notes ?? null,
      priority: input.priority ?? 5,
    })
    .returning();

  return result[0] as PlanActivity;
}

export async function getActivityById(activityId: number): Promise<PlanActivity | null> {
  const result = await db
    .select()
    .from(planActivity)
    .where(and(eq(planActivity.id, activityId), isNull(planActivity.deletedAt)))
    .limit(1);

  return (result[0] as PlanActivity) || null;
}

export async function getPlanActivities(planId: number): Promise<PlanActivity[]> {
  const result = await db
    .select()
    .from(planActivity)
    .where(and(eq(planActivity.planId, planId), isNull(planActivity.deletedAt)))
    .orderBy(asc(planActivity.dayNumber), asc(planActivity.orderInDay));

  return result as PlanActivity[];
}

export async function updateActivity(
  activityId: number,
  input: UpdateActivityInput
): Promise<PlanActivity | null> {
  const result = await db
    .update(planActivity)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(and(eq(planActivity.id, activityId), isNull(planActivity.deletedAt)))
    .returning();

  return (result[0] as PlanActivity) || null;
}

export async function deleteActivity(activityId: number): Promise<void> {
  await db
    .update(planActivity)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(planActivity.id, activityId));
}

export async function reorderActivities(
  updates: Array<{ id: number; dayNumber: number; orderInDay: number }>
): Promise<void> {
  for (const update of updates) {
    await db
      .update(planActivity)
      .set({
        dayNumber: update.dayNumber,
        orderInDay: update.orderInDay,
        updatedAt: new Date(),
      })
      .where(eq(planActivity.id, update.id));
  }
}

export async function getLocationById(locationId: number): Promise<Location | null> {
  const result = await db
    .select()
    .from(location)
    .where(and(eq(location.id, locationId), isNull(location.deletedAt)))
    .limit(1);

  return (result[0] as Location) || null;
}

export async function createLocation(input: Omit<Location, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Location> {
  const result = await db
    .insert(location)
    .values(input)
    .returning();

  return result[0] as Location;
}

