import { useState, useEffect } from "react";
import { useMemberContext } from "@/contexts/MemberContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardActions from "@/components/dashboard/DashboardActions";
import PlansGrid from "@/components/dashboard/PlansGrid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const { getMembersByPlan } = useMemberContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showRevenue, setShowRevenue] = useState(true);
  const [showSubscribers, setShowSubscribers] = useState(true);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel('plans-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'plans'
        },
        (payload) => {
          console.log('Plans change received:', payload);
          fetchPlans();
        }
      )
      .subscribe();

    fetchPlans();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('id');

    if (error) {
      toast.error('Erro ao carregar planos');
      return;
    }

    const plansWithSubscribers = data.map(plan => ({
      id: plan.id,
      title: plan.title,
      price: plan.price,
      features: plan.features || [],
      totalSubscribers: getMembersByPlan(plan.title as "Basic" | "Classic" | "Business")
    }));

    setPlans(plansWithSubscribers);
  };

  const basicCount = getMembersByPlan("Basic");
  const classicCount = getMembersByPlan("Classic");
  const businessCount = getMembersByPlan("Business");

  const totalSubscribers = basicCount + classicCount + businessCount;
  const monthlyRevenue = plans.reduce((acc, plan) => {
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

        <PlansGrid plans={plans} />
      </div>
    </div>
  );
};

export default Index;
