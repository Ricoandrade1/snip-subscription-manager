import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BarberForm } from "@/components/barber-form/BarberForm";
import { UserPlus } from "lucide-react";

export default function Barbers() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-barber-gold">Barbeiros</h1>
            <p className="text-barber-light/60">
              Gerencie a equipe de profissionais da sua barbearia
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Cadastrar Barbeiro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Barbeiro</DialogTitle>
              </DialogHeader>
              <BarberForm />
            </DialogContent>
          </Dialog>
        </header>
      </div>
    </div>
  );
}