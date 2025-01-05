import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Payment {
  id: string;
  member_id: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  payment_date: string;
  receipt_url?: string;
}

interface PaymentHistoryTableProps {
  payments: Payment[];
  onPaymentUpdate: () => void;
}

export function PaymentHistoryTable({
  payments,
  onPaymentUpdate,
}: PaymentHistoryTableProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [newStatus, setNewStatus] = useState<"paid" | "pending" | "overdue">("paid");

  const handleStatusChange = async () => {
    if (adminPassword !== "admin123") {
      toast.error("Senha incorreta");
      return;
    }

    if (!selectedPayment) return;

    const { error } = await supabase
      .from("payments")
      .update({ status: newStatus })
      .eq("id", selectedPayment.id);

    if (error) {
      toast.error("Erro ao atualizar status");
      return;
    }

    toast.success("Status atualizado com sucesso");
    onPaymentUpdate();
    setAdminPassword("");
    setSelectedPayment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "overdue":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="rounded-md border border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">
                Data
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Valor
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Status
              </th>
              <th className="h-12 px-4 text-right align-middle font-medium">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-border">
                <td className="p-4 align-middle">
                  {format(new Date(payment.payment_date), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </td>
                <td className="p-4 align-middle">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(payment.amount)}
                </td>
                <td className="p-4 align-middle">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`${getStatusColor(payment.status)}`}
                        onClick={() => setSelectedPayment(payment)}
                      >
                        {payment.status === "paid"
                          ? "Pago"
                          : payment.status === "pending"
                          ? "Pendente"
                          : "Atrasado"}
                      </Button>
                    </DialogTrigger>
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
                            onChange={(e) => setAdminPassword(e.target.value)}
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
                            onChange={(e) =>
                              setNewStatus(e.target.value as "paid" | "pending" | "overdue")
                            }
                          >
                            <option value="paid">Pago</option>
                            <option value="pending">Pendente</option>
                            <option value="overdue">Atrasado</option>
                          </select>
                        </div>
                        <Button 
                          onClick={handleStatusChange}
                          className="bg-barber-gold hover:bg-barber-gold/90 text-black w-full"
                        >
                          Confirmar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
                <td className="p-4 text-right">
                  {payment.receipt_url && (
                    <a
                      href={payment.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-barber-gold hover:underline"
                    >
                      Ver comprovante
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}