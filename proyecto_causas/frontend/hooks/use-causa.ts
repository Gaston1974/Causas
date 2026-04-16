"use client"

import { useState, useEffect } from "react"
import type { Causa } from "@/types/causa"
import { useCausasContext } from "@/contexts/causas-context"

export function useCausa(id: string) {
  const { state } = useCausasContext()
  const [causa, setCausa] = useState<Causa | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const findCausa = () => {
      setLoading(true)
      try {
        const foundCausa = state.causas.find((c) => c.id === id)
        setCausa(foundCausa || null)
        setError(foundCausa ? null : "Causa no encontrada")
      } catch (err) {
        setError("Error al cargar la causa")
      } finally {
        setLoading(false)
      }
    }

    findCausa()
  }, [id, state.causas])

  return { causa, loading, error }
}
