'use client';

import { useState } from 'react';
import { Usuario } from '@/types/usuario';
import { crearUsuario } from '@/lib/services/usuarioService';
import { User, Mail, Lock, BadgeCheck, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function CreateUserForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dni: '',
        grado: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // 1. Prepare data strictly Typed
            const newUser: Usuario = {
                // Required Fields
                first_name: formData.firstName,
                last_name: formData.lastName,
                clave: formData.password,
                rol: 'normal', // Default as per rules

                // Unique Fields (derived)
                email: `${formData.dni}@policia.gob.ar`,
                dni: formData.dni,

                // Optional/Mapped Fields
                username: formData.dni,
                ce: formData.dni,
                grado: formData.grado,
                nombre_completo: `${formData.firstName} ${formData.lastName}`,
            };

            // 2. Call Service
            await crearUsuario(newUser);

            // 3. Handle Success
            setMessage({ type: 'success', text: '✅ Usuario creado correctamente' });
            setFormData({
                firstName: '',
                lastName: '',
                dni: '',
                grado: '',
                password: '',
            });
        } catch (error: any) {
            // 4. Handle Error
            const errorMsg = error.message ? JSON.parse(error.message).message : 'Error desconocido';
            setMessage({ type: 'error', text: `❌ Error: ${errorMsg}` });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                Crear Nuevo Usuario
            </h2>

            {message && (
                <div className={`p-4 mb-6 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Nombre</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Juan"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Apellido</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Pérez"
                            />
                        </div>
                    </div>
                </div>

                {/* DNI / CE */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">CE / DNI</label>
                    <div className="relative">
                        <BadgeCheck className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                            name="dni"
                            required
                            pattern="[0-9]{4,15}"
                            title="Solo números (4-15 dígitos)"
                            value={formData.dni}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="123456"
                        />
                    </div>
                </div>

                {/* Grado */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Grado</label>
                    <div className="relative">
                        <BadgeCheck className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                            name="grado"
                            required
                            value={formData.grado}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Oficial"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Contraseña</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="******"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creando...
                        </>
                    ) : (
                        'Crear Usuario'
                    )}
                </button>
            </form>
        </div>
    );
}
