// ============================================================
// TIPOS — MÓDULO DE ALLANAMIENTO
// ============================================================

export type ModalidadLinea = "DIRECTA" | "DIFERIDA"

export type EstadoDetenci = "DETENIDO" | "A DISPOSICIÓN DEL JUZGADO" | "LIBERADO" | "EN PROCESO"

// --- Cabecera de Allanamiento ---
export interface CausaAllanamiento {
  id?: string
  causa_id: string
  positivo: boolean
  fecha_allanamiento?: string
  observaciones?: string
}

// --- Domicilio de Allanamiento ---
export interface AllanamientoDomicilio {
  id?: string
  allanamiento_id?: string
  calles: string
  provincia: string
  partido: string
  localidad: string
  latitud?: string
  longitud?: string
}

// --- Arma Secuestrada ---
export interface AllanamientoArma {
  id?: string
  allanamiento_id?: string
  tipo_arma: string
  calibre: string
  marca: string
  origen: string
  asociado_delito?: string
  deposito_judicial: string
}

// --- Vehículo Secuestrado ---
export interface AllanamientoVehiculo {
  id?: string
  allanamiento_id?: string
  tipo_vehiculo: string
  marca: string
  modelo: string
  origen: string
  asociado_delito?: string
  deposito_judicial: string
}

// --- Cigarrillo Secuestrado ---
export type TipoCigarrillo = "ELECTRONICO" | "TRADICIONAL"

export interface AllanamientoCigarrillo {
  id?: string
  allanamiento_id?: string
  tipo_cigarrillo: TipoCigarrillo
  marca: string
  unidad: string
  origen: string
  deposito_judicial: string
}

// --- Estupefaciente Secuestrado ---
export type TipoEstupefaciente =
  | "MARIHUANA"
  | "COCAINA"
  | "EXTASIS"
  | "HEROINA"
  | "METANFETAMINA"
  | "OTRO"

export interface AllanamientoEstupefaciente {
  id?: string
  allanamiento_id?: string
  tipo_estupefaciente: TipoEstupefaciente | string
  cantidad_kgs: string
  origen: string
  deposito_judicial: string
}

// --- Divisa Secuestrada ---
export type TipoDivisa = "DOLAR" | "PESOS" | "EUROS" | "REALES" | "OTRA"

export interface AllanamientoDivisa {
  id?: string
  allanamiento_id?: string
  tipo_divisa: TipoDivisa | string
  cantidad: string
  origen: string
  deposito_judicial: string
}

// --- Detenido por Allanamiento ---
export interface AllanamientoDetenido {
  id?: string
  allanamiento_id?: string
  nombre_apellido: string
  dni: string
  edad: string
  nacionalidad: string
  estado_detencion: EstadoDetenci | string
}

// --- Persona Rescatada (Trata) ---
export type SexoPersona = "MASCULINO" | "FEMENINO" | "NO BINARIO" | "OTRO"

export interface AllanamientoRescatado {
  id?: string
  allanamiento_id?: string
  sexo: SexoPersona | string
  edad: string
  nacionalidad: string
}

// --- Elemento Tecnológico ---
export type TipoObjetoTec =
  | "PENDRIVE"
  | "CD/DVD"
  | "PC/NOTEBOOK"
  | "CELULAR"
  | "TABLET"
  | "DISCO RIGIDO"
  | "SERVIDOR"
  | "OTRO"

export interface AllanamientoTecnologia {
  id?: string
  allanamiento_id?: string
  tipo_objeto: TipoObjetoTec | string
  marca: string
  modelo: string
}

// --- Estado completo de allanamiento (agrupado) ---
export interface AllanamientoState {
  cabecera: CausaAllanamiento
  domicilios: AllanamientoDomicilio[]
  armas: AllanamientoArma[]
  vehiculos: AllanamientoVehiculo[]
  cigarrillos: AllanamientoCigarrillo[]
  estupefacientes: AllanamientoEstupefaciente[]
  divisas: AllanamientoDivisa[]
  detenidos: AllanamientoDetenido[]
  rescatados: AllanamientoRescatado[]
  tecnologia: AllanamientoTecnologia[]
}
