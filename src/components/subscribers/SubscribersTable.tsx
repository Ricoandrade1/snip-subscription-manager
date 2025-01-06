import { Table, TableBody } from "@/components/ui/table";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SubscribersFilter } from "./SubscribersFilter";
import { SubscriberTableRow } from "./SubscriberTableRow";
import { SubscribersTableHeader } from "./SubscribersTableHeader";
import { useSubscribers } from "./useSubscribers";
import { EditSubscriberDialog } from "./EditSubscriberDialog";
import { SubscribersStats } from "./SubscribersStats";
import type { Subscriber } from "./types";

interface SubscribersTableProps {
  planFilter?: "Basic" | "Classic" | "Business";
}

export function SubscribersTable({ planFilter }: SubscribersTableProps) {
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const { 
    subscribers, 
    isLoading, 
    filters, 
    handleFilterChange, 
    filteredSubscribers,
    stats 
  } = useSubscribers({ planFilter, statusFilter });

  const handleSubscriberClick = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setDialogOpen(true);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
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

  return (
    <div className="space-y-6">
      <SubscribersStats 
        stats={stats}
        onFilterChange={handleStatusFilterChange}
      />
      
      <SubscribersFilter 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

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