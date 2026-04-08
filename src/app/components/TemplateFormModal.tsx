'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { templatesApi } from '@/lib/api';
import { AdminTemplate, TemplateField } from '@/types/template';
import axios from 'axios';

const emptyField = (): TemplateField => ({
    key: '', label: '', type: 'text', placeholder: '', required: false,
});

interface TemplateFormModalProps {
    editingTemplate: AdminTemplate | null;
    onSave: (saved: AdminTemplate) => void;
    onClose: () => void;
}

export default function TemplateFormModal({ editingTemplate, onSave, onClose }: TemplateFormModalProps) {
    const [form, setForm] = useState(() => ({
        name: editingTemplate?.name ?? '',
        description: editingTemplate?.description ?? '',
        systemPrompt: editingTemplate?.systemPrompt ?? '',
        fields: editingTemplate?.fields.length ? editingTemplate.fields : [emptyField()],
        file: null as File | null,
    }));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateField = (i: number, key: keyof TemplateField, val: string | boolean) => {
        setForm(f => ({
            ...f,
            fields: f.fields.map((field, idx) => idx === i ? { ...field, [key]: val } : field),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('systemPrompt', form.systemPrompt);
            formData.append('fields', JSON.stringify(form.fields));
            if (form.file) formData.append('file', form.file);

            const res = editingTemplate
                ? await templatesApi.update(editingTemplate.id, formData)
                : await templatesApi.create(formData);

            onSave(res.data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to save template');
            } else {
                setError('Failed to save template');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-xl font-bold mb-6">
                    {editingTemplate ? 'Edit Template' : 'New Template'}
                </h2>

                {error && (
                    <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                        <input
                            required
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <input
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">System Prompt</label>
                        <textarea
                            required
                            rows={4}
                            value={form.systemPrompt}
                            onChange={e => setForm(f => ({ ...f, systemPrompt: e.target.value }))}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Shell DOCX{' '}
                            {editingTemplate && <span className="text-slate-400">(leave blank to keep existing)</span>}
                        </label>
                        <input
                            type="file"
                            accept=".docx"
                            required={!editingTemplate}
                            onChange={e => setForm(f => ({ ...f, file: e.target.files?.[0] ?? null }))}
                            className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    {/* Dynamic fields */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-slate-700">Form Fields</label>
                            <button
                                type="button"
                                onClick={() => setForm(f => ({ ...f, fields: [...f.fields, emptyField()] }))}
                                className="text-blue-600 text-sm hover:underline"
                            >
                                + Add field
                            </button>
                        </div>
                        <div className="space-y-3">
                            {form.fields.map((field, i) => (
                                <div key={i} className="border rounded-lg p-3 space-y-2 bg-slate-50">
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            placeholder="Key (e.g. employeeName)"
                                            value={field.key}
                                            onChange={e => updateField(i, 'key', e.target.value)}
                                            className="border rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-400"
                                        />
                                        <input
                                            placeholder="Label (e.g. Employee Full Name)"
                                            value={field.label}
                                            onChange={e => updateField(i, 'label', e.target.value)}
                                            className="border rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-400"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 items-center">
                                        <select
                                            value={field.type}
                                            onChange={e => updateField(i, 'type', e.target.value)}
                                            className="border rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-400"
                                        >
                                            <option value="text">Text</option>
                                            <option value="date">Date</option>
                                            <option value="number">Number</option>
                                        </select>
                                        <input
                                            placeholder="Placeholder"
                                            value={field.placeholder}
                                            onChange={e => updateField(i, 'placeholder', e.target.value)}
                                            className="border rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-400"
                                        />
                                        <label className="flex items-center gap-2 text-sm text-slate-600">
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={e => updateField(i, 'required', e.target.checked)}
                                            />
                                            Required
                                        </label>
                                    </div>
                                    {form.fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setForm(f => ({
                                                ...f,
                                                fields: f.fields.filter((_, idx) => idx !== i),
                                            }))}
                                            className="text-red-500 text-xs hover:underline"
                                        >
                                            Remove field
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:text-slate-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving && <Loader2 size={14} className="animate-spin" />}
                            {editingTemplate ? 'Save Changes' : 'Create Template'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
