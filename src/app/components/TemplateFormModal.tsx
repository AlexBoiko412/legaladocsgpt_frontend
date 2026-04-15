'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { templatesApi } from '@/lib/api';
import { AdminTemplate, TemplateField } from '@/types/template';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { Alert } from '@/components/ui/Alert';

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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {editingTemplate ? 'Edit Template' : 'New Template'}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && <Alert variant="error">{error}</Alert>}

                    <FormField label="Name" id="tmpl-name" required>
                        <Input
                            id="tmpl-name"
                            required
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="e.g. Employment Contract"
                        />
                    </FormField>

                    <FormField label="Description" id="tmpl-desc">
                        <Input
                            id="tmpl-desc"
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Brief description shown to users"
                        />
                    </FormField>

                    <FormField label="System Prompt" id="tmpl-prompt" required>
                        <Textarea
                            id="tmpl-prompt"
                            required
                            rows={4}
                            value={form.systemPrompt}
                            onChange={e => setForm(f => ({ ...f, systemPrompt: e.target.value }))}
                            placeholder="Instructions for the AI…"
                        />
                    </FormField>

                    <FormField
                        label="Shell DOCX"
                        id="tmpl-file"
                        hint={editingTemplate ? 'Leave blank to keep the existing file.' : undefined}
                        required={!editingTemplate}
                    >
                        <input
                            id="tmpl-file"
                            type="file"
                            accept=".docx"
                            required={!editingTemplate}
                            onChange={e => setForm(f => ({ ...f, file: e.target.files?.[0] ?? null }))}
                            className="w-full text-sm text-slate-600 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400 transition-colors"
                        />
                    </FormField>

                    {/* Dynamic fields */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Form Fields</label>
                            <button
                                type="button"
                                onClick={() => setForm(f => ({ ...f, fields: [...f.fields, emptyField()] }))}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                + Add field
                            </button>
                        </div>
                        <div className="space-y-3">
                            {form.fields.map((field, i) => (
                                <div key={i} className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 space-y-3 bg-slate-50 dark:bg-slate-700/40">
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            placeholder="Key (e.g. employeeName)"
                                            value={field.key}
                                            onChange={e => updateField(i, 'key', e.target.value)}
                                        />
                                        <Input
                                            placeholder="Label (e.g. Employee Name)"
                                            value={field.label}
                                            onChange={e => updateField(i, 'label', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 items-center">
                                        <Select
                                            value={field.type}
                                            onChange={e => updateField(i, 'type', e.target.value)}
                                        >
                                            <option value="text">Text</option>
                                            <option value="date">Date</option>
                                            <option value="number">Number</option>
                                        </Select>
                                        <Input
                                            placeholder="Placeholder"
                                            value={field.placeholder}
                                            onChange={e => updateField(i, 'placeholder', e.target.value)}
                                        />
                                        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={e => updateField(i, 'required', e.target.checked)}
                                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
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
                                            className="text-xs text-red-500 hover:text-red-700"
                                        >
                                            Remove field
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={saving}>
                            {editingTemplate ? 'Save Changes' : 'Create Template'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
