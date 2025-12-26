'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface Testimonial {
  name: string;
  location: string;
  initials: string;
  rating: number;
  quote: string;
}

export function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Mitchell',
      location: 'Seattle, WA',
      initials: 'SM',
      rating: 5,
      quote:
        'This app saved me hours of research. My Tokyo itinerary was perfectly balanced between famous spots and local gems. The drag-and-drop feature made customization a breeze!',
    },
    {
      name: 'David Chen',
      location: 'San Francisco, CA',
      initials: 'DC',
      rating: 5,
      quote:
        'As someone who loves planning but hates the stress, this is perfect. The AI suggested places I never would have found on my own. Our Paris trip was unforgettable.',
    },
    {
      name: 'Emily Rodriguez',
      location: 'Austin, TX',
      initials: 'ER',
      rating: 5,
      quote:
        'I planned our entire 2-week European adventure in under an hour. The time management features ensured we never felt rushed. Best vacation planning tool ever!',
    },
    {
      name: 'Michael Thompson',
      location: 'New York, NY',
      initials: 'MT',
      rating: 5,
      quote:
        'The personalization is incredible. It understood our love for food and architecture, and every recommendation was spot-on. Made our Rome trip magical.',
    },
    {
      name: 'Jessica Park',
      location: 'Los Angeles, CA',
      initials: 'JP',
      rating: 5,
      quote:
        'Finally, a vacation planner that gets it. The balance between structure and flexibility is perfect. We discovered hidden gems in Barcelona we never would have found.',
    },
    {
      name: 'Ryan Williams',
      location: 'Chicago, IL',
      initials: 'RW',
      rating: 5,
      quote:
        'The budget-conscious options saved us money without sacrificing experience. Our Thailand trip was both affordable and amazing. Highly recommend!',
    },
  ];

  return (
    <section id="testimonials" className="container mx-auto py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Loved by Travelers Worldwide
        </h2>
        <p className="max-w-[42rem] text-lg text-muted-foreground">
          Join thousands of happy travelers who have discovered stress-free vacation planning
        </p>
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full max-w-5xl mx-auto"
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full">
                <CardContent className="flex flex-col p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-500">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{testimonial.quote}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}

