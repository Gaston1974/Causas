'use client';

import { useEffect, useState } from 'react';
import { obtenerUsuarios } from '@/lib/services/usuarios';
import { Usuario } from '@/types/usuario';
import { Loader2, AlertCircle, Pencil, Trash2, UserX } from 'lucide-react';

export default function TablaUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsuarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await obtenerUsuarios();
            setUsuarios(data);
        } catch (err: any) {
            setError(err.message || 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
                <p>Cargando usuarios...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-red-900/10 border border-red-800/50 rounded-xl text-red-400">
                <AlertCircle className="w-10 h-10 mb-3" />
                <p className="font-medium mb-4">{error}</p>
                <button
                    onClick={fetchUsuarios}
                    className="px-4 py-2 bg-red-800/20 hover:bg-red-800/30 border border-red-800/50 rounded-lg transition-colors text-sm"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    if (usuarios.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-slate-900/50 rounded-xl border border-slate-800">
                <UserX className="w-12 h-12 mb-3 opacity-50" />
                <p>No se encontraron usuarios registrados.</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden rounded-xl border border-slate-800 shadow-xl bg-slate-900">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-semibold tracking-wider border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">DNI / CE</th>
                            <th className="px-6 py-4">Grado</th>
                            <th className="px-6 py-4">Rol</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {usuarios.map((user) => (
                            <tr key={user.ce || user.dni || Math.random()} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 font-bold border border-blue-800/50">
                                            {user.first_name?.[0]}{user.last_name?.[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-200">{user.nombre_completo || `${user.first_name} ${user.last_name}`}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-400">
                                    {user.dni || user.ce || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                        {user.grado || '-'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.rol === 'administrador' ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/30 text-purple-400 border border-purple-800/50">
                                            Admin
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50">
                                            Usuario
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors" title="Editar">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors" title="Eliminar">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
