"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useMesa } from "@/hooks/use-mesa"

const PROCEDENCIA_OPTIONS = [
    { value: "email", label: "Email" },
    { value: "mto", label: "MTO" },
    { value: "otro", label: "Otro" },
]

export function MesaForm() {
    const router = useRouter()
    const { createEntrada, loading } = useMesa()

    const [formData, setFormData] = useState({
        fecha: new Date().toISOString().split("T")[0],
        procedencia: "",
        remitente: "",
        juzgado: "",
        fiscalia: "",
        descripcion: "",
        nro_causa: "",
        obs: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.fecha) newErrors.fecha = "La fecha es obligatoria"
        if (!formData.procedencia) newErrors.procedencia = "La procedencia es obligatoria"
        if (!formData.remitente.trim()) newErrors.remitente = "El remitente es obligatorio"
        if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria"
        if (!formData.nro_causa.trim()) newErrors.nro_causa = "El Nro. de causa es obligatorio"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        try {
            await createEntrada({
                ...formData,
                fecha: new Date(formData.fecha).toISOString(),
                juzgado: formData.juzgado || null,
                fiscalia: formData.fiscalia || null,
                obs: formData.obs || null,
            })
	      const response = await apiClient.createMesaEntrada(formData);
         //   router.push("/mesa")
        } catch {
            // errors handled by hook
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => {
                const copy = { ...prev }
                delete copy[field]
                return copy
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href="/mesa">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Nueva Entrada de Mesa</h1>
                    <p className="text-muted-foreground">Completa los datos para registrar una nueva entrada</p>
                </div>
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
                <CardHeader>
                    <CardTitle>Datos de la Entrada</CardTitle>
                    <CardDescription>Los campos marcados con * son obligatorios</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Fecha */}
                            <div className="space-y-2">
                                <Label htmlFor="fecha">Fecha *</Label>
                                <Input
                                    id="fecha"
                                    type="date"
                                    value={formData.fecha}
                                    onChange={(e) => handleChange("fecha", e.target.value)}
                                    className={errors.fecha ? "border-destructive" : ""}
                                />
                                {errors.fecha && <p className="text-xs text-destructive">{errors.fecha}</p>}
                            </div>

                            {/* Procedencia */}
                            <div className="space-y-2">
                                <Label htmlFor="procedencia">Procedencia *</Label>
                                <Select
                                    value={formData.procedencia}
                                    onValueChange={(val) => handleChange("procedencia", val)}
                                >
                                    <SelectTrigger id="procedencia" className={errors.procedencia ? "border-destructive" : ""}>
                                        <SelectValue placeholder="Seleccionar procedencia" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROCEDENCIA_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.procedencia && <p className="text-xs text-destructive">{errors.procedencia}</p>}
                            </div>

                            {/* Nro Causa */}
                            <div className="space-y-2">
                                <Label htmlFor="nro_causa">Nro. Causa *</Label>
                                <Input
                                    id="nro_causa"
                                    value={formData.nro_causa}
                                    onChange={(e) => handleChange("nro_causa", e.target.value)}
                                    placeholder="Ej: 12345/2025"
                                    className={errors.nro_causa ? "border-destructive" : ""}
                                />
                                {errors.nro_causa && <p className="text-xs text-destructive">{errors.nro_causa}</p>}
                            </div>

                            {/* Remitente */}
                            <div className="space-y-2">
                                <Label htmlFor="remitente">Remitente *</Label>
                                <Input
                                    id="remitente"
                                    value={formData.remitente}
                                    onChange={(e) => handleChange("remitente", e.target.value)}
                                    placeholder="Nombre del remitente"
                                    className={errors.remitente ? "border-destructive" : ""}
                                />
                                {errors.remitente && <p className="text-xs text-destructive">{errors.remitente}</p>}
                            </div>

                            {/* Juzgado */}
                            <div className="space-y-2">
                                <Label htmlFor="juzgado">Juzgado</Label>
                                <Input
                                    id="juzgado"
                                    value={formData.juzgado}
                                    onChange={(e) => handleChange("juzgado", e.target.value)}
                                    placeholder="Juzgado (opcional)"
                                />
                            </div>

                            {/* Fiscalía */}
                            <div className="space-y-2">
                                <Label htmlFor="fiscalia">Fiscalía</Label>
                                <Input
                                    id="fiscalia"
                                    value={formData.fiscalia}
                                    onChange={(e) => handleChange("fiscalia", e.target.value)}
                                    placeholder="Fiscalía (opcional)"
                                />
                            </div>
                        </div>

                        {/* Descripción - full width */}
                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción *</Label>
                            <Textarea
                                id="descripcion"
                                value={formData.descripcion}
                                onChange={(e) => handleChange("descripcion", e.target.value)}
                                placeholder="Descripción del ingreso..."
                                rows={3}
                                className={errors.descripcion ? "border-destructive" : ""}
                            />
                            {errors.descripcion && <p className="text-xs text-destructive">{errors.descripcion}</p>}
                        </div>

                        {/* Observaciones - full width */}
                        <div className="space-y-2">
                            <Label htmlFor="obs">Observaciones</Label>
                            <Input
                                id="obs"
                                value={formData.obs}
                                onChange={(e) => handleChange("obs", e.target.value)}
                                placeholder="Observaciones (opcional)"
                                maxLength={50}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" type="button" asChild>
                                <Link href="/mesa">Cancelar</Link>
                            </Button>
                            <Button type="submit" disabled={loading} className="min-w-[140px]">
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Guardar Entrada
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
