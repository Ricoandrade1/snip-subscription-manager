import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BarberProduction {
  barber_name: string;
  total_services: number;
  total_revenue: number;
}

export function BarberProductionReport() {
  const [period, setPeriod] = useState("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const { data: barberStats, isLoading } = useQuery({
    queryKey: ["barber-production", period],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No authenticated session");
      }

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

  const filteredBarberStats = barberStats?.filter((barber) =>
    barber.barber_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="bg-barber-black border-barber-gold/20 max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-barber-gold">
            Produção por Barbeiro
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search" className="text-barber-gold">Buscar Barbeiro</Label>
              <Input
                id="search"
                placeholder="Digite o nome do barbeiro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-barber-gold/20 bg-barber-black text-barber-light"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period" className="text-barber-gold">Período</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger id="period" className="w-[180px] border-barber-gold/20 bg-barber-black text-barber-light">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent className="bg-barber-black border-barber-gold/20">
                  <SelectItem value="week" className="text-barber-light hover:bg-barber-gold/20">Última Semana</SelectItem>
                  <SelectItem value="month" className="text-barber-light hover:bg-barber-gold/20">Último Mês</SelectItem>
                  <SelectItem value="year" className="text-barber-light hover:bg-barber-gold/20">Último Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <BarChart
              width={800}
              height={400}
              data={filteredBarberStats}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}