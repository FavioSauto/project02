export function TrustIndicators() {
  return (
    <section className="border-y bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" aria-label="Trust indicators and statistics">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-around gap-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-3xl font-bold" aria-label="Over 10,000 vacations planned">10,000+</p>
            <p className="text-sm text-muted-foreground">Vacations Planned</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <p className="text-3xl font-bold" aria-label="4.9 star average rating">4.9★</p>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <p className="text-3xl font-bold" aria-label="95 percent would recommend">95%</p>
            <p className="text-sm text-muted-foreground">Would Recommend</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm font-medium">As Seen On</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>TechCrunch</span>
              <span>Forbes</span>
              <span>Travel + Leisure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

