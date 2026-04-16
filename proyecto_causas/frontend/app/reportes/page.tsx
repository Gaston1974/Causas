"use client"

import { useEffect, useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart3, PieChart, TrendingUp, FileText, Users, Calendar, FileSpreadsheet, Printer, X } from "lucide-react"
import { useCausas } from "@/hooks/use-causas"
import { useCausasContext } from "@/contexts/causas-context"
import { exportToPDF, exportToExcel } from "@/lib/export-utils"

// Recharts se carga de forma diferida para no bloquear el bundle inicial
const BarChart             = dynamic(() => import("recharts").then(m => ({ default: m.BarChart })),            { ssr: false })
const Bar                  = dynamic(() => import("recharts").then(m => ({ default: m.Bar })),                 { ssr: false })
const XAxis                = dynamic(() => import("recharts").then(m => ({ default: m.XAxis })),               { ssr: false })
const YAxis                = dynamic(() => import("recharts").then(m => ({ default: m.YAxis })),               { ssr: false })
const CartesianGrid        = dynamic(() => import("recharts").then(m => ({ default: m.CartesianGrid })),       { ssr: false })
const Tooltip              = dynamic(() => import("recharts").then(m => ({ default: m.Tooltip })),             { ssr: false })
const Legend               = dynamic(() => import("recharts").then(m => ({ default: m.Legend })),              { ssr: false })
const ResponsiveContainer  = dynamic(() => import("recharts").then(m => ({ default: m.ResponsiveContainer })), { ssr: false })
const RechartsPieChart     = dynamic(() => import("recharts").then(m => ({ default: m.PieChart })),            { ssr: false })
const Pie                  = dynamic(() => import("recharts").then(m => ({ default: m.Pie })),                 { ssr: false })
const Cell                 = dynamic(() => import("recharts").then(m => ({ default: m.Cell })),                { ssr: false })

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function ReportesPage() {
  const { causas, fetchCausas, loading } = useCausas()
  const { state } = useCausasContext()

  // Filtro de fechas
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")

  // Asegurarnos de tener datos actualizados al montar
  useEffect(() => {
    fetchCausas()
  }, [fetchCausas])

  // Filtrar causas por rango de fechas
  const causasFiltradas = useMemo(() => {
    if (!fechaDesde && !fechaHasta) return causas
    return causas.filter((c: any) => {
      if (!c.fecha_creacion) return false
      const fecha = new Date(c.fecha_creacion)
      if (fechaDesde && fecha < new Date(fechaDesde)) return false
      if (fechaHasta) {
        const hasta = new Date(fechaHasta)
        hasta.setHours(23, 59, 59, 999)
        if (fecha > hasta) return false
      }
      return true
    })
  }, [causas, fechaDesde, fechaHasta])

  // Handlers de exportación
  const handleExportPDF = () => {
    exportToPDF(causasFiltradas, fechaDesde || undefined, fechaHasta || undefined)
  }

  const handleExportExcel = () => {
    exportToExcel(causasFiltradas, fechaDesde || undefined, fechaHasta || undefined)
  }

  const handleClearDates = () => {
    setFechaDesde("")
    setFechaHasta("")
  }

  // Calcular métricas (usando causas filtradas)
  const metricas = {
    total: causasFiltradas.length,
    causas: causasFiltradas.filter((c: any) => c.tipo_delito?.toLowerCase().includes('causa') || c.caratula?.toLowerCase().includes('causa')).length,
    apoyo: causasFiltradas.filter((c: any) => c.tipo_delito?.toLowerCase().includes('apoyo') || c.caratula?.toLowerCase().includes('apoyo')).length,

    // Por año
    anio2024: causasFiltradas.filter((c: any) => {
      const fecha = new Date(c.fecha_creacion)
      return fecha.getFullYear() === 2024
    }).length,
    anio2025: causasFiltradas.filter((c: any) => {
      const fecha = new Date(c.fecha_creacion)
      return fecha.getFullYear() === 2025
    }).length,
    anio2026: causasFiltradas.filter((c: any) => {
      const fecha = new Date(c.fecha_creacion)
      return fecha.getFullYear() === 2026
    }).length,

    // Por preventor
    preventores: causasFiltradas.reduce((acc: Record<string, number>, curr: any) => {
      if (curr.preventor) {
        acc[curr.preventor] = (acc[curr.preventor] || 0) + 1
      }
      return acc
    }, {}),

    // Por preventor auxiliar
    preventoresAux: causasFiltradas.reduce((acc: Record<string, number>, curr: any) => {
      if (curr.preventor_auxiliar) {
        acc[curr.preventor_auxiliar] = (acc[curr.preventor_auxiliar] || 0) + 1
      }
      return acc
    }, {}),

    // Por preventor 2024
    preventores2024: causasFiltradas.filter((c: any) => new Date(c.fecha_creacion).getFullYear() === 2024).reduce((acc: Record<string, number>, curr: any) => {
      if (curr.preventor) {
        acc[curr.preventor] = (acc[curr.preventor] || 0) + 1
      }
      return acc
    }, {}),

    // Por preventor 2025
    preventores2025: causasFiltradas.filter((c: any) => new Date(c.fecha_creacion).getFullYear() === 2025).reduce((acc: Record<string, number>, curr: any) => {
      if (curr.preventor) {
        acc[curr.preventor] = (acc[curr.preventor] || 0) + 1
      }
      return acc
    }, {})
  }

  // Convertir mapas a arrays ordenados
  const topPreventores = Object.entries(metricas.preventores)
    .sort(([, a], [, b]) => (b as number) - (a as number))

  const topPreventoresAux = Object.entries(metricas.preventoresAux)
    .sort(([, a], [, b]) => (b as number) - (a as number))

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const dataAnualMensual = months.map((month, index) => {
    const data: any = { name: month, '2024': 0, '2025': 0, '2026': 0 };
    causasFiltradas.forEach((c: any) => {
      if (!c.fecha_creacion) return;
      const fecha = new Date(c.fecha_creacion);
      if (fecha.getMonth() === index) {
        const year = fecha.getFullYear();
        if (year === 2024 || year === 2025 || year === 2026) {
          data[year] += 1;
        }
      }
    });
    return data;
  });

  const dataPreventores = topPreventores.map(([name, value]) => ({
    name,
    value
  }))

  const topPreventores2024 = Object.entries(metricas.preventores2024)
    .sort(([, a], [, b]) => (b as number) - (a as number))

  const topPreventores2025 = Object.entries(metricas.preventores2025)
    .sort(([, a], [, b]) => (b as number) - (a as number))

  const dataPreventores2024 = topPreventores2024.map(([name, value]) => ({
    name,
    value
  }))

  const dataPreventores2025 = topPreventores2025.map(([name, value]) => ({
    name,
    value
  }))

  if (loading && causas.length === 0) {
    return <div className="p-8 text-center">Cargando reportes...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reportes y Métricas</h1>
          <p className="text-muted-foreground">Análisis de causas, carga de trabajo y estadísticas anuales</p>
        </div>
      </div>

      {/* ── Barra de filtros y exportación ── */}
      <Card className="border-dashed">
        <CardContent className="pt-6 pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            {/* Filtro de fechas */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fechaDesde" className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Desde
                </label>
                <Input
                  id="fechaDesde"
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="w-[180px]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fechaHasta" className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Hasta
                </label>
                <Input
                  id="fechaHasta"
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="w-[180px]"
                />
              </div>
              {(fechaDesde || fechaHasta) && (
                <Button variant="ghost" size="sm" onClick={handleClearDates} className="text-muted-foreground hover:text-destructive">
                  <X className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>

            {/* Botones de exportación */}
            <div className="flex gap-2">
              <Button onClick={handleExportPDF} variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Exportar PDF
              </Button>
              <Button onClick={handleExportExcel} variant="outline" className="gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950">
                <FileSpreadsheet className="h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
          </div>

          {(fechaDesde || fechaHasta) && (
            <div className="mt-3 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md px-3 py-2">
              Mostrando <span className="font-semibold text-foreground">{causasFiltradas.length}</span> causas
              {fechaDesde && !fechaHasta && <> desde <span className="font-medium">{fechaDesde}</span></>}
              {!fechaDesde && fechaHasta && <> hasta <span className="font-medium">{fechaHasta}</span></>}
              {fechaDesde && fechaHasta && <> del <span className="font-medium">{fechaDesde}</span> al <span className="font-medium">{fechaHasta}</span></>}
              {" "}de un total de {causas.length}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tipo de Trámite */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Causas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.causas}</div>
            <p className="text-xs text-muted-foreground">Expedientes de tipo Causa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Apoyo</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.apoyo}</div>
            <p className="text-xs text-muted-foreground">Expedientes de Apoyo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total General</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.total}</div>
            <p className="text-xs text-muted-foreground">Registros en el sistema</p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Anuales */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Evolución Anual</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-50 dark:bg-slate-900 border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">2024</CardTitle>
            <CardDescription>Periodo Anterior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricas.anio2024}</div>
            <p className="text-sm text-muted-foreground">Causas registradas</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 dark:bg-slate-900 border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">2025</CardTitle>
            <CardDescription>Periodo Actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricas.anio2025}</div>
            <p className="text-sm text-muted-foreground">Causas registradas</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 dark:bg-slate-900 border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">2026</CardTitle>
            <CardDescription>Proyección</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricas.anio2026}</div>
            <p className="text-sm text-muted-foreground">Causas registradas</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 mb-8">
        <CardHeader>
          <CardTitle>Gráfico de Evolución Anual</CardTitle>
          <CardDescription>Cantidad de causas registradas por mes y año</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataAnualMensual} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted opacity-50" />
              <XAxis dataKey="name" className="text-sm font-medium" />
              <YAxis allowDecimals={false} className="text-sm font-medium" />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="2024" name="2024" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="2025" name="2025" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="2026" name="2026" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>



      {/* Evolución Anual Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 mb-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Causas 2024: Preventores</CardTitle>
            <CardDescription>Proporción asignada en 2024 (pase el cursor para ver detalles)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-row items-center justify-between">
            {dataPreventores2024.length > 0 ? (
              <>
                <div className="w-[60%] h-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={dataPreventores2024}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
                          const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                          const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                          return percent >= 0.05 ? (
                            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12px" fontWeight="bold">
                              {`${(percent * 100).toFixed(1)}%`}
                            </text>
                          ) : null;
                        }}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dataPreventores2024.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-[35%] h-full overflow-y-auto pr-2 py-4 flex flex-col gap-3">
                  {dataPreventores2024.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-3">
                      <div className="w-6 h-6 shrink-0 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-sm font-bold uppercase truncate" title={entry.name}>
                        {entry.name}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">No hay datos de 2024</div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Causas 2025: Preventores</CardTitle>
            <CardDescription>Proporción asignada en 2025 (pase el cursor para ver detalles)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-row items-center justify-between">
            {dataPreventores2025.length > 0 ? (
              <>
                <div className="w-[60%] h-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={dataPreventores2025}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
                          const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                          const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                          return percent >= 0.05 ? (
                            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12px" fontWeight="bold">
                              {`${(percent * 100).toFixed(1)}%`}
                            </text>
                          ) : null;
                        }}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dataPreventores2025.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-[35%] h-full overflow-y-auto pr-2 py-4 flex flex-col gap-3">
                  {dataPreventores2025.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-3">
                      <div className="w-6 h-6 shrink-0 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-sm font-bold uppercase truncate" title={entry.name}>
                        {entry.name}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">No hay datos de 2025</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Preventores */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Carga de Trabajo: Preventores</CardTitle>
            <CardDescription>Cantidad de causas asignadas por preventor titular</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {topPreventores.length > 0 ? (
                topPreventores.map(([nombre, cantidad]) => (
                  <div key={nombre} className="flex items-center justify-between p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                      </div>
                      <span className="font-medium">{nombre}</span>
                    </div>
                    <span className="font-bold bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-xs">
                      {cantidad as number} causas
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">No hay datos de preventores</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preventores Auxiliares */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Carga de Trabajo: Auxiliares</CardTitle>
            <CardDescription>Participación en causas como preventor auxiliar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {topPreventoresAux.length > 0 ? (
                topPreventoresAux.map(([nombre, cantidad]) => (
                  <div key={nombre} className="flex items-center justify-between p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                        <Users className="h-4 w-4 text-green-600 dark:text-green-300" />
                      </div>
                      <span className="font-medium">{nombre}</span>
                    </div>
                    <span className="font-bold bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-xs">
                      {cantidad as number} causas
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">No hay datos de auxiliares</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
