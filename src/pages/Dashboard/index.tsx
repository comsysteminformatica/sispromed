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
import { consultarDashboardVascular } from "@/service/api";
import { useEffect, useState } from "react";
import type { DashboardVascular } from "@/types/dashboardVascular";
import { buildChart } from "@/components/buildChart";

export default function Dashboard() {
  const [data, setData] = useState<DashboardVascular>();
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true)
      const response = await consultarDashboardVascular();
      setData(response);
    } catch (error) {
      toast.error(error?.message || "Erro ao consultar dashboard");
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    listar();
  }, []);

  return (
    <>
      <section className="flex justify-center sm:justify-start flex-wrap gap-4">
        <CardDashboard
          descricao="Total de Pacientes"
          titulo={String(data?.total_pacientes) || ""}
          icon={<Users />}
          rodape="Pacientes cadastrados"
          loading={isLoading}
        />
        <CardDashboard
          descricao="Lesão > 50%"
          titulo={String(data?.total_lesao_50) || ""}
          icon={<Bandage />}
          rodape={`${data?.porcentagem_lesao_50} do total`}
          loading={isLoading}
        />
        <CardDashboard
          descricao="Alteração Clínica"
          titulo={String(data?.total_alteracao_clinica) || ""}
          icon={<SquareActivity />}
          rodape={`${data?.porcentagem_alteracao_clinica} do total`}
          loading={isLoading}
        />
        <CardDashboard
          descricao="USV Vencido"
          titulo={String(data?.total_usv_vencido) || ""}
          icon={<TrendingUp />}
          rodape={`${data?.porcentagem_usv_vencido} do total`}
          loading={isLoading}
        />
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Pacientes por Convênio</CardTitle>
            <CardDescription>
              Distribuição de pacientes por convênio médico
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={dataTotalPacienteConvenio.chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={dataTotalPacienteConvenio.chartData}
                  dataKey="value"
                  nameKey="name"
                  labelLine={false}
                  label={({ payload, ...props }) => {
                    return (
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
                    );
                  }}
                />
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                  className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Pacientes por Clínica</CardTitle>
            <CardDescription>
              Distribuição de pacientes por clínica
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={dataTotalPacienteClinica.chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={dataTotalPacienteClinica.chartData}
                  dataKey="value"
                  nameKey="name"
                  labelLine={false}
                  label={({ payload, ...props }) => {
                    return (
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
                    );
                  }}
                />
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                  className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Tipos de Acesso Vascular</CardTitle>
            <CardDescription>
              Distribuição por tipo de acesso em uso
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={dataTotalAcessoVascular.chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={dataTotalAcessoVascular.chartData}
                  dataKey="value"
                  nameKey="name"
                  labelLine={false}
                  label={({ payload, ...props }) => {
                    return (
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
                    );
                  }}
                />
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                  className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Pacientes por Nefrologista</CardTitle>
            <CardDescription>
              Distribuição de pacientes por médico responsável
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={dataTotalPacienteNefrologista.chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={dataTotalPacienteNefrologista.chartData}
                  dataKey="value"
                  nameKey="name"
                  labelLine={false}
                  label={({ payload, ...props }) => {
                    return (
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
                    );
                  }}
                />
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                  className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
