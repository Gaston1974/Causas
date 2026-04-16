"use client"

import { useRouter } from "next/navigation"
import { CausaForm } from "@/components/causa-form"
import { useCausas } from "@/hooks/use-causas"
import type { CausaFormData } from "@/types/causa"

export default function NewCausaPage() {
  const router = useRouter()
  const { createCausa, loading } = useCausas()

  const handleSubmit = async (data: CausaFormData) => {
    await createCausa(data)
    router.push("/causas")
  }

  const handleCancel = () => {
    router.push("/causas")
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">Nueva Causa</h1>
        <p className="text-muted-foreground">Crea una nueva causa en el sistema</p>
      </div>
      <div className="bg-card text-card-foreground p-6 rounded-lg border">
        <CausaForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={loading} />
      </div>
    </>
  )
}
