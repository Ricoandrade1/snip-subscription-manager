import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  isVisible: boolean;
  onToggleVisibility: () => void;
  suffix?: string;
}

const StatCard = ({ 
  icon, 
  label, 
  value, 
  isVisible, 
  onToggleVisibility,
  suffix = ''
}: StatCardProps) => {
  return (
    <Card className="bg-barber-gray p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-barber-gold/10 rounded-full">
            {icon}
          </div>
          <div>
            <p className="text-sm text-barber-light/60">{label}</p>
            {isVisible ? (
              <p className="text-2xl font-bold text-barber-light">
                {value}{suffix}
              </p>
            ) : (
              <p className="text-2xl font-bold text-barber-light">****{suffix}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleVisibility}
          className="text-barber-gold hover:text-barber-gold/80 hover:bg-barber-gold/10"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  );
};

export default StatCard;