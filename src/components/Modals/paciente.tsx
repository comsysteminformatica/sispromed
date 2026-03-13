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
import {
  consultarPaciente,
  criarPaciente,
  editarPaciente,
} from "@/service/api";
import { AxiosError } from "axios";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ufs } from "@/utils/utils";
import { formatarTelefone, formatarCPF } from "@/utils/format";
import { useEffect } from "react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";

type ModalPacienteProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  acao: "criar" | "editar";
  id?: number;
  reload?: () => Promise<void> | void;
};

const formSchema = z.object({
  cpf: z.string().min(1, "CPF é obrigatório"),
  nome: z
    .string()
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(45, "O nome deve ter no máximo 45 caracteres"),
  genero: z.string().min(1, "Obrigatório"),
  data_nascimento: z.string().min(1, "Obrigatório"),
  telefone: z
    .string()
    .min(10, "O telefone deve ter no mínimo 10 caracteres")
    .max(11, "O telefone deve ter no máximo 11 caracteres"),
  uf: z.string().min(2, "Obrigatório").max(2),
  municipio: z
    .string()
    .min(3, "O município deve ter no mínimo 3 caracteres")
    .max(95, "O município deve ter no máximo 95 caracteres"),
  bairro: z
    .string()
    .min(3, "O bairro deve ter no mínimo 3 caracteres")
    .max(80, "O bairro deve ter no máximo 80 caracteres"),
  rua: z
    .string()
    .min(3, "A rua deve ter no mínimo 3 caracteres")
    .max(80, "A rua deve ter no máximo 80 caracteres"),
  numero: z
    .string()
    .min(1, "Obrigatório")
    .max(10, "O número deve ter no máximo 80 caracteres"),
  ativo: z.boolean().default(true),
});

export type FormFieldsPaciente = z.infer<typeof formSchema>;

const defaultValoresFormulario: FormFieldsPaciente = {
  cpf: "",
  nome: "",
  genero: "",
  data_nascimento: "",
  telefone: "",
  uf: "",
  municipio: "",
  bairro: "",
  rua: "",
  numero: "",
  ativo: true,
};

export default function ModalPaciente({
  isOpen,
  setIsOpen,
  acao,
  id,
  reload,
}: ModalPacienteProps) {
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValoresFormulario,
  });

  async function onSubmit(data: any) {
    try {
      let response: any;
      if (acao === "criar") {
        response = await criarPaciente(data);
      } else if (acao === "editar") {
        response = await editarPaciente(id, data);
      }
      if (reload) {
        await reload();
      }
      setIsOpen(false);
      toast.success(response.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message ?? "Erro ao salvar paciente");
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
        const res = await consultarPaciente(id);

        form.reset({
          ...res,
          cpf: res.cpf,
          nome: res.nome,
          genero: res.genero,
          data_nascimento: res.data_nascimento,
          telefone: res.telefone,
          uf: res.uf,
          bairro: res.bairro,
          municipio: res.municipio,
          rua: res.rua,
          numero: res.numero,
          ativo: res.ativo,
        });
      } catch (error) {
        toast.error("Erro ao carregar paciente");
      }
    })();
  }, [isOpen, id, acao]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-1 p-1"
          >
            <DialogHeader>
              <DialogTitle>
                {acao === "criar" ? "Novo Paciente" : "Editar Paciente"}
              </DialogTitle>
              <DialogDescription>
                Insira informações do paciente
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
              name="cpf"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    CPF <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    value={formatarCPF(field.value)}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      field.onChange(digits);
                    }}
                    maxLength={14}
                    placeholder="000.000.000-00"
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
              name="genero"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet>
                  <FieldLegend variant="label">
                    Gênero <span className="text-destructive">*</span>
                  </FieldLegend>
                  <RadioGroup
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                      className="gap-x-1"
                    >
                      <RadioGroupItem
                        value="M"
                        id="masculino"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor="masculino" className="font-normal">
                        Masculino
                      </FieldLabel>
                    </Field>
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                      className="gap-x-1"
                    >
                      <RadioGroupItem
                        value="F"
                        id="Feminino"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor="Feminino" className="font-normal">
                        Feminino
                      </FieldLabel>
                    </Field>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </RadioGroup>
                </FieldSet>
              )}
            />

            <section className="grid grid-cols-2 gap-x-2">
              <Controller
                name="data_nascimento"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Data de Nascimento{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input type="date" {...field} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="telefone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Telefone <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      value={formatarTelefone(field.value)}
                      onChange={(e) => {
                        const onlyDigits = e.target.value.replace(/\D/g, "");
                        field.onChange(onlyDigits);
                      }}
                      maxLength={15}
                      placeholder="(00) 00000-0000"
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
            </section>

            <section className="grid grid-cols-4 gap-x-2">
              <div className="col-span-1">
                <Controller
                  name="uf"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="responsive"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <FieldLabel htmlFor="form-rhf-select-language">
                          UF
                        </FieldLabel>
                      </FieldContent>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="form-rhf-select-language"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {ufs.map((uf) => (
                            <SelectItem key={uf} value={uf}>
                              {uf}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="col-span-3">
                <Controller
                  name="municipio"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Município <span className="text-destructive">*</span>
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
              </div>
            </section>

            <Controller
              name="bairro"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Bairro <span className="text-destructive">*</span>
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

            <section className="grid grid-cols-5 gap-x-2">
              <div className="col-span-4">
                <Controller
                  name="rua"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Rua <span className="text-destructive">*</span>
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
              </div>

              <Controller
                name="numero"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Número <span className="text-destructive">*</span>
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
            </section>

            <Controller
              name="ativo"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="ativo"
                  />
                  <label htmlFor="ativo" className="text-sm select-none">
                    Ativo
                  </label>
                </div>
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
