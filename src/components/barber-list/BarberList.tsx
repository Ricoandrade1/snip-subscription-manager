import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BarberForm } from "../barber-form/BarberForm";

interface Barber {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  specialties: string[];
  commission_rate: number;
  status: string;
}

export function BarberList() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('id, name, phone, email, specialties, commission_rate, status')
        .order('name');
      
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
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

  const handleEditSuccess = () => {
    setEditingBarber(null);
    fetchBarbers();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Especialidades</TableHead>
            <TableHead>Comissão (%)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {barbers.map((barber) => (
            <TableRow key={barber.id}>
              <TableCell className="font-medium">{barber.name}</TableCell>
              <TableCell>{barber.phone}</TableCell>
              <TableCell>{barber.email || '-'}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {barber.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{barber.commission_rate}%</TableCell>
              <TableCell>
                <Badge 
                  variant={barber.status === 'active' ? 'default' : 'secondary'}
                >
                  {barber.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setEditingBarber(barber)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Editar Barbeiro</DialogTitle>
                    </DialogHeader>
                    {editingBarber && (
                      <BarberForm 
                        barberId={editingBarber.id} 
                        onSuccess={handleEditSuccess}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}