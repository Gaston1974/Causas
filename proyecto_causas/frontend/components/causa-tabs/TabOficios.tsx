"use client"

import { useState, forwardRef, useImperativeHandle } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Send, ArrowUpCircle, FileText, Bell, HelpCircle } from "lucide-react"
import type { CausaOficio, OficioTipo } from "@/types/causa-extras"

const OFICIO_CONFIG: Record<OficioTipo, { icon: any; color: string; badge: string; label: string }> = {
  ELEVACION: {
    icon: ArrowUpCircle,
    color: "text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300",
    label: "Elevación de Causa",
  },
  INFORME: {
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
    label: "Informe",
  },
  NOTIFICACION: {
    icon: Bell,
    color: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
    label: "Notificación",
  },
  REQUERIMIENTO: {
    icon: Send,
    color: "text-rose-600 dark:text-rose-400",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
    label: "Requerimiento",
  },
  OTRO: {
    icon: HelpCircle,
    color: "text-gray-500",
    badge: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    label: "Otro",
  },
}

const ALL_TIPOS: OficioTipo[] = ["ELEVACION", "INFORME", "NOTIFICACION", "REQUERIMIENTO", "OTRO"]

const emptyOficio = (causaId: string): CausaOficio => ({
  _id: crypto.randomUUID(),
  causa_id: causaId,
  tipo: "ELEVACION",
  numero_oficio: "",
  fecha_oficio: "",
  destinatario: "",
  descripcion: "",
  nota_elevacion: "",
  fecha_elevacion: "",
  observaciones: "",
})

export interface TabOficiosRef {
  getData: () => CausaOficio[]
}

interface TabOficiosProps {
  causaId: string
  initialData?: CausaOficio[]
}

