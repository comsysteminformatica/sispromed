import type { ChartConfig } from "./ui/chart";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

type ApiItem = {
  name: string;
  value: number;
  porcentagem: string;
};

export function buildChart(apiData: ApiItem[]) {
  const chartConfig: ChartConfig = {
    value: {
      label: "Total",
    },
  };

  const chartData = apiData.map((item, index) => {
    const color = CHART_COLORS[index % CHART_COLORS.length];

    chartConfig[item.name] = {
      label: item.name,
      color,
    };

    return {
      name: item.name,
      value: item.value,
      percent: item.porcentagem,
      fill: color,
    };
  });

  return { chartData, chartConfig };
}
