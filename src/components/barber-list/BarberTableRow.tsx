import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/integrations/supabase/types";
import { BarberActions } from "./BarberActions";
import { BarberRoleBadges } from "./BarberRoleBadges";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2 } from "lucide-react";

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
  image_url?: string | null;
}

interface BarberTableRowProps {
  barber: Barber;
  onEditSuccess: () => Promise<void>;
}

export function BarberTableRow({ barber, onEditSuccess }: BarberTableRowProps) {
  const renderBarberInfo = () => (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={barber.image_url || undefined} alt={barber.name} />
        <AvatarFallback>
          <UserCircle2 className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <span className="font-medium">{barber.name}</span>
    </div>
  );

  const renderSpecialties = () => (
    <div className="flex flex-wrap gap-1">
      {barber.specialties.map((specialty, index) => (
        <Badge key={index} variant="secondary">
          {specialty}
        </Badge>
      ))}
    </div>
  );

  const renderStatus = () => (
    <Badge variant={barber.status === 'active' ? 'default' : 'secondary'}>
      {barber.status === 'active' ? 'Ativo' : 'Inativo'}
    </Badge>
  );

  return (
    <TableRow>
      <TableCell>{renderBarberInfo()}</TableCell>
      <TableCell>{barber.phone}</TableCell>
      <TableCell>{barber.email || '-'}</TableCell>
      <TableCell>{renderSpecialties()}</TableCell>
      <TableCell>{barber.commission_rate}%</TableCell>
      <TableCell>{renderStatus()}</TableCell>
      <TableCell>
        <BarberRoleBadges roles={barber.roles} />
      </TableCell>
      <TableCell>
        <BarberActions barber={barber} onSuccess={onEditSuccess} />
      </TableCell>
    </TableRow>
  );
}