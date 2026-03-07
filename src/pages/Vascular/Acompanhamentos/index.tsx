import { useState } from "react";
import { consultarAcompanhamentos, excluirAcompanhamento } from "@/service/api";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import ModalAcompanhamento from "@/components/Modals/acompanhamento";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import Alerta from "@/components/alerta";
import { toast } from "sonner";
import type { Acompanhamento } from "@/types/acompanhamento";
import { AxiosError } from "axios";
import FiltroTable from "@/components/filtro-table";

type StatusFiltro =
  | "Todos"
  | "PACIENTE"
  | "CONVENIO"
  | "CLINICA"
  | "NEFROLOGISTA";

export default function Acompanhamentos() {
  const [data, setData] = useState<Acompanhamento[]>([]);
  const [busca, setBusca] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [isModalExcluir, setIsModalExcluir] = useState(false);
  const [acaoModal, setAcaoModal] = useState<"criar" | "editar" | undefined>();
  const [itemID, setItemID] = useState(0);
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("Todos");

  const columns: ColumnDef<Acompanhamento>[] = [
    { accessorKey: "paciente", header: "Paciente" },
    { accessorKey: "convenio", header: "Convênio" },
    { accessorKey: "clinica", header: "Clínica" },
    { accessorKey: "medico", header: "Nefrologista" },
    { accessorKey: "situacao_clinica", header: "Situação Clínica" },
    {
      accessorKey: "ultimo_acesso",
      header: "Último Acesso",
      cell: ({ row }) =>
        row.original.ultimo_acesso
          ? row.original.ultimo_acesso.split("-").reverse().join("/")
          : "-",
    },
    { accessorKey: "tipo_de_acesso", header: "Tipo de Acesso" },
    { accessorKey: "cateter", header: "Cateter" },
    {
      accessorKey: "ultimo_usv",
      header: "Último USV",
      cell: ({ row }) =>
        row.original.ultimo_usv
          ? row.original.ultimo_usv.split("-").reverse().join("/")
          : "-",
    },
    { accessorKey: "lesao_50", header: "Lesão 50%" },
    { accessorKey: "alteracao_clinica", header: "Alteração Clínica" },
    { accessorKey: "lesoes", header: "Lesões" },
    { accessorKey: "tratamentos", header: "Tratamentos" },
    { accessorKey: "observacoes", header: "Observações" },
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

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setItemID(row.original.id);
                  setIsModalExcluir(true);
                }}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  async function listar(busca: string = "", statusFiltro: string = "") {
    try {
      const response = await consultarAcompanhamentos(
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

  async function excluir(id: number) {
    try {
      const responseData = await excluirAcompanhamento(id);
      toast.success(responseData.message);
      await listar();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <ModalAcompanhamento
        isOpen={isModal}
        setIsOpen={setIsModal}
        id={itemID}
        acao={acaoModal}
        reload={listar}
      />

      <Alerta
        isOpen={isModalExcluir}
        setIsOpen={setIsModalExcluir}
        type="delete"
        titulo="ATENÇÃO!"
        descricao="Você tem certeza que deseja excluir este acompanhamento?"
        continuar="EXCLUIR"
        onConfirm={() => excluir(itemID)}
      />

      <main>
        <section className="flex justify-between pb-1">
          <FiltroTable
            filtros={[
              "Todos",
              "Paciente",
              "Convênio",
              "Clínica",
              "Nefrologista",
            ]}
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
          emptyMessage={"Nenhum acompanhamento encontrado."}
        />
      </main>
    </>
  );
}
