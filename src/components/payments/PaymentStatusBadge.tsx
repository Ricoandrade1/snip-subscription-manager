import { Button } from "@/components/ui/button";

interface PaymentStatusBadgeProps {
  status: string;
  onClick: () => void;
  className?: string;
}

export function PaymentStatusBadge({ status, onClick, className }: PaymentStatusBadgeProps) {
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago";
      case "pending":
        return "Pendente";
      case "overdue":
        return "Atrasado";
      default:
        return status;
    }
  };

  return (
    <Button
      variant="ghost"
      className={`${getStatusColor(status)} ${className}`}
      onClick={onClick}
    >
      {getStatusLabel(status)}
    </Button>
  );
}