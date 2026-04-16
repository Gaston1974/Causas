import { Calendar, FileText, Home, Inbox, Plus } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { NavUser } from "@/components/nav-user"

const items = [
  {
    title: "Panel de Control",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Causas",
    url: "/causas",
    icon: FileText,
  },
  {
    title: "Nueva Causa",
    url: "/causas/new",
    icon: Plus,
  },
  {
    title: "Mesa",
    url: "/mesa",
    icon: Inbox,
  },
  {
    title: "Reportes",
    url: "/reportes",
    icon: Calendar,
  },

]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/40 bg-transparent">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Sistema Causas</h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5 px-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group h-10 transition-all hover:bg-primary/10 hover:text-primary active:scale-[0.98]">
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
