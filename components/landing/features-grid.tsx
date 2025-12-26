import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  IconCalendarTime,
  IconSparkles,
  IconMapPin,
  IconCurrencyDollar,
  IconTimeline,
  IconDragDrop,
} from '@tabler/icons-react';

export function FeaturesGrid() {
  const features = [
    {
      icon: IconCalendarTime,
      title: 'Smart Scheduling',
      description: 'Optimize your days with intelligent time management and activity sequencing',
    },
    {
      icon: IconSparkles,
      title: 'Personalized Recommendations',
      description: 'Get suggestions tailored to your interests and travel vibe',
    },
    {
      icon: IconMapPin,
      title: 'Hidden Gems',
      description: 'Discover local favorites beyond the tourist traps',
    },
    {
      icon: IconCurrencyDollar,
      title: 'Budget Flexibility',
      description: 'Plan luxury getaways or budget adventures with equal ease',
    },
    {
      icon: IconTimeline,
      title: 'Day-by-Day Timeline',
      description: 'Visualize your entire trip at a glance with interactive timelines',
    },
    {
      icon: IconDragDrop,
      title: 'Drag & Drop Planning',
      description: 'Effortlessly rearrange activities to create your perfect itinerary',
    },
  ];

  return (
    <section id="features" className="container mx-auto py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Everything You Need to Plan the Perfect Trip
        </h2>
        <p className="max-w-[42rem] text-lg text-muted-foreground">
          Powerful features that make vacation planning effortless and enjoyable
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const colors = [
            'from-primary to-primary/70',
            'from-secondary to-secondary/70',
            'from-accent to-accent/70',
            'from-primary to-secondary',
            'from-secondary to-accent',
            'from-accent to-primary',
          ];
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className={`mb-2 w-12 h-12 rounded-lg bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center shadow-md`} aria-hidden="true">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

