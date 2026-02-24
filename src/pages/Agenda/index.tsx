import Calendario from "@/components/Calendario";
import ModalCalendario from "@/components/Calendario/Modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Agenda() {
  const [isModalCalendario, setIsModalCalendario] = useState(false);

  return (
    <>
      <section>        
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
