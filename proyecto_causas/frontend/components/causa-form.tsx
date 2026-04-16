"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api" // agrego apiClient para la causa de entrada
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { CausaFormData as OriginalCausaFormData } from "@/types/causa"

// Inferencia desde zod
export type FormCausaSchemaType = z.infer<typeof causaSchema>

const causaSchema = z.object({
  numero_causa: z.string().min(1, "El número de causa es requerido"),
  caratula: z.string().min(1, "La carátula es requerida"),
  juzgado: z.string().min(1, "El juzgado es requerido"),
  fiscalia: z.string().min(1, "La fiscalía es requerida"),
  magistrado: z.string().optional(),
  preventor: z.string().min(1, "El preventor es requerido"),
  preventor_auxiliar: z.string().min(1, "El preventor auxiliar es requerido"),
  provincia_id: z.string().min(1, "La provincia es requerida"),
  localidad_id: z.string().optional(),
  domicilio: z.string().optional(),
  nro_sgo: z.string().min(1, "El número SGO es requerido"),
  nro_mto: z.string().min(1, "El número MTO es requerido"),
  tipo_delito: z.string().min(1, "El tipo de delito es requerido"),
  nombre_fantasia: z.string().min(1, "El nombre de fantasía es requerido"),
  providencia: z.string().min(1, "La providencia es requerida"),
  estado: z.enum(["activa", "archivada", "en_proceso", "finalizada"]),
  contenido_nota: z.string().optional(),
})

interface CausaFormProps {
  initialData?: Partial<OriginalCausaFormData>
  onSubmit: (data: FormCausaSchemaType) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const FISCALIAS = [
  "Fiscalía Federal en lo económico",
  "Fiscalía Federal en lo penal",
  "Fiscalía Provincial",
  "Fiscalía de Investigación",
]

const JUZGADO = [
  "Juzgado Federal",
  "Juzgado Penal",
  "Juzgado Civil",
]

const PROVINCIAS = ["Buenos Aires", "Formosa"]

const ESTADOS = [
  { value: "activa", label: "Activa" },
  { value: "diligenciada", label: "Archivada" }
]

export function CausaForm({ initialData, onSubmit, onCancel, isLoading }: CausaFormProps) {
  const form = useForm<FormCausaSchemaType>({
    resolver: zodResolver(causaSchema),
    defaultValues: {
      numero_causa: initialData?.numero_causa || "",
      caratula: initialData?.caratula || "",
      juzgado: initialData?.juzgado || "",
      fiscalia: initialData?.fiscalia || "",
      magistrado: initialData?.magistrado || "",
      preventor: initialData?.preventor || "",
      preventor_auxiliar: initialData?.preventor_auxiliar || "",
      provincia_id: initialData?.provincia_id || "",
      localidad_id: initialData?.localidad_id || "",
      domicilio: initialData?.domicilio || "",
      nro_sgo: initialData?.nro_sgo || "",
      nro_mto: initialData?.nro_mto || "",
      tipo_delito: initialData?.tipo_delito || "",
      nombre_fantasia: initialData?.nombre_fantasia || "",
      providencia: initialData?.providencia || "",
      estado: initialData?.estado || "activa",
      contenido_nota: initialData?.contenido_nota || "",
    },
  })

  const handleSubmit = async (data: FormCausaSchemaType) => {
    try {
      //await onSubmit(data)
      await apiClient.createCausa(data); // creacion de causa nueva
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="numero_causa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Causa</FormLabel>
                <FormControl>
                  <Input placeholder="CAUSA-2024-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="caratula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carátula</FormLabel>
              <FormControl>
                <Textarea placeholder="Descripción de la causa..." className="min-h-20" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="juzgado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Juzgado</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del juzgado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fiscalia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fiscalía</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la fiscalía" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="magistrado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Magistrado</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del magistrado" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="preventor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preventor</FormLabel>
                <FormControl>
                  <Input placeholder="Grado y nombre completo del preventor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preventor_auxiliar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preventor Auxiliar</FormLabel>
                <FormControl>
                  <Input placeholder="Grado y nombre completo del preventor auxiliar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="provincia_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provincia</FormLabel>
                 <FormControl>
                <Input />
                 </FormControl>
                {/* <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar provincia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROVINCIAS.map((provincia) => (
                      <SelectItem key={provincia} value={provincia}>
                        {provincia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="localidad_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localidad</FormLabel>
                <FormControl>
                  <Input />
                  {/* <Input placeholder="Localidad" {...field} disabled /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="domicilio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domicilio</FormLabel>
              <FormControl>
                <Input placeholder="Dirección completa" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nro_sgo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nro SGO</FormLabel>
                <FormControl>
                  <Input placeholder="Número SGO" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nro_mto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nro MTO</FormLabel>
                <FormControl>
                  <Input placeholder="Número MTO" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tipo_delito"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Delito</FormLabel>
              <FormControl>
                <Input placeholder="Tipo de delito" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nombre_fantasia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Fantasía</FormLabel>
              <FormControl>
                <Input placeholder="Nombre ficticio para la causa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="providencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Providencia</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalles de la providencia..." className="min-h-20" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contenido_nota"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenido Nota (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Notas adicionales..." className="min-h-20" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// comentario de prueba para ver si se actualiza el archivo: Carga de la causa debe ser en mayuscula
// estado debe ser ACTIVA, DILIGENCIADA, ALLANDADA, ARCHIVADA
//INPUT SOLO PARA CARGAR DATOS DE LA PROVIDENCIA JUZGADO, FISCALIA ETC
