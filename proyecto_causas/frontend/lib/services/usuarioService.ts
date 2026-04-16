import { Usuario } from '@/types/usuario';

const BASE_URL = 'http://10.50.22.142:8080/v1';

export async function crearUsuario(data: Usuario): Promise<any> {
    try {
        const response = await fetch(`${BASE_URL}/altas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.text();
            let parsedError;
            try {
                parsedError = JSON.parse(errorData);
            } catch {
                parsedError = errorData;
            }
            throw new Error(
                JSON.stringify({
                    status: response.status,
                    message: parsedError
                })
            );
        }

        // Attempt to parse JSON, fallback to text if empty or invalid
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return { message: 'Usuario creado con éxito', raw: text };
        }
    } catch (error) {
        console.error('Error en crearUsuario:', error);
        throw error;
    }
}
