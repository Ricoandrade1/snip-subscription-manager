import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SubscriberForm } from "@/components/SubscriberForm";
import { MembersTable } from "@/components/MembersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemberContext } from "@/contexts/MemberContext";
import { PlanCard } from "@/components/PlanCard";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MembersProps {
  planType?: "Basic" | "Classic" | "Business";
}

export default function Members({ planType }: MembersProps) {
  const { members } = useMemberContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const getInitialTab = () => {
    if (planType === "Basic") return "basic";
    if (planType === "Classic") return "classic";
    if (planType === "Business") return "business";
    return "all";
  };

  const handleTabChange = (value: string) => {
    switch (value) {
      case "basic":
        navigate("/members/basic");
        break;
      case "classic":
        navigate("/members/classic");
        break;
      case "business":
        navigate("/members/business");
        break;
      case "all":
        navigate("/members/all");
        break;
      default:
        break;
    }
  };

  const handleViewSubscribers = (plan: string) => {
    const tabValue = plan.toLowerCase();
    navigate(`/members/${tabValue}`);
  };

  const handleCreateNewPlan = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A criação de novos planos estará disponível em breve.",
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-barber-gold">Membros</h1>
            <p className="text-barber-light/60">
              Gerencie todos os membros da sua barbearia
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Cadastrar Assinante</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <SubscriberForm />
            </DialogContent>
          </Dialog>
        </header>

        <Tabs defaultValue={getInitialTab()} className="w-full" onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start bg-barber-gray">
            <TabsTrigger value="all" className="text-barber-light">
              Todos ({members.length})
            </TabsTrigger>
            <TabsTrigger value="basic" className="text-barber-light">
              Basic ({members.filter(m => m.plan === "Basic").length})
            </TabsTrigger>
            <TabsTrigger value="classic" className="text-barber-light">
              Classic ({members.filter(m => m.plan === "Classic").length})
            </TabsTrigger>
            <TabsTrigger value="business" className="text-barber-light">
              Business ({members.filter(m => m.plan === "Business").length})
            </TabsTrigger>
            <TabsTrigger value="new-plans" className="text-barber-light">
              +Mais planos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <MembersTable />
          </TabsContent>

          <TabsContent value="basic" className="mt-6">
            <MembersTable planFilter="Basic" />
          </TabsContent>

          <TabsContent value="classic" className="mt-6">
            <MembersTable planFilter="Classic" />
          </TabsContent>

          <TabsContent value="business" className="mt-6">
            <MembersTable planFilter="Business" />
          </TabsContent>

          <TabsContent value="new-plans" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PlanCard
                title="Basic"
                price={30}
                features={["Somente Barba", "1 vez por semana", "Agendamento prioritário"]}
                subscribers={members.filter(m => m.plan === "Basic").length}
                onViewSubscribers={() => handleViewSubscribers("Basic")}
              />
              <PlanCard
                title="Classic"
                price={40}
                features={["Somente Cabelo", "1 vez por semana", "Agendamento prioritário"]}
                subscribers={members.filter(m => m.plan === "Classic").length}
                onViewSubscribers={() => handleViewSubscribers("Classic")}
              />
              <PlanCard
                title="Business"
                price={50}
                features={[
                  "Cabelo e Barba",
                  "1 vez por semana",
                  "Agendamento VIP",
                  "Produtos exclusivos"
                ]}
                subscribers={members.filter(m => m.plan === "Business").length}
                onViewSubscribers={() => handleViewSubscribers("Business")}
              />
              <div className="flex items-center justify-center w-full max-w-sm h-[400px] border-2 border-dashed border-barber-gold/20 rounded-lg hover:border-barber-gold/40 transition-colors">
                <Button
                  variant="ghost"
                  onClick={handleCreateNewPlan}
                  className="flex flex-col gap-4 text-barber-gold hover:text-barber-gold/80 hover:bg-barber-gold/10"
                >
                  <Plus className="h-8 w-8" />
                  <span>Criar novo plano</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}