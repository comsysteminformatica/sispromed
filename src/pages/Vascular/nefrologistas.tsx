import { DataTable } from "@/components/data-table";
import { useState } from "react";
import { toast } from "sonner";
import { consultarMedicos } from "@/service/api";
import type { Medico } from "@/types/medico";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import BuscarTable from "@/components/buscar-table";
import ModalNefrologista from "@/components/Modals/nefrologista";
import { AxiosError } from "axios";

type StatusFiltro = "Todos" | "Nome";

export default function Nefrologistas() {
  const [data, setData] = useState<Medico[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [acaoModal, setAcaoModal] = useState<"criar" | "editar">("criar");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("Nome");
  const [busca, setBusca] = useState("");
  const [itemID, setItemID] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const columns: ColumnDef<Medico>[] = [
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
    categoria = "",
    busca = ""
  ) {
    try {
      setIsLoading(true);
      const response = await consultarMedicos(1, tipo, categoria, busca);
      setData(response);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ?? "Erro ao consultar médicos"
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <ModalNefrologista
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
              Criar novo nefrologista
            </Button>
          </div>
        </section>

        <DataTable
          loading={isLoading}
          columns={columns}
          data={data}
          emptyMessage={"Nenhum nefrologista encontrado."}
        />
      </main>
    </>
  );
}
