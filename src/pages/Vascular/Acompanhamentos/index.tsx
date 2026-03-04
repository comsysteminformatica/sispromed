import { useEffect, useState } from "react";
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
import { ChevronDown, MoreHorizontal } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import Alerta from "@/components/alerta";
import { toast } from "sonner";
import type { Acompanhamento } from "@/types/acompanhamento";
import Cabecalho from "@/components/cabecalho";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/utils/utils";

type StatusFiltro =
  | "TODOS"
  | "PACIENTE"
  | "CONVENIO"
  | "CLINICA"
  | "NEFROLOGISTA";

export default function Acompanhamentos() {
  const [data, setData] = useState<Acompanhamento[]>([]);
  const [busca, setBusca] = useState("");
  const debouncedBusca = useDebounce(busca, 500);
  const [isModal, setIsModal] = useState(false);
  const [isModalExcluir, setIsModalExcluir] = useState(false);
  const [acaoModal, setAcaoModal] = useState<"criar" | "editar" | undefined>();
  const [itemID, setItemID] = useState(0);
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("TODOS");

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

  async function listar() {
    const response = await consultarAcompanhamentos(statusFiltro, busca);
    setData(response);
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

  useEffect(() => {
    if (busca && statusFiltro !== "TODOS" || !busca && statusFiltro === "TODOS") {
      listar();
    }
  }, [debouncedBusca, statusFiltro]);

  return (
    <>
      <Cabecalho />
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
      <main className="flex">
        <section className="flex-1 px-4">
          <div className="flex pt-3 pb-2 justify-between">
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {statusFiltro === "TODOS" ? "Filtrar por" : statusFiltro}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(
                    [
                      "TODOS",
                      "PACIENTE",
                      "CONVENIO",
                      "CLINICA",
                      "NEFROLOGISTA",
                    ] as StatusFiltro[]
                  ).map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => setStatusFiltro(status)}
                    >
                      {status === "TODOS" ? "Todos os campos" : status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                placeholder="Buscar..."
                className="w-100"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
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
          </div>

          <DataTable
            columns={columns}
            data={data}
            emptyMessage={"Nenhum acompanhamento encontrado."}
          />
        </section>
      </main>
    </>
  );
}
