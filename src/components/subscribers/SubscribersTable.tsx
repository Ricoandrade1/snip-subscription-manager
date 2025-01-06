import { Table, TableBody } from "@/components/ui/table";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SubscribersFilter } from "./SubscribersFilter";
import { SubscriberTableRow } from "./SubscriberTableRow";
import { SubscribersTableHeader } from "./SubscribersTableHeader";
import { useSubscribers } from "./useSubscribers";
import { EditSubscriberDialog } from "./EditSubscriberDialog";
import type { Subscriber } from "./types";

interface SubscribersTableProps {
  planFilter?: "Basic" | "Classic" | "Business";
}

export function SubscribersTable({ planFilter }: SubscribersTableProps) {
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { 
    subscribers, 
    isLoading, 
    filters, 
    handleFilterChange, 
    filteredSubscribers 
  } = useSubscribers({ planFilter });

  const handleSubscriberClick = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[300px]" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!subscribers || subscribers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-barber-light/60">Nenhum assinante encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SubscribersFilter filters={filters} onFilterChange={handleFilterChange} />

      <div className="rounded-lg overflow-hidden border border-barber-gray">
        <Table>
          <SubscribersTableHeader />
          <TableBody>
            {filteredSubscribers.map((subscriber) => (
              <SubscriberTableRow
                key={subscriber.id}
                subscriber={subscriber}
                onClick={() => handleSubscriberClick(subscriber)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <EditSubscriberDialog
        subscriber={selectedSubscriber}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}