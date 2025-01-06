import { useEffect, useState } from "react";
import { UserCog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RoleManager } from "@/components/barber-list/RoleManager";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface User {
  id: string;
  email: string;
  roles: UserAuthority[];
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-barber-black p-8">
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
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i} 
                className="h-48 rounded-lg bg-barber-gray/50 animate-pulse"
              />
            ))
          ) : users.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
              <UserCog className="h-16 w-16 text-barber-gold/20 mb-4" />
              <h3 className="text-xl font-semibold text-barber-gold mb-2">
                Nenhum utilizador encontrado
              </h3>
              <p className="text-barber-light/60">
                Adicione barbeiros para gerenciar suas funções
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="p-6 rounded-lg bg-barber-gray border border-barber-gold/20 space-y-4 hover:border-barber-gold/40 transition-colors"
              >
                <h3 className="text-xl font-semibold text-barber-gold truncate">
                  {user.email}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.roles?.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-1 rounded-full text-xs bg-barber-gold/10 text-barber-gold border border-barber-gold/20"
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <div className="pt-4 flex justify-end">
                  <Dialog open={selectedUser?.id === user.id} onOpenChange={(open) => !open && setSelectedUser(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                        className="hover:bg-barber-gold/10 hover:text-barber-gold border-barber-gold/20"
                      >
                        Gerir Funções
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-barber-gray border-barber-gold/20">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-barber-gold">
                          Gerir Funções - {selectedUser?.email}
                        </h2>
                        {selectedUser && (
                          <RoleManager
                            barber={{
                              id: selectedUser.id,
                              name: selectedUser.email || '',
                              roles: selectedUser.roles || []
                            }}
                            onSuccess={handleRoleUpdateSuccess}
                          />
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}