import { useState } from "react";
import { useMemberContext } from "@/contexts/MemberContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardActions from "@/components/dashboard/DashboardActions";
import PlansGrid from "@/components/dashboard/PlansGrid";

const Index = () => {
  const { getMembersByPlan } = useMemberContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showRevenue, setShowRevenue] = useState(true);
  const [showSubscribers, setShowSubscribers] = useState(true);

  const basicCount = getMembersByPlan("Basic");
  const classicCount = getMembersByPlan("Classic");
  const businessCount = getMembersByPlan("Business");

  const PLANS = [
    {
      id: 1,
      title: "Basic",
      price: 30,
      features: ["Somente barba", "1 vez por semana", "Agendamento prioritário"],
      totalSubscribers: basicCount,
    },
    {
      id: 2,
      title: "Classic",
      price: 40,
      features: ["Somente cabelo", "1 vez por semana", "Agendamento prioritário"],
      totalSubscribers: classicCount,
    },
    {
      id: 3,
      title: "Business",
      price: 50,
      features: [
        "Cabelo e barba",
        "1 vez por semana",
        "Agendamento VIP",
        "Produtos exclusivos",
      ],
      totalSubscribers: businessCount,
    },
  ];

  const totalSubscribers = basicCount + classicCount + businessCount;
  const monthlyRevenue = PLANS.reduce((acc, plan) => {
    return acc + plan.price * plan.totalSubscribers;
  }, 0);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <DashboardHeader />
        
        <DashboardStats
          totalSubscribers={totalSubscribers}
          monthlyRevenue={monthlyRevenue}
          showSubscribers={showSubscribers}
          showRevenue={showRevenue}
          onToggleSubscribers={() => setShowSubscribers(!showSubscribers)}
          onToggleRevenue={() => setShowRevenue(!showRevenue)}
        />

        <DashboardActions
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />

        <PlansGrid plans={PLANS} />
      </div>
    </div>
  );
};

export default Index;