'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimelineView } from './timeline-view';
import { LocationSelector } from './location-selector';
import { MapPin, Calendar, Clock, Plus, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import type { PlanWithActivities, DaySchedule } from '../types';
import { calculateDaySchedules } from '../utils/scheduler';
import {
  createActivity,
  deleteActivity,
  reorderActivities,
  optimizePlanSchedule,
} from '../server/actions';
import { toast } from 'sonner';

interface PlanDetailViewProps {
  initialPlan: PlanWithActivities;
}

export function PlanDetailView({ initialPlan }: PlanDetailViewProps) {
  const [plan, setPlan] = useState(initialPlan);
  const [daySchedules, setDaySchedules] = useState<DaySchedule[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(
    function calculateSchedules() {
      const schedules = calculateDaySchedules(plan, plan.activities);
      setDaySchedules(schedules);
    },
    [plan]
  );

  async function handleAddActivity() {
    if (!selectedLocation) {
      toast.error('Please select a location');
      return;
    }

    try {
      const newActivity = await createActivity({
        planId: plan.id,
        locationId: undefined,
        dayNumber: selectedDay,
        orderInDay: plan.activities.filter((a) => a.dayNumber === selectedDay).length,
        locationName: selectedLocation.name,
        visitDuration: selectedLocation.typicalVisitDuration,
        transitDuration: 0,
        category: selectedLocation.category,
        priority: 5,
      });

      setPlan({
        ...plan,
        activities: [...plan.activities, newActivity],
      });

      setSelectedLocation(null);
      setIsAddingActivity(false);
      toast.success('Activity added successfully');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to add activity');
      }
    }
  }

  async function handleDeleteActivity(activityId: number) {
    try {
      await deleteActivity(activityId);
      setPlan({
        ...plan,
        activities: plan.activities.filter((a) => a.id !== activityId),
      });
      toast.success('Activity removed');
    } catch (error) {
      toast.error('Failed to remove activity');
    }
  }

  async function handleReorder(updates: Array<{ id: number; dayNumber: number; orderInDay: number }>) {
    try {
      await reorderActivities({ activities: updates });
      
      const updatedActivities = plan.activities.map((activity) => {
        const update = updates.find((u) => u.id === activity.id);
        if (update) {
          return { ...activity, dayNumber: update.dayNumber, orderInDay: update.orderInDay };
        }
        return activity;
      });

      setPlan({
        ...plan,
        activities: updatedActivities,
      });
    } catch (error) {
      toast.error('Failed to reorder activities');
    }
  }

  async function handleOptimize() {
    setIsOptimizing(true);
    try {
      await optimizePlanSchedule(plan.id);
      toast.success('Schedule optimized! (2 credits used)');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to optimize schedule');
      }
    } finally {
      setIsOptimizing(false);
    }
  }

  const statusColors = {
    draft: 'bg-gray-500',
    upcoming: 'bg-blue-500',
    active: 'bg-green-500',
    completed: 'bg-purple-500',
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-3xl font-bold">{plan.destination}</h1>
              <Badge variant="outline" className={statusColors[plan.status]}>
                {plan.status}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {plan.city}, {plan.country}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(plan.startDate), 'MMM d')} - {format(new Date(plan.endDate), 'MMM d, yyyy')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {plan.maxDailyHours}h daily max
              </span>
            </div>
          </div>

          <Button onClick={handleOptimize} disabled={isOptimizing || plan.activities.length === 0}>
            <Sparkles className="mr-2 h-4 w-4" />
            {isOptimizing ? 'Optimizing...' : 'Optimize Schedule (2 credits)'}
          </Button>
        </div>
      </Card>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="add-activity">Add Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <TimelineView
            daySchedules={daySchedules}
            onReorder={handleReorder}
            onDeleteActivity={handleDeleteActivity}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        </TabsContent>

        <TabsContent value="add-activity" className="space-y-4">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Add New Activity</h2>
            
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Select Day</label>
              <div className="flex gap-2">
                {daySchedules.map((schedule) => (
                  <Button
                    key={schedule.dayNumber}
                    variant={schedule.dayNumber === selectedDay ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDay(schedule.dayNumber)}
                  >
                    Day {schedule.dayNumber}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Search Location</label>
              <LocationSelector
                value={selectedLocation}
                onSelect={setSelectedLocation}
                destination={plan.destination}
                placeholder="Search for activities and attractions..."
              />
            </div>

            <Button onClick={handleAddActivity} disabled={!selectedLocation} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

