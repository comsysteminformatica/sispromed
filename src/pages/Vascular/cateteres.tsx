import { DataTable } from "@/components/data-table";
import { useState } from "react";
import { toast } from "sonner";
import { consultarCateteres } from "@/service/api";
import type { Cateter } from "@/types/cateter";
import BuscarTable from "@/components/buscar-table";
import type { ColumnDef } from "@tanstack/react-table";
import { AxiosError } from "axios";

type StatusFiltro = "Todos" | "Tipo" | "Marca";

export default function Cateteres() {
  const [data, setData] = useState<Cateter[]>([]);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("Todos");
  const [isLoading, setIsLoading] = useState(false);

  const columns: ColumnDef<Cateter>[] = [
    {
      accessorKey: "tipo",
      header: "Tipo",
    },
    {
      accessorKey: "marca",
      header: "Marca",
    },
  ];

  async function listar(
    tipo: "busca" | "filtro" | "" = "",
    categoria: string = "",
    busca: string = ""
  ) {
    try {
      setIsLoading(true);
      const response = await consultarCateteres(tipo, categoria, busca);
      setData(response);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ?? "Erro ao consultar cateteres"
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <main>
        <section className="pb-1">
          <BuscarTable
            filtros={["Todos", "Tipo", "Marca"]}
            busca={busca}
            setBusca={setBusca}
            statusFiltro={statusFiltro}
            setStatusFiltro={setStatusFiltro}
            listar={listar}
          />
        </section>

        <DataTable
          loading={isLoading}
          columns={columns}
          data={data}
          emptyMessage={"Nenhum cateter encontrado."}
        />
      </main>
    </>
  );
}
