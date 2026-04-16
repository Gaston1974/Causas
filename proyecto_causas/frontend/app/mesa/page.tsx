"use client"

import { useEffect, useMemo } from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, AlertCircle, RefreshCw, Search } from "lucide-react"
import Link from "next/link"
import { MesaTable } from "@/components/mesa-table"
import { TableSkeleton } from "@/components/ui/skeleton-loader"
import { useMesa } from "@/hooks/use-mesa"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type {
     MesaEntradaResponse,
     MesaEntradasListResponse 
            } from "@/types/api"

export default function MesaPage() {
const { entradas, loading, error, search, setSearch, fetchEntradas, deleteEntrada } = useMesa()

useEffect(() => {
    fetchEntradas()
}, [fetchEntradas])

const filtered = useMemo(() => {
    if (!search) return entradas

    const q = search.toLowerCase()

    return entradas.filter((e) =>
        (e.nro_causa ?? "").toLowerCase().includes(q) ||
        (e.remitente ?? "").toLowerCase().includes(q) ||
        (e.descripcion ?? "").toLowerCase().includes(q) ||
        (e.procedencia ?? "").toLowerCase().includes(q) ||
        (e.juzgado ?? "").toLowerCase().includes(q) ||
        (e.fiscalia ?? "").toLowerCase().includes(q)
    )
}, [entradas, search])

   

    if (loading && entradas.length === 0) {
        return <TableSkeleton />
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Mesa de Entradas</h1>
                    <p className="text-muted-foreground">Registro de entradas y documentación</p>
                </div>
                <Button asChild>
                    <Link href="/mesa/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Entrada
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
                            onClick={() => fetchEntradas()}
                            className="ml-4"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reintentar
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por causa, remitente, descripción..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        Mostrando {filtered.length} de {entradas.length} entradas
                    </p>
                </div>

                <MesaTable entradas={filtered} onDelete={deleteEntrada} />
            </div>
        </div>
    )



}
