import {
  Bandage,
  Calendar,
  ChartPie,
  FileText,
  Handshake,
  Home,
  Hospital,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  // {
  //   title: "Agenda",
  //   url: "/agenda",
  //   icon: Calendar,
  // },
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
    icon: Handshake,
  },
  {
    title: "Tipos de acesso",
    url: "/vascular/tipos-acesso",
    icon: Bandage,
  },
  {
    title: "Cateteres",
    url: "/vascular/cateteres",
    icon: Handshake,
  },
  {
    title: "Lesões",
    url: "/vascular/lesoes",
    icon: Handshake,
  },
  {
    title: "Tratamentos",
    url: "/vascular/tratamentos",
    icon: Handshake,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>SISPROMED</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
