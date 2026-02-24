"use client";

import { useEffect, useState } from "react";
import { columns, type Acompanhamento } from "./columns";
import { DataTable } from "./data-table";
import { consultarAcompanhamentos } from "@/service/api";

export default function DemoPage() {
  const [response, setResponse] = useState<Acompanhamento[]>([]);

  async function listarData() {
    const data: Acompanhamento[] = await consultarAcompanhamentos();
    setResponse(data);
  }

  useEffect(() => {
    listarData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={response} />
    </div>
  );
}
