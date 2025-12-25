'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, MapPin, MoreVertical, Copy, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import type { Plan } from '../types';
import Link from 'next/link';

interface PlannerDashboardProps {
  plans: Plan[];
  onClonePlan: (planId: number) => void;
  onDeletePlan: (planId: number) => void;
}

function PlanCard({ plan, onClone, onDelete }: { plan: Plan; onClone: () => void; onDelete: () => void }) {
  const statusColors = {
    draft: 'bg-gray-500',
    upcoming: 'bg-blue-500',
    active: 'bg-green-500',
    completed: 'bg-purple-500',
  };

  const statusLabels = {
    draft: 'Draft',
    upcoming: 'Upcoming',
    active: 'Active',
    completed: 'Completed',
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-xl font-semibold">{plan.destination}</h3>
              <Badge variant="outline" className={statusColors[plan.status]}>
                {statusLabels[plan.status]}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {plan.city}, {plan.country}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/planner/${plan.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Plan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onClone}>
                <Copy className="mr-2 h-4 w-4" />
                Clone Plan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Plan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(plan.startDate), 'MMM d, yyyy')} -{' '}
              {format(new Date(plan.endDate), 'MMM d, yyyy')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Max daily hours: {plan.maxDailyHours}h</span>
            <span>•</span>
            <span>
              {Math.ceil(
                (new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              ) + 1}{' '}
              days
            </span>
          </div>
        </div>

        <div className="mt-4">
          <Button asChild className="w-full">
            <Link href={`/planner/${plan.id}`}>View Plan</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function PlannerDashboard({ plans, onClonePlan, onDeletePlan }: PlannerDashboardProps) {
  const groupedPlans = {
    active: plans.filter((p) => p.status === 'active'),
    upcoming: plans.filter((p) => p.status === 'upcoming'),
    draft: plans.filter((p) => p.status === 'draft'),
    completed: plans.filter((p) => p.status === 'completed'),
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Vacation Plans</h1>
          <p className="text-muted-foreground">
            Manage and organize your travel adventures
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/planner/new">Create New Plan</Link>
        </Button>
      </div>

      {plans.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold">No plans yet</h2>
            <p className="text-muted-foreground">
              Start planning your next adventure by creating your first vacation plan
            </p>
            <Button asChild size="lg">
              <Link href="/planner/new">Create Your First Plan</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {groupedPlans.active.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-semibold">Active Trips</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedPlans.active.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onClone={() => onClonePlan(plan.id)}
                    onDelete={() => onDeletePlan(plan.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {groupedPlans.upcoming.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-semibold">Upcoming Trips</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedPlans.upcoming.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onClone={() => onClonePlan(plan.id)}
                    onDelete={() => onDeletePlan(plan.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {groupedPlans.draft.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-semibold">Drafts</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedPlans.draft.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onClone={() => onClonePlan(plan.id)}
                    onDelete={() => onDeletePlan(plan.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {groupedPlans.completed.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-semibold">Completed Trips</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedPlans.completed.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onClone={() => onClonePlan(plan.id)}
                    onDelete={() => onDeletePlan(plan.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

