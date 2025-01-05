import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function MembersTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Código</TableHead>
        <TableHead>Nome</TableHead>
        <TableHead>Apelido</TableHead>
        <TableHead>Plano</TableHead>
        <TableHead>Telefone</TableHead>
      </TableRow>
    </TableHeader>
  );
}