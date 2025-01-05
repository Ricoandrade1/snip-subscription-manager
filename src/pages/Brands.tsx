import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Brand {
  id: string;
  name: string;
}

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [newBrandName, setNewBrandName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status when component mounts
    checkAuth();
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    fetchBrands();
  };

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name");

      if (error) {
        if (error.message?.includes('JWT')) {
          navigate('/login');
          return;
        }
        toast.error("Erro ao carregar marcas");
        return;
      }

      setBrands(data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Erro ao carregar marcas");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBrandName.trim()) {
      toast.error("Nome da marca é obrigatório");
      return;
    }

    try {
      const { error } = editingBrand
        ? await supabase
            .from("brands")
            .update({ name: newBrandName })
            .eq("id", editingBrand.id)
        : await supabase
            .from("brands")
            .insert([{ name: newBrandName }]);

      if (error) {
        if (error.message?.includes('JWT')) {
          navigate('/login');
          return;
        }
        throw error;
      }

      toast.success(editingBrand ? "Marca atualizada" : "Marca criada");
      setIsDialogOpen(false);
      setNewBrandName("");
      setEditingBrand(null);
      fetchBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
      toast.error("Erro ao salvar marca");
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setNewBrandName(brand.name);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("brands")
        .delete()
        .eq("id", id);

      if (error) {
        if (error.message?.includes('JWT')) {
          navigate('/login');
          return;
        }
        throw error;
      }

      toast.success("Marca deletada");
      fetchBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("Erro ao deletar marca");
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Marcas</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingBrand(null);
              setNewBrandName("");
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Marca
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingBrand ? "Editar Marca" : "Nova Marca"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Nome da marca"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                  />
                </div>
                <Button type="submit">
                  {editingBrand ? "Atualizar" : "Criar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <Card key={brand.id} className="p-4 relative group">
              <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(brand)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(brand.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="font-medium">{brand.name}</h3>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}