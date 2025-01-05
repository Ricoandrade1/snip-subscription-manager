import React from 'react';
import { PlanCard } from "@/components/PlanCard";

interface Plan {
  id: number;
  title: string;
  price: number;
  features: string[];
  totalSubscribers: number;
}

interface PlansGridProps {
  plans: Plan[];
}

const PlansGrid = ({ plans }: PlansGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          title={plan.title}
          price={plan.price}
          features={plan.features}
          subscribers={plan.totalSubscribers}
          onViewSubscribers={() => {}}
        />
      ))}
    </div>
  );
};

export default PlansGrid;