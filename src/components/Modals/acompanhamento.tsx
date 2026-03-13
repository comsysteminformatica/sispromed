import { useState, useEffect, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import AsyncSelect from "react-select/async";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import {
  consultarAcompanhamento,
  consultarCateteres,
  consultarClinicas,
  consultarConvenios,
  consultarMedicos,
  consultarPacientes,
  consultarTiposAcessos,
  criarAcompanhamento,
  editarAcompanhamento,
} from "@/service/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface OpcaoSelect {
  id: number;
  nome?: string;
  tipo?: string;
  [key: string]: any;
}

export interface ModalAcompanhamentoProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  acao?: "criar" | "editar";
  id?: number | null;
  reload: () => Promise<void>;
}

const formSchema = z.object({
  paciente_id: z
    .number()
    .nullable()
    .refine((v) => v !== null, "Obrigatório"),
  convenio_id: z
    .number()
    .nullable()
    .refine((v) => v !== null, "Obrigatório"),
  clinica_id: z
    .number()
    .nullable()
    .refine((v) => v !== null, "Obrigatório"),
  medico_id: z
    .number()
    .nullable()
    .refine((v) => v !== null, "Obrigatório"),
  tipo_acesso_id: z
    .number()
    .nullable()
    .refine((v) => v !== null, "Obrigatório"),
  cateter_id: z
    .number()
    .nullable()
    .refine((v) => v !== null, "Obrigatório"),
  situacao_clinica: z.string().min(1, "Obrigatório"),
  ultimo_acesso: z.string().min(1, "Obrigatório"),
  ultimo_usv: z.string().min(1, "Obrigatório"),
  lesao_50: z.boolean().default(false),
  alteracao_clinica: z.boolean().default(false),
  observacao: z.string().optional(),
});

export type FormFieldsAcompanhamento = z.infer<typeof formSchema>;

const defaultValoresFormulario: any = {
  paciente_id: null,
  convenio_id: null,
  clinica_id: null,
  medico_id: null,
  tipo_acesso_id: null,
  cateter_id: null,
  lesao_50: false,
  alteracao_clinica: false,
  situacao_clinica: "",
  ultimo_acesso: "",
  ultimo_usv: "",
  observacao: "",
};

export default function ModalAcompanhamento({
  isOpen,
  setIsOpen,
  acao = "criar",
  id,
  reload,
}: ModalAcompanhamentoProps) {
  const [initialRecord, setInitialRecord] = useState<any>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValoresFormulario,
  });

  const {
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (!isOpen || acao === "criar") {
      form.reset(defaultValoresFormulario);
      setInitialRecord(null);
    }
  }, [isOpen, acao, form]);

  useEffect(() => {
    if (!isOpen || acao === "criar" || !id) return;

    let isMounted = true;

    (async () => {
      try {
        const res = await consultarAcompanhamento(id);

        if (!isMounted) return;

        setInitialRecord(res);

        form.reset({
          ...res,
          paciente_id: res.paciente?.id ?? null,
          convenio_id: res.convenio?.id ?? null,
          clinica_id: res.clinica?.id ?? null,
          medico_id: res.medico?.id ?? null,
          tipo_acesso_id: res.tipo_acesso?.id ?? null,
          cateter_id: res.cateter?.id ?? null,
        });
      } catch (error) {
        console.error("Erro ao carregar acompanhamento:", error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [isOpen, id, acao, form]);

  const onSubmit = async (values: FormFieldsAcompanhamento) => {
    try {
      let responseData: any;
      if (acao === "criar") {
        responseData = await criarAcompanhamento(values);
      } else if (acao === "editar") {
        responseData = await editarAcompanhamento(id, values);
      }

      reload();
      toast.success(responseData?.message || "Sucesso!");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao salvar", {
        position: "top-center",
      });
    }
  };

  const handleTabChange = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== "Tab") return;

    event.preventDefault();

    if (!formRef.current) return;

    const focusableElements = Array.from(
      formRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [href], input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"]):not(:disabled)'
      )
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      lastElement?.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      firstElement?.focus();
      return;
    }

    const direction = event.shiftKey ? -1 : 1;
    const index = focusableElements.indexOf(
      document.activeElement as HTMLElement
    );

    const nextElement = focusableElements[index + direction];
    if (nextElement) {
      nextElement.focus();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
        tabIndex={undefined}
      >
        <DialogHeader>
          <DialogTitle>
            {acao === "criar" ? "Novo Acompanhamento" : "Editar Acompanhamento"}
          </DialogTitle>
          <DialogDescription>
            Insira informações do acompanhamento
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          onKeyDown={handleTabChange}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-1"
        >
          <Controller
            name="paciente_id"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Paciente <span className="text-destructive">*</span>
                </FieldLabel>
                <FormAsyncSelect
                  autoFocus
                  inputId={field.name}
                  placeholder="Pesquisar paciente..."
                  value={field.value}
                  onChange={field.onChange}
                  fetchFn={consultarPacientes}
                  initialData={initialRecord?.paciente}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="convenio_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Convênio<span className="text-destructive">*</span>
                  </FieldLabel>
                  <FormAsyncSelect
                    placeholder="Buscar convênio..."
                    value={field.value}
                    onChange={field.onChange}
                    fetchFn={consultarConvenios}
                    initialData={initialRecord?.convenio}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="clinica_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Clínica <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FormAsyncSelect
                    placeholder="Buscar clínica..."
                    value={field.value}
                    onChange={field.onChange}
                    fetchFn={consultarClinicas}
                    initialData={initialRecord?.clinica}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>

          <Controller
            name="medico_id"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Nefrologista <span className="text-destructive">*</span>
                </FieldLabel>
                <FormAsyncSelect
                  placeholder="Buscar médico..."
                  value={field.value}
                  onChange={field.onChange}
                  fetchFn={(v) => consultarMedicos(1, v, "Nome")}
                  initialData={initialRecord?.medico}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="situacao_clinica"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Situação Clínica <span className="text-destructive">*</span>
                </FieldLabel>
                <Textarea {...field} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="ultimo_acesso"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Último Acesso <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input type="date" {...field} />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="tipo_acesso_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Tipo de Acesso <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FormAsyncSelect
                    placeholder="Buscar acesso..."
                    value={field.value}
                    onChange={field.onChange}
                    fetchFn={consultarTiposAcessos}
                    initialData={initialRecord?.tipo_acesso}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="ultimo_usv"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Último USV <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input type="date" {...field} />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="cateter_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Cateter <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FormAsyncSelect
                    placeholder="Buscar cateter..."
                    value={field.value}
                    onChange={field.onChange}
                    fetchFn={consultarCateteres}
                    initialData={initialRecord?.cateter}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>

          <div className="flex gap-6 py-2">
            <Controller
              name="lesao_50"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="lesao"
                  />
                  <label htmlFor="lesao" className="text-sm select-none">
                    Lesão {">"} 50%
                  </label>
                </div>
              )}
            />
            <Controller
              name="alteracao_clinica"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="alteracao"
                  />
                  <label htmlFor="alteracao" className="text-sm select-none">
                    Alteração Clínica
                  </label>
                </div>
              )}
            />
          </div>

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
  );
}

