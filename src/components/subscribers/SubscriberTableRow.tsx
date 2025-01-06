import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Subscriber } from "./types/subscriber";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { getPlanPrice } from "./utils/planPrices";

interface SubscriberTableRowProps {
  subscriber: Subscriber;
  onEdit: (subscriber: Subscriber) => void;
  onDelete: (subscriber: Subscriber) => void;
}

export function SubscriberTableRow({
  subscriber,
  onEdit,
  onDelete,
}: SubscriberTableRowProps) {
  return (
    <TableRow>
      <TableCell>{subscriber.name}</TableCell>
      <TableCell>{subscriber.phone || "-"}</TableCell>
      <TableCell>{subscriber.plan}</TableCell>
      <TableCell>{getPlanPrice(subscriber.plan)}€</TableCell>
      <TableCell>
        {subscriber.payment_date
          ? format(new Date(subscriber.payment_date), "dd/MM/yyyy", {
              locale: ptBR,
            })
          : "-"}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(subscriber)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(subscriber)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}