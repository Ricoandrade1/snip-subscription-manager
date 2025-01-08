import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SubscriberForm } from "@/components/SubscriberForm";
import { UserPlus, Menu, Download } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/auth/UserMenu";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface DashboardActionsProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const DashboardActions = ({ isDialogOpen, setIsDialogOpen }: DashboardActionsProps) => {
  const { toggleSidebar } = useSidebar();

  const handleExportProject = async () => {
    try {
      toast.loading("Exportando projeto...");
      
      // Fetch data from all tables
      const [
        { data: members }, 
        { data: plans },
        { data: payments },
        { data: products },
        { data: barbers },
        { data: brands },
        { data: categories },
        { data: sales },
        { data: visits },
        { data: locations }
      ] = await Promise.all([
        supabase.from('members').select('*'),
        supabase.from('plans').select('*'),
        supabase.from('payments').select('*'),
        supabase.from('products').select('*'),
        supabase.from('barbers').select('*'),
        supabase.from('brands').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('sales').select('*'),
        supabase.from('visits').select('*'),
        supabase.from('locations').select('*')
      ]);

      // Compile all data into a single object
      const projectData = {
        exportDate: new Date().toISOString(),
        data: {
          members,
          plans,
          payments,
          products,
          barbers,
          brands,
          categories,
          sales,
          visits,
          locations
        }
      };

      // Convert to JSON and create blob
      const jsonString = JSON.stringify(projectData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("Projeto exportado com sucesso!");
    } catch (error) {
      console.error('Erro ao exportar projeto:', error);
      toast.dismiss();
      toast.error("Erro ao exportar projeto. Tente novamente.");
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        onClick={toggleSidebar}
        className="border-barber-gold text-barber-gold hover:bg-barber-gold/10"
      >
        <Menu className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        onClick={handleExportProject}
        className="border-barber-gold text-barber-gold hover:bg-barber-gold/10"
      >
        <Download className="h-4 w-4 mr-2" />
        Exportar Projeto
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-barber-gold hover:bg-barber-gold/90 text-black">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Assinante
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <SubscriberForm />
        </DialogContent>
      </Dialog>

      <UserMenu />
    </div>
  );
};

export default DashboardActions;