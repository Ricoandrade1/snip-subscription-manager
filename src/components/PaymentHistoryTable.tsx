import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
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

interface Payment {
  memberName: string;
  plan: string;
  amount?: number;
  date?: string;
  dueDate?: string;
  status?: "paid" | "pending" | "overdue";
}

interface PaymentHistoryTableProps {
  payments: Payment[];
}

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [newStatus, setNewStatus] = useState<"paid" | "pending" | "overdue">("paid");

  const handleStatusChange = () => {
    if (adminPassword === "1234") {
      if (selectedPayment) {
        selectedPayment.status = newStatus;
        toast.success("Status atualizado com sucesso!");
        setSelectedPayment(null);
        setAdminPassword("");
      }
    } else {
      toast.error("Senha incorreta!");
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Membro</TableHead>
            <TableHead>Plano</TableHead>
            {payments[0]?.amount && <TableHead>Valor</TableHead>}
            {payments[0]?.date && <TableHead>Data</TableHead>}
            {payments[0]?.dueDate && <TableHead>Vencimento</TableHead>}
            {payments[0]?.status && <TableHead>Status</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment, index) => (
            <TableRow key={index}>
              <TableCell>{payment.memberName}</TableCell>
              <TableCell>{payment.plan}</TableCell>
              {payment.amount && (
                <TableCell>
                  {payment.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </TableCell>
              )}
              {payment.date && (
                <TableCell>
                  {format(new Date(payment.date), "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
              )}
              {payment.dueDate && (
                <TableCell>
                  {format(new Date(payment.dueDate), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
              )}
              {payment.status && (
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === "paid"
                            ? "bg-green-500/20 text-green-500"
                            : payment.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                        onClick={() => setSelectedPayment(payment)}
                      >
                        {payment.status === "paid"
                          ? "Pago"
                          : payment.status === "pending"
                          ? "Pendente"
                          : "Atrasado"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Alterar Status do Pagamento</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">
                            Senha do Administrador
                          </label>
                          <Input
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="Digite a senha"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Novo Status</label>
                          <select
                            className="w-full border rounded-md p-2"
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
                        <Button onClick={handleStatusChange}>Confirmar</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}