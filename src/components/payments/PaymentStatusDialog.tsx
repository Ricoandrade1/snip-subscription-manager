import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PaymentStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adminPassword: string;
  onAdminPasswordChange: (value: string) => void;
  newStatus: "paid" | "pending" | "overdue";
  onNewStatusChange: (value: "paid" | "pending" | "overdue") => void;
  onConfirm: () => void;
}

export function PaymentStatusDialog({
  open,
  onOpenChange,
  adminPassword,
  onAdminPasswordChange,
  newStatus,
  onNewStatusChange,
  onConfirm,
}: PaymentStatusDialogProps) {
  return (
    <DialogContent className="bg-barber-black border-barber-gray">
      <DialogHeader>
        <DialogTitle className="text-barber-light">Alterar Status do Pagamento</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-barber-light">
            Senha do Administrador
          </label>
          <Input
            type="password"
            value={adminPassword}
            onChange={(e) => onAdminPasswordChange(e.target.value)}
            placeholder="Digite a senha"
            className="bg-barber-gray border-barber-gray text-barber-light placeholder:text-barber-light/50"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-barber-light">
            Novo Status
          </label>
          <select
            className="w-full border rounded-md p-2 bg-barber-gray border-barber-gray text-barber-light"
            value={newStatus}
            onChange={(e) => onNewStatusChange(e.target.value as "paid" | "pending" | "overdue")}
          >
            <option value="paid">Pago</option>
            <option value="pending">Pendente</option>
            <option value="overdue">Atrasado</option>
          </select>
        </div>
        <Button 
          onClick={onConfirm}
          className="bg-barber-gold hover:bg-barber-gold/90 text-black w-full"
        >
          Confirmar
        </Button>
      </div>
    </DialogContent>
  );
}