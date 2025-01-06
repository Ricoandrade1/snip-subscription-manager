import React from 'react';
import { Users, BarChart3, CreditCard } from "lucide-react";
import StatCard from './StatCard';

interface DashboardStatsProps {
  totalSubscribers: number;
  monthlyRevenue: number;
  showSubscribers: boolean;
  showRevenue: boolean;
  onToggleSubscribers: () => void;
  onToggleRevenue: () => void;
}

const DashboardStats = ({
  totalSubscribers,
  monthlyRevenue,
  showSubscribers,
  showRevenue,
  onToggleSubscribers,
  onToggleRevenue,
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <StatCard
        icon={<Users className="h-6 w-6 text-barber-gold" />}
        label="Total de Assinantes"
        value={totalSubscribers}
        isVisible={showSubscribers}
        onToggleVisibility={onToggleSubscribers}
      />
      <StatCard
        icon={<CreditCard className="h-6 w-6 text-barber-gold" />}
        label="Receita Mensal de Assinaturas"
        value={monthlyRevenue}
        isVisible={showRevenue}
        onToggleVisibility={onToggleRevenue}
        suffix="€"
      />
    </div>
  );
};

export default DashboardStats;