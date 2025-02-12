import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Users, EuroIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatCardProps {
  label: string;
  value: number;
  show: boolean;
  onToggleVisibility: () => void;
  onClick: () => void;
  isSelected: boolean;
  colorScheme: {
    background: string;
    border: string;
    text: string;
  };
  isCurrency?: boolean;
}

export function StatCard({
  label,
  value,
  show,
  onToggleVisibility,
  onClick,
  isSelected,
  colorScheme,
  isCurrency = false,
}: StatCardProps) {
  const formatValue = (value: number) => {
    if (isCurrency) {
      return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
    }
    return value;
  };

  return (
    <Card 
      className={`p-4 cursor-pointer transition-colors ${
        isSelected ? `${colorScheme.background} ${colorScheme.border}` : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between space-y-0">
        <p className="text-sm font-medium text-barber-light">{label}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
        >
          {show ? (
            <Eye className="h-4 w-4 text-barber-light" />
          ) : (
            <EyeOff className="h-4 w-4 text-barber-light" />
          )}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {isCurrency ? (
          <EuroIcon className={`h-8 w-8 ${colorScheme.text}`} />
        ) : (
          <Users className={`h-8 w-8 ${colorScheme.text}`} />
        )}
        <div className="flex items-baseline">
          {show ? (
            <h3 className={`text-2xl font-semibold ${colorScheme.text}`}>
              {formatValue(value)}
            </h3>
          ) : (
            <h3 className={`text-2xl font-semibold ${colorScheme.text}`}>****</h3>
          )}
        </div>
      </div>
    </Card>
  );
}