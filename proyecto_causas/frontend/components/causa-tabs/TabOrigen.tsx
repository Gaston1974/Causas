"use client"

import { useState, forwardRef, useImperativeHandle } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Building2, Scale, MessageSquareWarning } from "lucide-react"
import type { CausaOrigen, OrigenTipo } from "@/types/causa-extras"

export interface TabOrigenRef {
  getData: () => CausaOrigen
}

interface TabOrigenProps {
  causaId: string
  initialData?: Partial<CausaOrigen>
}

export const TabOrigen = forwardRef<TabOrigenRef, TabOrigenProps>(
  function TabOrigen({ causaId, initialData }, ref) {
    const [data, setData] = useState<CausaOrigen>({
      causa_id: causaId,
      origen_tipo: (initialData?.origen_tipo as OrigenTipo) || "UNIDAD",
      subtipo_unidad: initialData?.subtipo_unidad || "NOTITIA_CRIMINIS",
      descripcion_unidad: initialData?.descripcion_unidad || "",
      denuncia_anonima: initialData?.denuncia_anonima || false,
      descripcion_judicatura: initialData?.descripcion_judicatura || "",
      observaciones: initialData?.observaciones || "",
    })

    useImperativeHandle(ref, () => ({
      getData: () => data,
    }))

    const update = (field: keyof CausaOrigen, value: any) =>
      setData((prev) => ({ ...prev, [field]: value }))

    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            ¿Cómo fue iniciada la causa?
          </div>
          <RadioGroup
            value={data.origen_tipo}
            onValueChange={(v) => update("origen_tipo", v as OrigenTipo)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <label
              htmlFor="origen-unidad"
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                data.origen_tipo === "UNIDAD"
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40 hover:bg-muted/30"
              }`}
            >
              <RadioGroupItem value="UNIDAD" id="origen-unidad" className="mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  Iniciada por la Unidad
                </div>
                <p className="text-xs text-muted-foreground">
                  Notitia Criminis, Registro de Informante u otras razones internas.
                </p>
              </div>
            </label>

            <label
              htmlFor="origen-judicatura"
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                data.origen_tipo === "JUDICATURA"
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40 hover:bg-muted/30"
              }`}
            >
              <RadioGroupItem value="JUDICATURA" id="origen-judicatura" className="mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Scale className="h-4 w-4 text-purple-500" />
                  Por Judicatura
                </div>
                <p className="text-xs text-muted-foreground">
                  Aperturada por orden judicial, incluyendo posible denuncia anónima.
                </p>
              </div>
            </label>
          </RadioGroup>
        </div>

        {data.origen_tipo === "UNIDAD" && (
          <Card className="border-blue-200/60 dark:border-blue-800/40 bg-blue-50/30 dark:bg-blue-950/20">
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                <Building2 className="h-4 w-4" />
                Detalle — Iniciada por la Unidad
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs uppercase tracking-wide text-muted-foreground">Modalidad de inicio</div>
                <RadioGroup
                  value={data.subtipo_unidad}
                  onValueChange={(v) => update("subtipo_unidad", v as any)}
                  className="flex flex-wrap gap-3"
                >
                  {[
                    { value: "NOTITIA_CRIMINIS",    label: "Notitia Criminis"    },
                    { value: "REGISTRO_INFORMANTE", label: "Registro de Informante" },
                    { value: "OTRA",                label: "Otra"                },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer text-sm transition-all ${
                        data.subtipo_unidad === opt.value
                          ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-medium"
                          : "border-border hover:border-blue-300 text-muted-foreground"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} className="sr-only" />
                      {opt.label}
                      {data.subtipo_unidad === opt.value && (
                        <Badge variant="secondary" className="ml-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">✓</Badge>
                      )}
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="desc-unidad" className="text-xs uppercase tracking-wide text-muted-foreground">Descripción / Detalle</Label>
                <Textarea
                  id="desc-unidad"
                  value={data.descripcion_unidad}
                  onChange={(e) => update("descripcion_unidad", e.target.value)}
                  placeholder="Describir cómo fue iniciada la causa por la unidad..."
                  className="min-h-[80px] resize-none text-sm"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {data.origen_tipo === "JUDICATURA" && (
          <Card className="border-purple-200/60 dark:border-purple-800/40 bg-purple-50/30 dark:bg-purple-950/20">
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-sm">
                <Scale className="h-4 w-4" />
                Detalle — Por Judicatura
              </div>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-purple-200/60 bg-white/50 dark:bg-white/5 cursor-pointer hover:bg-purple-50/50 transition-all">
                <Checkbox
                  id="denuncia-anonima"
                  checked={data.denuncia_anonima}
                  onCheckedChange={(v) => update("denuncia_anonima", v)}
                  className="mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquareWarning className="h-4 w-4 text-amber-500" />
                    Aperturada por Denuncia Anónima
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Marcar si la causa fue abierta a partir de una denuncia de identidad desconocida.
                  </p>
                </div>
              </label>

              <div className="space-y-1.5">
                <Label htmlFor="desc-judicatura" className="text-xs uppercase tracking-wide text-muted-foreground">Descripción / Orden judicial</Label>
                <Textarea
                  id="desc-judicatura"
                  value={data.descripcion_judicatura}
                  onChange={(e) => update("descripcion_judicatura", e.target.value)}
                  placeholder="N° de expediente, juzgado interviniente, fecha de la orden, etc."
                  className="min-h-[80px] resize-none text-sm"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="obs-origen" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Observaciones generales</Label>
          <Textarea
            id="obs-origen"
            value={data.observaciones}
            onChange={(e) => update("observaciones", e.target.value)}
            placeholder="Observaciones adicionales sobre el origen de la causa..."
            className="min-h-[72px] resize-none text-sm"
          />
        </div>
      </div>
    )
  }
)
