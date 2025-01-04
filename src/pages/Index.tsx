import { useState } from "react";
import { PlanCard } from "@/components/PlanCard";
import { Button } from "@/components/ui/button";
import { UserPlus, BarChart3, Users } from "lucide-react";

const PLANS = [
  {
    id: 1,
    title: "Basic",
    price: 30,
    features: [
      "Somente barba",
      "1 vez por semana",
      "Agendamento prioritário",
    ],
    subscribers: 45,
  },
  {
    id: 2,
    title: "Classic",
    price: 40,
    features: [
      "Somente cabelo",
      "1 vez por semana",
      "Agendamento prioritário",
    ],
    subscribers: 32,
  },
  {
    id: 3,
    title: "Business",
    price: 50,
    features: [
      "Cabelo e barba",
      "1 vez por semana",
      "Agendamento VIP",
      "Produtos exclusivos",
    ],
    subscribers: 18,
  },
];

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const totalSubscribers = PLANS.reduce((acc, plan) => acc + plan.subscribers, 0);
  const monthlyRevenue = PLANS.reduce(
    (acc, plan) => acc + plan.price * plan.subscribers,
    0
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-barber-gold">
            Gestão de Assinaturas
          </h1>
          <p className="text-barber-light/60 max-w-2xl mx-auto">
            Gerencie os planos e assinantes da sua barbearia em um só lugar
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-barber-gray rounded-lg p-6 flex items-center space-x-4">
            <div className="p-4 bg-barber-gold/10 rounded-full">
              <Users className="h-6 w-6 text-barber-gold" />
            </div>
            <div>
              <p className="text-sm text-barber-light/60">Total de Assinantes</p>
              <p className="text-2xl font-bold">{totalSubscribers}</p>
            </div>
          </div>
          <div className="bg-barber-gray rounded-lg p-6 flex items-center space-x-4">
            <div className="p-4 bg-barber-gold/10 rounded-full">
              <BarChart3 className="h-6 w-6 text-barber-gold" />
            </div>
            <div>
              <p className="text-sm text-barber-light/60">Receita Mensal</p>
              <p className="text-2xl font-bold">{monthlyRevenue}€</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-barber-gold hover:bg-barber-gold/90 text-black">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Assinante
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              title={plan.title}
              price={plan.price}
              features={plan.features}
              subscribers={plan.subscribers}
              onViewSubscribers={() => setSelectedPlan(plan.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;