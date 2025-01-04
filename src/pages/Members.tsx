import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriberForm } from "@/components/SubscriberForm";
import { useMemberContext } from "@/contexts/MemberContext";

export default function Members() {
  const { members, getMembersByPlan } = useMemberContext();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-barber-gold">Membros</h1>
          <p className="text-barber-light/60">
            Gerencie todos os membros da sua barbearia
          </p>
        </header>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start bg-barber-gray">
            <TabsTrigger value="all" className="text-barber-light">
              Todos
            </TabsTrigger>
            <TabsTrigger value="basic" className="text-barber-light">
              Basic
            </TabsTrigger>
            <TabsTrigger value="classic" className="text-barber-light">
              Classic
            </TabsTrigger>
            <TabsTrigger value="business" className="text-barber-light">
              Business
            </TabsTrigger>
            <TabsTrigger value="new-plans" className="text-barber-light">
              +Mais planos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="bg-barber-gray rounded-lg p-6">
              <h2 className="text-xl font-semibold text-barber-gold mb-4">
                Todos os Membros
              </h2>
              <p className="text-barber-light/60">
                Total de membros: {members.length}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="basic" className="mt-6">
            <div className="bg-barber-gray rounded-lg p-6">
              <h2 className="text-xl font-semibold text-barber-gold mb-4">
                Membros Basic
              </h2>
              <p className="text-barber-light/60">
                Total de membros Basic: {getMembersByPlan("Basic").length}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="classic" className="mt-6">
            <div className="bg-barber-gray rounded-lg p-6">
              <h2 className="text-xl font-semibold text-barber-gold mb-4">
                Membros Classic
              </h2>
              <p className="text-barber-light/60">
                Total de membros Classic: {getMembersByPlan("Classic").length}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="business" className="mt-6">
            <div className="bg-barber-gray rounded-lg p-6">
              <h2 className="text-xl font-semibold text-barber-gold mb-4">
                Membros Business
              </h2>
              <p className="text-barber-light/60">
                Total de membros Business: {getMembersByPlan("Business").length}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="new-plans" className="mt-6">
            <div className="bg-barber-gray rounded-lg p-6">
              <h2 className="text-xl font-semibold text-barber-gold mb-4">
                Novos Planos
              </h2>
              <p className="text-barber-light/60">
                Em breve, novos planos estarão disponíveis.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-barber-gold mb-6">
            Cadastrar Novo Membro
          </h2>
          <div className="bg-barber-gray rounded-lg p-6">
            <SubscriberForm />
          </div>
        </div>
      </div>
    </div>
  );
}