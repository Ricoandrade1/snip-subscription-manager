import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SubscriberForm } from "@/components/SubscriberForm";
import { UserPlus, Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

interface DashboardActionsProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const DashboardActions = ({ isDialogOpen, setIsDialogOpen }: DashboardActionsProps) => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        onClick={toggleSidebar}
        className="border-barber-gold text-barber-gold hover:bg-barber-gold/10"
      >
        <Menu className="h-4 w-4" />
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
    </div>
  );
};

export default DashboardActions;