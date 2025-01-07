import { useState, useEffect } from "react";
import { Subscriber, SubscriberStats } from "../types/subscriber";
import { supabase } from "@/integrations/supabase/client";

export function useSubscriberStats(subscribers: Subscriber[]) {
  const [stats, setStats] = useState<SubscriberStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    overdueSubscribers: 0,
    pendingSubscribers: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    const calculateStats = async () => {
      // Buscar preços dos planos do banco de dados
      const { data: plans, error } = await supabase
        .from('plans')
        .select('title, price');

      if (error) {
        console.error('Erro ao buscar preços dos planos:', error);
        return;
      }

      const planPrices = plans.reduce((acc: Record<string, number>, plan) => {
        // Arredonda os preços para números inteiros
        acc[plan.title] = Math.round(Number(plan.price));
        return acc;
      }, {});

      console.log('=== INÍCIO DO CÁLCULO DE RECEITA ===');
      console.log('Preços dos planos no banco:', plans);
      console.log('Preços convertidos para cálculo:', planPrices);
      console.log('Número total de assinantes:', subscribers.length);
      
      let totalRevenue = 0;
      const activeMembers = subscribers.filter(member => member.status === 'pago');
      console.log('Membros ativos:', activeMembers.length);
      
      activeMembers.forEach(member => {
        console.log('-------------------');
        console.log(`Membro: ${member.name}`);
        console.log(`Status: ${member.status}`);
        console.log(`Plano: ${member.plan}`);
        
        const planPrice = planPrices[member.plan];
        if (planPrice) {
          // Arredonda o valor antes de adicionar à receita total
          const roundedPrice = Math.round(planPrice);
          totalRevenue += roundedPrice;
          console.log(`Preço do plano ${member.plan}: ${roundedPrice}€`);
          console.log(`Subtotal após adicionar ${member.name}: ${totalRevenue}€`);
        } else {
          console.log(`Erro: Plano não encontrado para ${member.name}`);
        }
      });
      
      console.log('-------------------');
      console.log('Receita mensal total:', totalRevenue, '€');

      const calculatedStats = {
        totalSubscribers: subscribers.length,
        activeSubscribers: activeMembers.length,
        overdueSubscribers: subscribers.filter(s => s.status === 'cancelado').length,
        pendingSubscribers: subscribers.filter(s => s.status === 'pendente').length,
        monthlyRevenue: totalRevenue,
      };

      setStats(calculatedStats);
    };

    calculateStats();
  }, [subscribers]);

  return stats;
}