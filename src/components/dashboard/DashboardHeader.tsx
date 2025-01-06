import { CircleDollarSign, Users, Scissors } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardHeader() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight text-barber-gold">
          Bem-vindo de volta
        </h1>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-barber-gray border-barber-gold/20 hover:border-barber-gold/40 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-barber-gold/10 rounded-lg">
                <Users className="h-6 w-6 text-barber-gold" />
              </div>
              <div>
                <p className="text-sm font-medium text-barber-light/60">Clientes</p>
                <h2 className="text-2xl font-bold text-barber-gold">2.350</h2>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-barber-gray border-barber-gold/20 hover:border-barber-gold/40 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-barber-gold/10 rounded-lg">
                <CircleDollarSign className="h-6 w-6 text-barber-gold" />
              </div>
              <div>
                <p className="text-sm font-medium text-barber-light/60">Receita</p>
                <h2 className="text-2xl font-bold text-barber-gold">R$ 12.500</h2>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-barber-gray border-barber-gold/20 hover:border-barber-gold/40 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-barber-gold/10 rounded-lg">
                <Scissors className="h-6 w-6 text-barber-gold" />
              </div>
              <div>
                <p className="text-sm font-medium text-barber-light/60">Serviços</p>
                <h2 className="text-2xl font-bold text-barber-gold">1.890</h2>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}