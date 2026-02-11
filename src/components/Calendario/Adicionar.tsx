import moment from "moment";
import { useState } from "react";

interface AdicionarCalendarioProps {
  onAdicionar: (evento: void) => void;
}

export default function AdicionarCalendario({
  onAdicionar,
}: AdicionarCalendarioProps) {
  const [novoEvento, setNovoEvento] = useState({
    title: "",
    desc: "",
    start: null,
    end: null,
    color: "",
    tipo: "",
  });

  return <></>;
}
