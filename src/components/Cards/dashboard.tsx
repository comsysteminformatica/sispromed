import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";

type CardDashboardProps = {
  descricao: string;
  titulo: string;
  icon: ReactNode;
  rodape: string;
  loading: boolean;
};

export default function CardDashboard({
  descricao,
  titulo,
  icon,
  rodape,
  loading,
}: CardDashboardProps) {
  return (
    <>
      <Card className="w-full max-w-60 gap-2">
        <CardHeader>
          <CardDescription>{descricao}</CardDescription>
          <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl">
            {loading ? <Skeleton className="w-10 h-10" /> : titulo}
          </CardTitle>
          <CardAction>{icon}</CardAction>
        </CardHeader>
        <CardFooter className="flex px-6 [.border-t]:pt-6 flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            {loading ? <Skeleton className="w-30 h-3" /> : rodape}
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
