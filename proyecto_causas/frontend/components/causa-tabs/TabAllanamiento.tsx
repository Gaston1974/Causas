"use client"

import { useState, forwardRef, useImperativeHandle } from "react"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  Crosshair,
  Car,
  Cigarette,
  Pill,
  DollarSign,
  UserX,
  HeartHandshake,
  Laptop,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { ItemListEditor } from "@/components/ItemListEditor"
import type { AllanamientoState } from "@/types/allanamiento"

const EMPTY_STATE: AllanamientoState = {
  cabecera: { causa_id: "", positivo: false },
  domicilios: [],
  armas: [],
  vehiculos: [],
  cigarrillos: [],
  estupefacientes: [],
  divisas: [],
  detenidos: [],
  rescatados: [],
  tecnologia: [],
}

export interface TabAllanamientoRef {
  getData: () => AllanamientoState
}

interface TabAllanamientoProps {
  causaId: string
  initialData?: Partial<AllanamientoState>
}

export const TabAllanamiento = forwardRef<TabAllanamientoRef, TabAllanamientoProps>(
  function TabAllanamiento({ causaId, initialData }, ref) {
  const [state, setState] = useState<AllanamientoState>({
    ...EMPTY_STATE,
    ...initialData,
    cabecera: {
      ...EMPTY_STATE.cabecera,
      causa_id: causaId,
      ...initialData?.cabecera,
    },
  })

  useImperativeHandle(ref, () => ({ getData: () => state }))

  const setPositivo = (v: boolean) =>
    setState((p) => ({ ...p, cabecera: { ...p.cabecera, positivo: v } }))

  const listUpdater =
    <K extends keyof Omit<AllanamientoState, "cabecera">>(key: K) =>
    (items: AllanamientoState[K]) =>
      setState((p) => ({ ...p, [key]: items }))

  const makeHandlers = <T extends Record<string, any>>(key: keyof Omit<AllanamientoState, "cabecera">) => {
    const list = state[key] as unknown as T[]
    return {
      items: list,
      onAdd: (item: T) => setState((p) => ({ ...p, [key]: [...(p[key] as unknown as T[]), item] })),
      onRemove: (i: number) =>
        setState((p) => ({ ...p, [key]: (p[key] as unknown as T[]).filter((_, idx) => idx !== i) })),
      onUpdate: (i: number, item: T) =>
        setState((p) => ({
          ...p,
          [key]: (p[key] as unknown as T[]).map((x, idx) => (idx === i ? item : x)),
        })),
    }
  }

  const positivo = state.cabecera.positivo

  const totalSecuestros =
    state.armas.length +
    state.vehiculos.length +
    state.cigarrillos.length +
    state.estupefacientes.length +
    state.divisas.length

  return (
    <div className="space-y-6">
      {/* ─── Cabecera: Positivo/Negativo ─── */}
      <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-border/60 bg-muted/20">
        <div className="space-y-0.5">
          <h3 className="text-base font-semibold">Resultado del Allanamiento</h3>
          <p className="text-sm text-muted-foreground">
            Indique si el allanamiento fue positivo para habilitar los campos de secuestros.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {positivo ? (
            <Badge className="gap-1.5 bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-300">
              <CheckCircle2 className="h-3.5 w-3.5" /> Positivo
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1.5 text-muted-foreground">
              <XCircle className="h-3.5 w-3.5" /> Negativo
            </Badge>
          )}
          <Switch
            checked={positivo}
            onCheckedChange={setPositivo}
            id="allanamiento-positivo"
          />
        </div>
      </div>

      {/* Fecha + observaciones generales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="alla-fecha" className="text-xs uppercase tracking-wide text-muted-foreground">
            Fecha del allanamiento
          </Label>
          <Input
            id="alla-fecha"
            type="date"
            value={state.cabecera.fecha_allanamiento || ""}
            onChange={(e) =>
              setState((p) => ({
                ...p,
                cabecera: { ...p.cabecera, fecha_allanamiento: e.target.value },
              }))
            }
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="alla-obs" className="text-xs uppercase tracking-wide text-muted-foreground">
            Observaciones generales
          </Label>
          <Textarea
            id="alla-obs"
            value={state.cabecera.observaciones || ""}
            onChange={(e) =>
              setState((p) => ({
                ...p,
                cabecera: { ...p.cabecera, observaciones: e.target.value },
              }))
            }
            placeholder="Observaciones del procedimiento..."
            className="h-9 text-sm resize-none"
          />
        </div>
      </div>

      {/* ─── SECCIONES POSITIVO ─── */}
      {positivo && (
        <div className="space-y-8">
          {/* Summary bar */}
          <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/40 text-xs">
            <span className="font-semibold text-green-700 dark:text-green-400">Secuestros registrados:</span>
            {[
              { icon: Home, label: "Domicilios", count: state.domicilios.length },
              { icon: Crosshair, label: "Armas", count: state.armas.length },
              { icon: Car, label: "Vehículos", count: state.vehiculos.length },
              { icon: Cigarette, label: "Cigarrillos", count: state.cigarrillos.length },
              { icon: Pill, label: "Estupefacientes", count: state.estupefacientes.length },
              { icon: DollarSign, label: "Divisas", count: state.divisas.length },
              { icon: UserX, label: "Detenidos", count: state.detenidos.length },
              { icon: HeartHandshake, label: "Rescatados", count: state.rescatados.length },
              { icon: Laptop, label: "Tecnología", count: state.tecnologia.length },
            ].map(({ icon: Icon, label, count }) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  count > 0
                    ? "bg-green-200/70 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-3 w-3" />
                {label}: <strong>{count}</strong>
              </span>
            ))}
          </div>

          {/* 1. Domicilios */}
          <ItemListEditor
            title="Domicilios de Allanamiento"
            icon={<Home className="h-4 w-4" />}
            {...makeHandlers("domicilios")}
            addLabel="Agregar domicilio"
            emptyMessage="No hay domicilios de allanamiento registrados."
            fields={[
              { name: "calles", label: "Calles / Dirección", type: "text", placeholder: "Av. San Martín 1234", required: true },
              { name: "partido", label: "Partido", type: "text", placeholder: "General Obligado" },
              { name: "provincia", label: "Provincia", type: "text", placeholder: "Santa Fe", required: true },
              { name: "localidad", label: "Localidad", type: "text", placeholder: "Reconquista" },
              { name: "latitud", label: "Latitud (GPS)", type: "text", placeholder: "-29.1234" },
              { name: "longitud", label: "Longitud (GPS)", type: "text", placeholder: "-59.5678" },
            ]}
          />

          <Separator />

          {/* 2. Armas */}
          <ItemListEditor
            title="Armas Secuestradas"
            icon={<Crosshair className="h-4 w-4" />}
            {...makeHandlers("armas")}
            addLabel="Agregar arma"
            emptyMessage="No hay armas secuestradas registradas."
            fields={[
              { name: "tipo_arma", label: "Tipo de arma", type: "text", placeholder: "Pistola, Escopeta, Rifle...", required: true },
              { name: "calibre", label: "Calibre", type: "text", placeholder: "9mm, .38, 12..." },
              { name: "marca", label: "Marca", type: "text", placeholder: "Bersa, Glock..." },
              { name: "origen", label: "Origen", type: "select", options: [
                { value: "NACIONAL", label: "Nacional" },
                { value: "EXTRANJERO", label: "Extranjero" },
                { value: "INDETERMINADO", label: "Indeterminado" },
              ]},
              { name: "asociado_delito", label: "Asociado a otro delito", type: "text", placeholder: "Homicidio, Robo..." },
              { name: "deposito_judicial", label: "Depósito judicial (Unidad o Magistrado)", type: "text", placeholder: "Unidad X / Juzgado Federal N...", colSpan: 2 },
            ]}
          />

          <Separator />

          {/* 3. Vehículos */}
          <ItemListEditor
            title="Vehículos Secuestrados"
            icon={<Car className="h-4 w-4" />}
            {...makeHandlers("vehiculos")}
            addLabel="Agregar vehículo"
            emptyMessage="No hay vehículos secuestrados registrados."
            fields={[
              { name: "tipo_vehiculo", label: "Tipo de vehículo", type: "select", options: [
                { value: "AUTO", label: "Automóvil" },
                { value: "CAMIONETA", label: "Camioneta/SUV" },
                { value: "MOTO", label: "Motocicleta" },
                { value: "CAMION", label: "Camión" },
                { value: "BOTE", label: "Embarcación" },
                { value: "OTRO", label: "Otro" },
              ], required: true},
              { name: "marca", label: "Marca", type: "text", placeholder: "Ford, Chevrolet..." },
              { name: "modelo", label: "Modelo", type: "text", placeholder: "Focus, Amarok..." },
              { name: "origen", label: "Origen", type: "select", options: [
                { value: "NACIONAL", label: "Nacional" },
                { value: "EXTRANJERO", label: "Extranjero" },
                { value: "INDETERMINADO", label: "Indeterminado" },
              ]},
              { name: "asociado_delito", label: "Asociado a tipo de delito", type: "text", placeholder: "Tráfico, contrabando..." },
              { name: "deposito_judicial", label: "Depósito judicial (Unidad o Magistrado)", type: "text", placeholder: "Unidad X / Juzgado Federal N...", colSpan: 2 },
            ]}
          />

          <Separator />

          {/* 4. Cigarrillos */}
          <ItemListEditor
            title="Cigarrillos Secuestrados"
            icon={<Cigarette className="h-4 w-4" />}
            {...makeHandlers("cigarrillos")}
            addLabel="Agregar lote de cigarrillos"
            emptyMessage="No hay cigarrillos secuestrados registrados."
            fields={[
              { name: "tipo_cigarrillo", label: "Tipo de cigarrillo", type: "select", options: [
                { value: "ELECTRONICO", label: "Electrónico" },
                { value: "TRADICIONAL", label: "Tradicional" },
              ], required: true},
              { name: "marca", label: "Marca", type: "text", placeholder: "Marlboro, IQOS..." },
              { name: "unidad", label: "Unidad / Cantidad", type: "text", placeholder: "500 paquetes, 10 cajas..." },
              { name: "origen", label: "Origen", type: "select", options: [
                { value: "NACIONAL", label: "Nacional" },
                { value: "EXTRANJERO", label: "Extranjero" },
                { value: "INDETERMINADO", label: "Indeterminado" },
              ]},
              { name: "deposito_judicial", label: "Depósito judicial", type: "text", placeholder: "Unidad X / Juzgado Federal N...", colSpan: 2 },
            ]}
          />

          <Separator />

          {/* 5. Estupefacientes */}
          <ItemListEditor
            title="Estupefacientes Secuestrados"
            icon={<Pill className="h-4 w-4" />}
            {...makeHandlers("estupefacientes")}
            addLabel="Agregar estupefaciente"
            emptyMessage="No hay estupefacientes secuestrados registrados."
            fields={[
              { name: "tipo_estupefaciente", label: "Tipo de estupefaciente", type: "select", options: [
                { value: "MARIHUANA", label: "Marihuana" },
                { value: "COCAINA", label: "Cocaína" },
                { value: "EXTASIS", label: "Éxtasis" },
                { value: "HEROINA", label: "Heroína" },
                { value: "METANFETAMINA", label: "Metanfetamina" },
                { value: "OTRO", label: "Otro" },
              ], required: true},
              { name: "cantidad_kgs", label: "Cantidad (Kgs / Gr / Unidades)", type: "text", placeholder: "1.5 Kg, 200gr...", required: true },
              { name: "origen", label: "Origen", type: "select", options: [
                { value: "NACIONAL", label: "Nacional" },
                { value: "EXTRANJERO", label: "Extranjero" },
                { value: "INDETERMINADO", label: "Indeterminado" },
              ]},
              { name: "deposito_judicial", label: "Depósito judicial", type: "text", placeholder: "Unidad X / Juzgado Federal N...", colSpan: 2 },
            ]}
          />

          <Separator />

          {/* 6. Divisas */}
          <ItemListEditor
            title="Divisas Secuestradas"
            icon={<DollarSign className="h-4 w-4" />}
            {...makeHandlers("divisas")}
            addLabel="Agregar divisa"
            emptyMessage="No hay divisas secuestradas registradas."
            fields={[
              { name: "tipo_divisa", label: "Tipo de divisa", type: "select", options: [
                { value: "PESOS", label: "Pesos Argentinos ($)" },
                { value: "DOLAR", label: "Dólar (USD)" },
                { value: "EUROS", label: "Euro (EUR)" },
                { value: "REALES", label: "Real Brasileño (BRL)" },
                { value: "OTRA", label: "Otra" },
              ], required: true},
              { name: "cantidad", label: "Cantidad / Monto", type: "text", placeholder: "USD 50.000", required: true },
              { name: "origen", label: "Origen", type: "select", options: [
                { value: "NACIONAL", label: "Nacional" },
                { value: "EXTRANJERO", label: "Extranjero" },
                { value: "INDETERMINADO", label: "Indeterminado" },
              ]},
              { name: "deposito_judicial", label: "Depósito judicial", type: "text", placeholder: "Unidad X / Juzgado Federal N...", colSpan: 2 },
            ]}
          />

          <Separator />

          {/* 7. Detenidos */}
          <ItemListEditor
            title="Personas Detenidas en el Allanamiento"
            icon={<UserX className="h-4 w-4" />}
            {...makeHandlers("detenidos")}
            addLabel="Agregar detenido"
            emptyMessage="No hay detenidos registrados en este allanamiento."
            fields={[
              { name: "nombre_apellido", label: "Nombre y Apellido", type: "text", placeholder: "Juan Pérez", required: true, colSpan: 2 },
              { name: "dni", label: "DNI", type: "text", placeholder: "12.345.678", required: true },
              { name: "edad", label: "Edad", type: "number", placeholder: "35" },
              { name: "nacionalidad", label: "Nacionalidad", type: "text", placeholder: "Argentina" },
              { name: "estado_detencion", label: "Estado de detención", type: "select", options: [
                { value: "DETENIDO", label: "Detenido" },
                { value: "A DISPOSICION", label: "A disposición del Juzgado" },
                { value: "LIBERADO", label: "Liberado" },
                { value: "EN PROCESO", label: "En proceso judicial" },
              ]},
            ]}
          />

          <Separator />

          {/* 8. Rescatados (Trata) */}
          <ItemListEditor
            title="Personas Rescatadas (Trata de Personas)"
            icon={<HeartHandshake className="h-4 w-4" />}
            {...makeHandlers("rescatados")}
            addLabel="Agregar persona rescatada"
            emptyMessage="No hay personas rescatadas registradas."
            fields={[
              { name: "sexo", label: "Sexo", type: "select", options: [
                { value: "FEMENINO", label: "Femenino" },
                { value: "MASCULINO", label: "Masculino" },
                { value: "NO BINARIO", label: "No Binario" },
                { value: "OTRO", label: "Otro / Sin datos" },
              ], required: true},
              { name: "edad", label: "Edad (o rango estimado)", type: "text", placeholder: "25 / 20-25" },
              { name: "nacionalidad", label: "Nacionalidad", type: "text", placeholder: "Argentina, Paraguay..." },
            ]}
          />

          <Separator />

          {/* 9. Tecnología */}
          <ItemListEditor
            title="Elementos Tecnológicos Secuestrados"
            icon={<Laptop className="h-4 w-4" />}
            {...makeHandlers("tecnologia")}
            addLabel="Agregar elemento"
            emptyMessage="No hay elementos tecnológicos secuestrados registrados."
            fields={[
              { name: "tipo_objeto", label: "Tipo de objeto", type: "select", options: [
                { value: "PENDRIVE", label: "Pendrive / Memoria USB" },
                { value: "CD/DVD", label: "CD / DVD" },
                { value: "PC/NOTEBOOK", label: "PC / Notebook / Laptop" },
                { value: "CELULAR", label: "Teléfono celular / Smartphone" },
                { value: "TABLET", label: "Tablet" },
                { value: "DISCO RIGIDO", label: "Disco rígido / SSD" },
                { value: "SERVIDOR", label: "Servidor" },
                { value: "OTRO", label: "Otro" },
              ], required: true},
              { name: "marca", label: "Marca", type: "text", placeholder: "Samsung, Apple, SanDisk..." },
              { name: "modelo", label: "Modelo / Descripción", type: "text", placeholder: "Galaxy S22, MacBook Pro..." },
            ]}
          />
        </div>
      )}

      {/* Negativo: mensaje informativo */}
      {!positivo && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-muted-foreground/20 bg-muted/20 text-sm text-muted-foreground">
          <XCircle className="h-5 w-5 shrink-0 text-muted-foreground/50" />
          <span>
            Active el switch de "Resultado Positivo" para habilitar los campos de domicilios, secuestros,
            detenidos y personas rescatadas.
          </span>
        </div>
      )}
    </div>
  )
  }
)
