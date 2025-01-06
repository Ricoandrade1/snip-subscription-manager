import * as z from "zod";
import { MemberStatus } from "@/contexts/types";

export const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  nickname: z.string().optional(),
  phone: z.string().optional(),
  nif: z.string().optional(),
  plan: z.enum(["Basic", "Classic", "Business"]).default("Basic"),
  payment_date: z.date().optional(),
  status: z.enum(["active", "inactive", "pending"] as const).default("inactive")
});

export type FormValues = z.infer<typeof formSchema>;