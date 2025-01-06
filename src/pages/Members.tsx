import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SubscriberForm } from "@/components/SubscriberForm";
import { MembersTable } from "@/components/MembersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemberContext } from "@/contexts/MemberContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import { UserPlus, Users } from "lucide-react";
import { useEffect } from "react";

interface MembersProps {
  planType?: "Basic" | "Classic" | "Business";
}

export default function Members({ planType }: MembersProps) {
  const { members, getMembersByPlan } = useMemberContext();
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSession();

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  const getInitialTab = () => {
    const currentPath = location.pathname;
    if (currentPath === "/members/basic") return "basic";
    if (currentPath === "/members/classic") return "classic";
    if (currentPath === "/members/business") return "business";
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

  const basicCount = getMembersByPlan("Basic");
  const classicCount = getMembersByPlan("Classic");
  const businessCount = getMembersByPlan("Business");

  if (!session) {
    return null;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-barber-gold" />
              <h1 className="text-4xl font-bold text-barber-gold">Membros</h1>
            </div>
            <p className="text-barber-light/60">
              Gerencie todos os membros da sua barbearia
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-barber-gold hover:bg-barber-gold/90 text-barber-black">
                <UserPlus className="mr-2 h-4 w-4" />
                Cadastrar Assinante
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-barber-gray border-barber-gold/20">
              <SubscriberForm />
            </DialogContent>
          </Dialog>
        </header>

        <Tabs value={getInitialTab()} className="w-full" onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start bg-barber-gray">
            <TabsTrigger value="all" className="text-barber-light data-[state=active]:bg-barber-gold data-[state=active]:text-barber-black">
              Todos ({members.length})
            </TabsTrigger>
            <TabsTrigger value="basic" className="text-barber-light data-[state=active]:bg-barber-gold data-[state=active]:text-barber-black">
              Basic ({basicCount})
            </TabsTrigger>
            <TabsTrigger value="classic" className="text-barber-light data-[state=active]:bg-barber-gold data-[state=active]:text-barber-black">
              Classic ({classicCount})
            </TabsTrigger>
            <TabsTrigger value="business" className="text-barber-light data-[state=active]:bg-barber-gold data-[state=active]:text-barber-black">
              Business ({businessCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <MembersTable />
          </TabsContent>

          <TabsContent value="basic">
            <MembersTable planFilter="Basic" />
          </TabsContent>

          <TabsContent value="classic">
            <MembersTable planFilter="Classic" />
          </TabsContent>

          <TabsContent value="business">
            <MembersTable planFilter="Business" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}