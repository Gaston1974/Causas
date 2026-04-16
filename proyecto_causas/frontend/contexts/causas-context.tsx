"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Causa, CausaFilters } from "@/types/causa"

interface CausasState {
  causas: Causa[]
  loading: boolean
  error: string | null
  filters: CausaFilters
  pagination: {
    page: number
    limit: number
    total: number
  }
}

type CausasAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CAUSAS"; payload: Causa[] }
  | { type: "ADD_CAUSA"; payload: Causa }
  | { type: "UPDATE_CAUSA"; payload: Causa }
  | { type: "DELETE_CAUSA"; payload: string }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_FILTERS"; payload: Partial<CausaFilters> }
  | { type: "SET_PAGINATION"; payload: Partial<CausasState["pagination"]> }

const initialState: CausasState = {
  causas: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    fiscalia: "",
    provincia: "",
    estado: "",
    preventor_auxiliar: "",
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
}

function causasReducer(state: CausasState, action: CausasAction): CausasState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_CAUSAS":
      return { ...state, causas: action.payload, loading: false }
    case "ADD_CAUSA":
      return { ...state, causas: [action.payload, ...state.causas] }
    case "UPDATE_CAUSA":
      return {
        ...state,
        causas: state.causas.map((causa) => (causa.id === action.payload.id ? action.payload : causa)),
      }
    case "DELETE_CAUSA":
      return {
        ...state,
        causas: state.causas.filter((causa) => causa.id !== action.payload),
      }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case "SET_PAGINATION":
      return { ...state, pagination: { ...state.pagination, ...action.payload } }
    default:
      return state
  }
}

const CausasContext = createContext<{
  state: CausasState
  dispatch: React.Dispatch<CausasAction>
} | null>(null)

export function CausasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(causasReducer, initialState)

  return <CausasContext.Provider value={{ state, dispatch }}>{children}</CausasContext.Provider>
}

export function useCausasContext() {
  const context = useContext(CausasContext)
  if (!context) {
    throw new Error("useCausasContext must be used within a CausasProvider")
  }
  return context
}
