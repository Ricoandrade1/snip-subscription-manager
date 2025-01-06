import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function SubscribersTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="text-barber-light w-28">Código</TableHead>
        <TableHead className="text-barber-light">Nome</TableHead>
        <TableHead className="text-barber-light w-32">Apelido</TableHead>
        <TableHead className="text-barber-light w-28">Plano</TableHead>
        <TableHead className="text-barber-light w-28">Status</TableHead>
        <TableHead className="text-barber-light w-36">Telefone</TableHead>
        <TableHead className="text-barber-light w-40">Data de Pagamento</TableHead>
      </TableRow>
    </TableHeader>
  );
}