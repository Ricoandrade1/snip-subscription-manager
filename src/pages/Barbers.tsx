import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BarberForm } from "@/components/barber-form/BarberForm";
import { BarberList } from "@/components/barber-list/BarberList";
import { UserPlus } from "lucide-react";

export default function Barbers() {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-barber-gold">Barbeiros</h1>
            <p className="text-barber-light/60">
              Gerencie a equipe de profissionais da sua barbearia
            </p>
          </div>
          <div className="flex justify-center w-full md:w-auto">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Cadastrar Barbeiro
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Barbeiro</DialogTitle>
                </DialogHeader>
                <BarberForm onSuccess={handleSuccess} />
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="bg-barber-gray rounded-lg p-6">
          <BarberList />
        </div>
      </div>
    </div>
  );
}