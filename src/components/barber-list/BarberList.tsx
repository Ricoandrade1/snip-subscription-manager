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
import { Pencil, Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BarberForm } from "../barber-form/BarberForm";
import { RoleManager } from "./RoleManager";

interface Barber {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  specialties: string[];
  commission_rate: number;
  status: string;
  roles: string[];
}

export function BarberList() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [managingRoles, setManagingRoles] = useState<Barber | null>(null);
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

  const handleEditSuccess = () => {
    setEditingBarber(null);
    fetchBarbers();
  };

  const handleRoleUpdateSuccess = () => {
    setManagingRoles(null);
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
            <TableHead>Funções</TableHead>
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
                <div className="flex flex-wrap gap-1">
                  {barber.roles?.map((role, index) => (
                    <Badge key={index} variant="outline">
                      {role}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
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

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setManagingRoles(barber)}
                      >
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Gerenciar Funções - {barber.name}</DialogTitle>
                      </DialogHeader>
                      {managingRoles && (
                        <RoleManager 
                          barber={managingRoles}
                          onSuccess={handleRoleUpdateSuccess}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}