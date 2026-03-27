"use client";
import { useRouter } from 'next/navigation';
import DocumentRequestForm from '@/components/DocumentRequestForm';
import axios from "axios";
import { useState } from "react";
import {documentsApi} from "@/lib/api";

export default function GeneratePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleFormSubmit = async (formData: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await documentsApi.generate(formData);
            router.push(`/documents/${response.data.jobId}`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Generation failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="container mx-auto py-10 px-4">
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}
            <DocumentRequestForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </main>
    );
}