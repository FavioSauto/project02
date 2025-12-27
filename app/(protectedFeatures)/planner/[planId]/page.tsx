import { getPlanWithDetails } from '@/features/vacation-planner/server/actions';
import { PlanDetailView } from '@/features/vacation-planner/components/plan-detail-view';
import { notFound } from 'next/navigation';

interface PlanPageProps {
  params: Promise<{ planId: string }>;
}

export default async function PlanPage({ params }: PlanPageProps) {
  const { planId } = await params;
  
  try {
    const plan = await getPlanWithDetails(parseInt(planId));
    
    if (!plan) {
      notFound();
    }

    return (
      <div className="container mx-auto py-8">
        <PlanDetailView initialPlan={plan} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}



