import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Member, Payment } from "@/contexts/types";
import { addDays, addMonths, addYears } from "date-fns";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RevenuePlanForecastProps {
  members: Member[];
  payments: Payment[];
}

interface Plan {
  id: number;
  title: string;
  price: number;
}

export function RevenuePlanForecast({ members, payments }: RevenuePlanForecastProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  
  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('id, title, price');
      
      if (!error && data) {
        console.log('Planos disponíveis:', data);
        setPlans(data);
      }
    };
    
    fetchPlans();
  }, []);

  const generatePDF = () => {
    // TODO: Implement PDF generation
    console.log("Generating PDF...");
  };

  const calculateProbability = (timeframe: string) => {
    const paidMembers = members.filter(m => {
      const memberPayments = payments.filter(p => p.member_id === m.id && p.status === 'paid');
      return memberPayments.length > 0;
    });

    const probability = (paidMembers.length / members.length) * 100;
    return probability.toFixed(2);
  };

  const calculateMonthlyRevenue = () => {
    // Filtra apenas membros com status 'pago'
    const activeMembers = members.filter(member => member.status === 'pago');
    console.log('Membros ativos:', activeMembers);
    
    let totalRevenue = 0;
    
    activeMembers.forEach(member => {
      // Encontra o plano do membro usando plan_id
      const memberPlan = plans.find(p => p.id === member.plan_id);
      
      if (memberPlan) {
        console.log('-------------------');
        console.log(`Membro: ${member.name}`);
        console.log(`Plano ID: ${member.plan_id}`);
        console.log(`Plano encontrado: ${memberPlan.title}`);
        console.log(`Preço do plano: ${memberPlan.price}`);
        
        // Converte o preço para número e adiciona ao total
        const planPrice = Number(memberPlan.price);
        if (!isNaN(planPrice)) {
          totalRevenue += planPrice;
          console.log(`Subtotal após adicionar ${member.name}: ${totalRevenue}`);
        } else {
          console.log(`Erro: Preço inválido para o plano ${memberPlan.title}`);
        }
      } else {
        console.log(`Nenhum plano encontrado para o membro ${member.name} (ID do plano: ${member.plan_id})`);
      }
    });
    
    console.log('-------------------');
    console.log('Receita mensal total:', totalRevenue);
    return totalRevenue;
  };

  const forecasts = [
    { period: "7 dias", date: addDays(new Date(), 7) },
    { period: "15 dias", date: addDays(new Date(), 15) },
    { period: "30 dias", date: addDays(new Date(), 30) },
    { period: "6 meses", date: addMonths(new Date(), 6) },
    { period: "1 ano", date: addYears(new Date(), 1) },
    { period: "5 anos", date: addYears(new Date(), 5) },
    { period: "10 anos", date: addYears(new Date(), 10) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-barber-gold">Previsão por Plano</h2>
        <Button onClick={generatePDF} variant="outline" className="border-barber-gold/20 hover:border-barber-gold text-barber-gold">
          <FileDown className="mr-2 h-4 w-4" />
          Gerar Relatório
        </Button>
      </div>

      <Card className="bg-barber-black border-barber-gray">
        <CardHeader>
          <CardTitle className="text-barber-gold">Receita Mensal Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-barber-gold">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'EUR'
            }).format(calculateMonthlyRevenue())}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forecasts.map((forecast) => (
          <Card key={forecast.period} className="bg-barber-black border-barber-gray">
            <CardHeader>
              <CardTitle className="text-barber-gold">{forecast.period}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-barber-gold">
                {calculateProbability(forecast.period)}%
              </p>
              <p className="text-sm text-barber-light/60">
                Probabilidade de renovação
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}