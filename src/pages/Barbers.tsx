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
  const [open, setOpen] = useState(false);
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

  const handleSuccess = () => {
    setOpen(false);
    fetchBarbers();
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-barber-gold">Barbeiros</h1>
            <p className="text-barber-light/60">
              Gerencie a equipe de profissionais da sua barbearia
            </p>
          </div>
          <div className="flex justify-center w-full md:w-auto">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Cadastrar Barbeiro
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Barbeiro</DialogTitle>
                </DialogHeader>
                <BarberForm onSuccess={handleSuccess} />
              </DialogContent>
            </Dialog>
          </div>
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