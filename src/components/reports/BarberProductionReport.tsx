import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface BarberProduction {
  barber_name: string;
  total_services: number;
  total_revenue: number;
}

export function BarberProductionReport() {
  const [period, setPeriod] = useState("month");

  const { data: barberStats, isLoading } = useQuery({
    queryKey: ["barber-production", period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select(`
          sellers,
          total,
          created_at
        `)
        .gte('created_at', getPeriodDate(period))
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Erro ao carregar dados de produção");
        throw error;
      }

      const barberProduction: Record<string, BarberProduction> = {};

      data?.forEach((sale) => {
        const sellers = sale.sellers as { id: string; name: string; commission: number }[];
        sellers?.forEach((seller) => {
          if (!barberProduction[seller.name]) {
            barberProduction[seller.name] = {
              barber_name: seller.name,
              total_services: 0,
              total_revenue: 0,
            };
          }
          barberProduction[seller.name].total_services += 1;
          barberProduction[seller.name].total_revenue += sale.total * (seller.commission / 100);
        });
      });

      return Object.values(barberProduction);
    },
  });

  const getPeriodDate = (selectedPeriod: string) => {
    const date = new Date();
    switch (selectedPeriod) {
      case "week":
        date.setDate(date.getDate() - 7);
        break;
      case "month":
        date.setMonth(date.getMonth() - 1);
        break;
      case "year":
        date.setFullYear(date.getFullYear() - 1);
        break;
      default:
        date.setMonth(date.getMonth() - 1);
    }
    return date.toISOString();
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-barber-gold">
          Produção por Barbeiro
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <BarChart
            width={800}
            height={400}
            data={barberStats}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="barber_name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="total_services"
              name="Total de Serviços"
              fill="#FFB000"
            />
            <Bar
              yAxisId="right"
              dataKey="total_revenue"
              name="Receita Total (R$)"
              fill="#22C55E"
            />
          </BarChart>
        </div>
      </CardContent>
    </Card>
  );
}