"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api" // agrego apiClient para la mesa de entrada
import type {
     MesaEntradaResponse,
     MesaEntradasListResponse 
            } from "@/types/api"


const DATOS_INICIALES: MesaEntradaResponse[] = [
    
    // {
    //     id: 1,
    //     fecha: "2026-03-10T00:00:00",
    //     procedencia: "email",
    //     remitente: "jncrimcorrfed3.sec5@pjn.gov.ar",
    //     juzgado: "Juzgado Nacional en lo Criminal y Correccional Federal nro. 3",
    //     fiscalia: undefined,
    //     descripcion: "En el marco de la causa nro. 43475/2025 del registro de este Juzgado Nacional en lo Criminal y Correccional Federal nro. 3 a cargo del Dr. Daniel Eduardo Rafecas, Secretaria nro. 5, a fin de remitirle oficios a Meta y Telegram para que los diligencien.",
    //     nro_causa: "CCC 43475/2025",
    //     obs: "SE RECEPCIONO OFICIO JUDICIAL",
    //     fecha_creacion: "2026-03-10T00:00:00",
    // },
    // {
    //     id: 2,
    //     fecha: "2026-03-09T00:00:00",
    //     procedencia: "mto",
    //     remitente: "División Delitos Tecnológicos - PFA",
    //     juzgado: "Juzgado Federal nro. 1 de Santiago del Estero",
    //     fiscalia: "Fiscalía Federal nro. 1",
    //     descripcion: "Remisión de actuaciones labradas con motivo de la denuncia por estafa informática mediante phishing bancario. Se adjuntan capturas de pantalla y registros de transferencias.",
    //     nro_causa: "FSE 1280/2026",
    //     obs: "URGENTE - MEDIDA DE PRUEBA",
    //     fecha_creacion: "2026-03-09T00:00:00",
    // },
    // {
    //     id: 3,
    //     fecha: "2026-03-08T00:00:00",
    //     procedencia: "email",
    //     remitente: "mpf.sde@mpf.gov.ar",
    //     juzgado: undefined,
    //     fiscalia: "Fiscalía General de Santiago del Estero",
    //     descripcion: "Solicitud de informes técnicos sobre registros de conexión IP vinculados a amenazas realizadas a través de redes sociales.",
    //     nro_causa: "CCC 38210/2025",
    //     obs: undefined,
    //     fecha_creacion: "2026-03-08T00:00:00",
    // },
    // {
    //     id: 4,
    //     fecha: "2026-03-07T00:00:00",
    //     procedencia: "otro",
    //     remitente: "Comisaría 5ta - La Banda",
    //     juzgado: "Juzgado de Control y Garantías nro. 2",
    //     fiscalia: "Fiscalía de Instrucción nro. 3",
    //     descripcion: "Parte policial por denuncia de acceso ilegítimo a cuenta de WhatsApp y posterior suplantación de identidad digital para solicitar dinero a contactos de la víctima.",
    //     nro_causa: "EXP 4521/2026",
    //     obs: "CON DETENIDO",
    //     fecha_creacion: "2026-03-07T00:00:00",
    // },
    // {
    //     id: 5,
    //     fecha: "2026-03-06T00:00:00",
    //     procedencia: "email",
    //     remitente: "jfed2.sde.sec1@pjn.gov.ar",
    //     juzgado: "Juzgado Federal nro. 2 de Santiago del Estero",
    //     fiscalia: undefined,
    //     descripcion: "Oficio judicial requiriendo la preservación de datos de tráfico y contenido de la cuenta de correo electrónico denunciada por distribución de material de abuso sexual infantil.",
    //     nro_causa: "FSE 890/2026",
    //     obs: "CONFIDENCIAL",
    //     fecha_creacion: "2026-03-06T00:00:00",
    // },
    // {
    //     id: 6,
    //     fecha: "2026-03-05T00:00:00",
    //     procedencia: "mto",
    //     remitente: "Gendarmería Nacional - Escuadrón 51",
    //     juzgado: "Juzgado Federal nro. 1 de Santiago del Estero",
    //     fiscalia: "Fiscalía Federal nro. 2",
    //     descripcion: "Informe de inteligencia criminal sobre organización dedicada al narcotráfico con uso de criptomonedas para lavado de activos. Se solicita análisis de billeteras virtuales.",
    //     nro_causa: "FSE 2105/2025",
    //     obs: "RESERVADO",
    //     fecha_creacion: "2026-03-05T00:00:00",
    // },
    // {
    //     id: 7,
    //     fecha: "2026-03-04T00:00:00",
    //     procedencia: "email",
    //     remitente: "denuncias@ufeci.gov.ar",
    //     juzgado: undefined,
    //     fiscalia: "UFECI - Unidad Fiscal Especializada en Ciberdelincuencia",
    //     descripcion: "Derivación de denuncia online por fraude mediante sitio web apócrifo que simula ser entidad bancaria. Se remiten logs del servidor y datos del registrante del dominio.",
    //     nro_causa: "CCC 51203/2026",
    //     obs: undefined,
    //     fecha_creacion: "2026-03-04T00:00:00",
    // },
    // {
    //     id: 8,
    //     fecha: "2026-03-03T00:00:00",
    //     procedencia: "otro",
    //     remitente: "Prefectura Naval - Delegación Tucumán",
    //     juzgado: "Juzgado Federal de Tucumán nro. 1",
    //     fiscalia: "Fiscalía Federal de Tucumán",
    //     descripcion: "Remisión de expediente por contrabando de mercadería ingresada por pasos no habilitados. Se adjunta acta de secuestro y fotografías de la mercadería incautada.",
    //     nro_causa: "FTU 3320/2026",
    //     obs: "MERCADERÍA EN DEPÓSITO",
    //     fecha_creacion: "2026-03-03T00:00:00",
    // },
    // {
    //     id: 9,
    //     fecha: "2026-03-02T00:00:00",
    //     procedencia: "email",
    //     remitente: "sec.penal.sde@justiciasde.gov.ar",
    //     juzgado: "Juzgado Penal de 1ra Nominación",
    //     fiscalia: "Fiscalía de Instrucción nro. 1",
    //     descripcion: "Solicitud de colaboración para la extracción forense de dispositivos móviles secuestrados en allanamiento por causa de robo calificado.",
    //     nro_causa: "EXP 7845/2025",
    //     obs: "DISPOSITIVOS EN CADENA DE CUSTODIA",
    //     fecha_creacion: "2026-03-02T00:00:00",
    // },
    // {
    //     id: 10,
    //     fecha: "2026-03-01T00:00:00",
    //     procedencia: "mto",
    //     remitente: "PSA - Policía de Seguridad Aeroportuaria",
    //     juzgado: "Juzgado Federal nro. 1 de Santiago del Estero",
    //     fiscalia: undefined,
    //     descripcion: "Comunicación sobre detección de pasajero con documentación apócrifa en Aeropuerto de Santiago del Estero. Se remiten imágenes del documento secuestrado y actas labradas.",
    //     nro_causa: "FSE 4410/2026",
    //     obs: "DETENIDO A DISP. DEL JUZGADO",
    //     fecha_creacion: "2026-03-01T00:00:00",
    // },
    // {
    //     id: 11,
    //     fecha: "2026-02-28T00:00:00",
    //     procedencia: "email",
    //     remitente: "cij.sde@csjn.gov.ar",
    //     juzgado: "Cámara Federal de Apelaciones de Tucumán",
    //     fiscalia: "Fiscalía General ante la Cámara Federal",
    //     descripcion: "Notificación de resolución de la Cámara que confirma procesamiento y ordena la realización de medidas de prueba complementarias incluyendo pericias informáticas.",
    //     nro_causa: "CCC 29870/2025",
    //     obs: "PERICIA INFORMÁTICA PENDIENTE",
    //     fecha_creacion: "2026-02-28T00:00:00",
    // },
]

