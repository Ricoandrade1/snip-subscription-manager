import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BarberForm } from "@/components/barber-form/BarberForm";
import { UserPlus, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface Barber {
  id: string;
  name: string;
  phone: string;
  specialties: string[];
  location_name?: string;
}

interface Location {
  id: string;
  name: string;
  barbers: string[];
}

export default function Barbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBarbers();
    fetchLocations();
  }, []);

  const fetchBarbers = async () => {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('*');
      
      if (error) throw error;
      setBarbers(data || []);
    } catch (error) {
      console.error('Error fetching barbers:', error);
      toast({
        title: "Erro ao carregar barbeiros",
        description: "Não foi possível carregar a lista de barbeiros.",
        variant: "destructive",
      });
    }
  };

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*');
      
      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({
        title: "Erro ao carregar barbearias",
        description: "Não foi possível carregar a lista de barbearias.",
        variant: "destructive",
      });
    }
  };

  const assignBarberToLocation = async (barberId: string, locationId: string) => {
    try {
      const location = locations.find(loc => loc.id === locationId);
      if (!location) return;

      const updatedBarbers = [...(location.barbers || [])];
      if (!updatedBarbers.includes(barberId)) {
        updatedBarbers.push(barberId);
      }

      const { error } = await supabase
        .from('locations')
        .update({ barbers: updatedBarbers })
        .eq('id', locationId);

      if (error) throw error;

      toast({
        title: "Barbeiro associado com sucesso",
        description: "O barbeiro foi vinculado à barbearia.",
      });

      fetchLocations();
    } catch (error) {
      console.error('Error assigning barber:', error);
      toast({
        title: "Erro ao associar barbeiro",
        description: "Não foi possível vincular o barbeiro à barbearia.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-barber-gold">Barbeiros</h1>
            <p className="text-barber-light/60">
              Gerencie a equipe de profissionais da sua barbearia
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Cadastrar Barbeiro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Barbeiro</DialogTitle>
              </DialogHeader>
              <BarberForm onSuccess={fetchBarbers} />
            </DialogContent>
          </Dialog>
        </header>

        <div className="bg-barber-dark rounded-lg p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Especialidades</TableHead>
                <TableHead>Barbearia</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {barbers.map((barber) => (
                <TableRow key={barber.id}>
                  <TableCell>{barber.name}</TableCell>
                  <TableCell>{barber.phone}</TableCell>
                  <TableCell>{barber.specialties.join(", ")}</TableCell>
                  <TableCell>{barber.location_name || "Não associado"}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          Associar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Associar à Barbearia</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {locations.map((location) => (
                            <Button
                              key={location.id}
                              onClick={() => assignBarberToLocation(barber.id, location.id)}
                              variant="outline"
                            >
                              {location.name}
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}