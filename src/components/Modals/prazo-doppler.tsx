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
import { consultarPrazoDoppler, editarPrazoDoppler } from "@/service/api";

type ModalPrazoDopplerProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const formSchema = z.object({
  prazo_doppler: z.coerce.number().min(1, "Insira o prazo do doppler"),
});

export type FormFieldsPrazoDoppler = z.infer<typeof formSchema>;

const defaultValoresFormulario: any = {
  prazo: null,
};

export default function ModalPrazoDoppler({
  isOpen,
  setIsOpen,
}: ModalPrazoDopplerProps) {
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValoresFormulario,
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await editarPrazoDoppler(data);
      toast.success(response.message);
      setIsOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ?? "Erro ao salvar prazo do doppler"
        );
      }
    }
  }

  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      try {
        const res = await consultarPrazoDoppler();

        form.reset({
          ...res,
          prazo_doppler: res.prazo_doppler,
        });
      } catch (error) {
        toast.error("Erro ao carregar prazo do doppler");
      }
    })();
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-3">
              <DialogTitle>Configuração do Sistema</DialogTitle>
              <DialogDescription>
                Configure o período de alerta para a data do último USV.
              </DialogDescription>
            </DialogHeader>

            <Controller
              name="prazo_doppler"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Prazo para doppler (dias){" "}
                    <span className="text-destructive">*</span>
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
