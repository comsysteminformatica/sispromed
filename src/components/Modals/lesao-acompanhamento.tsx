import z from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { FormAsyncSelect } from "./acompanhamento";
import {
  consultarLesaoAcompanhamento,
  consultarLesoes,
  criarLesaoAcompanhamento,
  editarLesaoAcompanhamento,
} from "@/service/api";
import { Input } from "../ui/input";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { formatarDataTimezoneParaISO } from "@/utils/format";

type ModalLesaoAcompanhamentoProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  id?: number;
  idAcompanhamento: number;
  acao: string;
  reload: () => Promise<void>;
  nomePaciente: string;
};

const formSchema = z.object({
  data: z.string().min(1, "Obrigatório"),
  lesao_id: z
    .number()
    .nullable()
    .refine((v) => v !== null, "Obrigatório"),
  observacao: z.string().optional().nullable(),
});

export type FormFieldsLesaoAcompanhamento = z.infer<typeof formSchema>;

const defaultValoresFormulario: any = {
  data: formatarDataTimezoneParaISO(new Date()),
  lesao_id: null,
  observacao: "",
};

export default function ModalLesaoAcompanhamento({
  isOpen,
  setIsOpen,
  id,
  idAcompanhamento,
  acao,
  reload,
  nomePaciente
}: ModalLesaoAcompanhamentoProps) {
  const [initialRecord, setInitialRecord] = useState<any>(null);

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValoresFormulario,
  });

  async function onSubmit(data: any) {
    try {
      let response: any;

      if (acao === "criar") {
        response = await criarLesaoAcompanhamento(idAcompanhamento, data);
      } else if (acao === "editar") {
        response = await editarLesaoAcompanhamento(id, data);
      }

      await reload();
      setIsOpen(false);
      toast.success(response.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ??
            "Erro ao gravar a lesão do acompanhamento"
        );
      }
    }
  }

  useEffect(() => {
    if (!isOpen || acao === "criar") {
      form.reset(defaultValoresFormulario);
      setInitialRecord(null);
    }
  }, [isOpen, acao]);

  useEffect(() => {
    if (!isOpen || acao === "criar" || !id) return;

    (async () => {
      try {
        const res = await consultarLesaoAcompanhamento(id);

        setInitialRecord(res);

        form.reset({
          ...res,
          data: res.data,
          lesao_id: res.lesao?.id ?? null,
          observacao: res.observacao ?? null,
        });
      } catch (error) {
        toast.error("Erro ao carregar convênio");
      }
    })();
  }, [isOpen, id, acao]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-3">
              <DialogTitle>Adicionar lesão - {nomePaciente}</DialogTitle>
              <DialogDescription>
                Registre uma nova lesão para o acompanhamento
              </DialogDescription>
            </DialogHeader>
            <Controller
              name="data"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Data <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input type="date"  max="2999-12-31" {...field} />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="lesao_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Lesões <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FormAsyncSelect
                    placeholder="Buscar lesões..."
                    value={field.value}
                    onChange={field.onChange}
                    fetchFn={consultarLesoes}
                    initialData={initialRecord?.lesao}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="observacao"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Observação</FieldLabel>
                  <Textarea {...field} />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <DialogFooter className="mt-3">
              <DialogClose asChild>
                <Button type="button" variant={"outline"}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
