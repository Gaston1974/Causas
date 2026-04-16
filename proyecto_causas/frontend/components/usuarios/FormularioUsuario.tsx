'use client';

import { useState } from 'react';
import { Usuario } from '@/types/usuario';
import { crearUsuario } from '@/lib/services/usuarios';
import { User, Lock, BadgeCheck, Loader2, AlertCircle, CheckCircle, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FormularioUsuario() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dni: '',
        grado: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);

        try {
            // Construir payload asegurando tipos
            const newUser: Usuario = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                clave: formData.password,
                rol: 'normal',

                // Lógica de autogeneración definida en requisitos
                email: `${formData.dni}@policia.gob.ar`,
                dni: formData.dni,

                // Mapeos adicionales
                username: formData.dni,
                ce: formData.dni,
                grado: formData.grado,
                nombre_completo: `${formData.firstName} ${formData.lastName}`
            };

            await crearUsuario(newUser);

            setStatus({ type: 'success', message: '✅ Usuario creado correctamente' });

            // Redirect after success
            router.push('/usuarios');
            router.refresh();

            // Reset form on success
            setFormData({
                firstName: '',
                lastName: '',
                dni: '',
                grado: '',
                password: '',
            });
        } catch (error: any) {
            setStatus({ type: 'error', message: `❌ ${error.message}` });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-slate-900 p-8 rounded-xl shadow-2xl border border-slate-800 text-slate-200">
            <div className="mb-8 border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <User className="w-8 h-8 text-blue-500" />
                    Nuevo Usuario
                </h2>
                <p className="text-slate-400 mt-1">Complete los datos obligatorios para registrar un nuevo usuario en el sistema.</p>
            </div>

            {status && (
                <div className={`p-4 mb-6 rounded-lg flex items-start gap-3 border ${status.type === 'success'
                    ? 'bg-green-900/20 border-green-800 text-green-400'
                    : 'bg-red-900/20 border-red-800 text-red-400'
                    }`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" /> : <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />}
                    <div>
                        <p className="font-semibold">{status.type === 'success' ? 'Éxito' : 'Error'}</p>
                        <p className="text-sm opacity-90">{status.message}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium text-slate-300">Nombre <span className="text-red-500">*</span></label>
                        <div className="relative group">
                            <User className="absolute left-3 top-3 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                id="firstName"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                                placeholder="Ej: Juan"
                            />
                        </div>
                    </div>

                    {/* Apellido */}
                    <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium text-slate-300">Apellido <span className="text-red-500">*</span></label>
                        <div className="relative group">
                            <User className="absolute left-3 top-3 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                id="lastName"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                                placeholder="Ej: Pérez"
                            />
                        </div>
                    </div>

                    {/* DNI / CE */}
                    <div className="space-y-2">
                        <label htmlFor="dni" className="text-sm font-medium text-slate-300">DNI / CE <span className="text-red-500">*</span></label>
                        <div className="relative group">
                            <BadgeCheck className="absolute left-3 top-3 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                id="dni"
                                name="dni"
                                required
                                pattern="[0-9]{4,15}"
                                title="Solo números"
                                value={formData.dni}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                                placeholder="Ej: 12345678"
                            />
                        </div>
                        <p className="text-xs text-slate-500">Se utilizará como nombre de usuario</p>
                    </div>

                    {/* Grado */}
                    <div className="space-y-2">
                        <label htmlFor="grado" className="text-sm font-medium text-slate-300">Grado</label>
                        <div className="relative group">
                            <BadgeCheck className="absolute left-3 top-3 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                id="grado"
                                name="grado"
                                value={formData.grado}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                                placeholder="Ej: Oficial Principal"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2 md:col-span-2">
                        <label htmlFor="password" className="text-sm font-medium text-slate-300">Contraseña <span className="text-red-500">*</span></label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Crear Usuario
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
