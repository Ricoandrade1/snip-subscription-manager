import { Table, TableBody } from "@/components/ui/table";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SubscribersFilter } from "./SubscribersFilter";
import { SubscriberTableRow } from "./SubscriberTableRow";
import { SubscribersTableHeader } from "./SubscribersTableHeader";
import { useSubscribers } from "./useSubscribers";
import { EditSubscriberDialog } from "./EditSubscriberDialog";
import { SubscribersStats } from "./SubscribersStats";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Subscriber } from "./types";

interface SubscribersTableProps {
  planFilter?: "Basic" | "Classic" | "Business";
}

export function SubscribersTable({ planFilter }: SubscribersTableProps) {
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const { 
    subscribers, 
    isLoading, 
    filters, 
    handleFilterChange, 
    filteredSubscribers,
    stats,
    refetch 
  } = useSubscribers({ planFilter, statusFilter });

  const handleSubscriberClick = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setDialogOpen(true);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleDeleteClick = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (adminPassword !== '1234') {
      toast.error('Senha de administrador incorreta');
      return;
    }

    if (!selectedSubscriber) return;

    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', selectedSubscriber.id);

      if (error) throw error;

      toast.success('Assinante excluído com sucesso');
      setDeleteDialogOpen(false);
      setAdminPassword('');
      await refetch(); // Explicitly call refetch after successful deletion
    } catch (error) {
      console.error('Erro ao excluir assinante:', error);
      toast.error('Erro ao excluir assinante');
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setAdminPassword('');
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
        selectedStatus={statusFilter}
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
                subscribers={subscribers}
                onClick={() => handleSubscriberClick(subscriber)}
                onDeleteClick={() => handleDeleteClick(subscriber)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <EditSubscriberDialog
        subscriber={selectedSubscriber}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={refetch}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o assinante {selectedSubscriber?.name}? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="adminPassword" className="text-sm font-medium text-gray-700">
                Senha de Administrador
              </label>
              <Input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Digite a senha de administrador"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleDeleteDialogClose}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}