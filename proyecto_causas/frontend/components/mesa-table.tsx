"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import type { MesaEntradaResponse } from "@/types/api"

interface MesaTableProps {
    entradas: MesaEntradaResponse[]
    onDelete: (id: number) => void
}

const procedenciaColors: Record<string, string> = {
    email: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    mto: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    otro: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

function formatDate(value: string | Date | undefined): string {
    if (!value) return "-"
    const d = typeof value === "string" ? new Date(value) : value
    return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function MesaTable({ entradas, onDelete }: MesaTableProps) {
    if (entradas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <p className="text-lg font-medium">No hay entradas registradas</p>
                <p className="text-sm mt-1">Crea una nueva entrada para comenzar.</p>
            </div>
        )
    }

    return (
        <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="w-[60px] font-semibold">N°</TableHead>
                        <TableHead className="font-semibold">Fecha</TableHead>
                        <TableHead className="font-semibold">Procedencia</TableHead>
                        <TableHead className="font-semibold">Remitente</TableHead>
                        <TableHead className="font-semibold">Juzgado</TableHead>
                        <TableHead className="font-semibold">Fiscalía</TableHead>
                        <TableHead className="font-semibold">Descripción</TableHead>
                        <TableHead className="font-semibold">Nro. Causa</TableHead>
                        <TableHead className="font-semibold">Obs</TableHead>
                        <TableHead className="w-[80px] text-right font-semibold">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entradas.map((entrada) => (
                        <TableRow
                            key={entrada.id}
                            className="group transition-colors hover:bg-muted/20"
                        >
                            <TableCell className="font-mono text-sm font-medium">{entrada.id}</TableCell>
                            <TableCell className="text-sm whitespace-nowrap">{formatDate(entrada.fecha)}</TableCell>
                            <TableCell>
                                <Badge
                                    variant="secondary"
                                    className={`text-xs font-medium ${procedenciaColors[entrada.procedencia] || procedenciaColors.otro}`}
                                >
                                    {entrada.procedencia.toUpperCase()}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm max-w-[150px] truncate">{entrada.remitente}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{entrada.juzgado || "-"}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{entrada.fiscalia || "-"}</TableCell>
                            <TableCell className="text-sm max-w-[200px] truncate">{entrada.descripcion}</TableCell>
                            <TableCell className="font-mono text-sm">{entrada.nro_causa}</TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-[120px] truncate">{entrada.obs || "-"}</TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => onDelete(entrada.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
