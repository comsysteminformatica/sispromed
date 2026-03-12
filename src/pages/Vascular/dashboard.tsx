import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Bandage, SquareActivity, TrendingUp, Users } from "lucide-react";

import CardDashboard from "@/components/Cards/dashboard";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Pie, PieChart } from "recharts";
import { toast } from "sonner";
import { consultarDashboardVascular, consultarEmpresas } from "@/service/api";
import { useEffect, useState } from "react";
import type { DashboardVascular } from "@/types/dashboardVascular";
import { buildChart } from "@/components/buildChart";
import useGlobalState from "@/state/useGlobalState";
import ModalEmpresas from "@/components/Modals/empresas";

type Empresa = {
  id: number;
  nome: string;
  perfil: string;
};

export default function DashboardVascular() {
  const setEmpresaUsuario = useGlobalState((state) => state.setEmpresaUsuario);
  const empresaUsuario = useGlobalState((state) => state.empresaUsuario);

  const [data, setData] = useState<DashboardVascular>();
  const [dataEmpresas, setDataEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalEmpresas, setIsModalEmpresas] = useState(false);

  const dataTotalPacienteConvenio = buildChart(
    data?.total_paciente_convenio ?? []
  );

  const dataTotalPacienteClinica = buildChart(
    data?.total_paciente_clinica ?? []
  );

  const dataTotalAcessoVascular = buildChart(data?.total_acesso_vascular ?? []);

  const dataTotalPacienteNefrologista = buildChart(
    data?.total_paciente_nefrologista ?? []
  );

  async function listar() {
    try {
      setIsLoading(true);
      const response = await consultarDashboardVascular();
      setData(response);
    } catch (error: any) {
      toast.error(error?.message || "Erro ao consultar dashboard");
    } finally {
      setIsLoading(false);
    }
  }

  async function listarEmpresas() {
    try {
      const response: Empresa[] = await consultarEmpresas();

      if (!response || response.length === 0) {
        toast.error("Nenhuma empresa encontrada");
        return;
      }

      if (response.length > 1) {
        setDataEmpresas(response);
        setIsModalEmpresas(true);
      } else {
        setEmpresaUsuario(response[0].nome);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Erro ao consultar empresas");
    }
  }

  useEffect(() => {
    if (!empresaUsuario) {
      listarEmpresas();
      return;
    }

    listar();
  }, [empresaUsuario]);

  return (
    <>
      <ModalEmpresas
        isOpen={isModalEmpresas}
        setIsOpen={setIsModalEmpresas}
        data={dataEmpresas}
      />

      <section className="flex justify-center sm:justify-start flex-wrap gap-4">
        <CardDashboard
          descricao="Total de Pacientes"
          titulo={String(data?.total_pacientes ?? "")}
          icon={<Users />}
          rodape="Pacientes cadastrados"
          loading={isLoading}
        />

        <CardDashboard
          descricao="Lesão > 50%"
          titulo={String(data?.total_lesao_50 ?? "")}
          icon={<Bandage />}
          rodape={`${data?.porcentagem_lesao_50 ?? 0}% do total`}
          loading={isLoading}
        />

        <CardDashboard
          descricao="Alteração Clínica"
          titulo={String(data?.total_alteracao_clinica ?? "")}
          icon={<SquareActivity />}
          rodape={`${data?.porcentagem_alteracao_clinica ?? 0}% do total`}
          loading={isLoading}
        />

        <CardDashboard
          descricao="USV Vencido"
          titulo={String(data?.total_usv_vencido ?? "")}
          icon={<TrendingUp />}
          rodape={`${data?.porcentagem_usv_vencido ?? 0}% do total`}
          loading={isLoading}
        />
      </section>

      {/* GRÁFICOS */}

      <section className="grid md:grid-cols-2 gap-4">
        {[
          {
            title: "Pacientes por Convênio",
            description: "Distribuição de pacientes por convênio médico",
            chart: dataTotalPacienteConvenio,
          },
          {
            title: "Pacientes por Clínica",
            description: "Distribuição de pacientes por clínica",
            chart: dataTotalPacienteClinica,
          },
          {
            title: "Tipos de Acesso Vascular",
            description: "Distribuição por tipo de acesso em uso",
            chart: dataTotalAcessoVascular,
          },
          {
            title: "Pacientes por Nefrologista",
            description: "Distribuição de pacientes por médico responsável",
            chart: dataTotalPacienteNefrologista,
          },
        ].map((item) => (
          <Card key={item.title} className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={item.chart.chartConfig}
                className="mx-auto aspect-square max-h-[300px]"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                  <Pie
                    data={item.chart.chartData}
                    dataKey="value"
                    nameKey="name"
                    labelLine={false}
                    label={({ payload, ...props }) => (
                      <text
                        cx={props.cx}
                        cy={props.cy}
                        x={props.x}
                        y={props.y}
                        textAnchor={props.textAnchor}
                        dominantBaseline={props.dominantBaseline}
                        fill="hsla(var(--foreground))"
                      >
                        {payload.percent}
                      </text>
                    )}
                  />

                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
