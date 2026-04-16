"use client"

import { useState, forwardRef, useImperativeHandle } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Phone, Zap, Clock } from "lucide-react"
import type { CausaTelefono, ModalidadLinea } from "@/types/causa-extras"

const emptyTelefono = (): CausaTelefono => ({
  _id: crypto.randomUUID(),
  causa_id: "",
  numero_linea: "",
  titular: "",
  modalidad: "DIRECTA",
  observaciones: "",
  fecha_inicio: "",
  fecha_fin: "",
})

export interface TabTelefonosRef {
  getData: () => CausaTelefono[]
}

interface TabTelefonosProps {
  causaId: string
  initialData?: CausaTelefono[]
}

const MODALIDAD_CONFIG: Record<ModalidadLinea, { label: string; icon: any; color: string; desc: string }> = {
  DIRECTA: {
    label: "Directa",
    icon: Zap,
    color: "text-green-600 dark:text-green-400",
    desc: "Intercepción en tiempo real",
  },
  DIFERIDA: {
    label: "Diferida",
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    desc: "Intercepción con retardo / grabación",
  },
}

export const TabTelefonos = forwardRef<TabTelefonosRef, TabTelefonosProps>(
  function TabTelefonos({ causaId, initialData = [] }, ref) {
  const [telefonos, setTelefonos] = useState<CausaTelefono[]>(
    initialData.length > 0 ? initialData : []
  )

  useImperativeHandle(ref, () => ({ getData: () => telefonos }))

  const add = () => setTelefonos((p) => [...p, { ...emptyTelefono(), causa_id: causaId }])

  const remove = (i: number) => setTelefonos((p) => p.filter((_, idx) => idx !== i))

  const update = (i: number, field: keyof CausaTelefono, value: any) =>
    setTelefonos((p) => p.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)))

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            Líneas Intervenidas
          </h3>
          <p className="text-xs text-muted-foreground">
            Registrar cada línea telefónica intervenida y especificar su modalidad de intercepción.
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
          Agregar línea
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {(Object.entries(MODALIDAD_CONFIG) as [ModalidadLinea, typeof MODALIDAD_CONFIG["DIRECTA"]][]).map(
          ([key, cfg]) => {
            const Icon = cfg.icon
            return (
              <div
                key={key}
                className="flex items-center gap-1.5 text-xs bg-muted/40 border border-border/60 rounded-full px-3 py-1"
              >
                <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                <span className={`font-semibold ${cfg.color}`}>{cfg.label}</span>
                <span className="text-muted-foreground">— {cfg.desc}</span>
              </div>
            )
          }
        )}
      </div>

      {/* Empty state */}
      {telefonos.length === 0 && (
        <div className="border-2 border-dashed border-border/50 rounded-xl py-10 flex flex-col items-center gap-2 text-muted-foreground">
          <Phone className="h-8 w-8 opacity-20" />
          <p className="text-sm">No hay líneas intervenidas registradas.</p>
          <Button type="button" variant="ghost" size="sm" onClick={add} className="text-primary mt-1">
            <Plus className="h-4 w-4 mr-1" /> Agregar primera línea
          </Button>
        </div>
      )}

      {/* Telefono cards */}
      <div className="space-y-3">
        {telefonos.map((tel, i) => {
          const mcfg = MODALIDAD_CONFIG[tel.modalidad as ModalidadLinea]
          const Icon = mcfg?.icon || Phone

          return (
            <div
              key={tel._id || tel.numero_linea || i}
              className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-sm"
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {tel.numero_linea || `Línea ${i + 1}`}
                  </span>
                  {tel.titular && (
                    <span className="text-xs text-muted-foreground">· {tel.titular}</span>
                  )}
                  {tel.modalidad && (
                    <Badge
                      variant="outline"
                      className={`text-xs gap-1 ${
                        tel.modalidad === "DIRECTA"
                          ? "border-green-400/60 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                          : "border-amber-400/60 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      {mcfg?.label}
                    </Badge>
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

              {/* Card body */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Número */}
                <div className="space-y-1.5">
                  <Label htmlFor={`tel-${i}-num`} className="text-xs uppercase tracking-wide text-muted-foreground">
                    Número de línea <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`tel-${i}-num`}
                    value={tel.numero_linea}
                    onChange={(e) => update(i, "numero_linea", e.target.value)}
                    placeholder="+54 11 ..."
                    className="h-9 text-sm"
                  />
                </div>

                {/* Titular */}
                <div className="space-y-1.5">
                  <Label htmlFor={`tel-${i}-tit`} className="text-xs uppercase tracking-wide text-muted-foreground">
                    Titular / Operadora
                  </Label>
                  <Input
                    id={`tel-${i}-tit`}
                    value={tel.titular}
                    onChange={(e) => update(i, "titular", e.target.value)}
                    placeholder="Nombre o razón social"
                    className="h-9 text-sm"
                  />
                </div>

                {/* Modalidad — full width */}
                <div className="sm:col-span-2 space-y-1.5">
                  <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs uppercase tracking-wide text-muted-foreground">
                    Modalidad de la línea intervenida <span className="text-destructive">*</span>
                  </div>
                  <div className="flex gap-3">
                    {(["DIRECTA", "DIFERIDA"] as ModalidadLinea[]).map((mod) => {
                      const mc = MODALIDAD_CONFIG[mod]
                      const MIcon = mc.icon
                      const active = tel.modalidad === mod
                      return (
                        <button
                          key={mod}
                          type="button"
                          onClick={() => update(i, "modalidad", mod)}
                          className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                            active
                              ? mod === "DIRECTA"
                                ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                                : "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                              : "border-border text-muted-foreground hover:border-border/80"
                          }`}
                        >
                          <MIcon className="h-4 w-4" />
                          <div className="text-left">
                            <div>{mc.label}</div>
                            <div className="text-xs font-normal opacity-70">{mc.desc}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Fecha inicio */}
                <div className="space-y-1.5">
                  <Label htmlFor={`tel-${i}-fini`} className="text-xs uppercase tracking-wide text-muted-foreground">
                    Fecha de inicio
                  </Label>
                  <Input
                    id={`tel-${i}-fini`}
                    type="date"
                    value={tel.fecha_inicio || ""}
                    onChange={(e) => update(i, "fecha_inicio", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                {/* Fecha fin */}
                <div className="space-y-1.5">
                  <Label htmlFor={`tel-${i}-ffin`} className="text-xs uppercase tracking-wide text-muted-foreground">
                    Fecha de fin (si corresponde)
                  </Label>
                  <Input
                    id={`tel-${i}-ffin`}
                    type="date"
                    value={tel.fecha_fin || ""}
                    onChange={(e) => update(i, "fecha_fin", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                {/* Observaciones */}
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor={`tel-${i}-obs`} className="text-xs uppercase tracking-wide text-muted-foreground">
                    Observaciones
                  </Label>
                  <Textarea
                    id={`tel-${i}-obs`}
                    value={tel.observaciones || ""}
                    onChange={(e) => update(i, "observaciones", e.target.value)}
                    placeholder="Proveedor, juez autorizante, número de resolución..."
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
