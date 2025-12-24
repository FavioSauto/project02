import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Color Palette Reference Component
 * Visual showcase of the IdeaValidation.AI color system
 * Can be temporarily added to any page to preview colors
 */
export function ColorPaletteReference() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">IdeaValidation.AI Color Palette</h1>
        <p className="text-muted-foreground">
          A comprehensive color system designed for trust, intelligence, and opportunity
        </p>
      </div>

      {/* Primary Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Colors - Deep Indigo</CardTitle>
          <CardDescription>Trust, Intelligence, Analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-24 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">Primary</span>
              </div>
              <p className="text-sm text-muted-foreground">Main brand color, CTAs, important actions</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-primary-foreground border-2 rounded-lg flex items-center justify-center">
                <span className="text-primary font-semibold">Primary Foreground</span>
              </div>
              <p className="text-sm text-muted-foreground">Text on primary backgrounds</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button>Primary Button</Button>
            <Button variant="outline">Outlined</Button>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Secondary Colors - Vibrant Teal</CardTitle>
          <CardDescription>Innovation, Clarity, Modern Tech</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-24 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-secondary-foreground font-semibold">Secondary</span>
              </div>
              <p className="text-sm text-muted-foreground">Secondary actions, accents</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-secondary-foreground border-2 rounded-lg flex items-center justify-center">
                <span className="text-secondary font-semibold">Secondary Foreground</span>
              </div>
              <p className="text-sm text-muted-foreground">Text on secondary backgrounds</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Secondary Button</Button>
            <Badge className="bg-secondary text-secondary-foreground">Secondary Badge</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Success Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Success Colors - Emerald Green</CardTitle>
          <CardDescription>Monetization Signals, Opportunity, Validated Insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-24 bg-success rounded-lg flex items-center justify-center">
                <span className="text-success-foreground font-semibold">Success</span>
              </div>
              <p className="text-sm text-muted-foreground">Validated insights, monetization signals, opportunities</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-success-foreground border-2 rounded-lg flex items-center justify-center">
                <span className="text-success font-semibold">Success Foreground</span>
              </div>
              <p className="text-sm text-muted-foreground">Text on success backgrounds</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-success hover:bg-success/90 text-success-foreground">Success Action</Button>
            <Badge className="bg-success text-success-foreground">Validated</Badge>
            <Badge className="bg-success text-success-foreground">High Potential</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Warning Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Warning Colors - Amber</CardTitle>
          <CardDescription>Signals, Highlights, Attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-24 bg-warning rounded-lg flex items-center justify-center">
                <span className="text-warning-foreground font-semibold">Warning</span>
              </div>
              <p className="text-sm text-muted-foreground">Important signals, warnings, caution</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-warning-foreground border-2 rounded-lg flex items-center justify-center">
                <span className="text-warning font-semibold">Warning Foreground</span>
              </div>
              <p className="text-sm text-muted-foreground">Text on warning backgrounds</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-warning hover:bg-warning/90 text-warning-foreground">Warning Action</Button>
            <Badge className="bg-warning text-warning-foreground">Needs Attention</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Info Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Info Colors - Bright Cyan</CardTitle>
          <CardDescription>Insights, Data, Information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-24 bg-info rounded-lg flex items-center justify-center">
                <span className="text-info-foreground font-semibold">Info</span>
              </div>
              <p className="text-sm text-muted-foreground">Informational content, insights, data</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-info-foreground border-2 rounded-lg flex items-center justify-center">
                <span className="text-info font-semibold">Info Foreground</span>
              </div>
              <p className="text-sm text-muted-foreground">Text on info backgrounds</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-info hover:bg-info/90 text-info-foreground">Info Action</Button>
            <Badge className="bg-info text-info-foreground">New Insight</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Destructive Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Destructive Colors - Red</CardTitle>
          <CardDescription>Errors, Danger, Critical Actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-24 bg-destructive rounded-lg flex items-center justify-center">
                <span className="text-destructive-foreground font-semibold">Destructive</span>
              </div>
              <p className="text-sm text-muted-foreground">Errors, danger, destructive actions</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-destructive-foreground border-2 rounded-lg flex items-center justify-center">
                <span className="text-destructive font-semibold">Destructive Foreground</span>
              </div>
              <p className="text-sm text-muted-foreground">Text on destructive backgrounds</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="destructive">Delete</Button>
            <Badge className="bg-destructive text-destructive-foreground">Error</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Neutral Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Neutral Colors</CardTitle>
          <CardDescription>Backgrounds, Text, Subtle Elements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-24 bg-muted rounded-lg flex items-center justify-center border">
                <span className="text-muted-foreground font-semibold">Muted</span>
              </div>
              <p className="text-sm text-muted-foreground">Subtle backgrounds</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-semibold">Accent</span>
              </div>
              <p className="text-sm text-muted-foreground">Hover states</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-card rounded-lg flex items-center justify-center border">
                <span className="text-card-foreground font-semibold">Card</span>
              </div>
              <p className="text-sm text-muted-foreground">Card surfaces</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Colors</CardTitle>
          <CardDescription>Data Visualization Palette</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="space-y-2">
                <div
                  className="h-24 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `hsl(var(--chart-${num}))` }}
                >
                  <span className="text-white font-semibold">Chart {num}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Real-World Usage Examples</CardTitle>
          <CardDescription>How colors work together in the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Example 1: Monetization Signal */}
          <div className="border-l-4 border-success bg-success/5 p-4 rounded-r-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold mb-1">Monetization Signal Detected</h4>
                <p className="text-sm text-muted-foreground">
                  &ldquo;I&apos;m currently paying $200/month for a solution that barely works...&rdquo;
                </p>
              </div>
              <Badge className="bg-success text-success-foreground">High Value</Badge>
            </div>
          </div>

          {/* Example 2: Warning Signal */}
          <div className="border-l-4 border-warning bg-warning/5 p-4 rounded-r-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold mb-1">Attention Required</h4>
                <p className="text-sm text-muted-foreground">
                  Analysis confidence is below threshold. Consider refining your search.
                </p>
              </div>
              <Badge className="bg-warning text-warning-foreground">Review</Badge>
            </div>
          </div>

          {/* Example 3: Info Signal */}
          <div className="border-l-4 border-info bg-info/5 p-4 rounded-r-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold mb-1">Insight</h4>
                <p className="text-sm text-muted-foreground">
                  Found 47 related discussions across 12 subreddits in the past 90 days.
                </p>
              </div>
              <Badge className="bg-info text-info-foreground">Data Point</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