function debouncePromise<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => resolve(fn(...args)), delay);
    });
  };
}

interface FormAsyncSelectProps {
  value: number | number[] | null;
  onChange: (value: number | number[] | null) => void;
  fetchFn: (search: string) => Promise<OpcaoSelect[]>;
  placeholder?: string;
  isMulti?: boolean;
  initialData?: OpcaoSelect | OpcaoSelect[] | null;
  autoFocus?: boolean;
  inputId?: string;
}

export function FormAsyncSelect({
  value,
  onChange,
  fetchFn,
  placeholder,
  isMulti,
  initialData,
  autoFocus,
  inputId,
}: FormAsyncSelectProps) {
  const [localOptions, setLocalOptions] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    if (initialData) {
      const arr = Array.isArray(initialData) ? initialData : [initialData];
      const mapped = arr.map((item) => ({
        value: item.id,
        label: item.nome ?? item.tipo ?? "...",
      }));

      setLocalOptions((prev) => {
        const map = new Map(prev.map((p) => [p.value, p]));
        mapped.forEach((m) => map.set(m.value, m));
        return Array.from(map.values());
      });
    }
  }, [initialData]);

  const loadOptions: any = useMemo(
    () =>
      debouncePromise(async (inputValue: string) => {
        if (!inputValue) return [];
        const res = await fetchFn(inputValue);
        const mapped = res.map((item: any) => ({
          value: item.id,
          label: item.nome ?? item.tipo ?? "...",
        }));

        setLocalOptions((prev) => {
          const map = new Map(prev.map((p) => [p.value, p]));
          mapped.forEach((m) => map.set(m.value, m));
          return Array.from(map.values());
        });

        return mapped;
      }, 500),
    [fetchFn]
  );

  const selectValue = isMulti
    ? localOptions.filter(
        (opt) => Array.isArray(value) && value.includes(opt.value)
      )
    : localOptions.find((opt) => opt.value === value) || null;

  const handleChange = (selected: any) => {
    if (isMulti) {
      onChange(selected ? selected.map((s: any) => s.value) : []);
    } else {
      onChange(selected ? selected.value : null);
    }
  };

  return (
    <AsyncSelect
      tabSelectsValue={false}
      autoFocus={autoFocus}
      inputId={inputId}
      isMulti={isMulti}
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      value={selectValue}
      onChange={handleChange}
      placeholder={placeholder || "Selecione..."}
      loadingMessage={() => "Buscando..."}
      noOptionsMessage={({ inputValue }) =>
        inputValue ? "Nenhum resultado." : "Digite para buscar..."
      }
      unstyled
      classNames={{
        control: ({ isFocused, isDisabled }) =>
          cn(
            "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
            isFocused ? "outline-none ring-1 ring-ring" : "",
            isDisabled ? "cursor-not-allowed opacity-50" : ""
          ),
        valueContainer: () => "flex flex-wrap gap-1 w-full p-0 m-0",
        input: () => "text-sm text-foreground m-0 p-0",
        singleValue: () => "text-sm text-foreground",
        placeholder: () => "text-sm text-muted-foreground",
        menu: () =>
          "mt-2 rounded-md border bg-popover text-popover-foreground shadow-md z-50",
        menuList: () => "p-1",
        option: ({ isFocused, isSelected }) =>
          cn(
            "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors",
            isFocused ? "bg-accent text-accent-foreground" : "",
            isSelected ? "bg-primary text-primary-foreground" : ""
          ),
        multiValue: () =>
          "flex items-center rounded-sm bg-secondary text-secondary-foreground overflow-hidden",
        multiValueLabel: () => "px-2 py-0.5 text-xs font-medium",
        multiValueRemove: () =>
          "px-1.5 py-0.5 hover:bg-primary/30 hover:text-primary-foreground cursor-pointer transition-colors",
        indicatorsContainer: () =>
          "flex items-center gap-1 text-muted-foreground",
        indicatorSeparator: () => "bg-border w-[1px] my-1 mx-1",
        dropdownIndicator: () => "p-1 hover:text-foreground cursor-pointer",
        clearIndicator: () => "p-1 hover:text-secondary cursor-pointer",
      }}
    />
  );
}
