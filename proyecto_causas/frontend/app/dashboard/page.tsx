"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, AlertCircle, CheckCircle, Activity, BarChart3 } from "lucide-react"
import { useCausas } from "@/hooks/use-causas"

// Recharts se carga de forma diferida para no bloquear el bundle inicial
const PieChart        = dynamic(() => import("recharts").then(m => ({ default: m.PieChart })),        { ssr: false })
const Pie             = dynamic(() => import("recharts").then(m => ({ default: m.Pie })),             { ssr: false })
const Cell            = dynamic(() => import("recharts").then(m => ({ default: m.Cell })),            { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then(m => ({ default: m.ResponsiveContainer })), { ssr: false })
const Tooltip         = dynamic(() => import("recharts").then(m => ({ default: m.Tooltip })),         { ssr: false })
const Legend          = dynamic(() => import("recharts").then(m => ({ default: m.Legend })),          { ssr: false })

export default function HomePage() {
  const { causas, fetchCausas, loading } = useCausas()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchCausas()
  }, [fetchCausas])

  // Calcular métricas
  const totalCausas = causas.filter((c: any) => c.tipo_delito?.toLowerCase().includes('causa') || c.caratula?.toLowerCase().includes('causa')).length
  const totalApoyo = causas.filter((c: any) => c.tipo_delito?.toLowerCase().includes('apoyo') || c.caratula?.toLowerCase().includes('apoyo')).length
  const causasActivas = causas.filter((c: any) => c.estado === 'activa').length
  const totalGeneral = causas.length

  // Datos para el gráfico
  const estadosData = [
    { name: 'Activas', value: causasActivas, color: '#3b82f6' }, // blue-500
    { name: 'Finalizadas', value: causas.filter((c: any) => c.estado === 'finalizada').length, color: '#22c55e' }, // green-500
    { name: 'En Proceso', value: causas.filter((c: any) => c.estado === 'en_proceso').length, color: '#eab308' }, // yellow-500
    { name: 'Archivadas', value: causas.filter((c: any) => c.estado === 'archivada').length, color: '#64748b' }, // slate-500
  ].filter(item => item.value > 0)

  // Actividad reciente (ordenada por fecha de creación descendente)
  const actividadReciente = [...causas]
    .sort((a: any, b: any) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
    .slice(0, 5)

  // Función para formatear fecha relativa simple
  const getRelativeTime = (dateString: string | Date) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Hace menos de un minuto'
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`
    return `Hace ${Math.floor(diffInSeconds / 86400)} días`
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Panel de Control</h1>
        <p className="text-muted-foreground">Resumen del sistema de gestión de causas legales</p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:shadow-primary/10 border-border/60 bg-card/80 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium tracking-tight">Total Causas</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold tracking-tighter">{loading ? "..." : totalCausas}</div>
            <p className="text-xs text-muted-foreground mt-1">Expedientes tipo Causa</p>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:shadow-primary/10 border-border/60 bg-card/80 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium tracking-tight">Total Apoyo</CardTitle>
            <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold tracking-tighter">{loading ? "..." : totalApoyo}</div>
            <p className="text-xs text-muted-foreground mt-1">Expedientes tipo Apoyo</p>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:shadow-primary/10 border-border/60 bg-card/80 backdrop-blur-sm relative">
          <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-l from-red-500/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium tracking-tight">Causas Activas</CardTitle>
            <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 animate-pulse">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold tracking-tighter">{loading ? "..." : causasActivas}</div>
            <p className="text-xs text-muted-foreground mt-1">Requieren seguimiento</p>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:shadow-primary/10 border-border/60 bg-card/80 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium tracking-tight">Total General</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <BarChart3 className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold tracking-tighter">{loading ? "..." : totalGeneral}</div>
            <p className="text-xs text-muted-foreground mt-1">Registros totales</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Distribución */}
        <Card className="col-span-1 border-border/60 bg-card/80 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="tracking-tight">Distribución por Estado</CardTitle>
            <CardDescription>Visualización del estado actual de los expedientes</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] -z-10 m-auto h-[200px] w-[200px]" />
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-pulse">
                <Activity className="h-8 w-8 mb-2 opacity-50" />
                <p>Cargando métricas...</p>
              </div>
            ) : estadosData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={estadosData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {estadosData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} expedientes`, 'Cantidad']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">No hay datos suficientes</div>
            )}
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card className="col-span-1 border-border/60 bg-card/80 backdrop-blur-sm shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="tracking-tight">Actividad Reciente</CardTitle>
            <CardDescription>Últimos movimientos registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 h-full text-muted-foreground animate-pulse">
                  <Activity className="h-8 w-8 mb-2 opacity-50" />
                  <p>Cargando actividad...</p>
                </div>
              ) : actividadReciente.length > 0 ? (
                actividadReciente.map((causa, i) => (
                  <div key={causa.id || i} className="group relative flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border-b border-border/40 last:border-0 cursor-default">
                    <div className="mt-1 relative flex items-center justify-center h-3 w-3">
                      <div className={`absolute w-full h-full rounded-full opacity-40 group-hover:animate-ping ${causa.estado === 'activa' ? 'bg-blue-500' :
                        causa.estado === 'finalizada' ? 'bg-green-500' :
                          causa.estado === 'en_proceso' ? 'bg-yellow-500' : 'bg-slate-500'
                        }`} />
                      <div className={`relative z-10 w-2 h-2 rounded-full shadow-sm ${causa.estado === 'activa' ? 'bg-blue-500' :
                        causa.estado === 'finalizada' ? 'bg-green-500' :
                          causa.estado === 'en_proceso' ? 'bg-yellow-500' : 'bg-slate-500'
                        }`} />
                    </div>
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <p className="text-sm font-semibold leading-none truncate group-hover:text-primary transition-colors">
                        {causa.numero_causa ? `Causa ${causa.numero_causa}` : 'Nueva Causa'}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {causa.caratula}
                      </p>
                    </div>
                    <div className="pl-2">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider whitespace-nowrap bg-muted/50 px-2 py-1 rounded-md">
                        {getRelativeTime(causa.fecha_creacion)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full py-10 text-muted-foreground">No hay actividad reciente</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}