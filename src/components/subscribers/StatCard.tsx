import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
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
  const [show, setShow] = useState(true);

  const colorScheme = {
    background: selected ? 'bg-barber-gold/10' : '',
    border: selected ? 'border-barber-gold' : '',
    text: selected ? 'text-barber-gold' : 'text-barber-light'
  };

  return (
    <Card 
      className={`p-4 cursor-pointer transition-colors ${colorScheme.background} ${colorScheme.border}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between space-y-0">
        <p className="text-sm font-medium text-barber-light">{title}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setShow(!show);
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
        {icon}
        <div className="flex items-baseline">
          {show ? (
            <h3 className={`text-2xl font-semibold ${colorScheme.text}`}>
              {value}
            </h3>
          ) : (
            <h3 className={`text-2xl font-semibold ${colorScheme.text}`}>****</h3>
          )}
        </div>
      </div>
      <p className="text-sm text-barber-light/60 mt-2">{description}</p>
    </Card>
  );
}