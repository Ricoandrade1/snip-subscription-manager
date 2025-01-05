import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/integrations/supabase/types";
import { BarberActions } from "./BarberActions";
import { BarberRoleBadges } from "./BarberRoleBadges";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface Barber {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  specialties: string[];
  commission_rate: number;
  status: string;
  roles: UserAuthority[];
}

interface BarberTableRowProps {
  barber: Barber;
  onEditSuccess: () => void;
}

export function BarberTableRow({ barber, onEditSuccess }: BarberTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{barber.name}</TableCell>
      <TableCell>{barber.phone}</TableCell>
      <TableCell>{barber.email || '-'}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {barber.specialties.map((specialty, index) => (
            <Badge key={index} variant="secondary">
              {specialty}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>{barber.commission_rate}%</TableCell>
      <TableCell>
        <Badge 
          variant={barber.status === 'active' ? 'default' : 'secondary'}
        >
          {barber.status === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      </TableCell>
      <TableCell>
        <BarberRoleBadges roles={barber.roles} />
      </TableCell>
      <TableCell>
        <BarberActions barber={barber} onSuccess={onEditSuccess} />
      </TableCell>
    </TableRow>
  );
}