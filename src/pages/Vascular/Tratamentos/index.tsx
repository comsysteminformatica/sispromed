import { DataTable } from "@/components/DataTable";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  consultarTratamentos,
} from "@/service/api";
import { columns } from "./columns";
import type { Tratamento } from "@/types/tratamento";

export default function Tratamentos() {
  const [data, setData] = useState<Tratamento[]>([]);

  async function listarTratamentos() {
    try {
      const response = await consultarTratamentos();
      setData(response);
    } catch (error) {
      toast.error(error?.message);
    }
  }

  useEffect(() => {
    listarTratamentos();
  }, []);

  return (
    <>
      <section className="flex">
        <div className="container mx-auto w-screen">
          <DataTable
            data={data}
            columns={columns}
            emptyMessage={"Nenhum tratamento encontrado."}
          />
        </div>
      </section>
    </>
  );
}
