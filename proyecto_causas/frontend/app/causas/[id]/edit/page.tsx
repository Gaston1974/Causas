"use client"

import { useParams, useRouter } from "next/navigation"
import { CausaForm } from "@/components/causa-form"
import { useCausas } from "@/hooks/use-causas"
import { useCausa } from "@/hooks/use-causa"
import type { CausaFormData } from "@/types/causa"
import { FormSkeleton } from "@/components/ui/skeleton-loader"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditCausaPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { causa, loading: causaLoading, error } = useCausa(id)
  const { updateCausa, loading: updateLoading } = useCausas()

  const handleSubmit = async (data: CausaFormData) => {
    await updateCausa(id, data)
    router.push(`/causas/${id}`)
  }

  const handleCancel = () => {
    router.push(`/causas/${id}`)
  }

  if (causaLoading) {
    return <FormSkeleton />
  }

  if (error || !causa) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Causa no encontrada</h2>
        <p className="text-gray-600 mt-2">La causa que buscas no existe o ha sido eliminada.</p>
        <Button asChild className="mt-4">
          <Link href="/causas">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a causas
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/causas/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold">Editar Causa</h1>
        <p className="text-muted-foreground">Modifica la información de la causa {causa.numero_causa}</p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <CausaForm initialData={causa} onSubmit={handleSubmit} onCancel={handleCancel} isLoading={updateLoading} />
      </div>
    </div>
  )
}
