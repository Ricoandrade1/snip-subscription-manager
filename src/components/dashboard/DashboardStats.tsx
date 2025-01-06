import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardStats } from "@/hooks/useDashboardStats";

interface DashboardStatsProps {
  showSubscribers: boolean;
  showRevenue: boolean;
  onToggleSubscribers: () => void;
  onToggleRevenue: () => void;
}

export default function DashboardStats({
  showSubscribers,
  showRevenue,
  onToggleSubscribers,
  onToggleRevenue,
}: DashboardStatsProps) {
  const stats = useDashboardStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-6 bg-barber-gray border-barber-gold/20">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-barber-light">Total de Assinantes</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSubscribers}
            className="text-barber-gold hover:text-barber-gold/80"
          >
            {showSubscribers ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-2xl font-bold text-barber-gold mt-2">
          {showSubscribers ? stats.totalSubscribers : "***"}
        </p>
      </Card>

      <Card className="p-6 bg-barber-gray border-barber-gold/20">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-barber-light">Assinantes Ativos</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSubscribers}
            className="text-barber-gold hover:text-barber-gold/80"
          >
            {showSubscribers ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-2xl font-bold text-barber-gold mt-2">
          {showSubscribers ? stats.activeSubscribers : "***"}
        </p>
      </Card>

      <Card className="p-6 bg-barber-gray border-barber-gold/20">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-barber-light">Receita Mensal</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleRevenue}
            className="text-barber-gold hover:text-barber-gold/80"
          >
            {showRevenue ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-2xl font-bold text-barber-gold mt-2">
          {showRevenue ? `${stats.monthlyRevenue}€` : "***"}
        </p>
      </Card>
    </div>
  );
}