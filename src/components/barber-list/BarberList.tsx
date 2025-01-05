import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";
import { BarberTableRow } from "./BarberTableRow";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface Barber {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  specialties: string[];
  commission_rate: number;
  status: string;
  roles: UserAuthority[];
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
        .select('id, name, phone, email, specialties, commission_rate, status, roles')
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
            <TableHead>Funções</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {barbers.map((barber) => (
            <BarberTableRow 
              key={barber.id} 
              barber={barber} 
              onEditSuccess={fetchBarbers}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}