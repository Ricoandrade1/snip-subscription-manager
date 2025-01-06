import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SubscriberStats {
  totalSubscribers: number;
  activeSubscribers: number;
  overdueSubscribers: number;
  monthlyRevenue: number;
}

interface SubscribersStatsProps {
  stats: SubscriberStats;
  onFilterChange: (status: string) => void;
  selectedStatus: string;
}

export function SubscribersStats({ stats, onFilterChange, selectedStatus }: SubscribersStatsProps) {
  const [showTotal, setShowTotal] = useState(true);
  const [showActive, setShowActive] = useState(true);
  const [showOverdue, setShowOverdue] = useState(true);
  const [showRevenue, setShowRevenue] = useState(true);

  const handleCardClick = (status: string) => {
    if (status === selectedStatus) {
      onFilterChange('all');
    } else {
      onFilterChange(status);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card 
        className={`p-4 cursor-pointer transition-colors ${
          selectedStatus === 'total' ? 'bg-barber-gold/20 border-barber-gold' : ''
        }`}
        onClick={() => handleCardClick('total')}
      >
        <div className="flex items-center justify-between space-y-0">
          <p className="text-sm font-medium text-barber-light">Total de Assinantes</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setShowTotal(!showTotal);
            }}
          >
            {showTotal ? (
              <Eye className="h-4 w-4 text-barber-light" />
            ) : (
              <EyeOff className="h-4 w-4 text-barber-light" />
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-barber-gold" />
          <div className="flex items-baseline">
            {showTotal ? (
              <h3 className="text-2xl font-semibold text-barber-gold">
                {stats.totalSubscribers}
              </h3>
            ) : (
              <h3 className="text-2xl font-semibold text-barber-gold">****</h3>
            )}
          </div>
        </div>
      </Card>

      <Card 
        className={`p-4 cursor-pointer transition-colors ${
          selectedStatus === 'active' ? 'bg-green-500/20 border-green-500' : ''
        }`}
        onClick={() => handleCardClick('active')}
      >
        <div className="flex items-center justify-between space-y-0">
          <p className="text-sm font-medium text-barber-light">Assinantes Ativos</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setShowActive(!showActive);
            }}
          >
            {showActive ? (
              <Eye className="h-4 w-4 text-barber-light" />
            ) : (
              <EyeOff className="h-4 w-4 text-barber-light" />
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-green-500" />
          <div className="flex items-baseline">
            {showActive ? (
              <h3 className="text-2xl font-semibold text-green-500">
                {stats.activeSubscribers}
              </h3>
            ) : (
              <h3 className="text-2xl font-semibold text-green-500">****</h3>
            )}
          </div>
        </div>
      </Card>

      <Card 
        className={`p-4 cursor-pointer transition-colors ${
          selectedStatus === 'overdue' ? 'bg-red-500/20 border-red-500' : ''
        }`}
        onClick={() => handleCardClick('overdue')}
      >
        <div className="flex items-center justify-between space-y-0">
          <p className="text-sm font-medium text-barber-light">Assinantes Atrasados</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setShowOverdue(!showOverdue);
            }}
          >
            {showOverdue ? (
              <Eye className="h-4 w-4 text-barber-light" />
            ) : (
              <EyeOff className="h-4 w-4 text-barber-light" />
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-red-500" />
          <div className="flex items-baseline">
            {showOverdue ? (
              <h3 className="text-2xl font-semibold text-red-500">
                {stats.overdueSubscribers}
              </h3>
            ) : (
              <h3 className="text-2xl font-semibold text-red-500">****</h3>
            )}
          </div>
        </div>
      </Card>

      <Card 
        className={`p-4 cursor-pointer transition-colors ${
          selectedStatus === 'revenue' ? 'bg-blue-500/20 border-blue-500' : ''
        }`}
        onClick={() => handleCardClick('revenue')}
      >
        <div className="flex items-center justify-between space-y-0">
          <p className="text-sm font-medium text-barber-light">Receita Mensal</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setShowRevenue(!showRevenue);
            }}
          >
            {showRevenue ? (
              <Eye className="h-4 w-4 text-barber-light" />
            ) : (
              <EyeOff className="h-4 w-4 text-barber-light" />
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-blue-500" />
          <div className="flex items-baseline">
            {showRevenue ? (
              <h3 className="text-2xl font-semibold text-blue-500">
                R$ {stats.monthlyRevenue.toFixed(2)}
              </h3>
            ) : (
              <h3 className="text-2xl font-semibold text-blue-500">****</h3>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}