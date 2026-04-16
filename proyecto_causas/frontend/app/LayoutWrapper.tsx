"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { redirect } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { CausasProvider } from "@/contexts/causas-context"
import { useAuth } from "@/contexts/auth-context"

import { ModeToggle } from "@/components/mode-toggle"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/simple-login" ||
    pathname === "/secure-login"

  // Auth guard: redirect unauthenticated users to login page.
  // Using router.push inside an effect is an anti-pattern in App Router;
  // we guard here reactively but keep it minimal — middleware should be
  // the primary guard in production.
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      router.replace("/simple-login")   // replace() avoids adding to history
    }
  }, [isAuthenticated, isLoading, isPublicRoute, router])

  if (isLoading || (!isAuthenticated && !isPublicRoute)) {
    return null
  }

  if (isPublicRoute) {
    return <>{children}</>
  }

  return (
    <CausasProvider>
      <SidebarProvider>
        <AppSidebar />
        {/* Background gradient effect */}
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-slate-950 dark:via-background dark:to-slate-900 -z-10 bg-fixed" />

        <main className="flex-1 w-full min-w-0 flex flex-col min-h-screen relative">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/40 bg-background/60 px-4 backdrop-blur-md transition-all">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors" />
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
            </div>
          </header>

          <div className="flex-1 relative">
            <div className="p-4 md:p-6 lg:p-8 pt-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 will-change-transform">
              {children}
            </div>
          </div>
        </main>
      </SidebarProvider>
    </CausasProvider>
  )
}
