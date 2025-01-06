import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function SubscribersTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="text-barber-light">Código</TableHead>
        <TableHead className="text-barber-light">Nome</TableHead>
        <TableHead className="text-barber-light">Apelido</TableHead>
        <TableHead className="text-barber-light">Plano</TableHead>
        <TableHead className="text-barber-light">Status</TableHead>
        <TableHead className="text-barber-light">Telefone</TableHead>
        <TableHead className="text-barber-light">Data de Pagamento</TableHead>
      </TableRow>
    </TableHeader>
  );
}