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
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Eye, EyeClosed, Loader2 } from "lucide-react";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { consultarUsuario, criarUsuario, editarUsuario } from "@/service/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type ModalUsuarioProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  acao: "criar" | "editar";
  id?: number;
  reload: () => Promise<void>;
};

const formSchema = z
  .object({
    nome: z
      .string()
      .min(3, "O nome deve ter no mínimo 3 caracteres")
      .max(45, "O nome deve ter no máximo 50 caracteres"),
    email: z.email("Email inválido"),
    senha: z.string().optional().default(""),
    provider: z.string(),
    situacao: z.coerce.number(),
    perfil: z.coerce.number(),
  })
  .refine(
    (data) => {
      if (data.provider === "Local") {
        return data.senha.length >= 8;
      }
      return true;
    },
    {
      message: "A senha deve conter no mínimo 8 caracteres",
      path: ["senha"],
    }
  );

export type FormFieldsUsuario = z.infer<typeof formSchema>;

const defaultValoresFormulario: FormFieldsUsuario = {
  nome: "",
  senha: "",
  email: "",
  provider: "Google",
  situacao: 1,
  perfil: 2,
};

export default function ModalUsuario({
  isOpen,
  setIsOpen,
  acao,
  id,
  reload,
}: ModalUsuarioProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValoresFormulario,
  });

  const provider = form.watch("provider");

  const [isMostrarSenha, setIsMostrarSenha] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      let response: object;

      if (acao === "criar") {
        response = await criarUsuario(data);
      } else if (acao === "editar") {
        response = await editarUsuario(id, data);
      }

      await reload();
      setIsOpen(false);
      toast.success(response.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message ?? "Erro ao salvar usuário");
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
        const res = await consultarUsuario(id);

        form.reset({
          ...res,
          nome: res.nome,
          email: res.email,
          perfil: res.perfil,
          provider: res.provider,
          situacao: res.situacao,
        });
      } catch (error) {
        toast.error("Erro ao carregar usuário");
      }
    })();
  }, [isOpen, id, acao]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2"
          >
            <DialogHeader>
              <DialogTitle>
                {acao === "criar" ? "Novo Usuário" : "Editar Usuário"}
              </DialogTitle>
              <DialogDescription>
                Insira informações do usuário
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

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Email <span className="text-destructive">*</span>
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

            {provider === "Local" && (
              <Controller
                name="senha"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Senha <span className="text-destructive">*</span>
                    </FieldLabel>
                    <div className="flex gap-2 relative">
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        type={isMostrarSenha ? "text" : "password"}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => setIsMostrarSenha(!isMostrarSenha)}
                        className="absolute end-0 text-zinc-400"
                      >
                        {isMostrarSenha ? <Eye /> : <EyeClosed />}
                      </Button>
                    </div>
                    <p className="text-xs">
                      Senha não pode ser lida depois de criada
                    </p>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}

            <Controller
              name="situacao"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="situacao">
                      Situação <span className="text-destructive">*</span>
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={String(field.value)}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="situacao"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value={"1"}>Permitido</SelectItem>
                      <SelectItem value={"0"}>Bloqueado</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="perfil"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="perfil">
                      Perfil <span className="text-destructive">*</span>
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={String(field.value)}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="perfil"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value={"2"}>Usuário</SelectItem>
                      <SelectItem value={"1"}>Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="provider"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="provider">
                      Provider <span className="text-destructive">*</span>
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={String(field.value)}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="provider"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value={"Local"}>Local</SelectItem>
                      <SelectItem value={"Google"}>Google</SelectItem>
                    </SelectContent>
                  </Select>
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
