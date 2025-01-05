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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}