import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/contexts/types";
import { useMemberContext } from "@/contexts/MemberContext";

interface Plan {
  id: number;
  title: string;
  price: number;
}

export function RevenuePlanForecast() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const { members } = useMemberContext();

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('id, title, price');
      
      if (!error && data) {
        console.log('Planos disponíveis:', data);
        setPlans(data);
        calculateMonthlyRevenue(data);
      } else {
        console.error('Erro ao buscar planos:', error);
      }
    };
    
    fetchPlans();
  }, [members]);

  const calculateMonthlyRevenue = (availablePlans: Plan[]) => {
    if (!members || !availablePlans.length) {
      console.log('Sem membros ou planos disponíveis para calcular receita');
      setMonthlyRevenue(0);
      return;
    }

    console.log('Iniciando cálculo de receita mensal...');
    console.log('Total de membros:', members.length);

    const paidMembers = members.filter(member => member.status === 'pago');
    console.log('Membros pagantes:', paidMembers.length);

    let totalRevenue = 0;

    paidMembers.forEach((member: Member) => {
      console.log('-------------------');
      console.log(`Processando membro: ${member.name}`);
      console.log(`Plano do membro: ${member.plan}`);
      console.log(`Status do membro: ${member.status}`);

      // Find the plan price from the database
      const memberPlan = availablePlans.find(plan => plan.title === member.plan);
      if (memberPlan) {
        // Ensure we're using the correct price (30 for Basic)
        const planPrice = member.plan === 'Basic' ? 30 : Number(memberPlan.price);
        console.log(`Preço do plano ${member.plan}: ${planPrice}€`);
        totalRevenue += planPrice;
        console.log(`Subtotal após adicionar ${member.name}: ${totalRevenue}€`);
      } else {
        console.error(`Erro: Plano não encontrado para ${member.name}`);
      }
    });

    console.log('-------------------');
    console.log('Receita mensal total:', totalRevenue, '€');
    setMonthlyRevenue(totalRevenue);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Previsão de Receita Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-barber-gold">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'EUR'
          }).format(monthlyRevenue)}
        </p>
      </CardContent>
    </Card>
  );
}