'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Pencil, Loader2, AlertCircle } from 'lucide-react';
import { templatesApi } from '@/lib/api';
import { AdminTemplate } from '@/types/template';
import { Roles } from '@/lib/constants';
import TemplateFormModal from '@/components/TemplateFormModal';

export default function AdminTemplatesPage() {
    const { user, loading } = useUser();
    const router = useRouter();
    const [templates, setTemplates] = useState<AdminTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingTemplate, setEditingTemplate] = useState<AdminTemplate | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && (!user || user.role !== Roles.ADMIN)) {
            router.replace('/');
        }
    }, [user, loading, router]);

    useEffect(() => {
        templatesApi.getAll()
            .then(r => setTemplates(r.data))
            .catch(() => setError('Failed to load templates'))
            .finally(() => setIsLoading(false));
    }, []);

    const handleSaved = (saved: AdminTemplate) => {
        setTemplates(prev => {
            const exists = prev.some(t => t.id === saved.id);
            return exists ? prev.map(t => t.id === saved.id ? saved : t) : [...prev, saved];
        });
        setShowForm(false);
        setEditingTemplate(null);
    };

    const handleDelete = async (id: string) => {
        setDeleting(id);
        try {
            await templatesApi.delete(id);
            setTemplates(prev => prev.filter(t => t.id !== id));
        } catch {
            setError('Failed to delete template');
        } finally {
            setDeleting(null);
        }
    };

    const openCreate = () => {
        setEditingTemplate(null);
        setShowForm(true);
    };

    const openEdit = (t: AdminTemplate) => {
        setEditingTemplate(t);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingTemplate(null);
    };

    if (loading || !user) return null;

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Template Management</h1>
                    <p className="text-slate-500 mt-1">Admin only — manage document templates</p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold"
                >
                    <Plus size={18} /> New Template
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
            ) : (
                <div className="space-y-4">
                    {templates.map(t => (
                        <div key={t.id} className="bg-white border rounded-xl p-5 shadow-sm flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-slate-800">{t.name}</h3>
                                <p className="text-slate-500 text-sm mt-1">{t.description}</p>
                                <p className="text-xs text-slate-400 font-mono mt-1">{t.docxPath}</p>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {t.fields.map(f => (
                                        <span key={f.key} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded">
                                            {f.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0 ml-4">
                                <button
                                    onClick={() => openEdit(t)}
                                    aria-label={`Edit template: ${t.name}`}
                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(t.id)}
                                    disabled={deleting === t.id}
                                    aria-label={`Delete template: ${t.name}`}
                                    className="p-2 hover:bg-red-50 text-red-500 rounded disabled:opacity-50"
                                >
                                    {deleting === t.id
                                        ? <Loader2 size={16} className="animate-spin" />
                                        : <Trash2 size={16} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <TemplateFormModal
                    editingTemplate={editingTemplate}
                    onSave={handleSaved}
                    onClose={closeForm}
                />
            )}
        </main>
    );
}
