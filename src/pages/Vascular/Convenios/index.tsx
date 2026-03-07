import { DataTable } from "@/components/DataTable";
import type { Convenio } from "@/types/convenio";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { consultarConvenios } from "@/service/api";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import FiltroTable from "@/components/filtro-table";
import ModalConvenio from "@/components/Modals/convenio";

type StatusFiltro = "Todos" | "Nome";

export default function Convenios() {
  const [data, setData] = useState<Convenio[]>([]);
  const [busca, setBusca] = useState("");
  const [acaoModal, setAcaoModal] = useState<"criar" | "editar">("criar");
  const [itemID, setItemID] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("Todos");

  const columns: ColumnDef<Convenio>[] = [
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
      const response = await consultarConvenios(
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
      <ModalConvenio
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
          emptyMessage={"Nenhum convênio encontrado."}
        />
      </main>
    </>
  );
}
