'use client';

import { useEffect, useState } from 'react';
import { PlannerDashboard } from '@/features/vacation-planner/components/planner-dashboard';
import { getMyPlans, clonePlan, deletePlan } from '@/features/vacation-planner/server/actions';
import type { Plan } from '@/features/vacation-planner/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function loadPlans() {
    async function fetchPlans() {
      try {
        const data = await getMyPlans();
        setPlans(data);
      } catch (error) {
        toast.error('Failed to load plans');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlans();
  }, []);

  async function handleClonePlan(planId: number) {
    try {
      const newPlan = await clonePlan(planId);
      setPlans([...plans, newPlan]);
      toast.success('Plan cloned successfully! (3 credits used)');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to clone plan');
      }
    }
  }

  async function handleDeletePlan(planId: number) {
    try {
      await deletePlan(planId);
      setPlans(plans.filter((p) => p.id !== planId));
      toast.success('Plan deleted successfully');
    } catch (error) {
      toast.error('Failed to delete plan');
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PlannerDashboard
        plans={plans}
        onClonePlan={handleClonePlan}
        onDeletePlan={handleDeletePlan}
      />
    </div>
  );
}
