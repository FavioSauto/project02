'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createPlanSchema, type CreatePlanFormData } from '../schemas';
import { createPlan } from '../server/actions';
import { toast } from 'sonner';
import { getAvailableDestinations } from '../utils/mock-apis';

export function CreatePlanForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const destinations = getAvailableDestinations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePlanFormData>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      maxDailyHours: 8,
      breakfastDuration: 60,
      lunchDuration: 90,
      dinnerDuration: 120,
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  async function onSubmit(data: CreatePlanFormData) {
    setIsSubmitting(true);
    try {
      const plan = await createPlan(data);
      toast.success('Plan created successfully! (5 credits used)');
      router.push(`/planner/${plan.id}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create plan');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDestinationSelect(destination: string) {
    const [city, country] = destination.split(', ');
    setValue('destination', destination);
    setValue('city', city);
    setValue('country', country);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Destination</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="destination">Select Destination</Label>
            <select
              id="destination"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              onChange={(e) => handleDestinationSelect(e.target.value)}
            >
              <option value="">Choose a destination...</option>
              {destinations.map((dest) => (
                <option key={dest} value={dest}>
                  {dest}
                </option>
              ))}
            </select>
            {errors.destination && (
              <p className="mt-1 text-sm text-destructive">{errors.destination.message}</p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Travel Dates</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setValue('startDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && (
              <p className="mt-1 text-sm text-destructive">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setValue('endDate', date)}
                  initialFocus
                  disabled={(date) => startDate ? date < startDate : false}
                />
              </PopoverContent>
            </Popover>
            {errors.endDate && (
              <p className="mt-1 text-sm text-destructive">{errors.endDate.message}</p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Daily Schedule</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="maxDailyHours">Maximum Daily Hours</Label>
            <Input
              id="maxDailyHours"
              type="number"
              min="1"
              max="24"
              {...register('maxDailyHours', { valueAsNumber: true })}
            />
            <p className="mt-1 text-sm text-muted-foreground">
              How many hours per day do you want to spend on activities?
            </p>
            {errors.maxDailyHours && (
              <p className="mt-1 text-sm text-destructive">{errors.maxDailyHours.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="breakfastDuration">Breakfast (minutes)</Label>
              <Input
                id="breakfastDuration"
                type="number"
                min="0"
                {...register('breakfastDuration', { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="lunchDuration">Lunch (minutes)</Label>
              <Input
                id="lunchDuration"
                type="number"
                min="0"
                {...register('lunchDuration', { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="dinnerDuration">Dinner (minutes)</Label>
              <Input
                id="dinnerDuration"
                type="number"
                min="0"
                {...register('dinnerDuration', { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Plan (5 credits)'}
        </Button>
      </div>
    </form>
  );
}



