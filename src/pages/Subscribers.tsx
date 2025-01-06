import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SubscribersTable } from "@/components/subscribers/SubscribersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { UserPlus, Users } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { SubscriberForm } from "@/components/SubscriberForm";
import { useSubscribers } from "@/components/subscribers/useSubscribers";

export default function Subscribers() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subscribers } = useSubscribers({});

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    
    checkSession();
  }, [navigate]);

  const getInitialTab = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/basic')) return "basic";
    if (path.includes('/classic')) return "classic";
    if (path.includes('/business')) return "business";
    return "all";
  };

  const handleTabChange = (value: string) => {
    switch (value) {
      case "basic":
        navigate("/subscribers/basic");
        break;
      case "classic":
        navigate("/subscribers/classic");
        break;
      case "business":
        navigate("/subscribers/business");
        break;
      default:
        navigate("/subscribers");
        break;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-barber-gold" />
              <h1 className="text-4xl font-bold text-barber-gold">Assinantes</h1>
            </div>
            <p className="text-barber-light/60">
              Gerencie todos os assinantes da sua barbearia
            </p>
          </div>
          <div className="flex gap-2">
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
          </div>
        </header>

        <Tabs value={getInitialTab()} className="w-full" onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start bg-barber-gray">
            <TabsTrigger value="all" className="text-barber-light data-[state=active]:bg-barber-gold data-[state=active]:text-barber-black">
              Todos
            </TabsTrigger>
            <TabsTrigger value="basic" className="text-barber-light data-[state=active]:bg-barber-gold data-[state=active]:text-barber-black">
              Basic
            </TabsTrigger>
            <TabsTrigger value="classic" className="text-barber-light data-[state=active]:bg-barber-gold data-[state=active]:text-barber-black">
              Classic
            </TabsTrigger>
            <TabsTrigger value="business" className="text-barber-light data-[state=active]:bg-barber-gold data-[state=active]:text-barber-black">
              Business
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <SubscribersTable />
          </TabsContent>

          <TabsContent value="basic">
            <SubscribersTable planFilter="Basic" />
          </TabsContent>

          <TabsContent value="classic">
            <SubscribersTable planFilter="Classic" />
          </TabsContent>

          <TabsContent value="business">
            <SubscribersTable planFilter="Business" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}