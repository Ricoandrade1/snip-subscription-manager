import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { PlanFields } from "./PlanFields";
import { PaymentDateField } from "../PaymentDateField";
import { StatusField } from "./StatusField";

interface MemberFormFieldsProps {
  form: UseFormReturn<FormValues>;
}

export function MemberFormFields({ form }: MemberFormFieldsProps) {
  return (
    <>
      <PersonalInfoFields form={form} />
      <PlanFields form={form} />
      <PaymentDateField form={form} />
      <StatusField form={form} />
    </>
  );
}