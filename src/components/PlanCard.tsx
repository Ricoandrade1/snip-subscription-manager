import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface PlanCardProps {
  title: string;
  price: number;
  features: string[];
  subscribers: number;
  onViewSubscribers: () => void;
}

export const PlanCard = ({
  title,
  price,
  features,
  subscribers,
  onViewSubscribers,
}: PlanCardProps) => {
  return (
    <Card className="w-full max-w-sm bg-barber-gray border-barber-gold/20 hover:border-barber-gold/40 transition-colors">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-barber-gold">{title}</CardTitle>
        <p className="text-4xl font-bold mt-2">
          R$ {price}
          <span className="text-sm font-normal text-barber-light/60">/mês</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <span className="w-2 h-2 bg-barber-gold rounded-full mr-2" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="pt-4 border-t border-barber-gold/20">
          <Button
            onClick={onViewSubscribers}
            variant="outline"
            className="w-full bg-transparent border-barber-gold/40 hover:border-barber-gold text-barber-gold hover:text-barber-gold/80"
          >
            <Users className="mr-2 h-4 w-4" />
            {subscribers} assinantes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};