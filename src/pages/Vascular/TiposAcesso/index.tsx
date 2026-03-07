import { DataTable } from "@/components/DataTable";
import { useState } from "react";
import { toast } from "sonner";
import { consultarTiposAcessos } from "@/service/api";
import type { Medico } from "@/types/medico";
import type { ColumnDef } from "@tanstack/react-table";
import type { TipoAcesso } from "@/types/tipoAcesso";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import FiltroTable from "@/components/filtro-table";
import ModalTipoAcesso from "@/components/Modals/tipo-acesso";

type StatusFiltro = "Todos" | "Nome";

export default function TiposAcesso() {
  const [data, setData] = useState<Medico[]>([]);
  const [busca, setBusca] = useState("");
  const [acaoModal, setAcaoModal] = useState<"criar" | "editar">("criar");
  const [isModal, setIsModal] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("Todos");
  const [itemID, setItemID] = useState(0);

  const columns: ColumnDef<TipoAcesso>[] = [
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

  async function listar(busca: string = "", statusFiltro: string = "") {
    try {
      const response = await consultarTiposAcessos(
        busca?.toUpperCase(),
        statusFiltro?.toUpperCase()
      );
      setData(response);
    } catch (error) {
      toast.error(error?.message);
    }
  }

  return (
    <>
      <ModalTipoAcesso
        acao={acaoModal}
        isOpen={isModal}
        setIsOpen={setIsModal}
        reload={listar}
        id={itemID}
      />
      <main>
        <section className="flex justify-between pb-1">
          <FiltroTable
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
              Adicionar
            </Button>
          </div>
        </section>

        <DataTable
          columns={columns}
          data={data}
          emptyMessage={"Nenhum tipo de acesso encontrado."}
        />
      </main>
    </>
  );
}
