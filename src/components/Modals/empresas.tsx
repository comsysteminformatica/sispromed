import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogHeader,
} from "../ui/dialog";

import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { escolherEmpresa } from "@/service/api";
import useGlobalState from "@/state/useGlobalState";
import { toast } from "sonner";

type Empresa = {
  id: number;
  nome: string;
  perfil: string;
};

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  data: Empresa[];
};

export default function ModalEmpresas({ isOpen, setIsOpen, data }: Props) {
  const setEmpresaUsuario = useGlobalState((state) => state.setEmpresaUsuario);

  async function selecionarEmpresa(item: Empresa) {
    try {
      await escolherEmpresa(item.id);

      setEmpresaUsuario(item.nome);
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Erro ao escolher empresa");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Empresas</DialogTitle>
          <DialogDescription>
            Escolha com qual empresa deseja entrar
          </DialogDescription>
        </DialogHeader>

        {data?.map((item) => (
          <Card
            key={item.id}
            className="w-full gap-2 cursor-pointer hover:bg-muted transition-colors"
            onClick={() => selecionarEmpresa(item)}
          >
            <CardHeader>
              <CardDescription>{item.perfil}</CardDescription>
              <CardTitle>{item.nome}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </DialogContent>
    </Dialog>
  );
}
