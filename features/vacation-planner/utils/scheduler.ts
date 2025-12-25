import type {
  PlanActivity,
  DaySchedule,
  ScheduleValidation,
  ScheduleViolation,
  OptimizationResult,
  Plan,
} from '../types';
import { mockMapboxTransit } from './mock-apis';

interface ActivityWithCoordinates extends PlanActivity {
  latitude?: number;
  longitude?: number;
}

export function calculateDaySchedules(
  plan: Plan,
  activities: PlanActivity[]
): DaySchedule[] {
  const tripDays = Math.ceil(
    (plan.endDate.getTime() - plan.startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const schedules: DaySchedule[] = [];

  for (let day = 1; day <= tripDays; day++) {
    const dayActivities = activities
      .filter((a) => a.dayNumber === day && !a.deletedAt)
      .sort((a, b) => a.orderInDay - b.orderInDay);

    const totalActivityTime = dayActivities.reduce((sum, a) => sum + a.visitDuration, 0);
    const totalTransitTime = dayActivities.reduce((sum, a) => sum + a.transitDuration, 0);
    const totalBreakTime = plan.breakfastDuration + plan.lunchDuration + plan.dinnerDuration;
    const totalTime = totalActivityTime + totalTransitTime + totalBreakTime;
    const maxTime = plan.maxDailyHours * 60;

    const dayDate = new Date(plan.startDate);
    dayDate.setDate(dayDate.getDate() + (day - 1));

    schedules.push({
      dayNumber: day,
      date: dayDate,
      activities: dayActivities,
      totalActivityTime,
      totalTransitTime,
      totalBreakTime,
      totalTime,
      isOverBudget: totalTime > maxTime,
      availableTime: maxTime - totalTime,
    });
  }

  return schedules;
}

export function validateSchedule(
  plan: Plan,
  activities: PlanActivity[]
): ScheduleValidation {
  const daySchedules = calculateDaySchedules(plan, activities);
  const violations: ScheduleViolation[] = [];
  const suggestions: string[] = [];

  for (const schedule of daySchedules) {
    if (schedule.isOverBudget) {
      const maxTime = plan.maxDailyHours * 60;
      violations.push({
        dayNumber: schedule.dayNumber,
        totalTime: schedule.totalTime,
        maxTime,
        overageMinutes: schedule.totalTime - maxTime,
      });

      const lowestPriorityActivities = [...schedule.activities]
        .sort((a, b) => a.priority - b.priority)
        .slice(0, 3);

      suggestions.push(
        `Day ${schedule.dayNumber}: Remove or shorten activities like "${lowestPriorityActivities.map((a) => a.locationName).join('", "')}"`
      );
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
    suggestions,
  };
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function optimizeActivitiesOrder(
  activities: ActivityWithCoordinates[]
): Promise<OptimizationResult> {
  const activitiesByDay = new Map<number, ActivityWithCoordinates[]>();

  for (const activity of activities) {
    if (!activitiesByDay.has(activity.dayNumber)) {
      activitiesByDay.set(activity.dayNumber, []);
    }
    activitiesByDay.get(activity.dayNumber)!.push(activity);
  }

  const optimizedActivities: PlanActivity[] = [];
  const reorderedDays: number[] = [];
  let totalTransitTimeSaved = 0;

  for (const [dayNumber, dayActivities] of activitiesByDay) {
    if (dayActivities.length <= 1) {
      optimizedActivities.push(...dayActivities);
      continue;
    }

    const activitiesWithCoords = dayActivities.filter(
      (a) => a.latitude !== undefined && a.longitude !== undefined
    );

    if (activitiesWithCoords.length !== dayActivities.length) {
      optimizedActivities.push(...dayActivities);
      continue;
    }

    const originalTransitTime = dayActivities.reduce((sum, a) => sum + a.transitDuration, 0);

    const ordered = nearestNeighborSort(activitiesWithCoords);

    for (let i = 0; i < ordered.length; i++) {
      let transitDuration = 0;

      if (i < ordered.length - 1) {
        const current = ordered[i];
        const next = ordered[i + 1];
        const distance = calculateDistance(
          current.latitude!,
          current.longitude!,
          next.latitude!,
          next.longitude!
        );
        transitDuration = Math.round(distance * 0.5 * 60);
      }

      optimizedActivities.push({
        ...ordered[i],
        orderInDay: i,
        transitDuration,
      });
    }

    const newTransitTime = optimizedActivities
      .filter((a) => a.dayNumber === dayNumber)
      .reduce((sum, a) => sum + a.transitDuration, 0);

    if (newTransitTime < originalTransitTime) {
      totalTransitTimeSaved += originalTransitTime - newTransitTime;
      reorderedDays.push(dayNumber);
    }
  }

  return {
    optimizedActivities,
    totalTransitTimeSaved,
    reorderedDays,
  };
}

function nearestNeighborSort(activities: ActivityWithCoordinates[]): ActivityWithCoordinates[] {
  if (activities.length === 0) {
    return [];
  }

  const sorted: ActivityWithCoordinates[] = [];
  const remaining = [...activities];

  sorted.push(remaining.shift()!);

  while (remaining.length > 0) {
    const current = sorted[sorted.length - 1];
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const distance = calculateDistance(
        current.latitude!,
        current.longitude!,
        remaining[i].latitude!,
        remaining[i].longitude!
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    sorted.push(remaining.splice(nearestIndex, 1)[0]);
  }

  return sorted;
}

export async function calculateTransitTimes(
  activities: ActivityWithCoordinates[]
): Promise<PlanActivity[]> {
  const result: PlanActivity[] = [];

  const activitiesByDay = new Map<number, ActivityWithCoordinates[]>();
  for (const activity of activities) {
    if (!activitiesByDay.has(activity.dayNumber)) {
      activitiesByDay.set(activity.dayNumber, []);
    }
    activitiesByDay.get(activity.dayNumber)!.push(activity);
  }

  for (const [, dayActivities] of activitiesByDay) {
    const sorted = [...dayActivities].sort((a, b) => a.orderInDay - b.orderInDay);

    for (let i = 0; i < sorted.length; i++) {
      const activity = sorted[i];
      let transitDuration = 0;

      if (i < sorted.length - 1 && activity.latitude && activity.longitude) {
        const next = sorted[i + 1];
        if (next.latitude && next.longitude) {
          const transitResult = await mockMapboxTransit(
            activity.latitude,
            activity.longitude,
            next.latitude,
            next.longitude
          );
          transitDuration = transitResult.duration;
        }
      }

      result.push({
        ...activity,
        transitDuration,
      });
    }
  }

  return result;
}

export function getTotalPlanDuration(plan: Plan): number {
  return Math.ceil(
    (plan.endDate.getTime() - plan.startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
}

export function getActivitySuggestions(
  plan: Plan,
  currentActivities: PlanActivity[]
): string[] {
  const suggestions: string[] = [];
  const daySchedules = calculateDaySchedules(plan, currentActivities);

  for (const schedule of daySchedules) {
    if (schedule.availableTime > 120) {
      suggestions.push(
        `Day ${schedule.dayNumber}: You have ${Math.floor(schedule.availableTime / 60)} hours available. Consider adding more activities.`
      );
    }

    if (schedule.activities.length === 0) {
      suggestions.push(`Day ${schedule.dayNumber}: No activities planned yet.`);
    }
  }

  return suggestions;
}

