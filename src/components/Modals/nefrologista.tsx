import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Loader2 } from "lucide-react";

import { useEffect } from "react";
import { toast } from "sonner";
import { consultarMedico, criarMedico, editarMedico } from "@/service/api";

type ModalNefrologistaProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  acao: "criar" | "editar";
  id?: number;
  reload: () => Promise<void>;
};

const formSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres"),
  especialidade_id: z.int(),
});

export type FormFieldsNefrologista = z.infer<typeof formSchema>;

const defaultValoresFormulario: FormFieldsNefrologista = {
  nome: "",
  especialidade_id: 1,
};

export default function ModalNefrologista({
  isOpen,
  setIsOpen,
  acao,
  id,
  reload,
}: ModalNefrologistaProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValoresFormulario,
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      let response: any;

      if (acao === "criar") {
        response = await criarMedico(data);
      } else if (acao === "editar") {
        response = await editarMedico(id, data);
      }

      await reload();
      setIsOpen(false);
      toast.success(response.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ?? "Erro ao salvar nefrologista"
        );
      }
    }
  }

  useEffect(() => {
    if (!isOpen || acao === "criar") {
      form.reset(defaultValoresFormulario);
    }
  }, [isOpen, acao]);

  useEffect(() => {
    if (!isOpen || acao === "criar" || !id) return;

    (async () => {
      try {
        const res = await consultarMedico(id);

        form.reset({
          ...res,
          nome: res.nome,
        });
      } catch (error) {
        toast.error("Erro ao carregar nefrologista");
      }
    })();
  }, [isOpen, id, acao]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {acao === "criar" ? "Novo Nefrologista" : "Editar Nefrologista"}
              </DialogTitle>
              <DialogDescription>
                Insira informações do nefrologista
              </DialogDescription>
            </DialogHeader>

            <Controller
              name="nome"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Nome <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <DialogFooter className="pt-5">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
