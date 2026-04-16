"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import type { Causa } from "@/types/causa"
import { ModalConfirm } from "./modal-confirm"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

interface CausaTableProps {
  causas: Causa[]
  onDelete: (id: string) => void
}

const estadoColors = {
  activa: "bg-green-100 text-green-800",
  archivada: "bg-gray-100 text-gray-800",
  en_proceso: "bg-blue-100 text-blue-800",
  finalizada: "bg-purple-100 text-purple-800",
}

const estadoLabels = {
  activa: "Activa",
  archivada: "Archivada",
  en_proceso: "En Proceso",
  finalizada: "Finalizada",
}

export function CausaTable({ causas, onDelete }: CausaTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <>
      <div className="border rounded-lg overflow-auto max-h-[calc(100vh-250px)] relative">
        <Table className="min-w-[1200px]">
          <TableHeader className="sticky top-0 z-20 bg-background text-foreground shadow-sm">
            <TableRow>
              <TableHead className="sticky left-0 bg-background z-10">Número de Causa</TableHead>
              <TableHead>Carátula</TableHead>
              <TableHead>Juzgado</TableHead>
              <TableHead>Fiscalía</TableHead>
              <TableHead>Preventor</TableHead>
              <TableHead>Preventor Auxiliar</TableHead>
              <TableHead>Provincia</TableHead>
              <TableHead>Nro SGO</TableHead>
              <TableHead>Nro MTO</TableHead>
              <TableHead>Tipo Delito</TableHead>
              <TableHead>Nombre Fantasía</TableHead>
              <TableHead>Providencia</TableHead>
              <TableHead>Estado</TableHead>
              {/* <TableHead>IP Address</TableHead>
              <TableHead>Nombre Archivo</TableHead>
              <TableHead>Ruta Archivo</TableHead>
              <TableHead>Tipo Archivo</TableHead>
              <TableHead>Peso Archivo</TableHead>
              <TableHead>Subido Por</TableHead>
              <TableHead>Contenido Nota</TableHead> */}
              <TableHead>Fecha Actualización</TableHead>
              <TableHead className="sticky right-0 bg-background z-10 w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {causas.map((causa) => (
              <TableRow key={causa.id}>
                <TableCell className="font-medium sticky left-0 bg-background group-hover:bg-muted shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r transition-colors">
                  {causa.numero_causa}
                </TableCell>
                <TableCell className="max-w-xs">{causa.caratula}</TableCell>
                <TableCell>{causa.juzgado || '-'}</TableCell>
                <TableCell>{causa.fiscalia || '-'}</TableCell>
                <TableCell>{causa.preventor || '-'}</TableCell>
                <TableCell>{causa.preventor_auxiliar || '-'}</TableCell>
                <TableCell>{causa.provincia || '-'}</TableCell>
                <TableCell>{causa.nro_sgo || '-'}</TableCell>
                <TableCell>{causa.nro_mto || '-'}</TableCell>
                <TableCell>{causa.tipo_delito || '-'}</TableCell>
                <TableCell>{causa.nombre_fantasia || '-'}</TableCell>
                <TableCell className="max-w-xs">{causa.providencia || '-'}</TableCell>
                <TableCell>
                  <Badge className={estadoColors[causa.estado]}>{estadoLabels[causa.estado]}</Badge>
                </TableCell>
                {/* <TableCell>{causa.ip_address || '-'}</TableCell>
                <TableCell>{causa.nombre_archivo || '-'}</TableCell>
                <TableCell className="max-w-xs truncate">{causa.ruta_archivo || '-'}</TableCell>
                <TableCell>{causa.tipo_archivo || '-'}</TableCell>
                <TableCell>{causa.peso_archivo || '-'}</TableCell>
                <TableCell>{causa.subido_por || '-'}</TableCell>
                <TableCell className="max-w-xs truncate">{causa.contenido_nota || '-'}</TableCell> */}
                <TableCell>{format(causa.fecha_actualizacion, "dd/MM/yyyy", { locale: es })}</TableCell>
                <TableCell className="sticky right-0 bg-background">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/causas/${causa.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalle
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/causas/${causa.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteId(causa.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ModalConfirm
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar causa"
        description="¿Estás seguro de que deseas eliminar esta causa? Esta acción no se puede deshacer."
      />
    </>
  )
}
