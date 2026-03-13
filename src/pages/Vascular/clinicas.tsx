import { DataTable } from "@/components/data-table";
import { useState } from "react";
import { toast } from "sonner";
import { consultarClinicas } from "@/service/api";
import type { Clinica } from "@/types/clinica";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import BuscarTable from "@/components/buscar-table";
import ModalClinica from "@/components/Modals/clinica";
import { AxiosError } from "axios";

type StatusFiltro = "Todos" | "Nome";

export default function Clinicas() {
  const [data, setData] = useState<Clinica[]>([]);
  const [busca, setBusca] = useState("");
  const [acaoModal, setAcaoModal] = useState<"criar" | "editar">("criar");
  const [isModal, setIsModal] = useState(false);
  const [itemID, setItemID] = useState(0);
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("Nome");
  const [isLoading, setIsLoading] = useState(false);

  const columns: ColumnDef<Clinica>[] = [
    {
      accessorKey: "nome",
      header: "Nome",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 flex justify-self-end"
              >
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setAcaoModal("editar");
                  setItemID(row.original.id);
                  setIsModal(true);
                }}
              >
                Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  async function listar(
    tipo: "busca" | "filtro" | "" = "",
    categoria: string = "",
    busca: string = ""
  ) {
    try {
      setIsLoading(true);
      const response = await consultarClinicas(tipo, categoria, busca);
      setData(response);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ?? "Erro ao consultar clínicas"
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <ModalClinica
        acao={acaoModal}
        isOpen={isModal}
        setIsOpen={setIsModal}
        reload={listar}
        id={itemID}
      />

      <main>
        <section className="flex justify-between flex-wrap gap-2 pb-1">
          <BuscarTable
            filtros={["Todos", "Nome"]}
            busca={busca}
            setBusca={setBusca}
            statusFiltro={statusFiltro}
            setStatusFiltro={setStatusFiltro}
            listar={listar}
          />
          <div>
            <Button
              onClick={() => {
                setAcaoModal("criar");
                setIsModal(true);
              }}
            >
              <Plus />
              Criar nova clínica
            </Button>
          </div>
        </section>

        <DataTable
          loading={isLoading}
          columns={columns}
          data={data}
          emptyMessage={"Nenhuma clínica encontrada."}
        />
      </main>
    </>
  );
}
