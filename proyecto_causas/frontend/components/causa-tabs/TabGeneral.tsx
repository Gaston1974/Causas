"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  User,
  Building,
  Calendar,
  FileText,
  Hash,
  Gavel,
  Shield,
  Edit,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Causa } from "@/types/causa"

const ESTADO_CONFIG: Record<string, { label: string; color: string }> = {
  activa: { label: "Activa", color: "bg-green-100 text-green-800 border-green-300 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800" },
  archivada: { label: "Archivada", color: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800/60 dark:text-gray-300" },
  en_proceso: { label: "En Proceso", color: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800" },
  finalizada: { label: "Finalizada", color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400" },
}

interface TabGeneralProps {
  causa: Causa
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">{label}</p>
        <p className="text-sm text-foreground break-words">{value}</p>
      </div>
    </div>
  )
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="bg-card/80 border-border/60">
      <CardContent className="pt-4 pb-2 px-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">{title}</h3>
        {children}
      </CardContent>
    </Card>
  )
}

export function TabGeneral({ causa }: TabGeneralProps) {
  const estadoCfg = ESTADO_CONFIG[causa.estado] || { label: causa.estado, color: "" }

  return (
    <div className="space-y-5">
      {/* Header summary */}
      <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">N° Causa</span>
            <Badge variant="outline" className="font-mono text-xs">
              {causa.numero_causa}
            </Badge>
            <Badge className={`text-xs border ${estadoCfg.color}`}>{estadoCfg.label}</Badge>
          </div>
          <h2 className="text-base font-bold text-foreground leading-tight">{causa.nombre_fantasia}</h2>
          <p className="text-sm text-muted-foreground line-clamp-2">{causa.caratula}</p>
        </div>
        <Button asChild size="sm" variant="outline" className="shrink-0">
          <Link href={`/causas/${causa.id}/edit`}>
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Editar
          </Link>
        </Button>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Judicial */}
        <InfoCard title="Datos Judiciales">
          <InfoRow icon={Gavel} label="Juzgado" value={causa.juzgado} />
          <InfoRow icon={Building} label="Fiscalía" value={causa.fiscalia} />
          <InfoRow icon={User} label="Magistrado" value={causa.magistrado} />
        </InfoCard>

        {/* Preventores */}
        <InfoCard title="Personal Preventor">
          <InfoRow icon={Shield} label="Preventor" value={causa.preventor} />
          <InfoRow icon={User} label="Preventor Auxiliar" value={causa.preventor_auxiliar} />
        </InfoCard>

        {/* Identificadores */}
        <InfoCard title="Identificadores">
          <InfoRow icon={Hash} label="Nro. SGO" value={causa.nro_sgo} />
          <InfoRow icon={Hash} label="Nro. MTO" value={causa.nro_mto} />
          <InfoRow icon={FileText} label="Tipo de Delito" value={causa.tipo_delito || String(causa.tipo_delito_id || "")} />
        </InfoCard>

        {/* Ubicación */}
        <InfoCard title="Ubicación">
          <InfoRow icon={MapPin} label="Provincia" value={causa.provincia || String(causa.provincia_id || "")} />
          <InfoRow icon={MapPin} label="Localidad" value={causa.localidad || String(causa.localidad_id || "")} />
          <InfoRow icon={MapPin} label="Domicilio" value={causa.domicilio} />
        </InfoCard>

        {/* Fechas */}
        <InfoCard title="Fechas del Sistema">
          <InfoRow
            icon={Calendar}
            label="Fecha de Creación"
            value={format(new Date(causa.fecha_creacion), "dd/MM/yyyy HH:mm", { locale: es })}
          />
          <InfoRow
            icon={Calendar}
            label="Última Actualización"
            value={format(new Date(causa.fecha_actualizacion), "dd/MM/yyyy HH:mm", { locale: es })}
          />
        </InfoCard>

        {/* Providencia */}
        <InfoCard title="Providencia">
          <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {causa.providencia || "—"}
          </p>
        </InfoCard>
      </div>

      {/* Contenido Nota */}
      {causa.contenido_nota && (
        <InfoCard title="Notas / Observaciones">
          <p className="text-sm text-foreground/90 whitespace-pre-wrap">{causa.contenido_nota}</p>
        </InfoCard>
      )}
    </div>
  )
}
