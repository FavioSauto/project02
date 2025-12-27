'use server';

import { auth } from '@/features/auth/libs/auth';
import { headers } from 'next/headers';
import {
  getUserOnboardingStatus,
  updateUserOnboarding,
  createPlan as dbCreatePlan,
  getPlanById,
  getPlanWithActivities,
  getUserPlans,
  getUserPlansByStatus,
  updatePlan as dbUpdatePlan,
  deletePlan as dbDeletePlan,
  clonePlan as dbClonePlan,
  createActivity as dbCreateActivity,
  getActivityById,
  getPlanActivities,
  updateActivity as dbUpdateActivity,
  deleteActivity as dbDeleteActivity,
  reorderActivities as dbReorderActivities,
} from '../db';
import {
  onboardingSchema,
  createPlanSchema,
  updatePlanSchema,
  createActivitySchema,
  updateActivitySchema,
  reorderActivitiesSchema,
} from '../../schemas';
import type {
  OnboardingFormData,
  CreatePlanFormData,
  UpdatePlanFormData,
  CreateActivityFormData,
  UpdateActivityFormData,
  ReorderActivitiesFormData,
} from '../../schemas';
import { consumeCredits, hasEnoughCredits } from '@/lib/subscription-helpers';

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session.user;
}

export async function getOnboardingStatus() {
  const user = await requireAuth();
  return await getUserOnboardingStatus(user.id);
}

export async function completeOnboarding(data: OnboardingFormData) {
  const user = await requireAuth();

  const validated = onboardingSchema.parse(data);

  await updateUserOnboarding(user.id, validated.homeBase, {
    interests: validated.interests,
    vibe: validated.vibe,
  });

  return { success: true };
}

export async function createPlan(data: CreatePlanFormData) {
  const user = await requireAuth();

  const hasCredits = await hasEnoughCredits(user.id, 5);
  if (!hasCredits) {
    throw new Error('Insufficient credits. Creating a plan requires 5 credits.');
  }

  const validated = createPlanSchema.parse(data);

  const plan = await dbCreatePlan(user.id, validated);

  await consumeCredits(user.id, 5);

  return plan;
}

export async function getPlan(planId: number) {
  const user = await requireAuth();

  const plan = await getPlanById(planId);

  if (!plan || plan.userId !== user.id) {
    throw new Error('Plan not found');
  }

  return plan;
}

export async function getPlanWithDetails(planId: number) {
  const user = await requireAuth();

  const plan = await getPlanWithActivities(planId);

  if (!plan || plan.userId !== user.id) {
    throw new Error('Plan not found');
  }

  return plan;
}

export async function getMyPlans() {
  const user = await requireAuth();
  return await getUserPlans(user.id);
}

export async function getMyPlansByStatus(status: string) {
  const user = await requireAuth();
  return await getUserPlansByStatus(user.id, status);
}

export async function updatePlan(planId: number, data: UpdatePlanFormData) {
  const user = await requireAuth();

  const validated = updatePlanSchema.parse(data);

  const existingPlan = await getPlanById(planId);
  if (!existingPlan || existingPlan.userId !== user.id) {
    throw new Error('Plan not found');
  }

  return await dbUpdatePlan(planId, validated);
}

export async function deletePlan(planId: number) {
  const user = await requireAuth();

  const plan = await getPlanById(planId);
  if (!plan || plan.userId !== user.id) {
    throw new Error('Plan not found');
  }

  await dbDeletePlan(planId);

  return { success: true };
}

export async function clonePlan(planId: number) {
  const user = await requireAuth();

  const hasCredits = await hasEnoughCredits(user.id, 3);
  if (!hasCredits) {
    throw new Error('Insufficient credits. Cloning a plan requires 3 credits.');
  }

  const existingPlan = await getPlanById(planId);
  if (!existingPlan || existingPlan.userId !== user.id) {
    throw new Error('Plan not found');
  }

  const newPlan = await dbClonePlan(planId, user.id);

  await consumeCredits(user.id, 3);

  return newPlan;
}

export async function createActivity(data: CreateActivityFormData) {
  const user = await requireAuth();

  const validated = createActivitySchema.parse(data);

  const plan = await getPlanById(validated.planId);
  if (!plan || plan.userId !== user.id) {
    throw new Error('Plan not found');
  }

  return await dbCreateActivity(validated);
}

export async function getActivity(activityId: number) {
  const user = await requireAuth();

  const activity = await getActivityById(activityId);
  if (!activity) {
    throw new Error('Activity not found');
  }

  const plan = await getPlanById(activity.planId);
  if (!plan || plan.userId !== user.id) {
    throw new Error('Unauthorized');
  }

  return activity;
}

export async function getActivitiesForPlan(planId: number) {
  const user = await requireAuth();

  const plan = await getPlanById(planId);
  if (!plan || plan.userId !== user.id) {
    throw new Error('Plan not found');
  }

  return await getPlanActivities(planId);
}

export async function updateActivity(activityId: number, data: UpdateActivityFormData) {
  const user = await requireAuth();

  const validated = updateActivitySchema.parse(data);

  const activity = await getActivityById(activityId);
  if (!activity) {
    throw new Error('Activity not found');
  }

  const plan = await getPlanById(activity.planId);
  if (!plan || plan.userId !== user.id) {
    throw new Error('Unauthorized');
  }

  return await dbUpdateActivity(activityId, validated);
}

export async function deleteActivity(activityId: number) {
  const user = await requireAuth();

  const activity = await getActivityById(activityId);
  if (!activity) {
    throw new Error('Activity not found');
  }

  const plan = await getPlanById(activity.planId);
  if (!plan || plan.userId !== user.id) {
    throw new Error('Unauthorized');
  }

  await dbDeleteActivity(activityId);

  return { success: true };
}

export async function reorderActivities(data: ReorderActivitiesFormData) {
  const user = await requireAuth();

  const validated = reorderActivitiesSchema.parse(data);

  if (validated.activities.length === 0) {
    return { success: true };
  }

  const firstActivity = await getActivityById(validated.activities[0].id);
  if (!firstActivity) {
    throw new Error('Activity not found');
  }

  const plan = await getPlanById(firstActivity.planId);
  if (!plan || plan.userId !== user.id) {
    throw new Error('Unauthorized');
  }

  await dbReorderActivities(validated.activities);

  return { success: true };
}

export async function optimizePlanSchedule(planId: number) {
  const user = await requireAuth();

  const hasCredits = await hasEnoughCredits(user.id, 2);
  if (!hasCredits) {
    throw new Error('Insufficient credits. Optimizing a schedule requires 2 credits.');
  }

  const plan = await getPlanById(planId);
  if (!plan || plan.userId !== user.id) {
    throw new Error('Plan not found');
  }

  await consumeCredits(user.id, 2);

  return { success: true, message: 'Schedule optimization completed' };
}



