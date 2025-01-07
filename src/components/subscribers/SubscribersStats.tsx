import { useState } from "react";
import { StatCard } from "./StatCard";
import { SubscriberStats } from "./types";

interface SubscribersStatsProps {
  stats: SubscriberStats;
  onFilterChange: (status: string) => void;
  selectedStatus: string;
}

const COLOR_SCHEMES = {
  total: {
    background: "bg-barber-gold/20",
    border: "border-barber-gold",
    text: "text-barber-gold",
  },
  active: {
    background: "bg-green-500/20",
    border: "border-green-500",
    text: "text-green-500",
  },
  pending: {
    background: "bg-pink-500/20",
    border: "border-pink-500",
    text: "text-pink-500",
  },
  overdue: {
    background: "bg-red-500/20",
    border: "border-red-500",
    text: "text-red-500",
  },
  revenue: {
    background: "bg-blue-500/20",
    border: "border-blue-500",
    text: "text-blue-500",
  },
};

export function SubscribersStats({ stats, onFilterChange, selectedStatus }: SubscribersStatsProps) {
  const [showTotal, setShowTotal] = useState(true);
  const [showActive, setShowActive] = useState(true);
  const [showOverdue, setShowOverdue] = useState(true);
  const [showPending, setShowPending] = useState(true);
  const [showRevenue, setShowRevenue] = useState(true);

  const handleCardClick = (status: string) => {
    if (status === selectedStatus) {
      onFilterChange('all');
    } else {
      onFilterChange(status);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatCard
        label="Total de Assinantes"
        value={stats.totalSubscribers}
        show={showTotal}
        onToggleVisibility={() => setShowTotal(!showTotal)}
        onClick={() => handleCardClick('total')}
        isSelected={selectedStatus === 'total'}
        colorScheme={COLOR_SCHEMES.total}
      />

      <StatCard
        label="Assinantes Ativos"
        value={stats.activeSubscribers}
        show={showActive}
        onToggleVisibility={() => setShowActive(!showActive)}
        onClick={() => handleCardClick('active')}
        isSelected={selectedStatus === 'active'}
        colorScheme={COLOR_SCHEMES.active}
      />

      <StatCard
        label="Assinantes Pendentes"
        value={stats.pendingSubscribers}
        show={showPending}
        onToggleVisibility={() => setShowPending(!showPending)}
        onClick={() => handleCardClick('pending')}
        isSelected={selectedStatus === 'pending'}
        colorScheme={COLOR_SCHEMES.pending}
      />

      <StatCard
        label="Assinantes Cancelados"
        value={stats.overdueSubscribers}
        show={showOverdue}
        onToggleVisibility={() => setShowOverdue(!showOverdue)}
        onClick={() => handleCardClick('overdue')}
        isSelected={selectedStatus === 'overdue'}
        colorScheme={COLOR_SCHEMES.overdue}
      />

      <StatCard
        label="Receita Mensal"
        value={stats.monthlyRevenue}
        show={showRevenue}
        onToggleVisibility={() => setShowRevenue(!showRevenue)}
        onClick={() => handleCardClick('revenue')}
        isSelected={selectedStatus === 'revenue'}
        colorScheme={COLOR_SCHEMES.revenue}
        isCurrency={true}
      />
    </div>
  );
}