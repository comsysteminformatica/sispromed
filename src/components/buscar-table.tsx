import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { useDebounce } from "@/utils/utils";

type BuscarTableProps = {
  filtros: string[];
  busca: string;
  setBusca: (v: string) => void;
  statusFiltro: string;
  setStatusFiltro: any;
  listar: (
    tipo?: "busca" | "filtro" | "",
    categoria?: string,
    busca?: string
  ) => Promise<void>;
};

export default function BuscarTable({
  filtros,
  busca,
  setBusca,
  statusFiltro,
  setStatusFiltro,
  listar,
}: BuscarTableProps) {
  const inputRefBusca = useRef<HTMLInputElement>(null);

  const debouncedBusca = useDebounce(busca, 500);

  useEffect(() => {
    if (statusFiltro !== "Todos") {
      listar("busca", statusFiltro, debouncedBusca);
    } else {
      listar();
    }
  }, [debouncedBusca, statusFiltro]);

  useEffect(() => {
    if (statusFiltro !== "Todos") {
      setTimeout(() => {
        inputRefBusca.current?.focus();
      }, 200);
    }
  }, [statusFiltro]);

  return (
    <div className="flex gap-2 w-full sm:w-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {statusFiltro === "Todos" ? "Buscar por" : statusFiltro}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {filtros.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => {
                setStatusFiltro(status);

                if (status === "Todos") {
                  setBusca("");
                }
              }}
            >
              {status === "Todos" ? "Todos" : status}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {statusFiltro !== "Todos" && (
        <Input
          placeholder="Buscar..."
          className="w-full sm:w-100"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          ref={inputRefBusca}
        />
      )}
    </div>
  );
}
