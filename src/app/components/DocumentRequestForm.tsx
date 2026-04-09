"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TemplateDefinition } from '@/types/template';
import { GenerateFormData } from '@/types/api';
import { templatesApi } from "@/lib/api";
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { Alert } from '@/components/ui/Alert';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Sparkles } from 'lucide-react';

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
        return <Alert variant="error">{fetchError}</Alert>;
    }

    return (
        <Card padding="lg" className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>
                    <span className="flex items-center gap-2">
                        <Sparkles size={18} className="text-indigo-600" />
                        Create Document
                    </span>
                </CardTitle>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="Template" id="template-select">
                        <Select id="template-select" onChange={handleTemplateChange}>
                            {templates.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </Select>
                        {selectedTemplate?.description && (
                            <p className="mt-1 text-xs text-slate-500">{selectedTemplate.description}</p>
                        )}
                    </FormField>

                    <FormField label="Output Format" id="format-select">
                        <Select id="format-select" {...register('format')}>
                            <option value="PDF">PDF</option>
                            <option value="DOCX">Word (DOCX)</option>
                        </Select>
                    </FormField>
                </div>

                {selectedTemplate?.fields && selectedTemplate.fields.length > 0 && (
                    <>
                        <div className="border-t border-slate-100" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {selectedTemplate.fields.map(field => (
                                <FormField
                                    key={field.key}
                                    label={field.label}
                                    id={`field-${field.key}`}
                                    required={field.required}
                                    className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                                >
                                    {field.type === 'textarea' ? (
                                        <Textarea
                                            id={`field-${field.key}`}
                                            {...register(`data.${field.key}`, { required: field.required })}
                                            placeholder={field.placeholder}
                                            rows={4}
                                            aria-required={field.required}
                                        />
                                    ) : (
                                        <Input
                                            id={`field-${field.key}`}
                                            type={field.type}
                                            {...register(`data.${field.key}`, { required: field.required })}
                                            placeholder={field.placeholder}
                                            aria-required={field.required}
                                        />
                                    )}
                                </FormField>
                            ))}
                        </div>
                    </>
                )}

                <Button
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading || templates.length === 0}
                    size="lg"
                    className="w-full"
                >
                    <Sparkles size={16} />
                    {isLoading ? 'Communicating with AI…' : 'Generate Draft'}
                </Button>
            </form>
        </Card>
    );
}
