import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Wallet } from "lucide-react";

interface StatsData {
  totalSubscribers: number;
  activeSubscribers: number;
  overdueSubscribers: number;
  monthlyRevenue: number;
}

interface SubscribersStatsProps {
  stats: StatsData;
}

export function SubscribersStats({ stats }: SubscribersStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-barber-gray border-barber-gold/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-barber-light">
            Total de Assinantes
          </CardTitle>
          <Users className="h-4 w-4 text-barber-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-barber-gold">{stats.totalSubscribers}</div>
        </CardContent>
      </Card>

      <Card className="bg-barber-gray border-barber-gold/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-barber-light">
            Assinantes Ativos
          </CardTitle>
          <UserCheck className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{stats.activeSubscribers}</div>
        </CardContent>
      </Card>

      <Card className="bg-barber-gray border-barber-gold/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-barber-light">
            Pagamentos Atrasados
          </CardTitle>
          <UserX className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{stats.overdueSubscribers}</div>
        </CardContent>
      </Card>

      <Card className="bg-barber-gray border-barber-gold/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-barber-light">
            Receita Mensal
          </CardTitle>
          <Wallet className="h-4 w-4 text-barber-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-barber-gold">
            R$ {stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}