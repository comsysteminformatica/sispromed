import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Activity,
  Bandage,
  ChartPie,
  EllipsisVertical,
  FileText,
  Handshake,
  Hospital,
  LogOut,
  ShieldPlus,
  Stethoscope,
  User,
  Users,
  ChevronDown,
  List,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGlobalState from "@/state/useGlobalState";

import logo from "@/assets/images/logo-icone.png";
import logoComsystem from "@/assets/images/logo-Comsystem.webp";
import ModalPrazoDoppler from "./Modals/prazo-doppler";

type SidebarItem = {
  title: string;
  url?: string;
  icon: React.ElementType;
  children?: SidebarItem[];
};

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/vascular/dashboard",
    icon: ChartPie,
  },
  {
    title: "Acompanhamentos",
    url: "/vascular/acompanhamentos",
    icon: FileText,
  },
  {
    title: "Pacientes",
    url: "/vascular/pacientes",
    icon: Users,
  },
  {
    title: "Cadastros",
    icon: List,
    children: [
      {
        title: "Convênios",
        url: "/vascular/convenios",
        icon: Handshake,
      },
      {
        title: "Clínicas",
        url: "/vascular/clinicas",
        icon: Hospital,
      },
      {
        title: "Nefrologistas",
        url: "/vascular/nefrologistas",
        icon: Stethoscope,
      },
      {
        title: "Tipos de acesso",
        url: "/vascular/tipos-acesso",
        icon: Activity,
      },
      {
        title: "Lesões",
        url: "/vascular/lesoes",
        icon: Bandage,
      },
      {
        title: "Tratamentos",
        url: "/vascular/tratamentos",
        icon: ShieldPlus,
      },
    ],
  },
];

function SidebarSubmenu({ item }: { item: SidebarItem }) {
  const { pathname } = useLocation();
  const { open, setOpen } = useSidebar();

  const hasActiveChild = item.children?.some((child) =>
    pathname.startsWith(child.url!)
  );

  const [submenuOpen, setSubmenuOpen] = useState(hasActiveChild);

  useEffect(() => {
    if (!open) {
      setSubmenuOpen(false);
    }
  }, [open]);

  function handleTrigger() {
    if (!open) {
      setOpen(true);
      return;
    }

    setSubmenuOpen(!submenuOpen);
  }

  return (
    <Collapsible open={submenuOpen} onOpenChange={setSubmenuOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            onClick={handleTrigger}
            className="justify-between"
            tooltip={item.title}
          >
            <div className="flex items-center">
              <item.icon className="mr-3 h-4 w-4" />
              {item.title}
            </div>

            <ChevronDown
              className={`transition-transform ${
                submenuOpen ? "rotate-180" : ""
              }`}
              size={16}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="ml-6 mt-1 space-y-1">
            {item.children?.map((sub) => {
              const active = pathname.startsWith(sub.url!);

              return (
                <Link
                  key={sub.title}
                  to={sub.url!}
                  className={`
                    block rounded-md px-2 py-1 text-sm transition-colors
                    ${
                      active
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted"
                    }
                  `}
                >
                  {sub.title}
                </Link>
              );
            })}
          </div>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function AppSidebar() {
  const { pathname } = useLocation();
  const { isMobile, open } = useSidebar();
  const nomeUsuario = useGlobalState((state) => state.nomeUsuario);
  const perfilUsuario = useGlobalState((state) => state.perfilUsuario)
  const [isModalPrazoDoppler, setIsModalPrazoDoppler] = useState(false);

  return (
    <>
      <ModalPrazoDoppler
        isOpen={isModalPrazoDoppler}
        setIsOpen={setIsModalPrazoDoppler}
      />

      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                {open ? (
                  <span className="font-semibold">Sispromed</span>
                ) : (
                  <img src={logo} />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => {
                  if (item.children) {
                    return <SidebarSubmenu key={item.title} item={item} />;
                  }

                  const active = pathname.startsWith(item.url!);

                  return (
                    <SidebarMenuItem key={item.title} className="relative">
                      {active && (
                        <div className="absolute left-0 top-1 bottom-1 w-1 rounded-r bg-primary" />
                      )}

                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className={`
                        transition-colors
                        ${
                          active
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted"
                        }
                      `}
                      >
                        <Link to={item.url!}>
                          <item.icon className="mr-1 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <User />

                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium capitalize">
                        {nomeUsuario}
                      </span>
                    </div>

                    <EllipsisVertical className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel>Opções</DropdownMenuLabel>

                  {perfilUsuario === 1 && (
                    <Link to={"/vascular/usuarios"}>
                      <DropdownMenuItem>
                        <Users />
                        Usuários
                      </DropdownMenuItem>
                    </Link>
                  )}

                  <DropdownMenuItem
                    onClick={() => setIsModalPrazoDoppler(true)}
                  >
                    <Settings /> Configurações
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <Link to={"/login"} replace>
                    <DropdownMenuItem>
                      <LogOut />
                      Sair
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
            <SidebarSeparator />
            <SidebarMenuItem>
              <img
                src={logoComsystem}
                alt="Comsystem"
                className="flex justify-self-center mt-3 mb-5 w-30"
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
