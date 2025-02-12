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
    const activeMembers = members.filter(member => member.status === 'pago');
    console.log('Membros ativos:', activeMembers.length);
    
    let totalRevenue = 0;
    
    const planPrices: { [key: string]: number } = {
      'Basic': 29.99,
      'Classic': 49.99,
      'Business': 99.99
    };
    
    activeMembers.forEach(member => {
      console.log('-------------------');
      console.log(`Membro: ${member.name}`);
      console.log(`Plano: ${member.plan}`);
      
      const planPrice = planPrices[member.plan];
      if (planPrice) {
        totalRevenue += planPrice;
        console.log(`Preço do plano ${member.plan}: ${planPrice}€`);
        console.log(`Subtotal após adicionar ${member.name}: ${totalRevenue}€`);
      } else {
        console.log(`Erro: Plano não encontrado para ${member.name}`);
      }
    });
    
    console.log('-------------------');
    console.log('Receita mensal total:', totalRevenue.toFixed(2), '€');
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