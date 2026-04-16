"use client"

import { useState, forwardRef, useImperativeHandle } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Link2, ExternalLink, Info } from "lucide-react"
import type { CausaSGO } from "@/types/causa-extras"

const emptySGO = (causaId: string): CausaSGO => ({
  _id: crypto.randomUUID(),
  causa_id: causaId,
  nro_sgo: "",
  descripcion: "",
  fecha_vinculacion: "",
  observaciones: "",
})

export interface TabSGORef {
  getData: () => CausaSGO[]
}

interface TabSGOProps {
  causaId: string
  initialData?: CausaSGO[]
}

export const TabSGO = forwardRef<TabSGORef, TabSGOProps>(
  function TabSGO({ causaId, initialData = [] }, ref) {
  const [sgos, setSgos] = useState<CausaSGO[]>(initialData)

  useImperativeHandle(ref, () => ({ getData: () => sgos }))

  const add = () => setSgos((p) => [...p, emptySGO(causaId)])
  const remove = (i: number) => setSgos((p) => p.filter((_, idx) => idx !== i))
  const update = (i: number, field: keyof CausaSGO, value: any) =>
    setSgos((p) => p.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)))

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            Vinculación SGO — Causa
          </h3>
          <p className="text-xs text-muted-foreground">
            Asocie uno o más números SGO del sistema externo a esta causa.
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
          Vincular SGO
        </Button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/40 text-xs text-blue-700 dark:text-blue-400">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Sistema SGO externo:</span> Los datos del SGO se consultarán
          directamente en el sistema SGO. Aquí se registra únicamente la vinculación entre el número
          SGO y esta causa.
        </div>
      </div>

      {/* Summary */}
      {sgos.length > 0 && (
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/10 text-primary border-primary/30">
            {sgos.length} SGO{sgos.length !== 1 ? "s" : ""} vinculado{sgos.length !== 1 ? "s" : ""}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {sgos.map((s) => s.nro_sgo).filter(Boolean).join(" · ")}
          </span>
        </div>
      )}

      {/* Empty state */}
      {sgos.length === 0 && (
        <div className="border-2 border-dashed border-border/50 rounded-xl py-10 flex flex-col items-center gap-2 text-muted-foreground">
          <Link2 className="h-8 w-8 opacity-20" />
          <p className="text-sm">No hay SGOs vinculados a esta causa.</p>
          <Button type="button" variant="ghost" size="sm" onClick={add} className="text-primary mt-1">
            <Plus className="h-4 w-4 mr-1" /> Vincular primer SGO
          </Button>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-3">
        {sgos.map((sgo, i) => (
          <div key={sgo._id || sgo.nro_sgo || i} className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">
                  {sgo.nro_sgo ? (
                    <span className="font-mono">SGO: {sgo.nro_sgo}</span>
                  ) : (
                    <span className="text-muted-foreground font-normal">Nuevo SGO</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {sgo.nro_sgo && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                    title="Ver en SGO"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                )}
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
            </div>

            {/* Body */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Nro SGO */}
              <div className="space-y-1.5">
                <Label htmlFor={`sgo-nro-${i}`} className="text-xs uppercase tracking-wide text-muted-foreground">
                  Número SGO <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`sgo-nro-${i}`}
                  value={sgo.nro_sgo}
                  onChange={(e) => update(i, "nro_sgo", e.target.value)}
                  placeholder="SGO-2024-00123"
                  className="h-9 text-sm font-mono"
                />
              </div>

              {/* Fecha vinculación */}
              <div className="space-y-1.5">
                <Label htmlFor={`sgo-fvin-${i}`} className="text-xs uppercase tracking-wide text-muted-foreground">
                  Fecha de vinculación
                </Label>
                <Input
                  id={`sgo-fvin-${i}`}
                  type="date"
                  value={sgo.fecha_vinculacion || ""}
                  onChange={(e) => update(i, "fecha_vinculacion", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              {/* Descripción */}
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor={`sgo-desc-${i}`} className="text-xs uppercase tracking-wide text-muted-foreground">
                  Descripción de la vinculación
                </Label>
                <Textarea
                  id={`sgo-desc-${i}`}
                  value={sgo.descripcion || ""}
                  onChange={(e) => update(i, "descripcion", e.target.value)}
                  placeholder="¿Por qué se vincula este SGO a esta causa?"
                  className="min-h-[60px] text-sm resize-none"
                />
              </div>

              {/* Observaciones */}
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor={`sgo-obs-${i}`} className="text-xs uppercase tracking-wide text-muted-foreground">
                  Observaciones
                </Label>
                <Textarea
                  id={`sgo-obs-${i}`}
                  value={sgo.observaciones || ""}
                  onChange={(e) => update(i, "observaciones", e.target.value)}
                  placeholder="Notas adicionales..."
                  className="min-h-[50px] text-sm resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  }
)
