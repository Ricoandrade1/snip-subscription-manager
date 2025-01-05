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
    const path = location.pathname;
    if (path.includes("/basic")) return "basic";
    if (path.includes("/classic")) return "classic";
    if (path.includes("/business")) return "business";
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
      default:
        navigate("/members");
        break;
    }
  };

  useEffect(() => {
    if (planType) {
      handleTabChange(planType.toLowerCase());
    }
  }, [planType]);

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
        </Tabs>
      </div>
    </div>
  );
}