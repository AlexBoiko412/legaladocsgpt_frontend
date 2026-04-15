'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Pencil, Loader2 } from 'lucide-react';
import { templatesApi } from '@/lib/api';
import { AdminTemplate } from '@/types/template';
import { Roles } from '@/lib/constants';
import TemplateFormModal from '@/components/TemplateFormModal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { PageSpinner } from '@/components/ui/Spinner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function AdminTemplatesPage() {
    const { user, loading } = useUser();
    const router = useRouter();
    const [templates, setTemplates] = useState<AdminTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingTemplate, setEditingTemplate] = useState<AdminTemplate | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

    const openCreate = () => { setEditingTemplate(null); setShowForm(true); };
    const openEdit   = (t: AdminTemplate) => { setEditingTemplate(t); setShowForm(true); };
    const closeForm  = () => { setShowForm(false); setEditingTemplate(null); };

    if (loading || !user) return null;

    return (
        <main className="mx-auto max-w-5xl px-4 py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Template Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Admin only - manage document templates</p>
                </div>
                <Button onClick={openCreate}>
                    <Plus size={16} /> New Template
                </Button>
            </div>

            {error && <Alert className="mb-6">{error}</Alert>}

            {isLoading ? (
                <PageSpinner label="Loading templates…" />
            ) : (
                <div className="space-y-3">
                    {templates.map(t => (
                        <div key={t.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm flex justify-between items-start gap-4 hover:shadow-md transition-shadow">
                            <div className="min-w-0">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">{t.name}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{t.description}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-1">{t.docxPath}</p>
                                {t.fields.length > 0 && (
                                    <div className="flex gap-1.5 mt-2 flex-wrap">
                                        {t.fields.map(f => (
                                            <span key={f.key} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded-md">
                                                {f.label}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-1 shrink-0">
                                <button
                                    onClick={() => openEdit(t)}
                                    aria-label={`Edit template: ${t.name}`}
                                    className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors"
                                >
                                    <Pencil size={15} />
                                </button>
                                <button
                                    onClick={() => setConfirmDeleteId(t.id)}
                                    disabled={deleting === t.id}
                                    aria-label={`Delete template: ${t.name}`}
                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 rounded-lg disabled:opacity-40 transition-colors"
                                >
                                    {deleting === t.id
                                        ? <Loader2 size={15} className="animate-spin" />
                                        : <Trash2 size={15} />}
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

            {confirmDeleteId && (
                <ConfirmModal
                    title="Delete Template?"
                    description="This will permanently delete the template and its file. This action cannot be undone."
                    confirmLabel="Delete"
                    onConfirm={() => { handleDelete(confirmDeleteId); setConfirmDeleteId(null); }}
                    onCancel={() => setConfirmDeleteId(null)}
                    loading={deleting === confirmDeleteId}
                />
            )}
        </main>
    );
}
