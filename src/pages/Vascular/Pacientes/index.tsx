import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { consultarPacientes } from "@/service/api";
import type { Paciente } from "@/types/paciente";
import { Button } from "@/components/ui/button";
import ModalPaciente from "@/components/Modals/paciente";

export default function Pacientes() {
  const [data, setData] = useState<Paciente[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [acaoModal, setAcaoModal] = useState<"criar" | "editar">("criar");
  const [itemID, setItemID] = useState(0);

  async function listar() {
    try {
      const response = await consultarPacientes();
      setData(response);
    } catch (error) {
      toast.error(error?.message);
    }
  }

  useEffect(() => {
    listar();
  }, []);

  return (
    <>
      <ModalPaciente
        isOpen={isModal}
        setIsOpen={setIsModal}
        acao={acaoModal}
        reload={listar}
        id={itemID}
      />

      <section className="flex">
        <div className="container mx-auto w-screen">
          <div className="flex justify-end pb-3">
            <Button onClick={() => setIsModal(true)}>Adicionar</Button>
          </div>

          <DataTable
            data={data}
            columns={columns}
            emptyMessage={"Nenhum paciente encontrado."}
          />
        </div>
      </section>
    </>
  );
}