export const TabOficios = forwardRef<TabOficiosRef, TabOficiosProps>(
  function TabOficios({ causaId, initialData = [] }, ref) {
  const [oficios, setOficios] = useState<CausaOficio[]>(initialData)

  useImperativeHandle(ref, () => ({ getData: () => oficios }))

  const add = () => setOficios((p) => [...p, emptyOficio(causaId)])
  const remove = (i: number) => setOficios((p) => p.filter((_, idx) => idx !== i))
  const update = (i: number, field: keyof CausaOficio, value: any) =>
    setOficios((p) => p.map((o, idx) => (idx === i ? { ...o, [field]: value } : o)))

  const elevaciones = oficios.filter((o) => o.tipo === "ELEVACION")

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            Oficios y Elevación de Causas
          </h3>
          <p className="text-xs text-muted-foreground">
            Registre todos los oficios emitidos, incluyendo notas de elevación con su fecha correspondiente.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={add}
          className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary"
        >
          <Plus className="h-4 w-4" />
          Agregar oficio
        </Button>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-2">
        {ALL_TIPOS.map((tipo) => {
          const cfg = OFICIO_CONFIG[tipo]
          const Icon = cfg.icon
          const count = oficios.filter((o) => o.tipo === tipo).length
          if (count === 0) return null
          return (
            <Badge key={tipo} className={`gap-1.5 ${cfg.badge}`}>
              <Icon className="h-3 w-3" />
              {cfg.label}: {count}
            </Badge>
          )
        })}
      </div>

      {/* Empty state */}
      {oficios.length === 0 && (
        <div className="border-2 border-dashed border-border/50 rounded-xl py-10 flex flex-col items-center gap-2 text-muted-foreground">
          <Send className="h-8 w-8 opacity-20" />
          <p className="text-sm">No hay oficios registrados.</p>
          <Button type="button" variant="ghost" size="sm" onClick={add} className="text-primary mt-1">
            <Plus className="h-4 w-4 mr-1" /> Agregar primer oficio
          </Button>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-3">
        {oficios.map((oficio, i) => {
          const cfg = OFICIO_CONFIG[oficio.tipo as OficioTipo] || OFICIO_CONFIG["OTRO"]
          const Icon = cfg.icon
          const isElevacion = oficio.tipo === "ELEVACION"

          return (
            <div key={oficio._id || oficio.numero_oficio || i} className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-sm">
              {/* Card header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${cfg.color}`} />
                  <span className="text-sm font-medium">{cfg.label}</span>
                  {oficio.numero_oficio && (
                    <Badge variant="outline" className="text-xs">
                      N° {oficio.numero_oficio}
                    </Badge>
                  )}
                  {isElevacion && (
                    <Badge className={`text-xs ${cfg.badge}`}>Elevación</Badge>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(i)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                {/* Tipo selector */}
                <div className="space-y-1.5">
                  <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs uppercase tracking-wide text-muted-foreground">
                    Tipo de oficio <span className="text-destructive">*</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TIPOS.map((tipo) => {
                      const tc = OFICIO_CONFIG[tipo]
                      const TIcon = tc.icon
                      const active = oficio.tipo === tipo
                      return (
                        <button
                          key={tipo}
                          type="button"
                          onClick={() => update(i, "tipo", tipo)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                            active
                              ? `border-current ${tc.badge} ring-1 ring-current/30`
                              : "border-border text-muted-foreground hover:border-border/60"
                          }`}
                        >
                          <TIcon className="h-3.5 w-3.5" />
                          {tc.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Nro oficio */}
                  <div className="space-y-1.5">
                    <Label htmlFor={`of-${i}-num`} className="text-xs uppercase tracking-wide text-muted-foreground">
                      Número de oficio
                    </Label>
                    <Input
                      id={`of-${i}-num`}
                      value={oficio.numero_oficio || ""}
                      onChange={(e) => update(i, "numero_oficio", e.target.value)}
                      placeholder="OF-2024-001"
                      className="h-9 text-sm"
                    />
                  </div>

                  {/* Fecha oficio */}
                  <div className="space-y-1.5">
                    <Label htmlFor={`of-${i}-fecha`} className="text-xs uppercase tracking-wide text-muted-foreground">
                      Fecha del oficio
                    </Label>
                    <Input
                      id={`of-${i}-fecha`}
                      type="date"
                      value={oficio.fecha_oficio || ""}
                      onChange={(e) => update(i, "fecha_oficio", e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Destinatario */}
                <div className="space-y-1.5">
                  <Label htmlFor={`of-${i}-dest`} className="text-xs uppercase tracking-wide text-muted-foreground">
                    Destinatario <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`of-${i}-dest`}
                    value={oficio.destinatario}
                    onChange={(e) => update(i, "destinatario", e.target.value)}
                    placeholder="Juzgado, Fiscalía, Unidad..."
                    className="h-9 text-sm"
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-1.5">
                  <Label htmlFor={`of-${i}-desc`} className="text-xs uppercase tracking-wide text-muted-foreground">
                    Descripción del oficio
                  </Label>
                  <Textarea
                    id={`of-${i}-desc`}
                    value={oficio.descripcion}
                    onChange={(e) => update(i, "descripcion", e.target.value)}
                    placeholder="Objeto del oficio, contenido principal..."
                    className="min-h-[72px] text-sm resize-none"
                  />
                </div>

                {/* === BLOQUE EXCLUSIVO DE ELEVACIÓN === */}
                {isElevacion && (
                  <div className="space-y-3 pt-2 border-t border-indigo-200/60 dark:border-indigo-800/40">
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                      <ArrowUpCircle className="h-3.5 w-3.5" />
                      Datos de Elevación
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Nota de elevación */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <Label htmlFor={`of-${i}-nelev`} className="text-xs uppercase tracking-wide text-muted-foreground">
                          Nota de Elevación
                        </Label>
                        <Textarea
                          id={`of-${i}-nelev`}
                          value={oficio.nota_elevacion || ""}
                          onChange={(e) => update(i, "nota_elevacion", e.target.value)}
                          placeholder="Texto de la nota de elevación de la causa..."
                          className="min-h-[80px] text-sm resize-none bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-200/60 dark:border-indigo-800/40"
                        />
                      </div>

                      {/* Fecha de elevación */}
                      <div className="space-y-1.5">
                        <Label htmlFor={`of-${i}-felev`} className="text-xs uppercase tracking-wide text-muted-foreground">
                          Fecha de Elevación
                        </Label>
                        <Input
                          id={`of-${i}-felev`}
                          type="date"
                          value={oficio.fecha_elevacion || ""}
                          onChange={(e) => update(i, "fecha_elevacion", e.target.value)}
                          className="h-9 text-sm bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-200/60 dark:border-indigo-800/40"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Observaciones */}
                <div className="space-y-1.5">
                  <Label htmlFor={`of-${i}-obs`} className="text-xs uppercase tracking-wide text-muted-foreground">
                    Observaciones
                  </Label>
                  <Textarea
                    id={`of-${i}-obs`}
                    value={oficio.observaciones || ""}
                    onChange={(e) => update(i, "observaciones", e.target.value)}
                    placeholder="Observaciones adicionales..."
                    className="min-h-[56px] text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
  }
)
