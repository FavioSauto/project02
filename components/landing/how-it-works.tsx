import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Tell Us About You',
      description: 'Share your interests, travel style, and destination preferences',
      details: 'Quick onboarding takes less than 2 minutes. Tell us what you love and what kind of traveler you are.',
    },
    {
      number: '02',
      title: 'Get Your Smart Itinerary',
      description: 'Receive a personalized day-by-day plan optimized for your schedule',
      details: 'Our AI creates a balanced itinerary with activities, travel time, and breaks perfectly timed.',
    },
    {
      number: '03',
      title: 'Customize & Go',
      description: 'Tweak activities, add favorites, and start your adventure',
      details: 'Drag and drop to rearrange, add your own discoveries, or let us handle everything.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">How It Works</h2>
        <p className="max-w-[42rem] text-lg text-muted-foreground">
          From idea to itinerary in three simple steps
        </p>
      </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  {step.number}
                </div>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.details}</p>
                </CardContent>
              </Card>
            </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-secondary" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

