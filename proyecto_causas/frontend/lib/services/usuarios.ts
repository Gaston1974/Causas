import { CreateUserPayload, Usuario } from '@/types/usuario';

const BASE_URL = 'http://10.50.22.142:8080/v1';

/**
 * Crea un nuevo usuario en el sistema.
 * @param data Datos del usuario a crear.
 * @returns Respuesta del servidor.
 * @throws Error con mensaje del backend si la respuesta no es ok.
 */
export async function crearUsuario(data: CreateUserPayload): Promise<any> {
    // Obtener token (asumiendo localStorage como indicó la tarea)
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('No autorizado: No se encontró token de sesión');
    }

    try {
        const response = await fetch(`${BASE_URL}/altas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Intentar leer el error del backend
            const errorText = await response.text();
            let errorMessage = `Error ${response.status}: ${response.statusText}`;

            try {
                const errorJson = JSON.parse(errorText);
                // Ajustar esto según la estructura real de error del backend si es conocida
                errorMessage = errorJson.message || errorJson.error || JSON.stringify(errorJson);
            } catch {
                errorMessage = errorText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        // Retornar JSON si es posible, sino texto
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return { message: 'Operación exitosa', raw: text };
        }
    } catch (error) {
        console.error('Error en crearUsuario service:', error);
        throw error;
    }
}

/**
 * Obtiene la lista de usuarios del sistema.
 * @returns Array de usuarios.
 * @throws Error si falla la petición o no hay autorización.
 */
export async function obtenerUsuarios(): Promise<Usuario[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('No autorizado: No se encontró token de sesión');
    }

    try {
        // SEGÚN ENDPOINTS.md: POST /usuarios con body opcional para filtros
        const response = await fetch(`${BASE_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({}), // Body vacío para traer todos
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Sesión expirada o inválida');
            }
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        // El backend puede devolver { usuarios: [], total: N } o directamente []
        // Ajustamos según la estructura común
        if (Array.isArray(data)) {
            return data;
        } else if (data.usuarios && Array.isArray(data.usuarios)) {
            return data.usuarios;
        } else {
            console.warn('Formato de respuesta inesperado en obtenerUsuarios:', data);
            return [];
        }
    } catch (error) {
        console.error('Error en obtenerUsuarios service:', error);
        throw error;
    }
}
