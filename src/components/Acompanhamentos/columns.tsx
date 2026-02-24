"use client";

import { type ColumnDef } from "@tanstack/react-table";

export type Acompanhamento = {
  paciente: string;
  convenio: number;
  clinica: string;
  medico: string;
  situacao_clinica: string;
  ultimo_acesso: string;
  tipo_de_acesso: string;
  ultimo_usv: string;
  lesao_50: string;
  alteracao_clinica: string;
  lesoes: string;
  tratamentos: string;
  observacoes: string;
};

export const columns: ColumnDef<Acompanhamento>[] = [
  {
    accessorKey: "paciente",
    header: "Paciente",
  },
  {
    accessorKey: "convenio",
    header: "Convênio",
  },
  {
    accessorKey: "clinica",
    header: "Clínica",
  },
  {
    accessorKey: "medico",
    header: "Nefrologista",
  },
  {
    accessorKey: "situacao_clinica",
    header: "Situação Clínica",
  },
  {
    accessorKey: "ultimo_acesso",
    header: "Último Acesso",
  },
  {
    accessorKey: "tipo_de_acesso",
    header: "Tipo de Acesso",
  },
  {
    accessorKey: "ultimo_usv",
    header: "Último USV",
  },
  {
    accessorKey: "lesao_50",
    header: "Lesão 50%",
  },
  {
    accessorKey: "alteracao_clinica",
    header: "Alteração Clínica",
  },
  {
    accessorKey: "lesoes",
    header: "Lesões",
  },
  {
    accessorKey: "tratamentos",
    header: "Tratamentos",
  },
  {
    accessorKey: "observacoes",
    header: "Observações",
  },
];
