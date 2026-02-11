import Calendario from "@/components/Calendario";
import ModalCalendario from "@/components/Calendario/Modal";
import { Button } from "@/components/ui/button";
import { efetuarTeste } from "@/service/api";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Agenda() {
  const [isModalCalendario, setIsModalCalendario] = useState(false);

  const teste = async () => {
    await efetuarTeste();
  };

  return (
    <>
      <section>
        <Button onClick={teste}>teste momentâneo</Button>
        <Button onClick={() => setIsModalCalendario(true)}>
          <Plus />
          Novo
        </Button>
      </section>
      <Calendario />
      <ModalCalendario
        isOpen={isModalCalendario}
        setIsOpen={setIsModalCalendario}
      />
    </>
  );
}
