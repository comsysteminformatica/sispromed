import { DataTable } from "@/components/data-table";
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
import { MoreHorizontal, Plus } from "lucide-react";
import { formatarCPF, formatarTelefone } from "@/utils/format";
import { AxiosError } from "axios";
import BuscarTable from "@/components/buscar-table";

type StatusFiltro = "Todos" | "Nome";

export default function Pacientes() {
  const [data, setData] = useState<Paciente[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [acaoModal, setAcaoModal] = useState<"criar" | "editar">("criar");
  const [itemID, setItemID] = useState(0);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("Nome");
  const [isLoading, setIsLoading] = useState(false);

  const columns: ColumnDef<Paciente>[] = [
    {
      id: "actions",      
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setItemID(row.original.id);
                  setAcaoModal("editar");
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
    {
      accessorKey: "nome",
      header: "Nome",
    },
    {
      accessorKey: "idade",
      header: "Idade",
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
  ];

  async function listar(
    tipo: "busca" | "filtro" | "" = "",
    categoria: string = "",
    busca: string = ""
  ) {
    try {
      setIsLoading(true);
      const response = await consultarPacientes(tipo, categoria, busca);
      setData(response);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ?? "Erro ao consultar pacientes"
        );
      }
    } finally {
      setIsLoading(false);
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
              Criar novo paciente
            </Button>
          </div>
        </section>

        <DataTable
          loading={isLoading}
          columns={columns}
          data={data}
          emptyMessage={"Nenhum paciente encontrado."}
        />
      </main>
    </>
  );
}
