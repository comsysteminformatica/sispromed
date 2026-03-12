import { Calendar, Pen, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ModalTratamentoAcompanhamento from "./tratamento-acompanhamento";
import {
  consultarTratamentosAcompanhamento,
  excluirTratamentoAcompanhamento,
} from "@/service/api";
import { formatarDataISOParaBR } from "@/utils/format";

type ModalHistoricoTratamentosProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  idAcompanhamento: number;
  nomePaciente: string;
};

export default function ModalHistoricoTratamentos({
  isOpen,
  setIsOpen,
  idAcompanhamento,
  nomePaciente,
}: ModalHistoricoTratamentosProps) {
  const [tratamentos, setTratamentos] = useState([]);
  const [acaoModal, setAcaoModal] = useState("criar");
  const [isModalTratamentoAcompanhamento, setIsModalTratamentoAcompanhamento] =
    useState(false);
  const [tratamentoAcompanhamentoID, setTratamentoAcompanhamentoID] =
    useState(0);

  function criar() {
    setAcaoModal("criar");
    setIsModalTratamentoAcompanhamento(true);
  }

  async function listar() {
    const response = await consultarTratamentosAcompanhamento(idAcompanhamento);
    setTratamentos(response);
  }

  async function excluir(id: number) {
    const response = await excluirTratamentoAcompanhamento(id);
    toast.success(response.message);
    listar();
  }

  function editar(id: number) {
    setAcaoModal("editar");
    setTratamentoAcompanhamentoID(id);
    setIsModalTratamentoAcompanhamento(true);
  }

  useEffect(() => {
    if (!isOpen) return;
    listar();
  }, [isOpen]);

  return (
    <>
      <ModalTratamentoAcompanhamento
        acao={acaoModal}
        isOpen={isModalTratamentoAcompanhamento}
        setIsOpen={setIsModalTratamentoAcompanhamento}
        idAcompanhamento={idAcompanhamento}
        id={tratamentoAcompanhamentoID}
        reload={listar}
        nomePaciente={nomePaciente}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Histórico de tratamentos - {nomePaciente}</DialogTitle>
            <DialogDescription>
              Gerencie o histórico de tratamentos registrados para este
              paciente.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={criar}>
            <Plus /> Adicionar tratamento
          </Button>

          {tratamentos.map((item) => (
            <Card className="w-full">
              <CardHeader>
                <CardDescription className="flex gap-x-1">
                  <Calendar size={20} />
                  {formatarDataISOParaBR(item.data)}
                </CardDescription>
                <CardTitle>{item.nome}</CardTitle>
                <CardDescription>{item.observacao}</CardDescription>
                <CardAction>
                  <Button variant={"ghost"} onClick={() => editar(item.id)}>
                    <Pen className="text-muted-foreground" />
                  </Button>
                  <Button variant={"ghost"} onClick={() => excluir(item.id)}>
                    <Trash2 className="text-destructive" />
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
