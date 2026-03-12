import { DataTable } from "@/components/data-table";
import ModalUsuario from "@/components/Modals/usuario";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { consultarUsuarios } from "@/service/api";
import type { AxiosError } from "axios";
import { MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Usuarios() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  const [isModal, setIsModal] = useState(false);
  const [itemID, setItemID] = useState(0);
  const [acaoModal, setAcaoModal] = useState<"criar" | "editar">("criar");

  const columns = [
    {
      accessorKey: "nome",
      header: "Nome",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "situacao",
      header: "Situação",
      cell: ({ row }) => {
        const variant =
          row.original.situacao === "Permitido" ? "success" : "destructive";

        return (
          <div>
            <Badge variant={variant} className={`px-2 py-1 rounded-md`}>
              {row.original.situacao}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "perfil",
      header: "Perfil",
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

  async function listar() {
    try {
      setIsLoading(true);
      const response = await consultarUsuarios();
      setUsuarios(response);
    } catch (error) {
      if (error as AxiosError) {
        if (
          error?.response?.data?.message ===
          "Você não tem permissão para essa operação"
        ) {
          throw navigate("/vascular/dashboard");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    listar();
  }, []);

  return (
    <>
      <ModalUsuario
        isOpen={isModal}
        setIsOpen={setIsModal}
        reload={listar}
        acao={acaoModal}
        id={itemID}
      />

      <main>
        <section className="flex justify-end pb-1">
          <Button
            onClick={() => {
              setAcaoModal("criar");
              setIsModal(true);
            }}
          >
            <Plus />
            Criar novo usuário
          </Button>
        </section>
        <DataTable
          emptyMessage={"Nenhum usuário encontrado"}
          loading={isLoading}
          data={usuarios}
          columns={columns}
        />
      </main>
    </>
  );
}
