import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Store } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string | null;
  opening_hours: any | null;
}

export default function Stores() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');

      if (error) throw error;

      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as lojas.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Store className="h-8 w-8 text-barber-gold" />
              <h1 className="text-4xl font-bold text-barber-gold">Lojas</h1>
            </div>
            <p className="text-barber-light/60">
              Gerencie todas as lojas da sua rede
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-barber-gold hover:bg-barber-gold/90 text-barber-black">
                <Store className="mr-2 h-4 w-4" />
                Adicionar Loja
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-barber-gray border-barber-gold/20">
              {/* Store form will be implemented later */}
              <div className="p-4">Form de criação de loja será implementado em breve</div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i} 
                className="h-48 rounded-lg bg-barber-gray/50 animate-pulse"
              />
            ))
          ) : locations.length === 0 ? (
            // Empty state
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
              <Store className="h-16 w-16 text-barber-gold/20 mb-4" />
              <h3 className="text-xl font-semibold text-barber-gold mb-2">
                Nenhuma loja cadastrada
              </h3>
              <p className="text-barber-light/60">
                Clique no botão "Adicionar Loja" para começar
              </p>
            </div>
          ) : (
            // Store cards
            locations.map((location) => (
              <div
                key={location.id}
                className="p-6 rounded-lg bg-barber-gray border border-barber-gold/20 space-y-4"
              >
                <h3 className="text-xl font-semibold text-barber-gold">
                  {location.name}
                </h3>
                <div className="space-y-2 text-sm text-barber-light/80">
                  <p>{location.address}</p>
                  <p>{location.phone}</p>
                  {location.email && <p>{location.email}</p>}
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm">
                    Excluir
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}