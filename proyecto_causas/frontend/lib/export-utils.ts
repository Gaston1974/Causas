"use client"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export interface CausaExport {
    numero_causa: string
    caratula: string
    preventor: string
    preventor_auxiliar: string
    tipo_delito: string
    fiscalia: string
    juzgado: string
    estado: string
    fecha_creacion: string | Date
}

function formatDate(date: string | Date): string {
    try {
        return format(new Date(date), "dd/MM/yyyy", { locale: es })
    } catch {
        return String(date)
    }
}

function getRangeLabel(fechaDesde?: string, fechaHasta?: string): string {
    if (fechaDesde && fechaHasta) {
        return `Período: ${fechaDesde} al ${fechaHasta}`
    }
    if (fechaDesde) return `Desde: ${fechaDesde}`
    if (fechaHasta) return `Hasta: ${fechaHasta}`
    return "Todas las causas (sin filtro de fecha)"
}

const COLUMNS = [
    "N° Causa",
    "Carátula",
    "Preventor",
    "Prev. Auxiliar",
    "Tipo Delito",
    "Fiscalía",
    "Juzgado",
    "Estado",
    "Fecha Creación",
]

function causaToRow(c: CausaExport): string[] {
    return [
        c.numero_causa || "",
        c.caratula || "",
        c.preventor || "",
        c.preventor_auxiliar || "",
        c.tipo_delito || "",
        c.fiscalia || "",
        c.juzgado || "",
        c.estado || "",
        formatDate(c.fecha_creacion),
    ]
}

// ─── PDF Export ───────────────────────────────────────────────

export function exportToPDF(
    causas: CausaExport[],
    fechaDesde?: string,
    fechaHasta?: string
) {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })

    // Header
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Reportes y Métricas – Causas", 14, 18)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(getRangeLabel(fechaDesde, fechaHasta), 14, 26)
    doc.text(`Total de registros: ${causas.length}`, 14, 32)
    doc.text(`Generado: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`, 14, 38)

    // Table
    autoTable(doc, {
        startY: 44,
        head: [COLUMNS],
        body: causas.map(causaToRow),
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: {
            fillColor: [37, 99, 235],
            textColor: 255,
            fontStyle: "bold",
            fontSize: 8,
        },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { left: 14, right: 14 },
    })

    const fileName = `Reporte_Causas_${fechaDesde || "inicio"}_${fechaHasta || "fin"}.pdf`
    doc.save(fileName)
}

// ─── Excel Export ─────────────────────────────────────────────

export function exportToExcel(
    causas: CausaExport[],
    fechaDesde?: string,
    fechaHasta?: string
) {
    const rows = causas.map((c) => ({
        "N° Causa": c.numero_causa || "",
        "Carátula": c.caratula || "",
        "Preventor": c.preventor || "",
        "Prev. Auxiliar": c.preventor_auxiliar || "",
        "Tipo Delito": c.tipo_delito || "",
        "Fiscalía": c.fiscalia || "",
        "Juzgado": c.juzgado || "",
        "Estado": c.estado || "",
        "Fecha Creación": formatDate(c.fecha_creacion),
    }))

    const worksheet = XLSX.utils.json_to_sheet(rows)

    // Set column widths
    worksheet["!cols"] = [
        { wch: 14 }, // N° Causa
        { wch: 30 }, // Carátula
        { wch: 20 }, // Preventor
        { wch: 20 }, // Prev. Auxiliar
        { wch: 18 }, // Tipo Delito
        { wch: 20 }, // Fiscalía
        { wch: 20 }, // Juzgado
        { wch: 14 }, // Estado
        { wch: 16 }, // Fecha Creación
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Causas")

    const fileName = `Reporte_Causas_${fechaDesde || "inicio"}_${fechaHasta || "fin"}.xlsx`
    XLSX.writeFile(workbook, fileName)
}
