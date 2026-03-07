import { DataTable } from "@/components/DataTable";
import { useState } from "react";
import { toast } from "sonner";
import { consultarPacientes } from "@/service/api";
import type { Paciente } from "@/types/paciente";
import { Button } from "@/components/ui/button";
import ModalPaciente from "@/components/Modals/paciente";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { formatarCPF, formatarTelefone } from "@/utils/format";
import { AxiosError } from "axios";
import FiltroTable from "@/components/filtro-table";

type StatusFiltro = "Todos" | "Nome";

export default function Pacientes() {
  const [data, setData] = useState<Paciente[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [acaoModal, setAcaoModal] = useState<"criar" | "editar">("criar");
  const [itemID, setItemID] = useState(0);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("Todos");

  const columns: ColumnDef<Paciente>[] = [
    {
      accessorKey: "nome",
      header: "Nome",
    },
    {
      accessorKey: "cpf",
      header: "CPF",
      cell: ({ row }) => {
        return <span>{formatarCPF(row.original.cpf)}</span>;
      },
    },
    {
      accessorKey: "telefone",
      header: "Telefone",
      cell: ({ row }) => {
        return <span>{formatarTelefone(row.original.telefone)}</span>;
      },
    },
    {
      accessorKey: "uf",
      header: "UF",
    },
    {
      accessorKey: "municipio",
      header: "Município",
    },
    {
      accessorKey: "bairro",
      header: "Bairro",
    },
    {
      accessorKey: "rua",
      header: "Rua",
    },
    {
      accessorKey: "numero",
      header: "Número",
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
      const response = await consultarPacientes(
        busca?.toUpperCase(),
        statusFiltro?.toUpperCase()
      );
      setData(response);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ?? "Erro ao consultar paciente"
        );
      }
    }
  }

  return (
    <>
      <ModalPaciente
        isOpen={isModal}
        setIsOpen={setIsModal}
        acao={acaoModal}
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
          emptyMessage={"Nenhum paciente encontrado."}
        />
      </main>
    </>
  );
}
