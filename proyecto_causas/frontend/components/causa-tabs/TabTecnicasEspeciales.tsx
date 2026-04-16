"use client"

import { useState, forwardRef, useImperativeHandle } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Shield, UserCheck, Monitor, Mic2, HelpCircle } from "lucide-react"
import type { CausaTecnica, TecnicaTipo } from "@/types/causa-extras"
import { TECNICA_LABELS } from "@/types/causa-extras"

const TECNICA_CONFIG: Record<TecnicaTipo, { icon: any; color: string; badge: string }> = {
  AGENTE_ENCUBIERTO: {
    icon: Shield,
    color: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
  },
  AGENTE_REVELADOR: {
    icon: UserCheck,
    color: "text-violet-600 dark:text-violet-400",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300",
  },
  AGENTE_REVELADOR_DIGITAL: {
    icon: Monitor,
    color: "text-cyan-600 dark:text-cyan-400",
    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300",
  },
  COTEJO_VOCES: {
    icon: Mic2,
    color: "text-rose-600 dark:text-rose-400",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
  },
  OTRA: {
    icon: HelpCircle,
    color: "text-gray-500",
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
}

const ALL_TIPOS: TecnicaTipo[] = [
  "AGENTE_ENCUBIERTO",
  "AGENTE_REVELADOR",
  "AGENTE_REVELADOR_DIGITAL",
  "COTEJO_VOCES",
  "OTRA",
]

const emptyTecnica = (causaId: string): CausaTecnica => ({
  _id: crypto.randomUUID(),
  causa_id: causaId,
  tipo: "AGENTE_ENCUBIERTO",
  descripcion: "",
  fecha_inicio: "",
  fecha_fin: "",
  resultado: "",
  observaciones: "",
})

export interface TabTecnicasRef {
  getData: () => CausaTecnica[]
}

interface TabTecnicasEspecialesProps {
  causaId: string
  initialData?: CausaTecnica[]
}

export const TabTecnicasEspeciales = forwardRef<TabTecnicasRef, TabTecnicasEspecialesProps>(
  function TabTecnicasEspeciales({ causaId, initialData = [] }, ref) {
  const [tecnicas, setTecnicas] = useState<CausaTecnica[]>(initialData)

  useImperativeHandle(ref, () => ({ getData: () => tecnicas }))

  const add = () => setTecnicas((p) => [...p, emptyTecnica(causaId)])
  const remove = (i: number) => setTecnicas((p) => p.filter((_, idx) => idx !== i))
  const update = (i: number, field: keyof CausaTecnica, value: any) =>
    setTecnicas((p) => p.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)))

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Técnicas Especiales Investigativas (TEI)
          </h3>
          <p className="text-xs text-muted-foreground">
            Registre las técnicas especiales aplicadas en el marco de esta causa.
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
          Agregar técnica
        </Button>
      </div>

      {/* Reference cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ALL_TIPOS.filter((t) => t !== "OTRA").map((tipo) => {
          const cfg = TECNICA_CONFIG[tipo]
          const Icon = cfg.icon
          const count = tecnicas.filter((t) => t.tipo === tipo).length
          return (
            <div
              key={tipo}
              className="flex items-center gap-2 p-2.5 rounded-lg border border-border/60 bg-muted/20 text-xs"
            >
              <Icon className={`h-4 w-4 shrink-0 ${cfg.color}`} />
              <div className="min-w-0">
                <div className="font-medium truncate text-foreground/80">{TECNICA_LABELS[tipo]}</div>
                {count > 0 && (
                  <Badge className={`mt-0.5 text-xs py-0 h-4 ${cfg.badge}`}>
                    {count} registro{count !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {tecnicas.length === 0 && (
        <div className="border-2 border-dashed border-border/50 rounded-xl py-10 flex flex-col items-center gap-2 text-muted-foreground">
          <Shield className="h-8 w-8 opacity-20" />
          <p className="text-sm">No hay técnicas especiales registradas.</p>
          <Button type="button" variant="ghost" size="sm" onClick={add} className="text-primary mt-1">
            <Plus className="h-4 w-4 mr-1" /> Agregar primera técnica
          </Button>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-3">
        {tecnicas.map((tec, i) => {
          const cfg = TECNICA_CONFIG[tec.tipo as TecnicaTipo] || TECNICA_CONFIG["OTRA"]
          const Icon = cfg.icon
          return (
            <div key={tec._id || tec.tipo + i} className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${cfg.color}`} />
                  <span className="text-sm font-medium">
                    {TECNICA_LABELS[tec.tipo as TecnicaTipo] || "Técnica"}
                  </span>
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
                {/* Tipo */}
                <div className="space-y-1.5">
                  <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs uppercase tracking-wide text-muted-foreground">
                    Tipo de técnica <span className="text-destructive">*</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TIPOS.map((tipo) => {
                      const tc = TECNICA_CONFIG[tipo]
                      const TIcon = tc.icon
                      const active = tec.tipo === tipo
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
                          {TECNICA_LABELS[tipo]}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Fecha inicio */}
                  <div className="space-y-1.5">
                    <Label htmlFor={`tec-fini-${i}`} className="text-xs uppercase tracking-wide text-muted-foreground">
                      Fecha de inicio
                    </Label>
                    <Input
                      id={`tec-fini-${i}`}
                      type="date"
                      value={tec.fecha_inicio || ""}
                      onChange={(e) => update(i, "fecha_inicio", e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>

                  {/* Fecha fin */}
                  <div className="space-y-1.5">
                    <Label htmlFor={`tec-ffin-${i}`} className="text-xs uppercase tracking-wide text-muted-foreground">
                      Fecha de fin
                    </Label>
                    <Input
                      id={`tec-ffin-${i}`}
                      type="date"
                      value={tec.fecha_fin || ""}
                      onChange={(e) => update(i, "fecha_fin", e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div className="space-y-1.5">
                  <Label htmlFor={`tec-desc-${i}`} className="text-xs uppercase tracking-wide text-muted-foreground">
                    Descripción / Detalle del operativo
                  </Label>
                  <Textarea
                    id={`tec-desc-${i}`}
                    value={tec.descripcion || ""}
                    onChange={(e) => update(i, "descripcion", e.target.value)}
                    placeholder="Describir la técnica, agentes involucrados, objetivos..."
                    className="min-h-[72px] text-sm resize-none"
                  />
                </div>

                {/* Resultado */}
                <div className="space-y-1.5">
                  <Label htmlFor={`tec-res-${i}`} className="text-xs uppercase tracking-wide text-muted-foreground">
                    Resultado obtenido
                  </Label>
                  <Textarea
                    id={`tec-res-${i}`}
                    value={tec.resultado || ""}
                    onChange={(e) => update(i, "resultado", e.target.value)}
                    placeholder="Resultado de la aplicación de la técnica..."
                    className="min-h-[60px] text-sm resize-none"
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
