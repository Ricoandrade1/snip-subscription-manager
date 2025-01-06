import { useEffect, useState } from "react";
import { UserCog, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";
import { UserForm } from "@/components/users/UserForm";
import { UserGrid } from "@/components/users/UserGrid";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface User {
  id: string;
  email: string;
  roles: UserAuthority[];
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: usersData, error } = await supabase
        .from('barbers')
        .select('id, email, roles')
        .order('email');

      if (error) throw error;

      setUsers(usersData || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os utilizadores.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdateSuccess = () => {
    fetchUsers();
    setSelectedUserId(null);
  };

  const handleCreateUser = async (data: any) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
            nif: data.nif,
            role: data.role,
          },
        },
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Sucesso",
        description: "Utilizador criado com sucesso!",
      });
      
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o utilizador.",
      });
    }
  };

  return (
    <div className="container p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <UserCog className="h-8 w-8 text-barber-gold" />
              <h1 className="text-4xl font-bold text-barber-gold">Utilizadores</h1>
            </div>
            <p className="text-barber-light/60">
              Gerencie as funções e permissões dos utilizadores
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-barber-gold hover:bg-barber-gold/90 text-barber-black"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Utilizador
              </Button>
            </DialogTrigger>
            <DialogContent>
              <UserForm onSubmit={handleCreateUser} />
            </DialogContent>
          </Dialog>
        </header>

        <UserGrid
          users={users}
          loading={loading}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
          onRoleUpdateSuccess={handleRoleUpdateSuccess}
        />
      </div>
    </div>
  );
}