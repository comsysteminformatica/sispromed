import { useState } from "react";
import { Link, replace, useLocation, useNavigate } from "react-router";
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
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGlobalState from "@/state/useGlobalState";

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
  const [open, setOpen] = useState(false);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setOpen(!open)}
        className="justify-between"
        tooltip={item.title}
      >
        <div className="flex items-center">
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </div>

        <ChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          size={16}
        />
      </SidebarMenuButton>

      {open && (
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
      )}
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const { pathname } = useLocation();
  const { isMobile } = useSidebar();
  const nomeUsuario = useGlobalState((state) => state.nome_usuario);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <span className="text-base font-semibold">SISPROMED</span>
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
                        <item.icon className="mr-2 h-4 w-4" />
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
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <User />

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{nomeUsuario}</span>
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
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
