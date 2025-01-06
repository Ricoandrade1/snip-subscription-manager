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

  return (
    <div className="min-h-screen bg-gradient-to-b from-barber-black to-barber-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-barber-gold/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-barber-black px-6 text-barber-gold text-sm">Dashboard</span>
          </div>
        </div>

        <DashboardHeader />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-barber-gold/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-barber-black px-6 text-barber-gold text-sm">Estatísticas</span>
          </div>
        </div>

        <DashboardStats
          showSubscribers={showSubscribers}
          showRevenue={showRevenue}
          onToggleSubscribers={() => setShowSubscribers(!showSubscribers)}
          onToggleRevenue={() => setShowRevenue(!showRevenue)}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-barber-gold/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-barber-black px-6 text-barber-gold text-sm">Ações</span>
          </div>
        </div>

        <DashboardActions
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-barber-gold/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-barber-black px-6 text-barber-gold text-sm">Planos</span>
          </div>
        </div>

        <PlansGrid plans={plans} />
      </div>
    </div>
  );
};

export default Index;