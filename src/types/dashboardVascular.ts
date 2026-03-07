export type DashboardVascular = {
  total_pacientes: number;
  total_lesao_50: number;
  porcentagem_lesao_50: string;
  total_alteracao_clinica: number;
  porcentagem_alteracao_clinica: string;
  total_usv_vencido: number;
  porcentagem_usv_vencido: string;
  total_paciente_convenio: [{ name: string; value: number }];
  total_paciente_clinica: [{ name: string; value: number }];
  total_acesso_vascular: [{ name: string; value: number }];
  total_paciente_nefrologista: [{ name: string; value: number }];
};
