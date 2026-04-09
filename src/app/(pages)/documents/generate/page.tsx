"use client";

import { useRouter } from 'next/navigation';
import { useState } from "react";
import axios from 'axios';
import DocumentRequestForm from '@/components/DocumentRequestForm';
import { documentsApi } from "@/lib/api";
import { GenerateFormData } from '@/types/api';
import { Alert } from '@/components/ui/Alert';

export default function GeneratePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleFormSubmit = async (formData: GenerateFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await documentsApi.generate(formData);
            router.push(`/documents/${response.data.jobId}`);
        } catch (err: unknown) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message || 'Generation failed. Please try again.'
                : 'Generation failed. Please try again.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="mx-auto max-w-4xl px-4 py-10">
            {error && <Alert className="mb-6">{error}</Alert>}
            <DocumentRequestForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </main>
    );
}
