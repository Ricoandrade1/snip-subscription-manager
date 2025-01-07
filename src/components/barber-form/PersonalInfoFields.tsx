import { UseFormReturn } from "react-hook-form";
import { FormInputField } from "./FormInputField";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<any>;
}

export function PersonalInfoFields({ form }: PersonalInfoFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInputField
        form={form}
        name="name"
        label="Nome"
        placeholder="Nome completo"
        className="col-span-2"
      />

      <FormInputField
        form={form}
        name="nickname"
        label="Apelido"
        placeholder="Apelido"
      />

      <FormInputField
        form={form}
        name="phone"
        label="Telefone"
        placeholder="+351 912 345 678"
      />

      <FormInputField
        form={form}
        name="email"
        label="Email"
        type="email"
        placeholder="email@exemplo.com"
      />

      <FormInputField
        form={form}
        name="birthDate"
        label="Data de Nascimento"
        type="date"
      />

      <FormInputField
        form={form}
        name="nif"
        label="NIF"
        placeholder="Número de Identificação Fiscal"
      />

      <FormInputField
        form={form}
        name="startDate"
        label="Data de Início"
        type="date"
      />
    </div>
  );
}