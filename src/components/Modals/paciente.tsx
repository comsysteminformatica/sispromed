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
import { z, type fromJSONSchema } from "zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  consultarPaciente,
  criarPaciente,
  editarPaciente,
} from "@/service/api";
import { AxiosError } from "axios";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ufs } from "@/utils";

type ModalPacienteProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  acao: "criar" | "editar";
  id?: number;
  reload: () => Promise<void>;
};

const formSchema = z.object({
  cpf: z
    .string({
      required_error: "CPF é obrigatório.",
    })
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, "");
      return replacedDoc.length >= 11;
    }, "CPF deve conter no mínimo 11 caracteres.")
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, "");
      return replacedDoc.length <= 11;
    }, "CPF deve conter no máximo 11 caracteres.")
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, "");
      return !!Number(replacedDoc);
    }, "CPF deve conter apenas números."),
  nome: z.string().min(1, "Obrigatório").max(45),
  telefone: z.string().min(10).max(10),
  uf: z.string().min(2).max(2),
  municipio: z.string().min(3).max(95),
  bairro: z.string().min(3).max(30),
  rua: z.string().min(3).max(80),
  numero: z.string().min(1).max(10),
});

export type FormFieldsPaciente = z.infer<typeof formSchema>;

export default function ModalPaciente({
  isOpen,
  setIsOpen,
  acao,
  id,
  reload,
}: ModalPacienteProps) {
  // const {
  //   register,
  //   handleSubmit,
  //   setError,
  //   formState: { errors, isSubmitting },
  //   reset,
  // } = useForm<FormFieldsPaciente>({
  //   resolver: zodResolver(schema),
  // });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpf: "",
      nome: "",
      telefone: "",
      uf: "",
      municipio: "",
      bairro: "",
      rua: "",
      numero: "",
    },
  });
  // const defaultValoresFormulario: FormFieldsPaciente = {
  //   cpf: "",
  //   nome: "",
  //   telefone: "",
  // };

  const onSubmit: SubmitHandler<FormFieldsPaciente> = async (data) => {
    try {
      const { cpf, nome, telefone, uf, municipio, bairro, rua, numero } = data;

      console.log(data);

      if (acao === "criar") {
        await criarPaciente(data);
      } else if (acao === "editar") {
        await editarPaciente(id, data);
      }

      await reload();
      setIsOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          message:
            error.response?.data?.message ?? "Erro ao cadastrar paciente",
        });
      }
    }
  };

  // useEffect(() => {
  //   if (acao === "editar" && id) {
  //     consultarPaciente(id);
  //     reset.defaultValoresFormulario;
  //   }
  // }, [acao, id, reset]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {acao === "criar" ? "Novo Paciente" : "Editar Paciente"}
              </DialogTitle>
              <DialogDescription>
                Insira informações do paciente
              </DialogDescription>
            </DialogHeader>

            {/* <Controller name="cpf" control={} /> */}

            <Field>
              <FieldLabel htmlFor="cpf">
                CPF <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...register("cpf")} id="cpf" />
              {errors.cpf && (
                <p className="text-destructive text-sm">{errors.cpf.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="nome">
                Nome <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...register("nome")} id="nome" />
              {errors.nome && (
                <p className="text-destructive text-sm">
                  {errors.nome.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="telefone">
                Telefone <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...register("telefone")} id="telefone" />
              {errors.telefone && (
                <p className="text-destructive text-sm">
                  {errors.telefone.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel>
                UF <span className="text-destructive">*</span>
              </FieldLabel>
              <Select>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Estados</SelectLabel>
                    {ufs.map((uf) => (
                      <SelectItem value={uf}>{uf}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.uf && (
                <p className="text-destructive text-sm">{errors.uf.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="municipio">
                Município <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...register("municipio")} id="municipio" />
              {errors.municipio && (
                <p className="text-destructive text-sm">
                  {errors.municipio.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="bairro">
                Bairro <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...register("bairro")} id="bairro" />
              {errors.bairro && (
                <p className="text-destructive text-sm">
                  {errors.bairro.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="rua">
                Rua <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...register("rua")} id="rua" />
              {errors.rua && (
                <p className="text-destructive text-sm">{errors.rua.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="numero">
                Número <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...register("numero")} id="numero" />
              {errors.numero && (
                <p className="text-destructive text-sm">
                  {errors.numero.message}
                </p>
              )}
            </Field>

            {errors.root && (
              <p className="text-destructive text-sm">{errors.root.message}</p>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
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
