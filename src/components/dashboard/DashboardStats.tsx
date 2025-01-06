import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardStatsProps {
  totalSubscribers: number;
  monthlyRevenue: number;
  showSubscribers: boolean;
  showRevenue: boolean;
  onToggleSubscribers: () => void;
  onToggleRevenue: () => void;
}

export default function DashboardStats({
  totalSubscribers,
  monthlyRevenue,
  showSubscribers,
  showRevenue,
  onToggleSubscribers,
  onToggleRevenue,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-barber-gray border-barber-gold/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-barber-light">Total de Assinantes</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSubscribers}
              className="hover:bg-barber-gold/10"
            >
              {showSubscribers ? (
                <EyeOff className="h-4 w-4 text-barber-gold" />
              ) : (
                <Eye className="h-4 w-4 text-barber-gold" />
              )}
            </Button>
          </div>
          <p className="mt-4 text-3xl font-bold text-barber-gold">
            {showSubscribers ? totalSubscribers : "****"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-barber-gray border-barber-gold/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-barber-light">Receita Mensal</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleRevenue}
              className="hover:bg-barber-gold/10"
            >
              {showRevenue ? (
                <EyeOff className="h-4 w-4 text-barber-gold" />
              ) : (
                <Eye className="h-4 w-4 text-barber-gold" />
              )}
            </Button>
          </div>
          <p className="mt-4 text-3xl font-bold text-barber-gold">
            {showRevenue
              ? new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(monthlyRevenue)
              : "R$ ****"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}