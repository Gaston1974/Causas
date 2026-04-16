"use client"

import { useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { SearchBar } from "@/components/search-bar"
import { FilterPanel } from "@/components/filter-panel"
import { CausaTable } from "@/components/causa-table"
import { TableSkeleton } from "@/components/ui/skeleton-loader"
import { useCausas } from "@/hooks/use-causas"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CausasListPage() {
  const { causas, loading, error, fetchCausas, deleteCausa, filters } = useCausas()

  useEffect(() => {
    fetchCausas()
  }, [fetchCausas])

  const filteredCausas = useMemo(() => {
    return causas.filter((causa) => {
      const matchesSearch =
        !filters.search ||
        causa.numero_causa.toLowerCase().includes(filters.search.toLowerCase()) ||
        causa.caratula.toLowerCase().includes(filters.search.toLowerCase()) ||
        causa.preventor_auxiliar.toLowerCase().includes(filters.search.toLowerCase())

      const matchesFiscalia = !filters.fiscalia || causa.fiscalia === filters.fiscalia
      const matchesProvincia = !filters.provincia || causa.provincia === filters.provincia
      const matchesEstado = !filters.estado || causa.estado === filters.estado

      return matchesSearch && matchesFiscalia && matchesProvincia && matchesEstado
    })
  }, [causas, filters])

  if (loading) {
    return <TableSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Causas</h1>
          <p className="text-muted-foreground">Gestiona todas las causas legales del sistema</p>
        </div>
        <Button asChild>
          <Link href="/causas/new">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Causa
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchCausas()}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <SearchBar />
        <FilterPanel />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredCausas.length} de {causas.length} causas
          </p>
        </div>

        <CausaTable causas={filteredCausas} onDelete={deleteCausa} />
      </div>
    </div>
  )
}
