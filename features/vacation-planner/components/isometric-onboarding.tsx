'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { completeOnboarding } from '../server/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const INTERESTS = [
  { id: 'gastronomy', label: 'Gastronomy', color: 'bg-orange-500' },
  { id: 'nature', label: 'Nature', color: 'bg-green-500' },
  { id: 'history', label: 'History', color: 'bg-blue-500' },
  { id: 'nightlife', label: 'Nightlife', color: 'bg-purple-500' },
  { id: 'adventure', label: 'Adventure', color: 'bg-red-500' },
];

const VIBES = [
  { id: 'luxury', label: 'Luxury', color: 'bg-amber-500' },
  { id: 'budget', label: 'Budget', color: 'bg-emerald-500' },
  { id: 'balanced', label: 'Balanced', color: 'bg-sky-500' },
];

export function IsometricOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [homeBase, setHomeBase] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<'luxury' | 'budget' | 'balanced' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleInterest(interestId: string) {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter((id) => id !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  }

  async function handleSubmit() {
    if (!homeBase || selectedInterests.length === 0 || !selectedVibe) {
      toast.error('Please complete all steps');
      return;
    }

    setIsSubmitting(true);
    try {
      await completeOnboarding({
        homeBase,
        interests: selectedInterests,
        vibe: selectedVibe,
      });
      toast.success('Welcome to VoyageOptima!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to complete onboarding');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Welcome to VoyageOptima</h1>
        <p className="mt-2 text-muted-foreground">
          Let us know your preferences to create the perfect vacation plans
        </p>
      </div>

      <div className="mb-8 flex justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 w-16 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">Where do you call home?</h2>
            <div className="space-y-2">
              <Label htmlFor="homeBase">Home Base</Label>
              <Input
                id="homeBase"
                placeholder="e.g., New York, USA"
                value={homeBase}
                onChange={(e) => setHomeBase(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                We will use this to calculate travel times and suggest destinations
              </p>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!homeBase}>
              Next
            </Button>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">What interests you?</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Select at least one interest to help us tailor your vacation plans
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {INTERESTS.map((interest) => (
                <motion.button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative overflow-hidden rounded-lg border-2 p-6 transition-all ${
                    selectedInterests.includes(interest.id)
                      ? 'border-primary shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div
                    className={`mx-auto mb-3 h-16 w-16 rounded-lg ${interest.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]`}
                    style={{
                      transform: 'rotateX(45deg) rotateZ(45deg)',
                    }}
                  />
                  <p className="font-medium">{interest.label}</p>
                </motion.button>
              ))}
            </div>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)} disabled={selectedInterests.length === 0}>
              Next
            </Button>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">What is your travel vibe?</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Choose the style that best matches your travel preferences
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {VIBES.map((vibe) => (
                <motion.button
                  key={vibe.id}
                  onClick={() => setSelectedVibe(vibe.id as 'luxury' | 'budget' | 'balanced')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative overflow-hidden rounded-lg border-2 p-6 transition-all ${
                    selectedVibe === vibe.id
                      ? 'border-primary shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div
                    className={`mx-auto mb-3 h-20 w-20 rounded-lg ${vibe.color} shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]`}
                    style={{
                      transform: 'rotateX(45deg) rotateZ(45deg)',
                    }}
                  />
                  <p className="font-medium">{vibe.label}</p>
                </motion.button>
              ))}
            </div>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedVibe || isSubmitting}>
              {isSubmitting ? 'Completing...' : 'Complete Setup'}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

