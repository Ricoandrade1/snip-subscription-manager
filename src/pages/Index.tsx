import { useState } from "react";
import { PlanCard } from "@/components/PlanCard";
import { Button } from "@/components/ui/button";
import { UserPlus, BarChart3, Users } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SubscriberForm } from "@/components/SubscriberForm";

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
    subscribers: 1,
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
    subscribers: 1,
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
    subscribers: 1,
  },
];

const INITIAL_SUBSCRIBERS = {
  Basic: 1,
  Classic: 1,
  Business: 1,
};

const INITIAL_SUBSCRIBERS_DATA = [
  {
    name: "João Silva",
    nickname: "João",
    nif: "123456789",
    birthDate: "1990-01-15",
    passport: "AB123456",
    citizenCard: "",
    bi: "",
    bank: "Banco do Brasil",
    iban: "PT50123456789012345678901",
    debitDate: "2024-03-01",
    plan: "Basic"
  },
  {
    name: "Maria Santos",
    nickname: "Mari",
    nif: "987654321",
    birthDate: "1985-06-20",
    passport: "",
    citizenCard: "12345678",
    bi: "",
    bank: "Caixa Geral",
    iban: "PT50987654321098765432109",
    debitDate: "2024-03-05",
    plan: "Classic"
  },
  {
    name: "António Ferreira",
    nickname: "Tony",
    nif: "456789123",
    birthDate: "1982-12-10",
    passport: "",
    citizenCard: "",
    bi: "87654321",
    bank: "Millennium BCP",
    iban: "PT50456789123456789123456",
    debitDate: "2024-03-10",
    plan: "Business"
  }
];

const Index = () => {
  const [subscribers, setSubscribers] = useState(INITIAL_SUBSCRIBERS);
  const [subscribersData, setSubscribersData] = useState(INITIAL_SUBSCRIBERS_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNewSubscriber = (data: any) => {
    setSubscribers((prev) => ({
      ...prev,
      [data.plan]: prev[data.plan] + 1,
    }));
    setSubscribersData((prev) => [...prev, data]);
    setIsDialogOpen(false);
  };

  const totalSubscribers = Object.values(subscribers).reduce((a, b) => a + b, 0);
  const monthlyRevenue = PLANS.reduce(
    (acc, plan) => acc + plan.price * subscribers[plan.title],
    0
  );

  return (
    <div className="p-8">
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-barber-gold hover:bg-barber-gold/90 text-black">
                <UserPlus className="mr-2 h-4 w-4" />
                Novo Assinante
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <SubscriberForm
                onSubmit={handleNewSubscriber}
                currentSubscribers={subscribers}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              title={plan.title}
              price={plan.price}
              features={plan.features}
              subscribers={subscribers[plan.title]}
              onViewSubscribers={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;