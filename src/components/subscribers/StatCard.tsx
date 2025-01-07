import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  description: string;
  onClick: () => void;
  selected: boolean;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  onClick,
  selected,
}: StatCardProps) {
  return (
    <Card 
      className={`p-4 cursor-pointer transition-colors ${
        selected ? 'bg-barber-gold/10 border-barber-gold' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between space-y-0">
        <p className="text-sm font-medium text-barber-light">{title}</p>
      </div>
      <div className="flex items-center gap-2">
        {icon || <Users className="h-8 w-8 text-barber-gold" />}
        <div className="flex flex-col">
          <h3 className="text-2xl font-semibold text-barber-gold">
            {value}
          </h3>
          <p className="text-xs text-barber-light/60">{description}</p>
        </div>
      </div>
    </Card>
  );
}