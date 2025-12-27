import { CreatePlanForm } from '@/features/vacation-planner/components/create-plan-form';

export default function NewPlanPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Vacation Plan</h1>
        <p className="text-muted-foreground">
          Plan your perfect vacation with our intelligent scheduling system
        </p>
      </div>

      <CreatePlanForm />
    </div>
  );
}



