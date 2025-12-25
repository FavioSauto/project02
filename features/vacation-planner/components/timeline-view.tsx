'use client';

import { useMemo } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GripVertical, Clock, Navigation, AlertTriangle, Trash2 } from 'lucide-react';
import type { DaySchedule, PlanActivity } from '../types';
import { format } from 'date-fns';

interface TimelineViewProps {
  daySchedules: DaySchedule[];
  onReorder: (activities: Array<{ id: number; dayNumber: number; orderInDay: number }>) => void;
  onDeleteActivity: (activityId: number) => void;
  selectedDay?: number | null;
  onSelectDay?: (day: number) => void;
}

interface SortableActivityProps {
  activity: PlanActivity;
  onDelete: (id: number) => void;
}

function SortableActivity({ activity, onDelete }: SortableActivityProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-2">
      <Card className="p-3">
        <div className="flex items-start gap-3">
          <button
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab touch-none active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{activity.locationName}</h4>
                <Badge variant="outline" className="mt-1">
                  {activity.category}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(activity.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Visit: {activity.visitDuration} min
              </span>
              {activity.transitDuration > 0 && (
                <span className="flex items-center gap-1">
                  <Navigation className="h-3 w-3" />
                  Transit: {activity.transitDuration} min
                </span>
              )}
            </div>

            {activity.notes && (
              <p className="text-sm text-muted-foreground">{activity.notes}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export function TimelineView({
  daySchedules,
  onReorder,
  onDeleteActivity,
  selectedDay,
  onSelectDay,
}: TimelineViewProps) {
  const currentSchedule = useMemo(
    function getCurrentSchedule() {
      if (selectedDay) {
        return daySchedules.find((s) => s.dayNumber === selectedDay);
      }
      return daySchedules[0];
    },
    [daySchedules, selectedDay]
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id || !currentSchedule) {
      return;
    }

    const activities = currentSchedule.activities;
    const oldIndex = activities.findIndex((a) => a.id === active.id);
    const newIndex = activities.findIndex((a) => a.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reordered = [...activities];
    const [movedItem] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, movedItem);

    const updates = reordered.map((activity, index) => ({
      id: activity.id,
      dayNumber: currentSchedule.dayNumber,
      orderInDay: index,
    }));

    onReorder(updates);
  }

  if (!currentSchedule) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No schedule available</p>
      </div>
    );
  }

  const maxTime = currentSchedule.totalTime - currentSchedule.totalBreakTime;
  const activityPercentage = (currentSchedule.totalActivityTime / maxTime) * 100;
  const transitPercentage = (currentSchedule.totalTransitTime / maxTime) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Day {currentSchedule.dayNumber}
          </h2>
          <p className="text-sm text-muted-foreground">
            {format(currentSchedule.date, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {daySchedules.length > 1 && (
          <div className="flex gap-2">
            {daySchedules.map((schedule) => (
              <Button
                key={schedule.dayNumber}
                variant={schedule.dayNumber === currentSchedule.dayNumber ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSelectDay?.(schedule.dayNumber)}
              >
                Day {schedule.dayNumber}
              </Button>
            ))}
          </div>
        )}
      </div>

      {currentSchedule.isOverBudget && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This day exceeds your daily time budget by{' '}
            {Math.floor((currentSchedule.totalTime - (currentSchedule.availableTime + currentSchedule.totalTime)) / 60)}{' '}
            hours. Consider removing or shortening some activities.
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-4">
        <h3 className="mb-3 font-semibold">Time Budget</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Activities: {Math.floor(currentSchedule.totalActivityTime / 60)}h {currentSchedule.totalActivityTime % 60}m</span>
            <span>Transit: {Math.floor(currentSchedule.totalTransitTime / 60)}h {currentSchedule.totalTransitTime % 60}m</span>
            <span>Breaks: {Math.floor(currentSchedule.totalBreakTime / 60)}h {currentSchedule.totalBreakTime % 60}m</span>
          </div>

          <div className="h-8 w-full overflow-hidden rounded-full bg-muted">
            <div className="flex h-full">
              <div
                className="bg-blue-500"
                style={{ width: `${activityPercentage}%` }}
                title="Activities"
              />
              <div
                className="bg-gray-500"
                style={{ width: `${transitPercentage}%` }}
                title="Transit"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span>Activities</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-500" />
                <span>Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span>Breaks</span>
              </div>
            </div>
            <span className={currentSchedule.isOverBudget ? 'text-destructive font-medium' : ''}>
              Total: {Math.floor(currentSchedule.totalTime / 60)}h {currentSchedule.totalTime % 60}m
            </span>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="mb-3 font-semibold">Activities</h3>
        {currentSchedule.activities.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No activities planned for this day yet.</p>
          </Card>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={currentSchedule.activities.map((a) => a.id)}
              strategy={verticalListSortingStrategy}
            >
              {currentSchedule.activities.map((activity) => (
                <SortableActivity
                  key={activity.id}
                  activity={activity}
                  onDelete={onDeleteActivity}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

