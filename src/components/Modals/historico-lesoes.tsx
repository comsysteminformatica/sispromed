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
import {
  consultarLesoesAcompanhamento,
  excluirLesaoAcompanhamento,
} from "@/service/api";
import ModalLesaoAcompanhamento from "./lesao-acompanhamento";
import { toast } from "sonner";
import { formatarDataISOParaBR } from "@/utils/format";
import type { Lesao } from "@/types/lesao";

type ModalHistoricoLesoesProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  idAcompanhamento: number;
  nomePaciente: string;
};

export default function ModalHistoricoLesoes({
  isOpen,
  setIsOpen,
  idAcompanhamento,
  nomePaciente,
}: ModalHistoricoLesoesProps) {
  const [lesoes, setLesoes] = useState([]);
  const [acaoModal, setAcaoModal] = useState("criar");
  const [isModalLesaoAcompanhamento, setIsModalLesaoAcompanhamento] =
    useState(false);
  const [lesaoAcompanhamentoID, setLesaoAcompanhamentoID] = useState(0);

  function criar() {
    setAcaoModal("criar");
    setIsModalLesaoAcompanhamento(true);
  }

  async function listar() {
    const response = await consultarLesoesAcompanhamento(idAcompanhamento);
    setLesoes(response);
  }

  async function excluir(id: number) {
    const response = await excluirLesaoAcompanhamento(id);
    toast.success(response.message);
    listar();
  }

  function editar(id: number) {
    setAcaoModal("editar");
    setLesaoAcompanhamentoID(id);
    setIsModalLesaoAcompanhamento(true);
  }

  useEffect(() => {
    if (!isOpen) return;
    listar();
  }, [isOpen]);

  return (
    <>
      <ModalLesaoAcompanhamento
        acao={acaoModal}
        isOpen={isModalLesaoAcompanhamento}
        setIsOpen={setIsModalLesaoAcompanhamento}
        idAcompanhamento={idAcompanhamento}
        id={lesaoAcompanhamentoID}
        reload={listar}
        nomePaciente={nomePaciente}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Histórico de lesões - {nomePaciente}</DialogTitle>
            <DialogDescription>
              Gerencie o histórico de lesões registradas para este paciente.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={criar}>
            <Plus /> Adicionar Lesão
          </Button>

          {lesoes.map((item: Lesao) => (
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
