import { useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDropAddon from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import ModalCalendario from "./Modal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

// @ts-ignore
const withDragAndDrop = withDragAndDropAddon.default || withDragAndDropAddon;

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const eventosIniciais = [
  {
    id: 1,
    title: "Reunião de Projeto",
    desc: "Descrição do projeto",
    start: moment().toDate(),
    end: moment().add(2, "hours").toDate(),
    color: "green",
    tipo: "projeto",
  },
  {
    id: 2,
    title: "Dia Inteiro",
    desc: "Descrição do dia inteiro",
    allDay: true,
    start: moment().subtract(1, "day").toDate(),
    end: moment().subtract(1, "day").toDate(),
    color: "red",
    tipo: "dia inteiro",
  },
];

export default function Calendario() {
  const [eventos, setEventos] = useState(eventosIniciais);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [isModalCalendarioOpen, setIsModalCalendarioOpen] = useState(false);

  function moverEventos(data: any) {
    const { start, end } = data;
    const updateEvents = eventos.map((event) => {
      if (event.id === data.event.id) {
        return {
          ...event,
          start: new Date(start),
          end: new Date(end),
        };
      }
      return event;
    });
    setEventos(updateEvents);
  }

  const handleEventoClick = (evento: any) => {
    setEventoSelecionado(evento);
    setIsModalCalendarioOpen(true);
  };

  // const handleEventoClose = () => {
  //   setEventoSelecionado(null);
  // };

  const eventStyle = (event: any) => ({
    style: {
      backgroundColor: event.color,
    },
  });

  return (
    <>
      <div className="w-full h-full">
        <DragAndDropCalendar
          defaultDate={moment().toDate()}
          defaultView="month"
          events={eventos}
          localizer={localizer}
          resizable
          onEventDrop={moverEventos}
          onEventResize={moverEventos}
          onSelectEvent={handleEventoClick}
          eventPropGetter={eventStyle}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </div>
      <ModalCalendario
        isOpen={isModalCalendarioOpen}
        setIsOpen={setIsModalCalendarioOpen}
        data={eventoSelecionado}
      />
    </>
  );
}

function CustomToolbar({ label, onView, onNavigate, views }: any) {
  const [itemTexto, setItemTexto] = useState("month");

  return (
    <section className="min-w-300">
      <div className="flex justify-between">
        <h1 className="text-zinc-800 tracking-tight text-3xl font-bold leading-tight">
          {label}
        </h1>
        <div className="flex gap-2">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  {itemTexto}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {views.map((view: string, index: number) => (
                  <>
                    <DropdownMenuItem
                      key={index}
                      onClick={() => onView(view) + setItemTexto(view)}
                    >
                      {view}
                    </DropdownMenuItem>
                    {index === 2 && <DropdownMenuSeparator />}
                  </>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <Button variant={"outline"} onClick={() => onNavigate("TODAY")}>
              Hoje
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant={"outline"} onClick={() => onNavigate("PREV")}>
              <ChevronLeft />
            </Button>
            <Button variant={"outline"} onClick={() => onNavigate("NEXT")}>
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
