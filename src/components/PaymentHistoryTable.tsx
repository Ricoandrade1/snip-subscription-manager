import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PaymentStatusBadge } from "./payments/PaymentStatusBadge";
import { PaymentStatusDialog } from "./payments/PaymentStatusDialog";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStatusChange = async () => {
    if (adminPassword !== "admin123") {
      toast.error("Senha incorreta");
      return;
    }

    if (!selectedPayment) {
      toast.error("Nenhum pagamento selecionado");
      return;
    }

    try {
      const { error } = await supabase
        .from("payments")
        .update({ status: newStatus })
        .eq("id", selectedPayment.id);

      if (error) {
        console.error("Erro ao atualizar status:", error);
        throw error;
      }

      // Atualiza a lista de pagamentos
      onPaymentUpdate();
      
      // Limpa os estados e fecha o diálogo
      setSelectedPayment(null);
      setAdminPassword("");
      setIsDialogOpen(false);
      
      toast.success("Status atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status");
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
                  <Dialog 
                    open={isDialogOpen && selectedPayment?.id === payment.id}
                    onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if (!open) {
                        setSelectedPayment(null);
                        setAdminPassword("");
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <div onClick={() => {
                        setSelectedPayment(payment);
                        setNewStatus(payment.status);
                      }}>
                        <PaymentStatusBadge
                          status={payment.status}
                          onClick={() => {}}
                        />
                      </div>
                    </DialogTrigger>
                    <PaymentStatusDialog
                      open={isDialogOpen}
                      onOpenChange={setIsDialogOpen}
                      adminPassword={adminPassword}
                      onAdminPasswordChange={setAdminPassword}
                      newStatus={newStatus}
                      onNewStatusChange={setNewStatus}
                      onConfirm={handleStatusChange}
                    />
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