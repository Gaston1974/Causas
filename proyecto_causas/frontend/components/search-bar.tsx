"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCausas } from "@/hooks/use-causas"

export function SearchBar() {
  const { filters, setFilters } = useCausas()

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Buscar por número de causa, carátula o preventor..."
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
        className="pl-10"
      />
    </div>
  )
}
