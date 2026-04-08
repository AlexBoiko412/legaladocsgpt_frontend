"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TemplateDefinition } from '@/types/template';
import { GenerateFormData } from '@/types/api';
import { templatesApi } from "@/lib/api";
import { AlertCircle } from 'lucide-react';

interface DocumentRequestFormProps {
    onSubmit: (data: GenerateFormData) => void;
    isLoading: boolean;
}

export default function DocumentRequestForm({ onSubmit, isLoading }: DocumentRequestFormProps) {
    const [templates, setTemplates] = useState<TemplateDefinition[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateDefinition | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const { register, handleSubmit, reset, setValue } = useForm<GenerateFormData>();

    useEffect(() => {
        templatesApi.getAll()
            .then(res => {
                setTemplates(res.data);
                if (res.data.length > 0) {
                    setSelectedTemplate(res.data[0]);
                    setValue('templateId', res.data[0].id);
                }
            })
            .catch(() => setFetchError('Failed to load templates. Please refresh the page.'));
    }, [setValue]);

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const template = templates.find(t => t.id === e.target.value) ?? null;
        setSelectedTemplate(template);
        setValue('templateId', e.target.value);
        reset({ templateId: e.target.value, format: 'PDF' });
    };

    if (fetchError) {
        return (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle size={16} />
                {fetchError}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border">
            <h2 className="text-xl font-bold border-b pb-4">Create Document</h2>

            <div className="flex flex-col gap-2">
                <label htmlFor="template-select" className="font-semibold text-slate-700">Choose a Template</label>
                <select
                    id="template-select"
                    onChange={handleTemplateChange}
                    className="p-2 border rounded bg-slate-50"
                >
                    {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
                {selectedTemplate?.description && (
                    <p className="text-xs text-slate-500">{selectedTemplate.description}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="format-select" className="font-semibold text-slate-700">Format</label>
                <select id="format-select" {...register("format")} className="p-2 border rounded">
                    <option value="PDF">PDF</option>
                    <option value="DOCX">Word (DOCX)</option>
                </select>
            </div>

            <hr />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTemplate?.fields.map(field => (
                    <div
                        key={field.key}
                        className={`flex flex-col gap-1 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}
                    >
                        <label htmlFor={`field-${field.key}`} className="text-sm font-medium text-slate-600">
                            {field.label} {field.required && <span className="text-red-500" aria-hidden="true">*</span>}
                        </label>

                        {field.type === 'textarea' ? (
                            <textarea
                                id={`field-${field.key}`}
                                {...register(`data.${field.key}`, { required: field.required })}
                                placeholder={field.placeholder}
                                rows={4}
                                className="p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                aria-required={field.required}
                            />
                        ) : (
                            <input
                                id={`field-${field.key}`}
                                type={field.type}
                                {...register(`data.${field.key}`, { required: field.required })}
                                placeholder={field.placeholder}
                                className="p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                aria-required={field.required}
                            />
                        )}
                    </div>
                ))}
            </div>

            <button
                type="submit"
                disabled={isLoading || templates.length === 0}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 disabled:bg-slate-300 transition-colors"
            >
                {isLoading ? 'Communicating with AI...' : 'Generate Draft'}
            </button>
        </form>
    );
}
