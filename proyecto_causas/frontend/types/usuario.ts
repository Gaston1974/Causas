export interface Usuario {
  // Campos requeridos (NO NULL)
  first_name: string;
  last_name: string;
  clave: string;
  rol: 'administrador' | 'normal';

  // Campos únicos (evitar duplicados)
  email: string;
  dni: string;

  // Campos opcionales útiles / Mapeados
  username?: string;
  ce?: string; // Codigo Estadístico
  grado?: string;
  nombre_completo?: string;
}

// Payload específico si se requiere una estructura diferente al enviar
// En este caso, coincide con Usuario pero aseguramos que los opcionales estén presentes si la lógica de negocio lo requiere
export interface CreateUserPayload extends Usuario { }
