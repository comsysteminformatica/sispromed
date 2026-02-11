import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface ModalCalendarioProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  data?: any;
  isEditar?: boolean;
}

export default function ModalCalendario({
  isOpen,
  setIsOpen,
  isEditar,
  data,
}: ModalCalendarioProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:w-96">
        <DialogHeader>
          <DialogTitle>
            {isEditar ? data?.title : "Adicionar Evento"}
          </DialogTitle>
          {isEditar && <DialogDescription>{data?.desc}</DialogDescription>}
        </DialogHeader>
        <section className="flex flex-col gap-2">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" type="text" />
          </div>

          <div>
            <Label htmlFor="desc">Descrição</Label>
            <Input id="desc" type="text" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="start">Início</Label>
              <Input id="start" type="datetime-local" />
            </div>
            <div>
              <Label htmlFor="end">Fim</Label>
              <Input id="end" type="datetime-local" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3">
              <Label htmlFor="tipo">Tipo</Label>
              <Input id="tipo" type="text" />
            </div>
            <div className="col-span-1">
              <Label htmlFor="color">Cor</Label>
              <Input id="color" type="color" />
            </div>
          </div>

          {/*
          <p>Início: {data?.start?.toLocaleString()}</p>
          <p>Fim: {data?.end?.toLocaleString()}</p>
          */}
        </section>
      </DialogContent>
    </Dialog>
  );
}
