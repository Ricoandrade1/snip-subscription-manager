import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, PenLine } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlanEditForm } from "../plans/PlanEditForm";
import { useState } from "react";

interface Plan {
  id: number;
  title: string;
  price: number;
  features: string[];
  totalSubscribers: number;
}

interface PlansGridProps {
  plans: Plan[];
}

export default function PlansGrid({ plans }: PlansGridProps) {
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card 
          key={plan.id}
          className="bg-barber-gray border-barber-gold/20 hover:border-barber-gold/40 transition-colors"
        >
          <CardHeader className="relative">
            <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 text-barber-gold hover:text-barber-gold/80 hover:bg-barber-gold/10"
                  onClick={() => setEditingPlan(plan)}
                >
                  <PenLine className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              {editingPlan && (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Plano {editingPlan.title}</DialogTitle>
                  </DialogHeader>
                  <PlanEditForm
                    initialData={{
                      title: editingPlan.title,
                      price: editingPlan.price,
                      features: editingPlan.features,
                    }}
                    onClose={() => setEditingPlan(null)}
                  />
                </DialogContent>
              )}
            </Dialog>
            <CardTitle className="text-2xl font-bold text-barber-gold">
              {plan.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-3xl font-bold text-barber-gold">
                {plan.price}€
              </span>
              <span className="text-barber-light/60">/mês</span>
            </div>
            
            <div className="space-y-2">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-barber-gold" />
                  <span className="text-sm text-barber-light">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-barber-gold/10">
              <p className="text-sm text-barber-light/60">
                Assinantes ativos:{" "}
                <span className="font-medium text-barber-gold">
                  {plan.totalSubscribers}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}