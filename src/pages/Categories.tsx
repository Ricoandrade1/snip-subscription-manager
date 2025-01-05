import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Erro ao carregar categorias");
      return;
    }

    setCategories(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }

    const { error } = editingCategory
      ? await supabase
          .from("categories")
          .update({ name: newCategoryName })
          .eq("id", editingCategory.id)
      : await supabase
          .from("categories")
          .insert([{ name: newCategoryName }]);

    if (error) {
      toast.error("Erro ao salvar categoria");
      return;
    }

    toast.success(editingCategory ? "Categoria atualizada" : "Categoria criada");
    setIsDialogOpen(false);
    setNewCategoryName("");
    setEditingCategory(null);
    fetchCategories();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao deletar categoria");
      return;
    }

    toast.success("Categoria deletada");
    fetchCategories();
  };

  return (
    <div className="min-h-screen bg-barber-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-barber-gray rounded-lg p-6">
          <h1 className="text-3xl font-bold text-barber-gold">Categorias</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingCategory(null);
              setNewCategoryName("");
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-barber-gold hover:bg-barber-gold/90 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-barber-gray border-barber-gold">
              <DialogHeader>
                <DialogTitle className="text-barber-gold">
                  {editingCategory ? "Editar Categoria" : "Nova Categoria"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Nome da categoria"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="bg-barber-black border-barber-gold/50 focus:border-barber-gold text-white"
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-barber-gold hover:bg-barber-gold/90 text-black"
                >
                  {editingCategory ? "Atualizar" : "Criar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="bg-barber-gray border-barber-gold/20 hover:border-barber-gold/50 transition-colors p-6 relative group"
            >
              <div className="absolute top-4 right-4 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-barber-gold hover:text-barber-gold/80 hover:bg-barber-black/50"
                  onClick={() => handleEdit(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-barber-black/50"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="text-xl font-medium text-barber-gold">{category.name}</h3>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}