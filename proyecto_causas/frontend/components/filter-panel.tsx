"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useCausas } from "@/hooks/use-causas"

const FISCALIAS = [
  "Fiscalía Nacional Económica",
  "Fiscalía Federal",
  "Fiscalía Provincial",
  "Fiscalía de Investigación",
]

const PROVINCIAS = ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Tucumán"]

const ESTADOS = [
  { value: "activa", label: "Activa" },
  { value: "archivada", label: "Archivada" },
  { value: "en_proceso", label: "En Proceso" },
  { value: "finalizada", label: "Finalizada" },
]

export function FilterPanel() {
  const { filters, setFilters } = useCausas()

  const clearFilters = () => {
    setFilters({
      search: "",
      fiscalia: "",
      provincia: "",
      estado: "",
      preventor_auxiliar: "",
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Select value={filters.fiscalia} onValueChange={(value) => setFilters({ fiscalia: value })}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Fiscalía" />
        </SelectTrigger>
        <SelectContent>
          {FISCALIAS.map((fiscalia) => (
            <SelectItem key={fiscalia} value={fiscalia}>
              {fiscalia}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.provincia} onValueChange={(value) => setFilters({ provincia: value })}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Provincia" />
        </SelectTrigger>
        <SelectContent>
          {PROVINCIAS.map((provincia) => (
            <SelectItem key={provincia} value={provincia}>
              {provincia}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.estado} onValueChange={(value) => setFilters({ estado: value })}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          {ESTADOS.map((estado) => (
            <SelectItem key={estado.value} value={estado.value}>
              {estado.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