let nextId = 12

    // async function fetchEntradas(): Promise<MesaEntradasListResponse> {
    //  const resp = await apiClient.getMesaEntradas();
    //  console.log("hola: " , resp.entradas);
    //  return resp;
    // }
console.log("primnero:");

export function useMesa() {
console.log("primnero:");
//     const resp: MesaEntradasListResponse = { entradas: [], total: 0 }

//   fetchEntradas().then((resp: MesaEntradasListResponse) => {
//   console.log(resp.entradas);
// });

    const [entradas, setEntradas] = useState<MesaEntradaResponse[]>([]) // DATOS_INICIALES
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")

    console.log("primnero:");

    const fetchEntradas = useCallback(async () => {
        // Datos hardcodeados — no llama al backend
        //await apiClient.getMesaEntradas(); // consulta de mesa de entrada
        const resp = await apiClient.getMesaEntradas();
        console.log("holas:");
        setLoading(true)
        setError(null)
        return resp;
    }, [])

    // async function fetchEntradas(
    //  callback?: (data: MesaEntradasListResponse) => void
    //     ): Promise<MesaEntradasListResponse> {
    //     const resp = await apiClient.getMesaEntradas();

    //     console.log("hola:", resp.entradas);
    //     setLoading(true)
    //     setError(null)

    //      if (callback) {
    //       callback(resp);
    //      }

    //     return resp;
    //     }

    const createEntrada = useCallback(async (data: any) => {
        const nueva: MesaEntradaResponse = {
            id: nextId++,
            fecha: data.fecha,
            procedencia: data.procedencia,
            remitente: data.remitente,
            juzgado: data.juzgado || undefined,
            fiscalia: data.fiscalia || undefined,
            descripcion: data.descripcion,
            nro_causa: data.nro_causa,
            obs: data.obs || undefined,
            fecha_creacion: new Date().toISOString(),
        }
        setEntradas((prev) => [nueva, ...prev])
        toast.success("Entrada creada exitosamente")
        return nueva
    }, [])

    

    const deleteEntrada = useCallback(async (id: number) => {
        setEntradas((prev) => prev.filter((e) => e.id !== id))
        toast.success("Entrada eliminada exitosamente")
    }, [])

    return {
        entradas,
        loading,
        error,
        search,
        setSearch,
        fetchEntradas,
        createEntrada,
        deleteEntrada,
    }
}
