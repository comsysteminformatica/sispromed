import { useState } from "react";
import { consultarAcompanhamentos, excluirAcompanhamento } from "@/service/api";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import ModalAcompanhamento from "@/components/Modals/acompanhamento";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Settings } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import Alerta from "@/components/alerta";
import { toast } from "sonner";
import type { Acompanhamento } from "@/types/acompanhamento";
import { AxiosError } from "axios";
import BuscarTable from "@/components/buscar-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ModalHistoricoLesoes from "@/components/Modals/historico-lesoes";
import ModalHistoricoTratamentos from "@/components/Modals/historico-tratamentos";
import { Badge } from "@/components/ui/badge";
import FiltrarTable from "@/components/filtrar-table";
import { formatarDataISOParaBR } from "@/utils/format";

type StatusBusca =
  | "Todos"
  | "Paciente"
  | "Convenio"
  | "Clinica"
  | "Nefrologista"
  | "Cateter";

export default function Acompanhamentos() {
  const [data, setData] = useState<Acompanhamento[]>([]);
  const [busca, setBusca] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [isModalExcluir, setIsModalExcluir] = useState(false);

  const [isModalHistoricoLesoes, setIsModalHistoricoLesoes] = useState(false);
  const [isModalHistoricoTratamentos, setIsModalHistoricoTratamentos] =
    useState(false);

  const [nomePaciente, setNomePaciente] = useState("");

  const [acaoModal, setAcaoModal] = useState<"criar" | "editar" | undefined>();
  const [itemID, setItemID] = useState(0);
  const [statusBusca, setStatusBusca] = useState<StatusBusca>("Paciente");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const columns: ColumnDef<Acompanhamento>[] = [
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
    { accessorKey: "paciente", header: "Paciente" },
    {
      accessorKey: "idade",
      header: "Idade",
      cell: ({ row }) => {
        return (
          <div className="flex justify-self-center">{row.original.idade}</div>
        );
      },
    },
    {
      accessorKey: "convenio",
      header: () => <div className="w-30">Convênio</div>,
      cell: ({ row }) => {
        const convenio = row.getValue("convenio") as string;

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-30 wrap-break-words truncate cursor-default">
                {convenio}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{convenio}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "clinica",
      header: () => <div className="w-30">Clínica</div>,
      cell: ({ row }) => {
        const clinica = row.getValue("clinica") as string;

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-30 wrap-break-words truncate cursor-default">
                {clinica}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{clinica}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "medico",
      header: () => <div className="w-20">Nefrologista</div>,
      cell: ({ row }) => {
        const medico = row.getValue("medico") as string;

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-20 wrap-break-words truncate cursor-default">
                {medico}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{medico}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    { accessorKey: "situacao_clinica", header: "Situação Clínica" },
    {
      accessorKey: "ultimo_acesso",
      header: "Último Acesso",
      cell: ({ row }) =>
        row.original.ultimo_acesso
          ? formatarDataISOParaBR(row.original.ultimo_acesso)
          : "-",
    },
    { accessorKey: "tipo_de_acesso", header: "Tipo de Acesso" },
    { accessorKey: "cateter", header: "Cateter" },
    {
      accessorKey: "ultimo_usv",
      header: "Último USV",
      cell: ({ row }) => {
        const variant = row.original.prazo_doppler_vencido
          ? "destructive"
          : "outline";

        return (
          <div>
            <Badge variant={variant} className={`px-2 py-1 rounded-md`}>
              {row.original.ultimo_usv
                ? formatarDataISOParaBR(row.original.ultimo_usv)
                : "-"}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "lesao_50",
      header: "Lesão 50%",
      cell: ({ row }) => {
        const variant =
          row.original.lesao_50 === "Sim" ? "destructive" : "outline";

        return (
          <div>
            <Badge
              variant={variant}
              className={`flex justify-self-center px-2 py-1 rounded-md`}
            >
              {row.original.lesao_50}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "alteracao_clinica",
      header: "Alteração Clínica",
      cell: ({ row }) => {
        const variant =
          row.original.alteracao_clinica === "Sim" ? "destructive" : "outline";

        return (
          <div>
            <Badge
              variant={variant}
              className={`flex justify-self-center px-2 py-1 rounded-md`}
            >
              {row.original.alteracao_clinica}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "lesoes",
      header: "Lesões",
      cell: ({ row }) => {
        return (
          <Button
            variant="link"
            className="tabular-nums p-0"
            onClick={() => {
              setIsModalHistoricoLesoes(true);
              setItemID(row.original.id);
              setNomePaciente(row.original.paciente);
            }}
          >
            Histórico ({row.original.qtd_lesoes_acompanhamento})
          </Button>
        );
      },
    },
    {
      accessorKey: "tratamentos",
      header: "Tratamentos",
      cell: ({ row }) => {
        return (
          <Button
            variant="link"
            className="tabular-nums p-0"
            onClick={() => {
              setIsModalHistoricoTratamentos(true);
              setItemID(row.original.id);
              setNomePaciente(row.original.paciente);
            }}
          >
            Histórico ({row.original.qtd_tratamentos_acompanhamento})
          </Button>
        );
      },
    },
    { accessorKey: "observacao", header: "Observação" },
  ];

  async function listar(
    tipo: "busca" | "filtro" | "" = "",
    categoria: string = "",
    busca: string = ""
  ) {
    try {
      setIsLoading(true);
      const response = await consultarAcompanhamentos(tipo, categoria, busca);
      setData(response);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ?? "Erro ao consultar paciente"
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function excluir(id: number) {
    try {
      const responseData = await excluirAcompanhamento(id);
      toast.success(responseData?.message);
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

      <ModalHistoricoLesoes
        isOpen={isModalHistoricoLesoes}
        setIsOpen={() => {
          setIsModalHistoricoLesoes(false);
          listar();
        }}
        idAcompanhamento={itemID}
        nomePaciente={nomePaciente}
      />

      <ModalHistoricoTratamentos
        isOpen={isModalHistoricoTratamentos}
        setIsOpen={() => {
          setIsModalHistoricoTratamentos(false);
          listar();
        }}
        idAcompanhamento={itemID}
        nomePaciente={nomePaciente}
      />

      <main>
        <section className="flex justify-between flex-wrap gap-2 pb-1">
          <div className="flex flex-wrap gap-2">
            <BuscarTable
              filtros={[
                "Todos",
                "Paciente",
                "Convênio",
                "Clínica",
                "Nefrologista",
                "Cateter",
              ]}
              busca={busca}
              setBusca={setBusca}
              statusFiltro={statusBusca}
              setStatusFiltro={setStatusBusca}
              listar={listar}
            />
            <FiltrarTable
              filtros={["Todos", "USV Vencido"]}
              listar={listar}
              statusFiltro={categoriaFiltro}
              setStatusFiltro={setCategoriaFiltro}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setAcaoModal("criar");
                setIsModal(true);
              }}
            >
              <Plus />
              Criar novo acompanhamento
            </Button>
          </div>
        </section>
        <DataTable
          columns={columns}
          data={data}
          emptyMessage={"Nenhum acompanhamento encontrado."}
          loading={isLoading}
        />
      </main>
    </>
  );
}
