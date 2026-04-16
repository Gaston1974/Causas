"use client"

import { useParams } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  ArrowLeft,
  Info,
  Compass,
  Phone,
  Shield,
  Send,
  Home,
  Link2,
  Save,
  Loader2,
} from "lucide-react"
import { useCausa } from "@/hooks/use-causa"
import { FormSkeleton } from "@/components/ui/skeleton-loader"
import { apiClient } from "@/lib/api"

// Solapas
import { TabGeneral } from "@/components/causa-tabs/TabGeneral"
import { TabOrigen, type TabOrigenRef } from "@/components/causa-tabs/TabOrigen"
import { TabTelefonos, type TabTelefonosRef } from "@/components/causa-tabs/TabTelefonos"
import { TabTecnicasEspeciales, type TabTecnicasRef } from "@/components/causa-tabs/TabTecnicasEspeciales"
import { TabOficios, type TabOficiosRef } from "@/components/causa-tabs/TabOficios"
import { TabAllanamiento, type TabAllanamientoRef } from "@/components/causa-tabs/TabAllanamiento"
import { TabSGO, type TabSGORef } from "@/components/causa-tabs/TabSGO"

const ESTADO_CONFIG: Record<string, { label: string; color: string }> = {
  activa: { label: "Activa", color: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800" },
  archivada: { label: "Archivada", color: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800/60 dark:text-gray-300" },
  en_proceso: { label: "En Proceso", color: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/30 dark:text-blue-400" },
  finalizada: { label: "Finalizada", color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400" },
}

const TABS = [
  { id: "general",      label: "General",             shortLabel: "General",  icon: Info    },
  { id: "origen",       label: "Origen",              shortLabel: "Origen",   icon: Compass },
  { id: "telefonos",    label: "Teléfonos",           shortLabel: "Tel.",     icon: Phone   },
  { id: "tecnicas",     label: "Técnicas Especiales", shortLabel: "TEI",      icon: Shield  },
  { id: "oficios",      label: "Oficios / Elevación", shortLabel: "Oficios",  icon: Send    },
  { id: "allanamiento", label: "Allanamiento",        shortLabel: "Allan.",   icon: Home    },
  { id: "sgo",          label: "SGO",                 shortLabel: "SGO",      icon: Link2   },
]

export default function CausaDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { causa, loading, error } = useCausa(id)
  const [activeTab, setActiveTab]     = useState("general")
  const [saving,    setSaving]        = useState(false)

  // Refs a las solapas para recolectar datos al guardar
  const origenRef       = useRef<TabOrigenRef>(null)
  const telefonosRef    = useRef<TabTelefonosRef>(null)
  const tecnicasRef     = useRef<TabTecnicasRef>(null)
  const oficiosRef      = useRef<TabOficiosRef>(null)
  const allanamientoRef = useRef<TabAllanamientoRef>(null)
  const sgoRef          = useRef<TabSGORef>(null)

  // Estado inicial de cada tab (cargado desde la API)
  const [initialOrigen,       setInitialOrigen]       = useState<any>(undefined)
  const [initialTelefonos,    setInitialTelefonos]    = useState<any[]>([])
  const [initialTecnicas,     setInitialTecnicas]     = useState<any[]>([])
  const [initialOficios,      setInitialOficios]      = useState<any[]>([])
  const [initialAllanamiento, setInitialAllanamiento] = useState<any>(undefined)
  const [initialSGOs,         setInitialSGOs]         = useState<any[]>([])
  const [loadingData,         setLoadingData]         = useState(true)

  // Cargar datos complementarios en paralelo cuando la causa esté disponible
  useEffect(() => {
    if (!causa) return
    const causaId = causa.id

    const fetchAll = async () => {
      setLoadingData(true)
      try {
        const [origen, tels, tecs, ofs, allan, sgos] = await Promise.allSettled([
          apiClient.getOrigen(causaId),
          apiClient.getTelefonos(causaId),
          apiClient.getTecnicas(causaId),
          apiClient.getOficios(causaId),
          apiClient.getAllanamiento(causaId),
          apiClient.getSGOs(causaId),
        ])

        if (origen.status === "fulfilled")        setInitialOrigen(origen.value)
        if (tels.status === "fulfilled")          setInitialTelefonos((tels.value as any)?.telefonos ?? [])
        if (tecs.status === "fulfilled")          setInitialTecnicas((tecs.value as any)?.tecnicas ?? [])
        if (ofs.status === "fulfilled")           setInitialOficios((ofs.value as any)?.oficios ?? [])
        if (allan.status === "fulfilled")         setInitialAllanamiento(allan.value)
        if (sgos.status === "fulfilled")          setInitialSGOs((sgos.value as any)?.sgos ?? [])
      } catch (e) {
        // Los registros pueden no existir aún — es OK
      } finally {
        setLoadingData(false)
      }
    }

    fetchAll()
  }, [causa])

  if (loading || loadingData) return <FormSkeleton />

  if (error || !causa) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
          <Info className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Causa no encontrada</h2>
        <p className="text-muted-foreground mt-2">La causa que buscas no existe o ha sido eliminada.</p>
        <Button asChild className="mt-6">
          <Link href="/causas"><ArrowLeft className="h-4 w-4 mr-2" />Volver a causas</Link>
        </Button>
      </div>
    )
  }

  const estadoCfg = ESTADO_CONFIG[causa.estado] || { label: causa.estado, color: "" }

  // ── Guardar todo ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    try {
      const causaId = causa.id
      const tasks: Promise<any>[] = []

      // Origen (upsert)
      const origenData = origenRef.current?.getData()
      if (origenData) tasks.push(apiClient.upsertOrigen(causaId, { ...origenData, causa_id: Number(causaId) }))

      // Teléfonos (bulk replace)
      const telsData = telefonosRef.current?.getData()
      if (telsData) tasks.push(apiClient.saveTelefonosBulk(causaId, telsData.map(t => ({ ...t, causa_id: Number(causaId) }))))

      // Técnicas (bulk replace)
      const tecsData = tecnicasRef.current?.getData()
      if (tecsData) tasks.push(apiClient.saveTecnicasBulk(causaId, tecsData.map(t => ({ ...t, causa_id: Number(causaId) }))))

      // Oficios (bulk replace)
      const ofsData = oficiosRef.current?.getData()
      if (ofsData) tasks.push(apiClient.saveOficiosBulk(causaId, ofsData.map(o => ({ ...o, causa_id: Number(causaId) }))))

      // Allanamiento (upsert completo)
      const allanData = allanamientoRef.current?.getData()
      if (allanData) tasks.push(apiClient.saveAllanamiento(causaId, { ...allanData, causa_id: Number(causaId) }))

      // SGOs (bulk replace)
      const sgosData = sgoRef.current?.getData()
      if (sgosData) tasks.push(apiClient.saveSGOsBulk(causaId, sgosData.map(s => ({ ...s, causa_id: Number(causaId) }))))

      await Promise.all(tasks)
      toast.success("Causa guardada correctamente", { description: "Todos los módulos fueron guardados." })
    } catch (err: any) {
      console.error("Error al guardar:", err)
      toast.error("Error al guardar", { description: err?.message || "Revisar la conexión con el backend." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* ── Top bar ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="mb-1 -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/causas"><ArrowLeft className="h-4 w-4 mr-1.5" />Volver a causas</Link>
          </Button>
          <div className="flex items-center flex-wrap gap-2">
            <h1 className="text-2xl font-bold">{causa.numero_causa}</h1>
            <Badge className={`border text-xs ${estadoCfg.color}`}>{estadoCfg.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium">{causa.nombre_fantasia}</p>
          <p className="text-xs text-muted-foreground line-clamp-1 max-w-xl">{causa.caratula}</p>
        </div>

        <Button onClick={handleSave} disabled={saving} className="gap-2 min-w-[130px]">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Guardando..." : "Guardar todo"}
        </Button>
      </div>

      {/* ── Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex h-auto p-1 gap-0.5 w-full overflow-x-auto justify-start flex-nowrap rounded-xl bg-muted/50 border border-border/50">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm whitespace-nowrap rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <div className="mt-4 bg-card rounded-xl border border-border/60 shadow-sm p-5 min-h-[400px]">
          <TabsContent value="general" className="m-0">
            <TabGeneral causa={causa} />
          </TabsContent>

          <TabsContent value="origen" className="m-0">
            <TabOrigen ref={origenRef} causaId={String(causa.id)} initialData={initialOrigen} />
          </TabsContent>

          <TabsContent value="telefonos" className="m-0">
            <TabTelefonos ref={telefonosRef} causaId={String(causa.id)} initialData={initialTelefonos} />
          </TabsContent>

          <TabsContent value="tecnicas" className="m-0">
            <TabTecnicasEspeciales ref={tecnicasRef} causaId={String(causa.id)} initialData={initialTecnicas} />
          </TabsContent>

          <TabsContent value="oficios" className="m-0">
            <TabOficios ref={oficiosRef} causaId={String(causa.id)} initialData={initialOficios} />
          </TabsContent>

          <TabsContent value="allanamiento" className="m-0">
            <TabAllanamiento ref={allanamientoRef} causaId={String(causa.id)} initialData={initialAllanamiento} />
          </TabsContent>

          <TabsContent value="sgo" className="m-0">
            <TabSGO ref={sgoRef} causaId={String(causa.id)} initialData={initialSGOs} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
