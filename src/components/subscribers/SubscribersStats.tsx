import { StatCard } from "./StatCard";
import { Users, UserCheck, UserMinus, Clock, DollarSign } from "lucide-react";
import { SubscriberStats } from "./types/subscriber";

interface SubscribersStatsProps {
  stats: SubscriberStats;
  onFilterChange: (status: string) => void;
  selectedStatus: string;
}

export function SubscribersStats({ stats, onFilterChange, selectedStatus }: SubscribersStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total de Assinantes"
        value={stats.totalSubscribers}
        icon={<Users className="h-8 w-8 text-barber-light" />}
        description="Todos os assinantes"
        onClick={() => onFilterChange('total')}
        selected={selectedStatus === 'total'}
      />
      <StatCard
        title="Assinantes Ativos"
        value={stats.activeSubscribers}
        icon={<UserCheck className="h-8 w-8 text-barber-light" />}
        description="Pagamento em dia"
        onClick={() => onFilterChange('active')}
        selected={selectedStatus === 'active'}
      />
      <StatCard
        title="Assinantes Pendentes"
        value={stats.pendingSubscribers}
        icon={<Clock className="h-8 w-8 text-barber-light" />}
        description="Aguardando pagamento"
        onClick={() => onFilterChange('pending')}
        selected={selectedStatus === 'pending'}
      />
      <StatCard
        title="Assinantes Cancelados"
        value={stats.overdueSubscribers}
        icon={<UserMinus className="h-8 w-8 text-barber-light" />}
        description="Pagamento atrasado"
        onClick={() => onFilterChange('overdue')}
        selected={selectedStatus === 'overdue'}
      />
      <StatCard
        title="Receita Mensal"
        value={`${stats.monthlyRevenue.toFixed(2)}€`}
        icon={<DollarSign className="h-8 w-8 text-barber-light" />}
        description="Valor total mensal"
        onClick={() => onFilterChange('revenue')}
        selected={selectedStatus === 'revenue'}
      />
    </div>
  );
}