import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, AlertCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface SubscribersStatsProps {
  stats: {
    totalSubscribers: number;
    activeSubscribers: number;
    overdueSubscribers: number;
    monthlyRevenue: number;
  };
}

export function SubscribersStats({ stats }: SubscribersStatsProps) {
  const [showStats, setShowStats] = useState({
    total: true,
    active: true,
    overdue: true,
    revenue: true
  });

  const toggleStat = (stat: keyof typeof showStats) => {
    setShowStats(prev => ({ ...prev, [stat]: !prev[stat] }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 bg-barber-gray border-barber-gold/20 hover:border-barber-gold/40 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-barber-gold/10 rounded-lg">
              <Users className="w-6 h-6 text-barber-gold" />
            </div>
            <div>
              <p className="text-sm font-medium text-barber-light/60">Total de Assinantes</p>
              {showStats.total ? (
                <h3 className="text-2xl font-bold text-barber-light">{stats.totalSubscribers}</h3>
              ) : (
                <h3 className="text-2xl font-bold text-barber-light">****</h3>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleStat('total')}
            className="text-barber-gold hover:text-barber-gold/80 hover:bg-barber-gold/10"
          >
            {showStats.total ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-barber-gray border-green-500/20 hover:border-green-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-barber-light/60">Assinantes Ativos</p>
              {showStats.active ? (
                <h3 className="text-2xl font-bold text-barber-light">{stats.activeSubscribers}</h3>
              ) : (
                <h3 className="text-2xl font-bold text-barber-light">****</h3>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleStat('active')}
            className="text-green-500 hover:text-green-500/80 hover:bg-green-500/10"
          >
            {showStats.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-barber-gray border-red-500/20 hover:border-red-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-barber-light/60">Assinantes Atrasados</p>
              {showStats.overdue ? (
                <h3 className="text-2xl font-bold text-barber-light">{stats.overdueSubscribers}</h3>
              ) : (
                <h3 className="text-2xl font-bold text-barber-light">****</h3>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleStat('overdue')}
            className="text-red-500 hover:text-red-500/80 hover:bg-red-500/10"
          >
            {showStats.overdue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-barber-gray border-barber-gold/20 hover:border-barber-gold/40 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-barber-gold/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-barber-gold" />
            </div>
            <div>
              <p className="text-sm font-medium text-barber-light/60">Receita Mensal</p>
              {showStats.revenue ? (
                <h3 className="text-2xl font-bold text-barber-light">
                  R$ {stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
              ) : (
                <h3 className="text-2xl font-bold text-barber-light">R$ ****</h3>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleStat('revenue')}
            className="text-barber-gold hover:text-barber-gold/80 hover:bg-barber-gold/10"
          >
            {showStats.revenue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </Card>
    </div>
  );
}